# URL-Based Posting Configuration

## OBJECTIVE
Analyze content from a given URL and create a comprehensive Korean blog post automatically. This is used by GitHub Actions workflow for automated posting.

## HOW TO USE THIS TEMPLATE

Follow these template files in order:

1. **Read this file first** (`url-posting-config.md`) - Configuration and setup
2. **Execute data collection** (`url-posting-workflow.md`) - Fetch content from TARGET_URL
3. **Follow content structure** (`url-posting-content-structure.md`) - Build post structure
4. **Apply writing style** (`url-posting-writing-style.md`) - Korean style guidelines and tone
5. **Ensure quality** (`url-posting-quality-requirements.md`) - Images, code, links, accuracy
6. **Execute git workflow** (`url-posting-git-workflow.md`) - Run import.sh, create branch, PR
7. **Check constraints** (`url-posting-constraints.md`) - Final checklist and validation

## INPUT VARIABLES
- `TARGET_URL`: The URL to analyze and write about
- `AUTHOR_OPINION`: Blog owner's personal opinion/thoughts on the topic (optional)
- `ADDITIONAL_PROMPT`: Optional additional instructions from user

## FILE CREATION

**File Location and Naming:**
- Path: `_posts/YYYY-MM-DD-[project-name-in-english].md`
- Use TODAY's date for YYYY-MM-DD
- Project name in English, lowercase, hyphen-separated
- Example: `_posts/2025-11-05-awesome-ml-project.md`

## FRONT MATTER (EXACT FORMAT REQUIRED)

```yaml
---
title: [Compelling title including project name and core topic]
description: [Concise 1-2 sentence summary of main topics]
author: claude
date: 'YYYY-MM-DD HH:mm:SS'
categories:
  - News Articles
tags:
  - [Related technology tags]
pin: false
math: [true if LaTeX needed, false otherwise]
mermaid: [true if mermaid diagrams needed, false otherwise]
hidden: true
---
```

**Title Requirements:**
- Include the project/content name
- Reflect core topic clearly
- Make it compelling but not clickbait
- Korean language

**Date Requirements:**
- Use current seoul time for YYYY-MM-DD HH:mm:SS

**Tags Requirements:**
- Use specific technology names (e.g., "Rust", "PyTorch", "WebAssembly")
- Include domain tags (e.g., "AI", "Web Development", "Systems Programming")
- 3-7 tags recommended
