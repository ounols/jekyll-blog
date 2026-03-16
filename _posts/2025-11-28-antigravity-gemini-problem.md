---
title: 구글 Antigravity IDE의 치명적 약점, Gemini의 코드 생성 한계
description: 구글이 출시한 AI 중심 IDE Antigravity의 에이전트 기능과 브라우저 서브에이전트는 인상적이지만, Gemini 3 Pro의 코드 생성 성능과 할당량 제한이 핵심 장애물로 작용합니다.
author: claude
date: '2025-11-28 09:30:00'
categories:
  - News Articles
tags:
  - AI
  - IDE
  - Gemini
  - Code Generation
  - Development Tools
  - Claude Code
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Antigravity's Gemini Problem](https://dev.amitgawande.com/2025/antigravity-problem){: target="_blank"}

![Agent Manager and Conversation History](/media/2025-11-28-antigravity-gemini-problem/figure-1.png)

구글이 Cursor와 Windsurf의 인기에 대응하기 위해 AI 중심 IDE인 Antigravity를 출시했습니다. 이 글의 저자는 Claude Code와 비교 테스트를 진행한 결과, **에이전트 중심 인터페이스와 브라우저 서브에이전트는 매력적이지만 Gemini 3 Pro의 코드 생성 성능과 제한적인 할당량이 큰 걸림돌**이라는 결론에 도달했습니다.

## VS Code 기반의 간편한 온보딩

Antigravity는 Cursor와 마찬가지로 VS Code를 포크한 IDE입니다. 따라서 기존 VS Code의 설정과 확장 기능을 그대로 가져올 수 있어 온보딩 과정이 매끄럽습니다. Cursor와 달리 온보딩 시 기본 모델을 선택할 수 없으며, 구글 계정으로 로그인하면 Gemini가 자동으로 기본 모델로 설정됩니다.

다만 IDE 사용을 위해 구글 계정으로 로그인해야 한다는 점은 다소 우려스럽습니다. 로컬 개발 환경을 클라우드 서비스나 계정과 분리해서 유지하고 싶어하는 개발자들에게는 불편한 설정일 수 있습니다.

## 에이전트 중심 인터페이스의 강점

![Agent Auto-proceeds with implementation plan](/media/2025-11-28-antigravity-gemini-problem/figure-2.png)

구글은 Antigravity를 "에이전트 중심의 개발 플랫폼"이라고 표현하며, 이를 진지하게 구현했습니다. Agent Manager가 IDE의 중심에 위치하며 인상적인 기능을 제공합니다.

### 1. 작업별 에이전트 관리

워크스페이스의 각 대화는 새로운 에이전트가 됩니다. 구글은 각 에이전트를 작업을 맡은 개발자로, 사용자를 이를 관리하는 리드 개발자로 개념화했습니다. 하나의 에이전트가 기본 코드베이스를 생성하고, 다른 에이전트가 점진적 변경을 추가하며, 또 다른 에이전트가 문제를 수정하는 방식으로 협업할 수 있습니다.

### 2. 진화하는 아티팩트 생성

각 에이전트는 실행 중인 작업 목록, 구현 계획, 최종 워크스루와 같은 아티팩트를 생성합니다. 기본적으로 에이전트는 계획에 대한 사용자 확인이 필요한 시점을 스스로 판단합니다.

![Agent Walkthrough Artifact](/media/2025-11-28-antigravity-gemini-problem/figure-3.png)

에이전트는 모든 테스트 케이스와 검증 단계를 나열하는 상세한 워크스루를 생성합니다. 사용자는 각 아티팩트에 피드백을 제공할 수 있으며, 에이전트는 코드 피드백과 동일하게 이를 반영합니다.

## 브라우저 서브에이전트의 혁신

![Browser Subagent](/media/2025-11-28-antigravity-gemini-problem/figure-4.png)

Claude Code는 생성된 HTML을 계획에 따라 평가하지만, Antigravity는 **Chrome을 직접 실행해 DOM을 파싱하며 구현된 인터페이스를 검증**합니다. 에이전트가 스크롤하고, 클릭하며, 입력 필드에 텍스트를 추가하고, 여러 데이터 타입으로 검증하는 과정을 모두 기록합니다.

이 과정은 나중에 검토할 수 있도록 녹화되어 매우 유용합니다. 다만 여러 에이전트와 작업할 때 Chrome이 계속 팝업되면서 다른 에이전트에 지시하는 흐름이 끊기는 단점이 있습니다.

## 치명적인 문제점

![Limited Quota on Antigravity](/media/2025-11-28-antigravity-gemini-problem/figure-5.png)

### 1. 제한적인 할당량

테스트 중 비교적 빠르게 할당량 제한에 도달했으며, 리셋을 기다리는 것 외에는 해결 방법이 없습니다. 이는 임시적인 문제이겠지만, 현재로서는 의미 있는 작업에 IDE를 활용하기 어렵습니다.

### 2. Gemini 3 Pro의 코드 생성 성능

더 근본적인 문제는 **Gemini 3 Pro가 코드 생성에서 충분히 우수하지 않다는 점**입니다. 간단한 문자 카운터 웹 도구를 만드는 프롬프트에서도 많은 실수를 범했습니다.

![Implemented by Gemini vs Claude](/media/2025-11-28-antigravity-gemini-problem/figure-6.png)

Claude Sonnet이 선택한 인터페이스 기본값이 Gemini보다 훨씬 우수했습니다. HTML과 마크다운 태그를 텍스트에서 제거하는 확장 기능을 요청했을 때, Claude Code는 첫 시도에서 성공했지만 Gemini는 계속 실패했습니다.

Gemini는 먼저 단어 수 계산 로직만 수정하면서 문자 수에 미치는 영향을 무시했습니다. 브라우저 서브에이전트로 검증을 여러 차례 시도한 후에도 문자 수 계산 로직이 여전히 잘못되어 있었습니다.

## 마치며

이번 테스트는 포괄적인 평가가 아니며, 그것이 목표도 아니었습니다. 현재로서는 Claude Code를 계속 사용할 계획입니다. **Gemini 3 Pro의 성능과 구글의 제한적인 할당량이 Antigravity를 채택하기 어렵게 만드는 핵심 요인**입니다.

그럼에도 불구하고 에이전트 중심 인터페이스와 브라우저 서브에이전트는 충분히 가능성을 보여줍니다. 이 기술이 어떻게 발전하고 다른 플레이어들에게 채택될지 지켜볼 예정입니다.

## Quick questions

> **Antigravity는 무료로 사용할 수 있나요?**
>
> 구글 계정으로 로그인하면 사용 가능하지만, 할당량 제한이 있어 빠르게 한계에 도달할 수 있습니다. 현재 할당량을 초과하면 리셋을 기다려야 합니다.
{: .prompt-info}

> **Antigravity는 어떤 모델을 사용하나요?**
>
> 기본적으로 Gemini 3 Pro를 사용하며, 온보딩 시 다른 모델을 선택할 수 있는 옵션은 제공되지 않습니다.
{: .prompt-info}

> **브라우저 서브에이전트는 어떤 방식으로 작동하나요?**
>
> Chrome을 실행해 생성된 웹 인터페이스를 직접 테스트하며, 스크롤, 클릭, 입력 등의 동작을 수행하고 DOM을 파싱하여 검증합니다. 이 과정은 녹화되어 나중에 검토할 수 있습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^antigravity]: Antigravity - [https://antigravity.google/](https://antigravity.google/){: target="_blank"}
[^wordly]: Amit Gawande Tools - [Wordly Character Counter](https://tools.amitgawande.com/wordly/){: target="_blank"}
