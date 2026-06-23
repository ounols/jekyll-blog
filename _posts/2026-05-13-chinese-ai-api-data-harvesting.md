---
title: "중국 불법 시장, AI API 도난 계정으로 판매하며 사용자 데이터 수집"
description: "Researchers find proxy services discreetly swap AI models and log everything."
author: claude
date: '2026-05-13 15:41:18'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Chinese grey market sells Claude API access at 90% off by using stolen credentials, model substitution, and harvesting users' prompts and outputs for resale as AI training data — 'transfer stations' operate through proxy networks that harvest user data](https://www.tomshardware.com/tech-industry/artificial-intelligence/chinese-grey-market-sells-claude-api-access-at-90-percent-off-through-proxy-networks-that-harvest-user-data){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-05-13-chinese-ai-api-data-harvesting/figure-1.jpg)

연구에 따르면, 중국의 API 프록시 서비스인 '전송 스테이션'들이 Anthropic의 클로드 모델 접근 권한을 공식 가격의 10% 수준으로 재판매하고 있습니다. 이들은 도난당한 인증 정보, 모델 대체, 사용자 프롬프트 및 출력물을 AI 학습 데이터로 수집하는 방식으로 이러한 저가 운영을 유지하고 있는 것으로 밝혀졌습니다.

## 중국 그레이 마켓의 등장

중국에서 API 프록시 서비스를 중심으로 하는 그레이 마켓 경제가 형성되었습니다. 이 시장은 앤트로픽(Anthropic)의 클로드 모델 접근 권한을 재판매하고 있습니다.

해당 프록시 네트워크는 중국 개발자 커뮤니티에서 "트랜스퍼 스테이션(transfer stations)"으로 알려져 있으며, 공식 가격의 최대 10% 수준으로 접근 권한을 판매하고 있습니다.

이러한 네트워크들은 GitHub, Taobao, Telegram과 같은 플랫폼에서 공개적으로 운영되고 있는 것으로 확인되었습니다.

옥스퍼드 중국 정책 연구소의 Zilan Qian 연구원이 보도한 조사에 따르면, 이 그레이 마켓은 저가 판매를 통해 중국 내에서 활발하게 활동하고 있습니다.

## API 접근 방식과 저가 판매 구조

중국 내 API 프록시 서비스의 그레이 마켓 경제가 활발하게 운영되고 있습니다.

이러한 네트워크는 앤트로픽의 클로드 모델 접근 권한을 공식 가격의 10% 수준으로 재판매하고 있습니다.

중국 개발자 커뮤니티에서는 이러한 프록시 네트워크를 "전송 스테이션(transfer stations)"이라고 부릅니다.

이들은 GitHub, Taobao, Telegram과 같은 플랫폼에서 공개적으로 활동하고 있습니다.

이처럼 저렴한 가격을 유지하는 구조는 도용된 자격 증명 및 데이터 수집 방식을 복합적으로 활용하고 있습니다.

## 모델 대체 및 자격 증명 도용 메커니즘

*   중국 개발자 커뮤니티에서 '전송 스테이션(transfer stations)'으로 불리는 API 프록시 네트워크가 존재합니다.
*   이 프록시 네트워크들은 GitHub, Taobao, Telegram과 같은 플랫폼에서 공개적으로 운영되고 있습니다.
*   이들은 공식 가격보다 훨씬 낮은 가격을 유지하기 위해 복합적인 메커니즘을 사용합니다.
*   핵심적인 방법 중 하나는 도난당한 자격 증명(stolen credentials)을 사용하여 Claude 모델에 접근하는 것입니다.
*   또한, 모델 대체(model substitution) 기법을 활용하여 접근 방식을 우회하고 있습니다.
*   이러한 자격 증명 도용 및 모델 대체 방식이 저가 판매 구조를 가능하게 하는 주요 메커니즘입니다.

## 사용자 데이터 수집 및 재판매 과정

해당 중국 내 API 프록시 서비스인 '전송 스테이션'들은 사용자 데이터를 수집하고 재판매하는 방식으로 수익을 창출하고 있습니다.

이러한 네트워크들은 사용자의 프롬프트와 응답(outputs)을 적극적으로 수확(harvesting)합니다. 수집된 이 데이터는 단순한 로그 기록을 넘어, 인공지능 훈련 데이터로 재판매되는 핵심 자원으로 활용됩니다.

이 프록시 네트워크들은 GitHub, Taobao, Telegram과 같은 플랫폼을 통해 공개적으로 운영되고 있습니다. 이들이 사용자 데이터를 수집하고 재판매하는 과정은 저가 판매 구조를 유지하는 주요 동력 중 하나입니다.

## 미국 정부와 앤트로픽의 경고 및 조사 결과

이러한 조사 결과는 최근 미국 정부와 앤트로픽이 발표한 경고의 타당성을 입증하고 있습니다.

백악관은 지난 4월 말, 중국 실체들이 미국 최첨단 모델에 대해 "산업 규모"의 증류 캠페인을 진행하고 있다고 비난했습니다. 이 캠페인에는 수만 개의 프록시 계정이 사용된 것으로 알려졌습니다.

한편, 앤트로픽 역시 2월에 유사한 활동을 공개했습니다. 앤트로픽은 중국 연구소와 연관된 약 24,000개의 사기 계정을 확인했습니다. 이 계정들에는 DeepSeek, Moonshot AI, MiniMax 등이 포함되어 있습니다.

## 마치며

연구에 따르면 중국 내 API 프록시 서비스들은 클로드 모델 접근 권한을 공식 가격의 10% 수준으로 재판매하는 회색 시장을 운영하고 있습니다. 이들 "전송 스테이션"은 도난당한 계정, 모델 대체, 사용자의 프롬프트 및 출력을 수집하여 AI 학습 데이터로 되파는 방식으로 운영됩니다. 이러한 행태는 화이트하우스와 앤트로픽이 경고했던 중국 기관들의 산업적 규모의 데이터 정제 캠페인에 대한 우려를 뒷받침하는 조사 결과입니다.

## Quick questions

> **중국 내에서 운영되는 '전송 스테이션'은 어떻게 클로드 API 접근을 저렴하게 판매하고 있습니까?**
>
> 이러한 프록시 네트워크는 도난당한 자격 증명, 모델 대체, 그리고 사용자 프롬프트 및 출력 데이터를 수집하여 AI 학습 데이터로 재판매하는 방식으로 운영됩니다. 이로 인해 공식 가격의 10% 수준으로 접근이 가능해지고 있습니다.
{: .prompt-info}

> **이러한 불법적인 AI 모델 사용 및 데이터 수집 행위가 초래하는 주요 위험은 무엇입니까?**
>
> 이러한 활동은 미국 최첨단 모델에 대한 대규모 증류 캠페인을 실행하는 행위로 간주됩니다. 또한, 사용자 데이터를 수집하여 재판매하는 과정은 심각한 데이터 보안 및 지적 재산권 침해 문제를 야기하고 있습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

