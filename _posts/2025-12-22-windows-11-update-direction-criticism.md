---
title: 윈도우11의 업데이트 방향에 대한 비판적 고찰
description: 윈도우11의 업데이트 방향이 사용자 경험을 저하시키는 문제점들을 분석합니다.
author: claude
date: '2025-12-22 09:00:00'
categories:
  - News Articles
tags:
  - Windows 11
  - UX
  - Microsoft
  - AI
  - WebView2
pin: false
math: false
mermaid: false
hidden: true
---

![Windows 11 Taskbar](/media/2025-12-22-windows-11-update-direction-criticism/figure-1.jpg)

윈도우11이 출시된 지 4년이 지났지만, 여전히 많은 사용자들이 불만을 제기하고 있습니다. 마이크로소프트는 윈도우11을 차세대 운영체제로 포지셔닝했지만, 실제 사용자 경험은 오히려 퇴보했다는 비판이 끊이지 않습니다. 이 글에서는 윈도우11의 업데이트 방향이 가진 문제점들을 주제별로 살펴보겠습니다.

## 윈도우10보다 부실한 UX들

윈도우11 출시 이후 가장 많은 불만을 받은 기능 중 하나는 **작업 표시줄을 이동할 수 없다는 점**입니다. 윈도우10에서는 작업 표시줄을 화면 상단, 좌측, 우측 어디로든 이동할 수 있었지만, 윈도우11에서는 이 기능이 완전히 제거되었습니다.[^taskbar-position]

### 1. 마이크로소프트의 설명

마이크로소프트의 제품 관리자 Tali Roth는 2021년 AMA(Ask Me Anything) 세션에서 이 문제에 대해 답변했습니다. **윈도우11의 작업 표시줄은 처음부터 새로 작성되었으며**, 윈도우10의 기존 코드를 사용하지 않았다고 합니다.

마이크로소프트는 데이터 기반 접근 방식을 통해 **대다수 사용자에게 도움이 되는 기능을 우선순위로 선정**했다고 주장합니다. 그들의 데이터에 따르면 작업 표시줄을 측면이나 상단에 배치하는 사용자는 매우 적었고, 따라서 이 기능은 우선순위에서 제외되었습니다.

> 마이크로소프트 피드백 허브에서 가장 많은 추천을 받은 작업 표시줄 관련 피드백은 바로 "윈도우11에서 작업 표시줄을 화면 상단과 측면으로 이동할 수 있는 기능을 다시 가져와 달라"는 요청입니다.
{: .prompt-info}

### 2. 기술적 어려움이라는 변명

마이크로소프트는 작업 표시줄 위치 변경이 기술적으로 어렵다고 주장합니다. Tali Roth는 "작업 표시줄이 오른쪽이나 왼쪽에 있을 때, 모든 앱이 레이아웃을 다시 계산하고 훌륭한 경험을 제공하기 위해 해야 할 작업이 엄청나게 많다"고 설명했습니다.

작업 표시줄이 하단에 있을 때는 앱들이 사용 가능한 수평 공간을 정확히 알 수 있습니다. 하지만 **작업 표시줄을 좌우로 이동하면 앱들은 지속적으로 레이아웃을 재계산**해야 하며, 이는 레거시 Win32 앱, 최신 UWP 앱, 그리고 그 사이의 모든 앱에서 완벽하게 작동해야 합니다.

그러나 이러한 설명은 설득력이 부족합니다. 윈도우10에서는 이 기능이 아무런 문제 없이 작동했으며, **사용자들은 작업 표시줄 위치를 매일 변경하는 것이 아니라 자신에게 맞는 위치로 설정한 후 계속 사용**합니다.

### 3. 우선순위의 아이러니

마이크로소프트는 작업 표시줄 위치 변경 대신 **드래그 앤 드롭 기능 복원**과 **작은 화면 및 터치 장치에서의 작업 표시줄 개선**에 집중했다고 밝혔습니다.

아이러니하게도, 마이크로소프트는 대다수 사용자에게 도움이 되는 기능에 집중하겠다고 했지만, 최근 업데이트에서는 **많은 사용자가 원하지 않는 AI 우선 기능들을 작업 표시줄에 추가**하고 있습니다. Windows Search를 대체할 수 있는 Ask Copilot 바, 작업 표시줄 내부의 AI 에이전트, 그리고 Android 활동을 재개할 수 있는 기능 등이 그 예입니다.[^ai-taskbar]

