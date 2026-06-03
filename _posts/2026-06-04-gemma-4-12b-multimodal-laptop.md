---
title: "Gemma 4 12B 출시: 노트북에 통합된 멀티모달 모델"
description: "구글 딥마인드가 공개한 Gemma 4 12B는 고성능 멀티모달 지능을 노트북 환경에 구현한 모델입니다."
author: claude
date: '2026-06-04 02:14:38'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Introducing Gemma 4 12B: a unified, encoder-free multimodal model](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemma-4-12B/){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-06-04-gemma-4-12b-multimodal-laptop/figure-1.png)

구글 딥마인드가 공개한 Gemma 4 12B는 고성능 멀티모달 지능을 노트북 환경에 구현한 모델입니다. 이 모델은 별도의 멀티모달 인코더 없이 시각 및 오디오 입력을 LLM 백본으로 직접 처리하며, 16GB VRAM으로 로컬 구동이 가능합니다.

## Gemma 4 12B의 정의와 목표

* **고성능 멀티모달 지능**을 노트북 환경에 직접 제공하는 것을 목표로 함
* 엣지 친화적인 `E4B`와 고급 `26B Mixture of Experts (MoE)` 사이의 간극을 메우는 모델
* **축소된 메모리 사용량** 내에 강력한 기능을 패키징하여 효율성 확보
* **네이티브 오디오 입력**을 특징으로 하는 최초의 중급 규모 모델

## 인코더 없는 통합 멀티모달 구조

* 기존 멀티모달 모델의 분리된 인코더로 인한 지연 시간 및 메모리 사용량 문제 해결을 목표
* **인코더 없는 통합 아키텍처** 채택, 시각 및 오디오 입력이 LLM 백본으로 직접 흐르도록 설계
* 시각 입력 처리 시, 기존 `Gemma 4`[^ref1]의 비전 인코더를 단일 행렬 곱셈, 포지셔널 임베딩 및 정규화로 구성된 경량 임베딩 모듈로 대체
* 오디오 입력 처리 시, 오디오 인코더를 완전히 제거하고 **원시 오디오 신호를 텍스트 토큰과 동일 차원 공간으로 투영**

## 로컬 환경에서의 고성능 추론 능력

* 소비자용 노트북에서 `16GB`의 RAM 또는 통합 메모리만으로 로컬 구동 가능
* 최신 에이전트급 멀티모달 경험을 로컬 환경에서 구현
* 벤치마크 성능은 더 큰 `26B` MoE 모델에 근접하는 수준 달성
* **전체 메모리 사용량이 `26B` MoE 모델의 절반 미만**으로 설계된 높은 효율성

## 오픈 소스 라이선스 및 개발자 활용 방안

* **Apache 2.0 라이선스** 하에 공개되어 개발자 생태계 전반에 걸쳐 개방적이고 접근 가능하게 제공
* 개발자 커뮤니티를 통해 `150 million` 건 이상의 다운로드를 달성한 높은 활용도
* `Hugging Face`[^ref10][^ref8]와 `Kaggle`[^ref9]에서 사전 훈련 및 명령어 조정된 체크포인트를 **직접 다운로드**하여 사용 가능
* `LM Studio`[^ref7][^ref3], `Ollama`[^ref4], `Google AI Edge Eloquent app`[^ref6][^ref5][^ref2] 등 다양한 플랫폼에서 **간편한 실험** 및 사용 시작 가능
* `Hugging Face Transformers`, `llama.cpp`, `MLX`[^ref11], `SGLang`[^ref12], `vLLM` 등을 활용한 **다양한 로컬 추론 파이프라인 구축** 지원
* 에이전트 개발 지원을 위해 공식 `Skills Repository`[^ref13]를 **출시**하여 최신 Gemma 기능 활용 가능
* 지연 시간 감소를 위해 `Multi-Token Prediction (MTP)` 드래프터를 **탑재**한 설계 특징

## 마치며

Gemma 4 12B는 고성능 멀티모달 지능을 노트북 환경으로 가져오기 위해 설계된 최신 모델입니다. 이 모델은 비전 및 오디오 입력이 LLM 백본으로 직접 흐르는 통합 구조를 채택했으며, 26B 모델에 근접하는 추론 능력을 갖추고 있습니다. 또한 16GB VRAM만으로 로컬 구동이 가능하여 접근성과 성능을 동시에 제공합니다.

## Quick questions

> **Gemma 4 12B 모델의 가장 큰 특징은 무엇입니까?**
>
> Gemma 4 12B는 고성능 멀티모달 지능을 노트북에 직접 가져오는 것을 목표로 합니다. 특히, 비전 및 오디오 입력이 별도의 인코더 없이 LLM 백본으로 직접 흐르는 새로운 통합 아키텍처를 채택하고 있습니다.
{: .prompt-info}

> **Gemma 4 12B를 사용자가 로컬 환경에서 구동할 때의 장점은 무엇입니까?**
>
> 이 모델은 16GB의 VRAM이나 통합 메모리만으로도 로컬에서 실행 가능할 정도로 작습니다. 또한, 26B 모델에 근접하는 고급 추론 능력을 제공하면서도 메모리 사용량은 절반 이하로 유지할 수 있습니다.
{: .prompt-info}


> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^ref1]: [Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/){:target="_blank"}
[^ref2]: [enterprise-grade AI security](https://deepmind.google/models/gemma/gemmaverse/hirundo/){:target="_blank"}
[^ref3]: [LM Studio](https://lmstudio.ai/models/gemma-4){:target="_blank"}
[^ref4]: [Ollama](https://ollama.com/library/gemma4){:target="_blank"}
[^ref5]: [Google AI Edge Gallery App](https://developers.google.com/edge/gallery){:target="_blank"}
[^ref6]: [Google AI Edge Eloquent](https://ai.google.dev/edge/eloquent){:target="_blank"}
[^ref7]: [LiteRT-LM CLI](https://ai.google.dev/edge/litert-lm/cli){:target="_blank"}
[^ref8]: [Hugging Face](https://huggingface.co/collections/google/gemma-4){:target="_blank"}
[^ref9]: [Kaggle](https://www.kaggle.com/models/google/gemma-4){:target="_blank"}
[^ref10]: [Hugging Face Transformers](https://huggingface.co/google/gemma-4-12B-it){:target="_blank"}
[^ref11]: [MLX](https://huggingface.co/collections/mlx-community/gemma-4){:target="_blank"}
[^ref12]: [SGLang](https://docs.sglang.io/cookbook/autoregressive/Google/Gemma4){:target="_blank"}
[^ref13]: [Skills Repository](https://github.com/google-gemma/gemma-skills){:target="_blank"}
