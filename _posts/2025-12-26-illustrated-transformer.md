---
title: Transformer 아키텍처를 시각적으로 이해하기
description: Self-Attention 메커니즘과 Encoder-Decoder 구조를 중심으로 Transformer 모델의 핵심 원리를 시각적으로 설명합니다.
author: claude
date: '2025-12-26 13:37:54'
categories:
  - News Articles
tags:
  - Transformer
  - Deep Learning
  - NLP
  - Attention Mechanism
  - Neural Networks
  - Machine Translation
pin: false
math: true
mermaid: false
hidden: true
---

**원본 링크**: [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/){:target="_blank"}

![Transformer 아키텍처](/media/2025-12-26-illustrated-transformer/figure-1.png)

Jay Alammar의 "Illustrated Transformer"는 **현대 딥러닝의 핵심 아키텍처인 Transformer를 시각적으로 설명하는 가장 영향력 있는 글** 중 하나입니다. 이 글은 2018년 발표 이후 Stanford, Harvard, MIT, Princeton 등 주요 대학 강의에서 참고 자료로 활용되고 있으며, 10개 이상의 언어로 번역되었습니다. 2025년 업데이트에서는 이 내용이 책(LLM-book.com)의 일부로 출간되었으며, Multi-Query Attention과 RoPE Positional Embeddings 같은 최신 발전 사항도 다루고 있습니다.

## Transformer의 등장 배경

Transformer는 2017년 Google의 논문 "Attention is All You Need"에서 제안되었습니다. **기존 RNN 기반 번역 모델의 순차적 처리 한계를 극복하고 병렬화 가능성을 극대화**한 것이 핵심 혁신입니다. Google Neural Machine Translation 모델보다 우수한 성능을 보였으며, 특히 Google Cloud TPU와 같은 병렬 처리 하드웨어에서 효율적으로 학습할 수 있다는 점이 큰 장점입니다.

TensorFlow의 Tensor2Tensor 패키지와 Harvard NLP 그룹의 PyTorch 구현 가이드가 공개되어 있어, 실제 구현을 통해 학습할 수 있습니다.

## Transformer의 전체 구조

Transformer는 기계 번역 문제를 위해 설계되었습니다. 한 언어의 문장을 입력받아 다른 언어로 번역된 문장을 출력하는 구조입니다.

![Encoder-Decoder 구조](/media/2025-12-26-illustrated-transformer/figure-2.png)

블랙박스를 열어보면 **Encoding 컴포넌트, Decoding 컴포넌트, 그리고 이들 사이의 연결**로 구성되어 있습니다. Encoding 컴포넌트는 여러 개의 인코더를 쌓은 스택이며, Decoding 컴포넌트도 동일한 수의 디코더 스택으로 이루어져 있습니다. 원 논문에서는 6개의 레이어를 사용했지만, 이 숫자는 하이퍼파라미터로 조정 가능합니다.

![Encoder-Decoder 스택](/media/2025-12-26-illustrated-transformer/figure-3.png)

## Encoder의 내부 구조

모든 인코더는 동일한 구조를 가지지만 가중치는 공유하지 않습니다. 각 인코더는 두 개의 서브 레이어로 구성됩니다.

![Encoder 내부 구조](/media/2025-12-26-illustrated-transformer/figure-4.png)

### 1. Self-Attention 레이어

**Self-Attention은 입력 문장의 특정 단어를 인코딩할 때 다른 단어들을 참조할 수 있게 해주는 메커니즘**입니다. 예를 들어 "The animal didn't cross the street because it was too tired"라는 문장에서 "it"이 "animal"을 가리키는지 "street"를 가리키는지 파악할 수 있습니다.

RNN이 히든 스테이트를 통해 이전 단어의 정보를 현재 단어에 전달하는 것과 달리, **Self-Attention은 모든 위치의 단어를 동시에 참조하여 각 단어의 표현을 개선**합니다.

![Self-Attention 시각화](/media/2025-12-26-illustrated-transformer/figure-5.png)

### 2. Feed-Forward Neural Network

Self-Attention 레이어의 출력은 **각 위치마다 독립적으로 적용되는 동일한 Feed-Forward 네트워크**로 전달됩니다. 이 레이어는 위치 간 의존성이 없어 병렬 처리가 가능합니다.

## Self-Attention의 계산 과정

Self-Attention을 계산하는 첫 번째 단계는 각 입력 임베딩으로부터 세 개의 벡터를 생성하는 것입니다.

![Query, Key, Value 벡터 생성](/media/2025-12-26-illustrated-transformer/figure-6.png)

각 단어에 대해 **Query, Key, Value 세 가지 벡터**를 만듭니다. 이 벡터들은 입력 임베딩에 학습 가능한 가중치 행렬($W^Q$, $W^K$, $W^V$)을 곱하여 생성됩니다. 임베딩 크기가 512차원인 반면, 이 벡터들은 64차원으로 더 작습니다.

### Self-Attention 계산 단계

**1단계: Score 계산**

현재 단어(예: "Thinking")의 Query 벡터와 모든 단어의 Key 벡터의 내적을 계산합니다. **이 점수는 현재 위치의 단어를 인코딩할 때 다른 단어에 얼마나 집중할지를 결정**합니다.

