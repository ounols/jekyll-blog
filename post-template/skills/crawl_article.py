#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Article Content Crawler
Extracts article content from a given URL using Playwright
"""

import json
import sys
import asyncio
import io
import aiohttp
from playwright.async_api import async_playwright

# Fix Windows encoding issue
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


async def filter_images_by_size(images: list, max_size_mb: float = 7) -> list:
    """
    Filter images by file size

    Args:
        images: List of image dictionaries with 'src' field
        max_size_mb: Maximum file size in megabytes

    Returns:
        Filtered list of images
    """
    filtered = []
    max_size_bytes = max_size_mb * 1024 * 1024

    async with aiohttp.ClientSession() as session:
        for img in images:
            try:
                async with session.head(img['src'], timeout=aiohttp.ClientTimeout(total=5)) as response:
                    content_length = response.headers.get('Content-Length')

                    if content_length:
                        size_bytes = int(content_length)
                        if size_bytes < max_size_bytes:
                            filtered.append(img)
                            print(f'  ✓ {img["src"][:80]}... ({size_bytes / 1024 / 1024:.2f}MB)', file=sys.stderr)
                        else:
                            print(f'  ✗ Skipped (too large): {img["src"][:80]}... ({size_bytes / 1024 / 1024:.2f}MB)', file=sys.stderr)
                    else:
                        # If no Content-Length header, include the image
                        filtered.append(img)
                        print(f'  ✓ {img["src"][:80]}... (size unknown)', file=sys.stderr)

            except Exception as e:
                # On error, include the image (better to have it than miss it)
                filtered.append(img)
                print(f'  ✓ {img["src"][:80]}... (check failed: {str(e)})', file=sys.stderr)

    return filtered


async def crawl_reddit(page) -> dict:
    """Extract Reddit post content"""

    reddit_data = await page.evaluate('''() => {
        const post = {
            title: '',
            author: '',
            subreddit: '',
            selftext: '',
            comments: []
        };

        // Title
        const titleElem = document.querySelector('h1[slot="title"]') ||
                         document.querySelector('[data-test-id="post-content"] h1') ||
                         document.querySelector('shreddit-post h1');
        if (titleElem) {
            post.title = titleElem.textContent.trim();
        }

        // Author
        const authorElem = document.querySelector('shreddit-post')?.getAttribute('author') ||
                          document.querySelector('[data-author]')?.getAttribute('data-author');
        post.author = authorElem || '';

        // Subreddit
        const subredditElem = document.querySelector('shreddit-post')?.getAttribute('subreddit-prefixed-name');
        post.subreddit = subredditElem || '';

        // Post body (selftext)
        const selftextElem = document.querySelector('[slot="text-body"]') ||
                            document.querySelector('div[data-test-id="post-content"] > div') ||
                            document.querySelector('shreddit-post div[slot="text-body"]');
        if (selftextElem) {
            post.selftext = selftextElem.textContent.trim();
        }

        // Comments - get top level comments only
        const commentElems = document.querySelectorAll('shreddit-comment[depth="0"]');
        commentElems.forEach((comment, idx) => {
            if (idx < 10) {
                const commentBody = comment.querySelector('[slot="comment"]');
                const commentAuthor = comment.getAttribute('author');
                if (commentBody) {
                    post.comments.push({
                        author: commentAuthor || 'unknown',
                        body: commentBody.textContent.trim()
                    });
                }
            }
        });

        return post;
    }''')

    # Format content
    content = f"{reddit_data['selftext']}\n\n"
    if reddit_data['comments']:
        content += "=== Top Comments ===\n\n"
        for i, comment in enumerate(reddit_data['comments'], 1):
            content += f"{i}. {comment['author']}:\n{comment['body']}\n\n"

    return {
        'meta': {
            'title': reddit_data['title'],
            'author': reddit_data['author'],
            'subreddit': reddit_data['subreddit'],
            'ogImage': '',
            'description': reddit_data['selftext'][:200] if reddit_data['selftext'] else '',
            'publishDate': ''
        },
        'images': [],
        'content': content
    }


async def crawl_article(url: str) -> dict:
    """
    Crawl article content from the given URL

    Args:
        url: Target URL to crawl

    Returns:
        Dictionary containing meta, images, and content
    """
    # Check if it's a Reddit URL
    is_reddit = 'reddit.com' in url

    async with async_playwright() as p:
        # Launch with more realistic browser settings to avoid bot detection
        browser = await p.chromium.launch(
            headless=True,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox'
            ]
        )

        # Create context with realistic user agent and viewport
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport={'width': 1920, 'height': 1080},
            locale='ko-KR'
        )

        page = await context.new_page()

        try:
            # Block ads and tracking to prevent timeout
            async def route_handler(route):
                url_str = route.request.url
                if any(blocked in url_str for blocked in [
                    'doubleclick', 'google-analytics', 'googletagmanager',
                    'facebook.net', '.ads.', 'ad.', '/ads/'
                ]):
                    await route.abort()
                else:
                    await route.continue_()

            await page.route('**/*', route_handler)

            print(f'Navigating to: {url}', file=sys.stderr)
            await page.goto(url, wait_until='domcontentloaded', timeout=30000)

            # Wait for dynamic content to render
            await page.wait_for_timeout(3000)

            # Try to close any popups or modals (newsletter signup, cookie consent, etc.)
            print('Checking for modals/popups...', file=sys.stderr)
            try:
                # Press Escape key to close any modals
                await page.keyboard.press('Escape')
                await page.wait_for_timeout(500)
            except:
                pass

            # Wait for images to load
            print('Waiting for images to load...', file=sys.stderr)
            await page.evaluate('''async () => {
                const images = Array.from(document.querySelectorAll('img'));
                await Promise.all(
                    images.map(img => {
                        if (img.complete) return Promise.resolve();
                        return new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = resolve; // Resolve even on error to not block
                            setTimeout(resolve, 5000); // Timeout after 5s
                        });
                    })
                );
            }''')

            print('Extracting content...', file=sys.stderr)

            # Special handling for Reddit
            if is_reddit:
                print('Detected Reddit URL, using Reddit-specific extraction...', file=sys.stderr)
                data = await crawl_reddit(page)
                print(f'✓ Title: {data["meta"]["title"]}', file=sys.stderr)
                print(f'✓ Subreddit: {data["meta"].get("subreddit", "N/A")}', file=sys.stderr)
                print(f'✓ Content length: {len(data["content"])} characters', file=sys.stderr)
                return data

            # Inject Readability.js for better content extraction
            print('Loading Readability.js for Reader Mode extraction...', file=sys.stderr)
            try:
                await page.add_script_tag(url='https://cdn.jsdelivr.net/npm/@mozilla/readability@0.5.0/Readability.min.js')
                await page.wait_for_timeout(500)
                print('✓ Readability.js loaded', file=sys.stderr)
            except Exception as e:
                print(f'⚠ Failed to load Readability.js: {str(e)}', file=sys.stderr)

            # Extract data using JavaScript
            data = await page.evaluate('''() => {
                const result = {
                    meta: {},
                    images: [],
                    links: [],
                    content: ''
                };

                // Extract meta information
                result.meta.title = document.querySelector('h1')?.textContent?.trim() ||
                                   document.querySelector('meta[property="og:title"]')?.content || '';
                result.meta.ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
                result.meta.description = document.querySelector('meta[property="og:description"]')?.content ||
                                         document.querySelector('meta[name="description"]')?.content || '';

                // Try to find publication date
                const dateSelectors = [
                    'time[datetime]',
                    '.date',
                    '.publish-date',
                    '[itemprop="datePublished"]',
                    'meta[property="article:published_time"]'
                ];
                for (const selector of dateSelectors) {
                    const dateElem = document.querySelector(selector);
                    if (dateElem) {
                        result.meta.publishDate = dateElem.getAttribute('datetime') ||
                                                 dateElem.getAttribute('content') ||
                                                 dateElem.textContent.trim();
                        break;
                    }
                }

                // Try to find author
                const authorSelectors = [
                    '[itemprop="author"]',
                    '.author',
                    '.writer',
                    'meta[name="author"]',
                    'meta[property="article:author"]'
                ];
                for (const selector of authorSelectors) {
                    const authorElem = document.querySelector(selector);
                    if (authorElem) {
                        result.meta.author = authorElem.textContent?.trim() ||
                                           authorElem.getAttribute('content') || '';
                        break;
                    }
                }

                // Helper function to convert content with links to footnote format
                function convertLinksToFootnotes(element) {
                    const links = [];
                    const clone = element.cloneNode(true);

                    // Find all <a> links in the content (excluding image parent links)
                    const allLinks = Array.from(clone.querySelectorAll('a[href]'));

                    allLinks.forEach((link, index) => {
                        const href = link.href;
                        const text = link.textContent.trim();

                        // Skip empty links, anchors, and javascript links
                        if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
                            return;
                        }

                        // Skip if link text is too long (likely not a real link)
                        if (text.length > 200) {
                            return;
                        }

                        // Skip if this link only contains an image (it's an image wrapper)
                        const hasOnlyImage = link.querySelector('img') && link.textContent.trim().length === 0;
                        if (hasOnlyImage) {
                            return;
                        }

                        // Skip if the link URL is an image file
                        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
                        const isImageUrl = imageExtensions.some(ext => href.toLowerCase().includes(ext));
                        if (isImageUrl) {
                            return;
                        }

                        const footnoteNum = links.length + 1;

                        // Store link info
                        links.push({
                            text: text,
                            url: href,
                            context: getContextAroundElement(link)
                        });

                        // Replace link with text + footnote marker
                        const footnoteMarker = `[${footnoteNum}]`;
                        link.replaceWith(text + footnoteMarker);
                    });

                    return {
                        content: clone.innerText.trim(),
                        links: links
                    };
                }

                // Helper function to get context around a link
                function getContextAroundElement(element) {
                    const parent = element.parentElement;
                    if (!parent) return '';

                    const parentText = parent.innerText || '';
                    const linkText = element.innerText || '';

                    // Find the link text in parent text
                    const linkIndex = parentText.indexOf(linkText);
                    if (linkIndex === -1) return parentText.substring(0, 100);

                    // Get 50 chars before and after
                    const start = Math.max(0, linkIndex - 50);
                    const end = Math.min(parentText.length, linkIndex + linkText.length + 50);

                    let context = parentText.substring(start, end).trim();
                    if (start > 0) context = '...' + context;
                    if (end < parentText.length) context = context + '...';

                    return context;
                }

                // Extract main content using Reader Mode (Readability.js) if available
                let readerModeContent = null;
                let contentElement = null;

                if (typeof Readability !== 'undefined') {
                    try {
                        const documentClone = document.cloneNode(true);
                        const reader = new Readability(documentClone);
                        const article = reader.parse();
                        if (article && article.content) {
                            // Create a temporary div with the reader mode HTML
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = article.content;
                            contentElement = tempDiv;

                            // Also update metadata if available from Reader Mode
                            if (article.title && !result.meta.title) {
                                result.meta.title = article.title;
                            }
                            if (article.byline && !result.meta.author) {
                                result.meta.author = article.byline;
                            }
                        }
                    } catch (e) {
                        console.log('Readability.js failed:', e.message);
                    }
                }

                // Fallback: Extract main content using smart detection
                if (!contentElement) {
                    // First try specific selectors
                    const contentSelectors = [
                        '[itemprop="articleBody"]',
                        '.content-column-post-body',  // For sites like thenewstack.io
                        'article .entry-content',
                        '.article-content',
                        '.post-content',
                        '.post-body',
                        'article',
                        'main article'
                    ];

                    for (const selector of contentSelectors) {
                        const elem = document.querySelector(selector);
                        if (elem && elem.innerText.length > 100) {
                            const text = elem.innerText;
                            // Skip if it contains newsletter/subscription forms
                            if (!text.includes('EMAIL ADDRESS') &&
                                !text.includes('SUBSCRIBE') &&
                                !text.includes('SUBSCRIPTION REQUIRED')) {
                                contentElement = elem;
                                break;
                            }
                        }
                    }

                    // If no specific selector worked, use smart detection
                    if (!contentElement) {
                        const allDivs = Array.from(document.querySelectorAll('div'));
                        let bestCandidate = null;
                        let bestScore = 0;

                        allDivs.forEach(div => {
                            const text = div.innerText || '';
                            const html = div.innerHTML || '';

                            // Skip if too short or contains newsletter signup
                            if (text.length < 500) return;
                            if (text.includes('EMAIL ADDRESS') || text.includes('SUBSCRIBE')) return;
                            if (html.includes('newsletter-signup') || html.includes('subscription-modal')) return;

                            // Score based on content quality indicators
                            const paragraphs = div.querySelectorAll('p').length;
                            const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
                            const score = paragraphs * 10 + headings * 5 + (text.length / 100);

                            if (score > bestScore) {
                                bestScore = score;
                                bestCandidate = div;
                            }
                        });

                        contentElement = bestCandidate || document.body;
                    }
                }

                // Convert links to footnotes and extract content
                const extracted = convertLinksToFootnotes(contentElement);
                result.content = extracted.content;
                result.links = extracted.links;

                // Extract images with position markers
                const allImages = Array.from(contentElement.querySelectorAll('img'));
                const imageMarkers = [];

                // Create a clone for text extraction with image markers
                const contentClone = contentElement.cloneNode(true);
                const imagesInClone = Array.from(contentClone.querySelectorAll('img'));

                imagesInClone.forEach((img, index) => {
                    const marker = `\n\n[IMAGE-${index + 1}: ${img.alt || 'image'}]\n\n`;
                    const textNode = document.createTextNode(marker);
                    img.parentNode.replaceChild(textNode, img);

                    // Store image data
                    const originalImg = allImages[index];
                    imageMarkers.push({
                        src: originalImg.src,
                        alt: originalImg.alt || '',
                        width: originalImg.naturalWidth || originalImg.width || 0,
                        height: originalImg.naturalHeight || originalImg.height || 0,
                        position: index + 1
                    });
                });

                // Extract content with image markers
                result.content = contentClone.innerText.trim();
                result.images = imageMarkers;

                return result;
            }''')

            print(f'✓ Title: {data["meta"]["title"]}', file=sys.stderr)
            print(f'✓ Images found: {len(data["images"])}', file=sys.stderr)
            print(f'✓ Links found: {len(data.get("links", []))}', file=sys.stderr)
            print(f'✓ Content length: {len(data["content"])} characters', file=sys.stderr)

            # Filter images by file size (< 7MB)
            print('Filtering images by file size...', file=sys.stderr)
            filtered_images = await filter_images_by_size(data["images"], max_size_mb=7)
            data["images"] = filtered_images
            print(f'✓ Images after size filtering: {len(data["images"])}', file=sys.stderr)

            return data

        except Exception as e:
            print(f'❌ Error: {str(e)}', file=sys.stderr)
            raise
        finally:
            await browser.close()


def main():
    if len(sys.argv) < 2:
        print('Usage: python crawl_article.py <URL>', file=sys.stderr)
        sys.exit(1)

    url = sys.argv[1]

    try:
        # Run async function
        data = asyncio.run(crawl_article(url))

        # Output JSON to stdout (for easy parsing)
        print(json.dumps(data, ensure_ascii=False, indent=2))

    except Exception as e:
        print(f'Failed to crawl article: {str(e)}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
