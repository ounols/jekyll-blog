---
title: "UE6에서 Verse 작동시키기 가이드"
description: "Epic이 UE6에 Verse를 포함하여 배포했지만, 기본적으로 작동하지 않으므로 사용자가 직접 플러그인 및 설정을 구성해야 합니다."
author: claude
date: '2026-06-23 17:44:45'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [How to Get Verse Working in UE6](https://ronaldburns.dev/projects/how-to-verse-in-ue6/){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-06-23-how-to-get-verse-ue6/figure-1.png)

Epic이 UE6에 Verse를 포함하여 배포했지만, 기본적으로 작동하지 않으므로 사용자가 직접 플러그인 및 설정을 구성해야 합니다. 이 기사는 UE6에서 Verse를 실제로 작동시키기 위한 구체적인 설정 단계를 안내합니다.

## Verse in UE6의 현황

* Epic이 배포한 `ue6-main`[^ref1] 브랜치에 Verse가 포함되었으나, **기본적으로 연동되지 않은 상태**
* Verse 스택의 대부분은 존재하지만, 유용한 기능을 구현하는 **일반적인 프로젝트 측 설정 누락**
* 플러그인, 소스, `config` 파일 등 **여러 구성 요소에 대한 수동 연결 필요**
* 기존 `UEFN`처럼 작동하지 않으며, **직접 연결 작업을 통해 정상 작동 구현 가능**

## 시작 전 필수 요구사항

* Unreal Engine 소스에서 `ue6-main` 브랜치 **다운로드 완료**
* 엔진 **컴파일 성공** 및 에디터 오류 없이 실행 확인
* 새로운 UE6 **프로젝트 생성**

## 플러그인 활성화 단계

![이미지](/media/2026-06-23-how-to-get-verse-ue6/figure-2.png)

* **`"Verse State Tree Editor"`를 제외**하고 `Verse` 이름이 포함된 모든 플러그인 활성화
* 지정된 16개 플러그인(`Verse`, `Verse Colors`, `Verse Engine` 등) **목록에 따라** 플러그인 활성화
* `Verse`의 `Print` 기능이 로그에 작동하도록 **`Unreal Engine Experimental` 플러그인** 활성화
* 플러그인 설정 완료 후 **에디터 재시작**을 통해 `Verse` 인식 확인

## 엔진 환경 설정

* 플러그인만으로는 부족하며, Verse 툴체인 활성화를 위한 `ini` 설정 **필수적**
* Verse 툴체인이 작동하기 위해 설정해야 할 `ini` 항목들 존재
* 설정값은 UEFN의 프로젝트 기본값을 **모방**하여 적용
* 신규 UE6 프로젝트에서는 해당 설정들을 **수동으로 직접 지정**해야 함
* 일부 설정은 테스트 및 실험 목적으로 활용 가능하며, `Entity.OneFilePerEntityEnabled=1`과 같은 변수 **조작 가능**

## TEDS 및 SceneGraph 구성

![이미지](/media/2026-06-23-how-to-get-verse-ue6/figure-3.png)

* `Valkyrie.UseTedsOutliner=1` 및 `TEDS.Enable=1` 설정으로 **TEDS 기능 활성화**
* `SceneGraph.EntityProxyActors.Enabled=0` 설정으로 **엔티티 프록시 액터 비활성화**
* `Entity.OneFilePerEntityEnabled=1` 및 관련 설정 활성화로 **단일 파일 엔티티 모드 적용**
* `EntityEditor.EnableAssetComponentSupport=1` 설정으로 **에셋 컴포넌트 지원 활성화**

## 최종 검증

* 플러그인 활성화 후 에디터 재시작을 통해 `Verse`의 **존재를 확인**
* 재시작은 `Verse`가 존재함을 에디터가 인지하는 첫 단계
* 이 단계만으로는 일반 `UE6` 프로젝트가 `UEFN`처럼 **작동하지 않음**

## 마치며

Epic Games가 ue6-main 브랜치에 Verse 기능을 포함시켰으나, 현재는 기본 설정만으로는 UEFN처럼 작동하지 않습니다. 따라서 사용자가 플러그인 활성화 및 콘솔 변수 설정 등 수동으로 엔진을 구성해야 Verse를 실제로 사용할 수 있습니다. 본 가이드를 따르면 필요한 설정을 완료하고 Verse를 작동시킬 수 있습니다.

## Quick questions

> **UE6에 Verse를 사용하려면 어떤 사전 준비가 필요한가요?**
>
> 먼저 Unreal Engine의 ue6-main 브랜치를 다운로드해야 합니다. 또한, 해당 엔진이 오류 없이 성공적으로 컴파일되고 에디터를 열 수 있어야 하며, 작업할 새로운 UE6 프로젝트를 생성해 두셔야 합니다.
{: .prompt-info}

> **Verse 기능을 제대로 작동시키기 위해 어떤 조치를 취해야 하나요?**
>
> Verse와 관련된 모든 플러그인(Verse State Tree Editor 제외)을 활성화해야 합니다. 이와 더불어, Verse의 Print 기능이 제대로 작동하도록 Unreal Engine Experimental 플러그인도 반드시 활성화해야 합니다.
{: .prompt-info}


> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^ref1]: [ue6-main](https://github.com/EpicGames/UnrealEngine/tree/ue6-main){:target="_blank"}
