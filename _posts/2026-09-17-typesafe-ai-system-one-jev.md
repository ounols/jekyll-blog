---
title: "TypeSafe AI, 시스템 원 모델 'Jev' 공개"
description: "TypeSafe AI는 자동화를 위해 설계된 머신 네이티브 지능 인프라를 개발했으며, 이를 통해 첫 번째 시스템 원 모델인 Jev를 공개했습니다."
author: claude
date: '2026-09-17 16:32:03'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-09-17-typesafe-ai-system-one-jev/figure-1.jpg)

TypeSafe AI는 자동화를 위해 설계된 머신 네이티브 지능 인프라를 개발했으며, 이를 통해 첫 번째 시스템 원 모델인 Jev를 공개했습니다. Jev는 기존 대규모 언어 모델과 유사한 수준의 지능을 보이지만, 두 자릿수 더 빠르고 효율적이며 구조화된 결정에 최적화되어 있습니다.

## AI 개발 동기 및 비전

* Diogo Almeida가 `OpenAI`에서 `ChatGPT` 연구 개발에 참여하며 언어 모델의 지시 이해 및 대화 기능 구축에 기여
* 기존 채팅 모델의 발전에도 불구하고, **핵심적인 부분이 부족**함을 발견하며 새로운 기술 개발의 동기 부여

## 시스템 원 모델의 정의 및 구조

* TypeSafe[^ref1] AI는 **자동화를 위한 기계 네이티브 지능 인프라**를 구축하는 AI 연구소
* 첫 번째 시스템 원 모델인 `Jev`는 **빠르고 구조화된 결정**을 내리도록 설계된 새로운 프론티어 모델 계열
* 새로운 스택은 **새로운 모델 아키텍처**, `병렬 샘플러`, 그리고 `Reinforcement Learning for Calibrated Decisions` (`RLCD`)를 포함

## 입력 및 출력 방식의 차이

* 기존 LLM[^ref2]은 `순차적 메시지`에 중점을 둔 비정형 데이터 입력
* 시스템 원 모델은 **`구조화된 프로그램 상태`**에 중점을 둔 비정형 데이터 입력
* 기존 LLM은 `문자열` 또는 생성된 텍스트 출력 (소프트웨어 사용을 위해 파싱 및 검증 필요, AI 오작동 위험 존재)
* 시스템 원 모델은 **`타입 안전한 구조화된 값`** 출력
* 출력 구조가 사전에 정의되어 모델이 `타입 오류`를 발생시키지 않음
* 모든 답변에 `보정된 확률` 및 `신뢰 점수`가 동반됨

## 성능 및 효율성 지표

| 지표 | 기존 LLM | TypeSafe System One/Jev |
| --- | --- | --- |
| 응답 시간 | `3` ~ `329` seconds | `70ms` ~ `500ms` |
| 속도 비교 | 기준 모델 | **`40`배 ~ `200`배 더 빠른 응답 시간 달성** |
| 효율성 | 기존 LLM | Jev는 기존 LLM 대비 **두 자릿수 더 빠르고 효율적** |

## 신뢰성 및 의사결정의 정확성

* 모델 학습에 `Reinforcement Learning for Calibrated Decisions` (`RLCD`) 사용, **의사결정의 보정성 강화**
* 모든 답변에 보정된 확률 및 신뢰도 점수 동반, **결과의 예측 가능성 제공**
* 모든 출력에서 자신감과 불확실성 전달, **지속적인 일관성 유지**

## 활용 사례 및 경제성

* 인간 개입형 작업 (챗봇, 코파일럿, 코딩 에이전트) 활용
* **검증 가능한 문제** (수학 증명, 커널 최적화) 해결에 적용
* TypeSafe 입력 토큰 비용은 `$`0.042/MTok`
* TypeSafe 출력 토큰 **무료 제공**

## 마치며

TypeSafe AI는 자동화를 위해 설계된 머신 네이티브 지능 인프라를 선보이며 첫 번째 시스템 원 모델인 Jev를 공개했습니다. Jev는 기존 LLM과 유사한 수준의 지능을 보이지만, 두 자릿수 더 빠르고 효율적이며 구조화된 결정에 최적화되어 있습니다. 이 모델은 비정형 상태를 입력받아 타입이 지정된 확률적 결정을 출력하는 방식으로 작동합니다. TypeSafe AI는 RLCD라는 새로운 학습 방법을 통해 보다 정량화된 결정을 제공한다고 밝혔습니다.

## Quick questions

> **TypeSafe AI가 개발한 'System One Model'은 기존 LLM과 어떤 차이가 있습니까?**
>
> System One Model은 소프트웨어 내에서 빠르고 구조화된 결정을 내리도록 설계된 새로운 유형의 모델입니다. 기존 LLM이 텍스트 생성에 중점을 둔다면, 이 모델은 구조화된 출력을 위해 최적화되어 있으며 환각 현상이 없습니다.
{: .prompt-info}

> **새로운 모델 Jev의 주요 장점은 무엇이며, 어떤 방식으로 작동합니까?**
>
> Jev는 기존 LLM과 유사한 수준의 지능을 System One 작업에서 달성하면서도, 기존 모델보다 두 자릿수(two orders of magnitude) 더 빠르고 효율적입니다. 이는 비정형 상태를 입력받아 유형화된 확률적 결정(typed probabilistic decisions)을 출력하는 방식으로 작동합니다.
{: .prompt-info}


> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^ref1]: [actual query](https://console.typesafe.ai/playground?share=shr_13a74b495fb786c4bd7964f11597301e7c9){:target="_blank"}
[^ref2]: [System One LLM](https://github.com/typesafe-ai/system-one-adapter-python){:target="_blank"}
