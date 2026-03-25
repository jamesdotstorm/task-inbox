import { NextRequest, NextResponse } from 'next/server';

const SEND_URL = process.env.OPENCLAW_SEND_URL || '';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

export async function POST(req: NextRequest) {
  const { taskTitle, senderPhone, senderName } = await req.json();

  if (!senderPhone) {
    return NextResponse.json({ ok: false, error: 'No sender phone' }, { status: 400 });
  }

  const message = `Hi ${senderName || 'there'}! 🐢 Just letting you know that *${taskTitle}* has been paid. Thanks!`;

  try {
    const res = await fetch(`${SEND_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      },
      body: JSON.stringify({ channel: 'whatsapp', to: senderPhone, message }),
      signal: AbortSignal.timeout(10000),
    });

    const result = await res.json();
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
