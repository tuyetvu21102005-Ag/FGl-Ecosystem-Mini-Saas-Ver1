'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Sparkles, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  tenantId: string;
  spaName?: string;
  primaryColor?: string;
}

export default function ChatWidget({ 
  tenantId, 
  spaName = 'Feel Great Life',
  primaryColor = '#7c3aed' 
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Chào bạn! Mình là trợ lý AI của ${spaName}. Bạn cần tư vấn về dịch vụ nào của Spa bên mình không? 😊`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Kiểm tra xem tin nhắn có chứa số điện thoại không (Regex cơ bản cho VN)
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    const foundPhone = inputValue.match(phoneRegex);

    try {
      // Gửi đến API DeepSeek
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Xin lỗi, mình đang gặp chút trục trặc. Bạn vui lòng thử lại sau nhé!',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Nếu tìm thấy SĐT và chưa capture lead
      if (foundPhone && !leadCaptured) {
        await captureLead(foundPhone[0], inputValue, messages.concat(userMessage, assistantMessage));
      }

    } catch (error) {
      console.error('Lỗi Chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const captureLead = async (phone: string, text: string, history: Message[]) => {
    try {
      await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          phone: phone,
          name: 'Khách hàng từ Chat',
          notes: `Khách quan tâm: ${text}`,
          messages: history.map(m => ({ role: m.role, content: m.content }))
        }),
      });
      setLeadCaptured(true);
    } catch (error) {
      console.error('Lỗi capture lead:', error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div 
              className="p-4 flex items-center justify-between text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{spaName} AI</h3>
                  <p className="text-[10px] opacity-80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Đang trực tuyến
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                    <p className={`text-[10px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Lead Status Bar */}
            {leadCaptured && (
              <div className="px-4 py-2 bg-green-50 text-green-700 text-[10px] flex items-center gap-2 border-t border-green-100">
                <CheckCircle2 size={12} />
                Thông tin của bạn đã được ghi nhận. Chuyên viên sẽ gọi cho bạn sớm nhất!
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md shadow-purple-200"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-center text-gray-400 mt-2">
                Powered by Feel Great Life AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all overflow-hidden relative group"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        
        {/* Notification badge */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
        )}
      </motion.button>
    </div>
  );
}
