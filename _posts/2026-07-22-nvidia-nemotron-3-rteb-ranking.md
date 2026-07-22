---
title: "NVIDIA Nemotron 3 임베드 모델, RTEB 1위 달성 및 에이전트 검색 발전"
description: "엔비디아는 검색 품질 향상과 다양한 배포 옵션을 제공하는 오픈 및 상용 임베딩 모델인 Nemotron 3 Embed를 출시했습니다."
author: claude
date: '2026-07-22 16:53:46'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [NVIDIA Nemotron 3 Embed Ranks #1 Overall on RTEB, Advancing Agentic Retrieval](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-07-22-nvidia-nemotron-3-rteb-ranking/figure-1.png)

엔비디아는 검색 품질 향상과 다양한 배포 옵션을 제공하는 오픈 및 상용 임베딩 모델인 Nemotron 3 Embed를 출시했습니다. 이 컬렉션에는 RTEB 순위에서 1위를 차지한 8B 모델을 포함하여, 생산 규모 배포에 적합한 효율적인 1B 변형 모델들이 포함되어 있습니다.

## Retrieval의 중요성

* 다단계 에이전트 워크플로우에서 **검색의 핵심 역할** 수행
* 부실한 검색은 에이전트가 `irrelevant context`를 가져오는 원인
* 불필요한 컨텍스트로 인한 **토큰 예산 낭비** 발생
* 후속 추론 단계로 `noise` 유입으로 인한 **오류 가능성 증가**
* `Nemotron 3 Embed`[^ref19][^ref11][^ref10][^ref9][^ref8][^ref6]를 통한 `RAG` 및 에이전트 검색 **품질 향상 목표**

## 모델 구성 및 역할

* **오픈 및 상업적 이용**이 가능한 임베딩 모델 컬렉션 출시
* `Nemotron-3-Embed-8B-BF16`[^ref21]: RTEB[^ref15][^ref12][^ref2]에서 **1위**를 달성한 플래그십 임베딩 모델
* `Nemotron-3-Embed-1B-BF16`[^ref7]: **비용 및 지연 시간**에 민감한 프로덕션 환경을 위한 고효율 모델
* `Nemotron-3-Embed-1B-NVFP4`[^ref4]: **초고처리량** 및 대규모 인프라에 최적화된 하드웨어 가속 변형

## 성능 및 벤치마크 결과

![retrieval_accuracy_vertical_longembed_with_gemma_no_gap_y0_y100_1dp](/media/2026-07-22-nvidia-nemotron-3-rteb-ranking/figure-2.png)

* `Nemotron-3-Embed-8B-BF16` 모델, `RTEB`에서 **78.5%**의 점수 기록
* `Nemotron-3-Embed-8B-BF16` 모델, `MMTEB Retrieval`[^ref17][^ref3][^ref1]에서 **75.5%**의 점수 기록
* `Nemotron-3-Embed-1B-BF16` 모델, `RTEB`에서 **72.4%**의 점수 기록
* 모델 평가는 `RTEB`, `ViDoRe V3 Text`[^ref16], `MMTEB Retrieval`, `LongEmbed`[^ref18] 등에서 수행

## 핵심 기술 기능

* `32k` 컨텍스트 윈도우 지원으로 **긴 문서** 및 다중 턴 에이전트 기록 검색 가능
* 다국어 및 코드 검색 지원을 통해 **글로벌 기업 데이터**와 다중 파일 코드 리포지토리 검색 가능
* 오픈 가중치, 데이터셋, 레시피 제공으로 팀의 **모델 제어권** 확보 (검사, 튜닝, 미세 조정 및 배포)

## 배포 및 효율성

* **Blackwell 최적화**[^ref20] `NVFP4`를 통한 고처리량 검색을 위한 4비트 배포 경로 제공
* `Hugging Face`에서 즉시 사용 가능하며, `NVIDIA NIM`[^ref23][^ref22][^ref14][^ref13][^ref5] 마이크로서비스로 배포 가능한 구조
* 평가 기준은 검색 품질, 에이전트 효율성, **배포 트레이드오프** 세 가지 차원 포함

## 맞춤화 및 확장성

* `NVIDIA NeMo AutoModel` 레시피를 통한 **도메인 적응** 및 모델 압축 기능 제공
* `Open Weights` 및 레시피 제공으로 **자체 인프라**에서의 모델 튜닝 및 배포 가능
* 프로덕션 규모의 `RAG` 및 **에이전트 메모리** 구현을 위한 모델 지원

## 마치며

NVIDIA는 검색 품질 향상 및 다양한 배포 옵션을 제공하는 NVIDIA Nemotron 3 Embed 모델 컬렉션을 출시했습니다. 이 컬렉션에는 RTEB 벤치마크에서 1위를 차지한 8B 플래그십 모델과 생산 규모 배포에 적합한 효율적인 1B 변형 모델들이 포함되어 있습니다. 개발자들은 이 모델들을 활용하여 RAG, 에이전트 검색, 코드 검색 등 다양한 애플리케이션에 적용할 수 있습니다.

## Quick questions

> **NVIDIA Nemotron 3 Embed 모델이 주목받는 주요 이유는 무엇입니까?**
>
> NVIDIA Nemotron 3 Embed는 검색 품질을 향상시키기 위해 설계된 임베딩 모델 모음입니다. 특히 8B 모델이 RTEB 벤치마크에서 1위를 차지하며 최첨단 검색 성능을 입증했습니다.
{: .prompt-info}

> **개발자들이 실제 서비스에 적용할 때 고려할 수 있는 모델 선택지는 무엇이며, 각각의 장점은 무엇입니까?**
>
> 세 가지 모델이 제공됩니다. 최고 품질이 필요한 경우 Nemotron-3-Embed-8B-BF16를, 지연 시간과 비용이 중요한 운영 환경에는 Nemotron-3-Embed-1B-BF16를, 그리고 최고 처리량과 대규모 인프라가 필요한 경우에는 Blackwell에 최적화된 Nemotron-3-Embed-1B-NVFP4를 사용할 수 있습니다.
{: .prompt-info}


> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^ref1]: [Evaluation: Retrieval Quality, Agentic Efficiency, and Deployment Tradeoffs](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb#evaluation-retrieval-quality-agentic-efficiency-and-deployment-tradeoffs){:target="_blank"}
[^ref2]: [RTEB Leadership and Strong Gains Across Retrieval Benchmarks](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb#rteb-leadership-and-strong-gains-across-retrieval-benchmarks){:target="_blank"}
[^ref3]: [Why Better Retrieval Matters for Agents](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb#why-better-retrieval-matters-for-agents){:target="_blank"}
[^ref4]: [Scaling Retrieval with NVFP4 on Blackwell](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb#scaling-retrieval-with-nvfp4-on-blackwell){:target="_blank"}
[^ref5]: [Day 0 Performant NIM](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb#day-0-performant-nim){:target="_blank"}
[^ref6]: [How We Built the Nemotron 3 Embed Models](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb#how-we-built-the-nemotron-3-embed-models){:target="_blank"}
[^ref7]: [Scaling Down to 1B](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb#scaling-down-to-1b){:target="_blank"}
[^ref8]: [NVIDIA Nemotron 3 Embed](https://huggingface.co/collections/nvidia/nemotron-3-embed){:target="_blank"}
[^ref9]: [Nemotron-3-Embed-8B-BF16](https://huggingface.co/nvidia/Nemotron-3-Embed-8B-BF16){:target="_blank"}
[^ref10]: [Nemotron-3-Embed-1B-BF16](https://huggingface.co/nvidia/Nemotron-3-Embed-1B-BF16){:target="_blank"}
[^ref11]: [Nemotron-3-Embed-1B-NVFP4](https://huggingface.co/nvidia/Nemotron-3-Embed-1B-NVFP4){:target="_blank"}
[^ref12]: [RTEB Multilingual Leaderboard](https://mteb-leaderboard.hf.space/benchmark/RTEB%28beta%29){:target="_blank"}
[^ref13]: [NVIDIA NeMo AutoModel](https://github.com/nvidia-nemo/automodel){:target="_blank"}
[^ref14]: [NVIDIA NIM](https://build.nvidia.com/nvidia/nemotron-3-embed-1b){:target="_blank"}
[^ref15]: [RTEB](https://huggingface.co/blog/rteb){:target="_blank"}
[^ref16]: [ViDoRe V3](https://huggingface.co/blog/QuentinJG/introducing-vidore-v3){:target="_blank"}
[^ref17]: [MMTEB](https://arxiv.org/abs/2502.13595){:target="_blank"}
[^ref18]: [LongEmbed](https://github.com/dwzhu-pku/longembed){:target="_blank"}
[^ref19]: [Nemotron 3 Ultra](https://github.com/NVIDIA-NeMo/Nemotron/tree/main/usage-cookbook/Nemotron-3-Ultra){:target="_blank"}
[^ref20]: [NVIDIA Blackwell architectures](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/){:target="_blank"}
[^ref21]: [Ministral-3-8B-Instruct-2512](https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512){:target="_blank"}
[^ref22]: [NVIDIA ModelOpt](https://github.com/NVIDIA/Model-Optimizer){:target="_blank"}
[^ref23]: [NVIDIA NIM](https://build.nvidia.com/nvidia/nemotron-3-embed-1b/){:target="_blank"}
