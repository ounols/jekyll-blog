---
title: 2026년 03월 1주째 GitHub Trending
description: WiFi 기반 인체 감지, 독립 웹 브라우저, 엣지 음성 인식 등 다양한 분야의 기술 프로젝트가 주목받은 한 주
author: claude
date: '2026-03-01 10:00:00'
categories:
  - News Articles
  - GitHub Trending
tags:
  - AI
  - Rust
  - Database
  - Browser
  - SpeechRecognition
  - WiFi
  - OpenSource
pin: false
math: false
mermaid: false
hidden: true
---

> 이 포스트는 AI 모델을 활용하여 정보를 수집하였습니다. 기술적 정확성을 위해 추가 검토가 이루어진 포스팅입니다.
{: .prompt-info}

이번 주 GitHub Trending에서는 AI 에이전트 관련 프로젝트들 사이에서 WiFi 신호를 이용한 인체 감지, 독립 브라우저 엔진, 엣지 환경용 음성 인식 모델 등 다양한 분야의 프로젝트들이 눈에 띄었습니다. 데이터베이스 설계 방식에 대한 새로운 시도와 개발자 도구 분야의 흥미로운 프로젝트도 함께 살펴봅니다.

## WiFi DensePose - WiFi 신호로 카메라 없이 사람의 자세를 감지

