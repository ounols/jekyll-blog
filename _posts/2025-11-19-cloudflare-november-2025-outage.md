---
title: Cloudflare 대규모 장애 사건 - 설정 파일 크기 초과가 불러온 인터넷 마비
description: 2025년 11월 18일 발생한 Cloudflare 대규모 장애 사건의 원인과 복구 과정 분석
author: claude
date: '2025-11-19 11:20:00'
categories:
  - News Articles
tags:
  - Cloudflare
  - Outage
  - Infrastructure
  - Configuration Management
  - Rust
  - ClickHouse
  - Bot Management
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Hacker News Discussion](https://news.ycombinator.com/item?id=45973709){: target="_blank"}

![Cloudflare outage error page](/media/2025-11-19-cloudflare-november-2025-outage/figure-1.webp)

2025년 11월 18일 오전 11시 20분(UTC), 인터넷 인프라의 핵심 기업인 Cloudflare에서 **전 세계적인 대규모 장애**가 발생했습니다. X(구 Twitter), ChatGPT, McDonald's 등 수많은 웹사이트가 동시에 접속 불가 상태가 되면서 인터넷 사용자들은 혼란에 빠졌습니다. Cloudflare의 전 FL(Frontline) 시스템 핵심 개발자인 Guanlan Dai는 이 사건에 대해 "공격이 아닌 전형적인 숨겨진 가정과 설정 체인의 연쇄 반응"이라고 설명했습니다.

## 사건 개요와 영향 범위

이번 장애는 11월 18일 오전 11시 20분에 시작되어 오후 5시 6분에 완전히 복구되었습니다. 약 6시간에 걸친 이 장애로 인해 Cloudflare의 핵심 CDN 및 보안 서비스가 HTTP 5xx 오류를 반환했으며, Turnstile, Workers KV, Access 등 다양한 서비스가 영향을 받았습니다.

Cloudflare의 CEO인 Matthew Prince는 공식 블로그를 통해 "2019년 이후 최악의 장애"라고 인정하며 사과했습니다.[^official-blog] 특히 이번 장애가 외부 공격이 아닌 **내부 설정 관리 문제**로 발생했다는 점에서 더욱 주목받고 있습니다.

## 기술적 원인 분석

### 1. ClickHouse 권한 변경이 촉발한 문제

장애의 시작점은 **ClickHouse 데이터베이스의 권한 관리 개선 작업**이었습니다. Cloudflare는 분산 쿼리의 보안과 안정성을 향상시키기 위해 오전 11시 5분에 권한 변경을 배포했습니다.

기존에는 ClickHouse 사용자가 `default` 데이터베이스의 테이블만 볼 수 있었습니다. 그러나 권한 변경 후, 사용자는 기본 데이터가 저장된 `r0` 데이터베이스의 테이블 메타데이터까지 볼 수 있게 되었습니다.

문제는 Bot Management 시스템의 feature 파일 생성 로직이 다음과 같은 쿼리를 사용했다는 점입니다.

```sql
SELECT name, type
FROM system.columns
WHERE table = 'http_requests_features'
ORDER BY name;
```

이 쿼리는 **데이터베이스 이름을 필터링하지 않았기 때문에**, 권한 변경 후 `default`와 `r0` 두 데이터베이스의 컬럼 정보를 모두 반환하게 되었습니다. 결과적으로 feature 파일의 행 수가 **두 배 이상 증가**했습니다.

### 2. 메모리 사전 할당 한계 초과

Cloudflare의 Bot Management 시스템은 성능 최적화를 위해 **최대 200개의 feature를 처리할 수 있도록 메모리를 사전 할당**하고 있었습니다. 이는 당시 약 60개의 feature를 사용하고 있던 상황에서 충분한 여유를 제공하는 설정이었습니다.

하지만 중복된 행이 포함된 feature 파일이 생성되면서 이 한계를 초과했고, Rust로 작성된 FL2 프록시 코드는 다음과 같이 패닉(panic) 상태에 빠졌습니다.

```rust
thread fl2_worker_thread panicked: called Result::unwrap() on an Err value
```

Guanlan Dai는 이에 대해 "Rust가 특정 오류를 완화할 수 있지만, 경계 레이어, 데이터 흐름, 설정 파이프라인의 복잡성은 언어 범위를 넘어선다"고 지적했습니다.[^twitter-thread]

### 3. 설정 파일의 연쇄적 전파

더 큰 문제는 **잘못된 feature 파일이 Cloudflare의 전 세계 네트워크로 자동 전파**되었다는 점입니다. 이 파일은 5분마다 ClickHouse 클러스터의 쿼리에 의해 생성되고, 모든 엣지 서버에 배포되어 Bot Management 시스템을 최신 상태로 유지합니다.

ClickHouse 클러스터가 점진적으로 업데이트되면서, 5분마다 정상 파일과 비정상 파일이 번갈아 생성되었습니다. 이로 인해 **시스템이 복구되었다가 다시 장애가 발생하는 패턴**이 반복되었고, 초기에는 DDoS 공격으로 오인되기도 했습니다.

![HTTP 5xx 에러 증가 그래프](/media/2025-11-19-cloudflare-november-2025-outage/figure-2.webp)
_장애 기간 동안의 HTTP 5xx 에러 발생량_

## 복구 과정의 난제

### 소프트웨어 롤백이 불가능한 이유

일반적인 소프트웨어 장애와 달리, 이번 사건에서는 **코드 버전을 롤백하는 것이 해결책이 될 수 없었습니다**. Guanlan Dai는 "이것은 코드 문제가 아니라 지속적으로 전파되는 잘못된 설정"이라고 설명했습니다.

서버를 재시작하면 모든 노드가 잘못된 설정을 더 빠르게 로드하여 **장애가 가속화**될 뿐이었습니다. 또한 설정 파일은 버전 관리가 되지 않고 지속적으로 업데이트되는 피드처럼 작동하기 때문에, ClickHouse 파이프라인이 활성화되어 있는 한 수동으로 롤백해도 **몇 분 내에 새로운 손상된 파일이 재생성**되어 수정 내용을 덮어쓰게 됩니다.

### 전역 킬 스위치의 부재

Guanlan Dai는 "전역 킬 스위치가 불충분하여 신속한 차단이 불가능했다"고 지적했습니다. 또한 초기에 공격을 의심한 것도 복구를 지연시킨 요인이 되었습니다.

결국 Cloudflare 팀은 다음과 같은 단계로 문제를 해결했습니다.

1. **오후 1시 5분**: Workers KV와 Access를 이전 버전의 프록시로 우회시켜 영향 감소
2. **오후 2시 24분**: 새로운 Bot Management 설정 파일의 생성 및 전파 중단
3. **오후 2시 30분**: 정상적인 설정 파일을 수동으로 배포하고 핵심 프록시 재시작

## 시스템 설계의 교훈

### 설정 검증의 중요성

이번 사건은 **자동 생성된 설정 파일도 사용자 입력처럼 엄격하게 검증해야 한다**는 교훈을 남겼습니다. Guanlan Dai는 "설정 시스템은 '잘못된 것은 거부하고, 마지막으로 알려진 정상 상태를 유지'하는 로직이 필요하다"고 강조했습니다.

Cloudflare는 공식 블로그에서 다음과 같은 개선 계획을 발표했습니다.

- Cloudflare가 생성한 설정 파일을 사용자 입력과 동일하게 강화
- 기능별 전역 킬 스위치 확대
- 코어 덤프나 기타 오류 보고서가 시스템 리소스를 압도하지 않도록 제거
- 모든 핵심 프록시 모듈의 오류 조건에 대한 실패 모드 검토

### 언어의 한계를 넘어선 시스템 설계

Rust는 메모리 안전성과 같은 특정 오류를 방지하는 데 탁월하지만, Guanlan Dai가 지적했듯이 **시스템 계약(contract), 격리 레이어(isolation layer), fail-safe 메커니즘 설계**는 언어 차원에서 해결할 수 없는 영역입니다.

이번 사건에서 Rust의 `unwrap()` 호출이 패닉을 발생시켰지만, 설령 이를 올바르게 처리했다 하더라도 메모리 부족(OOM) 문제는 여전히 발생했을 것입니다. 진짜 문제는 **feature 수집 과정에서 계약 검증이 부재**했다는 점입니다.

## 마치며

Cloudflare의 이번 장애는 현대 인터넷 인프라가 얼마나 복잡하고 섬세한 균형 위에 서 있는지를 보여줍니다. 단일 데이터베이스 권한 변경이 전 세계 수천 개의 웹사이트를 마비시킬 수 있다는 사실은 충격적이면서도 시사하는 바가 큽니다.

특히 주목할 점은 이 문제가 **코드의 버그가 아닌 숨겨진 가정과 불충분한 검증**에서 비롯되었다는 것입니다. 아무리 뛰어난 기술 스택을 사용하더라도, 시스템 간 계약을 명확히 정의하고 예외 상황을 철저히 검증하지 않으면 예상치 못한 장애를 피할 수 없습니다.

Guanlan Dai의 말처럼, 이런 사고가 발생했을 때 가장 힘든 것은 현장에서 불을 끄는 엔지니어들입니다. Cloudflare 팀의 신속한 대응과 투명한 사후 분석은 업계의 모범 사례로 평가받을 만합니다.

## Quick questions

> **이번 Cloudflare 장애는 사이버 공격 때문인가요?**
>
> 아닙니다. Cloudflare는 공식적으로 이번 장애가 외부 공격이나 악의적인 활동과 전혀 관련이 없다고 밝혔습니다. 순수하게 내부 데이터베이스 권한 변경으로 인한 설정 파일 크기 초과 문제였습니다.
{: .prompt-info}

> **왜 서버를 재시작하거나 소프트웨어를 롤백하지 않았나요?**
>
> 이번 장애는 코드 문제가 아니라 지속적으로 전파되는 잘못된 설정 파일 때문이었습니다. 재시작하면 모든 노드가 잘못된 설정을 더 빠르게 로드하여 장애가 가속화될 뿐이었고, ClickHouse 파이프라인이 계속 작동하는 한 롤백해도 몇 분 내에 손상된 파일이 재생성되었습니다.
{: .prompt-info}

> **Rust로 작성되었는데 왜 이런 오류가 발생했나요?**
>
> Rust는 메모리 안전성 같은 특정 오류를 방지하지만, 시스템 계약, 데이터 흐름, 설정 파이프라인의 복잡성은 언어 차원에서 해결할 수 없습니다. 이번 사건의 핵심 문제는 설정 파일 수집 과정에서 크기 검증이 부재했다는 점이었습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^official-blog]: Cloudflare Blog - [Cloudflare outage on November 18, 2025](https://blog.cloudflare.com/18-november-2025-outage/){: target="_blank"}
[^twitter-thread]: Guanlan Dai on X - [Cloudflare FL 개발자의 기술 분석](https://x.com/guanlandai/status/1990967570011468071){: target="_blank"}
