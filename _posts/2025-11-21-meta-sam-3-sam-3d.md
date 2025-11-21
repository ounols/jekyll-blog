---
title: Meta SAM 3와 SAM 3D 공개 - 이미지 세그멘테이션과 3D 재구성의 새로운 기준
description: Meta가 Segment Anything Model 3(SAM 3)와 SAM 3D를 공개했습니다. 텍스트 기반 세그멘테이션, 실시간 객체 추적, 2D 이미지에서 3D 재구성까지 가능한 새로운 모델들을 살펴봅니다.
author: claude
date: '2025-11-21 15:00:00'
categories:
  - News Articles
tags:
  - Computer Vision
  - AI
  - Meta
  - Image Segmentation
  - 3D Reconstruction
  - SAM
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Meta AI Blog - SAM 3D](https://ai.meta.com/blog/sam-3d/){: target="_blank"} | [Meta AI Blog - SAM 3](https://ai.meta.com/blog/segment-anything-model-3/){: target="_blank"}

![SAM 3D 소개 이미지](/media/2025-11-21-meta-sam-3-sam-3d/figure-1.png)

Meta가 이미지 세그멘테이션 분야의 새로운 모델인 SAM 3(Segment Anything Model 3)와 함께 3D 재구성을 위한 SAM 3D를 공개했습니다. 이번 릴리스는 기존 SAM 시리즈의 기능을 크게 확장하며, 특히 **텍스트 기반 세그멘테이션과 2D 이미지에서 3D 모델 생성** 기능이 핵심입니다.

## SAM 3의 주요 특징

SAM 3는 기존 SAM 1, SAM 2에서 지원하던 마스크, 박스, 포인트 프롬프트에 더해 **자연어 텍스트 프롬프트를 통한 세그멘테이션**을 지원합니다. 사용자가 "빨간 자동차"라고 입력하면 이미지에서 해당 객체를 자동으로 감지하고 세그멘테이션할 수 있습니다.[^sam3-paper]

### 1. 통합된 감지-세그멘테이션-추적 모델

SAM 3는 단일 모델로 객체 감지(detection), 세그멘테이션(segmentation), 추적(tracking)을 모두 수행합니다. 기존에는 각 작업에 별도의 모델이 필요했지만, SAM 3는 이를 하나로 통합하여 **파이프라인 복잡성을 크게 줄였습니다**.

### 2. 아키텍처 구성 요소

SAM 3의 아키텍처는 여러 Meta 연구 성과를 기반으로 구성되어 있습니다.

- **Meta Perception Encoder**: 텍스트와 이미지 인코더로 사용되며, 오픈소스로 공개된 모델입니다[^mpe]
- **DETR 기반 감지기**: 트랜스포머를 객체 감지에 최초로 적용한 DETR 모델을 기반으로 합니다
- **SAM 2의 메모리 뱅크와 인코더**: 비디오에서 객체를 추적하는 Tracker 컴포넌트의 기반이 됩니다

### 3. 학습 데이터 구축

SAM 3의 학습 데이터는 **자동화된 데이터 마이닝 파이프라인**을 통해 구축되었습니다. Llama 기반 캡셔너와 기존 SAM 3 모델이 이미지와 비디오에서 자동으로 세그멘테이션 마스크와 텍스트 레이블을 생성합니다. 이 과정에서 고품질 데이터만 필터링하여 학습에 사용합니다.

## SAM 3D - 2D 이미지에서 3D 재구성

![SAM 3D Objects 예시](/media/2025-11-21-meta-sam-3-sam-3d/figure-2.png)

SAM 3D는 SAM 시리즈에 처음 추가되는 3D 이해 기능으로, **단일 2D 이미지에서 3D 재구성을 수행**합니다. 두 가지 모델이 포함되어 있습니다.

### SAM 3D Objects

객체와 장면의 3D 재구성을 담당합니다. 연구자들이 게임 에셋을 생성하거나 AR/VR 연구를 수행할 때 활용할 수 있습니다. 새로운 평가 데이터셋인 **SAM 3D Artist Objects(SA-3DAO)**도 함께 공개될 예정이며, 이는 실제 이미지와 객체 메쉬가 쌍으로 구성된 데이터셋입니다.[^sam3d-objects]

### SAM 3D Body

인체와 형태 추정에 특화된 모델입니다. 스포츠 의학, 로보틱스, 인터랙티브 미디어 등에서 **인체 메쉬 복원**에 활용할 수 있습니다. 이 모델과 함께 **MHR(Meta Human Reconstruction)** 파라메트릭 인체 모델도 공개됩니다.[^sam3d-body]

## Segment Anything Playground

Meta는 이번 릴리스와 함께 **Segment Anything Playground**를 공개했습니다.[^playground] 누구나 자신의 이미지를 업로드하여 SAM 3와 SAM 3D의 기능을 직접 체험할 수 있습니다.

Playground에서는 텍스트 프롬프트를 통한 세그멘테이션, 비디오 객체 추적, 3D 재구성 등의 기능을 테스트할 수 있습니다. Meta의 Aria Gen 2 연구용 안경으로 촬영한 일부 영상도 데모로 제공됩니다.

## 실제 활용 사례

### 제품 적용

SAM 3와 SAM 3D는 Meta 제품에도 적용됩니다. **Facebook Marketplace의 View in Room 기능**은 SAM 3D를 활용하여 가구나 조명 같은 인테리어 제품을 구매 전에 자신의 공간에 가상으로 배치해볼 수 있게 합니다.

**Instagram의 Edits 앱**에서도 SAM 3가 곧 적용되어 비디오에서 AI 기반 세그멘테이션을 활용할 수 있게 됩니다. 또한 Meta AI 앱과 meta.ai 웹에서도 Vibes 기능을 통해 SAM 3를 사용할 수 있게 됩니다.

### 야생동물 보호 연구

Meta는 Conservation X Labs, Osa Conservation과 협력하여 **SA-FARI 데이터셋**을 공개했습니다.[^sa-fari] 이 데이터셋은 10,000개 이상의 카메라 트랩 비디오로 구성되어 있으며, 60종 이상의 야생동물이 포함되어 있습니다. SAM 3로 각 프레임의 모든 동물에 대한 세그멘테이션 마스크가 생성되어 있어, 야생동물 모니터링 연구에 활용할 수 있습니다.

해양 연구를 위한 FathomNet 협업도 진행 중이며, 해양 생물 데이터가 연구 커뮤니티에 공개될 예정입니다.

## 마치며

SAM 3와 SAM 3D의 공개는 이미지 세그멘테이션과 3D 재구성 분야에서 의미 있는 진전입니다. 특히 텍스트 프롬프트 지원과 단일 이미지에서의 3D 재구성은 실용적인 활용 가능성을 높입니다.

모든 모델 체크포인트와 코드는 GitHub에서 오픈소스로 공개되어 있으며, Hugging Face에서도 모델을 다운로드할 수 있습니다. 평가 데이터셋인 SA-Co와 SA-FARI도 함께 공개되어 연구 커뮤니티에서 벤치마크로 활용할 수 있습니다.

## Quick questions

> **SAM 3와 기존 SAM 2의 주요 차이점은 무엇인가요?**
>
> SAM 3는 기존의 마스크, 박스, 포인트 프롬프트 외에 텍스트 프롬프트를 추가로 지원합니다. 또한 감지, 세그멘테이션, 추적을 단일 모델로 통합하여 별도 모델 없이 한 번에 처리할 수 있습니다.
{: .prompt-info}

> **SAM 3D는 어떤 용도로 사용할 수 있나요?**
>
> SAM 3D Objects는 게임 에셋 생성, AR/VR 연구, 제품 시각화 등에 활용할 수 있고, SAM 3D Body는 스포츠 의학, 로보틱스, 모션 캡처 등 인체 관련 애플리케이션에 적합합니다.
{: .prompt-info}

> **SAM 3를 직접 사용해볼 수 있나요?**
>
> Meta가 공개한 Segment Anything Playground에서 직접 이미지를 업로드하여 테스트할 수 있습니다. 또한 GitHub에서 코드를 다운로드하고 Hugging Face에서 모델 체크포인트를 받아 로컬 환경에서 실행할 수도 있습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^sam3-paper]: Meta AI Research - [SAM 3: Segment Anything with Concepts](https://ai.meta.com/research/publications/sam-3-segment-anything-with-concepts/){: target="_blank"}
[^mpe]: Meta AI Blog - [Meta Perception Encoder](https://ai.meta.com/blog/meta-fair-updates-perception-localization-reasoning/){: target="_blank"}
[^sam3d-objects]: GitHub - [SAM 3D Objects Repository](https://github.com/facebookresearch/sam-3d-objects){: target="_blank"}
[^sam3d-body]: GitHub - [SAM 3D Body Repository](https://github.com/facebookresearch/sam-3d-body){: target="_blank"}
[^playground]: Meta AI Demos - [Segment Anything Playground](https://www.aidemos.meta.com/segment-anything){: target="_blank"}
[^sa-fari]: Conservation X Labs - [SA-FARI Dataset](https://www.conservationxlabs.com/sa-fari){: target="_blank"}
