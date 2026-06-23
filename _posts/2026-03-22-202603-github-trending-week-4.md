---
title: 2026년 03월 4주째 GitHub Trending
description: AI 에이전트 개발 방법론부터 Zig 기반 헤드리스 브라우저, PS4 에뮬레이터까지 다양한 기술 프로젝트가 주목받은 한 주
author: claude
date: '2026-03-22 12:00:00'
categories:
  - News Articles
  - GitHub Trending
tags:
  - AI
  - LLM
  - Zig
  - 에뮬레이터
  - 파인튜닝
  - 웹개발
pin: false
math: false
mermaid: false
hidden: true
---

> 이 포스트는 AI 모델을 활용하여 정보를 수집하였습니다. 기술적 정확성을 위해 추가 검토가 이루어진 포스팅입니다.
{: .prompt-info}

이번 주 GitHub Trending에서는 AI 에이전트 개발 방법론 관련 프로젝트들이 대거 상위권을 차지했습니다. 그 가운데 크롬 대비 극적인 성능 차이를 보이는 새로운 헤드리스 브라우저, 실용적인 LLM 파인튜닝 도구, PS4 에뮬레이터 등 흥미로운 비AI 프로젝트들도 눈에 띄었습니다. 이번 주에는 기술적 가치가 분명한 프로젝트 7개를 선별했습니다.

## obra/superpowers - 코딩 에이전트를 위한 구조화된 개발 방법론

