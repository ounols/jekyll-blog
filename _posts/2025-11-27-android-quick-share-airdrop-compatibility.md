---
title: EU 규제가 만든 기적, 안드로이드와 아이폰의 AirDrop 호환
description: 구글이 Pixel 10에서 애플 AirDrop과의 호환을 구현한 기술적 배경과 EU 규제의 역할
author: claude
date: '2025-11-27 15:23:16'
categories:
  - News Articles
tags:
  - AirDrop
  - Quick Share
  - Wi-Fi Aware
  - EU DMA
  - Rust
  - 크로스 플랫폼
  - 보안
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [The EU made Apple adopt new Wi-Fi standards, and now Android can support AirDrop](https://arstechnica.com/gadgets/2025/11/the-eu-made-apple-adopt-new-wi-fi-standards-and-now-android-can-support-airdrop/){: target="_blank"}

![Google Pixel 10과 AirDrop 호환](/media/2025-11-27-android-quick-share-airdrop-compatibility/figure-1.jpg)

지난해 애플이 RCS 메시징을 지원한 데 이어, 이제 구글이 안드로이드 Quick Share에 애플 AirDrop과의 호환 기능을 추가했습니다. Pixel 10 시리즈를 시작으로, 안드로이드 기기가 아이폰과 직접 파일을 주고받을 수 있게 되었습니다.

## EU 규제가 바꾼 게임의 규칙

이 호환이 가능해진 배경에는 **유럽연합(EU)의 디지털시장법(DMA)**이 있습니다. 애플의 AirDrop은 Bluetooth로 기기를 발견하고, P2P Wi-Fi 연결로 파일을 전송하는 방식으로 작동합니다. 그러나 여기서 핵심은 **Apple Wireless Direct Link(AWDL)**라는 애플의 독자 프로토콜이었습니다.

AWDL은 애플이 Continuity 기능들을 위해 개발한 비표준 프로토콜로, 다른 회사들은 이 프로토콜을 사용할 수 없었습니다. 이로 인해 안드로이드 기기는 기술적으로 비슷한 기능을 구현할 수 있음에도 불구하고, AirDrop과 호환될 수 없었습니다.

하지만 2025년 초 EU는 DMA에 따라 **애플이 Wi-Fi Alliance의 표준인 Wi-Fi Aware를 채택하도록 요구**했습니다. 더 나아가 AWDL을 deprecated하고, AWDL의 기능들을 Wi-Fi Aware에 통합하여 다른 회사들도 활용할 수 있도록 했습니다.

> Wi-Fi Aware는 애플의 도움을 받아 개발된 표준입니다. 애플이 AWDL에서 수행한 작업을 기반으로 만들어졌지만, 이제는 누구나 사용할 수 있는 개방형 표준이 되었습니다.
{: .prompt-info}

## 구글이 AirDrop을 "해킹"할 수 있었던 기술적 배경

구글의 공식 발표에서는 DMA나 규제에 대한 언급이 없지만, 이번 호환 구현의 핵심은 **Wi-Fi Aware 표준으로의 전환**입니다. iOS 26과 iPadOS 26에서 Wi-Fi Aware가 추가되면서, 안드로이드는 이 표준을 통해 AirDrop과 통신할 수 있게 되었습니다.

### 1. Wi-Fi Aware 표준의 채택

애플 개발자 문서에 따르면 Wi-Fi Aware는 iPhone 12 이상, 그리고 최근 3~4년 내 출시된 대부분의 iPad에서 지원됩니다. 안드로이드는 이미 Android 8.0부터 Wi-Fi Aware를 지원해왔기 때문에, 이론적으로는 대부분의 최신 안드로이드 폰에서 소프트웨어 업데이트만으로 이 기능을 추가할 수 있습니다.

### 2. 메모리 안전 언어 Rust의 전략적 활용

구글의 보안 블로그 포스트[^security-blog]는 구현 과정에서 **Rust 프로그래밍 언어를 선택한 이유**를 상세히 설명합니다. 크로스 플랫폼 통신의 핵심은 무선 프로토콜을 통해 다른 기기에서 전송된 데이터를 수신하고 파싱하는 것입니다.

역사적으로 메모리 안전하지 않은 언어를 사용할 경우, 데이터 파싱 로직의 버그는 **고위험 보안 취약점의 가장 흔한 원인** 중 하나였습니다. 악의적으로 조작된 데이터 패킷이 메모리 안전하지 않은 언어로 작성된 파서로 전송되면 버퍼 오버플로우나 메모리 손상 버그가 발생하여 코드 실행 취약점으로 이어질 수 있습니다.

Rust는 이러한 문제에 대한 강력한 방어막을 제공합니다. **컴파일 타임에 엄격한 소유권과 차용 규칙을 강제**하여 메모리 안전성을 보장하며, 메모리 관련 버그 클래스 전체를 제거합니다. NSA와 CISA를 포함한 전 세계 보안 기관들이 Rust를 안전한 시스템 구축의 업계 표준으로 인정하는 이유입니다.

### 3. 독립적인 보안 검증

구글은 내부 위협 모델링, 프라이버시 리뷰, 침투 테스트 외에도 **NetSPI라는 제3자 보안 전문 회사에 독립적인 보안 평가**를 의뢰했습니다.[^netspi-assessment] 평가 결과, Quick Share와 AirDrop 간의 상호운용성은 안전하며, 다른 업계 구현보다 "현저히 강력"하고 어떠한 정보도 유출하지 않는다고 결론지었습니다.

> "핵심 통신 계층에 메모리 안전 Rust를 사용한 구글의 작업은 안전한 상호운용성 구축 방법의 강력한 사례입니다. 플랫폼 간 정보 공유가 안전하게 유지되도록 보장합니다."

Stanford 대학의 보안 전문가인 Dan Boneh 교수는 이와 같이 평가했습니다.

## 현재의 제약과 향후 전망

현재 Quick Share는 **AirDrop의 "모든 사람에게 10분간" 모드**에서만 작동합니다. "연락처만" 모드에서는 작동하지 않으며, 구글은 향후 애플과 협력하여 이 기능을 활성화할 기회를 환영한다고 밝혔습니다. 그러나 구글과 애플이 현재 이를 위해 협력하고 있지는 않으며, 애플은 이 작업에 전혀 관여하지 않았다는 점이 확인되었습니다.[^the-verge]

또한 macOS 26은 Wi-Fi Aware를 지원하는 운영체제 목록에 포함되지 않았습니다. 이는 macOS가 DMA 하에서 "게이트키퍼" 운영체제로 간주되지 않기 때문으로 보입니다. 따라서 안드로이드 폰은 맥의 AirDrop과는 작동하지 않을 가능성이 높습니다.

## USB-C 전환과의 유사성

애플의 Wi-Fi Aware로의 여정은 **iPhone의 USB-C 전환과 유사한 패턴**을 보입니다. 먼저 애플은 USB-C와 유사한 목표를 달성하는 독자 포트를 개발하고, 표준화된 USB-C 커넥터 개발에 기여했지만, 실제로 자사 제품에 표준화된 포트를 채택하는 것은 규제 당국의 압력이 있을 때까지 미뤘습니다.

Wi-Fi Aware의 경우도 마찬가지입니다. 애플은 Wi-Fi Aware 개발에 도움을 주었고, AWDL 작업을 기반으로 했지만, 실제로 이를 채택한 것은 EU의 요구에 따른 것이었습니다.

## 구글이 DMA를 언급하지 않는 이유

흥미롭게도 구글의 Quick Share 발표나 보안 블로그 포스트 어디에도 Wi-Fi 상호운용성 표준이나 DMA에 대한 언급은 없습니다. 이는 구글이 법 시행 이전부터 **DMA의 다양한 측면에 대해 불만을 제기**해왔기 때문으로 보입니다.[^google-complaining]

구글은 때때로 DMA를 활용하려고 시도했습니다. 예를 들어 애플의 iMessage 서비스가 개방되어야 한다고 주장한 적도 있습니다.[^imessage-argument] 하지만 현재 구글은 같은 법에 따라 **막대한 벌금 가능성에 직면**하고 있기 때문에,[^huge-fines] 보도자료에서 DMA를 명시적으로 언급하거나 칭찬하기를 원하지 않을 수 있습니다.

뉴욕 타임스는 이번 주 초 EU 규제 당국이 "과잉 규제"와 "경쟁력"에 대한 우려를 이유로 일부 기술 규제 변경을 고려 중이라고 보도했지만,[^nyt-report] 현재로서는 DMA에 대한 변경은 고려하지 않고 있다고 합니다. 한편 애플은 최근 **DMA의 완전 폐지**를 요구했습니다.[^apple-repeal]

## 마치며

EU의 규제가 없었다면 이러한 크로스 플랫폼 파일 공유는 실현되지 않았을 것입니다. 애플의 독자 프로토콜 AWDL은 다른 기업들의 접근을 차단했고, 규제 당국의 개입이 Wi-Fi Aware라는 개방형 표준으로의 전환을 촉발시켰습니다.

구글은 메모리 안전 Rust를 활용하여 보안을 최우선으로 하는 구현을 완성했으며, 독립적인 보안 검증을 통해 그 안전성을 입증했습니다. 현재는 Pixel 10에서만 지원되지만, 향후 더 많은 안드로이드 기기로 확대될 예정입니다.

플랫폼 간 장벽이 낮아지는 것은 사용자에게 긍정적인 변화입니다. 친구나 가족이 어떤 폰을 사용하든 쉽게 소통하고 파일을 공유할 수 있는 환경은 기술이 나아가야 할 방향입니다.

## Quick questions

> **Quick Share는 모든 안드로이드 폰에서 AirDrop과 호환되나요?**
>
> 현재는 Pixel 10 시리즈에서만 지원됩니다. 구글은 향후 더 많은 안드로이드 기기로 확대할 계획이지만, 구체적인 일정이나 하드웨어/소프트웨어 요구사항은 아직 발표하지 않았습니다.
{: .prompt-info}

> **맥(Mac)에서도 안드로이드와 AirDrop을 사용할 수 있나요?**
>
> 아니요, macOS 26은 Wi-Fi Aware를 지원하는 운영체제 목록에 포함되지 않았습니다. macOS는 DMA의 "게이트키퍼" 운영체제로 간주되지 않기 때문으로 보입니다.
{: .prompt-info}

> **보안 측면에서 안전한가요?**
>
> 네, 구글은 메모리 안전 언어인 Rust로 구현했으며, 제3자 보안 전문 회사인 NetSPI의 독립적인 보안 평가를 통해 안전성을 검증받았습니다. 파일은 P2P로 직접 전송되며 서버를 거치지 않습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^security-blog]: Google Security Blog - [Android Quick Share Support for AirDrop: A Secure Approach to Cross-Platform File Sharing](https://security.googleblog.com/2025/11/android-quick-share-support-for-airdrop-security.html){: target="_blank"}
[^netspi-assessment]: NetSPI - [Google Feature Review Report](https://www.netspi.com/wp-content/uploads/2025/11/google-feature-review-report.pdf){: target="_blank"}
[^the-verge]: The Verge - [iPhone AirDrop Android Quick Share Pixel 10](https://www.theverge.com/news/825228/iphone-airdrop-android-quick-share-pixel-10){: target="_blank"}
[^google-complaining]: Ars Technica - [On DMA Eve, Google Whines, Apple Sounds Alarms, and TikTok Wants Out](https://arstechnica.com/tech-policy/2024/03/on-dma-eve-google-whines-apple-sounds-alarms-and-tiktok-wants-out/){: target="_blank"}
[^imessage-argument]: Ars Technica - [Google argues iMessage should be regulated by the EU's Digital Markets Act](https://arstechnica.com/gadgets/2023/11/google-argues-imessage-should-be-regulated-by-the-eus-digital-markets-act/){: target="_blank"}
[^huge-fines]: Ars Technica - [EU accuses Google and Apple of stifling competition under Digital Markets Act](https://arstechnica.com/apple/2025/03/eu-accuses-google-and-apple-of-stifling-competition-under-digital-markets-act/){: target="_blank"}
[^nyt-report]: The New York Times - [Europe Big Tech](https://www.nytimes.com/2025/11/17/technology/europe-big-tech.html){: target="_blank"}
[^apple-repeal]: Ars Technica - [Apple demands EU repeal the Digital Markets Act](https://arstechnica.com/tech-policy/2025/09/apple-demands-eu-repeal-the-digital-markets-act/){: target="_blank"}
