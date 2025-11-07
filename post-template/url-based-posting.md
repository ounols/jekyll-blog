# URL-Based Automated Blog Posting Instructions

## OBJECTIVE
Analyze content from a given URL and create a comprehensive Korean blog post automatically. This is used by GitHub Actions workflow for automated posting.

## INPUT VARIABLES
- `TARGET_URL`: The URL to analyze and write about
- `AUTHOR_OPINION`: Blog owner's personal opinion/thoughts on the topic (optional)
- `ADDITIONAL_PROMPT`: Optional additional instructions from user

## EXECUTION STEPS

### STEP 1: Data Collection (MANDATORY)

**Primary Method:**
- Use WebFetch tool to retrieve content from `TARGET_URL`

**Fallback Method (if primary fails):**
```python
import requests
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
response = requests.get(TARGET_URL, headers=headers)
# Parse and extract content
```

**Additional Requirements:**
- If content spans multiple pages, collect ALL pages
- If page content is insufficient, use WebSearch tool for supplementary information
- Ensure complete data collection before proceeding

### STEP 2: File Creation

**File Location and Naming:**
- Path: `_posts/YYYY-MM-DD-[project-name-in-english].md`
- Use TODAY's date for YYYY-MM-DD
- Project name in English, lowercase, hyphen-separated
- Example: `_posts/2025-11-05-awesome-ml-project.md`

### STEP 3: Front Matter (EXACT FORMAT REQUIRED)

```yaml
---
title: [Compelling title including project name and core topic]
description: [Concise 1-2 sentence summary of main topics]
author: claude
date: 'YYYY-MM-DD HH:mm:SS'
categories:
  - News Articles
tags:
  - [Related technology tags]
pin: false
math: [true if LaTeX needed, false otherwise]
mermaid: [true if mermaid diagrams needed, false otherwise]
hidden: true
---
```

**Title Requirements:**
- Include the project/content name
- Reflect core topic clearly
- Make it compelling but not clickbait
- Korean language

**Date Requirements:**
- Use current seoul time for YYYY-MM-DD HH:mm:SS

**Tags Requirements:**
- Use specific technology names (e.g., "Rust", "PyTorch", "WebAssembly")
- Include domain tags (e.g., "AI", "Web Development", "Systems Programming")
- 3-7 tags recommended

### STEP 4: Body Structure (MANDATORY SECTIONS)

#### AI Disclosure (ALWAYS FIRST)
```markdown
> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI 모델을 통해 작성을 요청한 아티클입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-info}
```

#### Opening Section
- Insert representative image: `![Description](ImageURL)`
- Write brief introduction (2-3 sentences)
- Set context for the content

