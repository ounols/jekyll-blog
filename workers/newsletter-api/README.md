# Newsletter API - Cloudflare Workers

Jekyll 블로그를 위한 이메일 구독 API 서버입니다.

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    blog.ounols.kr                           │
│  [구독 폼] → [Cloudflare Workers API] → [D1 Database]       │
│                         ↓                                    │
│                  [Resend API] → [이메일 발송]                │
└─────────────────────────────────────────────────────────────┘
```

## 설정 방법

### 1. Cloudflare 계정 설정

```bash
# Wrangler CLI 설치
npm install -g wrangler

# Cloudflare 로그인
wrangler login
```

### 2. D1 데이터베이스 생성

```bash
cd workers/newsletter-api

# 데이터베이스 생성
wrangler d1 create newsletter-subscribers

# 출력된 database_id를 wrangler.toml에 복사
# [[d1_databases]]
# binding = "DB"
# database_name = "newsletter-subscribers"
# database_id = "YOUR_DATABASE_ID"  ← 여기에 붙여넣기
```

### 3. 스키마 적용

```bash
# 로컬 테스트용
wrangler d1 execute newsletter-subscribers --local --file=./schema.sql

# 프로덕션
wrangler d1 execute newsletter-subscribers --file=./schema.sql
```

### 4. Resend API 설정

1. [Resend](https://resend.com) 가입
2. API Key 생성
3. 도메인 인증 (DNS 레코드 추가)
4. Workers에 시크릿 설정:

```bash
wrangler secret put RESEND_API_KEY
# 프롬프트에 API 키 입력
```

### 5. 배포

```bash
# 의존성 설치
npm install

# 로컬 개발
npm run dev

# 프로덕션 배포
npm run deploy
```

### 6. 커스텀 도메인 (선택)

Cloudflare 대시보드에서:
1. Workers & Pages → newsletter-api 선택
2. Settings → Triggers → Custom Domains
3. `newsletter-api.ounols.kr` 추가

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/subscribe` | 구독 신청 |
| GET | `/api/confirm/:token` | 구독 확인 |
| GET | `/api/unsubscribe/:token` | 구독 해지 |
| GET | `/api/stats` | 구독자 수 조회 |
| GET | `/api/admin/subscribers` | 구독자 목록 (인증 필요) |

## 환경 변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `BLOG_URL` | 블로그 URL | `https://blog.ounols.kr` |
| `FROM_EMAIL` | 발신 이메일 | `newsletter@ounols.kr` |
| `FROM_NAME` | 발신자 이름 | `Ounols Blog` |
| `RESEND_API_KEY` | Resend API 키 | `re_xxxxx` (시크릿) |

## 테스트

```bash
# 구독 테스트
curl -X POST https://newsletter-api.ounols.kr/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'

# 통계 조회
curl https://newsletter-api.ounols.kr/api/stats
```
