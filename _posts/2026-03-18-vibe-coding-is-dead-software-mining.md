---
title: 바이브 코딩의 종말과 소프트웨어 마이닝의 시대
description: 데이터로 증명된 바이브 코딩의 실패, 그리고 테스트 주도 AI 생성 방식인 소프트웨어 마이닝이 개발 패러다임을 어떻게 바꾸고 있는지 분석합니다.
author: claude
date: '2026-03-18 09:00:00'
categories:
  - News Articles
tags:
  - Vibe Coding
  - AI
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Software developers don't need to outlast vibe coding (Reddit r/webdev)](https://www.reddit.com/r/webdev/comments/1rvacl9/software_developers_dont_need_to_outlast_vibe/){:target="_blank"}

![Vibe Coding is Dead](/media/2026-03-18-vibe-coding-is-dead-software-mining/figure-1.jpg)

2025년 2월, Andrej Karpathy가 "바이브 코딩(Vibe Coding)"이라는 개념을 소개했습니다. 원하는 것을 설명하고, AI 출력을 그대로 수용하고, 오류를 다시 붙여넣으며 감각적으로 반복하는 방식입니다. Collins 사전은 이를 2025년 올해의 단어로 선정했지만, 얼마 지나지 않아 데이터가 쏟아지기 시작했습니다. 그리고 그 데이터가 가리키는 방향은 명확했습니다.[^lesswrong]

## 바이브 코딩, 데이터로 증명된 실패

바이브 코딩이 실패한다는 근거는 이제 여러 연구를 통해 누적되고 있습니다. METR이 수행한 무작위 대조 실험(RCT)에서 AI를 사용한 개발자들은 그렇지 않은 경우보다 **19% 더 느린 속도**로 작업을 완료했습니다. 그러면서도 당사자들은 자신이 20% 더 빠르다고 믿고 있었습니다. 속도 저하와 착각이 동시에 발생한 셈입니다.[^metr]

보안 면에서도 마찬가지입니다. CodeRabbit이 470개의 오픈소스 풀 리퀘스트를 분석한 결과, AI가 공동 작성한 코드에서 **XSS(크로스 사이트 스크립팅) 취약점이 2.74배 더 많이** 발견됐습니다.[^coderabbit] 여러 대학 연구자들이 공동 작성한 논문은 바이브 코딩이 오픈소스 생태계를 위협한다고 주장하기도 했습니다.[^opensourcepaper]

이 수치들이 가리키는 결론은 간단합니다. 인간이 느낌으로 판단하는 루프 안에 AI를 넣는 방식은 작동하지 않습니다.

## 소프트웨어 마이닝이란 무엇인가

LessWrong에 게재된 Anders Lindström의 글은 새로운 패러다임을 제시합니다. 바로 "소프트웨어 마이닝(Software Mining)"입니다. 핵심 아이디어는 비트코인 채굴에서 빌려온 비유로 잘 설명됩니다.

비트코인의 핵심 발견은 **해를 이해할 필요 없이, 검증이 저렴하면 충분하다**는 것입니다. 블록을 해시하고, 값이 충분히 작은지 확인하면 됩니다. 소프트웨어 마이닝도 동일한 원리를 코드에 적용합니다. AI가 수많은 코드 후보를 생성하고, 테스트 스위트가 그것을 평가하며, 통과한 것만 살아남습니다. 인간은 코드를 작성하는 것이 아니라 **테스트 스위트를 작성**합니다.

바이브 코딩이 "인간의 감각 + AI 생성"에 베팅했다면, 소프트웨어 마이닝은 "자동화된 평가 + AI 생성"에 베팅합니다. 인간은 내부 루프의 미적 심판에서 외부 루프의 평가 엔지니어로 역할이 바뀝니다.

## 마이닝 리그가 된 AI 에이전트

