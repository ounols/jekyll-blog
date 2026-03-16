# URL-Based Posting Constraints

## CONSTRAINTS

- Do NOT use emojis in blog post content (emojis are allowed ONLY in PR body)
- Do NOT use informal Korean (반말)
- Do NOT use colons (`:`) before lists - write complete sentences
- Do NOT bold single keywords OR entire sentences - bold core phrases only (2-8 words containing key information)
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

## VARIABLE HANDLING

### AUTHOR_OPINION

Follow the this md file : `url-posting-content-structure.md` -> ## QUICK QUESTIONS SECTION (REQUIRED)

### ADDITIONAL_PROMPT

If `ADDITIONAL_PROMPT` is provided:
- Read and follow those instructions AS WELL
- Additional instructions supplement (not replace) these base instructions
- If conflict exists, clarify with user or follow most specific instruction

## WORKFLOW CHECKLIST

- [ ] Check if AUTHOR_OPINION is provided (not empty)
- [ ] Understand ADDITIONAL_PROMPT before writing a post
- [ ] Data collected from TARGET_URL completely
- [ ] Additional searches performed if needed
- [ ] File created in `_posts/` with correct naming
- [ ] Front matter properly formatted
- [ ] AI disclosure included at top of body
- [ ] Original/project link inserted at very top (REQUIRED, before image)
- [ ] Representative image from TARGET_URL or official source inserted in opening (REQUIRED)
- [ ] Author's opinion as blockquote added (if AUTHOR_OPINION provided)
- [ ] Quick questions section added (1-3 Q&A pairs in blockquote format with .prompt-info)
- [ ] Maximum 6 top-level headers (##)
- [ ] Headers are descriptive and readable
- [ ] Content is technically accurate
- [ ] Images follow priority order: TARGET_URL → Official → News → WebSearch
- [ ] No generic stock photos for opening image
- [ ] Tone is objective and professional
- [ ] No excessive AI hype (if AI-related content)
- [ ] No emojis used in blog post content
- [ ] Code examples included where relevant
- [ ] NO colons (`:`) before lists - use complete Korean sentences
- [ ] Numbered headers used for sequential content (## 1., ## 2., etc.)
- [ ] Bold text used for core phrases (2-8 words), not single keywords or entire sentences
- [ ] Bold usage limited to 1-3 phrases per major section
- [ ] Blockquotes used strategically with appropriate prompt styles (NOT overused)
- [ ] Footnotes added for sources with definitions at end of post
- [ ] External image URLs used (not local paths yet)
- [ ] import.sh executed BEFORE git commands
- [ ] New branch created with pattern: `post/[slug]`
- [ ] Both markdown and media files added to git
- [ ] Commit message follows format: `feat(blog): Add [filename].md`
- [ ] Branch pushed to remote
- [ ] Pull Request created with proper title and description