![Score 계산](/media/2025-12-26-illustrated-transformer/figure-7.png)

**2단계: Normalize**

점수를 Key 벡터 차원의 제곱근(√64 = 8)으로 나눕니다. 이는 **더 안정적인 gradient를 얻기 위한 정규화 과정**입니다.

**3단계: Softmax**

정규화된 점수에 softmax를 적용하여 확률 분포로 변환합니다. **이 확률값은 현재 위치에서 각 단어가 얼마나 중요한지를 나타냅니다.**

![Softmax 적용](/media/2025-12-26-illustrated-transformer/figure-8.png)

**4단계: Weighted Sum**

각 Value 벡터에 softmax 점수를 곱하고 합산합니다. **높은 점수를 받은 단어는 더 많이 기여하고, 낮은 점수를 받은 단어는 약하게 기여**합니다.

![출력 계산](/media/2025-12-26-illustrated-transformer/figure-9.png)

이 과정은 행렬 연산으로 효율적으로 계산할 수 있습니다.

![행렬 계산](/media/2025-12-26-illustrated-transformer/figure-10.png)

## Multi-Head Attention

논문에서는 **단일 Attention 함수 대신 8개의 독립적인 Attention 헤드를 병렬로 실행하는 Multi-Head Attention**을 사용합니다. 각 헤드는 서로 다른 표현 부분공간에서 정보를 학습할 수 있습니다.

![Multi-Head Attention Query, Key, Value](/media/2025-12-26-illustrated-transformer/figure-11.png)

각 헤드는 독립적인 $W^Q$, $W^K$, $W^V$ 가중치 행렬을 가지며, 입력 임베딩과 곱하여 각자의 Query, Key, Value 벡터를 생성합니다.

![Multi-Head Attention 출력](/media/2025-12-26-illustrated-transformer/figure-12.png)

8개의 헤드로부터 8개의 서로 다른 $Z$ 행렬을 얻게 되지만, Feed-Forward 레이어는 단일 행렬을 기대합니다. 따라서 **이 8개 행렬을 연결(concatenate)한 후 추가 가중치 행렬 $W^O$를 곱하여 하나의 행렬로 압축**합니다.

![Multi-Head Attention 가중치 행렬](/media/2025-12-26-illustrated-transformer/figure-13.png)

![Multi-Head Attention 요약](/media/2025-12-26-illustrated-transformer/figure-14.png)

Multi-Head Attention을 사용하면 **모델이 다양한 측면에서 단어 간 관계를 파악**할 수 있습니다. 예를 들어 한 헤드는 "it"과 "animal"의 관계에 집중하고, 다른 헤드는 문장 구조나 문법적 관계를 학습할 수 있습니다.

![Multi-Head Attention 시각화](/media/2025-12-26-illustrated-transformer/figure-15.png)

## Positional Encoding

Transformer는 RNN과 달리 순차적으로 처리하지 않기 때문에, **단어의 순서 정보를 명시적으로 주입해야 합니다.** 이를 위해 Positional Encoding을 사용합니다.

![Positional Encoding 벡터](/media/2025-12-26-illustrated-transformer/figure-16.png)

각 위치마다 고유한 패턴을 가진 벡터를 생성하여 입력 임베딩에 더합니다. 논문에서는 **사인 및 코사인 함수를 사용하여 위치별 고유 패턴을 생성**합니다.

![Positional Encoding 예시](/media/2025-12-26-illustrated-transformer/figure-17.png)
_20개 단어(행)에 대한 512차원(열) Positional Encoding 시각화_

이 방식을 사용하면 모델이 **상대적 위치 관계를 학습**할 수 있습니다. 특정 오프셋만큼 떨어진 위치들은 일정한 선형 변환 관계를 가지기 때문입니다.

## Residual Connection과 Layer Normalization

각 인코더 내부의 두 서브 레이어(Self-Attention과 Feed-Forward)는 **Residual Connection과 Layer Normalization**으로 감싸져 있습니다.

![Residual Connection과 Layer Normalization](/media/2025-12-26-illustrated-transformer/figure-18.png)

실제 계산 흐름을 벡터로 표현하면 다음과 같습니다.

![벡터 표현](/media/2025-12-26-illustrated-transformer/figure-19.png)

디코더의 서브 레이어도 동일한 구조를 가집니다.

![디코더 Residual](/media/2025-12-26-illustrated-transformer/figure-20.png)

## Decoder의 동작 방식

Decoder는 Encoder와 유사하지만 **Self-Attention과 Feed-Forward 사이에 Encoder-Decoder Attention 레이어**가 추가됩니다.

![Decoder 구조](/media/2025-12-26-illustrated-transformer/figure-21.png)

Encoder-Decoder Attention 레이어는 **디코더가 입력 문장의 관련 부분에 집중할 수 있게 해줍니다.** Query는 디코더의 이전 레이어에서 오고, Key와 Value는 인코더의 최종 출력에서 가져옵니다. 이는 seq2seq 모델의 Attention 메커니즘과 유사하게 동작합니다.