GitHub: [https://github.com/ruvnet/wifi-densepose](https://github.com/ruvnet/wifi-densepose){: target="_blank"}

WiFi DensePose는 일반 WiFi 신호를 분석하여 카메라나 웨어러블 기기 없이 실시간으로 사람의 자세, 생체 신호, 위치를 감지하는 오픈소스 프로젝트입니다. 연구 배경은 [Facebook AI Research의 DensePose 논문](https://arxiv.org/abs/1802.00434){: target="_blank"}과 MIT의 WiFi 기반 인체 감지 연구에 기반하고 있습니다.

기술적으로는 WiFi 라우터가 방 전체에 전파를 방출하는 특성을 활용합니다. 사람의 몸이 이 전파를 반사·산란시키면, 수신 안테나에서 CSI(Channel State Information)를 분석해 신체 위치와 움직임을 추정합니다. 56개 이상의 서브캐리어에서 초당 20회 측정값을 수집하고, 신경망이 이를 17개 신체 키포인트와 생체 지표로 변환합니다.

* WiFi 신호의 채널 상태 정보(CSI)를 분석하여 17개 신체 키포인트를 실시간 추정하며, 최대 5명을 동시에 추적합니다.
* 벽을 통한 감지도 가능하며, 5미터 거리의 고체 장애물 너머에서도 동작합니다.
* 호흡(분당 6-30회)과 심박수(40-120 BPM) 모니터링이 가능하여 카메라 없는 생체 신호 추적이 실현됩니다.
* Rust 기반 처리 파이프라인은 Python 대비 810배 빠른 초당 54,000 프레임을 처리합니다.
* ESP32-S3 모듈(약 $8)을 사용한 저비용 하드웨어 배포를 지원하며, Docker로도 즉시 실행 가능합니다.

**하드웨어 요구사항:** 전체 기능 사용을 위해서는 CSI 측정을 지원하는 WiFi 장비(ESP32-S3 또는 Intel 5300 NIC 등)가 필요합니다. 일반 소비자용 WiFi 장비로는 RSSI 기반의 단순 재실 감지 정도만 가능합니다.

적용 분야로는 병원 환자 낙상 감지, 독거 노인 야간 모니터링, 물류 창고 안전 구역 관리 등이 제시되어 있습니다. 카메라 기반 시스템과 달리 GDPR 영상 규정의 적용을 받지 않는다는 점이 상업적 도입 측면에서 주목할 만합니다.

> WiFi 신호 분석을 통한 인체 감지는 프라이버시 측면에서는 유리하지만, 역으로 사용자 동의 없는 감시에 악용될 수 있는 이중성을 갖습니다. 배포 시 법적·윤리적 검토가 필요합니다.
{: .prompt-warning}

---

## SpacetimeDB - 애플리케이션 서버를 내장한 데이터베이스

GitHub: [https://github.com/clockworklabs/SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB){: target="_blank"}

![SpacetimeDB 아키텍처 다이어그램](/media/2026-03-01-202603-github-trending-week-1/figure-1.png)_전통적인 클라이언트-서버-DB 3계층 구조 대신, 클라이언트가 DB에 직접 연결하는 SpacetimeDB의 구조_

SpacetimeDB는 데이터베이스와 애플리케이션 서버를 하나로 합친 시스템입니다. 기존 웹 서비스는 클라이언트 → 웹서버 → 데이터베이스 3계층 구조를 가지지만, SpacetimeDB에서는 애플리케이션 로직을 "모듈"이라는 형태로 데이터베이스 안에 직접 업로드합니다. 클라이언트는 중간 서버 없이 데이터베이스에 직접 연결하여 이 모듈을 실행합니다.

* 모든 애플리케이션 상태를 메모리에 유지하고 WAL(Write-Ahead Log)로 영속성을 보장하여 최소 지연시간을 달성합니다.
* 마이크로서비스, Kubernetes, Docker 오케스트레이션 없이 Rust 단일 바이너리로 전체 백엔드를 배포할 수 있습니다.
* 실시간 멀티플레이어 게임, 채팅, 협업 도구처럼 낮은 지연시간이 중요한 애플리케이션에 특화되어 있습니다.

**실제 사용 사례:** Clockwork Labs는 MMORPG [BitCraft Online](https://bitcraftonline.com){: target="_blank"}의 전체 백엔드를 SpacetimeDB 단일 모듈로 운용하고 있습니다. 채팅, 아이템, 자원, 지형, 플레이어 위치 동기화가 모두 하나의 SpacetimeDB 모듈 위에서 동작합니다.

> SpacetimeDB는 배치 처리나 분석 워크로드보다는 실시간 상호작용에 특화된 아키텍처입니다. 범용 웹 서비스에 단순히 적용하기보다는 적합한 사용 사례를 신중히 판단해야 합니다.
{: .prompt-tip}

---

## Moonshine - 엣지 기기를 위한 경량 고속 음성 인식

GitHub: [https://github.com/moonshine-ai/moonshine](https://github.com/moonshine-ai/moonshine){: target="_blank"}

Moonshine은 엣지 기기와 로컬 실행을 위해 최적화된 자동 음성 인식(ASR) 오픈소스 라이브러리입니다. Python, iOS, Android, macOS, Linux, Windows, Raspberry Pi 등 다양한 플랫폼을 단일 C++ 코어로 지원합니다.

* Whisper Large v3(15억 파라미터)보다 낮은 단어 오류율(WER 6.65%)을 2.45억 파라미터 모델로 달성합니다.
* Whisper의 고정 30초 윈도우 방식과 달리 임의 길이의 오디오를 처리하며, 스트리밍 아키텍처로 실시간 응답이 가능합니다.
* MacBook Pro 기준 처리 지연시간이 107ms로, Whisper Large v3의 11,286ms 대비 약 100배 빠릅니다.
* 단일 멀티링구얼 모델 대신 아랍어, 일본어, 한국어, 스페인어 등 언어별 특화 모델을 제공하여 해당 언어에서 더 높은 정확도를 보입니다.
* 계정, API 키, 인터넷 연결 없이 완전히 온디바이스로 실행됩니다.

실시간 자막, 음성 명령 인터페이스, 인터넷 연결이 제한된 환경의 음성 처리 등에서 Whisper 계열의 실용적인 대안이 될 수 있습니다.

---

## Ladybird - 독립적으로 개발 중인 오픈소스 웹 브라우저

GitHub: [https://github.com/LadybirdBrowser/ladybird](https://github.com/LadybirdBrowser/ladybird){: target="_blank"}

Ladybird는 Chromium, Firefox, WebKit 등 기존 브라우저 엔진에 의존하지 않고 웹 표준만을 기반으로 새롭게 개발 중인 독립 브라우저 프로젝트입니다. [SerenityOS](https://serenityos.org){: target="_blank"} 프로젝트에서 파생된 컴포넌트들을 기반으로 하며, 렌더링을 담당하는 LibWeb, JavaScript 실행을 위한 LibJS, 암호화·그래픽·미디어 처리 라이브러리 등으로 구성됩니다.

* 각 탭이 독립된 샌드박스 렌더러 프로세스에서 실행되며, 이미지 디코딩과 네트워크 작업도 별도 프로세스로 분리됩니다.
* Chromium, Gecko, WebKit 계열 엔진을 재사용하지 않는 완전히 새로운 구현으로, 시장 의존도 없는 브라우저 다양성을 목표로 합니다.
* 현재 75,000개 이상의 커밋과 1,240명 이상의 기여자가 참여하고 있습니다.
* Linux, macOS, WSL2(Windows) 등 주요 플랫폼을 지원합니다.

> Ladybird는 현재 프리알파 단계로, 일반 사용 목적으로는 적합하지 않습니다. 개발자나 브라우저 엔진 기여에 관심있는 분들을 위한 프로젝트입니다.
{: .prompt-warning}

현재 웹 브라우저 시장이 Chromium 기반 브라우저들에 지나치게 집중되어 있다는 우려가 지속적으로 제기되는 상황에서, Ladybird의 존재는 브라우저 엔진 다양성이라는 관점에서 주목할 만한 장기 프로젝트입니다.

---

## GitNexus - 코드베이스를 지식 그래프로 변환하는 코드 인텔리전스 도구

GitHub: [https://github.com/abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus){: target="_blank"}

![GitNexus 웹 UI](/media/2026-03-01-202603-github-trending-week-1/figure-2.png)_GitNexus 웹 UI에서 코드베이스의 의존성 그래프와 AI 질의 응답 화면_

GitNexus는 GitHub 레포지토리나 ZIP 파일을 분석하여 코드베이스의 지식 그래프를 생성하는 도구입니다. 브라우저 기반 웹 UI와 MCP(Model Context Protocol) 서버 방식 두 가지 모드로 제공됩니다.

* Tree-sitter AST를 사용하여 TypeScript, Python, Java, Go, Rust, C++ 등 12개 이상의 언어에서 함수, 클래스, 인터페이스를 파싱합니다.
* 단순 심볼 검색을 넘어 파일 간 임포트·호출 관계, 기능적 클러스터, 실행 흐름을 사전 계산하여 그래프에 저장합니다.
* MCP를 통해 Claude Code, Cursor, Windsurf 등 AI 코딩 도구에 7가지 도구(`query`, `context`, `impact`, `detect_changes`, `rename`, `cypher`, `list_repos`)를 제공합니다.
* BM25와 시맨틱 검색을 결합한 하이브리드 검색으로 코드를 조회합니다.
* 웹 UI는 설치 없이 [gitnexus.vercel.app](https://gitnexus.vercel.app){: target="_blank"}에서 즉시 사용 가능합니다.

기존 Graph RAG 접근법이 쿼리 시점에 그래프를 구성하는 것과 달리, GitNexus는 인덱싱 단계에서 아키텍처 구조를 미리 계산합니다. 덕분에 AI 에이전트가 코드를 수정할 때 다운스트림 의존성을 놓치는 문제를 줄일 수 있습니다.

---

## DeerFlow - ByteDance의 오픈소스 AI 에이전트 프레임워크

GitHub: [https://github.com/bytedance/deer-flow](https://github.com/bytedance/deer-flow){: target="_blank"}

DeerFlow는 ByteDance가 공개한 오픈소스 AI 에이전트 프레임워크로, 2월 마지막 주 GitHub Trending 1위를 기록했습니다. 기존 Deep Research 프레임워크를 전면 재작성하여 단순 리서치 도구를 넘어선 범용 에이전트 시스템을 지향합니다.

* 각 작업이 독립된 Docker 컨테이너 내 샌드박스 환경에서 실행되어 파일 읽기·쓰기, bash 명령 실행, 이미지 처리가 가능합니다.
* 리드 에이전트가 복잡한 작업을 서브에이전트들에 병렬 분배하고, 결과를 종합하는 멀티 에이전트 조율 구조를 갖습니다.
* 완료된 서브태스크를 적극적으로 요약하여 컨텍스트 윈도우를 효율적으로 관리하는 방식이 특징입니다.
* 세션을 넘어 사용자 프로필, 작업 스타일, 선호 워크플로우를 저장하는 장기 메모리를 지원합니다.
* OpenAI 호환 API를 사용하는 모든 모델과 함께 동작하며, 대형 컨텍스트 윈도우 모델에서 최적 성능을 발휘합니다.

비슷한 목표를 가진 AI 에이전트 프레임워크가 이미 다수 존재하는 상황에서, DeerFlow의 차별점은 샌드박스 실행 환경 내장과 컨텍스트 압축 전략입니다. 다만 이 분야의 프레임워크들은 빠르게 생겨났다가 사라지는 경향이 있으므로, 프로덕션 도입 전에 장기 유지보수 계획을 확인하는 것이 바람직합니다.

---

## AI 도구 시스템 프롬프트 모음 - 주요 AI 개발 도구의 내부 지침 분석

GitHub: [https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools){: target="_blank"}

이 레포지토리는 Cursor, Claude Code, GitHub Copilot, Devin, Windsurf, v0, Perplexity, Replit, Lovable 등 30개 이상의 AI 개발 도구에서 추출된 시스템 프롬프트와 내부 설정을 모아둔 컬렉션입니다. 126,000개 이상의 스타를 기록하며 이번 주 가장 빠르게 주목받은 레포지토리 중 하나입니다.

* 30,000줄 이상의 시스템 프롬프트를 통해 각 도구가 AI 에이전트의 행동을 어떻게 구조화하는지 확인할 수 있습니다.
* 도구별로 코드 생성, 추론, 사용자 상호작용에 대한 접근 방식이 상당히 다양함을 보여줍니다.
* 시스템 프롬프트의 설계 방식이 에이전트 동작과 품질에 어떤 영향을 미치는지 비교 분석할 수 있습니다.

> 이 컬렉션의 프롬프트 일부는 각 서비스의 이용 약관이나 지식재산권과 관련된 법적 회색 지대에 있을 수 있습니다. 참조나 연구 목적으로 활용하되, 상업적 재활용 시 주의가 필요합니다.
{: .prompt-warning}

주요 AI 코딩 도구들이 내부적으로 어떤 지침과 제약을 설정하는지 이해하고자 하는 개발자들에게 참고 자료로서의 가치가 있습니다. 리포지토리 README 자체도 "AI 스타트업이라면 데이터 보안을 점검하라"고 경고하고 있어, 시스템 프롬프트 보안의 중요성을 역설적으로 보여줍니다.

---

이번 주는 WiFi 기반 비카메라 인체 감지처럼 기존과 다른 방식으로 문제에 접근하는 프로젝트나, 브라우저 엔진 독립성이나 DB 아키텍처 재설계처럼 장기적 관점의 인프라 프로젝트들이 함께 주목받았습니다. AI 에이전트 프레임워크와 관련 도구들의 증가 추세는 계속되고 있으나, 실제 기술적 차별점을 갖춘 프로젝트들에 집중하는 것이 중요해 보입니다.
