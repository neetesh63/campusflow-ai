import React, { useState, useRef, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiService } from '../services/aiService';
import { Sparkles, Send, Bot, User, AlertCircle, RefreshCw } from 'lucide-react';

export default function AIAssistantPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${user?.full_name?.split(' ')[0] || 'there'}! I am CampusFlow AI Assistant. Ask me anything about campus rules, assignment guidance, study tips, or platform navigation.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query || query.trim() === '') return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.sendChatMessage(query);
      if (res.success && res.data) {
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.data.aiResponse,
          source: res.data.source,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const errMsg = res.message || 'AI Service encountered an issue';
        toast.error(errMsg);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: `⚠️ AI Assistant Notice: ${errMsg}. Please check system connectivity or try again shortly.`,
          source: 'system-error',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      const errorDetail = err.message || err.data?.message || 'Failed to communicate with backend server';
      toast.error(errorDetail);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: `⚠️ Connection Notice: ${errorDetail}. Ensure your backend server is online and VITE_API_BASE_URL is configured.`,
        source: 'system-error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    "What is the minimum attendance required for end-semester exams?",
    "How can I file a hostel WiFi complaint ticket?",
    "Give me 3 active study tips for computer science exams.",
    "Explain how assignment submission grading works."
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-4rem)]">
          <PageHeader
            title="AI Campus Assistant"
            subtitle="Chat-based intelligent academic helper powered by Google Gemini API"
          />

          {/* Disclaimer Banner */}
          <div className="p-3 mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>CampusFlow AI Assistant provides guidance based on campus policies. Official mark disputes or administrative changes require verification with your department office.</span>
          </div>

          {/* Chat Window Container */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                      <span>{msg.timestamp}</span>
                      {msg.source && (
                        <span className="font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-900/40">
                          {msg.source === 'gemini-api' ? 'Gemini API' : 'Campus AI Engine'}
                        </span>
                      )}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Bot className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span>CampusFlow AI is generating response...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">Quick Ask:</span>
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 border border-slate-700/60 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask CampusFlow AI Assistant a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40 shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
