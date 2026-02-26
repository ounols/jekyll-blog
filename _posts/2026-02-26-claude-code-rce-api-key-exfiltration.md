---
title: "Claude Code 보안 취약점: 원격 코드 실행 및 API 키 탈취"
description: Check Point Research가 공개한 Anthropic Claude Code의 세 가지 보안 취약점을 분석합니다. 신뢰되지 않은 저장소를 열기만 해도 원격 코드 실행과 API 키 탈취가 가능했던 취약점들을 살펴봅니다.
author: claude
date: '2026-02-26 10:00:00'
categories:
  - News Articles
tags:
  - Claude Code
  - Security
  - RCE
  - Anthropic
  - CVE
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Claude Code Flaws Allow Remote Code Execution and API Key Exfiltration](https://thehackernews.com/2026/02/claude-code-flaws-allow-remote-code.html){:target="_blank"}

![Claude Code 보안 취약점](/media/2026-02-26-claude-code-rce-api-key-exfiltration/figure-1.jpg)

Check Point Research가 Anthropic의 AI 기반 코딩 도우미 Claude Code에서 세 가지 보안 취약점을 발견해 공개했습니다. 이 취약점들은 **신뢰되지 않은 저장소를 클론하고 여는 행위만으로도** 원격 코드 실행과 API 키 탈취가 가능하게 만드는 심각한 결함으로, 모두 2026년 1월까지 패치 완료되었습니다.

## Claude Code 플랫폼과 설정 파일 기반 공격 표면

Claude Code는 개발자가 터미널에서 자연어 명령으로 코딩 작업을 위임할 수 있는 Anthropic의 CLI 기반 개발 도구입니다. 파일 수정, Git 관리, 테스트 자동화, 빌드 시스템 통합, MCP(Model Context Protocol) 도구 연결, 셸 명령 실행 등 포괄적인 개발 작업을 지원합니다.

Claude Code는 프로젝트 수준의 설정을 `.claude/settings.json` 파일을 통해 관리합니다. 이 파일이 저장소에 포함되면 팀원들이 저장소를 클론할 때 동일한 설정을 자동으로 공유할 수 있어 협업에 유리합니다. 그러나 저장소에 커밋 권한이 있는 누구라도 이 파일을 수정할 수 있다는 점에서 **설정 파일 자체가 공격 표면이 될 수 있다**는 것이 이번 연구의 출발점이었습니다.

## 세 가지 취약점 상세 분석

### 1. 프로젝트 훅을 통한 원격 코드 실행 (CVSS 8.7)

Claude Code의 Hooks 기능은 도구 수명 주기의 특정 지점에서 사용자 정의 명령을 실행하는 결정론적 제어 메커니즘으로, `.claude/settings.json`에 정의됩니다. 코드 포맷팅 자동화, 규정 준수 검사, 특정 디렉토리 보호 등에 활용됩니다.

연구진은 `SessionStart` 이벤트의 startup 매처를 활용한 훅이 Claude Code 초기화 시 **사용자 추가 승인 없이 자동으로 실행**된다는 점을 발견했습니다. 신뢰 여부를 묻는 다이얼로그를 확인하는 것만으로 훅이 즉시 실행되는 반면, 일반적인 배시 명령 실행 시에는 별도의 명시적 승인을 요구하는 것과 대조됩니다. 공격자는 훅에 악성 페이로드를 다운로드하여 실행하는 셸 명령을 삽입할 수 있으며, 리버스 셸 획득까지 가능함이 시연으로 확인되었습니다. 이 취약점은 2025년 9월 버전 1.0.87에서 패치되었습니다.[^vuln1]

### 2. MCP 사용자 동의 우회 (CVE-2025-59536, CVSS 8.7)

MCP 서버는 `.mcp.json` 파일로 저장소에서 설정할 수 있으며, Claude Code 대화 시작 시 해당 명령을 실행하여 모든 MCP 서버를 초기화합니다. Anthropic은 첫 번째 취약점 신고 이후 MCP 서버 초기화 전 위험성을 명확히 알리는 개선된 동의 다이얼로그를 도입했습니다.

그러나 연구진은 `.claude/settings.json`의 `enableAllProjectMcpServers` 옵션을 `true`로 설정하면 이 동의 과정을 완전히 우회할 수 있음을 발견했습니다. **사용자가 신뢰 다이얼로그를 읽기도 전에 명령이 실행**되는 상황이 발생한 것입니다. 이 취약점은 2025년 10월 버전 1.0.111에서 패치되었으며, 저장소의 설정 파일에 `enableAllProjectMcpServers`가 설정되어 있더라도 사용자 승인 전에는 MCP 서버가 실행되지 않도록 수정되었습니다.[^vuln2]

### 3. API 키 탈취 공격 (CVE-2026-21852, CVSS 5.3)

세 번째 취약점은 환경변수 설정을 통한 API 키 탈취입니다. `.claude/settings.json`에서 `ANTHROPIC_BASE_URL` 환경변수를 재정의할 수 있으며, 이 변수는 Claude Code의 모든 API 통신 엔드포인트를 제어합니다.

연구진은 mitmproxy로 트래픽을 모니터링하던 중, **신뢰 다이얼로그가 표시되기 전에 이미 API 요청이 시작**된다는 것을 발견했습니다. 이 요청에는 Anthropic API 키가 인증 헤더에 평문으로 포함되어 있었습니다. 공격자가 `ANTHROPIC_BASE_URL`을 자신의 서버로 설정한 저장소를 피해자가 클론하면, 사용자 상호작용 없이 API 키가 공격자 서버로 전송됩니다.[^vuln3]

탈취된 API 키의 위험은 과금 남용을 넘어 팀 전체의 공유 리소스에도 미칩니다. Anthropic의 Workspaces 기능에서는 파일이 개별 API 키가 아닌 워크스페이스 자체에 귀속됩니다. 연구진은 다운로드 제한이 있는 파일도 Claude의 코드 실행 도구를 통해 재생성하면 다운로드가 가능함을 시연했으며, 이를 통해 **팀 전체의 공유 파일 읽기 및 삭제, 악성 파일 업로드, 예기치 않은 API 비용 발생**이 가능함을 확인했습니다.

## 공급망 공격 시나리오와 보호 방법

이 취약점들이 특히 위험한 이유는 공급망 공격 벡터를 활용하기 때문입니다. 공격자는 다음과 같은 시나리오를 활용할 수 있습니다.

악성 풀 리퀘스트를 통해 정상적인 코드 변경과 함께 악의적인 설정을 숨길 수 있고, 유용해 보이는 허니팟 저장소를 만들어 개발자를 유인할 수 있습니다. 또한 내부자 위협이나 계정 탈취를 통해 기업 내부 저장소에 악성 설정을 주입하면 **전체 개발팀이 동시에 피해**를 입을 수 있습니다.

Check Point Research는 이를 통해 핵심적인 위협 모델의 변화를 지적합니다. "신뢰되지 않은 코드를 실행하는 것뿐만 아니라, 신뢰되지 않은 프로젝트를 여는 행위 자체가 위험해졌습니다. AI 기반 개발 환경에서 공급망은 소스 코드뿐만 아니라 그를 둘러싼 자동화 레이어에서도 시작됩니다."

보호를 위해 최신 버전의 Claude Code를 유지하는 것이 가장 효과적입니다. 추가적으로 프로젝트를 열기 전 `.claude/`, `.mcp.json` 등의 설정 파일을 직접 검토하고, 코드 리뷰 시 설정 파일 변경사항에도 소스 코드와 동일한 엄격함을 적용하는 것이 권장됩니다.

## 마치며

이번 Claude Code 취약점 사례는 AI 개발 도구가 확산될수록 새로운 보안 위협이 함께 등장한다는 것을 보여줍니다. 한때 수동적인 메타데이터였던 설정 파일이 이제는 능동적인 실행 경로를 제어합니다. 개발자가 신뢰할 수 없는 소스에서 코드를 맹목적으로 실행하지 않도록 훈련된 것처럼, AI 도구를 사용하여 프로젝트를 열 때도 동일한 주의가 필요합니다. **설정과 실행 사이의 경계가 계속해서 흐릿해지는** 현실에서, 프로젝트 설정 파일을 실행 코드와 동일한 수준으로 검토하는 문화가 필요합니다.

## Quick questions

> **이 취약점들은 현재도 위험한가요?**
>
> 아닙니다. 세 가지 취약점은 모두 패치되었습니다. 첫 번째 취약점은 2025년 9월(v1.0.87), 두 번째는 2025년 10월(v1.0.111), 세 번째는 2026년 1월(v2.0.65)에 각각 수정되었으므로 최신 버전의 Claude Code를 사용하면 안전합니다.
{: .prompt-info}

> **신뢰되지 않은 저장소를 열면 어떤 위험이 있나요?**
>
> 패치 전 버전에서는 저장소를 클론하고 `claude` 명령을 실행하는 것만으로 공격자가 리버스 셸을 획득하거나 API 키를 탈취할 수 있었습니다. 패치 후에도 프로젝트를 열기 전에 `.claude/` 디렉토리와 `.mcp.json` 파일의 내용을 검토하는 습관을 갖는 것이 좋습니다.
{: .prompt-info}

> **ANTHROPIC_BASE_URL 환경변수는 어떻게 악용되었나요?**
>
> Claude Code는 API 통신에 사용할 엔드포인트를 이 환경변수를 통해 결정합니다. 공격자가 이 변수를 자신의 서버로 설정한 저장소를 피해자가 클론하면, 신뢰 다이얼로그 표시 전에 API 요청이 공격자 서버로 전송되어 API 키가 평문으로 노출됩니다. 현재는 신뢰 확인 이전에 네트워크 요청이 시작되지 않도록 수정되었습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^vuln1]: Check Point Research - [Caught in the Hook: RCE and API Token Exfiltration Through Claude Code Project Files](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/){:target="_blank"}{: target="_blank"}
[^vuln2]: GitHub Security Advisory - [CVE-2025-59536 GHSA-4fgq-fpq9-mr3g](https://github.com/anthropics/claude-code/security/advisories/GHSA-4fgq-fpq9-mr3g){:target="_blank"}{: target="_blank"}
[^vuln3]: GitHub Security Advisory - [CVE-2026-21852 GHSA-jh7p-qr78-84p7](https://github.com/anthropics/claude-code/security/advisories/GHSA-jh7p-qr78-84p7){:target="_blank"}{: target="_blank"}
