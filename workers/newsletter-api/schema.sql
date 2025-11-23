-- Newsletter Subscribers Database Schema
-- Cloudflare D1 (SQLite)

-- 구독자 테이블
CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    confirmed INTEGER DEFAULT 0,  -- 0: 미확인, 1: 확인됨
    confirm_token TEXT UNIQUE,
    unsubscribe_token TEXT UNIQUE,
    categories TEXT DEFAULT '[]',  -- JSON array of subscribed categories
    created_at TEXT DEFAULT (datetime('now')),
    confirmed_at TEXT,
    last_sent_at TEXT
);

-- 이메일 발송 로그 테이블
CREATE TABLE IF NOT EXISTS email_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_id INTEGER NOT NULL,
    email_type TEXT NOT NULL,  -- 'confirmation', 'newsletter', 'unsubscribe'
    subject TEXT,
    sent_at TEXT DEFAULT (datetime('now')),
    status TEXT DEFAULT 'sent',  -- 'sent', 'failed', 'bounced'
    resend_id TEXT,  -- Resend API response ID
    FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);

-- 뉴스레터 발송 캠페인 테이블
CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    posts_included TEXT,  -- JSON array of post URLs
    created_at TEXT DEFAULT (datetime('now')),
    sent_at TEXT,
    recipients_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft'  -- 'draft', 'sending', 'sent'
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_confirmed ON subscribers(confirmed);
CREATE INDEX IF NOT EXISTS idx_subscribers_confirm_token ON subscribers(confirm_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token ON subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_email_logs_subscriber_id ON email_logs(subscriber_id);
