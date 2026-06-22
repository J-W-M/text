import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, MessageCircle, FileText, Users, Compass } from 'lucide-react';
import { StarParticles } from '@/components';

const features = [
  {
    icon: Calendar,
    title: '八字排盘',
    description: '精准计算您的生辰八字，揭示命运密码',
    path: '/birth-input',
    color: 'from-gold to-gold-400',
  },
  {
    icon: MessageCircle,
    title: 'AI对话',
    description: '智能命理顾问，为您答疑解惑',
    path: '/chat',
    color: 'from-primary to-primary-300',
  },
  {
    icon: FileText,
    title: '命理报告',
    description: '详尽的命理分析报告，洞察人生轨迹',
    path: '/report',
    color: 'from-gold-400 to-cream',
  },
  {
    icon: Compass,
    title: '运势预测',
    description: '大运流年分析，把握人生机遇',
    path: '/birth-input',
    color: 'from-primary-300 to-primary',
  },
  {
    icon: Users,
    title: '命理社区',
    description: '与同道中人交流，分享心得体会',
    path: '/community',
    color: 'from-gold to-primary',
  },
  {
    icon: Sparkles,
    title: '会员服务',
    description: '解锁更多高级功能，深度探索命理',
    path: '/profile',
    color: 'from-cream to-gold',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 星空粒子背景 */}
      <StarParticles count={80} className="opacity-60" />

      {/* Hero区域 */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/50 to-dark" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo动画 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold to-primary flex items-center justify-center shadow-glow-lg animate-float">
              <Sparkles className="w-12 h-12 text-dark" />
            </div>
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-gradient-gold">灵犀命理</span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-cream/80 text-xl md:text-2xl mb-8 font-serif"
          >
            探索命运密码，洞察人生轨迹
          </motion.p>

          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-cream/60 text-lg mb-12 max-w-2xl mx-auto"
          >
            融合传统命理智慧与现代AI技术，为您提供精准的八字排盘、
            运势分析和个性化命理咨询服务。
          </motion.p>

          {/* CTA按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/birth-input"
              className="btn-primary ripple text-lg px-8 py-4"
            >
              开始排盘
            </Link>
            <Link
              to="/chat"
              className="btn-secondary ripple text-lg px-8 py-4"
            >
              AI对话
            </Link>
          </motion.div>
        </div>

        {/* 滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-cream/50 text-sm flex flex-col items-center"
          >
            <span>探索更多</span>
            <div className="w-6 h-10 rounded-full border border-cream/30 mt-2 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-gold"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 功能导航区域 */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* 区域标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">核心功能</h2>
            <p className="section-subtitle">六大命理服务，全方位解读您的命运</p>
          </motion.div>

          {/* 六宫格布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={feature.path}
                  className="glass-card-hover p-6 h-full block group"
                >
                  {/* 图标 */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} 
                               flex items-center justify-center mb-4 group-hover:scale-110 
                               transition-transform shadow-glow`}
                  >
                    <feature.icon className="w-7 h-7 text-dark" />
                  </div>

                  {/* 标题 */}
                  <h3 className="card-title mb-2 group-hover:text-gold transition-colors">
                    {feature.title}
                  </h3>

                  {/* 描述 */}
                  <p className="text-cream/60 text-sm">{feature.description}</p>

                  {/* 悬停指示 */}
                  <div className="mt-4 flex items-center text-gold/60 group-hover:text-gold transition-colors">
                    <span className="text-sm">了解更多</span>
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 特色介绍 */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent to-dark-100/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">为什么选择灵犀命理</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '专业精准',
                content: '基于传统命理典籍，结合现代算法，确保排盘精准无误',
                icon: '🎯',
              },
              {
                title: '智能解读',
                content: 'AI深度学习命理知识，为您提供个性化、易懂的命理解读',
                icon: '🤖',
              },
              {
                title: '隐私保护',
                content: '严格保护您的个人信息，所有数据加密存储，安全可靠',
                icon: '🔒',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="card-title mb-3">{item.title}</h3>
                <p className="text-cream/60 text-sm">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="relative py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="font-serif text-lg text-cream">灵犀命理</span>
          </div>
          <p className="text-cream/50 text-sm mb-4">
            探索命运奥秘，开启智慧人生
          </p>
          <p className="text-cream/30 text-xs">
            © 2024 灵犀命理平台. 保留所有权利.
          </p>
        </div>
      </footer>
    </div>
  );
}