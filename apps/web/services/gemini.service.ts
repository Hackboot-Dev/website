// /workspaces/website/apps/web/services/gemini.service.ts
// Description: Service for Google Gemini AI API integration
// Last modified: 2025-08-31
// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

export interface GeminiConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SendMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class GeminiService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;
  private history: ChatMessage[] = [];
  private requestCount = 0;
  private maxRequests = 100;

  constructor(config: GeminiConfig = {}) {
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || '';
    this.model = config.model || 'gemini-pro';
    this.maxTokens = config.maxTokens || 2048;
    this.temperature = config.temperature || 0.7;
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
  }

  async initialize(): Promise<void> {
    // Initialization logic if needed
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY is not configured');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  detectEscalation(message: string): boolean {
    const escalationKeywords = [
      'human', 'agent', 'representative', 'talk to someone',
      'humain', 'agent', 'représentant', 'parler à quelqu\'un',
      'real person', 'personne réelle', 'help', 'aide'
    ];

    const lowerMessage = message.toLowerCase();
    return escalationKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  generateTicketSummary(): string {
    const recentMessages = this.history.slice(-5);
    return recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  }

  async sendMessage(message: string, language: string = 'en'): Promise<SendMessageResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'GEMINI_API_KEY is not configured'
      };
    }

    try {
      // Add user message to history
      this.history.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Prepare context with language preference
      const systemContext = language === 'fr' 
        ? "Tu es un assistant IA serviable qui répond en français. Tu aides avec les questions techniques et le support client."
        : "You are a helpful AI assistant. You help with technical questions and customer support.";

      // Build conversation context
      const conversationContext = this.history.slice(-10).map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

      const fullPrompt = `${systemContext}\n\nConversation:\n${conversationContext}`;

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: this.temperature,
            topK: 1,
            topP: 1,
            maxOutputTokens: this.maxTokens,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      const data: GeminiResponse = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error.message
        };
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        return {
          success: false,
          error: 'No response generated from Gemini'
        };
      }

      // Add assistant response to history
      this.history.push({
        role: 'assistant',
        content: text,
        timestamp: new Date()
      });

      this.requestCount++;

      return {
        success: true,
        message: text
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  getHistory(): ChatMessage[] {
    return this.history;
  }

  clearHistory(): void {
    this.history = [];
  }

  getRemainingRequests(): number {
    return Math.max(0, this.maxRequests - this.requestCount);
  }

  async streamContent(prompt: string): Promise<ReadableStream> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await fetch(`${this.apiUrl}?key=${this.apiKey}&alt=sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: this.temperature,
          topK: 1,
          topP: 1,
          maxOutputTokens: this.maxTokens,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    return response.body!;
  }
}

export default GeminiService;