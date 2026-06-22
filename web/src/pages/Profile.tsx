import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Star, Award, Calendar, Settings, ChevronRight, Edit } from 'lucide-react';
import { useUserStore, useFortuneStore } from '@/stores';
import { BadgeDisplay } from '@/components';

export default function Profile() {
  const { user, profile, isAuthenticated } = useUserStore();
  const { birthInfo, baZi } = useFortuneStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center py-20">
          <h1 className="section-title mb-4">请先登录</h1>
          <p className="text-cream/60 mb-8">登录后查看您的个人信息</p>
          <Link to="/login" className="btn-primary ripple">
            立即登录
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: '积分', value: user.points, icon: Star, color: 'text-gold' },
    { label: '等级', value: `Lv.${user.level}`, icon: Award, color: 'text-primary-300' },
    { label: '勋章', value: user.badges.length, icon: Award, color: 'text-cream' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="section-title">用户中心</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：个人信息 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* 用户卡片 */}
            <div className="glass-card p-6 text-center">
              {/* 头像 */}
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold to-primary 
                             flex items-center justify-center shadow-glow mb-4">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-dark" />
                )}
              </div>

              {/* 用户名 */}
              <h2 className="font-serif text-xl text-cream mb-2">{user.username}</h2>
              <p className="text-cream/60 text-sm mb-4">{user.email}</p>

              {/* 编辑按钮 */}
              <button className="btn-secondary ripple text-sm flex items-center gap-2 mx-auto">
                <Edit className="w-4 h-4" />
                编辑资料
              </button>
            </div>

            {/* 统计数据 */}
            <div className="glass-card p-6">
              <h3 className="text-cream font-medium mb-4">个人统计</h3>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-cream/70">{stat.label}</span>
                    </div>
                    <span className="text-cream font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="glass-card p-6">
              <h3 className="text-cream font-medium mb-4">快捷操作</h3>
              <div className="space-y-2">
                {[
                  { label: '账户设置', icon: Settings, path: '/settings' },
                  { label: '我的报告', icon: Calendar, path: '/report' },
                  { label: '对话历史', icon: Calendar, path: '/chat' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="flex items-center justify-between p-3 rounded-lg 
                             bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-cream/60" />
                      <span className="text-cream/80 group-hover:text-cream">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cream/40 group-hover:text-gold transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右侧：详细信息 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* 勋章展示 */}
            <div className="glass-card p-6">
              <h3 className="card-title mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" />
                我的勋章
              </h3>
              <BadgeDisplay badges={user.badges} showDetails />
            </div>

            {/* 生辰信息 */}
            {birthInfo && (
              <div className="glass-card p-6">
                <h3 className="card-title mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  生辰信息
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-cream/60 text-sm mb-1">出生日期</p>
                    <p className="text-cream font-medium">
                      {birthInfo.year}年{birthInfo.month}月{birthInfo.day}日
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-cream/60 text-sm mb-1">出生时间</p>
                    <p className="text-cream font-medium">
                      {birthInfo.hour}时{birthInfo.minute}分
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-cream/60 text-sm mb-1">性别</p>
                    <p className="text-cream font-medium">
                      {birthInfo.gender === 'male' ? '男' : '女'}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-cream/60 text-sm mb-1">出生地</p>
                    <p className="text-cream font-medium">{birthInfo.location}</p>
                  </div>
                </div>

                {baZi && (
                  <div className="mt-4 p-4 bg-white/5 rounded-xl">
                    <p className="text-cream/60 text-sm mb-2">八字</p>
                    <div className="flex items-center gap-4">
                      {[
                        baZi.yearPillar,
                        baZi.monthPillar,
                        baZi.dayPillar,
                        baZi.hourPillar,
                      ].map((pillar, index) => (
                        <div key={index} className="text-center">
                          <div className="text-cream font-serif text-lg">
                            {pillar.heavenlyStem}
                          </div>
                          <div className="text-cream/60 font-serif text-lg">
                            {pillar.earthlyBranch}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <Link
                    to="/birth-input"
                    className="btn-secondary ripple text-sm flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    修改生辰信息
                  </Link>
                </div>
              </div>
            )}

            {/* 积分详情 */}
            <div className="glass-card p-6">
              <h3 className="card-title mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-gold" />
                积分详情
              </h3>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gold mb-2">{user.points}</div>
                <p className="text-cream/60">当前积分</p>
              </div>
              <div className="space-y-3">
                {[
                  { action: '完成八字排盘', points: '+100', time: '今天' },
                  { action: '生成命理报告', points: '+50', time: '昨天' },
                  { action: '社区互动', points: '+10', time: '3天前' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-cream">{item.action}</p>
                      <p className="text-cream/40 text-xs">{item.time}</p>
                    </div>
                    <span className="text-green-500 font-medium">{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}