# URL-Based Posting Workflow

## DATA COLLECTION (MANDATORY)

**Primary Method:**
- Use WebFetch tool to retrieve content from `TARGET_URL`

**Fallback Method (if WebFetch fails):**
Use browser automation with Playwright (bypasses bot detection and handles JavaScript-rendered content):

**IMPORTANT: Playwright Skill is available and auto-invoked - just request browser automation**

**How to use Playwright:**

Simply request browser automation task directly:

```
Navigate to TARGET_URL using a browser and extract:

1. Page title (h1 tag and og:title meta tag)
2. Representative image (og:image meta tag)
3. All article images (filter: width > 200px, height > 200px, http/https URLs only)
   - For each image: src (as absolute URL), alt text, width, height
4. Main article content text
   - Try these selectors in order: [itemprop="articleBody"], article, .article-content, .post-content, main
   - If none work, use body text
5. Publication date if available
6. Author info if available

Important requirements:
- Block ads and tracking scripts (doubleclick, google-analytics, googletagmanager, facebook.net, .ads.) to prevent timeout
- Wait 2 seconds after page load for dynamic content to render
- Use 'domcontentloaded' wait strategy (not 'networkidle') for faster loading
- Extract image src values which are automatically absolute URLs (not relative paths)
- Return data in JSON format with fields: meta, images, content
```

**How it works:**
- Claude will automatically invoke the Playwright Skill when you request browser automation
- The Skill writes and executes Playwright code in /tmp (which it has access to)
- No manual file creation or Skill invocation needed
- Results are returned as structured data

**Fallback Method 2 (if Playwright also fails):**
- Use WebSearch tool to search for the TARGET_URL and related content
- Extract information from search results and accessible alternative sources
- Verify information accuracy across multiple sources

**Additional Requirements:**
- If content spans multiple pages, run Playwright for each page URL
- If page content is insufficient, use WebSearch tool for supplementary information
- Ensure complete data collection before proceeding

## ERROR HANDLING

**If WebFetch fails:**
1. **Immediately request browser automation** (Playwright Skill will auto-invoke; skip Python requests - it usually fails with 403 too)
2. If browser automation also fails, use WebSearch as final fallback
3. Search for: `[domain name] [key terms from URL]`
4. Cross-reference information from multiple accessible sources

**Why Skip Python Requests:**
- Most modern sites that block WebFetch also block Python requests (403 errors)
- Browser automation (Playwright) has much higher success rate by simulating real browser
- Saves time by going directly to the most reliable method
- Playwright Skill is available in Claude Code environment

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
- **Python requests is deprecated** - skip it and go directly to browser automation when WebFetch fails
