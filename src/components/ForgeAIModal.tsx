import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User as UserIcon, LifeBuoy, Languages, ArrowRight } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

interface ForgeAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSupport: () => void;
  currentProjectId?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestSupport?: boolean;
}

export const ForgeAIModal: React.FC<ForgeAIModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSupport,
  currentProjectId,
}) => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste ${user?.name ? user.name.split(' ')[0] : 'Builder'}! I am **ForgeAI**, your assistant on BuildSkillForge.

I can guide you in **English, Hindi, or Hinglish** on:
- 🏆 Joining competitions & winning Skill Passport badges
- 💼 Browsing and applying to local business projects
- 🚀 Posting projects and reviewing verified student talent
- ⚡ Submitting deliverables & milestone approvals
- 💳 Payment escrow release & the transparent 10% fee breakdown

How can I assist you right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Tournament kaise join karu?',
    'Mera project submit nahi ho raha',
    'How can I post a project as a business?',
    'Explain the 10% platform fee with example',
    'How do I improve my Skill Passport score?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.askAI(textToSend.trim(), currentProjectId);
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestSupport: res.suggestSupport,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          text: 'Apologies, I encountered a temporary connection glitch. Please try again or open a support ticket if urgent.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestSupport: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col h-[85vh] max-h-[640px] w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">ForgeAI Assistant</h3>
                <span className="flex items-center gap-1 rounded bg-orange-100 dark:bg-orange-950/50 px-1.5 py-0.2 text-[10px] font-semibold text-orange-700 dark:text-orange-400">
                  <Languages className="h-3 w-3" />
                  English / Hindi / Hinglish
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ground knowledge on projects, competitions & payments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {m.sender === 'user' ? <UserIcon className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-orange-500" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-tr-none'
                    : 'bg-slate-100/90 text-slate-800 dark:bg-slate-800/80 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`mt-1 text-[10px] ${
                    m.sender === 'user' ? 'text-orange-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>

                {m.suggestSupport && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToSupport();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 hover:underline"
                    >
                      <LifeBuoy className="h-3.5 w-3.5" />
                      Create a Support Ticket for Human Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Sparkles className="h-4 w-4 text-orange-500 animate-spin" />
              </div>
              <div className="rounded-2xl rounded-tl-none border border-slate-200/50 bg-slate-100/90 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-slate-400">
                ForgeAI is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 shrink-0">Try asking:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything in English, Hindi, or Hinglish..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Powered by Gemini · Grounded in BuildSkillForge verified policies</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Safe Server-Side AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
