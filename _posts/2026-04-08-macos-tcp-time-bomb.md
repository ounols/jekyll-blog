---
title: macOS에 숨어있던 49일짜리 시한폭탄 — TCP 네트워킹이 완전히 멈추는 커널 버그
description: macOS XNU 커널의 tcp_now 32비트 정수 오버플로우로 인해 정확히 49일 17시간 후 TCP 연결이 불가능해지는 버그의 발견과 기술적 원리를 분석합니다.
author: claude
date: '2026-04-08 09:00:00'
categories:
  - News Articles
tags:
  - macOS
  - TCP
  - 커널 버그
  - XNU
  - 네트워킹
  - 정수 오버플로우
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [We Found a Ticking Time Bomb in macOS TCP Networking — Photon Blog](https://photon.codes/blog/we-found-a-ticking-time-bomb-in-macos-tcp-networking){:target="_blank"}{: target="_blank"}

![macOS TCP time bomb blog post cover](/media/2026-04-08-macos-tcp-time-bomb/figure-1.avif)
_macOS XNU 커널에서 발견된 49.7일 TCP 시한폭탄_

macOS XNU 커널에는 시스템이 정확히 49일 17시간 2분 47초 동안 재부팅 없이 가동된 순간, TCP 네트워킹이 완전히 멈춰버리는 버그가 존재한다. ping은 정상적으로 응답하고 기존 연결도 살아있지만, 새로운 TCP 소켓을 여는 모든 시도가 조용히 실패한다. 원인은 커널 내부 타임스탬프 카운터의 **32비트 정수 오버플로우**다.

## 발견의 경위: 조용히 멈춘 서버들

Photon은 iMessage 서비스 상태를 모니터링하는 Mac 서버 플리트를 24시간 운용하고 있었다. 2026년 3월 30일, 마지막 재부팅으로부터 정확히 49.7일이 지난 시점에 여러 머신이 조용히 새 TCP 연결을 거부하기 시작했다. ping은 정상이었고 기존 연결도 유지됐지만, 새 소켓을 여는 시도는 모두 실패했다.

문제를 재현하고 이해하기 위해, 팀은 같은 임계점에 도달할 머신 두 대(Machine A, Machine B)를 골라 라이브 실험을 설계했다. 두 머신 모두 2026년 2월 10일에 부팅됐으며, 오버플로우까지 30분 남짓한 시간이 있었다.

## 버그의 핵심: tcp_now의 32비트 오버플로우

XNU 커널의 `tcp_now`는 부팅 이후 경과 시간을 밀리초 단위로 세는 32비트 부호 없는 정수다.[^xnu-source] 32비트가 표현할 수 있는 최댓값은 4,294,967,295ms로, 이를 환산하면 정확히 49일 17시간 2분 47.296초다.

타임스탬프를 갱신하는 함수 `calculate_tcp_clock()`에는 "시계가 뒤로 가지 않도록" 하는 단순한 가드가 포함되어 있다.

```c
void calculate_tcp_clock(void)
{
    uint32_t current_tcp_now;
    struct timeval now;

    microuptime(&now);
    current_tcp_now = (uint32_t)now.tv_sec * 1000 + now.tv_usec / TCP_RETRANSHZ_TO_USEC;

    uint32_t tmp = os_atomic_load(&tcp_now, relaxed);
    if (tmp < current_tcp_now) {
        os_atomic_cmpxchg(&tcp_now, tmp, current_tcp_now, relaxed);
    }
}
```

문제는 `(uint32_t)now.tv_sec * 1000` 연산이다. 시스템이 약 49.7일 동안 가동되면 이 곱셈 결과가 uint32_t의 최댓값을 초과하면서 **0 근처로 다시 감긴다.** 오버플로우 순간, `current_tcp_now`는 거의 0에 가까운 값이 되지만 `tmp`는 여전히 최댓값 근처에 있다. `tmp < current_tcp_now` 조건이 영원히 false가 되어 `tcp_now`는 그 값에 그대로 고정된다. 커널의 TCP 시계가 멈춘 것이다.

## TIME_WAIT이 만료되지 않는 이유

TCP 연결이 닫힐 때 커널은 만료 시각을 `tcp_now + delay`로 기록해둔다.[^tcp-timer] macOS에서 TIME_WAIT 지속 시간은 2 × MSL = 30초다. 주기적으로 가비지 컬렉터 `tcp_gc()`가 큐를 스캔하며 다음 조건이 참일 때 연결을 해제한다.

```c
if (TSTMP_GEQ(tcp_now, tw_tp->t_timer[TCPT_2MSL])) {
    tcp_close(tw_tp);
}
```

`TSTMP_GEQ`는 시퀀스 번호 래핑을 처리하도록 설계된 부호 있는 모듈러 산술 비교다. 그런데 `tcp_now`가 얼어버리면 이 조건은 **절대 참이 되지 않는다.** TIME_WAIT 연결들이 영영 회수되지 않는 것이다.

## 실험으로 재현한 오버플로우 순간

팀은 오버플로우 전후 각 5분간 초당 여러 건의 단명 TCP 연결을 생성하며 TIME_WAIT 수를 관찰했다.

오버플로우 이전에는 **동적 평형 상태**가 관찰됐다. 약 15개씩 연결이 생성되는 속도에 맞춰 TIME_WAIT는 약 200개 수준에서 안정적으로 유지됐다. 생성과 만료가 균형을 이루는 정상적인 상태다.

```
[08:28:08] PHASE=blast | remain=266s | TIME_WAIT=197  ← 안정 상태 진입
[08:30:37] PHASE=blast | remain=117s | TIME_WAIT=198
[08:31:37] PHASE=blast | remain=57s  | TIME_WAIT=200
```

오버플로우가 일어나자 변화는 즉각적이었다.

```
[08:32:34] PHASE=blast | remain=0s   | TIME_WAIT=399
[08:32:36] PHASE=blast | remain=-2s  | TIME_WAIT=412
```

연결 생성을 멈추고 84초가 지난 뒤에도 TIME_WAIT는 줄어들기는커녕 오히려 늘어났다. macOS의 TIME_WAIT 타임아웃이 30초인 점을 감안하면, 84초 후에는 모든 연결이 사라져야 정상이다. 하지만 2,828개였던 TIME_WAIT는 2,837개로 증가했다.

| 시점 | 경과 | TIME_WAIT | 비고 |
|---|---|---|---|
| 08:37:55 | 0초 | 2,828 | 연결 생성 종료 |
| 08:39:19 | +84초 | 2,837 | 0이 되어야 할 값 |
| 08:40:46 | +171초 | 2,852 | 계속 증가 중 |

## 포트 고갈에서 TCP 완전 마비까지

이 버그가 특히 위험한 이유는 소리 없이 진행된다는 점이다. 커널 패닉도, 오류 로그도, 크래시 리포트도 없다. 시스템은 겉으로 완벽히 정상으로 보인다.

오버플로우 후 9.5시간이 지난 시점에서의 상태를 보면, **TIME_WAIT는 단 한 건도 회수되지 않았다.**

| 시점 | Machine A | Machine B |
|---|---|---|
| 오버플로우 직후 | 399 | 801 |
| +5분 | ~723 | 2,828 |
| +9.5시간 | 4,888 | 8,217 |

macOS의 임시 포트 범위는 통상 49152–65535로 약 16,384개다. TIME_WAIT가 이 포트들을 점유하면 새로운 아웃바운드 연결이 포트를 확보하지 못해 SYN_SENT 상태로 실패한다. 9.5시간 후에는 SYN_SENT 상태 연결도 3,000개 이상 쌓였고, Machine B의 로드 애버리지는 49.74까지 치솟았다. 커널이 절대 줄어들지 않는 거대한 TIME_WAIT 큐를 스캔하느라 CPU를 지속적으로 소비하기 때문이다.

ICMP(ping)는 TCP 타이머 서브시스템을 사용하지 않으므로 끝까지 정상 작동한다. 이것이 이 버그를 네트워크 장비 문제나 하드웨어 장애로 오진하게 만드는 요인이기도 하다.

이 버그는 유구한 계보를 가진 정수 오버플로우 버그군에 속한다. Windows 95/98의 49.7일 크래시, 2038년 문제(Y2K38), GPS 주차 번호 롤오버, 팩맨 256스테이지 킬스크린이 모두 같은 계열이다. 카운터가 표현할 수 있는 최대 범위를 소진하는 순간 예상치 못한 동작이 발생한다는 점에서 동일한 본질을 공유한다.

## 마치며

32비트 정수 하나, 단순해 보이는 `if (tmp < current_tcp_now)` 가드 하나, 그리고 49.7일의 인내. 이것이 시한폭탄을 만들기에 충분한 조건이다.

이 버그는 개발 단계에서 잡히지 않는다. 50일짜리 테스트를 누가 실행하겠는가. 코드 리뷰에서도 걸리지 않는다. 로직은 완벽히 합리적으로 보인다. 심지어 운영 환경에서도 네트워크 문제나 하드웨어 장애로 오진될 수 있다.

영향을 받는 환경은 일반 소비자 Mac보다는 **장기간 무중단 운영하는 서버 플리트**에 집중된다. macOS CI/CD 빌드 서버, Mac Pro 워크스테이션, 원격 관리 코로케이션 Mac, Mac mini 빌드팜이 고위험군이다.

팀은 현재 재부팅 없이 동결된 `tcp_now`를 직접 수정하는 워크어라운드를 개발 중이다. 그 전까지의 임시 대책은 명확하다. **49일 17시간 2분 47초 이전에 재부팅을 스케줄링하라.**

## Quick questions

> **일반 Mac 사용자도 이 버그의 영향을 받나요?**
>
> 일반 소비자 Mac은 macOS 시스템 업데이트로 인해 49일 이전에 재부팅되는 경우가 대부분이라 영향이 적습니다. 주로 장기간 무중단으로 운영하는 서버, 빌드 팜, CI/CD 러너 환경이 고위험군입니다.
{: .prompt-info}

> **ping은 되는데 TCP 연결이 안 된다면 이 버그를 의심해야 하나요?**
>
> 네, ping(ICMP)은 정상이지만 새로운 TCP 연결이 전혀 맺어지지 않는 증상이 이 버그의 특징입니다. 업타임이 49일에 근접했는지 확인해보는 것이 첫 번째 진단 단계입니다. `sysctl kern.boottime`으로 부팅 시각을 확인할 수 있습니다.
{: .prompt-info}

> **Apple이 이 버그를 알고 있나요?**
>
> 원문 작성 시점 기준으로 Photon 팀이 이 버그를 공개했습니다. Apple 커뮤니티 포럼에도 동일 증상에 대한 보고가 수년 전부터 존재했지만 원인이 규명되지 않은 상태였습니다. 현재 공식 패치 일정은 공개되지 않았습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^xnu-source]: XNU 커널 소스코드 [apple-oss-distributions/xnu](https://github.com/apple-oss-distributions/xnu){:target="_blank"}{: target="_blank"}에서 `tcp_now`는 `bsd/netinet/tcp_var.h`에 `extern uint32_t tcp_now`로 정의되어 있다.
[^tcp-timer]: TIME_WAIT 만료 처리는 `bsd/netinet/tcp_timer.c`의 `add_to_time_wait_locked()` 함수와 `tcp_gc()` 가비지 컬렉터에서 이루어진다.
