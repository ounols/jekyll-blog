---
title: Cloudflare 2025년 12월 5일 장애 사고 분석 - React 취약점 대응 중 발생한 25분간의 서비스 중단
description: Cloudflare가 React Server Components 취약점 완화 작업 중 겪은 장애 사고의 원인과 복구 과정을 분석합니다.
author: claude
date: '2025-12-06 09:30:00'
categories:
  - News Articles
tags:
  - Cloudflare
  - Outage
  - React
  - CVE
  - WAF
  - Web Security
  - Infrastructure
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Cloudflare outage on December 5, 2025](https://blog.cloudflare.com/5-december-2025-outage/){:target="_blank"}

![Cloudflare 장애 사고](/media/2025-12-06-cloudflare-december-5-outage/figure-1.webp)

Cloudflare가 2025년 12월 5일 오전 8시 47분(UTC)에 시작된 약 25분간의 서비스 장애를 경험했습니다. **이번 사고는 사이버 공격이 아닌 React Server Components 취약점 완화를 위한 설정 변경 과정에서 발생**했으며, 전체 HTTP 트래픽의 약 28%에 영향을 미쳤습니다. 이는 11월 18일 발생한 장애에 이어 불과 2주 만에 일어난 사고로, Cloudflare의 배포 프로세스와 오류 처리 메커니즘에 대한 근본적인 개선이 필요함을 보여줍니다.

## 사고 개요

12월 5일 발생한 이번 장애는 08:47 UTC에 시작되어 09:12 UTC에 완전히 복구되었습니다. 사고의 핵심 타임라인을 정리하면 아래와 같습니다.

- **08:47**: 설정 변경 배포 및 네트워크 전파 시작
- **08:48**: 변경 사항 완전히 전파되어 전체 영향 발생
- **08:50**: 자동 알림을 통해 사고 선언
- **09:11**: 설정 변경 롤백 시작
- **09:12**: 롤백 완료 및 모든 트래픽 복구

**FL1 프록시를 사용하고 Cloudflare Managed Ruleset을 배포한 고객만 영향**을 받았으며, 해당 조건에 해당하는 웹사이트의 모든 요청은 HTTP 500 오류를 반환했습니다. 중국 네트워크를 통한 고객 트래픽은 영향을 받지 않았습니다.

## 사고 발생 원인

### WAF 버퍼 크기 증가

Cloudflare의 Web Application Firewall(WAF)는 악성 페이로드를 탐지하고 차단하기 위해 HTTP 요청 본문 콘텐츠를 메모리에 버퍼링합니다. 기존에는 이 버퍼 크기가 128KB로 설정되어 있었습니다.

최근 공개된 **React Server Components의 중대한 취약점 CVE-2025-55182[^react-cve]에 대응**하기 위해, Cloudflare는 버퍼 크기를 Next.js 애플리케이션의 기본 제한인 1MB로 증가시키는 작업을 진행했습니다. 이는 가능한 많은 고객을 보호하기 위한 조치였으며, 점진적 배포 시스템을 통해 롤아웃되고 있었습니다.

### WAF 테스트 도구 비활성화

롤아웃 과정에서 **내부 WAF 테스트 도구가 증가된 버퍼 크기를 지원하지 않는다는 사실**을 발견했습니다. 이 테스트 도구는 고객 트래픽에 영향을 주지 않는 내부 테스트용이었기 때문에, 이를 비활성화하는 두 번째 변경 사항을 적용했습니다.

문제는 이 두 번째 변경이 **글로벌 설정 시스템을 통해 구현**되었다는 점입니다. 이 시스템은 점진적 롤아웃을 수행하지 않고 몇 초 안에 전체 서버 플릿에 변경 사항을 전파합니다. 이는 11월 18일 장애 이후 검토 중인 시스템이었습니다.[^nov-18-outage]

### 런타임 오류 발생

FL1 버전의 프록시에서 특정 상황 하에, WAF 규칙 테스트 도구를 비활성화하는 두 번째 변경 사항이 오류 상태를 유발했습니다. 코드 실행이 규칙 모듈의 버그에 도달하면서 다음과 같은 Lua 예외가 발생했습니다.

```lua
[lua] Failed to run module rulesets callback late_routing:
/usr/local/nginx-fl/lua/modules/init.lua:314:
attempt to index field 'execute' (a nil value)
```

이로 인해 HTTP 500 오류 코드가 네트워크에서 반환되었습니다.

## 기술적 근본 원인 분석

### Ruleset 시스템의 Execute 액션

Cloudflare의 ruleset 시스템은 각 요청에 대해 평가되는 규칙 집합으로 구성됩니다. 규칙은 트래픽을 선택하는 필터와 해당 트래픽에 효과를 적용하는 액션으로 구성됩니다.

일반적인 액션으로는 "block", "log", "skip" 등이 있으며, 또 다른 유형의 액션으로 **"execute"가 있는데 이는 다른 ruleset의 평가를 트리거**하는 데 사용됩니다. Cloudflare의 내부 로깅 시스템은 이 기능을 사용하여 공개 전에 새 규칙을 평가합니다.

### Killswitch 시스템의 맹점

Cloudflare는 ruleset 시스템의 일부로 killswitch 하위 시스템을 가지고 있으며, 이는 오작동하는 규칙을 빠르게 비활성화할 수 있도록 설계되었습니다. 이 시스템은 과거에 여러 차례 사용되었으며 잘 정의된 표준 운영 절차(SOP)가 있었습니다.

**그러나 "execute" 액션을 가진 규칙에 killswitch를 적용한 적은 한 번도 없었습니다.** killswitch가 적용되었을 때, 코드는 execute 액션의 평가를 올바르게 건너뛰었고 하위 ruleset을 평가하지 않았습니다. 하지만 ruleset 평가의 전체 결과를 처리하는 동안 오류가 발생했습니다.

```lua
if rule_result.action == "execute" then
  rule_result.execute.results = ruleset_results[tonumber(rule_result.execute.results_index)]
end
```

이 코드는 ruleset에 `action="execute"`가 있으면 **`rule_result.execute` 객체가 존재할 것으로 예상**합니다. 그러나 규칙이 건너뛰어졌기 때문에 `rule_result.execute` 객체가 존재하지 않았고, Lua는 nil 값에서 값을 찾으려고 시도하여 오류를 반환했습니다.

이는 강력한 타입 시스템을 가진 언어에서는 방지될 수 있는 간단한 코드 오류입니다. Rust로 작성된 새로운 FL2 프록시의 대체 코드에서는 이 오류가 발생하지 않았습니다.

## 11월 18일 사고와의 유사성

Cloudflare는 불과 2주 전인 11월 18일에도 유사한 서비스 중단을 경험했습니다. **두 경우 모두 고객을 위한 보안 이슈 완화를 돕기 위한 배포가 전체 네트워크에 전파되어 거의 모든 고객 기반에 오류를 발생**시켰습니다.

11월 사고 이후 Cloudflare는 수백 명의 고객과 직접 대화하며 단일 업데이트가 이런 식으로 광범위한 영향을 미치는 것을 방지하기 위한 변경 계획을 공유했습니다. 이러한 변경 사항이 오늘 사고의 영향을 완화하는 데 도움이 되었을 것으로 판단되지만, 아직 배포가 완료되지 않았습니다.

## 진행 중인 복원력 개선 프로젝트

Cloudflare는 이러한 유형의 사고가 재발하지 않도록 여러 프로젝트를 진행 중입니다.

### 1. 향상된 롤아웃 및 버전 관리

소프트웨어를 엄격한 상태 검증과 함께 천천히 배포하는 것과 유사하게, **신속한 위협 대응 및 일반 설정에 사용되는 데이터도 동일한 안전성과 영향 완화 기능**을 가져야 합니다. 여기에는 상태 검증과 빠른 롤백 기능이 포함됩니다.

### 2. 간소화된 긴급 기능

추가적인 유형의 장애에 직면했을 때에도 중요한 작업을 여전히 수행할 수 있도록 보장합니다. 이는 내부 서비스뿐만 아니라 모든 Cloudflare 고객이 사용하는 Cloudflare 제어 플레인과의 모든 표준 상호 작용 방법에 적용됩니다.

### 3. Fail-Open 오류 처리

복원력 노력의 일환으로 **모든 중요한 Cloudflare 데이터 플레인 구성 요소에서 잘못 적용된 hard-fail 로직을 교체**하고 있습니다. 설정 파일이 손상되었거나 범위를 벗어난 경우(예: 기능 한도 초과), 시스템은 오류를 기록하고 요청을 삭제하는 대신 알려진 정상 상태로 기본 설정하거나 점수 없이 트래픽을 전달합니다.

일부 서비스는 특정 시나리오에서 fail open 또는 fail close 옵션을 고객에게 제공할 것입니다. 여기에는 이것이 지속적으로 시행되도록 보장하는 드리프트 방지 기능이 포함됩니다.

## 향후 계획

Cloudflare는 다음 주 말까지 위에 나열된 프로젝트를 포함하여 진행 중인 모든 복원력 프로젝트에 대한 세부 분석을 게시할 예정입니다. **이러한 작업이 진행되는 동안 더 나은 완화 및 롤백 시스템을 갖추기 전까지 네트워크에 대한 모든 변경 사항을 제한**하고 있습니다.

이러한 종류의 사고와 그것들이 얼마나 가깝게 연속적으로 발생했는지는 Cloudflare와 같은 네트워크에서는 용납될 수 없습니다. Cloudflare 팀은 이것이 고객과 인터넷 전체에 다시 한번 야기한 영향과 고통에 대해 사과했습니다.

## Quick questions

> **React Server Components 취약점 CVE-2025-55182는 얼마나 심각한가요?**
>
> Cloudflare가 긴급하게 완화 작업을 진행할 정도로 중대한 취약점입니다. WAF 버퍼 크기를 128KB에서 1MB로 증가시켜야 할 만큼 Next.js 애플리케이션에 광범위한 영향을 미칠 수 있는 것으로 평가됩니다.
{: .prompt-info}

> **왜 FL2 프록시에서는 이 오류가 발생하지 않았나요?**
>
> FL2 프록시는 Rust로 작성되어 강력한 타입 시스템을 갖추고 있습니다. Lua에서 발생한 nil 참조 오류는 Rust의 컴파일 타임 타입 검사를 통해 사전에 방지될 수 있는 유형의 오류입니다.
{: .prompt-info}

> **Cloudflare는 왜 글로벌 설정 시스템을 여전히 사용하고 있나요?**
>
> 11월 18일 장애 이후 해당 시스템은 검토 중이며, 점진적 롤아웃과 상태 검증 기능을 추가하는 작업이 진행 중입니다. 하지만 이번 사고 발생 시점에는 아직 배포가 완료되지 않았습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^react-cve]: National Vulnerability Database - [CVE-2025-55182](https://nvd.nist.gov/vuln/detail/CVE-2025-55182){:target="_blank"}{: target="_blank"}
[^nov-18-outage]: Cloudflare Blog - [Cloudflare outage on November 18, 2025](https://blog.cloudflare.com/18-november-2025-outage/){:target="_blank"}{: target="_blank"}
