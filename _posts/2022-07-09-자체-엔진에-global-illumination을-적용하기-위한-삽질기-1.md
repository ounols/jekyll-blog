---
title: 자체 엔진에 Global Illumination 를 적용하기 위한 삽질기 1
categories:
- 자체 게임 엔진 프로젝트
- Dev
tags:
- dev
- Coding
- OpenGL
- graphics
description: 예전에 구현을 시도했으나 실패로 돌아갔던 글로벌 일루미네이션 삽질기의 첫번째 도전을 블로그에 남깁니다.
image:
  path: "/media/2022-07-09-global-illumination-1/figure-1.png"
---

요즘 바쁘다보니 자체 엔진을 개발할 시간이 별로 없었네요...ㅠ
어쨌든 최근 진행하던 개발은 '자체엔진에 GI를 넣어보자!'입니다.
아직까진 마땅한 해결책을 찾지 못해서 아마 이 삽질기는 계속 연재될 것 같네요...ㅋㅋ

먼저 글로벌 일루미네이션, 대충 줄여서 GI는 주변 색상에 따라 빛을 계산하는 기법 중 하나입니다.
...사실 어디까지 빛을 계산할지랑 어디까지 영향을 줄지는 천차만별이지만 어쨌든 이렇습니다ㅎㅎ

일단 제가 원하는 GI는 다음과 같습니다.

* 디퓨즈 간접광의 구현
* RTX 이외의 GPU 하드웨어에서도 구현 가능
* OpenGL에서의 구현
* 조명에 따라 GI의 영향도 변화하는 동적인 형태

이런 필수사항(?)을 생각하고 가장 먼저 라이트 프로브의 실시간 렌더링을 먼저 생각하게 됐습니다.


## 첫 도전: Dynamic Light Probe Group

![](/media/2022-07-09-global-illumination-1/figure-1.png)


첫 도전은 유니티의 라이트 프로브 그룹을 실시간으로 찍어내는 형태입니다.
물론 실패로 돌아갔지만 어떻게든 최적화 해보고자 노력을 했던 삽질내용을 적으려고 합니다.

먼저 유니티의 라이트 프로브 그룹의 특징은 다음과 같습니다.
* 포워드 렌더링인 URP에서 작동
* 픽셀 기준으로 색상 적용이 아닌 오브젝트 하나 기준의 색상으로 적용
(크기가 큰 오브젝트는 단 하나의 색상으로만 디퓨즈로 적용 됨)
* 미리 구워진 라이트 맵을 이용, 하나의 노드엔 하나의 색상값만 있는 것으로 파악

여기서 저는 픽셀 기준으로 색상이 적용되지 않는 점에서 여기만큼은
그려지는 픽셀의 위치엔 그에 알맞는 색상값을 넣고 싶은 생각으로 만들기 시작했습니다.

<br>

그렇게 제가 생각하던 구현방식은 다음과 같습니다.

#### 1. 노드를 일정한 간격으로 놓습니다
![](/media/2022-07-09-global-illumination-1/figure-2.png)

일단 단순하게 위치값만 가지고 있는 노드들로 구성합니다.


#### 2. 각 노드마다 2개의 카메라를 둡니다
![](/media/2022-07-09-global-illumination-1/figure-3.png)

각 노드들에 원래 큐브맵 형태로 6번을 그릴 생각이였지만
정확한 텍스쳐가 아닌 전체적인 평균색상값만 있으면 되기 때문에

거의 180도에 가깝게 그려내도록 Look행렬을 특수하게 지정해서 2번만 그리도록 합니다.
실제로 렌더링하면 원하는 각도만큼 렌더링 되지만
왜곡이 심해서 어느정도 색상값을 보정할 필요가 있어 보입니다.

<br>

어쨌든 지금까지의 진행 단계를 구현한 엔진 내부의 코드는 다음과 같습니다.

