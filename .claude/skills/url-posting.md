# URL-Based Blog Posting Skill

URL을 분석하여 한국어 블로그 포스트를 자동 생성하는 스킬입니다.

## 입력 변수

- `TARGET_URL`: 분석할 URL
- `AUTHOR_OPINION`: 블로그 주인장의 의견 (선택)
- `ADDITIONAL_PROMPT`: 추가 지시사항 (선택)

---

## 1단계: 데이터 수집

Python 크롤러 스크립트를 사용하여 콘텐츠를 수집합니다.

```bash
python3 .github/workflows/scripts/crawl_article.py "TARGET_URL"
```

출력 JSON 구조:
```json
{
  "meta": { "title", "ogImage", "description", "publishDate", "author" },
  "images": [{ "src", "alt", "width", "height" }],
  "links": [{ "text", "url", "context" }],
  "content": "본문 텍스트 (각주 마커 [1], [2] 포함)"
}
```

- 여러 페이지에 걸친 콘텐츠는 각 페이지 URL마다 크롤러 실행
- 콘텐츠 부족 시 WebSearch 도구로 보충

### 링크 탐색 (선택적)

크롤러가 추출한 링크 중 **2-3개 핵심 링크만** 선별하여 추가 크롤링:
- 주제에 대한 핵심 배경 정보 제공하는 링크
- 연구 논문, 기술 문서, 주요 도구/라이브러리 링크
- 탐색 링크, SNS, 홍보 링크는 건너뜀

### 오류 처리

크롤러 실패 시: WebFetch → WebSearch 순서로 대체

---

## 2단계: 파일 생성

**파일 경로**: `_posts/YYYY-MM-DD-[project-name-in-english].md`
- 오늘 날짜 사용, 프로젝트명은 영문 소문자 하이픈 구분
- 예: `_posts/2025-11-05-awesome-ml-project.md`

### Front Matter (정확한 형식 필수)

```yaml
---
title: [프로젝트명과 핵심 주제를 포함한 제목]
description: [1-2문장 요약]
author: claude
date: 'YYYY-MM-DD HH:mm:SS'
categories:
  - News Articles
tags:
  - [관련 기술 태그 3-7개]
pin: false
math: [LaTeX 필요 시 true]
mermaid: [머메이드 다이어그램 필요 시 true]
hidden: true
---
```

- date: 현재 서울 시간 기준
- title: 프로젝트/콘텐츠명 포함, 클릭베이트 아닌 매력적 제목, 한국어

---

## 3단계: 본문 구조

### 오프닝 (필수)

1. **원본/프로젝트 링크** (최상단):
   ```markdown
   **원본 링크**: [Link Title](URL)
   ```
   또는:
   ```markdown
   **프로젝트 링크**: [Project Name](URL)
   ```

2. **대표 이미지** (필수): `![Description](ImageURL)`
   - TARGET_URL 또는 공식 프로젝트 소스의 이미지 사용
   - 일반 스톡 사진 사용 금지

3. 간단한 도입부 (2-3문장)

### 본문

- `##`(h2)를 최상위 헤더로 사용, **최대 6개**
- 하위 섹션은 `###`(h3), `####`(h4)
- 구조: 도입 → 본문 → 결론
- 헤더는 읽기 쉽고 설명적으로 ("Section 1" 같은 형식 금지)

좋은 헤더 예시:
```markdown
## Lambert Diffuse는 문제가 많다
## 떠오르는 해결책: Burley Diffuse
## 실제 활용 사례
## 이쁘지만 성능적 한계는 있다
```

### 저자 의견 섹션 (AUTHOR_OPINION 있을 때만)

본문 뒤, 결론 전에 배치:
```markdown
> **블로그 주인장의 의견**
>
> [AUTHOR_OPINION 내용을 1인칭으로 작성]
{: .prompt-info}
```

### Quick Questions 섹션 (필수)

결론(마치며) 뒤, 각주 전에 배치. 1-3개 Q&A:
```markdown
## Quick questions

> **[질문]?**
>
> [답변 1-3문장]
{: .prompt-info}
```

### AI Disclosure (필수)

Quick questions 뒤, 각주 전:
```markdown
> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}
```

### 콘텐츠 순서 정리

