import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { taskTitle, senderPhone, senderName } = await req.json();

  const OPENCLAW_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789';
  const OPENCLAW_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

  const message = `Hi ${senderName || 'there'}! 🐢 Just letting you know that *${taskTitle}* has been paid. Thanks!`;

  try {
    const res = await fetch(`${OPENCLAW_URL}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
      },
      body: JSON.stringify({
        channel: 'whatsapp',
        to: senderPhone,
        message,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
