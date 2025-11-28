---
title: GitHub Copilot의 agents.md 작성법 - 2,500개 저장소 분석으로 얻은 인사이트
description: GitHub Copilot의 맞춤형 에이전트를 정의하는 agents.md 파일 작성 모범 사례와 실전 예제를 소개합니다.
author: claude
date: '2025-11-28 14:12:59'
categories:
  - News Articles
tags:
  - GitHub Copilot
  - AI
  - Developer Tools
  - Documentation
  - Best Practices
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [How to write a great agents.md: Lessons from over 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/){: target="_blank"}

![GitHub Copilot agents.md](/media/2025-11-28-github-copilot-agents-md-best-practices/figure-1.webp)

GitHub Copilot에 새롭게 추가된 맞춤형 에이전트 기능을 활용하면 범용 어시스턴트 대신 전문화된 AI 팀을 구성할 수 있습니다. 기술 문서 작성을 담당하는 @docs-agent, 품질 보증을 위한 @test-agent, 보안 분석을 수행하는 @security-agent 등 각 에이전트는 agents.md 파일로 정의됩니다.

하지만 대부분의 agents.md 파일은 **너무 모호해서 제대로 작동하지 않습니다.** "당신은 유용한 코딩 어시스턴트입니다"라는 설명으로는 부족합니다. "당신은 React 컴포넌트를 위한 테스트를 작성하는 테스트 엔지니어이며, 이 예제들을 따르고, 절대로 소스 코드를 수정하지 않습니다"처럼 구체적으로 작성해야 효과적입니다.

## 2,500개 저장소에서 발견한 성공 패턴

2,500개 이상의 agents.md 파일을 분석한 결과, 성공적인 파일들은 명확한 공통점을 보였습니다.[^analysis] 효과적인 에이전트는 **구체적인 역할 또는 페르소나, 실행 가능한 명령어, 명확한 경계, 그리고 좋은 출력 예제**를 제공합니다.

성공적인 agents.md 파일들이 공통적으로 따르는 패턴은 아래와 같이 정리할 수 있습니다.

### 1. 명령어를 초반에 배치

`npm test`, `npm run build`, `pytest -v`처럼 실행 가능한 명령어를 초반 섹션에 배치합니다. 도구 이름만 언급하는 것이 아니라 플래그와 옵션까지 포함해야 합니다. 에이전트는 이 명령어들을 자주 참조하게 됩니다.

### 2. 설명보다 코드 예제

스타일을 설명하는 세 개의 문단보다 실제 코드 스니펫 하나가 훨씬 효과적입니다. 좋은 출력이 어떤 모습인지 직접 보여주세요.

### 3. 명확한 경계 설정

AI가 절대 건드리지 말아야 할 것들을 명시합니다. 시크릿, 외부 라이브러리 디렉토리, 프로덕션 설정, 특정 폴더 등이 해당됩니다. **"절대 시크릿을 커밋하지 말 것"**은 가장 흔하게 발견되는 유용한 제약 조건이었습니다.

### 4. 기술 스택을 구체적으로 명시

"React 프로젝트"가 아니라 "React 18 with TypeScript, Vite, and Tailwind CSS"처럼 구체적으로 작성합니다. 버전과 주요 의존성을 포함하세요.

### 5. 6가지 핵심 영역 포함

명령어, 테스트, 프로젝트 구조, 코드 스타일, Git 워크플로우, 경계 설정 - 이 6가지 영역을 다루면 상위권 agents.md 파일이 될 수 있습니다.

## 우수한 agents.md 파일 예제

아래는 `.github/agents/docs-agent.md`에 문서 작성 에이전트를 추가하는 예제입니다.

```yaml
---
name: docs_agent
description: Expert technical writer for this project
---

You are an expert technical writer for this project.

## Your role
- You are fluent in Markdown and can read TypeScript code
- You write for a developer audience, focusing on clarity and practical examples
- Your task: read code from `src/` and generate or update documentation in `docs/`

## Project knowledge
- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS
- **File Structure:**
  - `src/` – Application source code (you READ from here)
  - `docs/` – All documentation (you WRITE to here)
  - `tests/` – Unit, Integration, and Playwright tests

## Commands you can use
Build docs: `npm run docs:build` (checks for broken links)
Lint markdown: `npx markdownlint docs/` (validates your work)

## Documentation practices
Be concise, specific, and value dense
Write so that a new developer to this codebase can understand your writing, don't assume your audience are experts in the topic/area you are writing about.

## Boundaries
- ✅ **Always do:** Write new files to `docs/`, follow the style examples, run markdownlint
- ⚠️ **Ask first:** Before modifying existing documents in a major way
- 🚫 **Never do:** Modify code in `src/`, edit config files, commit secrets
```

