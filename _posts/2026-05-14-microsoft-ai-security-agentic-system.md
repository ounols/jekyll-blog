---
title: "AI 기반 보안 시스템, 마이크로소프트가 윈도우 핵심 취약점 발견하며 업계 최고 기록"
description: "Today Microsoft is announcing a major step forward in AI-powered cyber defense: a new multi-model agentic scanning harness (codenamed MDASH)."
author: claude
date: '2026-05-14 18:57:28'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Defense at AI speed: Microsoft’s new multi-model agentic security system tops leading industry benchmark](https://www.microsoft.com/en-us/security/blog/2026/05/12/defense-at-ai-speed-microsofts-new-multi-model-agentic-security-system-tops-leading-industry-benchmark/){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-05-14-microsoft-ai-security-agentic-system/figure-1.jpg)

마이크로소프트는 AI 기반 사이버 방어의 진전을 알리며 새로운 다중 모델 에이전트 스캐닝 하네스(MDASH)를 발표했습니다. 이 시스템은 윈도우 취약점을 발견하고 업계 벤치마크에서 최고 점수를 기록하는 등, AI 취약점 발견이 연구 단계를 넘어 생산 수준의 방어 기술로 발전했음을 보여주었습니다.

## AI 기반 사이버 방어의 진전

Microsoft는 인공지능 기반 사이버 방어 분야에서 중대한 진전을 이루었음을 발표했습니다.

새롭게 선보인 다중 모델 에이전트 스캐닝 하네스(MDASH)는 윈도우 네트워킹 및 인증 스택 전반에서 총 16개의 새로운 취약점을 발견하는 데 기여했습니다.

이러한 발견에는 윈도우 커널 TCP/IP 스택 및 IKEv2 서비스와 같은 컴포넌트에서 네 가지의 치명적인 원격 코드 실행 취약점(Critical remote code execution flaws)이 포함되었습니다.

이 시스템은 단일 모델 방식을 벗어나, 수많은 전위 및 정수 모델을 아우르는 100개 이상의 전문 AI 에이전트를 조정하여 버그를 발견하고 입증하는 방식으로 작동합니다.

이러한 성과는 AI 취약점 발견이 단순한 연구 단계를 넘어 엔터프라이즈 규모의 프로덕션 등급 방어 시스템으로 전환되었음을 명확히 보여줍니다.

## MDASH 시스템의 구조와 작동 방식

Codename MDASH는 본질적으로 에이전트 기반의 취약점 발견 및 해결 시스템입니다. MDASH는 단일 모델 접근 방식이 아닌, 구조화된 파이프라인 형태로 작동하는 것이 특징입니다.

이 시스템은 다수의 전문 AI 에이전트를 오케스트레이션하며, 프론티어 모델과 증류된 모델들을 총동원합니다. MDASH는 100개 이상의 전문 AI 에이전트를 활용하여 취약점을 발견하고, 논의하며, 최종적으로 악용 가능한 버그를 끝까지 입증합니다. 즉, 모델 자체보다는 모델을 둘러싼 에이전트 기반 시스템이 핵심적인 역할을 수행합니다.

## Windows 코드베이스의 보안 감사 난제

Microsoft의 코드베이스는 보안 감사에 여러 가지 난제를 안고 있습니다.

첫째, 방대한 독점 표면(Massive proprietary surface)이 존재합니다. Windows, Hyper-V, Azure 및 관련 장치 드라이버와 서비스 생태계는 일반적인 언어 모델의 학습 자료에 포함되지 않는 Microsoft의 사설 코드베이스입니다. 특히 커널 호출 규약, IRP 및 락 불변성, IPC 신뢰 경계 등은 단순 패턴 매칭으로는 추론하기 매우 어렵습니다.

둘째, 대규모 DevSecOps 환경의 운영 부담입니다. 모든 취약점은 실제 소유자가 있으며, 분류(triage) 과정과 Patch Tuesday를 거쳐야 합니다. 따라서 추측성 발견이 발생할 경우 이를 격리할 수 없으며, 노이즈는 모두가 해결해야 하는 문제입니다.

마지막으로, Windows는 수십억 명의 사용자를 대상으로 하는 고가치 목표물입니다. 단 하나의 심각한 버그를 발견했을 때 얻는 이점이 매우 높은 반면, 최고 등급 컴포넌트에서 발생하는 오탐(false positive)의 비용 또한 매우 높습니다.

## 연구 단계에서 프로덕션 수준으로의 전환

![이미지](/media/2026-05-14-microsoft-ai-security-agentic-system/figure-2.webp)

Microsoft의 Autonomous Code Security(ACS) 팀은 AI 기반 취약점 연구를 단순한 연구 주제에서 기업 규모의 프로덕션 엔지니어링으로 발전시키기 위해 구성되었습니다.

이 팀의 여러 구성원은 $29.5백만 달러의 DARPA AI 사이버 챌린지를 수상했던 팀 아틀란타 출신입니다. 이들은 복잡한 오픈소스 프로젝트에서 실제 버그를 찾아 패치하는 자율적인 사이버 추론 시스템을 개발한 경험이 있습니다.

이러한 경험은 첨단 언어 모델이 전문적인 수준의 보안 감사를 수행하기 위해 필요한 엔지니어링 수준에 대한 중요한 교훈을 제공했으며, 이는 MDASH의 핵심 기반이 되었습니다.

이러한 성숙한 하네스(harness)는 ACS와 Microsoft Windows Attack Research and Protection(WARP) 팀의 긴밀한 협력을 통해 구축되었습니다. WARP 팀이 Windows의 깊고 어려운 공격적 연구를 담당하는 반면, ACS 팀은 AI 기반의 발견 및 검증 파이프라인을 제공하여 생산 수준의 방어 체계를 완성했습니다.

## 성과와 업계 벤치마크 결과

MDASH 시스템을 활용한 연구 결과, 윈도우 네트워킹 및 인증 스택에서 총 16개의 새로운 취약점이 발견되었습니다. 이 중에는 윈도우 커널 TCP/IP 스택 및 IKEv2 서비스와 같은 구성 요소의 치명적인 원격 코드 실행 결함 4건이 포함되었습니다.

내부 테스트에서는 사설 테스트 드라이버에서 심어진 취약점 21개 중 21개를 발견했으며, 오탐(false positives)은 전혀 없었습니다. 또한, clfs.sys에서는 96%, tcpip.sys에서는 100%의 회수율을 달성하며 지난 5년간 확인된 마이크로소프트 보안 대응 센터(MSRC) 사례에 대응했습니다.

공개 벤치마크인 CyberGym(1,507개의 실제 취약점)에서 업계 최고 수준인 88.45%의 점수를 기록하며 리더보드 최상위에 올랐으며, 이는 다음 순위 항목보다 약 5%p 앞선 수치입니다.

## 마치며

Microsoft는 AI 기반 사이버 방어 기술의 진전을 위해 새로운 다중 모델 에이전틱 스캐닝 시스템인 MDASH를 발표했습니다. 이 시스템은 윈도우 네트워킹 스택에서 16개의 취약점을 발견했으며, 업계 최고 수준인 88.45%의 CyberGym 벤치마크 점수를 기록했습니다. 이는 AI 취약점 발견 기술이 연구 단계를 넘어 기업 규모의 생산급 방어 체계로 전환되었음을 보여줍니다. 현재 MDASH는 소수의 고객 및 보안 엔지니어링 팀을 대상으로 비공개 프리뷰가 진행 중입니다.

## Quick questions

> **MDASH는 기존 AI 보안 솔루션과 어떤 차별점을 가지며, 어떻게 작동하는지 궁금합니다.**
>
> MDASH는 단일 모델에 의존하지 않고, 100개 이상의 전문화된 AI 에이전트를 오케스트레이션하는 에이전틱 시스템입니다. 이 시스템은 발견된 버그를 스스로 토론하고 검증하며, 엔드투엔드 방식으로 악용 가능한 버그를 찾아내는 것이 특징입니다.
{: .prompt-info}

> **MDASH의 실제 성능과 효과는 어느 정도인지 구체적인 수치로 설명해 주십시오.**
>
> MDASH는 공개된 CyberGym 벤치마크에서 업계 최고 수준인 88.45%의 점수를 기록했습니다. 또한, 윈도우 커널 TCP/IP 스택 등에서 4개의 치명적인 원격 코드 실행 취약점을 포함하여 총 16개의 새로운 취약점을 발견하였습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

