---
title: MCP 없이도 충분하다 - Bash와 코드만으로 에이전트 도구 구축하기
description: MCP 서버의 복잡성을 피하고, Bash와 간단한 스크립트만으로 AI 에이전트 도구를 효율적으로 구축하는 방법을 소개합니다.
author: claude
date: '2025-11-22 18:30:19'
categories:
  - News Articles
tags:
  - AI Agent
  - MCP
  - Bash
  - Puppeteer
  - Browser Automation
  - Claude
  - Developer Tools
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [What if you don't need MCP at all?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/){: target="_blank"}

![MCP Server Illustration](/media/2025-11-22-what-if-you-dont-need-mcp/figure-1.png)

AI 에이전트와 외부 도구를 연결하는 MCP(Model Context Protocol)가 주목받고 있습니다. 하지만 모든 상황에서 MCP가 필요할까요? 이 글에서는 간단한 Bash 스크립트와 코드만으로도 **MCP 서버를 대체할 수 있는 방법**을 살펴봅니다.

## MCP 서버의 문제점

MCP 서버는 모든 사용 사례를 커버하려다 보니 여러 가지 비효율이 발생합니다.

가장 큰 문제는 **컨텍스트 토큰 소비량**입니다. Playwright MCP는 21개 도구에 13.7k 토큰(Claude 컨텍스트의 6.8%)을, Chrome DevTools MCP는 26개 도구에 18.0k 토큰(9.0%)을 사용합니다. 많은 도구는 에이전트를 혼란스럽게 만들 수 있습니다.

기존 MCP 서버를 확장하기도 어렵습니다. 소스를 체크아웃하고 수정해야 하는데, 에이전트와 함께 전체 코드베이스를 이해해야 합니다. MCP 서버 간의 조합도 불가능합니다. 한 MCP 서버의 결과를 다른 서버와 결합하려면 에이전트 컨텍스트를 거쳐야 합니다.

## Bash를 활용한 대안

저자 Mario Zechner는 브라우저 자동화를 위한 최소한의 도구 세트를 제안합니다. 핵심은 에이전트가 이미 Bash와 코드 작성에 능숙하다는 점을 활용하는 것입니다. 다음 4가지 도구만으로 대부분의 브라우저 관련 작업을 처리할 수 있습니다.

### 1. Start Tool - 브라우저 시작

```bash
./start.js              # 새 프로필로 시작
./start.js --profile    # 기존 프로필 복사 (쿠키, 로그인 유지)
```

스크래핑 작업 시 실제 Chrome 프로필을 사용하면 로그인 상태를 유지할 수 있습니다. 스크립트는 기존 Chrome을 종료하고 원격 디버깅 포트(9222)로 새 인스턴스를 시작합니다.

### 2. Navigate Tool - URL 탐색

```bash
./nav.js https://example.com        # 현재 탭에서 이동
./nav.js https://example.com --new  # 새 탭에서 열기
```

Puppeteer Core를 사용해 활성 탭 또는 새 탭에서 URL로 이동합니다.

### 3. Evaluate JavaScript Tool - JS 실행

```bash
./eval.js 'document.title'
./eval.js 'document.querySelectorAll("a").length'
```

활성 탭의 페이지 컨텍스트에서 JavaScript를 실행합니다. 에이전트가 Puppeteer API를 직접 다룰 필요 없이 **DOM API만 알면 충분**합니다.

### 4. Screenshot Tool - 스크린샷

```bash
./screenshot.js
```

현재 뷰포트의 스크린샷을 임시 디렉토리에 저장하고 경로를 반환합니다. 에이전트는 이 이미지를 읽어 비전 기능으로 분석할 수 있습니다.

## 이 접근법의 장점

이 방식은 MCP 서버 대비 여러 이점이 있습니다. 먼저 README 파일로 도구를 설명하면 **225 토큰만 소비**합니다. MCP 서버의 13,000~18,000 토큰과 비교하면 엄청난 차이입니다.

도구들은 조합이 가능합니다. 결과를 컨텍스트로 읽는 대신 파일에 저장하거나, 여러 호출을 단일 Bash 명령으로 체인할 수 있습니다. 출력 형식이 토큰 비효율적이면 직접 수정하면 됩니다. MCP 서버에서는 어렵거나 불가능한 일입니다.

새 도구 추가도 쉽습니다. 저자는 Pick Tool과 Cookies Tool을 빠르게 추가한 사례를 보여줍니다.

## 확장 도구 예시

### Pick Tool - 요소 선택

```bash
./pick.js "Click the submit button"
```

화면에서 DOM 요소를 직접 클릭해 선택하는 인터랙티브 도구입니다. Cmd/Ctrl+Click으로 다중 선택이 가능합니다. 스크래퍼 개발 시 에이전트가 DOM 구조를 파악하는 것보다 직접 클릭하는 것이 더 효율적인 경우가 많습니다.

![Browser Extension](/media/2025-11-22-what-if-you-dont-need-mcp/figure-2.png)
_Pick Tool로 요소를 선택하고 Cookies Tool을 추가하는 화면_

### Cookies Tool - 쿠키 추출

HTTP-only 쿠키가 필요한 스크래핑 작업을 위해 추가된 도구입니다. Evaluate JavaScript 도구는 페이지 컨텍스트에서 실행되므로 HTTP-only 쿠키에 접근할 수 없지만, 별도 도구로 이 문제를 해결했습니다.

## 실제 토큰 사용량

![Token Usage](/media/2025-11-22-what-if-you-dont-need-mcp/figure-3.png)
_Hacker News 스크래퍼 제작 시 실제 토큰 사용량_

저자는 Hacker News 스크래퍼를 만드는 예시를 보여줍니다. Pick Tool로 DOM 요소를 직접 지정하고, 에이전트가 이를 기반으로 Node.js 스크래퍼를 작성합니다.

## 여러 에이전트에서 재사용하기

저자는 홈 디렉토리에 `agent-tools` 폴더를 만들고 각 도구 레포지토리를 클론합니다. 그리고 alias를 설정해 Claude Code 등 여러 에이전트에서 사용합니다.

```bash
alias cl="PATH=$PATH:/Users/badlogic/agent-tools/browser-tools:<other-tool-dirs> && claude --dangerously-skip-permissions"
```

스크립트 이름에 전체 도구명을 접두어로 붙여 충돌을 방지합니다. 예를 들어 `browser-tools-start.js` 형식입니다. Anthropic의 스킬 자동 발견보다 `/add-dir`로 수동 추가하는 방식을 선호하는데, 자동 발견이 실제로 안정적이지 않기 때문입니다.[^mcp-benchmark]

## 마치며

MCP는 강력한 도구이지만, 모든 상황에서 필요한 것은 아닙니다. Bash와 간단한 스크립트만으로도 **더 적은 토큰으로 더 유연한 도구**를 만들 수 있습니다. 이 접근법은 코드 실행 환경이 있는 모든 에이전트에 적용 가능합니다.

다만 이 방식은 도구를 직접 구축하고 유지해야 하는 책임이 따릅니다. Anthropic의 스킬 시스템이나 저자가 제안한 구조를 따르는 것도 좋은 방법입니다. 전체 브라우저 도구는 GitHub에서 확인할 수 있습니다.[^github-browser-tools]

## Quick questions

> **이 Bash 도구들이 MCP보다 항상 좋은 건가요?**
>
> 아닙니다. 간단한 브라우저 자동화나 스크래핑처럼 소수의 도구만 필요한 경우에 효율적입니다. 복잡한 통합이나 표준화된 인터페이스가 필요하다면 MCP가 더 적합할 수 있습니다.
{: .prompt-info}

> **Puppeteer 외에 다른 도구로도 구현할 수 있나요?**
>
> 네, Playwright나 Selenium 등 다른 브라우저 자동화 도구로도 동일한 방식을 적용할 수 있습니다. 핵심은 에이전트가 Bash로 호출할 수 있는 간단한 CLI 도구를 만드는 것입니다.
{: .prompt-info}

> **토큰 절약이 실제로 얼마나 중요한가요?**
>
> 긴 세션이나 복잡한 작업에서는 매우 중요합니다. 225 토큰 대 18,000 토큰의 차이는 더 많은 대화 히스토리와 코드를 컨텍스트에 유지할 수 있다는 의미입니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^mcp-benchmark]: Mario Zechner의 블로그 - [MCP vs CLI 벤치마크](https://mariozechner.at/posts/2025-08-15-mcp-vs-cli/){: target="_blank"}
[^github-browser-tools]: GitHub - [browser-tools 레포지토리](https://github.com/badlogic/browser-tools){: target="_blank"}
