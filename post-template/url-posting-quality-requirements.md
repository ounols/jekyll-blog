# URL-Based Posting Quality Requirements

## TECHNICAL ACCURACY

- Provide technically accurate and reliable information
- Verify facts through additional searches if needed
- Do NOT guess or assume - search for confirmation

## VISUAL ELEMENTS

**Image Usage Strategy:**
- Use images strategically to enhance understanding
- **Required**: Representative image in opening section
- **Optional**: Additional images for UI screenshots, diagrams, product visuals
- **NOT required**: Images for abstract concepts or theories (unless they genuinely help)

**Image Priority Order (follow strictly):**
1. **First priority**: Images from TARGET_URL (screenshots, photos, diagrams from the original article)
2. **Second priority**: Official project images (from GitHub, official website, documentation)
3. **Third priority**: Related news/article images from reputable sources
4. **Last resort**: WebSearch for relevant images (avoid generic stock photos)

**Image Insertion Format:**
```markdown
![Description](ImageURL)
```

**With Caption:**
```markdown
![Description](ImageURL)
_Caption text in Korean_
```

## CODE EXAMPLES

- Include code examples when relevant
- Add additional code examples if they aid understanding
- Use appropriate language syntax highlighting

## LINKS

- Provide supplementary links when helpful

## IMAGE HANDLING

**Critical Rule:**
- ALL images in the post MUST be external URLs initially
- The `import.sh` script will later convert them to self-hosted

**Opening Section Link (REQUIRED - PLACE FIRST):**
- Insert TARGET_URL as a link at the very top of the post body (after AI disclosure)
- Format: `**원본 링크**: [Title](URL){: target="_blank"}` for articles/news
- Format: `**프로젝트 링크**: [Project Name](URL){: target="_blank"}` for projects
- This provides attribution and allows readers to access the original source

**Opening Section Image (REQUIRED):**
- MUST use image from TARGET_URL or official project source
- This is the representative image that appears at the top of the post
- If TARGET_URL is inaccessible, use official project website/GitHub images
- Never use generic stock photos for opening image

**Additional Images (OPTIONAL):**
- Use when they genuinely enhance understanding
- Follow the priority order specified in VISUAL ELEMENTS section
- Examples of good use cases:
  - UI screenshots showing the actual product
  - Architecture diagrams from official documentation
  - Before/after comparisons
  - Performance charts or benchmarks
- Avoid unnecessary images for abstract concepts

**Image Selection Process:**
1. When fetching TARGET_URL content, actively look for image URLs in the HTML
2. Check if TARGET_URL contains featured images, screenshots, or diagrams
3. If TARGET_URL images exist, use them as the primary source
4. Only use WebSearch if TARGET_URL and official sources have no suitable images
