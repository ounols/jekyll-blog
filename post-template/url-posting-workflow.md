# URL-Based Posting Workflow

## DATA COLLECTION (MANDATORY)

Use the Python crawler script
**IMPORTANT: Use the pre-built crawl_article.py script**

### How to use the Python crawler

1. Run the crawler script with the target URL:
```bash
python3 post-template/skills/crawl_article.py "TARGET_URL"
```

2. The script will output JSON data to stdout with the following structure:
```json
{
  "meta": {
    "title": "Article title",
    "ogImage": "URL to OG image",
    "description": "Article description",
    "publishDate": "Publication date if available",
    "author": "Author name if available"
  },
  "images": [
    {
      "src": "Absolute URL to image",
      "alt": "Alt text",
      "width": 800,
      "height": 600
    }
  ],
  "links": [
    {
      "text": "Link text in article",
      "url": "https://example.com/linked-page",
      "context": "...surrounding text where the link appears..."
    }
  ],
  "content": "Full article text content with footnote markers [1], [2], etc."
}
```

3. Parse the JSON output and use it for blog post generation

**Additional Requirements:**
- If content spans multiple pages, run the crawler for each page URL
- If page content is insufficient, use WebSearch tool for supplementary information
- Ensure complete data collection before proceeding

## LINK EXPLORATION (INTELLIGENT)

The crawler extracts all links from the article with their context. You should use your judgment to decide whether to crawl additional links based on:

1. **Relevance to Main Topic:**
   - Links that provide crucial background information
   - Links to related research papers or studies mentioned
   - Links to tools, libraries, or resources being discussed
   - Links that explain key concepts or terms

2. **Content Depth:**
   - If the main article only briefly mentions something important
   - If understanding a linked resource would significantly improve the blog post
   - If the link provides data, examples, or case studies

3. **Article Completeness:**
   - If the main article references external content heavily
   - If the article is part of a series or has related posts
   - If technical details are in separate documentation

**How to Use Link Information:**

Example:
```json
{
  "text": "recent research",
  "url": "https://example.com/ai-safety-study",
  "context": "...According to recent research[1], AI safety concerns have increased..."
}
```

> `context`: Surrounding text showing why/how the link was mentioned

**Decision Process:**
1. Review all extracted links and their contexts
2. Identify 2-3 most important links that would add value
3. Run the crawler on those URLs: `python3 post-template/skills/crawl_article.py "LINK_URL"`
4. Use the additional content to enrich your blog post with:
   - More detailed explanations
   - Supporting evidence or data
   - Technical background
   - Real-world examples

**Important:**
- Don't crawl every link - be selective and strategic
- Focus on links that fill knowledge gaps in the main article
- Avoid redundant links (multiple links to same domain/topic)
- Skip navigation links, social media, or promotional links
- The footnote numbers [1], [2] in the content help you locate where each link appears

## ERROR HANDLING

**If Python Crawler fails:**
1. Try WebFetch tool as first fallback
2. If WebFetch also fails, use WebSearch as final fallback
3. Search for: `[domain name] [key terms from URL]`
4. Cross-reference information from multiple accessible sources