1. 원본/프로젝트 링크
2. 대표 이미지
3. 도입부
4. 본문 섹션들 (## 헤더)
5. 저자 의견 (있을 경우)
6. 마치며 (결론)
7. Quick questions
8. AI Disclosure
9. `---` (수평선)
10. 각주 정의

---

## 4단계: 작성 스타일

### 기본 규칙

- 한국어 (단순 번역이 아닌 자연스러운 한국어)
- 존댓말 (~습니다, ~합니다)
- 블로그 포스트 내 이모지 금지 (PR 본문에서만 허용)
- 설명은 간결하고 읽기 쉽게 유지

### 한국어 작성 가이드

**콜론 사용 금지:**
- ❌ "주요 기능은 다음과 같습니다:"
- ✅ "주요 기능은 아래와 같이 4가지로 정리할 수 있습니다."

**순차적 내용에 번호 헤더 사용:**
```markdown
### 1. 문서화 작업
### 2. 스파이크 코드 생성
```

**볼드 텍스트 — 핵심 구문(2-8단어)에만 사용:**
- ❌ "이 프로젝트는 **성능**이 매우 좋습니다." (단일 키워드)
- ❌ "**이 프로젝트는 기존 대비 30% 성능 향상을 달성했습니다.**" (전체 문장)
- ✅ "이 프로젝트는 **기존 대비 30% 성능 향상**을 달성했습니다." (핵심 구문)
- 주요 섹션(##)당 1-3개 볼드 구문

**인용문(blockquote) — 전략적으로만 사용:**
- `.prompt-info`: 정보성 참고 (파란색)
- `.prompt-warning`: 경고/주의 (노란색/주황색)
- `.prompt-tip`: 유용한 팁 (녹색)
- 일반 설명에는 사용하지 않고, 핵심 경고/팁/정보에만 사용

**각주:**
- 본문 내: `~입니다.[^footnote-keyword]`
- 포스트 끝에 정의: `[^footnote-keyword]: 출처 [제목](URL){: target="_blank"}`

**문단 길이:**
- 문단당 2-4문장 목표 (한 문장 한 문단 금지)
- 6-7문장 초과 시 자연스러운 주제 경계에서 분할
- 기술적 정확성이 간결함보다 우선

### 톤앤매너

- **AI 기술에 대해 신중하고 객관적인 시각 유지**
- 독자층: AI 이전부터 개발해온 개발자
- 차분하고 전문적인 어조
- 특정 회사/제품 홍보 인상 금지

**AI 관련 콘텐츠 특별 규칙:**
- 금지: "혁명적", "획기적", "게임체인저" 등 과도한 수식어
- 실질적 기술 가치와 한계를 균형있게 서술
- 기존 기술과의 구체적 비교

### 기술 심도 (그래픽스/렌더링 주제)

그래픽스 렌더링 관련 주제 시:
- 수학적/알고리즘적 차이를 구체적으로 설명
- 레거시 방식과의 비교
- 데이터 구조, 파이프라인 단계, 입출력 형식 설명
- 정량적 비교 포함 (속도, 메모리, 품질)

---

## 5단계: 품질 요구사항

### 이미지

**우선순위 (엄격히 준수):**
1. TARGET_URL의 이미지
2. 공식 프로젝트 이미지 (GitHub, 공식 사이트)
3. 관련 뉴스/기사 이미지
4. 최후 수단: WebSearch (일반 스톡 사진 금지)

**형식:**
```markdown
![Description](ImageURL)
_캡션 텍스트_
```

- 모든 이미지는 처음에 외부 URL 사용 (import.sh가 로컬로 전환)

### 코드 예제

- 관련 있을 때 코드 예제 포함
- 적절한 언어 구문 강조 사용

### 링크

- 모든 링크 뒤에 `{: target="_blank"}` 추가
- 애매한 정보는 추측하지 말고 추가 검색

---

## 6단계: Git 워크플로우

**반드시 이 순서대로 실행:**

### 1. import.sh 실행 (git 명령 전에 반드시)

```bash
./import.sh "_posts/[생성한-파일명].md"
```

외부 이미지를 다운로드하여 `media/[파일명]/`에 저장하고 마크다운을 로컬 경로로 자동 업데이트합니다.

### 2. 브랜치 생성

```bash
git checkout -b "post/[slug]"
```

### 3. Git add & commit

```bash
git add _posts/[파일명].md
git add media/[파일명-폴더]/*
git commit -m "feat(blog): Add [파일명].md"
```

### 4. Push & PR 생성

```bash
git push origin "post/[slug]"

gh pr create \
  --title "feat(blog): Add [포스트-제목]" \
  --assignee ounols \
  --reviewer ounols \
  --body "## Summary
New blog post: [Post Title]
**Source URL**: [TARGET_URL]

## Changes
- Created: \`_posts/[filename].md\`
- Added images to: \`media/[folder]/\`

## Checklist
- [x] Content is technically accurate
- [x] Images processed through import.sh
- [x] Korean writing style guidelines followed

🤖 Generated with Claude Code" \
  --base master \
  --head "post/[slug]"
```

---

## 제약사항 체크리스트

- [ ] 블로그 포스트 내 이모지 미사용
- [ ] 반말 미사용
- [ ] 리스트 전 콜론(`:`) 미사용
- [ ] 볼드: 핵심 구문(2-8단어)에만 사용
- [ ] 인용문: 남용하지 않고 전략적으로만
- [ ] 인용문에 prompt 스타일 적용
- [ ] import.sh 실행 완료
- [ ] master 직접 푸시 금지 — PR 생성
- [ ] 최대 6개 최상위 헤더
- [ ] 홍보/마케팅 언어 미사용
- [ ] 추측 금지 — 사실 확인 검색
- [ ] AI 관련 과도한 찬사 자제
- [ ] AI Disclosure 포함
- [ ] 각주 정의 포함
- [ ] AUTHOR_OPINION 확인 (제공 시 포함)
- [ ] ADDITIONAL_PROMPT 확인 (제공 시 반영)