이 패러다임은 이미 현실에서 작동하고 있습니다. Claude Code는 현재 전체 GitHub 커밋의 약 4%를 자율적으로 작성하고 있습니다.[^claudecode] 다중 파일 변경, 테스트 실행, 실패 시 재시도, 며칠 단위의 작업 범위가 모두 자율적으로 처리됩니다. OpenClaw는 여기에 오케스트레이션 계층을 추가합니다. 하트비트 스케줄링, 야간 크론 작업, 자가 설치 기능 등을 통해 사용자는 자고 일어나면 완성된 코드를 받아볼 수 있습니다.[^openclaw]

이것들은 더 이상 챗봇이 아닙니다. 채굴 리그입니다.

DeepMind의 AlphaEvolve는 이 패러다임의 가장 강력한 증거입니다. 56년간 깨지지 않던 행렬 곱셈 알고리즘 성능 기록을 갱신하는 알고리즘을 채굴한 것입니다.[^alphaevolve] 이후 그 알고리즘을 기반으로 자신의 학습 속도를 향상시키는 최적화를 스스로 찾아냈습니다. 인간의 창의적 방향 없이도 결과가 나왔습니다. 바이브로 만들어진 것이 아니라, 채굴된 것입니다.

## 개발자의 새로운 역할: 평가 함수 작성자

소프트웨어 마이닝의 병목은 항상 평가 함수입니다. 비트코인의 평가 함수는 단순합니다. 코드를 위한 평가 함수는 더 풍부해야 합니다. 테스트를 통과하는가? 빠른가? 안전한가?

알고리즘 최적화, 버그 수정, 성능 튜닝처럼 **테스트 스위트가 심판 역할을 할 수 있는 영역**에서 소프트웨어 마이닝은 이미 효과적으로 작동합니다. 그러나 아직 채굴할 수 없는 것도 있습니다. 제품-시장 적합성, 새로운 연구 방향, 어떤 문제가 해결할 가치가 있는지에 대한 판단이 그것입니다.

이 지점에서 인간은 여전히 루프 안에 있습니다. 코드를 작성하거나 코드를 심판하는 것이 아니라, **탐색 공간을 선택**하는 역할입니다. 평가 함수를 작성하는 것이 새로운 엔지니어링이 되고, 무엇을 평가할지 선택하는 것이 새로운 기업가정신이 됩니다.

## AI 비용과 해시레이트 경제학

비트코인이 해시파워가 증가함에 따라 난이도를 조정하듯, 소프트웨어 생태계도 같은 현상이 나타납니다. AI 생성 코드가 생태계에 넘쳐나면서 iOS 앱 출시 수가 2025년에 전년 대비 60% 증가했습니다.[^iosapps] 손쉬운 영역이 채굴되어 버리면, 남은 것은 더 나은 평가 함수와 더 많은 컴퓨팅을 요구합니다.

METR의 연구에서 보듯, 인간이 루프 안에 있으면 AI 없이 작업하는 것보다 느려집니다. 인간을 제거하고, 평가를 자동화하면, 처리량은 **추론 비용 × 테스트 실행 시간**에 의해서만 제한됩니다. 전략적 대응은 추론 예산을 해시파워를 다루듯 의도적으로 배분하는 것입니다.

코딩 벤치마크 점수는 18개월 만에 거의 두 배가 됐습니다. SWE-bench Verified는 49%에서, Aider 코드 편집 벤치마크는 88%까지 도달했습니다.[^swefetch] 모델 비용은 매월 낮아지고 있습니다. 알고리즘 최적화 분야에서 수천 개의 후보를 생성하는 것이 하나를 직접 작성하는 것보다 이미 유리한 상황이며, 이 임계점은 분기마다 낮아지고 있습니다.

> AI 비용 구조에 대해 더 자세히 알고 싶다면, 블로그에 작성된 [AI 산업의 수익성 위기 - 왜 모든 기업이 적자를 보고 있는가](/posts/why-everybody-is-losing-money-on-ai/){:target="_blank"} 포스트도 참고해 보시기 바랍니다. AI 서비스 제공의 구조적 비용 문제를 다루고 있습니다.
{: .prompt-tip}

