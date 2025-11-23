import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Types
interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  BLOG_URL: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
}

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  confirmed: number;
  confirm_token: string | null;
  unsubscribe_token: string | null;
  categories: string;
  created_at: string;
  confirmed_at: string | null;
  last_sent_at: string | null;
}

// Utility functions
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Email templates
function getConfirmationEmailHTML(name: string, confirmUrl: string, blogUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>구독 확인</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">@Ounols 블로그</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">뉴스레터 구독 확인</p>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>안녕하세요${name ? `, <strong>${name}</strong>님` : ''}!</p>

    <p>@Ounols 블로그 뉴스레터 구독을 신청해 주셔서 감사합니다.</p>

    <p>아래 버튼을 클릭하여 구독을 확인해 주세요:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${confirmUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">구독 확인하기</a>
    </div>

    <p style="color: #666; font-size: 14px;">버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣기 해주세요:</p>
    <p style="color: #666; font-size: 12px; word-break: break-all;">${confirmUrl}</p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="color: #999; font-size: 12px; text-align: center;">
      이 이메일을 요청하지 않으셨다면 무시하셔도 됩니다.<br>
      <a href="${blogUrl}" style="color: #667eea;">@Ounols 블로그 방문하기</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}

function getWelcomeEmailHTML(name: string, unsubscribeUrl: string, blogUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>구독 완료</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">환영합니다!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">구독이 완료되었습니다</p>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>안녕하세요${name ? `, <strong>${name}</strong>님` : ''}!</p>

    <p>@Ounols 블로그 뉴스레터 구독이 완료되었습니다.</p>

    <p>앞으로 새로운 글이 발행되면 이메일로 알려드리겠습니다. 게임 개발, 실시간 렌더링, 그리고 다양한 기술 이야기를 함께 나눠요!</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${blogUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">블로그 방문하기</a>
    </div>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="color: #999; font-size: 12px; text-align: center;">
      더 이상 이메일을 받고 싶지 않으시면 <a href="${unsubscribeUrl}" style="color: #667eea;">여기</a>를 클릭하여 구독을 해지할 수 있습니다.
    </p>
  </div>
</body>
</html>
  `.trim();
}

// Resend API helper
async function sendEmail(
  env: Env,
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json() as { id?: string; message?: string };

    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, id: data.id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Hono App
const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use(
  '*',
  cors({
    origin: ['https://blog.ounols.kr', 'https://ounols.kr', 'http://localhost:4000'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
);

// Health check
app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'newsletter-api' });
});

// Subscribe endpoint
app.post('/api/subscribe', async (c) => {
  const env = c.env;

  try {
    const body = await c.req.json<{ email: string; name?: string; categories?: string[] }>();
    const { email, name, categories = [] } = body;

    // Validation
    if (!email || !isValidEmail(email)) {
      return c.json({ success: false, error: '유효한 이메일 주소를 입력해주세요.' }, 400);
    }

    // Check if already subscribed
    const existing = await env.DB.prepare('SELECT * FROM subscribers WHERE email = ?')
      .bind(email.toLowerCase())
      .first<Subscriber>();

    if (existing) {
      if (existing.confirmed) {
        return c.json({ success: false, error: '이미 구독 중인 이메일입니다.' }, 400);
      }
      // Resend confirmation email
      const confirmUrl = `${env.BLOG_URL}/subscribe/confirm/?token=${existing.confirm_token}`;
      await sendEmail(
        env,
        email,
        '[@Ounols 블로그] 구독 확인',
        getConfirmationEmailHTML(name || '', confirmUrl, env.BLOG_URL)
      );
      return c.json({ success: true, message: '확인 이메일을 다시 발송했습니다. 이메일을 확인해주세요.' });
    }

    // Create new subscriber
    const confirmToken = generateToken();
    const unsubscribeToken = generateToken();

    await env.DB.prepare(
      `INSERT INTO subscribers (email, name, confirm_token, unsubscribe_token, categories)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(
        email.toLowerCase(),
        name || null,
        confirmToken,
        unsubscribeToken,
        JSON.stringify(categories)
      )
      .run();

    // Send confirmation email
    const confirmUrl = `${env.BLOG_URL}/subscribe/confirm/?token=${confirmToken}`;
    const emailResult = await sendEmail(
      env,
      email,
      '[@Ounols 블로그] 구독 확인',
      getConfirmationEmailHTML(name || '', confirmUrl, env.BLOG_URL)
    );

    if (!emailResult.success) {
      // Rollback on email failure
      await env.DB.prepare('DELETE FROM subscribers WHERE email = ?').bind(email.toLowerCase()).run();
      return c.json({ success: false, error: '이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.' }, 500);
    }

    // Log email
    const subscriber = await env.DB.prepare('SELECT id FROM subscribers WHERE email = ?')
      .bind(email.toLowerCase())
      .first<{ id: number }>();

    if (subscriber) {
      await env.DB.prepare(
        `INSERT INTO email_logs (subscriber_id, email_type, subject, resend_id) VALUES (?, ?, ?, ?)`
      )
        .bind(subscriber.id, 'confirmation', '구독 확인', emailResult.id || null)
        .run();
    }

    return c.json({ success: true, message: '확인 이메일을 발송했습니다. 이메일을 확인해주세요.' });
  } catch (error) {
    console.error('Subscribe error:', error);
    return c.json({ success: false, error: '서버 오류가 발생했습니다.' }, 500);
  }
});

