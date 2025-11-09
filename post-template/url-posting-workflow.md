# URL-Based Posting Workflow

## DATA COLLECTION (MANDATORY)

**Primary Method:**
- Use WebFetch tool to retrieve content from `TARGET_URL`

**Fallback Method (if primary fails):**
```python
import requests
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
response = requests.get(TARGET_URL, headers=headers)
# Parse and extract content
```

**Additional Requirements:**
- If content spans multiple pages, collect ALL pages
- If page content is insufficient, use WebSearch tool for supplementary information
- Ensure complete data collection before proceeding

## ERROR HANDLING

**If WebFetch fails:**
- Try Python requests with custom User-Agent
- Try alternative search for the content
- Report if completely inaccessible

**If content is incomplete:**
- Use WebSearch to find additional information
- Cross-reference multiple sources
- Ensure technical accuracy before writing
