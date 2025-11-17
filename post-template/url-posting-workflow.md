# URL-Based Posting Workflow

## DATA COLLECTION (MANDATORY)

**Primary Method:**
Use the Python crawler script with Playwright:

**Fallback Method (if Python crawler fails):**
- Use WebFetch tool to retrieve content from `TARGET_URL`

**IMPORTANT: Use the pre-built crawl_article.py script**

**How to use the Python crawler:**

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

**What the crawler does:**
- Launches headless Chromium browser using Playwright
- Blocks ads and tracking scripts to prevent timeouts
- Waits for dynamic content to render
- Uses Readability.js for Reader Mode extraction (prioritizes clean content)
- Extracts meta information (title, OG image, description, date, author)
- Extracts main article content using multiple selector strategies
- Converts article links to footnote format [1], [2], etc.
- Extracts all text links with URL, text, and surrounding context
- Filters image links (excludes image URLs and image wrapper links)
- Filters and extracts images (only > 200x200px)
- Returns structured JSON data

**Fallback Method 2 (if Python crawler also fails):**
- Use WebSearch tool to search for the TARGET_URL and related content
- Extract information from search results and accessible alternative sources
- Verify information accuracy across multiple sources

**Additional Requirements:**
- If content spans multiple pages, run the crawler for each page URL
- If page content is insufficient, use WebSearch tool for supplementary information
- Ensure complete data collection before proceeding

## LINK EXPLORATION (INTELLIGENT)

**When to Crawl Additional Links:**

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

Each link in the `links` array includes:
- `text`: The clickable link text in the article (e.g., "this study", "documentation")
- `url`: The actual URL to crawl
- `context`: Surrounding text showing why/how the link was mentioned

Example:
```json
{
  "text": "recent research",
  "url": "https://example.com/ai-safety-study",
  "context": "...According to recent research[1], AI safety concerns have increased..."
}
```

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

**Why Python Crawler is Primary:**
- Uses Playwright (headless Chromium) which simulates real browser
- Bypasses most bot detection and anti-scraping measures
- Handles JavaScript-rendered content properly
- Extracts clean content using Readability.js (Reader Mode)
- Provides structured data with links, images, and metadata
- Higher success rate than WebFetch or simple HTTP requests

**Playwright Skill Usage (for bot detection/JavaScript sites):**
- Playwright bypasses most bot detection by simulating a real browser
- Handles JavaScript-rendered content (SPAs, dynamic pages)
- Can extract images with actual dimensions and meta tags
- Automatically converts relative image URLs to absolute URLs
- Particularly useful for:
  - Sites that block automated requests
  - JavaScript-heavy websites
  - Pages with dynamic content loading
  - Sites with CAPTCHA/bot protection
  - Sites with heavy ads/tracking that cause timeout

**Common Playwright Issues and Solutions:**
- **Timeout errors**: Modern sites with ads/tracking take too long to load
  - Solution: Use 'domcontentloaded' wait strategy and block ads/tracking in route handler
- **Content extraction fails**: Different sites use different HTML structures
  - Solution: Try multiple selectors in priority order (article, main, .post-content, etc.)
- **Images not loaded**: Dynamic content needs time to render
  - Solution: Add 2-second wait after page load with `page.wait_for_timeout(2000)`
- **Relative image URLs**: Some sites return relative paths
  - Solution: Using `img.src` in page.evaluate() automatically converts to absolute URLs

**If content is incomplete:**
- Use WebSearch to find additional information
- Cross-reference multiple sources
- Ensure technical accuracy before writing

**Important Notes:**
- GitHub Actions environment may have network restrictions
- Some websites block automated requests from CI/CD environments
- **Playwright Skill is auto-invoked** - just request browser automation tasks
- Playwright Skill manages /tmp access, file creation, and cleanup automatically
- Browser automation adds ~5-10 seconds execution time but has highest success rate
- Always have WebSearch as the final fallback method
- Timeout errors are common - don't retry indefinitely, move to next fallback quickly
- **Python crawler with Playwright is the primary method** - use it first for best results
