# URL-Based Posting Writing Style

## BASIC WRITING STYLE

- Korean language (NOT simple translation, but natural Korean)
- For general topics: Write in accessible, easy-to-understand style
- **For rendering-related topics: Write with deep technical expertise**
- No emojis (maintains professionalism)
- Formal tone: Use ~습니다, ~합니다 forms

## KOREAN WRITING STYLE GUIDELINES (CRITICAL)

### 1. Avoid English-style colon usage

- ❌ BAD: "주요 기능은 다음과 같습니다:"
- ✅ GOOD: "주요 기능은 아래와 같이 4가지로 정리할 수 있습니다."
- Do NOT end sentences with `:` before lists
- Use complete, natural Korean sentences

### 2. Use numbered headers for sequential content

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

### 3. Bold text for emphasis (use strategically)

- Use **bold** to highlight important sentences (not just keywords)
- Bold most of the important sentence, not just fragments
- ❌ BAD: "이 프로젝트는 **성능**이 매우 좋습니다."
- ✅ GOOD: "**이 프로젝트는 기존 대비 30% 성능 향상을 달성했습니다.**"
- Don't overuse - only for key points

### 4. Use blockquotes strategically (do NOT overuse)

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

### 5. Use footnotes for sources and references

- Add footnote markers in text: `~와 같은 사항이 있다고 합니다.[^footnote-keyword]`
- Place all footnote definitions at the END of the post
- Format: `[^footnote-keyword]: Additional info and [reference link](URL){: target="_blank"}`
- Example:
  ```markdown
  이 기술은 2024년에 처음 공개되었습니다.[^pytorch-release]

  [END OF POST]

  [^pytorch-release]: PyTorch 공식 블로그 [PyTorch 2.0 Release](https://pytorch.org/blog){: target="_blank"}
  ```

## TONE AND MANNER (CRITICAL)

### General Principles

- Maintain cautious and objective perspective on technology
- Remember primary audience: developers who worked before AI era
- Keep calm and professional tone throughout
- Avoid promotional language for any specific company/product

### AI-Related Content (SPECIAL RULES)

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