## 점점 사용하기 싫어지는 기존 프로그램들의 업데이트

윈도우11의 문제는 운영체제 자체에만 국한되지 않습니다. 마이크로소프트의 기본 애플리케이션들도 **사용자 경험을 악화시키는 방향으로 업데이트**되고 있습니다.

### 1. 새로운 아웃룩 앱의 강제 업그레이드

마이크로소프트의 최신 아웃룩 앱은 처음에는 선택적 업그레이드로 제공되었습니다. 사용자가 원할 경우 기존 버전으로 되돌릴 수 있었지만, **이제 이 전환은 영구적으로 적용**되었으며, 심각한 문제가 발생했습니다.[^outlook-upgrade]

2025년 3월 12일, 마이크로소프트는 "클래식 Outlook으로 이동" 버튼이 제대로 작동하지 않는 문제를 공식적으로 인정했습니다. 버튼을 클릭하면 **아무런 경고나 리디렉션 없이 아웃룩이 종료**되며, 피드백 양식만 나타납니다.

### 2. 광고와 열악한 UI

새로운 아웃룩 앱은 지속적인 동기화 문제, 어색한 사용자 인터페이스, 그리고 전반적인 완성도 부족으로 광범위한 비판을 받고 있습니다. **이메일 목록 사이에 광고를 삽입**하는 것은 특히 사용자들의 분노를 샀습니다.

마이크로소프트는 실제 이메일 사이에 광고를 교묘하게 배치하여, 마치 실제 메시지인 것처럼 보이게 만듭니다. 많은 사용자들은 **웹 버전이 독립 실행형 앱보다 더 나은 모습과 기능을 제공한다고 주장**합니다.

> 새로운 아웃룩은 Progressive Web App(PWA)처럼 작동하며, 완전한 데스크톱 클라이언트라기보다는 웹 앱에 가깝습니다. 웹 기반 아웃룩이 더 우수하다면, 왜 더 약한 버전을 필수 업그레이드로 강제하는 것일까요?
{: .prompt-warning}

## 그냥 웹 브라우저 기반 OS로 전환하려고 하는건가?

윈도우11의 또 다른 우려스러운 경향은 **네이티브 컴포넌트 대신 WebView2 기반 웹 앱 컴포넌트를 사용**하는 것입니다.

### 1. 알림 센터의 일정 보기는 WebView2

윈도우11의 다음 업데이트는 알림 센터에 캘린더 일정 보기 지원을 도입합니다. 윈도우10에서 사라진 기능이 돌아오는 것이지만, **WebView2 컴포넌트로 구현**되어 Edge 리소스를 호출합니다.[^webview2]

알림 센터를 열면 "Windows Shell Experience Host" 프로세스의 CPU 사용률이 **유휴 상태에서 6-20%로 급증**합니다. 이 프로세스를 확장하면 수많은 WebView2 프로세스가 표시됩니다.

### 2. 리소스 낭비

WebView2가 로드되고 실행되면 **메모리 사용량이 약 1MB에서 130MB 이상으로 급증**합니다. 알림 센터를 닫으면 윈도우는 리소스를 절약하기 위해 "GPU Process"와 "Utility" 항목을 "Suspended" 상태로 전환합니다.

WebView2와 Electron 기반 앱들은 네이티브 윈도우11 앱처럼 느껴지지 않습니다. **Teams, WhatsApp, Discord 모두 리소스를 과도하게 사용**하는 것으로 알려져 있으며, Discord는 RAM 사용량이 4GB를 초과하면 자동 재시작을 테스트하고 있습니다.[^resource-hog]

> Electron과 WebView2 기반 윈도우11 앱들은 RAM이 점점 비싸지는 시점에 기가바이트 단위의 RAM을 소비하고 있습니다. 알림 센터처럼 중요한 기능을 위해 네이티브 컴포넌트를 구축하는 것이 정말 그렇게 어려운 일일까요?
{: .prompt-warning}

## 점점 범람하는 AI 기반 기능들

마이크로소프트의 AI CEO인 Mustafa Suleyman은 X(구 트위터)에 사람들이 오늘날의 AI를 "실망스럽다"고 부르는 것이 재미있다고 게시했습니다. 그는 Nokia 전화기로 Snake 게임을 하며 자랐던 것을 회상하며, "초똑똑한 AI"와의 유창한 대화는 놀라운 일이어야 한다고 주장했습니다.[^ai-ceo]

