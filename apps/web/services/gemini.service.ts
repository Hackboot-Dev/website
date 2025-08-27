// Gemini AI Integration Service
// This service handles communication with Google's Gemini API for AI chat support
// Using free tier credits with minimal consumption

interface GeminiConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GeminiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class GeminiService {
  private apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta';
  private model = 'gemini-pro';
  private maxTokens = 2048;
  private temperature = 0.7;
  private apiKey: string | null = null;
  private conversationHistory: ChatMessage[] = [];
  private dailyRequestCount = 0;
  private dailyRequestLimit = 1500; // Free tier limit

  constructor(config?: GeminiConfig) {
    if (config?.apiKey) {
      this.apiKey = config.apiKey;
    }
    if (config?.model) {
      this.model = config.model;
    }
    if (config?.maxTokens) {
      this.maxTokens = config.maxTokens;
    }
    if (config?.temperature) {
      this.temperature = config.temperature;
    }

    // Initialize with system context
    this.conversationHistory.push({
      role: 'system',
      content: `You are a helpful AI assistant for VMCloud, a cloud infrastructure provider. 
        You can help with:
        - Technical support for VPS, GPU servers, web hosting
        - Billing and account questions
        - Product information and recommendations
        - Troubleshooting common issues
        - API and integration guidance
        
        Be concise, professional, and helpful. If you cannot solve an issue, suggest escalating to human support.`
    });
  }

  // Initialize the service with API key from environment or config
  async initialize(): Promise<boolean> {
    try {
      // In production, get API key from environment variable
      this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || this.apiKey;
      
      if (!this.apiKey) {
        console.warn('Gemini API key not configured. Using mock mode.');
        return false;
      }

      // Test the connection
      const testResponse = await this.testConnection();
      return testResponse.success;
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      return false;
    }
  }

  // Test API connection
  private async testConnection(): Promise<GeminiResponse> {
    if (!this.apiKey) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/models/${this.model}`, {
        headers: {
          'x-goog-api-key': this.apiKey
        }
      });

      if (response.ok) {
        return { success: true, message: 'Connection successful' };
      } else {
        return { success: false, error: `Connection failed: ${response.statusText}` };
      }
    } catch (error) {
      return { success: false, error: `Connection error: ${error}` };
    }
  }

  // Send a message to Gemini and get response
  async sendMessage(message: string, language: 'en' | 'fr' = 'en'): Promise<GeminiResponse> {
    // Check daily limit
    if (this.dailyRequestCount >= this.dailyRequestLimit) {
      return {
        success: false,
        error: language === 'fr' 
          ? 'Limite quotidienne atteinte. Veuillez utiliser le support par ticket.'
          : 'Daily limit reached. Please use ticket support.'
      };
    }

    // If no API key, return mock response
    if (!this.apiKey) {
      return this.getMockResponse(message, language);
    }

    try {
      // Add user message to history
      this.conversationHistory.push({ role: 'user', content: message });

      // Prepare the request
      const requestBody = {
        contents: [{
          parts: [{
            text: this.buildPrompt(message, language)
          }]
        }],
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxTokens,
          topP: 0.8,
          topK: 10
        }
      };

      // Make API call
      const response = await fetch(
        `${this.apiEndpoint}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text || 'No response generated';

      // Add AI response to history
      this.conversationHistory.push({ role: 'assistant', content: aiResponse });
      
      // Increment request count
      this.dailyRequestCount++;

      return {
        success: true,
        message: aiResponse
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        success: false,
        error: language === 'fr'
          ? 'Erreur de connexion. Veuillez réessayer.'
          : 'Connection error. Please try again.'
      };
    }
  }

  // Build context-aware prompt
  private buildPrompt(message: string, language: 'en' | 'fr'): string {
    const languageInstruction = language === 'fr' 
      ? 'Réponds en français.'
      : 'Respond in English.';

    const context = this.conversationHistory.slice(-5) // Last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    return `${languageInstruction}

Previous context:
${context}

User message: ${message}

Provide a helpful, concise response. If the issue requires human intervention, suggest escalating to human support.`;
  }

  // Mock responses for testing without API key
  private getMockResponse(message: string, language: 'en' | 'fr'): GeminiResponse {
    const lowerMessage = message.toLowerCase();
    
    // Simulated smart responses based on keywords
    if (lowerMessage.includes('vps') || lowerMessage.includes('server')) {
      return {
        success: true,
        message: language === 'fr'
          ? 'Je peux vous aider avec votre VPS. Nos serveurs VPS offrent des performances élevées avec SSD NVMe, IPv4/IPv6, et un uptime de 99.9%. Quel aspect spécifique vous intéresse ?'
          : 'I can help you with VPS. Our VPS servers offer high performance with NVMe SSD, IPv4/IPv6, and 99.9% uptime. What specific aspect interests you?'
      };
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('prix')) {
      return {
        success: true,
        message: language === 'fr'
          ? 'Nos plans VPS commencent à 4.99€/mois pour 2 vCPU, 2GB RAM et 20GB SSD. Consultez notre page Produits pour voir tous les plans disponibles et leurs tarifs détaillés.'
          : 'Our VPS plans start at €4.99/month for 2 vCPU, 2GB RAM, and 20GB SSD. Check our Products page to see all available plans and detailed pricing.'
      };
    }

    if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('aide')) {
      return {
        success: true,
        message: language === 'fr'
          ? 'Notre équipe de support est disponible 24/7 via tickets, chat en direct (8h-22h UTC), et email. Les clients Business et Enterprise ont également accès au support téléphonique prioritaire.'
          : 'Our support team is available 24/7 via tickets, live chat (8am-10pm UTC), and email. Business and Enterprise customers also have access to priority phone support.'
      };
    }

    // Default response
    return {
      success: true,
      message: language === 'fr'
        ? 'Je comprends votre question. Pour vous fournir la meilleure assistance, pourriez-vous me donner plus de détails sur votre besoin spécifique ?'
        : 'I understand your question. To provide the best assistance, could you give me more details about your specific need?'
    };
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Keep system message
  }

  // Get conversation history
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  // Check if service is properly configured
  isConfigured(): boolean {
    return this.apiKey !== null;
  }

  // Get remaining daily requests
  getRemainingRequests(): number {
    return Math.max(0, this.dailyRequestLimit - this.dailyRequestCount);
  }

  // Reset daily counter (should be called daily via cron job)
  resetDailyCounter(): void {
    this.dailyRequestCount = 0;
  }

  // Detect if escalation to human is needed
  detectEscalation(message: string): boolean {
    const escalationKeywords = [
      'human', 'agent', 'person', 'talk to', 'speak to',
      'humain', 'agent', 'personne', 'parler à'
    ];
    
    const lowerMessage = message.toLowerCase();
    return escalationKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Generate ticket from conversation
  generateTicketSummary(): string {
    const messages = this.conversationHistory.slice(1); // Exclude system message
    const summary = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join('\n');
    
    return summary || 'No conversation history';
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export class for testing
export default GeminiService;