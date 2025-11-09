# URL-Based Posting Git Workflow

## GIT OPERATIONS (EXACT SEQUENCE)

**CRITICAL: Follow this exact order:**

### 1. Run import.sh script FIRST (BEFORE git commands)

```bash
./import.sh "_posts/[created-md-filename].md"
```

- This script downloads external images
- Saves them to `media/[md-filename]/`
- Updates markdown to use local image paths
- Fully automated process

### 2. Create a new branch

```bash
BRANCH_NAME="post/[slug-from-filename]"
git checkout -b "$BRANCH_NAME"
```

- Branch naming: `post/[slug]` (e.g., `post/awesome-ml-project`)
- Extract slug from filename (remove date prefix)

### 3. Git add

```bash
git add _posts/[created-md-filename].md
git add media/[md-filename-folder]/*
```

### 4. Git commit with proper format

```bash
git commit -m "feat(blog): Add [md-filename].md"
```

- Follow lint rules
- Format: `feat(blog): Add [filename].md`

### 5. Push branch to remote

```bash
git push origin "$BRANCH_NAME"
```

### 6. Create Pull Request using gh CLI

```bash
gh pr create \
  --title "feat(blog): Add [post-title]" \
  --assignee ounols \
  --body "## Summary

New blog post: [Post Title]

**Source URL**: [TARGET_URL]

## Changes
- Created: \`_posts/[filename].md\`
- Added images to: \`media/[folder]/\`

## Checklist
- [x] Content is technically accurate
- [x] Images processed through import.sh
- [x] All external links have {:target=\"_blank\"}
- [x] Korean writing style guidelines followed

🤖 Generated with Claude Code" \
  --base master \
  --head "$BRANCH_NAME"
```

### 7. Add Post Preview as PR Comment

After PR is created, add a comment with the post content preview:

```bash
# Get the PR number
PR_NUMBER=$(gh pr view --json number -q .number)

# Read the created post content
POST_CONTENT=$(cat _posts/[created-md-filename].md)

# Create preview comment
gh pr comment "$PR_NUMBER" --body "## 📝 Post Preview

<details>
<summary>Click to expand full post content</summary>

\`\`\`markdown
$POST_CONTENT
\`\`\`

</details>

---
Review the post content above before merging."
```

## ERROR HANDLING

**If import.sh fails:**
- Check script exists at repository root
- Verify markdown file path is correct
- Check if images are actually downloaded

**If git operations fail:**
- Verify all files are properly added
- Check commit message format
- Ensure branch was created successfully
- Check if branch name is valid (no special characters)

**If PR creation fails:**
- Verify `gh` CLI is available
- Check if branch was pushed successfully
- Ensure base branch (master) exists
- Verify GitHub permissions are correct