그러나 그의 게시물 아래 댓글들을 보면 사람들은 그와 함께 웃고 있지 않습니다. **마이크로소프트가 윈도우11의 모든 구석에 AI를 얼마나 공격적으로 주입하는지에 대한 불만**이 가득합니다.

### 1. Copilot의 강제 통합

윈도우11에는 점점 늘어나는 AI 기능 목록이 포함되어 있으며, Copilot이 그 중심에 있습니다. Copilot Voice, Copilot Vision, Edge 브라우저의 Copilot Actions 등이 있습니다.

마이크로소프트는 작업 표시줄에 Ask Copilot 경험을 도입하여 **Windows Search를 잠재적으로 대체**하려 하고 있습니다. 또한 "Experimental Agentic Features"라는 토글을 통해 Agent Workspace, 에이전트 계정, 로컬 도구 액세스를 활성화할 수 있습니다.

> 마이크로소프트는 Agentic 기능이 환각을 일으키고 안전하지 않다는 것을 확인했지만, 여전히 전력을 다해 추진하고 있습니다.
{: .prompt-warning}

### 2. 불필요한 곳까지 침투하는 AI

메모장에도 AI가 추가되었습니다. **단순한 텍스트 편집기에서조차 Copilot 스트리밍 텍스트를 볼 수 있습니다.** 텍스트를 입력하고 마우스 오른쪽 버튼을 클릭하면 GPT 기반 제안으로 재구성, 단축 또는 확장할 수 있으며, 이는 메모장의 본래 목적을 완전히 무색하게 만듭니다.

파일 탐색기도 예외가 아닙니다. 이미지를 마우스 오른쪽 버튼으로 클릭하면 배경 흐림 또는 개체 지우기 옵션이 표시되며, 이는 Photos 앱의 AI 모델을 통해 처리됩니다. **느리게 시작되는 것으로 비판받는 파일 탐색기에 AI와 기타 bloat가 추가**되어 더욱 느려졌습니다.[^file-explorer-slow]

### 3. Office 앱 전반의 AI

Bing Wallpaper 앱은 데스크톱을 클릭하면 브라우저 창을 열어 Bing 결과를 표시합니다. Outlook, OneDrive, Word, Excel, PowerPoint, OneNote 모두에 Copilot이 포함되어 있습니다.

Windows Settings 앱에도 자체 AI 에이전트가 있습니다. **Settings Mu라는 경량 언어 모델**을 사용하여 시스템 설정을 찾고 조정하는 데 도움을 줍니다.

### 4. 프라이버시와 신뢰 문제

마이크로소프트의 Recall 기능은 기술적으로는 매우 유용하게 들리지만, **심각한 반발에 직면하여 회사가 기능을 철회하고 나중에 선택적 기능으로 출시**하도록 강요했습니다.

마이크로소프트는 윈도우11 내부의 AI 에이전트가 **환각을 일으키고, 오작동하며, 완전히 새로운 형태의 공격에 취약할 수 있다고 명시적으로 인정**했습니다. 이것은 보안 연구원들의 공포 조장이 아니라, 마이크로소프트가 지원 문서에서 인정한 사실입니다.[^privacy-issues]

AI 에이전트는 Cross Prompt Injection, 악의적인 UI 요소, 문서, 심지어 멀웨어에도 취약합니다. 이러한 에이전트는 파일을 복사하거나, 민감한 데이터를 유출하거나, 예측할 수 없는 동작을 하도록 속일 수 있습니다.

## 마치며

윈도우11의 업데이트 방향은 **사용자 요구보다 마이크로소프트의 비즈니스 전략을 우선시**하는 것처럼 보입니다. 작업 표시줄 위치 변경과 같은 기본적인 사용자 정의 옵션은 제거되었지만, 대부분의 사용자가 원하지 않는 AI 기능들은 공격적으로 추가되고 있습니다.

WebView2 기반 컴포넌트의 과도한 사용은 **리소스 낭비와 성능 저하**를 초래하며, 네이티브 앱의 장점을 포기하는 것처럼 보입니다. 강제 업그레이드와 열악한 품질의 앱 업데이트는 사용자 신뢰를 떨어뜨립니다.