```cpp
const auto& transform = gameObject->GetTransform();
m_pivot = &transform->m_position;
m_scale = &transform->m_scale;
m_nodeOffset = vec3{ m_scale->x / m_nodeCount.x, 
m_scale->y / m_nodeCount.y, 
m_scale->z / m_nodeCount.z };
m_size = m_nodeCount;

m_cameraMatrixStruct = new CameraMatrixStruct(
mat4::Identity(), mat4::Perspective(160.0f, 1.0f, 0.01f, 10.0f),vec3{0, 0, 0});
m_frontCamera = mat4::LookAt(vec3{0, 0, 0}, vec3{1, 0, 0}, vec3{0, 1, 0});
m_backCamera = mat4::LookAt(vec3{0, 0, 0}, vec3{-1, 0, 0}, vec3{0, 1, 0});

GenerateCameraNodeList();
```
위 코드는 노드의 일정 길이의 오프셋을 지정하고 카메라를 앞뒤로 준비합니다.

```cpp
void LightProbeGroupComponent::GenerateCameraNodeList() {
    unsigned int size = m_size.x * m_size.y * m_size.z;
    m_nodes.reserve(size);
    m_renderSnap = size / 60.f;

    for(unsigned short x = 0; x < m_size.x; ++x) {
        const unsigned short u_offset = x * PER_WIDTH * 2;
        const float x_offset = x * m_nodeOffset.x;

        for (unsigned short y = 0; y < m_size.y; ++y) {
            const unsigned short h_offset = y * m_size.y * PER_WIDTH;
            const float y_offset = y * m_nodeOffset.y;

            for (unsigned short z = 0; z < m_size.z; ++z) {
                const unsigned short v_offset = h_offset + z * PER_WIDTH;
                const float z_offset = z * m_nodeOffset.z;

                auto* node = new LightProbeCameraNode();
                node->position = vec3{ x_offset, y_offset, z_offset };
                node->uv = Vector2<unsigned short>{ v_offset, u_offset };
                m_nodes.push_back(node);
            }
        }
    }
}
```
해당 라이트 프로브 그룹 컴포넌트에서 노드마다
클립 공간 내 좌표값, 라이트 맵에서의 uv값을 가지고 
특정 프레임을 기준으로 영역을 잡아서 저장합니다.


#### 3. 일정 프레임 수 기준으로 프레임마다 렌더링 할 노드를 지정합니다
![](/media/2022-07-09-global-illumination-1/figure-4.png)

최대한 일정한 드로우콜을 호출하기 위해선 일정 프레임 수를 기준으로
안정적인 렌더링이 되도록 파악하며 프레임 별로 렌더링할 노드들을 나눠줍니다.



#### 4. 한면 당 9x9로 렌더링 후 한 프레임버퍼에 지속적으로 색상값 입력
![](/media/2022-07-09-global-illumination-1/figure-5.png)

렌더링에 필요한 모든 준비가 끝나면 9x9로 렌더링을 진행합니다.
렌더링 되는 대상은 라이트 프로브 그룹에서 제공하는 GL_NEAREST 프레임버퍼에 값을 누적시킵니다.

```cpp
void LightProbeGroupComponent::RenderAll(unsigned int framebufferId, 
										 const std::list<SIRender*>& renderList) const {

    glBindFramebuffer(GL_FRAMEBUFFER, framebufferId);

    const unsigned int size = m_nodes.size();

    for (int i = m_renderOffset; i < size; i += m_renderSnap) {
        const auto& node = m_nodes[i];
        const auto& uv = node->uv;
        const auto& position = node->position;
        const vec3 result_position = position + *m_pivot;
        
        [...]

        glViewport(uv.x, uv.y, PER_WIDTH, PER_WIDTH);
        RenderInstances(renderList);
    }
    ++m_renderOffset;
    if(m_renderOffset >= m_renderSnap) m_renderOffset = 0;

```
위 코드는 프레임 별로 할당된 노드들을 프레임마다 순차적으로 렌더링하는 형태로 진행됩니다.

