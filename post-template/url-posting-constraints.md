# URL-Based Posting Constraints

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

## VARIABLE HANDLING

### AUTHOR_OPINION

If `AUTHOR_OPINION` is provided (not empty):
- Add as a blockquote (NOT a header section)
- Format: `> **블로그 주인장의 의견**` followed by opinion content
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
