import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Trash2, Sparkles } from 'lucide-react';
import { useChatStore, useFortuneStore } from '@/stores';
import { ChatMessage, FiveElementsChart, Timeline } from '@/components';

export default function Chat() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    conversations,
    currentConversationId,
    createConversation,
    setCurrentConversation,
    addMessage,
    deleteConversation,
    getCurrentConversation,
  } = useChatStore();
  
  const { fiveElements, daYunList, liuNianList } = useFortuneStore();
  
  const currentConversation = getCurrentConversation();

  // 初始化对话
  useEffect(() => {
    if (!currentConversationId) {
      createConversation();
    }
  }, [currentConversationId, createConversation]);

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || !currentConversationId) return;

    // 添加用户消息
    addMessage(currentConversationId, {
      role: 'user',
      content: input.trim(),
    });

    setInput('');

    // 模拟AI响应
    setTimeout(() => {
      // 添加AI正在输入的消息
      addMessage(currentConversationId, {
        role: 'assistant',
        content: '',
        isTyping: true,
      });

      // 模拟AI回复
      const aiResponses = [
        '根据您的八字分析，您的命格以木为主，性格温和，富有创造力。在事业上适合从事文化、教育或创意类工作。',
        '从五行分布来看，您的命局中火元素较弱，建议在生活中多接触与火相关的事物，如阳光、红色等，以平衡五行。',
        '您目前处于第三大运（28-37岁），这是一个事业上升期。建议把握机会，积极进取，有望取得显著成就。',
        '2026年是丙午年，对您来说是一个较为吉利的年份。事业上可能会有新的突破，感情方面也有不错的机遇。',
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      // 更新AI消息内容
      setTimeout(() => {
        const conversation = getCurrentConversation();
        if (conversation) {
          const lastMessage = conversation.messages[conversation.messages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            addMessage(currentConversationId, {
              role: 'assistant',
              content: randomResponse,
            });
          }
        }
      }, 1000);
    }, 500);
  };

  // 新建对话
  const handleNewChat = () => {
    createConversation();
    setInput('');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* 左侧：对话列表和五行图表 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 对话列表 */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-cream font-medium">对话历史</h3>
                <button
                  onClick={handleNewChat}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="新建对话"
                >
                  <Plus className="w-4 h-4 text-gold" />
                </button>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                <AnimatePresence>
                  {conversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onClick={() => setCurrentConversation(conv.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        currentConversationId === conv.id
                          ? 'bg-gold/20 border border-gold/30'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-cream text-sm truncate">{conv.title}</p>
                      <p className="text-cream/40 text-xs mt-1">
                        {new Date(conv.updatedAt).toLocaleDateString('zh-CN')}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {conversations.length > 0 && (
                <button
                  onClick={() => deleteConversation(currentConversationId || '')}
                  className="mt-4 w-full p-2 rounded-lg bg-white/5 hover:bg-red-500/20 
                           text-cream/60 hover:text-red-400 text-sm transition-colors
                           flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  删除当前对话
                </button>
              )}
            </div>

            {/* 五行图表 */}
            {fiveElements && (
              <div className="glass-card p-4">
                <FiveElementsChart data={fiveElements} size={200} />
              </div>
            )}
          </div>

          {/* 中间：对话区域 */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 h-[calc(100vh-180px)] flex flex-col">
              {/* 对话标题 */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="card-title">AI命理顾问</h2>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {currentConversation?.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-primary 
                                   flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-dark" />
                    </div>
                    <p className="text-cream/60 mb-2">开始与AI命理顾问对话</p>
                    <p className="text-cream/40 text-sm">
                      您可以询问关于八字、运势、五行等方面的问题
                    </p>
                  </div>
                ) : (
                  <>
                    {currentConversation?.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* 输入区域 */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入您的问题..."
                  className="input-field flex-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="btn-primary ripple flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  发送
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：大运流年 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 大运时间轴 */}
            {daYunList.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="text-cream font-medium mb-4">大运走势</h3>
                <Timeline
                  variant="horizontal"
                  items={daYunList.map((dy) => ({
                    id: dy.id,
                    title: `${dy.heavenlyStem}${dy.earthlyBranch}`,
                    description: `${dy.startAge}-${dy.endAge}岁`,
                    date: dy.description,
                    status: dy.startAge <= 30 && dy.endAge >= 30 ? 'current' : 
                           dy.startAge < 30 ? 'completed' : 'upcoming',
                  }))}
                />
              </div>
            )}

            {/* 流年时间轴 */}
            {liuNianList.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="text-cream font-medium mb-4">流年运势</h3>
                <Timeline
                  items={liuNianList.map((ln) => ({
                    id: ln.id,
                    title: `${ln.year}年 ${ln.heavenlyStem}${ln.earthlyBranch}`,
                    description: ln.description,
                    status: ln.year === 2026 ? 'current' : 
                           ln.year < 2026 ? 'completed' : 'upcoming',
                  }))}
                />
              </div>
            )}

            {/* 快捷问题 */}
            <div className="glass-card p-4">
              <h3 className="text-cream font-medium mb-4">快捷问题</h3>
              <div className="space-y-2">
                {[
                  '我的性格特点是什么？',
                  '今年的运势如何？',
                  '适合从事什么职业？',
                  '感情运势怎么样？',
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => setInput(question)}
                    className="w-full p-2 text-left text-sm text-cream/70 hover:text-gold 
                             hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}