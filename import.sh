#!/bin/bash
# filepath: process_markdown_images.sh

# Check if markdown file is provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <markdown_file_pattern>"
  echo "Examples:"
  echo "  $0 post.md"
  echo "  $0 '_posts/*.md'"
  echo "  $0 '_posts/2024-*.md'"
  exit 1
fi

# 단일 파일 처리 함수
process_single_file() {
  MD_FILE="$1"

  echo "========================================="
  echo "Processing: $MD_FILE"
  echo "========================================="

  if [ ! -f "$MD_FILE" ]; then
    echo "Error: File $MD_FILE does not exist"
    return 1
  fi

  # Extract filename from the filename (expected format: YYYY-MM-DD-title.md)
  FILENAME=$(basename "$MD_FILE" .md)

  # Create media directory if it doesn't exist
  MEDIA_DIR="media/$FILENAME"
  mkdir -p "$MEDIA_DIR"

  # Temporary files
  TEMP_FILE=$(mktemp)

  # Copy original file to temp
  cp "$MD_FILE" "$TEMP_FILE"

  # Process images
  FINAL_TEMP=$(mktemp)
  IMAGE_COUNTER=1

  # 이미지 URL과 새 파일명을 매핑하는 연관 배열 생성
  declare -A IMAGE_MAP

  while IFS= read -r line; do
    if [[ $line =~ !\[.*\]\((.*)\) ]] || [[ $line =~ image:\s*path:\s*(.*) ]]; then
      if [[ $line =~ !\[.*\]\((.*)\) ]]; then
        IMG_URL="${BASH_REMATCH[1]}"
      else
        IMG_URL="${BASH_REMATCH[1]}"
      fi

      # 원본 URL 저장 (다운로드용)
      ORIGINAL_URL="$IMG_URL"

      # 파일명 추출을 위해 쿼리 파라미터 제거
      IMG_URL=${IMG_URL%\?*}
      IMG_URL=${IMG_URL%\}*}
      IMG_URL=${IMG_URL%\)*}

      if [[ $IMG_URL == /media/$FILENAME/* ]]; then
        echo "$line" >>"$FINAL_TEMP"
        continue
      fi

      # 파일명과 확장자 추출
      IMG_EXTENSION="${IMG_URL##*.}"

      # 이미 처리된 URL인지 확인
      if [[ -n "${IMAGE_MAP[$ORIGINAL_URL]}" ]]; then
        # 이미 처리된 URL이면 저장된 새 파일명 사용
        NEW_IMG_FILENAME="${IMAGE_MAP[$ORIGINAL_URL]}"
      else
        # 새로운 URL이면 새 파일명 생성 (figure-N.확장자 형태)
        NEW_IMG_FILENAME="figure-${IMAGE_COUNTER}.${IMG_EXTENSION}"
        IMAGE_MAP[$ORIGINAL_URL]=$NEW_IMG_FILENAME

        # 실제 파일 복사/다운로드 (원본 URL 사용)
        if [[ $ORIGINAL_URL =~ ^https?:// ]]; then
          # 이미 파일이 존재하는지 확인
          if [ -f "$MEDIA_DIR/$NEW_IMG_FILENAME" ]; then
            echo "Skipping (already exists): $NEW_IMG_FILENAME"
          else
            # URL에서 도메인 추출
            DOMAIN=$(echo "$ORIGINAL_URL" | sed -E 's|^(https?://[^/]+).*|\1|')

            echo "Downloading: $ORIGINAL_URL -> $NEW_IMG_FILENAME"
            HTTP_CODE=$(curl -L -s -w "%{http_code}" -o "$MEDIA_DIR/$NEW_IMG_FILENAME" \
              -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
              -H "Referer: ${DOMAIN}/" \
              -H "Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" \
              --max-time 30 \
              --retry 3 \
              "$ORIGINAL_URL")

            if [ "$HTTP_CODE" != "200" ]; then
              echo "  WARNING: Failed to download (HTTP $HTTP_CODE)"
            fi
          fi
        else
          LOCAL_PATH=${ORIGINAL_URL#/}
          if [ -f "$LOCAL_PATH" ]; then
            if [ -f "$MEDIA_DIR/$NEW_IMG_FILENAME" ]; then
              echo "Skipping (already exists): $NEW_IMG_FILENAME"
            else
              echo "Copying: $LOCAL_PATH -> $NEW_IMG_FILENAME"
              cp "$LOCAL_PATH" "$MEDIA_DIR/$NEW_IMG_FILENAME"
            fi
          fi
        fi

        # 카운터 증가
        ((IMAGE_COUNTER++))
      fi

      NEW_PATH="/media/$FILENAME/$NEW_IMG_FILENAME"
      if [[ $line =~ !\[.*\]\((.*)\) ]]; then
        line=${line//$ORIGINAL_URL/$NEW_PATH}
      else
        line=${line//$ORIGINAL_URL/$NEW_PATH}
      fi
    fi
    echo "$line" >>"$FINAL_TEMP"
  done <"$TEMP_FILE"

  # Replace original file with processed content
  mv "$FINAL_TEMP" "$MD_FILE"

  # Cleanup temporary files
  rm -f "$TEMP_FILE"

  echo "Processing complete. Images have been saved to $MEDIA_DIR"
  echo ""
}

# 메인 로직: 와일드카드 또는 단일 파일 처리
FILE_PATTERN="$1"

# 파일 패턴 확장
shopt -s nullglob
FILES=($FILE_PATTERN)
shopt -u nullglob

if [ ${#FILES[@]} -eq 0 ]; then
  echo "Error: No files found matching pattern: $FILE_PATTERN"
  exit 1
fi

echo "Found ${#FILES[@]} file(s) to process"
echo ""

# 각 파일 순차 처리
for file in "${FILES[@]}"; do
  process_single_file "$file"
done

echo "========================================="
echo "All files processed successfully!"
echo "========================================="
