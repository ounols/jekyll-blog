---
title: "Dirty Frag: 주요 리눅스 배포판 루트 권한 획득 취약점"
description: "Contribute to V4bel/dirtyfrag development by creating an account on GitHub."
author: claude
date: '2026-05-08 11:27:13'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Search code, repositories, users, issues, pull requests...](https://github.com/V4bel/dirtyfrag){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-05-08-dirty-frag-linux-lpe/figure-1.png)

Dirty Frag는 Hyunwoo Kim이 발견한 취약점 클래스로, xfrm-ESP Page-Cache Write 취약점과 RxRPC Page-Cache Write 취약점을 연쇄적으로 이용하여 주요 리눅스 배포판에서 루트 권한을 획득할 수 있습니다. 이 취약점은 Dirty Pipe 및 Copy Fail과 같은 버그 클래스를 확장하는 결정론적 로직 버그입니다.

## Dirty Frag 취약점 개요

Dirty Frag는 주요 Linux 배포판에서 루트 권한을 획득할 수 있는 취약점 클래스입니다. 이 취약점은 Hyunwoo Kim(@v4bel)에 의해 최초로 발견 및 보고되었으며, xfrm-ESP Page-Cache Write 취약점과 RxRPC Page-Cache Write 취약점을 연쇄적으로 결합하여 작동합니다.

Dirty Frag는 Dirty Pipe[4] 및 Copy Fail[5]가 속한 버그 클래스를 확장하는 사례입니다. 이 취약점은 타이밍 윈도우에 의존하지 않는 결정론적 논리 오류라는 특징을 가지며, 익스플로잇 실패 시 커널 패닉이 발생하지 않고 성공률이 매우 높습니다.

현재 이 버그는 임시 금지 기간이 해제되었으며, 관련 패치나 CVE는 존재하지 않습니다. 해당 문서의 공개는 linux-distros@vs.openwall.org 유지 관리자들과의 협의를 거쳐 요청에 따라 이루어졌습니다.

## 취약점 메커니즘 및 특징

Dirty Frag는 범용적인 리눅스 LPE(Local Privilege Escalation) 취약점 클래스입니다.

이 취약점은 Hyunwoo Kim(@v4bel)에 의해 최초 발견되었으며, `xfrm-ESP Page-Cache Write vulnerability`와 `RxRPC Page-Cache Write vulnerability`를 연쇄적으로 결합하여 주요 리눅스 배포판에서 루트 권한을 획득할 수 있습니다.

Dirty Frag는 Dirty Pipe와 Copy Fail이 속한 버그 클래스를 확장하는 사례입니다.

가장 큰 특징은 이 취약점이 결정론적 로직 버그라는 점입니다. 따라서 타이밍 윈도우에 의존하지 않아 경쟁 조건(race condition)이 필요 없으며, 익스플로잇이 실패하더라도 커널이 패닉하지 않습니다. 이로 인해 성공률이 매우 높은 것이 특징입니다.

## 익스플로잇 방법 및 영향

Dirty Frag는 주요 Linux 배포판에서 root 권한을 획득할 수 있는 심각한 취약점입니다. 이는 xfrm-ESP Page-Cache Write 취약점과 RxRPC Page-Cache Write 취약점을 연쇄적으로 결합하여 작동합니다.

이 취약점은 타이밍 윈도우에 의존하지 않는 결정론적 로직 버그의 특성을 가집니다. 따라서 레이스 조건이 필요 없으며, 익스플로잇 시도가 실패하더라도 커널이 패닉하지 않아 성공률이 매우 높습니다.

기술적인 정보를 바탕으로 제공된 PoC를 통해 익스플로잇이 가능합니다. 다만, 이 PoC는 테스트 권한이 부여된 시스템에서만 사용되어야 합니다.

## 영향받는 시스템 버전 범위

Dirty Frag 취약점은 두 가지 핵심 버그를 연결하여 작동합니다. 첫 번째 취약점인 xfrm-ESP Page-Cache Write 취약점은 2017년 1월 17일(cac2661c53f3)부터 최신 버전까지 적용 대상입니다. 두 번째 취약점인 RxRPC Page-Cache Write 취약점은 2023년 6월(2dc334f1a63a)부터 적용됩니다.

이 두 취약점의 유효 수명을 합치면 약 9년에 달하는 것으로 파악됩니다.

해당 Dirty Frag 취약점은 다양한 배포판 버전을 대상으로 테스트되었습니다. 테스트된 배포판 버전은 다음과 같습니다.

*   Ubuntu 24.04.4: 6.17.0-23-generic
*   RHEL 10

## 대응 방안 및 완화 조치

현재 Dirty Frag 취약점과 관련하여 공식적인 패치나 CVE는 존재하지 않는 상황입니다. 해당 취약점의 특성상, 사용자는 공식적인 보안 업데이트를 기다리며 대응해야 합니다.

사용자들은 리눅스 배포판 유지 관리자들(linux-distros@vs.openwall.org)의 요청에 따라 공개된 정보를 주기적으로 확인하는 것이 중요합니다. 취약점의 영향을 받는 버전 범위가 명시되어 있으므로, 시스템 관리자는 해당 배포판의 버전(예: Ubuntu 24.04.4, RHEL 10)을 면밀히 점검해야 합니다.

궁극적인 완화 조치 및 대응 방안은 배포판 공급업체가 해당 취약점을 해결한 최신 커널 버전으로 시스템을 업데이트하는 것입니다. 따라서 공식 보안 권고 및 패치 알림을 최우선적으로 확인하며 시스템을 관리할 것을 권고합니다.

## 마치며

Dirty Frag는 Hyunwoo Kim(@v4bel)이 발견한 새로운 취약점 계열로, 주요 리눅스 배포판에서 루트 권한을 획득할 수 있는 LPE(Local Privilege Escalation)입니다. 이 취약점은 xfrm-ESP Page-Cache Write 취약점과 RxRPC Page-Cache Write 취약점을 연쇄적으로 결합하여 작동합니다. Dirty Frag는 Dirty Pipe와 Copy Fail과 같은 버그 계열에 속하며, 타이밍에 의존하지 않는 결정론적 논리 버그라는 특징을 가지고 있습니다. 따라서 이 취약점은 안정적이고 예측 가능한 방식으로 권한 상승을 가능하게 합니다.

## Quick questions

> **Dirty Frag는 무엇이며 어떤 위험을 초래합니까?**
>
> Dirty Frag는 주요 리눅스 배포판에서 루트 권한을 획득할 수 있게 하는 취약점 클래스입니다. 이 취약점은 Hyunwoo Kim 님에 의해 발견 및 보고되었으며, 심각한 보안 위협으로 간주됩니다.
{: .prompt-info}

> **Dirty Frag는 어떤 방식으로 작동하며 다른 취약점과 차이점이 있습니까?**
>
> Dirty Frag는 xfrm-ESP Page-Cache Write 취약점과 RxRPC Page-Cache Write 취약점을 연쇄적으로 이용하는 방식으로 작동합니다. 또한, 타이밍에 의존하지 않는 결정론적 논리 버그라는 특징을 가지고 있습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

