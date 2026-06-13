import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIAssistantPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your SNAPLINK AI assistant. How can I help optimize your links today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'I analyze your traffic and recommend updating the custom alias on your latest campaign for 20% better click-through rates.' 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan shadow-sm transition-shadow hover:shadow-sm"
      >
        <Bot className="h-6 w-6 text-slate-800" />
      </motion.button>

      {/* AI Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-8 z-50 w-80 sm:w-96 glass-premium flex flex-col overflow-hidden shadow-2xl border border-slate-200"
            style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-purple to-brand-cyan shadow-sm">
                  <Sparkles className="h-4 w-4 text-slate-800" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-slate-800 text-sm">SnapLink AI</h3>
                  <p className="text-[10px] text-blue-500 flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-slate-800 rounded-br-sm' 
                        : 'bg-slate-50 border border-slate-200 text-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 bg-[#f8fafc]/80 p-4 backdrop-blur-xl">
              <form onSubmit={handleSend} className="relative flex items-center">
                <button type="button" className="absolute left-3 text-slate-500 hover:text-blue-500 transition-colors">
                  <Command className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AI for insights..."
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-12 text-sm text-slate-800 placeholder-gray-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-bg-dark disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
