---
title: 매니킨(Mannequin) VR 게임의 라이팅 최적화 기법, 퀘스트2에서 구현한 고품질 조명
description: 언리얼 엔진에서 Lumen과 GPU Lightmass를 활용한 VR 게임 라이팅 워크플로우와 최적화 기법을 소개합니다.
author: claude
date: '2025-12-03 09:30:00'
categories:
  - News Articles
tags:
  - Unreal Engine
  - VR
  - Lighting
  - GPU Lightmass
  - Lumen
  - Quest 2
  - Graphics Rendering
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Lighting mannequin](https://real-mrbeam.github.io/2025/10/28/Lighting-Mannequin.html){:target="_blank"}

![Mannequin game lighting](/media/2025-12-03-lighting-mannequin-vr-game/figure-1.jpg)

메타 퀘스트 2를 위한 멀티플레이어 VR 타이틀 매니킨(Mannequin) 개발 과정에서 라이팅 디자인이 얼마나 중요한 역할을 했는지, 그리고 제한된 성능 예산 안에서 어떻게 고품질 조명을 구현했는지를 담은 개발 후기입니다. Lumen과 GPU Lightmass를 결합한 독특한 워크플로우와 다양한 최적화 기법들을 상세히 다룹니다.

## 매니킨의 라이팅 목표

매니킨은 어두운 미로 같은 레벨을 통과하는 VR 게임입니다. 느린 스릴러 같은 긴장감에서 빠른 슈팅으로 순식간에 전환되는 게임플레이 특성상, **플레이어가 어떤 루트를 선택할 수 있는지 즉각적으로 이해할 수 있어야 했습니다.**

게임은 수많은 모듈러 조각들로 구성되어 있어서 라이트 품질이 쉽게 저하될 수 있었습니다. 이를 방지하는 것이 최우선 과제였습니다.

![Justice game baked lighting](/media/2025-12-03-lighting-mannequin-vr-game/figure-2.jpg)

개발팀은 이전 프로젝트인 뱀파이어: 더 매스커레이드 - 저스티스(Vampire: The Masquerade - Justice) 개발 중 베이크된 라이팅이 **반복 작업이 번거롭고 속도가 매우 느리다는 것을 경험**했습니다. HLOD를 많이 사용했기 때문에 반복 작업은 더욱 고통스러웠습니다.

## Lumen 실험과 워크플로우 개선

![Mannequin lighting scenarios](/media/2025-12-03-lighting-mannequin-vr-game/figure-3.jpg)

매니킨의 라이팅 디자인은 **게임플레이 상태와 경로를 명확하게 전달하는 채도 높은 색상 구성**을 사용합니다. 레벨 디자인이 변경될 때마다 라이팅은 완전히 재작업이 필요했기 때문에 빠른 라이팅 반복 작업이 필수적이었습니다.

이 시기에 Lumen이 등장했습니다. VR 프로덕션에 사용할 것으로 기대하지는 않았지만, **워크플로우 속도가 매우 매력적**이었습니다. 개발 중에 Lumen을 사용하고 최종적으로 베이크된 라이팅으로 전환하면서 비슷한 외관을 유지할 수 있다면 어떨까 하는 아이디어가 떠올랐습니다.

처음에는 불가능해 보였습니다. CPU Lightmass와 Lumen의 동작 방식이 너무 달라서 결과가 충분히 가깝지 않았기 때문입니다. 여러 차례 테스트 후 아이디어를 포기했습니다.

나중에 속도 향상을 위해 GPU Lightmass로 전환하기로 결정했습니다. **GPU 베이킹의 미세한 품질 손실은 스타일화된 외관에서 눈에 띄지 않았습니다.** Epic도 GPU Lightmass를 계속 지원하고 CPU 베이킹은 점차 구식이 될 것이라고 밝혔습니다.

다행히 기술적으로 능숙한 AD가 Lumen과 베이크된 라이트의 불일치 문제를 재검토했고, 이번에는 **결과가 훨씬 더 가까워졌습니다.**

그때부터 개발 중에는 Lumen의 빠른 반복 작업을 사용하고 최종 베이킹에는 GPU Lightmass를 사용하는 파이프라인을 구축하기 시작했습니다.

## Lumen과 GPU Lightmass 결합 파이프라인

![Mannequin lighting scene](/media/2025-12-03-lighting-mannequin-vr-game/figure-4.jpg)

목표는 Lumen에서 라이팅을 구성하고, 적절하게 느껴지면 스태틱으로 베이크하고, 결과를 검토한 다음 빠르게 조정하는 것이었습니다. **베이크된 결과가 Lumen 미리보기와 최대한 가깝게 유지되어야 했습니다.**

이를 위해 몇 가지 규칙을 정했습니다.

### 1. 라이트 설정 표준화

라이트가 Lumen과 베이크된 결과를 동기화 상태로 유지하는 특정 설정이 필요했습니다.

### 2. Vulkan 프리뷰 원클릭 전환

Vulkan 프리뷰를 원클릭으로 실행할 수 있어야 실시간 라이팅과 스태틱 라이팅 사이를 마찰 없이 전환할 수 있었습니다.

### 3. GPU Lightmass를 기본값으로 설정

GPU Lightmass는 CPU Lightmass보다 빠르고 Lumen 외관과 밀접하게 일치하는 결과를 생성했습니다.

### 4. 포스트 프로세스 자동 전환

포스트 프로세스 설정이 모드 간에 자동으로 전환되어야 했습니다.

### 5. 자동 생성 LOD 사용

수동으로 제작한 LOD 대신 자동 생성된 LOD를 사용하기로 했습니다.

![Vulkan vs Forward Renderer comparison](/media/2025-12-03-lighting-mannequin-vr-game/figure-5.gif)

실시간 라이팅과 스태틱 라이팅 사이의 루프를 모두가 쉽게 접근할 수 있도록 만드는 도구를 개발했습니다. 이 도구는 모든 씬 라이트의 설정을 토글했습니다. **가장 중요한 변경사항은 라이트를 Movable과 Static 사이에서 전환하고, Indirect Lighting Intensity를 1로 고정하고, Lighting Attenuation Radius를 전체 바운스 영역을 커버할 만큼 크게 설정하는 것**이었습니다.

Vulkan 프리뷰를 사용하여 베이크된 라이팅과 동적 라이팅 사이를 전환했지만, Vulkan 렌더러와 네이티브 Forward 렌더러 사이에는 여전히 너무 큰 시각적 차이가 있었습니다.

![Vulkan and Forward Renderer with tweaked settings](/media/2025-12-03-lighting-mannequin-vr-game/figure-6.gif)

Bloom, Color Grading Tone Curve, Color Mapping을 신중하게 조사하고 조정한 결과, **우리 요구사항에 충분히 가까운 결과**를 얻었습니다. 더 많은 조사를 통해 더 개선할 수 있었겠지만, 이 정도 정확도면 수용 가능했습니다.

마침내 거의 동일한 결과를 얻었습니다.

![Lumen vs Static lighting comparison](/media/2025-12-03-lighting-mannequin-vr-game/figure-7.png)

## 볼류메트릭 포그 없이 라이트 샤프트 구현

Forward 렌더링은 로컬 볼류메트릭 포그를 지원하지 않지만, 프로젝트에서 멋진 태양 샤프트를 원했습니다. 또 다른 과제는 **단일 글로벌 태양 방향을 원하지 않았다는 것**입니다. 레벨의 서로 다른 영역에서 "태양"이 다른 방향으로 비출 수 있는 자유를 원했습니다.

이를 해결하기 위해 **메시를 생성하고 디렉셔널 라이트의 회전에 따라 돌출시키는 Geometry Script 도구를 제작**했습니다. 이 기능을 라이팅 도구에 추가했습니다. 라이팅을 베이크하면 태양 샤프트가 스태틱 메시 에셋에 베이크되고 동적 메시를 스태틱 액터로 교체했습니다.

머티리얼은 거리에 의존하며(PC에서는 더 나은 정밀도를 위해 distance fields를 사용) 페이딩에 fresnel을 사용합니다. 이를 통해 클리핑을 방지하고 효과가 평평하거나 2차원적으로 보이지 않게 했습니다. **결과가 예상보다 좋아서 PC 버전에서도 이 기법을 사용**했습니다.

## Mobile HDR 없이 블룸 구현

![Fake bloom technique](/media/2025-12-03-lighting-mannequin-vr-game/figure-8.png)

Mobile HDR은 블룸 같은 포스트 이펙트를 가능하게 하지만 퀘스트 예산에 비해 너무 비쌌습니다. 대신 GlowingQuad 플러그인[^glowingquad]을 사용하여 블룸을 페이크했습니다. **단일 쿼드를 사용하고 카메라 각도에 따라 면을 접는 방식**입니다.

신중하게 사용하면 설득력이 있고 거의 비용이 들지 않습니다. 버텍스 컬러에 의존하지 않는 한 어떤 머티리얼도 사용할 수 있습니다. GPU 버전의 플러그인은 폴딩 시스템에 버텍스 컬러를 사용하기 때문입니다.

![Bloom comparison](/media/2025-12-03-lighting-mannequin-vr-game/figure-9.png)

기법 구현은 간단했습니다. 스크린이나 라이트 같은 이미시브 기능에 사용하고, **인텐시티를 미묘하게 유지하고, 평평한 모양을 선호했습니다.** 이런 옛날 방식의 트릭이 다시 활용되는 것이 좋습니다.

시간이 멈춘 캐릭터의 빛나는 눈 같은 둥근 기능에는 Dynamic Blob Lights & Shadows[^blob-lights]를 사용했습니다. 볼류메트릭한 느낌이 나면서 비용이 매우 적습니다.

![Dynamic blob shadows](/media/2025-12-03-lighting-mannequin-vr-game/figure-10.png)

보너스로 변조된 버전을 시간이 멈춘 캐릭터의 컨택트 섀도우로 사용했습니다.

## 완전 러프 머티리얼에서 페이크 리플렉션

디바이스에서 **인스트럭션을 절약하고 셰이딩 비용을 줄이기 위해 완전 러프 머티리얼을 사용**했습니다. 게다가 메모리를 절약하기 위해 디바이스에서 리플렉션 캡처를 비활성화했습니다. 대신 머티리얼 함수 내부에서 커스텀 큐브맵을 샘플링했습니다.

한 가지 좋은 부작용은 동일한 함수를 사용하여 저해상도 디바이스의 원거리 반사 머티리얼에서 일반적으로 발생하는 스페큘러 플리커링을 줄일 수 있었다는 것입니다. **카메라 거리에 따라 스페큘러 fresnel을 반전**시켜 이를 수행했습니다.

![Fake reflections](/media/2025-12-03-lighting-mannequin-vr-game/figure-11.png)

이 접근 방식의 단점은 모든 라이팅 조건에서 동일한 리플렉션 강도를 얻는다는 것입니다.

이를 해결하기 위해 라이트 도구를 확장하여 버추얼 라이트맵 포인트를 샘플링할 수 있도록 했습니다. 도구는 메시의 바운딩 박스 중심에서 VLM, 특히 VLM의 Z-up 값을 샘플링했습니다. 그런 다음 해당 값을 액터의 커스텀 프리미티브 데이터에 적용했습니다. **이 값을 사용하여 액터별 리플렉션 강도를 조절**했습니다.

가장 우아한 솔루션은 아니었지만 객체가 너무 크지 않는 한 대부분의 경우 잘 작동했습니다.

## 다양한 하드웨어를 위한 라이팅 시나리오

헤드셋이 PC에 연결되었을 때 디바이스 베이크를 깨뜨리지 않고 동적 섀도우를 원했습니다. 솔루션은 Lighting Scenarios였습니다. 각 시나리오는 자체 베이크를 보유하고 다른 하드웨어를 타겟으로 했습니다. 그런 다음 플레이어가 사용하는 디바이스를 식별하여 특정 라이트 시나리오를 로드했습니다.

- 퀘스트 시나리오: 완전 스태틱 라이팅 사용
- PC 시나리오: 동일한 레벨을 재사용하지만 중요한 부분에서 동적 섀도우 활성화

콘텐츠는 동일했습니다. 주요 차이점은 라이트 모빌리티였습니다. **디바이스 시나리오에서 Static이었던 많은 라이트가 PC 시나리오에서는 Movable로 설정**되어 퀘스트 빌드는 스태틱으로 유지하면서 PC 플레이 중에는 동적 섀도우를 제공했습니다.

## 마치며

매니킨의 라이팅은 하나의 솔루션이 아니라 **함께 작동하는 실용적인 선택들, 도구들, 그리고 많은 팀워크의 결과**였습니다. 이 글이 도움이 되거나 최소한 흥미롭게 느껴지길 바랍니다. 다음에는 VR을 위한 타이틀 최적화 방법에 대해 작성할 예정입니다.

## Quick questions

> **GPU Lightmass와 CPU Lightmass의 가장 큰 차이점은 무엇인가요?**
>
> GPU Lightmass는 CPU 버전보다 베이크 속도가 훨씬 빠르며, Lumen의 라이팅 결과와 더 유사한 외관을 생성합니다. Epic Games도 GPU Lightmass를 향후 계속 지원할 것이라고 밝혔으며, CPU 베이킹은 점차 구식이 되어가고 있습니다.
{: .prompt-info}

> **GlowingQuad 플러그인은 어떻게 블룸 효과를 구현하나요?**
>
> GlowingQuad는 Doom 3의 FlareDeform에서 영감을 받은 기법으로, 단일 쿼드를 카메라 각도에 따라 접어서 가짜 볼류메트릭 글로우 효과를 만듭니다. Mobile HDR이나 포스트 프로세싱 없이 저렴한 비용으로 블룸 같은 효과를 낼 수 있어 모바일 VR에 적합합니다.
{: .prompt-info}

> **Lighting Scenarios를 사용하는 이유는 무엇인가요?**
>
> Lighting Scenarios는 동일한 레벨에서 서로 다른 하드웨어를 위한 별도의 라이팅 베이크를 유지할 수 있게 합니다. 퀘스트 2에서는 완전 스태틱 라이팅을 사용하고, PC에 링크되었을 때는 동적 섀도우를 활성화하여 각 플랫폼에 최적화된 경험을 제공할 수 있습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^glowingquad]: GitHub - hollowdilnik - [GlowingQuad](https://github.com/hollowdilnik/GlowingQuad){:target="_blank"}{: target="_blank"}
[^blob-lights]: Unreal Engine Marketplace - [Dynamic Blob Lights & Shadows](https://www.unrealengine.com/marketplace/en-US/product/modulated-dynamic-lights-blob-shadows){:target="_blank"}{: target="_blank"}
