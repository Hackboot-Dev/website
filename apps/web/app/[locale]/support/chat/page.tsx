'use client';

import { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageContext } from '../../../../contexts/LanguageContext';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  SparklesIcon,
  PaperClipIcon,
  MicrophoneIcon,
  FaceSmileIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const translations = {
  en: {
    hero: {
      badge: 'LIVE SUPPORT',
      title: 'AI-Powered Chat Support',
      subtitle: 'Get instant help from our intelligent assistant',
      description: 'Our AI assistant powered by Gemini provides instant responses to your questions. For complex issues, connect with our human support team.',
      startChat: 'Start Conversation',
      poweredBy: 'Powered by Gemini AI'
    },
    chat: {
      welcome: 'Hello! I\'m your AI assistant powered by Gemini. How can I help you today?',
      placeholder: 'Type your message...',
      typing: 'AI is typing...',
      connectionStatus: 'Connected',
      attachFile: 'Attach file',
      voiceInput: 'Voice input',
      emoji: 'Add emoji',
      options: 'Options'
    },
    suggestions: [
      'How do I upgrade my plan?',
      'I need help with SSH access',
      'What\'s the difference between VPS plans?',
      'How to configure load balancer?'
    ],
    status: {
      online: 'Online',
      typing: 'Typing',
      away: 'Away'
    },
    actions: {
      endChat: 'End Chat',
      emailTranscript: 'Email Transcript',
      escalate: 'Talk to Human',
      minimize: 'Minimize',
      maximize: 'Maximize'
    },
    messages: {
      aiGreeting: 'Hi! I\'m powered by Gemini AI. I can help you with technical questions, account issues, billing inquiries, and more. What can I assist you with today?',
      humanHandoff: 'I\'ll connect you with a human agent. Please wait a moment...',
      chatEnded: 'Chat session has ended. Thank you for contacting us!',
      rateExperience: 'How was your experience?'
    }
  },
  fr: {
    hero: {
      badge: 'SUPPORT EN DIRECT',
      title: 'Support Chat IA',
      subtitle: 'Obtenez une aide instantanée de notre assistant intelligent',
      description: 'Notre assistant IA propulsé par Gemini fournit des réponses instantanées à vos questions. Pour des problèmes complexes, connectez-vous avec notre équipe de support humain.',
      startChat: 'Démarrer la Conversation',
      poweredBy: 'Propulsé par Gemini AI'
    },
    chat: {
      welcome: 'Bonjour ! Je suis votre assistant IA propulsé par Gemini. Comment puis-je vous aider aujourd\'hui ?',
      placeholder: 'Tapez votre message...',
      typing: 'L\'IA écrit...',
      connectionStatus: 'Connecté',
      attachFile: 'Joindre un fichier',
      voiceInput: 'Entrée vocale',
      emoji: 'Ajouter emoji',
      options: 'Options'
    },
    suggestions: [
      'Comment mettre à niveau mon plan ?',
      'J\'ai besoin d\'aide avec l\'accès SSH',
      'Quelle est la différence entre les plans VPS ?',
      'Comment configurer le load balancer ?'
    ],
    status: {
      online: 'En ligne',
      typing: 'En train d\'écrire',
      away: 'Absent'
    },
    actions: {
      endChat: 'Terminer le Chat',
      emailTranscript: 'Envoyer la Transcription',
      escalate: 'Parler à un Humain',
      minimize: 'Réduire',
      maximize: 'Agrandir'
    },
    messages: {
      aiGreeting: 'Bonjour ! Je suis propulsé par Gemini AI. Je peux vous aider avec des questions techniques, des problèmes de compte, des demandes de facturation, et plus encore. Comment puis-je vous assister aujourd\'hui ?',
      humanHandoff: 'Je vais vous connecter avec un agent humain. Veuillez patienter un moment...',
      chatEnded: 'La session de chat est terminée. Merci de nous avoir contactés !',
      rateExperience: 'Comment était votre expérience ?'
    }
  }
};

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export default function ChatPage() {
  const router = useRouter();
  const { language } = useContext(LanguageContext);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartChat = () => {
    setIsOpen(true);
    setMessages([
      {
        id: '1',
        type: 'system',
        content: t.messages.aiGreeting,
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (in production, this would call Gemini API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev.map(m => 
        m.id === userMessage.id ? { ...m, status: 'sent' } : m
      ), aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    // Simulated responses - in production, this would use Gemini API
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('upgrade') || lowerQuery.includes('plan')) {
      return language === 'fr' 
        ? 'Pour mettre à niveau votre plan, connectez-vous à votre tableau de bord et accédez à la section "Facturation". Vous y trouverez toutes les options de mise à niveau disponibles avec une comparaison détaillée des fonctionnalités.'
        : 'To upgrade your plan, log into your dashboard and navigate to the "Billing" section. You\'ll find all available upgrade options with detailed feature comparisons.';
    }
    
    if (lowerQuery.includes('ssh') || lowerQuery.includes('connect')) {
      return language === 'fr'
        ? 'Pour vous connecter via SSH, utilisez: ssh user@your-server-ip. Vous trouverez vos identifiants SSH dans votre tableau de bord sous "Accès Serveur". Besoin d\'aide supplémentaire avec SSH ?'
        : 'To connect via SSH, use: ssh user@your-server-ip. You can find your SSH credentials in your dashboard under "Server Access". Need more help with SSH?';
    }

    if (lowerQuery.includes('human') || lowerQuery.includes('agent')) {
      return t.messages.humanHandoff;
    }

    return language === 'fr'
      ? 'Je comprends votre question. Permettez-moi de vous aider avec cela. Pouvez-vous me donner plus de détails sur votre situation spécifique ?'
      : 'I understand your question. Let me help you with that. Can you provide more details about your specific situation?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      {!isOpen && (
        <section 
          className="relative pt-32 pb-20 px-4 overflow-hidden"
          style={{ 
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 blur-3xl rounded-full" />
          
          <div className="max-w-7xl mx-auto relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4" />
              {t.hero.badge}
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-xl text-zinc-400 mb-4 max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
            
            <p className="text-base text-zinc-500 max-w-3xl mx-auto mb-8">
              {t.hero.description}
            </p>

            <button
              onClick={handleStartChat}
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-3 mx-auto"
            >
              <ChatIcon className="w-5 h-5" />
              {t.hero.startChat}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs">
                <SparklesIcon className="w-3 h-3" />
                {t.hero.poweredBy}
              </div>
            </button>

            {/* Suggestions */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-zinc-500">Popular questions:</span>
              {t.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleStartChat();
                    setTimeout(() => setInputValue(suggestion), 500);
                  }}
                  className="px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className={`fixed inset-4 md:inset-auto md:right-8 md:bottom-8 md:w-[450px] md:h-[600px] z-50 transition-all duration-300 ${
            isMinimized ? 'md:h-[60px]' : ''
          }`}
        >
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
            <div className="relative h-full bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-zinc-800 flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-900" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Gemini Assistant</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      {t.status.online}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {isMinimized ? <MaximizeIcon className="w-4 h-4" /> : <MinimizeIcon className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`px-4 py-2 rounded-2xl ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : message.type === 'ai'
                              ? 'bg-zinc-800 text-zinc-200'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {message.content}
                          </div>
                          <div className="flex items-center gap-1 mt-1 px-2">
                            <span className="text-xs text-zinc-500">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.type === 'user' && message.status && (
                              <span className="text-xs">
                                {message.status === 'sent' ? (
                                  <CheckCircleIcon className="w-3 h-3 text-green-400" />
                                ) : (
                                  <ClockIcon className="w-3 h-3 text-zinc-500" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-zinc-800 px-4 py-2 rounded-2xl">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <PaperClipIcon className="w-5 h-5" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={t.chat.placeholder}
                          className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <MicIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={handleSendMessage}
                        className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                      >
                        <SendIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}