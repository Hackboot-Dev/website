// apps/web/app/api/telegram-notify/route.ts
// Description: Temporary Telegram notification endpoint
// Last modified: 2025-09-11
// Related docs: /docs/JOURNAL.md
// TEMPORARY SOLUTION - TO BE REPLACED WITH PROPER PAYMENT SYSTEM

import { NextRequest, NextResponse } from 'next/server';

// TEMPORARY CONFIG - Move to env vars in production
const TELEGRAM_BOT_TOKEN = '7666072565:AAEeHGz8XY6r-3UBeHjrN16cjcVSGkShWs4';
const TELEGRAM_CHAT_ID = '7497886508';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true,
      messageId: data.result?.message_id 
    });
    
  } catch (error) {
    console.error('Telegram notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}