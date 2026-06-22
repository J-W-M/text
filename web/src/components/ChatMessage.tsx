import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import type { Message } from '@/stores';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export default function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isUser = message.role === 'user';

  useEffect(() => {
    if (!isUser && !isTyping) {
      // 打字机效果
      setIsTypingEffect(true);
      let index = 0;
      const content = message.content;
      
      const timer = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(content.slice(0, index + 1));
          index++;
        } else {
          setIsTypingEffect(false);
          clearInterval(timer);
        }
      }, 30);

      return () => clearInterval(timer);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, isUser, isTyping]);

  // 自动滚动到底部
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [displayedContent]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      {/* 头像 */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-gold to-primary'
            : 'bg-gradient-to-br from-primary to-primary-300'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-dark" />
        ) : (
          <Sparkles className="w-5 h-5 text-cream" />
        )}
      </div>

      {/* 消息内容 */}
      <div
        className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}
      >
        <div
          className={`inline-block px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-gold to-gold-400 text-dark rounded-tr-sm'
              : 'glass-card rounded-tl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {isUser ? message.content : displayedContent}
            {isTypingEffect && (
              <span className="inline-block w-2 h-4 ml-1 bg-gold animate-pulse" />
            )}
          </p>
        </div>

        {/* 时间戳 */}
        <p
          className={`text-xs text-cream/40 mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}