사람들은 AI가 문제를 해결할 때 좋아하지만, **AI 자체가 문제가 될 때는 싫어합니다.** 마이크로소프트가 윈도우11에서 AI를 사람들이 받아들이기를 진정으로 원한다면, 먼저 윈도우를 고쳐야 합니다. OS를 빠르고 안정적이며 예측 가능하게 만들어야 합니다.

기본이 튼튼하게 느껴질 때, 사람들은 AI와 같은 새로운 아이디어를 실험하는 데 더 개방적일 것입니다. 하지만 **집이 이미 삐걱거리는데 더 많은 지붕재를 추가하면 모두가 밖으로 뛰쳐나가고 싶어질 뿐**입니다.

## Quick questions

> **윈도우11에서 작업 표시줄을 측면으로 이동할 수 있나요?**
>
> 아니요, 윈도우11에서는 작업 표시줄을 화면 하단에서만 사용할 수 있습니다. 마이크로소프트는 이 기능이 대다수 사용자에게 중요하지 않다고 판단하여 제거했습니다.
{: .prompt-info}

> **새로운 아웃룩 앱에서 클래식 버전으로 돌아갈 수 있나요?**
>
> 2025년 3월 기준으로 "클래식 Outlook으로 이동" 버튼이 제대로 작동하지 않는 문제가 있습니다. 마이크로소프트가 이를 인정했지만, 명확한 해결책을 제시하지 못하고 있습니다.
{: .prompt-info}

> **윈도우11의 AI 기능들은 안전한가요?**
>
> 마이크로소프트는 공식 문서에서 AI 에이전트가 환각을 일으키고, 악의적인 UI 요소나 문서에 속을 수 있으며, 민감한 데이터를 유출할 위험이 있다고 인정했습니다. Experimental Agentic Features는 아직 실험 단계이며 프라이버시와 보안 문제가 존재합니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^taskbar-position]: Windows Latest - [Explained: Why you can't move Windows 11 taskbar like Windows 10](https://www.windowslatest.com/2025/12/19/why-you-cant-move-windows-11-taskbar-like-windows-10/){:target="_blank"}{: target="_blank"}
[^ai-taskbar]: Windows Latest - [Microsoft is putting an AI agent on the Windows 11 taskbar](https://www.windowslatest.com/2025/11/19/microsoft-is-putting-an-ai-agent-on-the-windows-11-taskbar-heres-your-first-look/){:target="_blank"}{: target="_blank"}
[^outlook-upgrade]: Undercode News - [Microsoft's new Outlook app: A forced upgrade with major flaws](https://undercodenews.com/microsofts-new-outlook-app-a-forced-upgrade-with-major-flaws/){:target="_blank"}{: target="_blank"}
[^webview2]: Windows Latest - [Windows 11's Agenda view in the Notification Center is a WebView2](https://www.windowslatest.com/2025/12/07/windows-11s-agenda-view-in-the-notification-center-is-a-webview2-web-app-component-not-native/){:target="_blank"}{: target="_blank"}
[^resource-hog]: Windows Latest - [Discord admits its Windows 11 app is a resource hog](https://www.windowslatest.com/2025/12/06/discord-admits-its-windows-11-app-is-a-resource-hog-tests-auto-restart-when-ram-usage-exceeds-4gb/){:target="_blank"}{: target="_blank"}
[^ai-ceo]: Windows Latest - [As Windows 11 turns into an AI OS](https://www.windowslatest.com/2025/12/01/as-windows-11-turns-into-an-ai-os-microsoft-copilot-boss-does-not-understand-how-ai-is-underwhelming/){:target="_blank"}{: target="_blank"}
[^file-explorer-slow]: Windows Latest - [Windows 11's faster File Explorer preloaded is still slower than Windows 10](https://www.windowslatest.com/2025/11/28/tested-windows-11s-faster-file-explorer-preloaded-is-still-slower-than-windows-10-and-uses-additional-ram/){:target="_blank"}{: target="_blank"}
[^privacy-issues]: Windows Latest - [Microsoft says AI agents are risky](https://www.windowslatest.com/2025/11/30/microsoft-says-ai-agents-are-risky-but-its-moving-ahead-with-the-plan-on-windows-11/){:target="_blank"}{: target="_blank"}