### 이 파일이 효과적인 이유

**명확한 역할 정의**: 에이전트가 누구인지(전문 기술 작성자), 어떤 기술을 가지고 있는지(Markdown, TypeScript), 무엇을 하는지(코드 읽기, 문서 작성)를 정의합니다.

**실행 가능한 명령어**: AI가 실행할 수 있는 도구(`npm run docs:build`, `npx markdownlint docs/`)를 제공합니다. 명령어가 먼저 나옵니다.

**프로젝트 지식**: 버전을 포함한 기술 스택(React 18, TypeScript, Vite, Tailwind CSS)과 정확한 파일 위치를 명시합니다.

**3단계 경계**: "항상 할 것", "먼저 물어볼 것", "절대 하지 말 것"으로 명확한 규칙을 설정합니다. 파괴적인 실수를 방지할 수 있습니다.

## 첫 번째 에이전트 만들기

간단한 작업 하나를 선택하세요. "범용 헬퍼"를 만들지 마세요. 아래와 같이 구체적인 작업을 선택합니다.

- 함수 문서화 작성
- 유닛 테스트 추가
- 린팅 오류 수정

최소한의 요소로 시작하세요. 필요한 것은 세 가지뿐입니다.

- 에이전트 이름: test-agent, docs-agent, lint-agent
- 설명: "TypeScript 함수를 위한 유닛 테스트를 작성합니다"
- 페르소나: "당신은 포괄적인 테스트를 작성하는 품질 소프트웨어 엔지니어입니다"

Copilot을 활용해 에이전트를 생성할 수도 있습니다. IDE에서 `.github/agents/test-agent.md` 파일을 열고 다음 프롬프트를 사용하세요.

```
Create a test agent for this repository. It should:
- Have the persona of a QA software engineer.
- Write tests for this codebase
- Run tests and analyzes results
- Write to "/tests/" directory only
- Never modify source code or remove failing tests
- Include specific examples of good test structure
```

Copilot이 페르소나, 명령어, 경계가 포함된 완전한 agents.md 파일을 코드베이스에 맞춰 생성합니다. 검토 후 YAML frontmatter를 추가하고 프로젝트에 맞게 명령어를 조정하면 @test-agent를 사용할 준비가 완료됩니다.

## 만들어볼 만한 6가지 에이전트

### 1. @docs-agent

코드를 읽어 API 문서, 함수 참조, 튜토리얼을 생성합니다. `npm run docs:build`와 `markdownlint docs/` 같은 명령어를 제공해 자체 검증이 가능하게 합니다.

- **역할**: 코드 주석과 함수 시그니처를 Markdown 문서로 변환
- **예제 명령어**: `npm run docs:build`, `markdownlint docs/`
- **경계**: `docs/`에만 작성, 소스 코드는 절대 수정하지 않음

### 2. @test-agent

테스트를 작성합니다. 테스트 프레임워크(Jest, PyTest, Playwright)를 지정하고 테스트 실행 명령어를 제공하세요. 중요한 경계: `tests`에만 작성할 수 있으며 실패한 테스트를 제거할 수 없습니다.

- **역할**: 유닛 테스트, 통합 테스트, 엣지 케이스 커버리지 작성
- **예제 명령어**: `npm test`, `pytest -v`, `cargo test --coverage`
- **경계**: `tests/`에만 작성, 사용자 승인 없이 실패한 테스트 제거 금지

### 3. @lint-agent

코드 스타일과 포맷팅을 수정하지만 로직은 변경하지 않습니다. 스타일 이슈를 자동 수정하는 명령어를 제공하세요. 린터는 안전하도록 설계되어 있어 위험도가 낮습니다.

- **역할**: 코드 포맷팅, import 순서 수정, 네이밍 규칙 적용
- **예제 명령어**: `npm run lint --fix`, `prettier --write`
- **경계**: 스타일만 수정, 코드 로직은 절대 변경하지 않음

### 4. @api-agent

API 엔드포인트를 만듭니다. 프레임워크(Express, FastAPI, Rails)와 라우트 위치를 알려줘야 합니다. 개발 서버를 시작하고 엔드포인트를 테스트하는 명령어를 제공합니다. 핵심 경계: API 라우트는 수정 가능하지만 데이터베이스 스키마 변경 전에는 물어봐야 합니다.

- **역할**: REST 엔드포인트, GraphQL resolver, 에러 핸들러 생성
- **예제 명령어**: `npm run dev`, `curl localhost:3000/api`, `pytest tests/api/`
- **경계**: 라우트 수정 가능, 스키마 변경 전에는 먼저 물어봄