그럼 실제로 렌더링을 할 땐 렌더링 할 오브젝트의 픽셀의 위치값을 가지고 그에 알맞는 색상값을
이 라이트 맵에서 가중치를 통해 적절한 색상값 하나를 얻어오는 방식으로 구현할 생각이였습니다.

## 렌더링 결과
![](/media/2022-07-09-global-illumination-1/figure-6.png)
_기존 렌더링 화면_


![](/media/2022-07-09-global-illumination-1/figure-7.gif)
_위 방식으로 프레임 마다 그려지는 라이트 맵의 모습 (9x9로 총 1000번 렌더링)_

제 컴퓨터에선 생각보다 잘 돌아가는 것 처럼 보였습니다...ㅎㅎ
하지만 여기서 그려질 매쉬를 하나하나 추가할 때 마다 렌더링 비용은 엄청나게 늘어났었습니다...

픽셀 쉐이더의 비용은 확실하게 줄이긴 했지만
버텍스 쉐이더는 어쩔 수 없이 최적화가 힘들다는 문제였습니다.

생각보다 버텍스 쉐이더의 비용이 엄청나더군요.
매쉬 쉐이더 같은 기술이 왜 나왔는지 확실히 알 수 있는 부분이였습니다.
(물론 매쉬 쉐이더로 렌더링을 한다 하더라도 비용은 어마무시 했을 겁니다...ㅠㅜ)


<br>

그리고 생각보다 그렇게 드라마틱하게 적용된 모습은 보이지 않았습니다.

사실 게임에 사용되는 PBR은
BRDF 모델의 근사값을 각각 조도맵, 정반사맵으로 미리 렌더링해서 그럴듯하게 섞어주기 때문에 대충 조도맵을 계산한 이 라이트 맵의 색상값을 무작정 억지로 PBR에 집어넣는건 좋지 못한 방식이라 효과적으로 적용하긴 힘들다는 이유도 있습니다.

<br>

이처럼 이 방식의 GI는 대실패로 돌아갔습니다..ㅎㅎ
어쨌든 이를 통해 알게 된 대표적인 문제점은 아래와 같았습니다.

* 포워드 렌더링이 디퍼드 렌더링보다 상대적으로 비용이 훨씬 가벼운 상태
* 오브젝트가 늘어나면 $$\red{\text{라이트 프로브 노드} \times 2}$$ 만큼 비용이 늘어남
* 레거시한 버텍스 쉐이더의 렌더링 파이프라인 구조를 벗어나기 힘듬

힘드네요....ㅋㅋ

## 느낀 점

![](/media/2022-07-09-global-illumination-1/figure-8.png)

버텍스 쉐이더를 피해갈 수 없어서 그런지
이를 통해 느낀 점은 '역시 레이 트레이싱이 접목된 GI가 최고다!' 입니다.

그래서 차근차근 레이 마칭을 이용한 렌더링에 대해 입문을 진행하고 있습니다.

위 사진은 제가 레이 마칭을 통한 SDF 형식의 렌더링을 공부하면서
그냥 머릿 속에 있는 1바운스 레이트레이싱을 적용해본 이미지 입니다.

생각보다 좀 괴상한 결과물이 나왔네요...
뭔가 간단한 이론만 가지곤 정상적인 형태로 그려지지 않는
그림자 렌더링과 비슷한 빌런일 것 같습니다...

어쨌든 이제 SDF를 통한 SDFGI를 공부하고 있는 중입니다.
좀 더 공부를 하고 정리가 되면 다음 삽질기로 찾아뵙겠습니다!


> 🚀 삽질의 내용은 자체엔진 프로젝트의 `light-probe` 브랜치에서 확인하실 수 있습니다.<br>
> ⏩ [해당 브랜치의 전체 코드는 깃허브 링크에서 확인해보세요!](https://github.com/ounols/CSEngine/tree/f7d57f5c4db97941a828a164ba57fe5ea403156b){:target="_blank"}
 {: .prompt-info}
