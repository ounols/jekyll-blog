# URL-Based Posting Quality Requirements

## TECHNICAL ACCURACY

- Provide technically accurate and reliable information
- Verify facts through additional searches if needed
- Do NOT guess or assume - search for confirmation

## VISUAL ELEMENTS

- **Actively use images** for topics and concepts
- Insert external images: `![Description](ImageURL)`
- If no suitable image exists, use WebSearch to find one
- Image with caption:
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

**Image Insertion Format:**
```markdown
![Image description](https://external-url.com/image.jpg)
```

**With Caption:**
```markdown
![Image description](https://external-url.com/image.jpg)
_Additional caption text if needed_
```

**Image Selection:**
- Find relevant images through WebSearch if needed
- Use official project screenshots and images from TARGET_URL site when available
- Ensure images illustrate the concept being discussed