#### Main Content Structure
- Use `##` as top-level headers (h2)
- Subsections use `###` (h3) and `####` (h4) as needed
- **Maximum 7 top-level headers (##)**
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

#### Author's Opinion Section (CONDITIONAL)
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
- Example:
  ```markdown
  > **블로그 주인장의 의견**
  >
  > 저도 이 기술을 실제로 사용해봤는데 생각보다 설정이 복잡했습니다.
  >
  > 특히 크로스 플랫폼 환경에서는 주의가 필요합니다.
  {: .prompt-info}
  ```

### STEP 5: Content Quality Requirements

#### Technical Accuracy
- Provide technically accurate and reliable information
- Verify facts through additional searches if needed
- Do NOT guess or assume - search for confirmation

#### Writing Style
- Korean language (NOT simple translation, but natural Korean)
- For general topics: Write in accessible, easy-to-understand style
- **For rendering-related topics: Write with deep technical expertise**
- No emojis (maintains professionalism)
- Formal tone: Use ~습니다, ~합니다 forms

**Korean Writing Style Guidelines (CRITICAL):**

1. **Avoid English-style colon usage:**
   - ❌ BAD: "주요 기능은 다음과 같습니다:"
   - ✅ GOOD: "주요 기능은 아래와 같이 4가지로 정리할 수 있습니다."
   - Do NOT end sentences with `:` before lists
   - Use complete, natural Korean sentences

2. **Use numbered headers for sequential content:**
   - When listing items with sub headers, use: `### 1. First Item`, `### 2. Second Item`
   - Improves readability and structure
   - Example:
     ```markdown
     ## AI에게 위임 가능한 보조 작업
     Litt가 제시하는 AI에게 위임할 수 있는 구체적인 작업들은 아래와 같이 요약할 수 있습니다.
     ### 1. 문서화 작업
     ### 2. 스파이크 코드 생성
     ### 3. TypeScript 오류 및 버그 수정
     ### 4. 기능 문서화
     ```

3. **Bold text for emphasis (use strategically):**
   - Use **bold** to highlight important sentences (not just keywords)
   - Bold most of the important sentence, not just fragments
   - ❌ BAD: "이 프로젝트는 **성능**이 매우 좋습니다."
   - ✅ GOOD: "**이 프로젝트는 기존 대비 30% 성능 향상을 달성했습니다.**"
   - Don't overuse - only for key points

4. **Use blockquotes strategically (do NOT overuse):**
   - Use blockquotes for important notes, warnings, tips, or key takeaways
   - Do NOT use blockquotes excessively - only for truly important information
   - Apply appropriate prompt styling: `{: .prompt-info}`, `{: .prompt-warning}`, `{: .prompt-tip}`

   **Available prompt styles:**
   - `.prompt-info` - For informational notes (blue)
   - `.prompt-warning` - For warnings or cautions (yellow/orange)
   - `.prompt-tip` - For helpful tips or recommendations (green)

   **Usage examples:**
   ```markdown
   > 이 기능은 Python 3.8 이상에서만 동작합니다.
   {: .prompt-warning}

   > 성능 향상을 위해 캐싱을 활성화하는 것을 권장합니다.
   {: .prompt-tip}

   > 이 라이브러리는 MIT 라이선스로 배포됩니다.
   {: .prompt-info}
   ```

   **When to use blockquotes:**
   - ✅ Critical warnings about compatibility or limitations
   - ✅ Important tips that significantly help users
   - ✅ Key information that should stand out
   - ❌ Regular explanations (use normal text)
   - ❌ Every other paragraph (overuse reduces impact)

5. **Use footnotes for sources and references:**
   - Add footnote markers in text: `~와 같은 사항이 있다고 합니다.[^footnote-keyword]`
   - Place all footnote definitions at the END of the post
   - Format: `[^footnote-keyword]: Additional info and [reference link](URL){: target="_blank"}`
   - Example:
     ```markdown
     이 기술은 2024년에 처음 공개되었습니다.[^pytorch-release]

     [END OF POST]

     [^pytorch-release]: PyTorch 공식 블로그 [PyTorch 2.0 Release](https://pytorch.org/blog){: target="_blank"}
     ```

#### Visual Elements
- **Actively use images** for topics and concepts
- Insert external images: `![Description](ImageURL)`
- If no suitable image exists, use WebSearch to find one
- Image with caption:
  ```markdown
  ![Description](ImageURL)
  _Caption text in Korean_
  ```

#### Code Examples
- Include code examples when relevant
- Add additional code examples if they aid understanding
- Use appropriate language syntax highlighting

#### Links
- Format: `[Link text](URL){: target="_blank"}`
- Provide supplementary links when helpful

### STEP 6: Tone and Manner (CRITICAL)

#### General Principles
- Maintain cautious and objective perspective on technology
- Remember primary audience: developers who worked before AI era
- Keep calm and professional tone throughout
- Avoid promotional language for any specific company/product

#### AI-Related Content (SPECIAL RULES)
When writing about AI projects:

**AVOID:**
- Unconditional praise or exaggeration
- Excessive superlatives: "혁명적", "획기적", "게임체인저"
- Hype-driven language
- Marketing-style promotion

**DO:**
- Present practical technical value AND limitations
- Compare with existing technologies, show concrete improvements
- Use measured, balanced descriptions
- Focus on actual capabilities vs. claims

**Good vs Bad Examples:**

❌ BAD:
```
이 프로젝트는 AI 분야에 혁명을 일으킬 획기적인 기술입니다!
```

✅ GOOD:
```
이 프로젝트는 기존 모델 대비 추론 속도를 30% 개선했으며,
특히 제한된 컴퓨팅 환경에서 유용할 수 있습니다.
단, 대규모 배치 처리에서는 아직 개선이 필요합니다.
```

### STEP 7: Image Handling

**Critical Rule:**
- ALL images in the post MUST be external URLs initially
- The `import.sh` script will later convert them to self-hosted

**Image Insertion Format:**
```markdown
![Image description](https://external-url.com/image.jpg)
```

**With Caption:**
```markdown
![Image description](https://external-url.com/image.jpg)
_Additional caption text if needed_
```

**Image Selection:**
- Find relevant images through WebSearch if needed
- Use official project screenshots when available
- Ensure images illustrate the concept being discussed

### STEP 8: Git Operations (EXACT SEQUENCE)

**CRITICAL: Follow this exact order:**

1. **Run import.sh script FIRST (BEFORE git commands):**
   ```bash
   ./import.sh "_posts/[created-md-filename].md"
   ```
   - This script downloads external images
   - Saves them to `media/[md-filename]/`
   - Updates markdown to use local image paths
   - Fully automated process

2. **Create a new branch:**
   ```bash
   BRANCH_NAME="post/[slug-from-filename]"
   git checkout -b "$BRANCH_NAME"
   ```
   - Branch naming: `post/[slug]` (e.g., `post/awesome-ml-project`)
   - Extract slug from filename (remove date prefix)

3. **Git add:**
   ```bash
   git add _posts/[created-md-filename].md
   git add media/[md-filename-folder]/*
   ```

4. **Git commit with proper format:**
   ```bash
   git commit -m "feat(blog): Add [md-filename].md"
   ```
   - Follow lint rules
   - Format: `feat(blog): Add [filename].md`

5. **Push branch to remote:**
   ```bash
   git push origin "$BRANCH_NAME"
   ```

6. **Create Pull Request using gh CLI:**
   ```bash
   gh pr create \
     --title "feat(blog): Add [post-title]" \
     --body "## Summary

   New blog post: [Post Title]

   **Source URL**: [TARGET_URL]

   ## Changes
   - Created: \`_posts/[filename].md\`
   - Added images to: \`media/[folder]/\`

   ## Checklist
   - [x] Content is technically accurate
   - [x] Images processed through import.sh
   - [x] All external links have {:target=\"_blank\"}
   - [x] Korean writing style guidelines followed

   🤖 Generated with Claude Code" \
     --base master \
     --head "$BRANCH_NAME"
   ```

## WORKFLOW CHECKLIST

- [ ] Check if AUTHOR_OPINION is provided (not empty)
- [ ] Understand ADDITIONAL_PROMPT before writing a post
- [ ] Data collected from TARGET_URL completely
- [ ] Additional searches performed if needed
- [ ] File created in `_posts/` with correct naming
- [ ] Front matter properly formatted
- [ ] AI disclosure included at top of body
- [ ] Representative image inserted in opening
- [ ] Author's opinion as blockquote added (if AUTHOR_OPINION provided)
- [ ] Maximum 6 top-level headers (##)
- [ ] Headers are descriptive and readable
- [ ] Content is technically accurate
- [ ] Images actively used throughout
- [ ] Tone is objective and professional
- [ ] No excessive AI hype (if AI-related content)
- [ ] No emojis used
- [ ] Code examples included where relevant
- [ ] NO colons (`:`) before lists - use complete Korean sentences
- [ ] Numbered headers used for sequential content (## 1., ## 2., etc.)
- [ ] Bold text used strategically for emphasis (full sentences, not fragments)
- [ ] Blockquotes used strategically with appropriate prompt styles (NOT overused)
- [ ] Footnotes added for sources with definitions at end of post
- [ ] External image URLs used (not local paths yet)
- [ ] import.sh executed BEFORE git commands
- [ ] New branch created with pattern: `post/[slug]`
- [ ] Both markdown and media files added to git
- [ ] Commit message follows format: `feat(blog): Add [filename].md`
- [ ] Branch pushed to remote
- [ ] Pull Request created with proper title and description

## CONSTRAINTS

- Do NOT use emojis anywhere
- Do NOT use informal Korean (반말)
- Do NOT use colons (`:`) before lists - write complete sentences
- Do NOT bold only single keywords - bold full important sentences
- Do NOT overuse blockquotes - only for truly important information
- Do NOT forget to add prompt styles to blockquotes (.prompt-info/warning/tip)
- Do NOT skip the import.sh step
- Do NOT push before running import.sh
- Do NOT push directly to master - create a PR instead
- Do NOT exceed 6 top-level headers
- Do NOT use local image paths initially
- Do NOT use promotional/marketing language
- Do NOT make assumptions - search for facts
- Do NOT use excessive superlatives for AI projects
- Do NOT forget AI disclosure at the top
- Do NOT forget to add footnote definitions at the end of post

## ERROR HANDLING

**If WebFetch fails:**
- Try Python requests with custom User-Agent
- Try alternative search for the content
- Report if completely inaccessible

**If import.sh fails:**
- Check script exists at repository root
- Verify markdown file path is correct
- Check if images are actually downloaded

**If git operations fail:**
- Verify all files are properly added
- Check commit message format
- Ensure branch was created successfully
- Check if branch name is valid (no special characters)

**If PR creation fails:**
- Verify `gh` CLI is available
- Check if branch was pushed successfully
- Ensure base branch (master) exists
- Verify GitHub permissions are correct

## VARIABLE HANDLING

### AUTHOR_OPINION
If `AUTHOR_OPINION` is provided (not empty):
- Add as a blockquote (NOT a header section)
- Format: `> **블로그 주인장의 의견:**` followed by opinion content
- Each line must start with `>`
- Place AFTER main content, BEFORE conclusion
- Write in first-person perspective
- Preserve the author's original tone and style

If `AUTHOR_OPINION` is empty or not provided:
- Skip the author opinion section entirely
- No mention of it in the post

### ADDITIONAL_PROMPT
If `ADDITIONAL_PROMPT` is provided:
- Read and follow those instructions AS WELL
- Additional instructions supplement (not replace) these base instructions
- If conflict exists, clarify with user or follow most specific instruction
