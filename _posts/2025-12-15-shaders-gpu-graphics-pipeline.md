---
title: "[번역] Shaders - Making Software"
description: Dan Hollick의 쉐이더에 대한 많은 지식이 이 포스트 하나에 담겨있습니다.
author: Dan Hollick
date: '2025-12-15 12:00:00'
categories:
  - Dev
  - 번역
tags:
  - Shader
  - GPU
  - Graphics Pipeline
  - Vertex Shader
  - Fragment Shader
  - OpenGL
  - WebGL
  - Graphics
pin: false
math: false
mermaid: false
original_url: https://www.makingsoftware.com/chapters/shaders
image:
  path: '/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-1.webp'
---

**원본 글**: [Shaders - Making Software](https://www.makingsoftware.com/chapters/shaders){:target="_blank"} by [Dan Hollick](https://twitter.com/danhollick){:target="_blank"}

![The shader pipeline](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-1.webp)
_다양한 단계들이 어떻게 연결되어 있는지 보여주는 Shader 파이프라인_

**Shader는 제약이 어떻게 창의성을 만들어내는지 보여주는 훌륭한 예입니다.** Shader는 GPU에서 병렬로 실행되는 간단한 프로그램으로, 단 하나의 픽셀 값을 계산하는 것이 목표입니다. 그런데 각 Shader 프로그램 인스턴스가 실제로 아는 것은 단 하나, 바로 자신의 x와 y 위치입니다.

그렇다면 사람들은 도대체 어떻게 x와 y 좌표만으로 이렇게 미친 듯한 고해상도 그래픽을 만들어낼까요? 짧은 답은 수학입니다. 그리고 긴 답은, 불행히도, 역시 수학을 포함할 것입니다.

## Shader란 무엇인가?

먼저 이것부터 짚고 넘어갑시다. **Shader는 GPU에서 병렬로 실행되도록 설계된 프로그램의 한 종류입니다.**

![A mesh gradient fragment shader](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-2.webp)
_메시 그라디언트 Fragment Shader_

Shader라고 하면 아마도 몽환적인 애니메이션 그래픽을 떠올릴 것입니다. 하지만 그것들은 보통 Fragment Shader라고 하는 Shader의 한 종류일 뿐입니다. 실제로는 여러 유형의 Shader가 있으며, 이들은 주로 실시간 3D 그래픽 렌더링을 위해 설계된 일종의 파이프라인에서 함께 작동합니다.

이 파이프라인의 목표는 본질적으로 장면의 모든 픽셀이 어떤 색상이어야 하는지 알아내는 것이며, 파이프라인의 각 단계는 작은 부분을 계산한 후 다음 단계로 전달합니다. 그런데 왜 Shader가 필요할까요?

![The goal of the shader pipeline](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-3.webp)
_Shader 파이프라인의 목표는 각 픽셀의 색상을 결정하는 것_

Shader가 등장하기 전에는 개발자들이 GPU가 조명 및 기타 효과를 적용하는 방식을 세밀하게 제어할 수 없었습니다. 이를 고정 기능 파이프라인(Fixed Function Pipeline)이라고 불렀으며, 2000년대 초반 이전에는 모든 소비자용 GPU가 조명 및 렌더링 효과의 상당히 고정된 세트를 제공했습니다.

따라서 **Shader는 그래픽 파이프라인을 프로그래밍 가능하게 만들어** 개발자가 GPU에서 직접 원하는 거의 모든 효과를 만들 수 있도록 설계되었습니다. 그 이후로 Shader는 게임 엔진의 세계를 넘어 웹과 같은 곳으로 확장되었습니다.

하지만 Shader는 다소 어려울 수 있는데, GPU에서 프로그래밍하는 것이 순차적으로 진행되는 '일반적인' 프로그래밍과 조금 다르기 때문입니다.

## GPU의 작동 원리

Shader는 GPU에서 실행되기 때문에 작동 방식을 파고들기 전에 설계된 환경에 대해 조금 더 알아야 합니다.

초기 컴퓨팅 시대에는 컴퓨터에 화면이 전혀 없었습니다. 그저 출력물을 인쇄했을 뿐입니다. 따라서 GUI가 등장했을 때 화면에 표시되는 픽셀 값을 업데이트하는 CPU에 엄청난 수요가 추가되었습니다.

화면을 업데이트하는 것은 CPU에게 성가신 작업입니다. 픽셀이 어떤 색상이어야 하는지 파악하는 것은 특별히 어렵지 않지만, 픽셀이 엄청나게 많고 자주 업데이트해야 합니다. CPU는 거의 정반대의 작업, 즉 하나의 잠재적으로 복잡한 작업을 다음 작업으로 넘어가기 전에 가능한 한 빨리 실행하도록 설계되었습니다.

![CPU pipeline](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-4.webp)
_각 CPU 코어는 순차적 파이프라인에서 명령을 처리_

따라서 하드웨어 회사들은 프레임버퍼를 업데이트하고 비디오 컨트롤러와 통신하기 위한 전용 하드웨어의 필요성을 깨달았습니다. 수십 년에 걸쳐 이것은 우리가 지금 GPU라고 부르는 것으로 발전했습니다. 즉, 가능한 한 빨리 픽셀 배열을 업데이트하는 프로세스를 위해 특별히 설계된 독립적인 하드웨어입니다.

![GPU vs CPU](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-5.webp)
_GPU는 제어보다 컴퓨팅과 메모리에 더 많은 리소스를 할당_

이러한 목적을 위해 특별히 설계되었기 때문에 범용 CPU가 할 수 없는 몇 가지 절충안을 만들 수 있습니다. **CPU는 지연 시간을 최소화하도록 설계**되었습니다. 다시 말해 단일 명령 스트림을 가능한 한 빠르게 처리하도록 설계되었습니다. 소수의 매우 강력한 코어가 초고속 클럭 속도로 실행되며 거의 모든 사이클이 낭비되지 않도록 영리한 예측을 수행할 수 있습니다.

**GPU는 반대의 절충안**을 만들어 지연 시간보다 처리량을 극대화하여 수천 개의 작고 단순하며 상대적으로 느린 코어로 가능한 한 많은 명령을 처리합니다. 단일 명령은 CPU에서보다 느리게 처리되지만, 동시에 처리할 수 있는 명령의 수가 엄청나게 많기 때문에 초당 더 많은 명령을 처리할 수 있습니다.

현대의 멀티코어 CPU는 초당 약 천억 개의 명령을 처리할 수 있지만, 현대 GPU는 초당 수십 조 개의 명령을 처리할 수 있습니다.

![CPU vs GPU pipeline](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-6.webp)

이를 수행하는 방법은 행렬 곱셈이나 각도의 사인 계산과 같은 특정 작업을 수행하는 데 매우 효율적인 수천 개의 작고 덜 강력한 코어를 보유하는 것입니다. 이러한 코어는 컴퓨트 유닛 또는 스트리밍 멀티프로세서(SM)라고 하는 그룹으로 배열되어 완료할 작업을 디스패치할 수 있습니다.

핵심은 이러한 코어가 병렬로 작동할 수 있다는 것입니다. 왜냐하면 이들이 잘하는 작업 유형은 쉽게 분할하여 동시에 완료할 수 있기 때문입니다. 실제로 우리는 보통 이러한 유형의 작업을 **embarrassingly parallel**(당혹스러울 정도로 병렬적)이라고 부릅니다.

![GPU architecture](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-7.webp)
_GPU는 일반적으로 코어 그룹을 컴퓨트 유닛 또는 스트리밍 멀티프로세서로 배열_

Shader를 사용하면 이러한 컴퓨트 유닛에서 프로그램을 실행할 수 있지만, 이상하게도 몇 가지 제약이 있는 이유를 이해하기 시작했을 것입니다. Shader가 빠른 이유는 작업을 분할하고 서로 독립적으로 실행하기 때문이지만, 이러한 설계는 복잡성을 최소화해야 합니다.

동시에 실행되기 때문에 한 Shader 인스턴스의 계산이 다른 인스턴스의 결과에 의존할 수 없습니다. 즉, Shader 인스턴스 간에 데이터를 전달할 수 없지만 모든 인스턴스에 데이터를 전달할 수는 있습니다. **이를 Uniform이라고 부르며**, 각 인스턴스가 정확히 동일한 값을 받기 때문에 변수가 아닙니다.

GPU는 이러한 모든 코어를 바쁘게 유지하는 것을 좋아하므로 하나가 해제되면 즉시 새로운 작업이 주어집니다. 새 작업이 이전 작업과 전혀 관련이 없다는 보장이 없으므로 이러한 의미에서 각 코어는 메모리가 없으며 이전 출력을 기반으로 무언가를 계산할 수 없습니다.

하지만 모두 병렬인 것은 아닙니다. 다양한 유형의 Shader는 순차적 파이프라인의 일부로 실행되며 한 단계에서 다음 단계로 데이터를 전달할 수 있습니다. 그래픽 파이프라인을 파헤쳐 Shader가 실제로 전체 프로세스에 어떻게 맞는지 살펴봅시다.

## 그래픽 파이프라인

Shader는 주로 3D 그래픽 렌더링을 위해 설계된 그래픽 렌더링 파이프라인의 일부로 실행됩니다. 실제로는 많은 단계가 있지만 세 가지 주요 단계로 단순화할 수 있습니다:

- **Vertex Shading** — 정점 변환
- **Rasterisation** — Fragment 준비
- **Fragment Shading** — 픽셀 값 계산

3D 공간에서 큐브를 렌더링한다고 상상하고 해당 큐브를 렌더링하기 위해 파이프라인의 모든 단계에서 무엇이 일어나야 하는지 살펴봅시다.

![The shader pipeline](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-1.webp)
_Shader 파이프라인의 다양한 단계와 연결 방식_

GPU에서 아무 일도 일어나기 전에 애플리케이션 로직을 실행하는 CPU가 GPU에 draw call을 발행합니다. 해당 draw call과 함께 GPU에 장면을 렌더링하는 데 필요한 정점(vertex) 데이터를 제공하며, GPU는 이를 메모리에 Vertex Buffer Objects(VBO)로 저장합니다.

정점 데이터에는 정점의 위치, 노말(normals), 텍스처 좌표 또는 주어진 지오메트리를 렌더링하는 데 필요한 재질 속성과 같은 것들이 포함됩니다.

![VBO](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-8.webp)
_CPU는 그래픽 파이프라인을 위한 데이터를 준비_

GPU에서 발생하는 첫 번째 단계는 Input Assembler(IA)입니다. VBO에서 정점 데이터를 읽고 데이터를 사용하여 프리미티브를 조립하기 시작합니다. 우리의 경우 정점 데이터를 가져와 삼각형으로 큐브를 만들 것입니다.

![Input assembler](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-9.webp)
_Input assembler는 정점 데이터를 가져와 프리미티브로 조립_

이것은 중요합니다. 이제 우리 모양이 정확히 몇 개의 정점을 가질지, 그리고 몇 개의 Vertex Shader 인스턴스를 실행해야 하는지 알기 때문입니다.

### Vertex Shading

Vertex Shader는 지오메트리의 각 정점에 대해 한 번씩 실행되므로 당연히 Shader의 각 인스턴스는 정점 위치에 대해 다른 값으로 실행됩니다. Vertex Shader가 최종 장면에서 정점의 위치를 결정하므로 원하는 대로 해당 위치를 변환할 수 있습니다.

큐브를 회전하려면 경과 시간을 기반으로 하는 각도의 회전 행렬을 각 정점에 적용할 수 있습니다. 회전 행렬은 Uniform이므로 각 정점에 대해 동일하며, Shader의 각 인스턴스에 대해 다른 것은 정점 위치뿐입니다.

![Vertex rotation](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-10.webp)

이것은 꽤 간단한 예이지만, 정점 조작을 통해 다른 방법으로는 꽤 어려운 효과를 적용할 수 있습니다. 메시에 수십 개의 정점으로 구성된 평평한 평면이 있다고 상상해 봅시다. 기본 삼각법만 사용하여 사인파로 평면의 각 정점을 조작할 수 있습니다.

![Vertex sine wave](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-11.webp)
_평면에 사인파를 적용하는 Vertex Shader_

지금은 한 방향으로 사인파를 적용하고 있지만, 원점에서 적용하면 물결을 만들 수 있습니다.

![Vertex ripple wave](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-12.webp)
_평면에 물결파를 적용하는 Vertex Shader_

Uniform을 사용하여 Vertex Shader에 매개변수를 전달할 수 있습니다. 이 경우 사인파의 주파수와 진폭을 변경하고 있습니다. Uniform은 Shader의 각 인스턴스에 대해 동일하지만 시간이 지남에 따라 Uniform을 업데이트할 수 있으므로 각 프레임이 새 값을 얻습니다.

![Vertex ripple uniforms](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-13.webp)
_사인파 주파수와 진폭 변조의 효과를 보여주는 세 개의 다른 평면_

주어진 메시가 몇 개의 정점을 가질지 결정할 수 있습니다. 3D 소프트웨어에서는 일반적으로 이와 같은 기본 모양에 대한 세분화를 설정할 수 있습니다. 더 많은 세분화는 더 많은 교차점, 따라서 더 많은 정점을 의미합니다. 얼마나 많은 디테일을 보여주고 싶은지에 따라 이 선택을 할 수 있지만 성능 절충이 따릅니다.

Vertex Shader는 모든 정점에 대해 실행되어야 하므로 정점 수를 두 배로 늘리면 당연히 Vertex Shader가 실행되는 횟수와 필요한 스레드 수가 두 배로 늘어납니다.

![Vertex ripple subdivisions](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-14.webp)
_평평한 평면 메시의 정점 수를 늘리는 효과를 보여주는 세 개의 다른 평면_

Vertex Shader가 정점 정보를 반환하기 전에 일반적으로 화면 공간으로 변환해야 합니다. 3D 프로그램을 사용해 본 적이 있다면 지오메트리를 만들 때 원점, 즉 각 축이 시작되는 지점 { x:0, y:0, z:0 }이 있다는 것을 알 것입니다. 우리 큐브의 경우 원점은 중심에 있으므로 주어진 정점의 좌표는 이 원점을 기준으로 합니다.

하지만 이러한 지오메트리를 실제로 렌더링하려면 평평한 화면을 기준으로 좌표가 필요합니다. 이를 위해 첫 번째 단계는 좌표를 모델 공간에서 월드 공간으로 변환하는 것입니다. 3D 애플리케이션에서 Shader로 전달된 행렬 Uniform인 modelMatrix로 각 정점을 곱하여 이를 수행하고 좌표를 월드 원점을 기준으로 만듭니다.

![3D projection](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-15.webp)
_모델 공간에서 월드 공간으로 변환하는 과정_

모델 행렬은 실제로 우리가 지금까지 설명한 회전, 스케일링 및 변환과 같은 모든 기본 변환을 적용하는 곳입니다. 원래 정점 위치를 실제로 업데이트하지 않고 이 행렬에서 변환을 설명합니다.

다음으로 카메라를 기준으로 정점이 어디에 있는지 파악해야 하며, 이를 뷰 공간(view space)이라고 하고 정점 데이터에 viewMatrix를 곱하여 수행합니다. 마지막으로 projectionMatrix를 사용하여 카메라 원근을 적용하고 뷰포트 크기와 해상도를 기준으로 좌표를 변환합니다.

![3D projection 2](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-16.webp)
_월드 공간에서 화면 공간으로 변환하는 과정_

다음 단계로 넘어가기 전에 Shader가 서로 통신할 수 없다고 말한 것을 기억하십니까? 음, 그것은 완전히 사실이 아닙니다. Vertex Shader가 Fragment Shader보다 먼저 실행되기 때문에 Vertex Shader에서 계산된 변수를 Fragment Shader로 전달할 수 있습니다. 이것들은 역사적으로 **Varying**이라고 불렸는데, Uniform과 달리 Vertex Shader의 출력에 따라 달라지기 때문입니다.

예를 들어 각 정점이 다른 색상을 갖기를 원하므로 Vertex Shader에서 vColor라는 Varying을 반환한다고 가정해 봅시다. 그런 다음 해당 색상 값은 Fragment Shader로 전달될 때 보간되므로 Fragment가 파란색과 빨간색 정점 사이의 중간에 있는 경우 받는 vColor 값은 자주색일 것입니다.

![Varying](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-17.webp)
_Fragment 간에 Varying이 보간되는 방법_

이것은 또한 조명 효과를 위해 Fragment Shader에 노말(기본적으로 표면이 향하는 방향을 나타내는 벡터)과 같은 것을 전달하는 방법입니다.

일부 오래된 그래픽 시스템에는 실제로 Vertex Shader 이후와 래스터라이저 이전에 몇 가지 선택적 단계가 있습니다: 테셀레이션(tessellation)과 지오메트리 Shader입니다. 너무 혼란스럽게 하고 싶지 않으므로 이에 대해 너무 자세히 설명하지 않겠습니다.

테셀레이션 Shader는 기본적으로 지오메트리를 더 작은 프리미티브로 세분화하여 더 많은 디테일을 추가할 수 있습니다. 비디오 게임에서 카메라에 더 가까운 것에 더 많은 디테일을 추가하는 데 사용할 수 있습니다.

![Tessellation shader](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-18.webp)
_테셀레이션 Shader는 즉석에서 지오메트리에 더 많은 디테일을 추가할 수 있음_

지오메트리 Shader를 사용하면 즉석에서 요소를 완전히 추가하거나 제거할 수 있습니다. 따라서 요소가 카메라에서 너무 멀리 떨어져 있어 렌더링조차 되지 않아야 한다고 판단했다면 지오메트리 Shader를 사용하여 그렇게 할 수 있습니다.

### Rasterisation

이제 점과 좌표에서 픽셀로 이동해야 하는 지점입니다. 프로그래밍 불가능한 단계인 래스터라이저는 프리미티브와 변환된 위치를 가져와 커버하는 픽셀을 파악합니다. 이것이 좌표를 화면 공간으로 변환해야 했던 이유입니다.

큐브가 실제로 삼각형으로 구성되어 있다는 것을 눈치챘을 것입니다. 각 래스터라이저는 단일 삼각형에서 작동하여 내부에 있는 픽셀을 파악합니다. 이러한 각 픽셀에 대해 Fragment를 생성합니다.

![Rasteriser](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-19.webp)
_래스터라이저는 삼각형이 커버하는 픽셀을 기반으로 Fragment를 생성_

**Fragment는 기본적으로 Fragment Shader가 픽셀의 최종 색상을 파악하는 데 필요한 모든 정보**입니다. 여기에는 Uniform, 텍스처 및 정점 단계에서 보간된 Varying과 이 지점에서 모양의 깊이가 포함됩니다.

여기서 조금 앞서가지만 각 Fragment의 깊이는 깊이 테스트(depth testing)라는 것에 중요합니다. 이 Fragment가 가려져 있어서 보이지 않으면 프레임 버퍼에 쓸 필요가 없다는 아이디어입니다.

![Depth testing](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-20.webp)
_깊이 테스트는 어떤 모양이 서로를 가리는지 확인_

실제로 이는 Fragment를 프레임버퍼의 특정 픽셀 좌표에 쓸 때 z-buffer에서 해당 픽셀의 깊이 값을 확인하고 Fragment 값이 그보다 작은 경우에만 덮어쓴다는 의미입니다.

![Z-buffer](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-21.webp)
_프레임 버퍼는 z-buffer의 값을 기반으로만 업데이트됨_

여기서 발생하는 또 다른 복잡한 것은 안티앨리어싱(anti-aliasing)입니다. 벡터 좌표에서 픽셀 그리드로 변환하기 때문에 삼각형이 반만 덮는 일부 픽셀이 있을 것입니다. 이상적으로는 이러한 Fragment가 이를 덮는 두 모양을 기반으로 일종의 혼합 색상이 되기를 원합니다.

이를 위해 현대 시스템은 MSAA(Multisample Anti-aliasing)를 사용하여 이러한 가장자리 픽셀 내의 여러 지점을 샘플링하여 혼합할 각 색상의 양을 결정합니다. Fragment가 커버하는 샘플 포인트 수를 사용하여 최종적으로 프레임버퍼에 쓸 때 두 색상의 혼합 가중치를 파악합니다.

![Anti-aliasing](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-22.webp)
_Multisample Anti-aliasing은 앨리어싱 아티팩트를 블렌딩하는 데 사용됨_

복잡합니다, 알겠습니다. 어쨌든 래스터라이저가 Fragment를 생성한 후에는 각각에 대해 Fragment Shader를 실행하고 Fragment 데이터를 함께 보냅니다.

### Fragment Shading

이 모든 정보는 당연히 Fragment Shader로 전달되며, 이는 이 Fragment가 커버하는 픽셀의 색상 값을 결정하는 데 사용됩니다. 가장 간단한 경우 Fragment Shader는 텍스처, 조명 모델 및 기타 재질 속성을 적용하기만 하면 됩니다.

Fragment Shader를 사용하여 그라디언트를 만드는 방법을 보기 위해 간단한 예를 살펴봅시다. 단순화를 위해 높이가 20픽셀이고 너비가 20픽셀인 평평한 평면으로 작업하고 있다고 상상해 봅시다. 이 평면의 400픽셀 각각은 Fragment이며 모두 동일한 Fragment Shader에 의해 결정됩니다.

![Plane fragment](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-23.webp)
_400개의 개별 Fragment가 있는 간단한 20 x 20 평면_

Fragment Shader에는 색상 값을 반환하는 단일 main() 함수가 있습니다. 전체 평면이 동일한 색상이기를 원한다면 꽤 간단합니다. Fragment Shader가 해당 색상을 반환하도록 하면 됩니다.

![Plane single color](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-24.webp)
_각 Fragment에 대해 단일 색상 rgb(0.75,0.0,0.0)을 반환하는 간단한 Fragment Shader_

하지만 Shader가 실제로 아는 것이 계산 중인 픽셀의 x 및 y 좌표뿐일 때 그라디언트와 같은 것을 어떻게 적용할까요? 음, 너비와 높이와 같은 일부 Uniform을 Fragment Shader의 각 인스턴스에 전달할 수 있다는 것을 기억하십시오.

해상도를 vec2 Uniform에 저장할 수 있으며, 이는 너비와 높이의 두 가지 구성 요소가 있는 벡터입니다. 왼쪽에서 오른쪽으로 간단한 그라디언트를 만들려면 Fragment 위치(역시 vec2)를 해상도로 나누고 결과 x 구성 요소를 최종 색상의 빨간색 구성 요소로 사용할 수 있습니다.

![Plane gradient x](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-25.webp)
_x축에 그라디언트를 반환하는 간단한 Fragment Shader_

수직 그라디언트를 원한다면 대신 벡터의 y 구성 요소를 반환할 수 있습니다.

![Plane gradient y](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-26.webp)
_y축에 그라디언트를 반환하는 간단한 Fragment Shader_

최종 색상 구성 요소에서 st 벡터의 다양한 구성 요소를 사용하여 이 그라디언트의 여러 변형을 가지고 놀 수 있습니다.

![Plane gradient blue pink](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-27.webp)

![Plane gradient green red](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-28.webp)

현재 시계 시간과 삼각법을 사용하여 시간이 지남에 따라 색상 구성 요소를 애니메이션할 수도 있습니다. 각 새 프레임은 u_time Uniform에 대한 새 값을 얻으며, 이는 sin() 함수와 결합되어 녹색 구성 요소가 1과 -1 사이에서 진동하게 합니다.

![Plane gradient sine](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-29.webp)
_현재 시간을 기반으로 sin() 함수로 녹색 구성 요소를 애니메이션_

이 기본 예제 외에도 Fragment Shader는 지오메트리에 사실적인 조명 효과를 제공하는 데 더 일반적으로 사용됩니다. 우리의 경우 **Phong 조명**이라는 방법으로 일부 실제 조명 계산을 근사하여 큐브에 기본 조명 설정을 추가하려고 합니다.

Phong 조명은 세 가지 간단한 조명 기술을 결합하여 만들어집니다:

- **Ambient lighting** - 균일한 최소 광량 생성
- **Diffuse lighting** - 광원의 위치를 기반으로 객체 조명
- **Specular lighting** - 광원과 뷰어 간의 관계를 기반으로 반사 하이라이트 추가

![Lighting effects](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-30.webp)
_Phong 조명 효과를 구성하는 다양한 조명_

실제 빛은 여러 소스에서 나와 표면에서 튕기고 흩어지기 때문에 물체가 완전히 어두워지는 것은 기본적으로 불가능합니다. 이를 근사하는 정말 저렴하고 쉬운 방법은 최종 색상에 적용하는 주변 조명 상수를 만들어 물체가 항상 최소한의 밝기를 갖도록 하는 것입니다.

물론 빛에도 일종의 색상이나 온도가 있으므로 vec3로 저장하는 빛 색상에 주변 강도를 곱한 다음 최종 색상을 반환하기 전에 이 주변 조명으로 물체 색상을 곱합니다.

![Ambient lighting](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-31.webp)
_강도 인수를 늘려 주변 조명 강도를 변경할 수 있음_

다음 단계는 더 흥미롭습니다. **Diffuse 조명**은 광원에 대한 특정 Fragment의 각도를 기반으로 물체를 더 밝게 만듭니다. 특정 Fragment와 광원 사이의 각도가 수직이면 더 둔각인 경우보다 더 밝아집니다. 이를 위해 먼저 몇 가지를 알아야 합니다: 광원의 위치, 색상 및 강도와 특정 Fragment가 향하는 방향입니다.

![Diffuse lighting](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-32.webp)
_Diffuse 조명은 표면과 광원 사이의 각도를 기반으로 Fragment의 밝기를 변경_

광원 위치, 색상 및 강도를 다른 Uniform으로 저장하고 해당 정보를 Fragment에 전달할 수 있으므로 쉽습니다. 또한 두 위치 사이의 각도를 구하여 Fragment를 향한 빛의 방향을 계산할 수 있지만 Fragment의 방향은 어떻게 얻을까요? 음, 이것을 노말 벡터(normal vector)라고 하며 Vertex Shading 섹션에서 간략하게 다루었습니다.

![Surface normal](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-33.webp)
_표면 노말은 표면에 수직인 벡터_

메시의 각 삼각형에는 표면 노말이 있으며, 이는 삼각형 면에 수직으로 가리키는 단위 벡터입니다. 큐브와 같은 평평한 모양의 경우 조명 계산에서 이 표면 노말을 사용할 수 있습니다. 해당 삼각형의 각 Fragment에 대해 동일하기 때문입니다.

![Surface normal shapes](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-34.webp)
_큐브와 곡선 평면의 표면 노말_

하지만 구와 같은 곡면을 음영 처리하려면 어떻게 해야 할까요? 표면 노말을 사용하고 싶지 않을 것입니다. 구를 구성하는 각 표면에 대해 평평한 음영을 만들기 때문입니다.

![Flat shading](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-35.webp)
_구에 평면 표면 음영의 효과_

이러한 경우 주변 삼각형의 표면 노말을 평균화하여 삼각형의 각 정점에 대한 노말을 만들고 싶습니다.

![Vertex normals](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-36.webp)
_정점 노말은 주변 표면 노말을 기반으로 평균화됨_

그런 다음 이러한 정점 노말을 Varying으로 Fragment Shader에 전달할 수 있으며, 여기서 각 Fragment에 대해 보간되어 실제로 해당 곡선에 대한 정보를 저장할 필요 없이 매끄러운 곡면의 효과를 만듭니다. 꽤 멋지죠.

![Smooth shading](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-37.webp)
_정점 노말을 보간하면 곡면을 부드럽게 음영 처리할 수 있음_

Diffuse 조명 설정으로 돌아가서, 이제 Fragment와 광원의 방향이 있으므로 이 두 벡터의 내적(dot product)을 사용하여 Diffuse 조명의 강도를 결정할 수 있습니다.

**내적**은 동일한 길이의 두 벡터를 함께 곱하고 두 벡터가 같은 방향을 가리키는 정도를 측정하는 스칼라를 생성하는 연산입니다. 두 벡터 사이의 각도가 90도이면 내적은 0이 되고 각도가 더 예각이 될수록 내적은 1에 가까워집니다.

![Dot product](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-38.webp)
_두 단위 벡터 a와 b의 내적_

주변 조명과 마찬가지로 빛의 색상에 내적으로 계산한 강도를 곱합니다(음수가 되지 않도록 제한). 그런 다음 Diffuse와 Ambient 결과를 함께 추가하고 물체 색상을 결과로 곱합니다.

![Diffuse and ambient lighting](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-39.webp)

마지막 단계는 **Specular 조명**으로, 기본적으로 일부 표면이 광원을 반사하는 방식을 모방하기 위해 표면에 반사 하이라이트를 추가합니다. 원하는 Specular 조명의 양은 모방하려는 재질의 반사 속성과 관련이 있습니다. 유리와 같은 재질은 나무와 같은 거친 재질보다 더 많은 반사 하이라이트를 보여줍니다.

Diffuse 조명과 마찬가지로 반사의 강도는 표면에 대한 빛의 방향을 기반으로 하지만 표면에 대한 뷰어의 방향도 기반으로 합니다. 표면에서 벗어나는 반사의 방향은 빛 방향의 거울과 같으며 반사와 뷰어의 방향이 수렴할수록 반사 강도가 증가합니다.

![Specular lighting reflection](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-40.webp)
_Specular 조명은 반사와 뷰어 사이의 각도를 기반으로 함_

이를 계산하는 데 필요한 누락된 부분은 카메라의 위치이며, 이를 다른 Uniform으로 저장합니다. 그런 다음 두 위치를 사용하여 Fragment에 대한 각도를 얻을 수 있으며, 이는 뷰어의 방향을 나타내는 벡터를 제공합니다.

이전과 유사하게 반사 및 뷰어 벡터의 내적을 계산하여 강도 값을 제공합니다. 그런 다음 이를 8의 거듭제곱으로 올립니다. 이는 표면의 광택 값을 나타냅니다. 이 값이 높을수록 반사가 작아지고 덜 확산됩니다. 그리고 이 모든 것을 강도 인수와 빛 색상으로 다시 곱합니다.

![Specular shininess](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-41.webp)
_재질이 반짝일수록 반사가 작아지고 덜 확산됨_

마지막으로 이것을 Ambient와 Diffuse 조명에 추가하고 물체 색상으로 곱합니다.

![Ambient diffuse specular](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-42.webp)
_모든 효과를 함께 추가하면 Phong 조명 모델이 완성됨_

많은 세부 사항이었지만 Fragment Shading이 얼마나 유연하고 강력한지 보여준다고 생각합니다. 다행히도 3D 소프트웨어를 사용하면 사용하는 재질로 이러한 조명 효과를 무료로 얻을 수 있으므로 이런 종류의 것에 대해 걱정할 필요가 없을 것입니다.

Fragment Shader가 완료된 후 Fragment를 프레임버퍼에 쓰면 디스플레이 컨트롤러가 읽고 화면에 렌더링할 수 있습니다. 각 Fragment가 프레임버퍼에 쓰기 전에 앞서 이야기한 깊이 테스트 또는 스텐실 테스트와 같은 가시성 테스트를 거칩니다.

스텐실 테스트는 마스킹 또는 클리핑과 같은 것에 사용되며, 픽셀의 좌표가 스텐실의 경계 밖에 있는지 확인하고, 그런 경우 다시 중단합니다. 또한 이 단계에서 블렌딩 및 불투명도와 같은 것을 처리하므로 래스터라이저의 안티앨리어싱 결과를 기반으로 Fragment 출력을 프레임버퍼의 값과 블렌딩할 수 있습니다.

## Shader 작성하기

Shader가 충분히 복잡하지 않은 것처럼, 직접 작성하기 시작하려면 알아야 할 다른 것들이 많이 있습니다.

실행되는 환경부터 시작하겠습니다. GPU에서 직접 기계 코드를 작성할 수 있는 절대적인 괴짜가 아니라면 일종의 API를 통해 GPU와 상호 작용해야 합니다.

역사적으로 우리는 다양한 언어로 GPU와 상호 작용하고 렌더링 파이프라인을 만지작거릴 수 있게 해주는 OpenGL이라는 크로스 플랫폼 API를 사용해 왔습니다.

OpenGL을 만든 사람들은 또한 Shader 작성을 위해 특별히 GLSL이라는 언어를 개발했는데, 이는 그래픽 드라이버에 의해 런타임에 컴파일되는 C와 유사한 언어입니다. 대부분 온라인에서 찾을 수 있는 Shader 코드는 GLSL로 작성되었습니다. OpenGL에는 GPU와 상호 작용할 수 있는 웹 애플리케이션을 작성할 수 있게 해주는 WebGL이라는 웹 구현이 있습니다.

하지만 물론 아무것도 매우 간단하지 않습니다. Microsoft는 DirectX 또는 Direct3D라는 자체 그래픽 API를 가지고 있으며 실행 파일로 미리 컴파일되는 HLSL이라는 자체 객체 지향 Shader 언어를 가지고 있습니다. Apple은 Apple 하드웨어를 위한 자체 그래픽 API 레이어인 Metal과 MSL이라는 또 다른 특정 Shader 언어를 가지고 있습니다.

아, 그리고 OpenGL은 구식으로 간주되어 Vulkan이라는 것으로 대체되었고 WebGL은 더 이상 GLSL을 지원하지 않는 WebGPU로 대체되고 있습니다. 멋지네요.

좋은 소식은 이런 것들과 상호 작용할 가능성이 거의 없으며 모든 것을 원활하게 실행하는 상호 운용성 계층이 있다는 것입니다. 저와 같다면 WebGL/WebGPU를 사용하는 Three.js와 같은 것으로 Shader를 작성할 것이며, 이는 브라우저와 운영 체제에 따라 하위 수준 API 중 하나와 상호 작용할 것입니다.

![APIs](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-43.webp)
_다양한 그래픽 API가 상호 운용되는 방법_

GPU에서 실행되는 것으로 이점을 얻을 수 있는 것은 3D 그래픽 렌더링만이 아닙니다. 분할되어 병렬로 실행되는 것으로 이점을 얻을 수 있는 다른 많은 유형의 작업이 있습니다. 문제는 방금 설명한 그래픽 렌더링 파이프라인이 해당 유형의 문제에 상당히 맞춤화되어 있다는 것입니다.

새로운 API는 **Compute Shader**를 도입했는데, 이는 이 파이프라인 외부에서 실행되지만 여전히 상호 작용할 수 있는 Shader 유형입니다. 물리 시뮬레이션에 의존하는 3D 파티클 시스템을 렌더링하고 싶다고 상상해 봅시다. 각 파티클 정점의 위치를 업데이트하면 많은 CPU 리소스를 소비하므로 대신 Compute Shader로 오프로드하고 Vertex Shader 단계에서 해당 값을 파이프라인에 공급할 수 있습니다.

![Compute shader](/media/2025-12-15-shaders-gpu-graphics-pipeline/figure-44.webp)
_Compute Shader는 그래픽 파이프라인과 통신하면서 별도로 실행될 수 있음_

파티클 위치를 병렬로 계산할 수 있기 때문에 더 빠를 뿐만 아니라 모든 정점 위치를 GPU 메모리에 저장하므로 GPU가 액세스하는 것이 훨씬 빠르다는 추가 이점이 있습니다.

또한 NVIDIA GPU용 API 세트인 **CUDA**(Compute Unified Device Architecture)가 있으며, 이를 통해 그래픽 렌더링 파이프라인 외부에서 컴퓨팅에 GPU를 사용할 수 있습니다. 이것은 종종 AI/ML 모델을 실행하는 데 사용되며, 이는 렌더링 파이프라인 외부에서 완전히 실행해야 하는 극도로 병렬적인 문제입니다.

추적을 잃은 경우를 대비하여 다양한 API의 요약은 다음과 같습니다.

| 기술 | 회사 | 플랫폼 | 그래픽 또는 컴퓨팅 |
|------|------|--------|-------------------|
| OpenGL* | Khronos Group | 크로스 플랫폼 | 그래픽 (+ 최신 버전의 Compute Shader를 통한 컴퓨팅) |
| WebGL* | Khronos Group | 브라우저 | 그래픽 |
| Vulkan | Khronos Group | 크로스 플랫폼 | 둘 다 |
| WebGPU | W3C | 브라우저 | 둘 다 |
| Metal | Apple | Apple 플랫폼 | 둘 다 |
| Direct3D | Microsoft | Windows 및 Xbox | 그래픽 (+ Compute Shader를 통한 컴퓨팅) |
| CUDA | NVIDIA | NVIDIA GPU | 컴퓨팅 |

_* 레거시로 간주됨_

## 마치며

이것이 꽤 간단한 질문에 대한 길고 복잡한 답입니다. 요약하자면, **Shader는 엄청나게 멋지지만 순차적으로 실행되는 소프트웨어를 작성하는 것과는 상당히 큰 사고방식의 전환이 필요합니다.** 그래픽 파이프라인에 대해 배우는 것이 중요하다고 생각하는 이유는 이러한 전환을 조금 더 쉽게 만들기 때문입니다.

