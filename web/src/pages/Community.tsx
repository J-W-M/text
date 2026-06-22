import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, TrendingUp, Clock, Users } from 'lucide-react';
import { PostCard } from '@/components';

// 模拟帖子数据
const mockPosts = [
  {
    id: '1',
    title: '分享我的八字排盘体验',
    content: '今天第一次使用灵犀命理进行八字排盘，感觉非常专业准确。AI解读也很详细，让我对自己的命格有了更深入的了解。推荐给对命理感兴趣的朋友！',
    author: { id: '1', username: '命理爱好者' },
    tags: ['八字', '体验分享', '新手'],
    likes: 128,
    comments: 23,
    views: 456,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: '五行缺火如何补救？',
    content: '我的八字五行分析显示火元素较弱，想请教各位大神，在生活中应该如何补救？有没有什么具体的方法或建议？',
    author: { id: '2', username: '五行求学者' },
    tags: ['五行', '求问', '火'],
    likes: 56,
    comments: 45,
    views: 234,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: '2026年运势预测讨论',
    content: '根据大运流年分析，2026年丙午年对我来说是一个较为吉利的年份。想和大家讨论一下，你们今年的运势如何？有没有什么特别的感悟？',
    author: { id: '3', username: '运势观察者' },
    tags: ['流年', '2026', '运势'],
    likes: 89,
    comments: 67,
    views: 567,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: '命理与职业选择的关系',
    content: '通过八字分析，发现我的命格适合从事文化教育类工作。目前正在考虑职业转型，想听听大家的意见，命理分析对职业选择真的有帮助吗？',
    author: { id: '4', username: '职场探索者' },
    tags: ['职业', '命理应用', '讨论'],
    likes: 45,
    comments: 38,
    views: 189,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

const tabs = [
  { id: 'all', label: '全部', icon: Users },
  { id: 'hot', label: '热门', icon: TrendingUp },
  { id: 'new', label: '最新', icon: Clock },
];

export default function Community() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockPosts.filter((post) =>
    post.title.includes(searchQuery) || post.content.includes(searchQuery) || post.tags.some((tag) => tag.includes(searchQuery))
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="section-title">命理社区</h1>
          <p className="section-subtitle">与同道中人交流，分享心得体会</p>
        </motion.div>

        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索帖子..."
                className="input-field pl-10"
              />
            </div>

            {/* 发帖按钮 */}
            <button className="btn-primary ripple flex items-center gap-2">
              <Plus className="w-4 h-4" />
              发布帖子
            </button>
          </div>

          {/* 标签筛选 */}
          <div className="flex items-center gap-2 mt-4">
            <Filter className="w-4 h-4 text-cream/40" />
            <div className="flex flex-wrap gap-2">
              {['全部', '八字', '五行', '运势', '职业', '感情'].map((tag) => (
                <button
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tag === '全部'
                      ? 'bg-gold text-dark'
                      : 'bg-white/5 text-cream/70 hover:bg-white/10 hover:text-cream'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 标签页 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 mb-6"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'bg-white/5 text-cream/70 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* 帖子列表 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredPosts.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-cream/60 mb-4">暂无相关帖子</p>
                <button className="btn-secondary ripple">发布第一个帖子</button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  {...post}
                  onClick={() => console.log('查看帖子', post.id)}
                  onLike={() => console.log('点赞', post.id)}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* 加载更多 */}
        {filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button className="btn-secondary ripple">加载更多</button>
          </motion.div>
        )}

        {/* 热门话题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mt-8"
        >
          <h3 className="card-title mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            热门话题
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: '八字入门指南', posts: 156, trend: '+12%' },
              { title: '五行相生相克', posts: 89, trend: '+8%' },
              { title: '2026运势解读', posts: 67, trend: '+25%' },
              { title: '命理与职业', posts: 45, trend: '+5%' },
            ].map((topic) => (
              <div
                key={topic.title}
                className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <p className="text-cream font-medium">{topic.title}</p>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span className="text-cream/60">{topic.posts} 帖子</span>
                  <span className="text-green-500">{topic.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}