# URL-Based Posting Workflow

## DATA COLLECTION (MANDATORY)

**Primary Method:**
- Use WebFetch tool to retrieve content from `TARGET_URL`

**Fallback Method (if WebFetch fails):**
Use Playwright Skill for browser automation (bypasses bot detection and handles JavaScript-rendered content):

**IMPORTANT: Playwright Skill is pre-installed and ready to use - DO NOT write script files manually**

**How to use Playwright Skill:**

1. Invoke the Skill tool with:
```
Skill tool with parameter: "playwright-skill:playwright-skill"
```

2. Once the Skill is loaded, give it a direct command like:
```
Navigate to TARGET_URL and extract the following information:

1. Page title (from h1 tag and og:title meta tag)
2. Main article content (try selectors: [itemprop="articleBody"], article, .article-content, .post-content, main)
3. Representative image (og:image meta tag)
4. All images in the article (filter: width > 200px, height > 200px, must have http/https URL)
   - Include: src (absolute URL), alt text, width, height
5. Publication date if available
6. Author information if available

Important extraction requirements:
- Block ads and tracking scripts to prevent timeout
- Wait 2 seconds after page load for dynamic content
- Extract image src as absolute URLs (not relative paths)
- Use 'domcontentloaded' wait strategy for faster loading
- Try multiple content selectors if first one fails
```

3. The Playwright Skill will:
   - Handle browser automation internally
   - Manage /tmp directory access automatically
   - Return extracted data in a structured format
   - Close the browser after extraction

4. Parse the Skill's output and use:
   - og:image or first large image as representative image
   - Main content text for blog post creation
   - All image URLs are already absolute paths

**Playwright Skill Best Practices:**
- **Use direct commands** - tell the Skill what to extract, don't write script files
- **DO NOT manually install Playwright** - it's pre-installed via the Skill
- **DO NOT write .js script files** - the Skill handles everything internally
- The Skill manages browser, temporary files, and cleanup automatically
- Give clear extraction instructions including:
  - Target URL
  - What data to extract (title, content, images, metadata)
  - Selector preferences
  - Filtering criteria (image size, URL format, etc.)
- The Skill will automatically:
  - Block ads/tracking to prevent timeout
  - Use appropriate wait strategies
  - Convert relative URLs to absolute URLs
  - Handle JavaScript-rendered content

**Fallback Method 2 (if Playwright Skill also fails):**
- Use WebSearch tool to search for the TARGET_URL and related content
- Extract information from search results and accessible alternative sources
- Verify information accuracy across multiple sources

**Additional Requirements:**
- If content spans multiple pages, ask Playwright Skill to navigate to each page
- If page content is insufficient, use WebSearch tool for supplementary information
- Ensure complete data collection before proceeding

## ERROR HANDLING

**If WebFetch fails:**
1. **Immediately try Playwright Skill** (skip Python requests - it usually fails with 403 too)
2. If Playwright Skill also fails, use WebSearch as final fallback
3. Search for: `[domain name] [key terms from URL]`
4. Cross-reference information from multiple accessible sources

**Why Skip Python Requests:**
- Most modern sites that block WebFetch also block Python requests (403 errors)
- Playwright Skill has much higher success rate by simulating real browser
- Saves time by going directly to the most reliable method
- Playwright Skill is already installed and ready to use

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

**Common Playwright Skill Issues and Solutions:**
- **Timeout errors**: Modern sites with ads/tracking take too long to load
  - Solution: Ask the Skill to use 'domcontentloaded' wait strategy and block ads
- **Content extraction fails**: Different sites use different HTML structures
  - Solution: Provide multiple selector options in your command (article, main, .post-content, etc.)
- **Images not loaded**: Dynamic content needs time to render
  - Solution: Ask the Skill to wait 2 seconds after page load
- **Relative image URLs**: Some sites return relative paths
  - Solution: The Skill automatically converts them to absolute URLs (img.src property)

**If content is incomplete:**
- Use WebSearch to find additional information
- Cross-reference multiple sources
- Ensure technical accuracy before writing

**Important Notes:**
- GitHub Actions environment may have network restrictions
- Some websites block automated requests from CI/CD environments
- **Playwright Skill is pre-installed** - ready to use immediately via Skill tool
- Playwright Skill handles /tmp directory access automatically
- Playwright adds ~5-10 seconds execution time but has highest success rate
- Always have WebSearch as the final fallback method
- Timeout errors are common - don't retry indefinitely, move to next fallback quickly
- **Python requests is deprecated** - skip it and go directly to Playwright Skill when WebFetch fails
