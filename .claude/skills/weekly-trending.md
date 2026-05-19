# Weekly GitHub Trending Post Skill

매주 GitHub Trending 레포지토리를 분석하여 한국어 블로그 포스트를 작성하는 스킬입니다.

---

## 1단계: 데이터 수집

https://github.com/trending?since=weekly 페이지에서 트렌딩 레포지토리 정보를 수집합니다.
각 레포지토리의 상세 페이지와 README를 확인하여 내용을 파악합니다.

## 2단계: 필터링

- 신기술이나 많은 사람들이 궁금해할 만한 내용이 아니면 제외
- AI 관련: 겉만 번지르르하고 실질적 가치가 없는 프로젝트 제외
- AI 외: 유용한 도구, 라이브러리, 흥미롭거나 재밌는 프로젝트는 포함
- **최종 5-10개** 의미있는 레포지토리만 선별

## 3단계: 파일 생성

**파일 위치**: `_posts/YYYY-MM-DD-YYYYMM-github-trending-week-N.md`
- 오늘 날짜 사용
- N = 해당 월의 몇 번째 주
- 예: `_posts/2025-10-22-202510-github-trending-week-4.md`

### Front Matter

```yaml
---
title: YYYY년 MM월 N주째 GitHub Trending
description: [이번 주 트렌딩의 핵심 주제나 특징을 한 문장으로]
author: claude
date: 'YYYY-MM-DD HH:MM:SS'
categories:
  - News Articles
  - GitHub Trending
tags:
  - AI
  - [관련 기술 태그들]
pin: false
math: [latex 필요 시 true, 아니면 false]
mermaid: [머메이드 다이어그램 필요 시 true, 아니면 false]
hidden: true
---
```

## 4단계: 본문 구조

### AI Disclosure (최상단)

```markdown
> 이 포스트는 AI 모델을 활용하여 정보를 수집하였습니다. 기술적 정확성을 위해 추가 검토가 이루어진 포스팅입니다.
{: .prompt-info}
```

### 도입부

간단한 도입부 (2-3문장)

### 각 레포지토리 섹션

```markdown
## 레포지토리명 - 부제 스타일 설명

![대표 이미지](이미지URL)

GitHub: [실제 링크 URL](실제 링크 URL){: target="_blank"}

* 주요 기능/특징을 각각 한 문장으로 정리
* 한문장으로 어려우면 레포지토리 단위로 2번만 길게 작성 허용
* **중요 개념이나 주의사항은 볼드** 처리하되 남용 금지
```

추가 팁/경고는 인용문 활용:
```markdown
> 이 도구는 프로덕션 환경에서 사용 시 주의가 필요합니다
{: .prompt-warning}
```

템플릿 종류: `.prompt-info`, `.prompt-tip`, `.prompt-warning`, `.prompt-danger`

### 마무리

간단한 마무리 멘트

## 5단계: 작성 가이드

- 반드시 **한국어**로 작성
- 이모지 사용 금지 (전문성 저하)
- 기술적으로 정확하고 구체적인 요약
- 단순 번역이 아닌, 이해하기 쉬운 설명
- 각 레포지토리의 실질적 가치와 활용 사례 포함
- 코드 예제가 있으면 간단히 포함
- 모든 링크 뒤에 `{: target="_blank"}` 추가
- 애매한 부분은 추측하지 말고 추가 검색

### 이미지 처리

- 각 레포지토리의 대표 이미지 URL 확인
- 마크다운 형식: `![이미지설명](이미지URL)`
- 캡션 필요 시: `![이미지설명](이미지URL)_이미지 설명_`
- 이미지 없으면 생략 가능
- 추가 이미지가 필요하다고 판단 시 검색으로 탐색

### 톤앤매너 (매우 중요)

- **AI 기술에 대해 신중하고 객관적인 시각 유지**
- AI 이전부터 개발해온 개발자들이 주 독자층
- AI 관련 프로젝트:
  - 무조건적 찬양이나 과장 표현 금지
  - "혁명적", "획기적" 같은 과도한 수식어 자제
  - 실질적 기술 가치와 한계를 균형있게 서술
  - 기존 기술과의 비교로 실제 개선점 구체적 제시
- 차분하고 전문적인 어조
- 특정 회사 기술/제품 홍보 인상 금지

## 6단계: 커밋 및 푸시

1. **import.sh 실행** (git 전에 반드시):
   ```bash
   ./import.sh "_posts/[생성한 md 파일명].md"
   ```
   외부 이미지를 `media/[파일명]/`에 저장하여 셀프 호스팅으로 전환합니다.

2. **Git add**: 포스트 파일 및 `media/[파일명]/` 폴더의 미디어 전부

3. **커밋**: `feat(blog): Add YYYY-MM-github-trending-week-N.md`

4. **master 브랜치에 직접 푸시**
