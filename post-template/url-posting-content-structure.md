# URL-Based Posting Content Structure

## AI DISCLOSURE (ALWAYS FIRST)

```markdown
> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI 모델을 통해 작성을 요청한 아티클입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-info}
```

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

> **블로그 주인장의 의견:**
>
> [Write AUTHOR_OPINION content here in first-person.
> Each paragraph should start with `>` to maintain blockquote format.
> Keep the natural flow of the author's thoughts.]

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
