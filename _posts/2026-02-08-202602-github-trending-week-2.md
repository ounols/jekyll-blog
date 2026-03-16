---
title: 2026년 02월 2주째 GitHub Trending
description: AI 인프라와 개발 도구의 실용적 진화
author: claude
date: '2026-02-08 14:30:00'
categories:
  - News Articles
  - GitHub Trending
tags:
  - AI
  - LLM
  - Security
  - DevTools
  - RAG
  - Rust
pin: false
math: false
mermaid: false
hidden: true
---

> 이 포스트는 AI 모델을 활용하여 정보를 수집하였습니다. 기술적 정확성을 위해 추가 검토가 이루어진 포스팅입니다.
{: .prompt-info}

이번 주 GitHub Trending은 AI 에이전트와 개발 도구 분야에서 주목할 만한 프로젝트들이 다수 등장했습니다. 특히 LLM 학습 비용 절감, 보안 테스트 자동화, 그리고 검색 기술의 새로운 접근법이 눈에 띕니다.

## nanochat - 최소 비용으로 GPT-2 수준 모델 학습하기

![nanochat logo](/media/2026-02-08-202602-github-trending-week-2/figure-1.png)

GitHub: [https://github.com/karpathy/nanochat](https://github.com/karpathy/nanochat){:target="_blank"}{: target="_blank"}

Andrej Karpathy가 공개한 nanochat은 단일 GPU 노드에서 실행 가능한 최소한의 LLM 학습 프레임워크입니다.

* 2019년에 약 43,000달러가 소요되었던 GPT-2 수준의 모델을 단 72달러로 3시간 만에 학습할 수 있습니다
* 8×H100 GPU 노드를 활용하며, 스팟 인스턴스 사용 시 비용을 약 20달러까지 절감할 수 있습니다
* 단일 복잡도 다이얼 설계를 채택하여 `--depth` 파라미터만 설정하면 모든 하이퍼파라미터가 자동으로 최적화됩니다
* 토큰화, 사전학습, 파인튜닝, 평가, 추론, 채팅 UI를 모두 포함한 완전한 파이프라인을 제공합니다

> 이 프레임워크는 학습 비용의 극적인 감소를 보여주지만, 실제 프로덕션 수준의 모델 개발에는 추가적인 고려사항이 필요합니다.
{: .prompt-info}

```bash
bash runs/speedrun.sh  # 학습 시작
python -m scripts.chat_web  # 웹 UI로 모델과 상호작용
```

## Shannon - 웹 앱 취약점 자동 탐지 AI

![Shannon screenshot](/media/2026-02-08-202602-github-trending-week-2/figure-2.png)

GitHub: [https://github.com/KeygraphHQ/shannon](https://github.com/KeygraphHQ/shannon){:target="_blank"}{: target="_blank"}

Shannon은 실제 익스플로잇을 검증하는 자율적인 보안 테스트 도구입니다.

* XBOW 벤치마크에서 96.15%의 성공률을 기록하며 높은 정확성을 입증했습니다
* Injection, XSS, SSRF, 인증/인가 우회 등 주요 OWASP 취약점을 탐지합니다
* "No Exploit, No Report" 정책으로 거짓 양성을 제거하여 실제 취약점만 보고합니다
* TOTP 기반 2FA, OAuth 로그인 등 인증 메커니즘을 자동으로 처리합니다
* 정찰, 취약점 분석, 익스플로잇 검증, 보고의 4단계 아키텍처로 구성됩니다

이 도구는 Anthropic의 Claude Agent SDK 기반으로 구축되었으며, Nmap, Subfinder, WhatWeb, Schemathesis 등의 보안 도구를 통합하고 있습니다.

> 자동화된 보안 테스트는 강력하지만, 전문가의 수동 검토를 완전히 대체할 수는 없습니다.
{: .prompt-warning}

## PageIndex - 벡터 없는 추론 기반 RAG

![PageIndex architecture](/media/2026-02-08-202602-github-trending-week-2/figure-3.png)

GitHub: [https://github.com/VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex){:target="_blank"}{: target="_blank"}

PageIndex는 벡터 데이터베이스 없이 추론 기반으로 RAG를 수행하는 새로운 접근법을 제시합니다.

* 벡터 유사도 검색 대신 문서 구조와 LLM 추론을 활용합니다
* 인위적인 청크 분할 없이 자연스러운 섹션으로 문서를 조직화합니다
* "similarity ≠ relevance" 원칙 하에, 진정한 관련성을 위해서는 추론이 필요하다는 점을 강조합니다
* FinanceBench에서 98.7%의 정확도를 달성했습니다
* 추론 기반 특성으로 인해 높은 설명 가능성과 추적 가능성을 제공합니다

시스템은 문서에서 목차 형태의 계층 구조 트리 인덱스를 생성한 후, 트리 탐색을 통해 추론 기반 검색을 수행합니다. 불투명한 벡터 검색 대신 명확한 페이지/섹션 참조를 제공합니다.

## prek - Rust로 재작성한 pre-commit

![prek logo](/media/2026-02-08-202602-github-trending-week-2/figure-4.webp)

GitHub: [https://github.com/j178/prek](https://github.com/j178/prek){:target="_blank"}{: target="_blank"}

prek는 Rust로 작성된 pre-commit의 대체 도구로, 성능과 사용자 경험을 개선했습니다.

* Python이나 다른 런타임 없이 독립적으로 작동하는 단일 바이너리입니다
* 원본 pre-commit 대비 여러 배 빠른 속도와 절반의 디스크 공간을 차지합니다
* 원본 pre-commit 설정 및 훅과 완전히 호환됩니다
* 모노레포를 위한 워크스페이스 모드를 내장 지원합니다
* Python 가상환경 및 의존성 관리에 uv를 활용합니다

성능 개선의 핵심은 병렬 저장소 복제, 병렬 훅 설치 및 실행입니다. 또한 `--cooldown-days` 옵션을 통해 supply chain attack을 완화하는 보안 기능도 제공합니다.

```bash
prek run --directory <dir>  # 특정 디렉토리 대상 실행
prek run --last-commit      # 최근 커밋 변경사항 대상
prek list                   # 사용 가능한 훅 목록 표시
```

## qmd - 로컬 문서 검색 엔진

GitHub: [https://github.com/tobi/qmd](https://github.com/tobi/qmd){:target="_blank"}{: target="_blank"}

qmd는 마크다운 노트, 회의 전사록, 문서를 로컬에서 인덱싱하는 온디바이스 검색 엔진입니다.

* BM25 전체 텍스트 검색, 벡터 의미론적 검색, 그리고 LLM 재순위화를 결합한 하이브리드 검색을 제공합니다
* Reciprocal Rank Fusion(RRF)을 구현하여 여러 검색 백엔드의 결과를 병합합니다
* 모든 처리가 node-llama-cpp와 GGUF 모델을 사용하여 로컬에서 실행되며, 클라우드 의존성이 없습니다
* MCP(Model Context Protocol) 서버 통합으로 AI 에이전트와 연동 가능합니다
* JSON, CSV, Markdown, XML 등 다양한 출력 형식을 지원합니다

기술 스택은 Bun 런타임, SQLite FTS5, sqlite-vec, 그리고 약 1.95GB의 GGUF 모델로 구성됩니다.

```bash
bun install -g github:tobi/qmd
```

## pi-mono - AI 에이전트 구축 툴킷

![pi-mono logo](/media/2026-02-08-202602-github-trending-week-2/figure-5.svg)

GitHub: [https://github.com/badlogic/pi-mono](https://github.com/badlogic/pi-mono){:target="_blank"}{: target="_blank"}

pi-mono는 AI 에이전트 구축과 LLM 배포를 위한 통합 모노레포입니다.

* 코딩 에이전트 CLI, Slack 봇, vLLM 배포 관리 CLI 등 다양한 CLI 도구를 제공합니다
* OpenAI, Anthropic, Google 등 여러 제공자를 지원하는 통합 LLM API를 포함합니다
* 도구 호출 및 상태 관리를 담당하는 에이전트 코어를 제공합니다
* 차등 렌더링 기능의 터미널 UI와 AI 채팅 인터페이스용 웹 컴포넌트를 포함합니다

TypeScript 기반으로 구축되었으며(96.5%), MIT 라이선스를 따릅니다. 에이전트 개발에 필요한 다양한 컴포넌트를 일관된 방식으로 제공하여 개발 생산성을 높입니다.

## OpenClaw - 다중 플랫폼 AI 어시스턴트

![OpenClaw logo](/media/2026-02-08-202602-github-trending-week-2/figure-6.png)

GitHub: [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw){:target="_blank"}{: target="_blank"}

OpenClaw는 다양한 메시징 플랫폼을 통합 지원하는 개인용 AI 어시스턴트입니다.

* WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, Microsoft Teams, Matrix 등 다중 채널을 지원합니다
* 로컬 우선 게이트웨이를 통해 세션, 채널, 도구 및 이벤트를 단일 WS 제어 평면으로 관리합니다
* macOS, iOS, Android에서 Voice Wake와 Talk Mode를 통해 항상 활성화된 음성 지원을 제공합니다
* A2UI 호스팅과 함께 에이전트 구동 시각적 워크스페이스인 라이브 캔버스를 제공합니다
* Anthropic Claude, OpenAI ChatGPT 등 주요 LLM을 OAuth 기반 인증으로 지원합니다
* Cron, 웹훅, Gmail Pub/Sub를 통한 자동화 기능을 제공합니다

macOS, iOS, Android, Linux, Docker 등 다양한 플랫폼을 지원하며, 브라우저 제어를 위한 전용 Chrome/Chromium CDP도 제공합니다.

---

이번 주는 AI 기술의 실용적 적용에 초점을 맞춘 프로젝트들이 주를 이루었습니다. LLM 학습 비용의 극적인 감소, 보안 테스트의 자동화, 그리고 검색 기술의 새로운 패러다임 등은 모두 기존 문제에 대한 구체적인 해결책을 제시하고 있습니다. 특히 Rust로 재작성된 개발 도구들의 성능 개선과 로컬 우선 접근법을 취하는 프로젝트들이 늘어나는 추세는 주목할 만합니다.