// Confirm subscription endpoint
app.get('/api/confirm/:token', async (c) => {
  const env = c.env;
  const token = c.req.param('token');

  try {
    const subscriber = await env.DB.prepare('SELECT * FROM subscribers WHERE confirm_token = ?')
      .bind(token)
      .first<Subscriber>();

    if (!subscriber) {
      return c.json({ success: false, error: '유효하지 않은 토큰입니다.' }, 400);
    }

    if (subscriber.confirmed) {
      return c.json({ success: true, message: '이미 구독이 확인되었습니다.', alreadyConfirmed: true });
    }

    // Confirm subscription
    await env.DB.prepare(
      `UPDATE subscribers SET confirmed = 1, confirmed_at = datetime('now') WHERE id = ?`
    )
      .bind(subscriber.id)
      .run();

    // Send welcome email
    const unsubscribeUrl = `${env.BLOG_URL}/unsubscribe/?token=${subscriber.unsubscribe_token}`;
    await sendEmail(
      env,
      subscriber.email,
      '[@Ounols 블로그] 구독을 환영합니다!',
      getWelcomeEmailHTML(subscriber.name || '', unsubscribeUrl, env.BLOG_URL)
    );

    return c.json({ success: true, message: '구독이 확인되었습니다. 환영합니다!' });
  } catch (error) {
    console.error('Confirm error:', error);
    return c.json({ success: false, error: '서버 오류가 발생했습니다.' }, 500);
  }
});

// Unsubscribe endpoint
app.get('/api/unsubscribe/:token', async (c) => {
  const env = c.env;
  const token = c.req.param('token');

  try {
    const subscriber = await env.DB.prepare('SELECT * FROM subscribers WHERE unsubscribe_token = ?')
      .bind(token)
      .first<Subscriber>();

    if (!subscriber) {
      return c.json({ success: false, error: '유효하지 않은 토큰입니다.' }, 400);
    }

    // Delete subscriber
    await env.DB.prepare('DELETE FROM subscribers WHERE id = ?').bind(subscriber.id).run();

    return c.json({ success: true, message: '구독이 해지되었습니다.' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return c.json({ success: false, error: '서버 오류가 발생했습니다.' }, 500);
  }
});

// Get subscriber count (for display)
app.get('/api/stats', async (c) => {
  const env = c.env;

  try {
    const result = await env.DB.prepare('SELECT COUNT(*) as count FROM subscribers WHERE confirmed = 1').first<{
      count: number;
    }>();

    return c.json({ success: true, subscribers: result?.count || 0 });
  } catch (error) {
    return c.json({ success: true, subscribers: 0 });
  }
});

// Admin: Get all confirmed subscribers (for newsletter sending)
// This endpoint should be protected in production
app.get('/api/admin/subscribers', async (c) => {
  const env = c.env;
  const authHeader = c.req.header('Authorization');

  // Simple API key auth
  if (authHeader !== `Bearer ${env.RESEND_API_KEY}`) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  try {
    const subscribers = await env.DB.prepare(
      'SELECT id, email, name, categories, created_at FROM subscribers WHERE confirmed = 1'
    ).all<Subscriber>();

    return c.json({ success: true, subscribers: subscribers.results });
  } catch (error) {
    console.error('Admin subscribers error:', error);
    return c.json({ success: false, error: '서버 오류가 발생했습니다.' }, 500);
  }
});

export default app;
