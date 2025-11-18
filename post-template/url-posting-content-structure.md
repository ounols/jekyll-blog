# URL-Based Posting Content Structure

## OPENING SECTION

- **Insert original/project link (REQUIRED)**: Place at the very top before any other content
  ```markdown
  **원본 링크**: [Link Title](URL){: target="_blank"}
  ```
  OR for projects:
  ```markdown
  **프로젝트 링크**: [Project Name](URL){: target="_blank"}
  ```

- **Insert representative image (REQUIRED)**: `![Description](ImageURL)`
  - MUST be from TARGET_URL or official project source
  - Prioritize images from the original article/page
  - If unavailable, use official project images (GitHub, official site)
  - Never use generic stock photos

- Write brief introduction (2-3 sentences)
- Set context for the content

## MAIN CONTENT STRUCTURE

- Use `##` as top-level headers (h2)
- Subsections use `###` (h3) and `####` (h4) as needed
- **Maximum 6 top-level headers (##)**
- Structure: Introduction → Main Content → Conclusion
- Headers should be readable and descriptive (not "Section 1", "Section 2")

**Good Header Examples:**
```markdown
## Lambert Diffuse는 문제가 많다
## 떠오르는 해결책: Burley Diffuse
## Burley Diffuse 원리와 특징
## 실제 활용 사례
## 이쁘지만 성능적 한계는 있다
## 상황에 따른 대안은?
## 마치며
```

## AUTHOR'S OPINION SECTION (CONDITIONAL)

**If `AUTHOR_OPINION` is provided (not empty):**
- Add the blog owner's personal thoughts as a blockquote
- Place it AFTER the main content, BEFORE the closing/conclusion
- Use blockquote format with `>` (NOT a header)
- Write the author's opinion in first-person perspective
- Keep the author's original tone and style
- Clearly distinguish this from AI-generated content

**If `AUTHOR_OPINION` is empty:**
- Skip this section entirely
- Proceed directly to conclusion

**Example structure with author opinion:**
```markdown
## [Main content sections...]

> **블로그 주인장의 의견**
>
> [Write AUTHOR_OPINION content here in first-person.
> Each paragraph should start with `>` to maintain blockquote format.
> Keep the natural flow of the author's thoughts.]
{: .prompt-info}

## 마치며

[Conclusion]
```

**Blockquote formatting rules:**
- Start with `> **블로그 주인장의 의견:**` as the header
- Each line of the opinion must start with `>`
- Empty lines between paragraphs also need `>`
- **MUST add `.prompt-info` style at the end** of the author opinion blockquote
- Example:
  ```markdown
  > **블로그 주인장의 의견**
  >
  > 저도 이 기술을 실제로 사용해봤는데 생각보다 설정이 복잡했습니다.
  >
  > 특히 크로스 플랫폼 환경에서는 주의가 필요합니다.
  {: .prompt-info}
  ```

## QUICK QUESTIONS SECTION (REQUIRED)

**Purpose:**
- Provide quick answers to questions readers might have about the topic
- Placed AFTER conclusion (마치며), BEFORE footnotes
- 1-3 Q&A pairs recommended

**Content Order:**
1. Main content sections
2. Author's opinion (if AUTHOR_OPINION provided)
3. Conclusion (마치며)
4. **Quick questions** ← placed here
5. **AI Disclosure** ← placed here
6. Horizontal rule (`---`) to separate content from footnotes
7. Footnote definitions

**Structure:**
```markdown
## Quick questions

> **[질문 1]?**
>
> [답변 1]
{: .prompt-info}

> **[질문 2]?**
>
> [답변 2]
{: .prompt-info}

> **[질문 3]?**
>
> [답변 3]
{: .prompt-info}
```

**Guidelines:**
- Use `## Quick questions` as the h2 header (in English)
- Each Q&A pair is wrapped in a blockquote with `.prompt-info` styling
- Question is in bold format: `**[질문]?**` (no "Q:" prefix)
- Answer is in normal text (no "A:" prefix, no bold)
- Empty line between question and answer within the blockquote (using `>`)
- Questions should anticipate what readers would naturally wonder about
- Keep answers concise but informative (1-3 sentences)
- Questions should be practical and directly related to the main content

## AI DISCLOSURE (REQUIRED)

**Purpose:**
- Inform readers that this post was generated with AI assistance
- Maintain transparency about content creation
- Placed AFTER Quick questions, BEFORE footnotes

**Format:**
```markdown
> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}
```

**Guidelines:**
- Use `.prompt-tip` styling (green tip box)
- Keep the exact wording as shown above
- Place immediately after Quick questions section
- Must appear before the horizontal rule (`---`) and footnotes

**Example:**
```markdown
## 마치며

[Conclusion content...]

## Quick questions

> **FFmpeg은 개인 프로젝트에 무료로 사용할 수 있나요?**
>
> 네, FFmpeg은 LGPL 또는 GPL 라이선스로 배포되는 오픈소스 프로젝트입니다. 개인 및 상업용 프로젝트 모두에서 라이선스 조건을 준수하면 무료로 사용할 수 있습니다.
{: .prompt-info}

> **Big Sleep과 같은 AI 보안 도구를 개인 개발자도 사용할 수 있나요?**
>
> 현재 Big Sleep은 구글 내부 도구이며 공개적으로 사용할 수 없습니다. 하지만 비슷한 개념의 오픈소스 정적 분석 도구들은 사용 가능합니다.
{: .prompt-info}

> **FFmpeg의 피드백에 대한 구글의 공식 입장은 어떤가요?**
>
> 기사 작성 시점 기준으로 구글은 FFmpeg의 요구에 대해 공식적인 입장을 발표하지 않았습니다. 다만 구글 Project Zero는 90일 공개 정책을 모든 프로젝트에 동일하게 적용한다는 기존 입장을 유지하고 있습니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^big-sleep]: Google Cloud Blog - [Source title](URL){: target="_blank"}
[^vulnerabilities]: The Hacker News - [Source title](URL){: target="_blank"}
```
