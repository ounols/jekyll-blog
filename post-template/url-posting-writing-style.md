# URL-Based Posting Writing Style

## BASIC WRITING STYLE

- Korean language (NOT simple translation, but natural Korean)
- For general topics: Write in accessible, easy-to-understand style
- **For graphics rendering topics: Write with deep technical expertise**
  - Includes: Real-time graphics rendering, rendering algorithms, shader techniques, lighting models, ray tracing, rasterization, graphics rendering theory
  - Requires: Technical depth, mathematical explanations when needed, implementation details
  - Examples: Lambert diffuse vs Burley diffuse, PBR materials, global illumination techniques
- No emojis in blog post content (emojis are allowed ONLY in PR body)
- Formal tone: Use ~습니다, ~합니다 forms
- **Keep explanations concise and readable** - Summarize lengthy explanations to improve readability

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

- Use **bold** to highlight important **phrases** (not single keywords, not entire sentences)
- Bold core phrases that contain the key information
- ❌ BAD (single keyword): "이 프로젝트는 **성능**이 매우 좋습니다."
- ❌ BAD (entire sentence): "**이 프로젝트는 기존 대비 30% 성능 향상을 달성했습니다.**"
- ✅ GOOD (core phrase): "이 프로젝트는 **기존 대비 30% 성능 향상**을 달성했습니다."
- ✅ GOOD (core phrase): "이번 업데이트는 **메모리 사용량을 절반으로 감소**시켰습니다."
- Don't overuse - only for truly important information
- Aim for 1-3 bold phrases per major section (##)

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

### 6. Keep content concise and readable

**Paragraph Length Guidelines:**
- Generally aim for 2-4 sentences per paragraph (NOT one sentence per paragraph)
- If a single paragraph exceeds 6-7 sentences, **split it into multiple paragraphs** at natural topic boundaries
- Group related sentences together in the same paragraph to maintain logical flow
- Long continuous explanations are NOT allowed, but splitting content into multiple readable paragraphs IS allowed

**Bad vs Good Examples:**

❌ BAD (each sentence is a separate paragraph):
```
FFmpeg과 구글 간의 이번 충돌은 단순한 한 프로젝트의 문제가 아닙니다.

이는 현대 디지털 인프라를 지탱하는 오픈소스 생태계의 구조적 문제를 드러냅니다.

오픈소스 소프트웨어는 인터넷 경제에서 수조 달러의 가치를 창출하고 있습니다.
```

✅ GOOD (related sentences grouped together):
```
FFmpeg과 구글 간의 이번 충돌은 단순한 한 프로젝트의 문제가 아닙니다. 이는 현대 디지털 인프라를 지탱하는 오픈소스 생태계의 구조적 문제를 드러냅니다.

오픈소스 소프트웨어는 인터넷 경제에서 수조 달러의 가치를 창출하고 있습니다. 하지만 이러한 가치를 창출하는 개발자들은 종종 적절한 보상을 받지 못하고 있습니다.

AI 도구가 더 많은 버그를 찾아낼수록 이 문제는 더욱 심화될 것입니다. 기업들이 오픈소스에 의존하면서도 이를 지속가능하게 만드는 데 투자하지 않는다면, 언젠가는 핵심 인프라가 유지보수되지 않는 상황에 직면할 수 있습니다.
```

**Priority Rule:**
- **Technical accuracy takes priority over brevity**
- If content becomes long due to technical accuracy requirements, use paragraph splitting to maintain readability
- Don't sacrifice important technical details for the sake of brevity

**Content Strategy:**
- Don't copy-paste long paragraphs from source - summarize and restructure
- Break down complex information into digestible chunks using:
  - Multiple short paragraphs (preferred method)
  - Subsections with headers
  - Bullet points for lists
  - Numbered lists for step-by-step content

**Subject-Based Application:**
- Apply writing depth according to the TARGET_URL's topic
- General news/announcements: Keep concise and accessible
- Technical deep-dives: Allow detailed explanations (split into paragraphs)
- Graphics rendering topics: Prioritize technical accuracy, use paragraph splitting extensively

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
