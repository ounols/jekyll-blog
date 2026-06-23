---
title: "GitHub, TeamPCP의 내부 저장소 침해 주장 조사 중"
description: "GitHub is investigating unauthorized access to internal repositories after TeamPCP listed alleged source code and internal organizations for sale."
author: claude
date: '2026-05-20 16:10:06'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [GitHub Investigating TeamPCP Claimed Breach of ~4,000 Internal Repositories](https://thehackernews.com/2026/05/github-investigating-teampcp-claimed.html){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-05-20-github-investigating-teampcp-breach/figure-1.jpg)

GitHub는 악명 높은 해커 집단 TeamPCP가 플랫폼의 소스 코드를 판매하며 내부 저장소에 무단 접근한 사건을 조사하고 있다고 밝혔습니다. GitHub는 해당 활동이 내부 저장소 정보 유출에 국한된 것으로 파악했으며, 고객 정보에 대한 영향은 없다고 덧붙였습니다.

## GitHub 내부 저장소 무단 접근 조사

GitHub는 악명 높은 위협 행위자 TeamPCP가 플랫폼의 소스 코드와 내부 조직을 사이버 범죄 포럼에 판매 목록에 올린 이후, 내부 저장소에 대한 무단 접근 조사를 진행하고 있습니다.

Microsoft 소유 계열사인 GitHub는 현재 고객의 엔터프라이즈, 조직, 저장소 등 내부 저장소 외부에 저장된 고객 정보에 대한 영향은 없다고 밝혔습니다.

TeamPCP가 판매했다고 주장하는 데이터 유출은 약 4,000개의 저장소를 포함하고 있는 것으로 알려졌습니다.

이후 GitHub는 포이즈닝된 Microsoft Visual Studio Code 확장 프로그램을 통해 직원 장치가 손상된 것을 감지하고 해당 위협을 차단했습니다.

회사는 위험 완화 조치로 중요 시크릿을 순환시키고 최고 영향도 자격 증명에 우선순위를 두었습니다.

GitHub의 현재 평가에 따르면, 이 활동은 GitHub 내부 저장소의 유출에만 관련되었으며, 공격자가 주장하는 약 3,800개의 저장소는 현재 조사 결과와 방향성이 일치한다고 밝혔습니다.

## TeamPCP의 데이터 판매 및 위협

GitHub는 악명 높은 해커 그룹 TeamPCP가 플랫폼의 소스 코드와 내부 조직 정보를 사이버 범죄 포럼에 판매 게시한 이후, 내부 저장소에 대한 무단 접근 조사를 진행 중입니다.

TeamPCP는 오픈소스 패키지를 표적으로 한 공급망 공격을 감행했던 공격자로, GitHub의 소스 코드를 최소 50,000달러 이상의 가격을 받고 판매했습니다. 해당 데이터 유출물에는 약 4,000개의 저장소가 포함된 것으로 알려졌습니다.

해당 그룹은 게시물을 통해 "이것은 몸값 요구가 아니다"라고 밝혔습니다. 이들은 GitHub를 협박하는 것이 목적이 아니며, 구매자가 나타나지 않을 경우 데이터를 무료로 유출할 것이라고 위협했습니다.

## 직원 기기 감염 및 보안 조치

GitHub는 후속 업데이트를 통해 직원 기기가 침해된 사실을 발견하고 이를 성공적으로 격리했다고 밝혔습니다.

이러한 기기 침해는 악성 코드가 삽입된 Microsoft Visual Studio Code 확장 프로그램과 관련이 있는 것으로 확인되었습니다. 이에 대한 위험 완화 조치로 회사는 핵심 비밀 정보(secrets)를 순환했으며, 특히 영향도가 높은 인증 정보에 우선적으로 조치를 취했습니다. 현재의 평가에 따르면, 해당 활동은 GitHub 내부 저장소의 정보 유출에 국한된 것으로 파악되었습니다.

## Mini Shai-Hulud 악성코드 캠페인

![이미지](/media/2026-05-20-github-investigating-teampcp-breach/figure-2.png)

TeamPCP의 자기 복제 악성코드 캠페인인 Mini Shai-Hulud가 지속적으로 확산되고 있습니다.

이 캠페인은 Microsoft의 공식 Python 클라이언트인 durabletask의 침해를 통해 확산 범위를 넓히고 있습니다. 침해된 durabletask 패키지에서는 1.4.1, 1.4.2, 1.4.3 세 가지 악성 버전이 확인되었습니다.

패키지에 내장된 페이로드인 드로퍼는 외부 서버인 check.git-service[.]com에서 두 번째 단계 페이로드("rope.pyz")를 가져와 실행하도록 구성되어 있습니다.

이 악성코드는 지난주 guardrails-ai 패키지 침해와 관련하여 배포된 페이로드의 진화형으로 평가되고 있습니다.

## durabletask PyPI 패키지 침해

TeamPCP의 악성코드 캠페인인 Mini Shai-Hulud는 공식 Microsoft Python 클라이언트인 durabletask를 침해하며 확산되고 있습니다.

해당 캠페인은 durabletask의 공식 패키지 세 가지 악성 버전인 1.4.1, 1.4.2, 1.4.3을 식별한 것으로 알려졌습니다.

이는 공격자가 기존 공격을 통해 GitHub 계정을 탈취하고, 저장소의 GitHub 시크릿을 유출한 뒤, 해당 PyPi 토큰을 이용해 악성 패키지를 직접 게시했기 때문에 발생했습니다.

패키지에 포함된 페이로드(payload)는 드로퍼(dropper) 역할을 하며, 외부 서버인 "check.git-service[.]com"으로부터 두 번째 단계 페이로드("rope.pyz")를 가져와 실행하도록 설정되어 있습니다.

## 악성코드의 기능 및 전파 방식

Mini Shai-Hulud 악성코드는 드로퍼 형태로 구성되어 외부 서버인 "check.git-service[.]com"으로부터 두 번째 단계 페이로드("rope.pyz")를 가져와 실행합니다. 이 페이로드는 리눅스 시스템에서만 실행되도록 설정된 완전 기능의 인포스틸러를 활성화합니다.

이 스틸러는 주요 클라우드 제공업체, 비밀번호 관리자 및 개발 도구와 관련된 자격 증명을 수집하며, HashiCorp Vault KV secrets를 읽거나 1Password 및 Bitwarden 비밀번호 금고를 해제하고 데이터 덤프를 시도합니다. 또한 SSH 키, Docker 자격 증명, VPN 구성 및 쉘 히스토리 등에 접근할 수 있습니다.

전파 방식 측면에서, 이 악성코드는 다양한 환경에서 확산됩니다. AWS 환경에서는 SSM을 사용하여 다른 EC2 인스턴스로 스스로를 전파하며, Kubernetes 환경에서는 kubectl exec을 통해 확산됩니다.

특히, Aikido Security에 따르면 AWS 환경에서 SSM 관리 인스턴스를 열거한 후 SendCommand와 AWS-RunShellScript 문서를 사용하여 rope.pyz 페이로드를 실행합니다. 또한, 이 악성코드는 이스라엘 또는 이란 시스템 설정을 감지할 경우, 1/6의 확률로 오디오를 재생한 뒤 rm -rf /* 명령을 실행하는 특이한 동작을 포함하고 있습니다.

## 마치며

GitHub는 악명 높은 해커 그룹 TeamPCP가 플랫폼의 소스 코드와 약 4,000개의 내부 저장소를 사이버 범죄 포럼에 판매 글을 올리면서 무단 접근 조사를 시작했습니다. 회사는 현재 고객 정보가 외부 저장소에 영향을 받았다는 증거는 없다고 밝혔으나, 내부 인프라에 대한 모니터링을 강화하고 있습니다. 이번 사고는 TeamPCP가 직원 장치에 침투한 악성 코드 확장 프로그램을 통해 내부 저장소의 자료를 유출한 것으로 확인되었습니다. GitHub는 현재 활동이 내부 저장소의 자료 유출에 국한되었다고 평가했습니다.

## Quick questions

> **이번 보안 침해는 어떤 경로를 통해 발생했습니까?**
>
> GitHub는 직원 장치에 감염된 악성 Microsoft Visual Studio Code 확장 프로그램이 원인인 침해를 탐지하고 격리했다고 밝혔습니다. 이에 따라 회사는 가장 큰 영향을 미치는 자격 증명을 우선하여 주요 비밀 정보를 교체하는 등 위험 완화 조치를 취했습니다.
{: .prompt-info}

> **유출된 데이터가 고객 정보인지, 아니면 GitHub 내부 정보인지 궁금합니다.**
>
> GitHub는 현재 고객의 기업, 조직, 저장소 등 외부 저장된 고객 정보에 대한 영향은 없다고 밝혔습니다. 다만, 공격자가 GitHub 내부 저장소 약 4,000개를 유출한 것으로 확인되었으며, 회사는 계속해서 인프라를 면밀히 모니터링하고 있습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

