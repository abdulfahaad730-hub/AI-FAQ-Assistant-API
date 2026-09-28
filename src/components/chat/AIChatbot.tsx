import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  ExternalLink, 
  HelpCircle, 
  User,
  Zap,
  Info
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { sendChatMessage, ChatMessage } from '../../services/faqChatService';

const SUGGESTED_QUESTIONS = [
  'Is there a registration fee?',
  'Who can participate?',
  'How many members in a team?',
  'What are the prizes?',
  'What technologies can we use?',
  'Is it online or offline?',
];

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Greetings, Hacker! 🚀 I am the **Patrician Hackathon 2026 AI Assistant**.\n\nI can answer questions regarding:\n- **Eligibility & Team Size** (3–5 members, ₹100 fee/member)\n- **Tech Stacks & Allowed Frameworks**\n- **Prizes & Awards** (Over ₹1,00,000+ prize pool)\n- **Venue & Event Format**\n\nAsk me anything below, or click any suggested prompt!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(query, messages);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources,
        mode: response.mode
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue connecting to the AI knowledge base. Please try asking again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chat session refreshed. What would you like to know about **Patrician Hackathon 2026**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: []
      }
    ]);
  };

  // Helper to render text with markdown-like bold and links
  const renderFormattedText = (text: string) => {
    // Process markdown link syntax [label](url)
    const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|\n)/g);

    return parts.map((part, index) => {
      if (part === '\n') {
        return <br key={index} />;
      }
      
      // Bold text **bold**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }

      // Link [text](url)
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        if (url.startsWith('/')) {
          return (
            <Link
              key={index}
              to={url}
              onClick={() => setIsOpen(false)}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium inline-flex items-center gap-1"
            >
              {label}
              <ExternalLink className="w-3 h-3 inline" />
            </Link>
          );
        }
        return (
          <a
            key={index}
            href={url}
            onClick={() => {
              if (url.startsWith('#')) setIsOpen(false);
            }}
            className="text-cyan-400 hover:text-cyan-300 underline font-medium inline-flex items-center gap-1"
          >
            {label}
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      }

      return part;
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="relative group p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900 border border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_25px_rgba(0,217,255,0.4)] hover:shadow-[0_0_35px_rgba(0,217,255,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="Open AI FAQ Chatbot"
          >
            {/* Cyber pulsating glow ring */}
            <div className="absolute -inset-1 rounded-2xl bg-cyan-500/20 blur-sm group-hover:bg-cyan-400/30 transition-all duration-300 animate-pulse pointer-events-none" />

            {/* Status Beacon */}
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-950" />
            </span>

            {/* Icon */}
            <div className="relative flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="hidden sm:inline font-mono font-bold text-xs uppercase tracking-wider text-cyan-300 pr-1">
                AI FAQ
              </span>
            </div>

            {/* Hover Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-slate-900/95 border border-cyan-500/40 text-cyan-300 text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
              Ask Hackathon AI // 24/7 Intel
            </span>
          </button>
        )}
      </div>

      {/* Modern Cyberpunk Chatbot Panel */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-2 sm:right-6 z-50 w-[95vw] sm:w-[440px] max-w-[calc(100vw-1rem)] flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
          <GlassCard 
            glow="cyan" 
            className="w-full h-[580px] max-h-[85vh] flex flex-col overflow-hidden border-cyan-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(0,217,255,0.25)] bg-slate-950/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-950 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,217,255,0.3)]">
                  <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase flex items-center gap-1.5">
                      PCAS AI Assistant
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      RAG Active
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Patrician Hackathon 2026 Intel
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
                  aria-label="Reset Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize chatbot"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                  aria-label="Close Chat"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-start gap-2 max-w-[88%]">
                      {!isUser && (
                        <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,217,255,0.2)]">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all ${
                          isUser
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-[0_2px_12px_rgba(6,182,212,0.3)]'
                            : msg.isError
                            ? 'bg-red-950/60 border border-red-500/40 text-red-200 rounded-tl-none'
                            : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{renderFormattedText(msg.text)}</div>

                        {/* Grounding Source Badges */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-cyan-400/90">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Info className="w-3 h-3 text-cyan-400" />
                              Source:
                            </span>
                            {msg.sources.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[10px]"
                                title={s.question}
                              >
                                {s.category || 'FAQ'}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 px-8">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Loading Animation Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 max-w-[85%] animate-in fade-in duration-200">
                  <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900/90 border border-cyan-500/30 text-slate-300 text-xs flex items-center gap-2">
                    <span className="font-mono text-[11px] text-cyan-400 animate-pulse">
                      Analyzing knowledge base
                    </span>
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Question Chips (only shown early in conversation) */}
            {messages.length <= 3 && !isLoading && (
              <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 shrink-0">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-cyan-400" />
                  Suggested Questions:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-cyan-300 font-mono transition-all text-left cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-slate-900/90 border-t border-cyan-500/20 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about Patrician Hackathon..."
                  maxLength={1000}
                  disabled={isLoading}
                  className="flex-1 bg-slate-950/90 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] cursor-pointer shrink-0"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>Grounded RAG • Hallucination Free</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-cyan-400" />
                  Live FAQ Intel
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};
