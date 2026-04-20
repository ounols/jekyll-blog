---
title: Vercel 2026년 4월 보안 사고 — 내부 시스템 무단 접근 및 대응 현황
description: 제3자 AI 도구인 Context.ai를 통한 공급망 침해로 시작된 Vercel 보안 사고의 경위와 영향 범위, 그리고 사용자가 취해야 할 조치를 정리합니다.
author: claude
date: '2026-04-20 09:00:00'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Vercel April 2026 security incident](https://vercel.com/kb/bulletin/vercel-april-2026-security-incident){:target="_blank"}{: target="_blank"}

![Vercel April 2026 Security Incident](/media/2026-04-20-vercel-april-2026-security-incident/figure-1.png)
_Vercel의 공식 보안 사고 공지 페이지_

2026년 4월, Vercel이 내부 시스템에 대한 무단 접근 사고를 공개했습니다. 공격은 Vercel 직원이 사용하던 **제3자 AI 도구 Context.ai**를 통해 시작되었으며, 이를 발판으로 공격자는 해당 직원의 Google Workspace 계정을 탈취했습니다. Vercel은 현재 Mandiant를 비롯한 여러 사이버보안 전문 업체, 유관 기관, 법 집행 기관과 협력하여 조사 중입니다.

## 사건 경위 — Context.ai를 통한 공급망 침해

이번 사고는 **Context.ai라는 소규모 제3자 AI 도구의 Google Workspace OAuth 앱이 광범위한 침해**를 당하면서 시작됐습니다. 공격자는 해당 OAuth 앱을 통해 이를 사용하던 Vercel 직원의 Google Workspace 계정 접근 권한을 획득했습니다.

Context.ai OAuth 앱의 침해는 Vercel만의 문제가 아닙니다. 해당 앱을 사용하는 수백 개 조직의 사용자가 동일한 위험에 노출되었을 수 있으며, Vercel은 더 넓은 커뮤니티의 조사를 돕기 위해 침해 지표(IOC)를 공개했습니다.

## 영향 범위와 피해 현황

Vercel은 초기 조사에서 **일부 고객의 Vercel 자격 증명이 침해된 것을 확인**하고 해당 고객에게 즉시 자격 증명 교체를 권고했습니다. 현재까지 별도로 연락을 받지 않은 고객의 경우, Vercel은 해당 고객의 자격 증명이나 개인 정보가 침해되었다고 판단하지 않는다고 밝혔습니다.

공격자는 직원의 계정 탈취를 통해 일부 Vercel 환경과 **"민감(sensitive)"으로 표시되지 않은 환경 변수**에 접근할 수 있었습니다. Vercel의 민감 환경 변수 기능은 값을 읽을 수 없도록 저장하는 방식으로 보호하며, 현재까지 그 값들이 접근된 증거는 발견되지 않았습니다. Vercel은 공격자를 "매우 정교한 수준"으로 평가하고 있으며, 이는 빠른 공격 속도와 Vercel 시스템에 대한 상세한 이해를 근거로 합니다.

## Vercel이 권고하는 대응 방안

Vercel은 사용자들에게 아래 조치를 우선적으로 취할 것을 권고하고 있습니다.

### 1. 활동 로그 검토

계정 및 환경의 활동 로그에서 의심스러운 활동을 확인합니다. 대시보드[^dashboard] 또는 CLI[^cli]를 통해 확인할 수 있습니다.

### 2. 환경 변수 검토 및 교체

API 키, 토큰, 데이터베이스 자격 증명, 서명 키 등 **민감으로 표시되지 않은 시크릿 값은 잠재적으로 노출되었을 가능성**이 있어 우선 교체 대상으로 간주해야 합니다. 앞으로는 민감 환경 변수 기능[^sensitive-env]을 적극 활용하여 시크릿 값이 읽히지 않도록 보호하는 것이 권장됩니다.

### 3. 최근 배포 내역 점검

의심스럽거나 예기치 않은 배포가 있는지 최근 배포 목록[^deployments]을 확인하고, 의심스러운 배포는 삭제합니다.

### 4. 배포 보호(Deployment Protection) 설정 확인

배포 보호 설정이 최소 Standard 이상인지 확인[^deployment-protection]하고, 설정된 경우 Deployment Protection 토큰도 교체합니다.[^dp-tokens]

## 침해 지표(IOC) 공개

Vercel은 커뮤니티의 자체 조사를 지원하기 위해 아래 IOC를 공개했습니다.

> **Google Workspace 관리자 및 계정 소유자에게 즉시 확인을 권고**
>
> OAuth App ID: `110671459871-30f1spbu0hptbs60cb4vsmv79i7bbvqj.apps.googleusercontent.com`
>
> 이 앱이 조직 또는 개인 계정에 연결되어 있다면 즉시 접근 권한을 제거하십시오.
{: .prompt-warning}

해당 OAuth 앱은 Context.ai의 앱으로, Google Workspace 내에서 수백 개 조직에 걸쳐 사용 중인 것으로 파악됩니다. Google Workspace 관리자라면 관리 콘솔에서 해당 앱의 접근 허용 내역을 확인할 수 있습니다.

## 마치며

이번 사고는 **직접적인 취약점이 아닌 신뢰할 수 있다고 여겨졌던 제3자 SaaS 도구를 통한 공급망 공격**이라는 점에서 주목할 만합니다. 아무리 내부 시스템을 견고하게 구성해도 직원이 사용하는 외부 도구 하나가 전체 보안 체계에 영향을 미칠 수 있음을 잘 보여주는 사례입니다. Vercel은 수사가 진행됨에 따라 이 페이지를 계속 업데이트할 예정이라고 밝혔습니다.

## Quick questions

> **Context.ai를 사용하지 않는 고객도 영향을 받나요?**
>
> Vercel에 따르면 Context.ai를 직접 사용하지 않더라도, 공격자가 탈취한 직원 계정을 통해 일부 Vercel 내부 환경에 접근했기 때문에 간접적인 영향을 받을 수 있습니다. 특히 민감으로 표시되지 않은 환경 변수에 시크릿이 저장된 경우 교체가 권장됩니다.
{: .prompt-info}

> **민감 환경 변수로 설정된 값은 안전한가요?**
>
> 현재까지 Vercel의 민감 환경 변수에 접근된 증거는 발견되지 않았습니다. 해당 기능은 저장된 값을 읽을 수 없는 방식으로 보호하도록 설계되어 있습니다.
{: .prompt-info}

> **Google Workspace OAuth 앱을 통한 공격을 어떻게 방어할 수 있나요?**
>
> Google Workspace 관리 콘솔에서 조직 내 승인된 서드파티 OAuth 앱 목록을 정기적으로 검토하고, 불필요하거나 인식되지 않는 앱의 접근 권한을 제거하는 것이 중요합니다. 앱 접근 허용 정책을 관리자 승인 방식으로 제한하는 것도 효과적인 예방책입니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^dashboard]: 대시보드 활동 로그 [Activity Log](https://vercel.com/activity-log){:target="_blank"}{: target="_blank"}
[^cli]: CLI 활동 로그 [Vercel CLI Activity](https://vercel.com/docs/cli/activity){:target="_blank"}{: target="_blank"}
[^sensitive-env]: 민감 환경 변수 기능 [Sensitive Environment Variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables){:target="_blank"}{: target="_blank"}
[^deployments]: 최근 배포 목록 [Recent Deployments](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fdeployments){:target="_blank"}{: target="_blank"}
[^deployment-protection]: Deployment Protection 설정 [Deployment Protection Settings](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fsettings%2Fdeployment-protection){:target="_blank"}{: target="_blank"}
[^dp-tokens]: Deployment Protection 토큰 교체 [Protection Bypass Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation){:target="_blank"}{: target="_blank"}
