---
title: 2025년 3분기 전 세계 인터넷 장애 분석 - Cloudflare 리포트
description: 정부 검열부터 총알 한 발까지, 2025년 3분기 전 세계에서 발생한 주요 인터넷 장애 사례들을 Cloudflare의 트래픽 데이터로 분석합니다.
author: claude
date: '2025-11-19 09:00:00'
categories:
  - News Articles
tags:
  - Cloudflare
  - Internet Outage
  - Network Security
  - Infrastructure
  - Internet Disruption
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Online outages: Q3 2025 Internet disruption summary](https://blog.cloudflare.com/q3-2025-internet-disruption-summary){: target="_blank"}

![Q3 2025 Internet Disruption Summary](/media/2025-11-19-cloudflare-q3-2025-internet-disruption-summary/figure-1.webp)

Cloudflare가 2025년 3분기 동안 전 세계에서 발생한 인터넷 장애 사례들을 분석한 보고서를 발표했습니다. 이번 분기에는 정부 주도의 차단부터 우발적인 케이블 손상까지 다양한 원인으로 인한 장애가 발생했습니다.

## 2025년 3분기 주요 장애 원인

2025년 3분기에는 다양한 원인으로 인한 인터넷 장애가 전 세계적으로 발생했습니다. **정부 주도의 인터넷 차단**이 가장 빈번하게 관찰되었으며, 특히 시험 기간 동안의 차단이 두드러졌습니다.[^exam-shutdowns]

케이블 손상 역시 주요 장애 원인 중 하나였습니다. 해저 케이블과 지상 케이블 모두에서 손상이 발생했으며, 특히 텍사스에서는 **유탄 한 발로 인한 케이블 손상**이라는 이례적인 사례도 있었습니다.[^stray-bullet] 지브롤터에서는 무단 작업을 수행한 계약업체로 인한 전력 공급 중단이 발생했습니다.[^gibraltar]

자연재해와 기술적 문제도 영향을 미쳤습니다. 지진과 화재로 인한 인프라 손상, 사이버 공격, 그리고 중국 만리방화벽의 기술적 오류 등이 여러 국가에서 트래픽 손실을 초래했습니다.[^technical-issues]

## 정부 주도 인터넷 차단

### 1. 수단의 시험 관련 차단

수단에서는 7월 7일부터 10일까지 매일 12:00-15:00 UTC(현지 시각 14:00-17:00) 동안 규칙적인 트래픽 감소가 관찰되었습니다.[^sudan] 이는 2024년 중등학교 졸업시험의 마지막 4일간 시행된 정부 주도 차단으로 분석됩니다.

주요 통신사들의 트래픽이 크게 감소했습니다. Sudatel (AS15706)에서는 부분적인 장애가, SDN Mobitel (AS36998)과 MTN Sudan (AS36972)에서는 거의 완전한 장애가 관찰되었습니다. Cloudflare의 1.1.1.1 DNS 리졸버로의 트래픽도 동일하게 감소했습니다.

### 2. 시리아의 셀룰러 네트워크 차단

시리아는 2025년 2분기에 이어 3분기에도 시험 부정행위 방지를 위한 인터넷 차단을 시행했습니다.[^syria] 이번에는 셀룰러 네트워크만을 대상으로 한 선택적 차단이 특징이었습니다.

시험 기간이 끝난 후 시리아 교육부는 텔레그램을 통해 차단의 정당성을 주장하는 메시지를 게시했습니다.[^syria-telegram] 이는 교육의 무결성을 보호하고 시험 과정에서의 부정행위를 방지하기 위한 조치였다는 설명이었습니다.

### 3. 베네수엘라의 ISP 폐쇄

8월 18일 베네수엘라에서는 이례적인 정부 주도 차단이 발생했습니다. SuperCable (AS22313)이 서비스를 중단했으며, 베네수엘라 인터넷 감시 단체인 VE sin Filtro에 따르면 **통신위원회 CONATEL이 2025년 3월 14일부로 SuperCable의 운영 허가를 취소**했다고 합니다.[^venezuela]

SuperCable은 가입자들에게 6개월 이내에 다른 서비스 제공업체를 찾으라고 안내했습니다. 8월 19-21일과 9월 16일에 완전한 트래픽 손실이 발생했으며, 9월 25일에는 IPv4 주소 블록이 95개에서 63개로 감소하여 그 수준이 분기 말까지 유지되었습니다.

### 4. 이라크의 반복적인 시험 차단

이라크에서는 7월과 8-9월에 걸쳐 두 차례의 시험 관련 인터넷 차단이 발생했습니다. 7월에는 중학교 시험을 위해 본토에서 7월 3일까지, 쿠르디스탄 지역에서 7월 6일까지 차단이 시행되었습니다.[^iraq-july]

쿠르디스탄 지역 정부는 8월 23일 03:30-04:45 UTC(현지 시각 06:30-07:45)에 12학년 2차 시험 부정행위 방지를 위해 인터넷 서비스 중단을 명령했습니다.[^iraq-kurdistan] 차단은 9월 8일까지 매일 실시되었으며, KNET (AS206206), Newroz Telecom (AS21277), IQ Online (AS48492), KorekTel (AS59625) 등이 영향을 받았습니다.

8월 26일부터는 전국적인 고등학교 시험을 위한 새로운 차단이 시작되어 9월 13일까지 지속되었습니다.[^iraq-august] Earthlink, Asiacell, Zainas, Halasat, HulumTele 등 주요 네트워크가 영향을 받았습니다.

### 5. 아프가니스탄의 광섬유 차단

9월 중순 탈레반 정부는 **"부도덕 방지"를 명목으로 여러 지방에서 광섬유 인터넷 연결을 차단**했습니다.[^afghanistan] 2021년 8월 탈레반이 재집권한 이후 가장 심각한 인터넷 차단으로, 최대 15개 지방이 영향을 받았습니다.[^afghanistan-provinces]

이 차단으로 인해 아프간 학생들은 온라인 수업에 참여할 수 없게 되었고, 상거래와 은행 업무가 중단되었으며, 정부 기관과 병원 등의 접근이 제한되었습니다.[^afghanistan-impact] 9월 21일에는 유선 인터넷 제공업체 가입자들이 12:00 UTC(현지 시각 16:30) 직전까지 짧은 서비스 중단을 경험했습니다.

그러나 12:30 UTC(현지 시각 17:00) 직후 **인터넷이 완전히 차단되어 전국이 오프라인 상태가 되었습니다**.[^afghanistan-complete] 이동통신사인 Afghan Wireless (AS38472)와 Etisalat (AS131284)는 초기에는 서비스가 유지되었지만 곧 차단되었습니다. 연결은 10월 1일 11:45 UTC(현지 시각 16:15)경에 복구되었습니다.

## 케이블 손상으로 인한 장애

### 1. 도미니카 공화국의 광섬유 손상

7월 7일 Claro는 광섬유 케이블 2개의 손상으로 인한 서비스 중단을 X를 통해 알렸습니다.[^dominican-cable] 하나는 CORAAVEGA(라베가 상하수도 공사)의 작업으로, 다른 하나는 전력회사의 작업으로 손상되었습니다.

Claro (AS6400)의 트래픽은 16:00 UTC(현지 시각 12:00) 직전부터 감소하기 시작하여 **최대 40% 감소**했으며, 13:45-16:45 UTC(현지 시각 09:45-12:45) 사이에 가장 큰 영향을 받았습니다.

### 2. 앙골라의 논란이 된 장애

7월 19일 13:45-16:45 UTC(현지 시각 14:45-17:45) 앙골라에서 인터넷 장애가 발생했습니다. Unitel Angola (AS37119)는 전주 대비 **최대 95%의 트래픽 감소**를 경험했고, Connectis (AS327932)는 완전한 장애를 겪었습니다.[^angola]

Unitel Angola는 X 게시물에서 "파트너인 Angola Cables의 장애로 발생했다"고 설명했습니다.[^angola-explanation] 그러나 현지 비정부 기관들은 이 설명에 이의를 제기하며, **정부 주도의 인터넷 차단**이었다고 주장했습니다.[^angola-dispute] 이는 높은 생활비에 대한 항의 시위와 시간이 일치했습니다.

두 네트워크의 라우팅 정보를 확인한 결과 모두 Angola Cables (AS37468)를 상위 제공업체로 공유하고 있어, Unitel Angola의 설명에 어느 정도 신빙성을 부여합니다.

### 3. 아이티 Digicel의 반복적인 문제

Digicel Haiti (AS27653)는 광섬유 케이블 손상으로 인한 인터넷 장애의 단골 고객입니다.[^digicel-history] 2024년 1-3분기와 2025년 1-2분기에도 유사한 문제를 겪었습니다.

8월 26일에는 광섬유 인프라에 3개의 서로 다른 절단이 발생했다고 회사 사장이 X에 게시했습니다.[^digicel-august] 장애 기간 동안 트래픽이 **약 80% 감소**했으며, 19:30-23:30 UTC(현지 시각 15:30-19:30) 동안 지속되었습니다.

### 4. 홍해 해저 케이블 손상

Telegeography의 해저 케이블 지도를 보면 홍해에는 유럽, 아프리카, 아시아를 연결하는 높은 밀도의 해저 케이블이 있습니다.[^submarine-cables] 이러한 케이블의 절단은 국제 인터넷 연결의 지연 증가부터 완전한 연결 끊김까지 다양한 영향을 미칠 수 있습니다.[^cable-impact]

**파키스탄**: 9월 6일 Pakistan Telecom (AS17557)은 X를 통해 "제다 인근에서 해저 케이블 절단이 발생하여 SMW4 및 IMEWE 시스템의 일부 대역폭 용량에 영향을 미쳤다"고 알렸습니다.[^pakistan] 파키스탄의 인터넷 사용자들은 연결 속도 저하를 경험할 수 있다고 안내했습니다. (실제 손상은 예멘 해역에서 발생한 것으로 나중에 밝혀졌습니다.[^yemen-correction])

**아랍에미리트**: UAE에서 Etisalat은 9월 6일 01:00-02:00 UTC(현지 시각 05:00-06:00) 동안 "데이터 서비스 속도 저하를 경험할 수 있다"고 고객들에게 알렸습니다.[^uae-etisalat] 이 기간 동안 AS8966 (Etisalat)의 트래픽은 최대 28% 감소했습니다.

UAE의 또 다른 서비스 제공업체인 du (AS15802)도 11:00 UTC(현지 시각 15:00)부터 9월 6일 22:00 UTC(익일 02:00 현지 시각)까지 영향을 받았습니다.[^uae-du] **중간 대역폭이 25 Mbps에서 9.8 Mbps로 절반 이상 감소**했고, 중간 지연 시간이 30ms에서 60ms 이상으로 두 배 증가했습니다.

### 5. 텍사스의 유탄 사고

9월 26일 텍사스 댈러스 지역에서 **유탄이 케이블을 손상시켜** Spectrum (AS11427) 고객의 인터넷 연결이 중단되는 이례적인 사고가 발생했습니다.[^texas-bullet]

Spectrum은 X를 통해 서비스 중단을 알렸고, 4시간 반 후 문제가 해결되었다고 게시했습니다.[^texas-resolution] X 게시물에서 유탄이 원인으로 명시되지는 않았지만, 뉴스 보도에서는 Spectrum 대변인의 말을 인용하여 이를 확인했습니다.

### 6. 남아프리카의 케이블 절단

9월 27일 남아프리카에서 케이블 절단으로 인해 Telkom (AS37457) 고객의 인터넷 연결이 중단되었습니다.[^south-africa] Telkom은 초기 서비스 중단과 후속 복구를 X 게시물을 통해 알렸지만 근본 원인은 밝히지 않았습니다.

장애는 20:00 UTC(현지 시각 22:00)경에 시작되어 약 2시간 동안 지속되었습니다. **트래픽이 약 70% 감소**했으며, 22:30 UTC(현지 시각 익일 00:30)경에 복구되었습니다.

## 전력 공급 문제

### 1. 지브롤터의 무단 작업

7월 30일 지브롤터에서는 무단으로 작업을 수행한 계약업체가 광섬유 케이블을 절단하여 전력 공급이 중단되었습니다.[^gibraltar-power] 이로 인해 Gibtelecom (AS15452)의 트래픽이 17:30 UTC(현지 시각 19:30)경부터 급격히 감소하기 시작했습니다.

지브롤터는 면적이 7 평방킬로미터에 불과한 작은 영국 해외 영토입니다. **트래픽이 약 95% 감소**했으며, 21:00 UTC(현지 시각 23:00) 무렵에 복구되었습니다.

### 2. 세인트키츠 네비스의 발전소 화재

세인트키츠 네비스에서는 9월 24일 발전소에서 화재가 발생하여 광범위한 정전이 발생했습니다.[^stkitts-fire] 화재는 17:00 UTC(현지 시각 13:00)경에 시작되었으며, Flow (AS27665)의 트래픽은 그 직후 감소하기 시작했습니다.

**트래픽은 약 50% 감소**했으며, 익일 02:00 UTC(전날 22:00 현지 시각)경에 정상 수준으로 회복되었습니다.

### 3. 이란의 전력망 문제

9월 26일 이란 여러 지역에서 정전이 발생하여 인터넷 연결에 영향을 미쳤습니다.[^iran-power] 19:30 UTC(현지 시각 23:00)경부터 여러 네트워크에서 트래픽이 감소하기 시작했으며, 21:00 UTC(익일 00:30 현지 시각)까지 가장 큰 영향을 받았습니다.

주요 ISP들이 영향을 받았습니다. MCCI (AS197207)는 약 80%, MTCE (AS49666)는 약 65%, Pars Online (AS16322)는 50% 이상 트래픽이 감소했습니다.[^iran-impact]

## 자연재해와 기술적 문제

### 1. 멕시코 게레로의 지진

9월 20일 멕시코 게레로주에서 규모 6.0의 지진이 발생했습니다.[^mexico-earthquake] Megacable (AS28554)의 트래픽은 22:10 UTC(현지 시각 17:10)부터 감소하기 시작하여 **약 90% 감소**했습니다. 트래픽은 9월 21일 03:00 UTC(전날 22:00 현지 시각)경에 정상으로 돌아왔습니다.

### 2. 케냐의 데이터센터 화재

8월 7일 케냐 나이로비의 데이터센터에서 화재가 발생하여 Safaricom (AS33771)의 서비스가 중단되었습니다.[^kenya-fire] 장애는 케냐 전역에서 M-PESA 모바일 결제 서비스를 비롯한 여러 서비스에 영향을 미쳤습니다.

트래픽 감소는 07:00 UTC(현지 시각 10:00)경에 시작되어 **최대 20% 감소**를 보였습니다. 장애는 18시간 이상 지속되었으며, 익일 01:00 UTC(현지 시각 04:00)경에 복구되었습니다.

### 3. 우크라이나의 사이버 공격

8월 21일 우크라이나의 우체국 Ukrposhta가 **대규모 사이버 공격**을 받았다고 발표했습니다.[^ukraine-cyberattack] 공격으로 인해 컴퓨터 시스템이 중단되어 일부 우체국이 수동 작업으로 전환되었습니다.

Triolan (AS13188), Ukrposhta의 ISP는 21:00 UTC(익일 00:00 현지 시각)부터 트래픽이 감소하기 시작했으며 **약 70% 감소**했습니다. 트래픽은 8월 22일 13:00 UTC(16:00 현지 시각)경에 정상으로 돌아왔습니다.

### 4. 중국의 만리방화벽 오류

8월 31일 중국에서 만리방화벽의 기술적 오류로 인해 **중국 내 트래픽이 해외로 라우팅**되는 문제가 발생했습니다.[^china-firewall] 이로 인해 연결 속도가 크게 저하되었습니다.

Cloudflare를 포함한 여러 제공업체의 데이터는 09:30-11:30 UTC(현지 시각 17:30-19:30) 동안 중국에서 시작된 트래픽이 크게 증가했음을 보여줍니다. 중국 본토의 일반적인 트래픽 패턴은 중국 내에서 라우팅이 유지되는 것인데, 이 기간 동안에는 이례적으로 해외로 트래픽이 유출되었습니다.

### 5. 미국의 CrowdStrike 업데이트 문제

7월 19일 CrowdStrike의 결함 있는 소프트웨어 업데이트로 인해 **전 세계적으로 850만 대 이상의 Windows 시스템이 중단**되었습니다.[^crowdstrike] 이는 항공, 은행, 의료 등 여러 산업에 영향을 미쳤습니다.

Cloudflare 데이터는 일부 네트워크에서 12:00-13:00 UTC(미국 동부 시각 08:00-09:00) 동안 트래픽이 10-15% 감소한 것으로 나타났습니다. 이는 기업 네트워크가 가장 먼저 영향을 받았음을 시사합니다.

## 원인 불명의 장애 사례

일부 장애는 명확한 원인이 공개되지 않았습니다. **프랑스 Orange (AS3215)**는 7월 26일 07:00 UTC(현지 시각 09:00)부터 트래픽이 약 30% 감소했으며, 익일 새벽 복구되었습니다.[^orange] Orange는 기술적 문제를 인정했지만 구체적인 원인을 밝히지 않았습니다.

**이탈리아 Vodafone (AS30722)**은 9월 3일 오후에 트래픽이 약 40% 감소하는 장애를 겪었습니다.[^vodafone] 회사는 라우팅 문제라고 언급했지만 자세한 내용은 공개하지 않았습니다.

**브라질 Vivo (AS26599)**는 8월 15일 네트워크 장비 오류로 인해 트래픽이 약 25% 감소했습니다.[^vivo] 장애는 약 3시간 동안 지속되었으며, 회사는 장비 문제를 해결했다고만 발표했습니다.

## 마치며

2025년 3분기 인터넷 장애 분석을 통해 현대 인터넷 인프라의 취약성이 다시 한번 드러났습니다. **정부의 의도적인 차단부터 예상치 못한 물리적 손상까지** 다양한 원인이 전 세계 수백만 사용자의 연결성에 영향을 미쳤습니다.

특히 주목할 점은 시험 기간 중 인터넷 차단이 여러 국가에서 반복적으로 발생했다는 것입니다. 이는 디지털 접근성과 정부 정책 사이의 긴장 관계를 보여줍니다. 또한 해저 케이블과 같은 물리적 인프라의 중요성과 취약성도 다시 확인되었습니다.

Cloudflare Radar Outage Center는 이러한 장애를 실시간으로 감지하고 분석하여 인터넷 건강성에 대한 투명성을 제공합니다.[^radar] 4분기에는 어떤 새로운 장애 패턴이 나타날지 주목됩니다.

## Quick questions

> **시험 기간 인터넷 차단은 어떤 국가에서 주로 발생하나요?**
>
> 2025년 3분기에는 수단, 시리아, 이라크에서 시험 부정행위 방지를 명목으로 인터넷 차단이 시행되었습니다. 이는 해당 국가들에서 반복적으로 나타나는 패턴입니다.
{: .prompt-info}

> **해저 케이블 손상은 어떤 영향을 미치나요?**
>
> 해저 케이블 손상은 국제 인터넷 연결의 지연 증가부터 완전한 연결 끊김까지 다양한 영향을 미칩니다. 홍해 케이블 손상 시 파키스탄과 UAE에서 대역폭 감소와 지연 시간 증가가 관찰되었습니다.
{: .prompt-info}

> **Cloudflare는 어떻게 이러한 장애를 감지하나요?**
>
> Cloudflare는 전 세계 트래픽 데이터를 분석하여 비정상적인 트래픽 패턴을 감지합니다. Cloudflare Radar Outage Center를 통해 이러한 이상 징후를 실시간으로 추적하고 공개합니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^exam-shutdowns]: Cloudflare Blog - [Government-directed shutdowns section](https://blog.cloudflare.com/q3-2025-internet-disruption-summary/#government-directed-shutdowns){: target="_blank"}
[^stray-bullet]: Cloudflare Blog - [Texas stray bullet incident](https://blog.cloudflare.com/q3-2025-internet-disruption-summary/#texas-united-states){: target="_blank"}
[^gibraltar]: Cloudflare Blog - [Gibraltar rogue contractor](https://blog.cloudflare.com/q3-2025-internet-disruption-summary/#gibraltar){: target="_blank"}
[^technical-issues]: Cloudflare Blog - [Technical problems section](https://blog.cloudflare.com/q3-2025-internet-disruption-summary/#technical-problems){: target="_blank"}
[^sudan]: Cloudflare Radar - [Sudan traffic data](https://radar.cloudflare.com/sd){: target="_blank"}
[^syria]: Cloudflare Blog - [Syria exam shutdowns](https://blog.cloudflare.com/q3-2025-internet-disruption-summary/#syria){: target="_blank"}
[^syria-telegram]: Telegram - [Syrian Ministry of Education message](https://t.me/TrbyaGov/2352){: target="_blank"}
[^venezuela]: Cloudflare Radar - [Venezuela AS22313](https://radar.cloudflare.com/as22313){: target="_blank"}
[^iraq-july]: Facebook - [Iraq Ministry of Education exam schedule](https://www.facebook.com/Iraq.Ministry.of.Education/posts/pfbid0a7VuMttRxdoGWwuaymy38LcZw9jscz3Dfxup4aUue2LeRBPuU2c7vnDsZKbgCkE2l){: target="_blank"}
[^iraq-kurdistan]: Internet Society - [Kurdistan exam shutdown](https://pulse.internetsociety.org/en/shutdowns/exams-shutdown-kurdistan-iraq-25-august-2025/){: target="_blank"}
[^iraq-august]: Internet Society - [Iraq exam shutdown August 2025](https://pulse.internetsociety.org/en/shutdowns/internet-shutdown-for-iraq-exam-26-august-2025/){: target="_blank"}
[^afghanistan]: AMU TV - [Taliban fiber optic shutdown](https://amu.tv/200798/){: target="_blank"}
[^afghanistan-provinces]: AMU TV - [15 provinces affected](https://amu.tv/200798/){: target="_blank"}
[^afghanistan-impact]: DW - [Afghanistan internet impact](https://www.dw.com/en/afghanistan-whats-at-stake-as-taliban-cut-internet/a-74043564){: target="_blank"}
[^afghanistan-complete]: Cloudflare Blog - [Nationwide Afghanistan shutdown](https://blog.cloudflare.com/nationwide-internet-shutdown-in-afghanistan/){: target="_blank"}
[^dominican-cable]: X - [Claro Dominican Republic post](https://x.com/ClaroRD/status/1942286349006168091){: target="_blank"}
[^angola]: Cloudflare Radar - [Angola traffic data](https://radar.cloudflare.com/ao){: target="_blank"}
[^angola-explanation]: X - [Unitel Angola explanation](https://x.com/unitelao/status/1946644209370358120){: target="_blank"}
[^angola-dispute]: Ver Angola - [NGO dispute of explanation](https://www.verangola.net/va/en/072025/Society/45242/Angolan-NGOs-consider-internet-shutdown-during-Saturday%27s-protests-a-dictatorial-measure.htm){: target="_blank"}
[^digicel-history]: Cloudflare Blog - [Digicel Haiti history Q2 2025](https://blog.cloudflare.com/q2-2025-internet-disruption-summary/#digicel-haiti){: target="_blank"}
[^digicel-august]: X - [Digicel Haiti cable cuts](https://x.com/jpbrun30/status/1960437559558869220){: target="_blank"}
[^submarine-cables]: Telegeography - [Submarine Cable Map](https://www.submarinecablemap.com/){: target="_blank"}
[^cable-impact]: Wired - [Cable impact analysis](https://www.wired.com/story/houthi-internet-cables-ship-anchor-path/){: target="_blank"}
[^pakistan]: X - [Pakistan Telecom cable cut announcement](https://x.com/PTCLOfficial/status/1964203180876521559){: target="_blank"}
[^yemen-correction]: LinkedIn - [Yemen waters correction](https://www.linkedin.com/feed/update/urn:li:activity:7379509758598406144?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7379509758598406144%2C7379684775701245952%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287379684775701245952%2Curn%3Ali%3Aactivity%3A7379509758598406144%29){: target="_blank"}
[^uae-etisalat]: X - [Etisalat UAE announcement](https://x.com/eAndUAE/status/1964655864117346578){: target="_blank"}
[^uae-du]: Cloudflare Radar - [du AS15802 bandwidth data](https://radar.cloudflare.com/quality/as15802?dateStart=2025-09-06&dateEnd=2025-09-06#bandwidth){: target="_blank"}
[^texas-bullet]: WFAA - [Texas stray bullet cable damage](https://www.wfaa.com/article/tech/stray-bullet-caused-major-spectrum-outages-north-texas/287-e72cdefc-6a0a-4a1e-b181-6d02bc60b732){: target="_blank"}
[^texas-resolution]: X - [Spectrum resolution post](https://x.com/Ask_Spectrum/status/1971722840279077229){: target="_blank"}
[^south-africa]: Cloudflare Radar - [Telkom South Africa AS37457](https://radar.cloudflare.com/as37457){: target="_blank"}
[^gibraltar-power]: Gibraltar Chronicle - [Rogue contractor fiber cut](https://www.chronicle.gi/rogue-contractor-cut-fibre-cable-causing-power-cut/){: target="_blank"}
[^stkitts-fire]: St. Kitts Nevis Observer - [Power plant fire](https://www.thestkittsnevisobserver.com/local-news/fire-at-needsmust-power-plant-causes-island-wide-outage/){: target="_blank"}
[^iran-power]: Iran International - [Iran power outage](https://www.iranintl.com/en/202509269827){: target="_blank"}
[^iran-impact]: Cloudflare Radar - [Iran traffic comparison](https://radar.cloudflare.com/explorer?dataSet=netflows&loc=as197207&dt=2025-09-26_2025-09-26&timeCompare=2025-09-19){: target="_blank"}
[^mexico-earthquake]: USGS - [Mexico 6.0 earthquake](https://earthquake.usgs.gov/earthquakes/eventpage/us7000n6kv/executive){: target="_blank"}
[^kenya-fire]: BBC - [Kenya data center fire](https://www.bbc.com/news/articles/clyj5yj5p3yo){: target="_blank"}
[^ukraine-cyberattack]: Ukrinform - [Ukrposhta cyberattack](https://www.ukrinform.net/rubric-ato/3913476-ukrposhta-says-being-under-powerful-cyberattack.html){: target="_blank"}
[^china-firewall]: X - [China Great Firewall routing issue](https://x.com/CloudflareRadar/status/1962524748836692418){: target="_blank"}
[^crowdstrike]: Microsoft - [CrowdStrike update impact](https://blogs.microsoft.com/blog/2025/07/20/helping-our-customers-through-the-crowdstrike-outage/){: target="_blank"}
[^orange]: Cloudflare Radar - [Orange France AS3215](https://radar.cloudflare.com/as3215){: target="_blank"}
[^vodafone]: Cloudflare Radar - [Vodafone Italy AS30722](https://radar.cloudflare.com/as30722){: target="_blank"}
[^vivo]: Cloudflare Radar - [Vivo Brazil AS26599](https://radar.cloudflare.com/as26599){: target="_blank"}
[^radar]: Cloudflare Radar - [Outage Center](https://radar.cloudflare.com/outage-center#traffic-anomalies){: target="_blank"}