## 마치며

r/webdev의 원 포스트 제목은 "소프트웨어 개발자들은 바이브 코딩보다 오래 살아남을 필요가 없다"입니다. 그 이유는 이제 명확합니다. 바이브 코딩은 이미 자체 무게를 이기지 못하고 무너지고 있기 때문입니다.

전환은 이미 시작됐습니다. 인간 개발자의 역할은 코드를 작성하는 사람에서 **무엇이 좋은 코드인지 정의하는 사람**으로 이동하고 있습니다. 테스트 스위트를 작성하고, 해시레이트를 높이는 것이 지금의 과제입니다.

## Quick questions

> **바이브 코딩과 소프트웨어 마이닝의 핵심 차이점은 무엇인가요?**
>
> 바이브 코딩은 인간이 AI 출력물을 감각적으로 판단하며 반복하는 방식으로, 인간의 심미적 판단이 내부 루프에 있습니다. 소프트웨어 마이닝은 자동화된 테스트 스위트가 심판 역할을 하고 AI가 수많은 후보를 생성하는 방식으로, 인간은 무엇을 평가할지 결정하는 외부 루프에 위치합니다.
{: .prompt-info}

> **소프트웨어 마이닝 시대에 개발자가 준비해야 할 가장 중요한 역량은 무엇인가요?**
>
> 테스트 스위트 작성 능력이 핵심입니다. AI가 생성한 코드 후보를 객관적으로 평가할 수 있는 정밀한 평가 함수를 설계하는 능력이 엔지니어의 새로운 핵심 역량이 됩니다. 무엇을 만들지 판단하는 도메인 지식과 시스템 설계 능력도 여전히 중요합니다.
{: .prompt-info}

> **지금 당장 바이브 코딩 대신 소프트웨어 마이닝 방식을 적용할 수 있나요?**
>
> 테스트로 검증 가능한 문제라면 지금도 적용할 수 있습니다. 알고리즘 최적화, 버그 수정, 성능 튜닝 등이 좋은 시작점입니다. 먼저 좋은 테스트 스위트를 작성한 뒤 AI에게 구현을 맡기는 방식으로 전환해 보시기 바랍니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^lesswrong]: LessWrong - [Vibe Coding Is Dead: Welcome to Software Mining](https://www.lesswrong.com/posts/FxYHcNkAvS7gBJLnC/vibe-coding-is-dead-welcome-to-software-mining){:target="_blank"}{: target="_blank"} (Anders Lindström, 2026-03-12)
[^metr]: METR - [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/){:target="_blank"}{: target="_blank"}
[^coderabbit]: CodeRabbit - [State of AI vs Human Code Generation Report](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report){:target="_blank"}{: target="_blank"}
[^opensourcepaper]: arXiv - [Vibe Coding Kills Open Source](https://arxiv.org/abs/2601.15494){:target="_blank"}{: target="_blank"}
[^claudecode]: SemiAnalysis - [Claude Code is the Inflection Point](https://newsletter.semianalysis.com/p/claude-code-is-the-inflection-point){:target="_blank"}{: target="_blank"}
[^openclaw]: GitHub - [OpenClaw](https://github.com/openclaw/openclaw){:target="_blank"}{: target="_blank"}
[^alphaevolve]: Google DeepMind - [AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/){:target="_blank"}{: target="_blank"}
[^iosapps]: Gamigion - [iOS App releases jumped 60% in 2025 after three years of flat growth](https://www.gamigion.com/ios-app-releases-jumped-60-in-2025-after-three-years-of-flat-growth/){:target="_blank"}{: target="_blank"}
[^swefetch]: Aider - [Code editing benchmark scores](https://aider.chat/docs/leaderboards){:target="_blank"}{: target="_blank"}
