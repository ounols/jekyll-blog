---
title: "bumblebee: 소프트웨어 공급망 취약점 검사 도구"
description: "Bumblebee는 macOS 및 Linux 개발자 엔드포인트의 패키지, 확장 프로그램 및 개발 도구 메타데이터를 읽기 전용으로 수집하는 도구입니다."
author: claude
date: '2026-06-25 14:24:11'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [bumblebee](https://github.com/perplexityai/bumblebee){:target="_blank"}{: target="_blank"}

Bumblebee는 macOS 및 Linux 개발자 엔드포인트의 패키지, 확장 프로그램 및 개발 도구 메타데이터를 읽기 전용으로 수집하는 도구입니다. 이 도구는 특정 소프트웨어 공급망 위협에 노출되었는지 여부를 확인하기 위해 로컬 디스크 상태를 구조화된 기록으로 변환하여 제공합니다.

## Bumblebee 개요

* `macOS` 및 `Linux` 개발자 엔드포인트 대상 **읽기 전용 인벤토리 수집기** 역할 수행
* `패키지`, `확장`, `개발자 도구`의 **메타데이터를 수집**하여 현황 파악
* 알려진 **소프트웨어 공급망 위험 노출 여부** 확인을 위한 좁은 공급망 응답 질문에 답변
* `SBOM`이나 `EDR`이 제공하지 못하는 **로컬 디스크 상태** (lockfiles, package-manager metadata 등) 분석

## 데이터 인벤토리 소스

* npm, pnpm, Yarn, Bun: `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` 등 **다양한 자바스크립트 패키지 매니저의 락 파일** 및 관련 메타데이터 스캔
* PyPI: `*.dist-info/METADATA`, `INSTALLER`, `direct_url.json` 등 **파이썬 패키지 정보 파일** 스캔
* Go modules: `go.sum`, `go.mod`를 통해 **Go 모듈의 의존성 정보** 확인
* RubyGems 및 Composer: `Gemfile.lock` 및 `composer.lock` 등 **언어별 의존성 관리 파일** 스캔
* MCP: `mcp.json`, `.mcp.json` 등 **특정 MCP 호스트 설정 파일** 파싱 및 인벤토리 수집
* 확장 프로그램: VS Code, Cursor 등의 **에디터 확장 매니페스트**와 Chromium/Firefox의 `manifest.json`을 통한 브라우저 확장 정보 수집
* Homebrew: Formula의 `INSTALL_RECEIPT.json` 파일 및 cask의 `.metadata` 설치 마커를 통한 **macOS 패키지 설치 기록** 확인

## 기술적 아키텍처

* `bumblebee`는 **단일 정적 바이너리** 구조로, `Go 1.25+`를 요구하며 비표준 라이브러리 종속성 없음
* `baseline`, `project`, `deep` 등 **세 가지 스캔 프로파일** 제공
* `npm ls`, `pip show` 등 **패키지 매니저 실행 및 소스 파일 읽기** 기능 배제
* MCP 호스트 설정에서 환경 값 및 자격 증명 **파싱은 가능**하나, 기록에 포함하지 않음

## 운영 모델 및 제약사항

* **읽기 전용** 방식으로 작동하는 패키지, 확장 및 개발 도구 메타데이터 인벤토리 수집기
* 각 호출 시 **단일 스캔**을 수행하고 종료되는 일회성 스캐너 모델
* 패키지, 확장, 버전 관련 **공급망 응답** 질문에 초점 맞춘 검사 제공
* `exposure catalog` 제공 시, 응답자가 찾는 항목에 대한 **정확한 일치 항목** 플래그 지정 가능

## 배포 및 검증

* 빌드 시 **명시적 버전 지정** 가능하며, `bumblebee version` 명령어로 버전, VCS 리비전, 빌드 시간 확인
* 내장된 **E2E 체크**를 활용한 자체 테스트 기능 제공
* **비정상 종료** 시 로컬 설치의 감지 기능 오류 발생을 의미
* 스캐너의 **캐던스**는 각 호출 시점에 결정되는 일회성 실행

## 마치며

Bumblebee는 macOS 및 Linux 개발자 엔드포인트의 패키지, 확장 프로그램 및 개발 도구 메타데이터를 읽기 전용으로 수집하는 도구입니다. 이 도구는 취약점 권고가 특정 패키지나 버전을 지목했을 때, 현재 개발자 기기들의 로컬 메타데이터에 해당 내용이 존재하는지 신속하게 확인하는 것을 목적으로 합니다. Bumblebee는 잠금 파일, 패키지 관리자 메타데이터 등 분산된 로컬 상태를 구조화된 기록으로 변환하여 공급망 노출 여부를 빠르게 검사할 수 있도록 지원합니다.

## Quick questions

> **Bumblebee는 어떤 목적으로 개발된 도구입니까?**
>
> Bumblebee는 macOS와 Linux 개발자 엔드포인트의 패키지, 확장 프로그램 및 개발자 도구 메타데이터를 읽기 전용으로 수집하는 인벤토리 수집기입니다. 이를 통해 알려진 소프트웨어 공급망 취약점에 노출되었는지 확인하는 데 사용됩니다.
{: .prompt-info}

> **Bumblebee가 수집하는 정보의 범위와 제한 사항은 무엇입니까?**
>
> Bumblebee는 락파일, 패키지 관리자 설치 메타데이터, 확장 프로그램 매니페스트 등 디스크에 있는 상태만 읽습니다. 패키지 관리자를 실행하거나 소스 파일을 읽지는 않으며, 서버 인벤토리에 필요한 구성 요소만 파싱하고 민감한 환경 값은 기록에 포함하지 않습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

