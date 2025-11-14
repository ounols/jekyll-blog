# URL-Based Posting Workflow

## DATA COLLECTION (MANDATORY)

**Primary Method:**
- Use WebFetch tool to retrieve content from `TARGET_URL`

**Fallback Method 1 (if WebFetch fails):**
```python
import requests
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive'
}
response = requests.get(TARGET_URL, headers=headers, timeout=30)
# Parse and extract content
```

**Fallback Method 2 (if Python requests also fails):**
Use Playwright Skill for browser automation (bypasses bot detection):

1. Load the Playwright Skill:
```
Use Skill tool with parameter: "playwright-skill:playwright-skill"
```

2. Create a Playwright script to extract content and images:
```javascript
// IMPORTANT: Write script to current directory (NOT /tmp - it's blocked in GitHub Actions)
// Example usage - write to ./crawl-target.js
const { chromium } = require('playwright');

const TARGET_URL = 'YOUR_URL_HERE';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  // IMPORTANT: Block ads and tracking scripts to prevent timeout
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.includes('doubleclick') ||
        url.includes('google-analytics') ||
        url.includes('googletagmanager') ||
        url.includes('facebook.net') ||
        url.includes('twitter.com/i/') ||
        url.includes('.ads.') ||
        url.includes('adservice')) {
      route.abort();
    } else {
      route.continue();
    }
  });

  // Use 'domcontentloaded' for sites with heavy ads/tracking
  // Use 'networkidle' only for simple static sites
  await page.goto(TARGET_URL, {
    waitUntil: 'domcontentloaded',  // More tolerant than 'networkidle'
    timeout: 30000
  });

  // Wait additional time for content rendering
  await page.waitForTimeout(2000);

  // Extract meta information (for representative image)
  const meta = await page.evaluate(() => ({
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    title: document.querySelector('meta[property="og:title"]')?.content,
    description: document.querySelector('meta[property="og:description"]')?.content
  }));

  // Extract all images with dimensions
  // NOTE: img.src automatically returns absolute URL (not relative path)
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .map(img => ({
        src: img.src,  // This is already absolute URL like https://example.com/image.jpg
        alt: img.alt,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      }))
      .filter(img => img.width > 200 && img.height > 200 && img.src.startsWith('http'));
  });

  // Extract main content - try multiple selectors in priority order
  const content = await page.evaluate(() => {
    const selectors = [
      '[itemprop="articleBody"]',           // Schema.org standard
      '#tns-post-body-content',             // The New Stack
      '#tns-post-body',                     // The New Stack (broader)
      'article .entry-content',             // WordPress standard
      '.post-content',                      // Common blog pattern
      '.article-content',                   // Common article pattern
      '.content-column-post-body',          // The New Stack alternative
      'article',                            // Generic article tag
      'main[role="main"]',                  // Semantic HTML
      '.entry-content',                     // WordPress
      'main'                                // Last resort
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.innerText && element.innerText.length > 200) {
        return element.innerText;
      }
    }
    return document.body.innerText; // Fallback to entire body
  });

  console.log(JSON.stringify({ meta, images, content }));
  await browser.close();
})();
```

3. Execute the script and parse the JSON output:
```bash
# Run from current directory (NOT cd /tmp)
node ./crawl-target.js
```

4. Use meta.ogImage or the first large image as representative image
5. Use the content text for blog post creation

**Playwright Best Practices:**
- **DO NOT use `/tmp` directory** - it's blocked in GitHub Actions
- **Write scripts to current working directory** (`./script.js`)
- **Run scripts from current directory** (`node ./script.js`)
- **Always block ads/tracking** to prevent timeout issues
- **Use `domcontentloaded`** instead of `networkidle` for modern websites with heavy scripts
- **Try multiple content selectors** as different sites use different structures
- **Add 2-second wait** after page load to allow dynamic content rendering
- **If first attempt fails with timeout**: retry with ad blocking enabled

**Fallback Method 3 (if all direct methods fail):**
- Use WebSearch tool to search for the TARGET_URL and related content
- Extract information from search results and accessible alternative sources
- Verify information accuracy across multiple sources

**Additional Requirements:**
- If content spans multiple pages, collect ALL pages
- If page content is insufficient, use WebSearch tool for supplementary information
- Ensure complete data collection before proceeding

## ERROR HANDLING

**If WebFetch fails:**
1. Try Python requests with enhanced headers (including timeout)
2. If connection timeout/bot detection occurs, try Playwright Skill
3. If Playwright also fails, use WebSearch as final fallback
4. Search for: `[domain name] [key terms from URL]`
5. Cross-reference information from multiple accessible sources

**Playwright Skill Usage (for bot detection/JavaScript sites):**
- Playwright bypasses most bot detection by simulating a real browser
- Handles JavaScript-rendered content (SPAs, dynamic pages)
- Can extract images with actual dimensions and meta tags
- Particularly useful for:
  - Sites that block automated requests
  - JavaScript-heavy websites
  - Pages with dynamic content loading
  - Sites with CAPTCHA/bot protection
  - Sites with heavy ads/tracking that cause timeout

**Common Playwright Issues and Solutions:**
- **Timeout with `networkidle`**: Modern sites with ads/tracking never reach "network idle"
  - Solution: Use `waitUntil: 'domcontentloaded'` instead
  - Add route blocking for ad/tracking domains
- **Content extraction fails**: Different sites use different HTML structures
  - Solution: Try multiple content selectors (article, main, .post-content, etc.)
  - Fallback to document.body if specific selectors fail
- **Images not loaded**: Dynamic content needs time to render
  - Solution: Add `await page.waitForTimeout(2000)` after page load

**If content is incomplete:**
- Use WebSearch to find additional information
- Cross-reference multiple sources
- Ensure technical accuracy before writing

**Important Notes:**
- GitHub Actions environment may have network restrictions
- Some websites block automated requests from CI/CD environments
- Playwright adds ~5-10 seconds execution time but has highest success rate
- Always have WebSearch as the final fallback method
- Timeout errors are common - don't retry indefinitely, move to next fallback quickly
- Playwright Skill is already available in the Claude Code Action environment
