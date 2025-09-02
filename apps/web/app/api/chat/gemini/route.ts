import { NextRequest, NextResponse } from 'next/server';
import GeminiService from '../../../../services/gemini.service';

// Initialize Gemini service
const geminiService = new GeminiService({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-pro',
  maxTokens: 2048,
  temperature: 0.7
});

// Initialize on first load
let initialized = false;

export async function POST(request: NextRequest) {
  try {
    // Initialize service if not already done
    if (!initialized) {
      await geminiService.initialize();
      initialized = true;
    }

    const body = await request.json();
    const { message, language = 'en', sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check for escalation request
    if (geminiService.detectEscalation(message)) {
      return NextResponse.json({
        type: 'escalation',
        message: language === 'fr'
          ? 'Je vais vous connecter avec un agent humain. Veuillez patienter...'
          : 'I\'ll connect you with a human agent. Please wait...',
        ticketSummary: geminiService.generateTicketSummary()
      });
    }

    // Get AI response
    const response = await geminiService.sendMessage(message, language);

    if (response.success) {
      return NextResponse.json({
        type: 'ai',
        message: response.message,
        remainingRequests: geminiService.getRemainingRequests()
      });
    } else {
      return NextResponse.json(
        { 
          type: 'error',
          error: response.error 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        type: 'error',
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    return NextResponse.json({
      history: geminiService.getHistory(),
      remainingRequests: geminiService.getRemainingRequests(),
      isConfigured: geminiService.isConfigured()
    });
  } catch (error) {
    console.error('Chat history API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Clear chat history
export async function DELETE(request: NextRequest) {
  try {
    geminiService.clearHistory();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Clear history API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}