### 5. @dev-deploy-agent

로컬 개발 환경으로의 빌드와 배포를 처리합니다. 제한적으로 운영하세요. 개발 환경에만 배포하고 명시적 승인을 요구하세요.

- **역할**: 로컬 또는 개발 빌드 실행, Docker 이미지 생성
- **예제 명령어**: `npm run test`
- **경계**: 개발 환경에만 배포, 위험이 있는 작업은 사용자 승인 필요

## 시작 템플릿

아래 템플릿을 활용해 자신만의 에이전트를 만들어보세요.

```yaml
---
name: your-agent-name
description: [One-sentence description of what this agent does]
---

You are an expert [technical writer/test engineer/security analyst] for this project.

## Persona
- You specialize in [writing documentation/creating tests/analyzing logs/building APIs]
- You understand [the codebase/test patterns/security risks] and translate that into [clear docs/comprehensive tests/actionable insights]
- Your output: [API documentation/unit tests/security reports] that [developers can understand/catch bugs early/prevent incidents]

## Project knowledge
- **Tech Stack:** [your technologies with versions]
- **File Structure:**
  - `src/` – [what's here]
  - `tests/` – [what's here]

## Tools you can use
- **Build:** `npm run build` (compiles TypeScript, outputs to dist/)
- **Test:** `npm test` (runs Jest, must pass before commits)
- **Lint:** `npm run lint --fix` (auto-fixes ESLint errors)

## Standards

Follow these rules for all code you write:

**Naming conventions:**
- Functions: camelCase (`getUserData`, `calculateTotal`)
- Classes: PascalCase (`UserService`, `DataController`)
- Constants: UPPER_SNAKE_CASE (`API_KEY`, `MAX_RETRIES`)

**Code style example:**
```typescript
// ✅ Good - descriptive names, proper error handling
async function fetchUserById(id: string): Promise<User> {
  if (!id) throw new Error('User ID required');

  const response = await api.get(`/users/${id}`);
  return response.data;
}

// ❌ Bad - vague names, no error handling
async function get(x) {
  return await api.get('/users/' + x).data;
}
```

## Boundaries
- ✅ **Always:** Write to `src/` and `tests/`, run tests before commits, follow naming conventions
- ⚠️ **Ask first:** Database schema changes, adding dependencies, modifying CI/CD config
- 🚫 **Never:** Commit secrets or API keys, edit `node_modules/` or `vendor/`
```

## 마치며

효과적인 맞춤형 에이전트를 만드는 것은 모호한 프롬프트를 작성하는 것이 아니라 **구체적인 페르소나와 명확한 지침을 제공하는 것**입니다.

2,500개 이상의 agents.md 파일 분석 결과, 최고의 에이전트들은 명확한 페르소나와 상세한 운영 매뉴얼을 제공받았습니다. 이 매뉴얼에는 실행 가능한 명령어, 스타일링을 위한 구체적인 코드 예제, 명시적인 경계(절대 건드리지 말아야 할 파일 등), 그리고 기술 스택에 대한 구체적인 정보가 포함되어야 합니다.

agents.md를 작성할 때는 명령어, 테스트, 프로젝트 구조, 코드 스타일, Git 워크플로우, 경계 설정이라는 6가지 핵심 영역을 다루세요. 간단하게 시작하고, 테스트하고, 에이전트가 실수할 때 세부 사항을 추가하세요. 최고의 에이전트 파일은 사전 계획이 아니라 **반복을 통해 성장**합니다.

## Quick questions

> **agents.md 파일은 어디에 저장해야 하나요?**
>
> `.github/agents/` 디렉토리에 저장합니다. 예를 들어 테스트 에이전트는 `.github/agents/test-agent.md`로 저장하면 됩니다.
{: .prompt-info}

> **여러 개의 에이전트를 동시에 사용할 수 있나요?**
>
> 네, GitHub Copilot은 여러 맞춤형 에이전트를 동시에 지원합니다. 각 작업에 맞는 전문 에이전트를 @로 호출하여 사용할 수 있습니다.
{: .prompt-info}

> **에이전트가 제대로 작동하지 않을 때는 어떻게 해야 하나요?**
>
> 에이전트의 실수를 관찰하고 agents.md 파일에 더 구체적인 예제와 경계를 추가하세요. 대부분의 문제는 지시사항이 너무 모호해서 발생합니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^analysis]: GitHub Blog - [How to write a great agents.md: Lessons from over 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/){: target="_blank"}