GitHub: [https://github.com/obra/superpowers](https://github.com/obra/superpowers){:target="_blank"}{: target="_blank"}

이번 주 가장 많은 스타를 받은 프로젝트입니다(주간 +20k, 총 105k). Perl 생태계에서 잘 알려진 개발자 Jesse Vincent(obra)가 만든 코딩 에이전트 전용 스킬 프레임워크로, Claude Code, Cursor, Codex, Gemini CLI 등 주요 에이전트 환경에서 사용할 수 있습니다.

이 프로젝트의 핵심은 "에이전트가 코드를 작성하는 방식"을 체계화하는 데 있습니다. 단순히 프롬프트 묶음이 아니라, 에이전트가 개발 워크플로우를 자동으로 따르도록 유도하는 컴포저블 스킬 시스템입니다.

* 브레인스토밍 단계에서 에이전트가 질문을 통해 요구사항을 구체화하고, 설계안을 사용자에게 검증받는 과정을 자동으로 수행합니다.
* Git 워크트리를 활용해 기능별 격리된 작업 환경을 구성하고, 2-5분 단위의 세부 태스크로 구현 계획을 분해합니다.
* 서브에이전트를 병렬로 실행하여 태스크를 처리하며, 각 태스크 완료 후 스펙 준수 여부와 코드 품질을 2단계에 걸쳐 자동 검토합니다.
* RED-GREEN-REFACTOR 사이클의 TDD 방식을 강제하며, 테스트가 통과하지 않으면 다음 단계로 진행하지 않습니다.
* 브랜치 완료 단계에서 전체 테스트 통과를 확인한 뒤 머지 옵션을 제시합니다.

에이전트 기반 개발에 관심이 있다면 구조화된 접근법의 레퍼런스로 살펴볼 만합니다. 다만 이 프레임워크가 모든 프로젝트에 적합하지는 않으며, 간단한 작업보다는 복잡한 기능 개발에 더 효과적입니다.

> 스킬 파일은 Markdown으로 작성되어 있어 필요에 맞게 수정하거나 새로운 스킬을 추가하는 것이 어렵지 않습니다.
{: .prompt-tip}

---

## lightpanda-io/browser - Chromium 없이 처음부터 만든 헤드리스 브라우저

![Lightpanda Browser Logo](/media/2026-03-22-202603-github-trending-week-4/figure-1.png)

GitHub: [https://github.com/lightpanda-io/browser](https://github.com/lightpanda-io/browser){:target="_blank"}{: target="_blank"}

Zig로 작성된 새로운 헤드리스 브라우저입니다(주간 +6.6k, 총 23.7k). "Chromium 포크도 아니고, WebKit 패치도 아닌 완전히 새로운 브라우저"를 표방하며, AI 에이전트와 자동화 작업에 특화되어 있습니다.

* Chrome 대비 메모리 사용량이 9배 적고, 실행 속도는 11배 빠릅니다 (AWS EC2 m5.large에서 100페이지 요청 기준).
* Playwright, Puppeteer, chromedp와 CDP 프로토콜을 통해 호환되므로 기존 자동화 코드를 그대로 사용할 수 있습니다.
* JavaScript 실행은 V8 엔진을 사용하며, HTML 파싱에는 html5ever, HTTP 통신에는 libcurl을 채택했습니다.
* XHR, Fetch API, 네트워크 인터셉션, 쿠키, 프록시를 지원하며 robots.txt 준수 옵션도 제공합니다.

![Lightpanda 실행 시간 벤치마크](/media/2026-03-22-202603-github-trending-week-4/figure-2.svg)_Puppeteer로 100페이지를 요청했을 때의 실행 시간 비교_

현재 베타 단계로 Web API 지원이 완전하지 않습니다. 복잡한 웹 애플리케이션보다는 데이터 수집, AI 에이전트의 웹 탐색, 단순 자동화 시나리오에 적합합니다.

> 그래픽 렌더링 기능이 없는 순수 헤드리스 브라우저로, 시각적 테스트나 스크린샷이 필요한 작업에는 적합하지 않습니다.
{: .prompt-warning}

---

## unslothai/unsloth - LLM 파인튜닝을 더 빠르고 저렴하게

![Unsloth Studio UI](/media/2026-03-22-202603-github-trending-week-4/figure-3.png)_Unsloth Studio의 로컬 모델 학습 및 실행 인터페이스_

GitHub: [https://github.com/unslothai/unsloth](https://github.com/unslothai/unsloth){:target="_blank"}{: target="_blank"}

LLM 파인튜닝 효율을 크게 개선하는 라이브러리입니다(주간 +3.4k, 총 57.6k). 커스텀 Triton 커널과 수학적 최적화를 통해 기존 방식 대비 훈련 속도와 메모리 효율을 모두 개선합니다.

* 500개 이상의 모델에서 최대 2배 빠른 학습 속도와 최대 70% 적은 VRAM 사용을 달성합니다.
* 강화학습(GRPO) 시에는 80% 적은 VRAM으로 훈련이 가능하며, 장문 컨텍스트 RL에서는 7배까지 긴 컨텍스트를 처리할 수 있습니다.
* Qwen, DeepSeek, Llama 3.1/3.2, Gemma, Mistral, Phi-4 등 주요 오픈소스 모델을 지원합니다.
* 텍스트 파인튜닝 외에도 TTS(텍스트-음성), 비전 모델, 임베딩 모델 훈련을 지원합니다.
* PDF, CSV, DOCX에서 자동으로 데이터셋을 생성하는 Data Recipes 기능을 제공합니다.
* 웹 UI(Studio), Python 라이브러리, Docker 등 다양한 방식으로 사용할 수 있습니다.

소비자용 GPU에서도 대형 모델을 파인튜닝할 수 있다는 점에서 실용적인 가치가 높습니다. 정확도 손실 없이 효율을 높인다고 주장하며, 오픈소스 모델을 직접 튜닝해보고 싶은 개발자에게 진입 장벽을 낮춰주는 도구입니다.

---

## shadps4-emu/shadPS4 - C++로 작성된 PS4 에뮬레이터

![shadPS4 Logo](/media/2026-03-22-202603-github-trending-week-4/figure-4.png)

GitHub: [https://github.com/shadps4-emu/shadPS4](https://github.com/shadps4-emu/shadPS4){:target="_blank"}{: target="_blank"}

Windows, Linux, macOS를 지원하는 PS4 에뮬레이터입니다(주간 +1.7k, 총 30.3k). 아직 초기 개발 단계이지만 Bloodborne, Dark Souls Remastered, Red Dead Redemption, Yakuza 0 등 일부 유명 타이틀을 실행할 수 있는 수준에 도달했습니다.

![Bloodborne 실행 화면](/media/2026-03-22-202603-github-trending-week-4/figure-5.png)_shadPS4에서 실행 중인 Bloodborne_

* Xbox 컨트롤러와 DualShock 컨트롤러를 기본 지원하며, 키보드/마우스 매핑도 설정할 수 있습니다.
* FPS 카운터, RenderDoc 캡처 지원 등 디버깅 기능을 갖추고 있습니다.
* 2026년 3월 17일 v0.15.0 릴리스를 기준으로 총 3,747개의 커밋이 이루어졌습니다.
* 게임 호환성 현황은 별도 저장소([shadps4-game-compatibility](https://github.com/shadps4-compatibility/shadps4-game-compatibility){:target="_blank"}{: target="_blank"})에서 확인할 수 있습니다.

> 에뮬레이터 실행에는 PS4 콘솔에서 합법적으로 덤프한 펌웨어 모듈이 필요합니다.
{: .prompt-warning}

---

## 666ghj/MiroFish - 다중 에이전트 기반 시나리오 시뮬레이션 엔진

GitHub: [https://github.com/666ghj/MiroFish](https://github.com/666ghj/MiroFish){:target="_blank"}{: target="_blank"}

중국 Shanda Group이 공개한 다중 에이전트 시뮬레이션 엔진입니다(주간 +15k, 총 39.7k). 뉴스 기사, 정책 문서, 소설 등 원본 자료를 업로드하면, 그 내용을 바탕으로 수천 개의 자율 에이전트가 상호작용하는 디지털 시뮬레이션을 구성합니다.

* GraphRAG 기반의 지식 그래프를 구축하여 시드 정보로부터 에이전트 관계망과 페르소나를 자동 생성합니다.
* 사용자는 "신의 시점"에서 변수를 주입하고 시뮬레이션의 흐름을 관찰할 수 있습니다.
* 정책 도입 전 여론 반응 예측, 가상 시나리오의 결과 탐색, 소설의 대안적 결말 예측 등에 활용됩니다.
* Docker와 소스코드 양쪽으로 배포를 지원하며, 데모 환경도 제공합니다.

흥미로운 접근 방식이지만, 시뮬레이션 결과를 현실 예측에 그대로 적용하기에는 여전히 검증이 필요합니다. 실제 의사결정보다는 탐색적 분석 도구로 활용하는 것이 적절합니다.

> 금융 예측이나 정치적 시뮬레이션 결과를 실제 판단의 근거로 사용할 경우 상당한 주의가 필요합니다.
{: .prompt-danger}

---

## TauricResearch/TradingAgents - 금융 분석을 위한 다중 에이전트 LLM 프레임워크

![TradingAgents 아키텍처](/media/2026-03-22-202603-github-trending-week-4/figure-6.png)_TradingAgents의 다중 에이전트 구조: 분석, 연구, 트레이더, 리스크 관리 역할로 분리_

GitHub: [https://github.com/TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents){:target="_blank"}{: target="_blank"}

실제 트레이딩 회사의 팀 구조를 모방하여 여러 전문 에이전트가 협력하는 금융 분석 프레임워크입니다(주간 +3.8k, 총 37k). LangGraph 기반으로 구축되었으며, 학술 연구에서 인용된 사례도 있습니다.

* 펀더멘털 분석, 감성 분석, 뉴스 모니터링, 기술적 분석을 담당하는 애널리스트 에이전트들이 분업합니다.
* 강세론(Bullish)과 약세론(Bearish) 리서처가 각자의 관점에서 분석하고, 토론을 통해 균형 잡힌 판단을 도출합니다.
* OpenAI, Google, Anthropic, xAI, Ollama 등 다양한 LLM 프로바이더를 지원합니다.
* Alpha Vantage를 통해 시장 데이터를 수집하며, CLI와 Python 라이브러리 방식 모두 지원합니다.

> 이 프레임워크는 연구 목적으로 설계되었으며, 실제 투자 결정에 활용하는 것은 권장하지 않습니다. LLM 기반 분석은 현재 기술 수준에서 시장 예측에 한계가 명확합니다.
{: .prompt-danger}

---

## voidzero-dev/vite-plus - Vite 생태계를 하나의 CLI로 통합

GitHub: [https://github.com/voidzero-dev/vite-plus](https://github.com/voidzero-dev/vite-plus){:target="_blank"}{: target="_blank"}

Vite, Vitest, Oxlint, Oxfmt, Rolldown, tsdown, Vite Task 등 웹 개발에 필요한 도구들을 단일 CLI(`vp`)로 통합한 프로젝트입니다(주간 +2k, 총 3.3k). VoidZero에서 공개했습니다.

* 개발 서버(`vp dev`), 테스트(`vp test`), 빌드(`vp build`), 린트/포맷 검사(`vp check`)를 하나의 명령어 체계로 처리합니다.
* Node.js 버전 관리(`vp env`)와 패키지 매니저 자동 감지(pnpm, npm, Yarn)를 포함합니다.
* 모노레포 태스크 실행과 캐싱을 `vp run`으로 처리하며, 라이브러리 빌드는 `vp pack`으로 수행합니다.
* 모든 설정이 단일 `vite.config.ts` 파일에 집중되어 프로젝트 간 설정 파편화를 줄입니다.

프로젝트마다 별도로 관리하던 ESLint, Prettier, Vitest, 번들러 설정을 하나로 묶는다는 아이디어는 명확합니다. 아직 스타 수가 많지 않아 커뮤니티 생태계가 성숙하는 과정이지만, Vite 기반 프로젝트를 주로 다루는 팀이라면 관심을 가져볼 만한 도구입니다.

---

이번 주는 코딩 에이전트의 개발 방법론을 구조화하려는 시도들이 특히 많은 주목을 받았습니다. 아직 AI 에이전트 개발이 체계적인 방법론보다는 실험적 접근이 주를 이루는 상황에서, obra/superpowers 같은 프로젝트가 높은 관심을 받는 것은 그만큼 현장의 필요가 크다는 방증이기도 합니다. 한편 Lightpanda Browser처럼 기존 거대 프로젝트(Chromium)를 처음부터 다시 설계하는 시도는, AI 붐과 무관하게 기술적으로 도전적인 작업이 여전히 개발자 커뮤니티의 흥미를 끌고 있음을 보여줍니다.
