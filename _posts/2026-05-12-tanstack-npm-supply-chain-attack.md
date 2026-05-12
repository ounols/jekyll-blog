---
title: "TanStack npm 공급망 침해: 주요 클라우드 자격 증명 노출 위험"
description: "2026-05-11 19:20~19:26 UTC에 공격자가 42개 @tanstack/ npm 패키지에 걸쳐 악성 버전 84개를 게시함공격 체인은 pull_request_target “Pwn Request”, GitHub Actions 캐시 오염, runner 메모리의 OIDC 토큰 추출을 결합함npm 토큰과 publish 워크플로는 탈취·손상되지 않았고, "
author: claude
date: '2026-05-12 12:32:44'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [사후 분석: TanStack npm 공급망 침해](https://news.hada.io/topic?id=29413){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-05-12-tanstack-npm-supply-chain-attack/figure-1.png)

공격자가 2026년 5월 11일 @tanstack/ npm 패키지 42개에 걸쳐 악성 버전 84개를 게시하는 공급망 침해 사건이 발생했습니다. 이 악성코드는 GitHub Actions의 OIDC 토큰 추출 등을 통해 AWS, GCP, Kubernetes 등 다양한 서비스의 자격 증명을 노출시킬 수 있어 사용자들의 즉각적인 조치가 필요합니다.

## 사건 개요 및 공격 범위

사건 개요 및 공격 범위

2026년 5월 11일 19:20~19:26 UTC에 공격자가 @tanstack/ npm 패키지 42개에 걸쳐 악성 버전 84개를 게시하는 npm 공급망 침해가 발생했습니다.

이번 공격은 pull_request_target “Pwn Request”, GitHub Actions 캐시 오염, runner 메모리의 OIDC 토큰 추출을 결합한 체인을 통해 이루어졌습니다. npm 토큰과 publish 워크플로는 탈취되거나 손상되지 않았으나, 악성코드가 OIDC trusted publisher 권한으로 레지스트리에 직접 게시되었습니다.

영향 범위는 42개 패키지와 84개 버전이며, 영향 버전 설치 시 AWS, GCP, Kubernetes, Vault, GitHub, npm, SSH 자격 증명이 노출되었을 수 있어 교체가 필수적입니다.

한편, @tanstack/query*, @tanstack/table*, @tanstack/form*, @tanstack/virtual*, @tanstack/store, @tanstack/start 메타 패키지는 확인된 비영향 제품군에 해당합니다.

## 공격 체인 및 악성코드 동작 방식

공격 체인은 pull_request_target “Pwn Request”, GitHub Actions 캐시 오염, 그리고 runner 메모리에서의 OIDC 토큰 추출을 결합하여 악성 패키지를 게시했습니다.

악성코드는 개발자나 CI 환경에서 npm install, pnpm install, 또는 yarn install을 실행할 때 작동합니다. 이 과정에서 npm이 악성 optionalDependencies 항목을 해석하고 fork network의 orphan payload commit을 가져오게 됩니다.

이후 prepare 라이프사이클 스크립트가 실행되며, 영향 tarball 내에 숨겨진 약 2.3MB 난독화된 router_init.js가 동작합니다. 해당 스크립트는 AWS IMDS/Secrets Manager, GCP metadata, Kubernetes service-account token, Vault token, ~/.npmrc, GitHub token, gh CLI, .git-credentials, SSH private key 등 일반적인 위치에서 자격 증명을 수집합니다.

탈취된 데이터는 Session/Oxen messenger file-upload network를 통해 filev2.getsession.org, seed{1,2,3}.getsession.org로 유출됩니다. 또한, 이 악성코드는 registry.npmjs.org/-/v1/search?text=maintainer:<user> 검색을 통해 피해자가 관리하는 다른 패키지를 열거한 뒤, 동일한 주입 방식으로 재게시하는 자기 전파 로직을 포함하고 있습니다.

## GitHub Actions 캐시 오염 단계

공격은 2026년 5월 10일 17:16 UTC에 공격자가 TanStack/router의 fork인 `github.com/zblgg/configuration`을 생성하면서 시작되었습니다. 공격자는 2026년 5월 10일 23:29 UTC에 조작된 신원으로 악성 커밋 65bf499d16a5e8d25ba95d69ec9790a6dd4a1f14를 해당 fork에 작성했습니다. 이 커밋에는 약 30,000줄 분량의 JavaScript 페이로드가 포함된 `packages/history/vite_setup.mjs` 파일이 추가되었으며, 커밋 메시지에 `[skip ci]`를 넣어 CI 실행을 의도적으로 억제했습니다.

이후 2026년 5월 11일 약 10:49 UTC에 zblgg가 TanStack/router 메인 브랜치를 대상으로 PR #7378을 개설했고, `pull_request_target` 워크플로우가 자동으로 실행되었습니다. 2026년 5월 11일 11:11 UTC에 공격자가 악성 커밋 65bf499d를 PR 헤드에 올리자, `bundle-size.yml`의 `benchmark-pr` 작업이 PR을 체크아웃하며 `vite_setup.mjs`를 실행시켰습니다. 이 과정에서 2026년 5월 11일 11:29 UTC에 1.1GB 크기의 GitHub Actions 캐시가 TanStack/router에 저장되었으며, 이 캐시는 `refs/heads/main` 범위에 저장되어 공격의 발판이 되었습니다.

## OIDC 토큰 탈취 및 악성 패키지 게시

공격자는 GitHub Actions runner 프로세스 메모리에서 OIDC 토큰을 추출하는 방식으로 인증 정보를 확보했습니다.
이러한 탈취는 npm 토큰이나 공식적인 publish 워크플로 자체의 손상 없이 이루어졌습니다.
악성코드는 이 추출된 OIDC 토큰을 사용하여 레지스트리에 직접 게시 작업을 수행했습니다.
이 과정에서 악성 스크립트는 `id-token: write` 권한으로 OIDC 토큰을 발급받아 `registry.npmjs.org`에 직접 POST했습니다.
비록 게시 인증이 공식적으로는 OIDC trusted-publisher 바인딩을 통해 이루어진 것으로 보였으나, 실제 게시 주체는 테스트 및 정리 단계에서 실행된 악성코드로 확인되었습니다.
결과적으로 2026-05-11 19:20:39 UTC에 걸쳐 42개 패키지에 걸쳐 약 84개의 악성 버전이 npm 레지스트리에 게시되었습니다.

## 영향 범위 및 자격 증명 노출

영향 범위는 총 42개 패키지에 걸쳐 84개 악성 버전으로 확인되었습니다. 이 패키지들은 약 6분 간격으로 게시되었으며, 전체 목록은 TanStack/router#7383 추적 이슈에 포함되어 있습니다.

다만, @tanstack/query*, @tanstack/table*, @tanstack/form*, @tanstack/virtual*, @tanstack/store, @tanstack/start 메타 패키지는 비영향 제품군으로 확인되었으나, @tanstack/start-*는 비영향 목록에 포함되지 않았습니다.

악성코드가 실행될 경우, 설치 호스트에서 접근 가능한 AWS, GCP, Kubernetes, Vault, GitHub, npm, SSH 자격 증명이 노출되었을 가능성이 있어 해당 자격 증명의 교체가 필수적입니다.

모든 영향 버전은 이미 deprecated 처리되었으며, npm security와 함께 레지스트리에서 tarball 제거 조치가 완료되었습니다. 관련 내용은 GitHub Security Advisory GHSA-g7cv-rxg3-hmpx를 통해 확인할 수 있습니다.

## 사건 타임라인 요약

공격은 2026년 5월 10일 17:16 UTC에 공격자가 TanStack/router의 포크를 생성하면서 시작되었습니다. 같은 날 23:29 UTC에는 악성 코드가 포함된 커밋이 해당 포크에 추가되었습니다.

이후 5월 11일 오전 중, 공격자는 반복적인 강제 푸시를 통해 특정 벤치마크 작업이 실행되도록 유도했으며, 이 과정에서 2026년 5월 11일 11:29 UTC에 1.1GB 규모의 오염된 GitHub Actions 캐시가 TanStack/router에 저장되었습니다.

실제 악성 패키지 게시 단계는 2026년 5월 11일 19:15 UTC에 PR #7369가 병합되면서 촉발되었습니다. 이로 인해 19:20:39 UTC에 npm 레지스트리에 42개 패키지에 걸친 총 84개의 악성 버전이 게시되었습니다. 이 게시 작업은 OIDC trusted-publisher 권한을 악용한 내부 악성 스크립트에 의해 직접 이루어졌습니다.

## 마치며

2026년 5월 11일, TanStack npm 패키지에 공급망 침해가 발생하여 42개 패키지에 걸쳐 84개의 악성 버전이 게시되었습니다. 공격자는 OIDC 토큰 추출 등 정교한 방식으로 악성 코드를 삽입하여 AWS, GCP, Kubernetes 등 다양한 서비스의 자격 증명이 노출될 위험이 있었습니다. 모든 영향 버전은 레지스트리에서 제거되었으며, 해당 날짜에 악성 버전을 설치한 사용자는 반드시 관련 자격 증명을 교체해야 합니다.

## Quick questions

> **영향을 받은 패키지의 악성 코드는 어떤 방식으로 작동하며 어떤 정보를 탈취했습니까?**
>
> 개발자나 CI 환경에서 영향 버전을 설치하면 악성 optionalDependencies가 실행되며 숨겨진 스크립트가 동작합니다. 이 스크립트는 AWS, GCP, Kubernetes, Vault, GitHub, npm, SSH 등 일반적인 위치에서 자격 증명을 수집하고, 지정된 C2 네트워크를 통해 유출시킵니다.
{: .prompt-info}

> **악성코드가 NPM 토큰을 탈취하지 않았음에도 불구하고 어떻게 패키지에 악성 코드를 게시할 수 있었습니까?**
>
> 공격자는 NPM 토큰이나 publish 워크플로를 손상시키지 않았습니다. 대신, pull_request_target “Pwn Request” 패턴과 GitHub Actions 캐시 오염, 그리고 runner 메모리에서 OIDC 토큰을 추출하는 복합적인 공격 체인을 결합하여 악성 코드를 등록했습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

