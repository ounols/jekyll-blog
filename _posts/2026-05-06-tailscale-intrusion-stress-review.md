---
title: "Tailscale 사용 후기: 편리함 뒤의 과도한 침습과 스트레스"
description: "Tailscale의 편리성은 인정하면서도, OS 리졸버와 같은 시스템 구성 요소에 대한 과도한 침습성 때문에 발생하는 기술적 스트레스를 다룬 글입니다."
author: claude
date: '2026-05-06 11:28:19'
categories:
  - News Articles
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Tailscaleやめたい - まいの雑記帳](https://mq1.dev/entry/j7zvrsp48lb/){:target="_blank"}{: target="_blank"}

![대표 이미지](/media/2026-05-06-tailscale-intrusion-stress-review/figure-1.png)

Tailscale의 편리성은 인정하면서도, OS 리졸버와 같은 시스템 구성 요소에 대한 과도한 침습성 때문에 발생하는 기술적 스트레스를 다룬 글입니다. 특히 `/etc/resolv.conf` 처리 방식이 `systemd-resolved`와 충돌하며 겪는 구체적인 문제점을 상세히 서술하고 있습니다.

## Tailscale에 대한 전반적인 불만

Tailscale은 인터넷 직접 연결이 불가능한 호스트에 외부에서 접근할 수 있게 해주고, 소규모 관리 목적으로 매우 유용한 도구임은 인정됩니다.

그러나 이러한 편리함은 운영체제의 리졸버, netfilter, 라우팅 테이블 등 여러 시스템 구성 요소에 대한 전면적인 침습을 대가로 얻어집니다.

문제는 이러한 침습의 '질'이 좋지 않아 사용자에게 상당한 스트레스를 유발한다는 점입니다.

또한, 타인의 환경에 접근하고자 할 때 Tailscale의 사용을 필수로 요구받는 상황에 대해 불편함을 느끼는 사용자의 불만도 존재합니다.

## DNS 설정 파일 처리 문제

Tailscale은 시작 시마다 `/etc/resolv.conf`를 수정하고 MagicDNS 주소(100.100.100.100)를 nameserver의 맨 앞에 삽입합니다. 이 방식은 `systemd-resolved`와 충돌하며 파괴적인 상호작용을 일으킵니다.

`systemd-resolved`가 팔로워 모드(follower mode)로 실행될 경우, Tailscale이 삽입한 100.100.100.100 주소가 `/run/systemd/resolve/resolv.conf`에 혼입됩니다. 그 결과, `systemd-resolved`는 해당 주소를 상위 DNS 서버로 오인하여 지속적으로 DNS 질의를 Tailscale로 전달하게 됩니다. 이는 내부 큐를 가득 채워 DNS 서비스가 마비되는 결과를 초래합니다.

또한, Tailscale의 탐지 로직은 맹점이 존재합니다. 이는 `/etc/resolv.conf`의 심볼릭 링크 파일명만을 기반으로 `systemd-resolved`의 존재 여부를 판단하기 때문입니다. 따라서 `/etc/resolv.conf`가 레거시 측에 링크된 경우, 시스템의 존재를 인지하지 못하고 잘못된 방식으로 작동하게 됩니다.

## RFC 미준수 DNS 구현

Tailscale의 DNS 프록시 구현 자체는 RFC 표준을 준수하지 못하고 있다는 지적입니다.

구체적으로, Tailscale은 EDNS의 OPT 레코드를 완전히 무시하는 등 여러 규약을 위반하고 있습니다. 클라이언트가 UDP 버퍼 크기를 512바이트로 광고하더라도 690바이트를 반환하는 행위는 RFC 6891(responder MUST NOT exceed the requestor's buffer size)을 정면으로 위반합니다.

또한, Cloudflare와 달리 Tailscale DNS는 TC 비트를 설정하여 TCP 폴백을 유도하지 않습니다. 이 외에도 1232바이트를 초과할 경우 트렁케이션 없이 IP 단편화를 일으키며, 상위 서버로부터 TC 비트가 전달되더라도 자체적으로 TCP 폴백을 수행하지 못하는 문제가 있습니다.

더불어, EDNS Client Subnet을 임의로 제거하고 미국 IP로 대체하는 동작이 발생하며, 이는 지연 시간을 100ms 증가시키는 원인이 되기도 합니다. 이러한 동작은 EDNS 유무에 따라 캐시 키가 분리되는 분할된 캐시(split-brain cache) 문제를 야기합니다.

## 64/10 IP 범위 차단 문제

Tailscale의 DNS 구현은 IP 주소 범위 처리 과정에서도 문제점을 보입니다.

특히 EDNS Client Subnet을 임의로 제거하고 미국 IP 주소로 대체하는 동작이 발견되었습니다. 이로 인해 일본에서 연결을 시도했음에도 불구하고 콘텐츠 전송 네트워크(CDN)가 미국 엣지 서버로 트래픽을 유도하는 현상이 발생합니다.

이러한 동작은 사용자가 의도한 지리적 연결을 방해하며, MagicDNS를 통과하는 것만으로도 지연 시간이 100ms 증가하는 결과로 이어집니다. 이는 VPN 사용 시 속도 저하를 초래하는 등, 서비스의 근본적인 성능 및 연결성에 악영향을 미치고 있습니다.

## 마치며

작성자는 Tailscale의 편리성은 인정하면서도, 네트워크 지식이 없는 사용자에게 무분별하게 사용되는 점과 그 구현 방식의 침습성에 대해 비판적인 시각을 드러내고 있습니다. 특히 Tailscale이 시스템의 핵심 설정 파일인 resolv.conf를 강제로 수정하는 행위가 systemd-resolved와 충돌하며 발생하는 기술적 문제를 주요 문제점으로 지적했습니다. 본 글은 Tailscale 사용 중 경험한 불편함과 시스템 전반에 대한 과도한 개입으로 인해 발생하는 스트레스를 구체적으로 다루고 있습니다.

## Quick questions

> **Tailscale의 편리함에도 불구하고 저자가 부정적인 입장을 취하는 주된 이유는 무엇입니까?**
>
> 저자는 Tailscale의 편리함 자체는 인정하고 있으나, 그 편리함이 운영체제의 리졸버, netfilter, 라우팅 테이블 등 시스템 전반에 걸친 '전력적인 침습'을 대가로 성립된다는 점을 지적하고 있습니다. 이러한 시스템에 대한 침습의 질이 좋지 않아 사용자에게 스트레스를 주고 있습니다.
{: .prompt-info}

> **Tailscale 사용 시 발생하는 DNS 설정(resolv.conf) 관련 기술적 충돌 문제는 무엇입니까?**
>
> Tailscale은 시작 시마다 `/etc/resolv.conf`를 수정하여 MagicDNS를 맨 앞에 삽입합니다. 이 과정이 `systemd-resolved`가 follower 모드로 작동하며 생성하는 파일과 충돌하면서, DNS 설정이 잘못된 상태로 읽혀지는 문제가 발생하고 있습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

