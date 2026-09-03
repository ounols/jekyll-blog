---
title: "Tailcat: Tailscale 없이 Tailscale 사용하기"
description: "테일스케일 개발팀이 테일스케일의 데이터 플레인(WireGuard, NAT 순회, DERP)을 사용하되, 테일스케일 제어 플레인이나 계정 없이 사용할 수 있는 오픈 소스 도구인 테일캣을 공개했습니다."
author: claude
date: '2026-09-02 17:43:03'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Tailcat: Tailscale without Tailscale, by Tailscale](https://tailscale.com/blog/tailcat?utm_content=bufferdf994&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-09-02-tailcat-tailscale-wireguard-derp/figure-1.png)

테일스케일 개발팀이 테일스케일의 데이터 플레인(WireGuard, NAT 순회, DERP)을 사용하되, 테일스케일 제어 플레인이나 계정 없이 사용할 수 있는 오픈 소스 도구인 테일캣을 공개했습니다. 테일캣은 IP 주소, 계정, 관리자 기능 없이 순수하게 연결 통신만을 제공하는 것이 특징입니다.

## Tailcat의 정의와 목적

* Tailscale 개발자들이 **작성한** Tailscale의 일부를 재조합한 프로젝트
* `WireGuard`, `NAT traversal`[^ref1], `DERP`[^ref2]를 포함하는 **오픈소스 데이터 플레인** 사용
* Tailscale의 **제어 플레인이나 계정** 없이 작동하는 독립적인 구조
* Tailscale 기능을 활용하되, **독립적인 네트워크 연결**을 제공하는 목적

## Tailcat의 특징

* 오픈 소스 `Go` 패키지 및 `CLI` 도구로 구현
* **서버 측 리스너**와 클라이언트 실행을 통한 연결 기능 제공
* 양방향 바이트 전송이 가능한 데이터 스트림 처리
* `netcat`과 유사하나 Tailscale의 `magicsock`을 활용하여 동작
* **IP 주소, 계정, 제어 플레인** 등 관리 기능 완전 배제
* 루트 또는 관리자 `OS` 접근 권한 없이 구동 가능
* Tailscale 회사에 대한 **종속성 없이** 사용 가능

## Tailscale의 구성 요소 해석

* **`WireGuard`** 자체 기능에만 집중하는 사용자 그룹 존재
* **기업 구조, 재정, 신뢰성** 등 회사의 장기적인 측면을 논하는 사용자 그룹 존재
* **`core`**, `DERP server`, `clients`는 오픈 소스이나, 서버 측 제어 플레인은 오픈 소스가 아님
* Tailscale은 `WireGuard` + `NAT traversal` + `DERP`를 포함하는 데이터 플레인으로 구성
* **제어 플레인** 및 서비스를 제공하는 `회사` 자체가 Tailscale의 구성 요소로 존재

## Tailcat 작동 방식

* 서버는 `ephemeral` 또는 `named & reused` **키쌍을 생성**
* DERP 서버 선택 (사용자가 지정하거나 자동 선택)
* `tc + base64(CBOR( public key + DERP bootstrap info ))` 형태의 Tailcat 주소 생성
* 주소 문자열을 `out of band` 채널을 통해 **공유** (직접 또는 DNS TXT 레코드 사용)
* 클라이언트가 렌데브우 DERP 서버에 연결
* `MEOW` 메시지를 DERP를 통해 전송하여 **`netmap`에 자신 추가**

## 클라이언트와 연결 과정

* 서버가 클라이언트의 `public key` 승인 시, **`MEOW` 응답 전송**
* 클라이언트가 `WireGuard` 위에 **임베디드 사용자 공간 `TCP` 스택**을 사용하여 연결 진행
* `public key`에서 파생된 실제 `IPv6` 주소 사용되지만 **사용자에게는 노출되지 않음**
* `operating system`은 `TCP` 계층에 관여하지 않으며 **합성 `tailcat` IP를 인식하지 않음**
* `operating system`의 역할은 **`DERP TCP` 연결 전송에 한정**

## 마치며

Tailcat은 Tailscale의 핵심 기술인 WireGuard, NAT 통과, DERP 데이터 플레인을 활용하지만, Tailscale의 제어 평면이나 계정 시스템은 사용하지 않는 오픈소스 프로젝트입니다. 이는 사용자가 IP 주소나 계정 없이 서버와 클라이언트를 연결하여 양방향 통신을 수행할 수 있게 해줍니다. Tailcat은 WireGuard의 단순한 구현을 넘어, 중앙 관리 기능 없이도 Tailscale의 핵심 네트워킹 기능을 활용하고자 하는 사용자들에게 대안을 제공합니다.

## Quick questions

> **tailcat이 정확히 무엇이며, 어떤 기능을 제공합니까?**
>
> tailcat은 Tailscale의 핵심 구성 요소인 WireGuard, NAT traversal, DERP 데이터 플레인을 활용하지만, Tailscale의 제어 플레인은 사용하지 않는 도구입니다. 이는 마치 netcat처럼 작동하며, Tailscale의 기술을 이용해 양방향 데이터 통신을 가능하게 합니다.
{: .prompt-info}

> **tailcat을 사용함으로써 얻을 수 있는 가장 큰 장점은 무엇입니까?**
>
> tailcat은 IP 주소, 계정, 관리자 권한, 제어 플레인 등 Tailscale의 관리 기능 없이 순수하게 데이터 전송 기능만을 제공합니다. 따라서 사용자는 완전히 독립적이고 비중앙화된 방식으로 연결을 구축할 수 있습니다.
{: .prompt-info}


> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^ref1]: [NAT traversal](https://tailscale.com/blog/how-nat-traversal-works){:target="_blank"}
[^ref2]: [DERP](https://tailscale.com/docs/reference/derp-servers){:target="_blank"}