### 디코딩 과정

디코딩은 자기회귀(autoregressive) 방식으로 진행됩니다. **각 시점에서 이전에 생성한 출력을 다음 입력으로 사용**합니다.

![디코딩 과정 1](/media/2025-12-26-illustrated-transformer/figure-22.gif)

![디코딩 과정 2](/media/2025-12-26-illustrated-transformer/figure-23.gif)

디코더는 벡터의 스택을 출력하며, 최상위 디코더의 출력은 **Linear 레이어와 Softmax를 거쳐 다음 단어의 확률 분포**로 변환됩니다.

![디코더 출력](/media/2025-12-26-illustrated-transformer/figure-24.png)

### 학습 과정

Linear 레이어는 **디코더가 생성한 벡터를 어휘 크기(예: 10,000개)의 로짓 벡터**로 변환하는 간단한 완전연결 신경망입니다. Softmax는 이 점수를 확률로 변환하며, **가장 높은 확률을 가진 단어가 해당 시점의 출력**이 됩니다.

![어휘 사전](/media/2025-12-26-illustrated-transformer/figure-25.png)

학습 과정에서는 모델 출력과 정답 레이블의 차이를 **Cross-Entropy Loss**로 계산합니다.

![Logits과 Label](/media/2025-12-26-illustrated-transformer/figure-26.png)

충분히 학습된 모델은 **정답 단어에 높은 확률을 할당하고 다른 단어에는 낮은 확률을 할당**하게 됩니다.

![학습된 모델의 확률 분포](/media/2025-12-26-illustrated-transformer/figure-27.png)

## 실제 활용과 확장

Transformer 아키텍처는 기계 번역을 넘어 다양한 분야로 확장되었습니다. **BERT, GPT 시리즈, T5 등 현대의 거의 모든 대규모 언어 모델이 Transformer를 기반**으로 합니다.

원 논문 이후 다양한 개선 사항이 제안되었습니다. Image Transformer는 이미지 생성에 적용했고, Training Tips 논문은 학습 안정성을 개선했으며, Self-Attention with Relative Position Representations는 위치 표현 방식을 발전시켰습니다.

Tensor2Tensor 노트북에서 실제 학습된 Transformer 모델을 로드하여 실험할 수 있으며, GitHub 저장소에서 구현 코드를 확인할 수 있습니다.

## 마치며

Transformer는 **Attention 메커니즘만으로 순차 데이터를 효과적으로 처리할 수 있음을 증명**했습니다. Self-Attention을 통한 병렬 처리, Multi-Head Attention을 통한 다각적 정보 추출, Positional Encoding을 통한 순서 정보 보존이라는 핵심 아이디어는 현대 딥러닝의 표준이 되었습니다.

Jay Alammar의 시각적 설명은 **복잡한 수학적 개념을 직관적으로 이해할 수 있게 도와주며**, 이 글이 Stanford, MIT, Harvard 등 주요 대학에서 교육 자료로 사용되는 이유입니다. Transformer를 처음 배우는 사람이라면 반드시 읽어볼 가치가 있는 자료입니다.

## Quick questions

> **Transformer가 RNN보다 빠른 이유는 무엇인가요?**
>
> RNN은 이전 단어를 처리해야 다음 단어를 처리할 수 있는 순차적 구조입니다. 반면 Transformer는 Self-Attention을 통해 모든 단어를 동시에 처리할 수 있어 GPU/TPU에서 병렬화가 가능하며, 이것이 학습 속도 향상의 핵심입니다.
{: .prompt-info}

> **Multi-Head Attention은 왜 필요한가요?**
>
> 단일 Attention 헤드는 한 가지 관점에서만 단어 간 관계를 학습합니다. Multi-Head를 사용하면 각 헤드가 서로 다른 측면(문법적 관계, 의미적 유사성, 구조적 패턴 등)을 동시에 학습할 수 있어 모델의 표현력이 향상됩니다.
{: .prompt-info}

> **Positional Encoding 없이는 작동하지 않나요?**
>
> Positional Encoding 없이는 모델이 단어 순서를 전혀 파악할 수 없습니다. "dog bites man"과 "man bites dog"를 구분할 수 없게 됩니다. Self-Attention은 집합(set)처럼 동작하기 때문에 순서 정보를 명시적으로 주입해야 합니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^attention-paper]: Vaswani et al., [Attention is All You Need](https://arxiv.org/abs/1706.03762){:target="_blank"}{: target="_blank"}
[^tensor2tensor]: Google Research, [Tensor2Tensor GitHub Repository](https://github.com/tensorflow/tensor2tensor){:target="_blank"}{: target="_blank"}
[^harvard-guide]: Harvard NLP, [The Annotated Transformer](http://nlp.seas.harvard.edu/2018/04/03/attention.html){:target="_blank"}{: target="_blank"}
[^llm-book]: [LLM Book - Chapter 3: Transformers](https://llm-book.com/){:target="_blank"}{: target="_blank"}
[^layer-norm]: Ba et al., [Layer Normalization](https://arxiv.org/abs/1607.06450){:target="_blank"}{: target="_blank"}
