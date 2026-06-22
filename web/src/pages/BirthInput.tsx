import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, ChevronRight, Sparkles } from 'lucide-react';
import { useFortuneStore } from '@/stores';
import { BaZiVisualization, FiveElementsChart, Loading } from '@/components';

export default function BirthInput() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    gender: 'male' | 'female';
    location: string;
  }>({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    gender: 'male',
    location: '北京',
  });
  
  const { birthInfo, baZi, fiveElements, isLoading, setBirthInfo, calculateBaZi } = useFortuneStore();

  const handleSubmit = async () => {
    setBirthInfo(formData);
    await calculateBaZi();
    setStep(3);
  };

  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="section-title">生辰八字录入</h1>
          <p className="section-subtitle">输入您的出生信息，获取精准的八字排盘</p>
        </motion.div>

        {/* 步骤指示器 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center gap-2 ${
                step >= s ? 'text-gold' : 'text-cream/40'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s
                    ? 'bg-gold text-dark'
                    : 'bg-white/10 text-cream/40'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <ChevronRight className={`w-4 h-4 ${step > s ? 'text-gold' : 'text-cream/20'}`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* 步骤1：基本信息 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
            <h2 className="card-title mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              出生日期
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 年份 */}
              <div>
                <label className="block text-cream/70 mb-2">年份</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="input-field"
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="bg-dark text-cream">
                      {y}年
                    </option>
                  ))}
                </select>
              </div>

              {/* 月份 */}
              <div>
                <label className="block text-cream/70 mb-2">月份</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  className="input-field"
                >
                  {months.map((m) => (
                    <option key={m} value={m} className="bg-dark text-cream">
                      {m}月
                    </option>
                  ))}
                </select>
              </div>

              {/* 日期 */}
              <div>
                <label className="block text-cream/70 mb-2">日期</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                  className="input-field"
                >
                  {days.map((d) => (
                    <option key={d} value={d} className="bg-dark text-cream">
                      {d}日
                    </option>
                  ))}
                </select>
              </div>

              {/* 性别 */}
              <div>
                <label className="block text-cream/70 mb-2">性别</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                    className={`flex-1 px-4 py-3 rounded-lg transition-all ${
                      formData.gender === 'male'
                        ? 'bg-gold text-dark'
                        : 'bg-white/5 text-cream hover:bg-white/10'
                    }`}
                  >
                    <User className="w-4 h-4 mx-auto mb-1" />
                    男
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                    className={`flex-1 px-4 py-3 rounded-lg transition-all ${
                      formData.gender === 'female'
                        ? 'bg-gold text-dark'
                        : 'bg-white/5 text-cream hover:bg-white/10'
                    }`}
                  >
                    <User className="w-4 h-4 mx-auto mb-1" />
                    女
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="btn-primary ripple"
              >
                下一步
              </button>
            </div>
          </motion.div>
        )}

        {/* 步骤2：详细时间 */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
            <h2 className="card-title mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" />
              出生时间
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 时辰 */}
              <div>
                <label className="block text-cream/70 mb-2">时辰（小时）</label>
                <select
                  value={formData.hour}
                  onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) })}
                  className="input-field"
                >
                  {hours.map((h) => (
                    <option key={h} value={h} className="bg-dark text-cream">
                      {h.toString().padStart(2, '0')}时
                    </option>
                  ))}
                </select>
              </div>

              {/* 分钟 */}
              <div>
                <label className="block text-cream/70 mb-2">分钟</label>
                <select
                  value={formData.minute}
                  onChange={(e) => setFormData({ ...formData, minute: parseInt(e.target.value) })}
                  className="input-field"
                >
                  {minutes.map((m) => (
                    <option key={m} value={m} className="bg-dark text-cream">
                      {m.toString().padStart(2, '0')}分
                    </option>
                  ))}
                </select>
              </div>

              {/* 出生地 */}
              <div className="md:col-span-2">
                <label className="block text-cream/70 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  出生地
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="请输入出生城市"
                  className="input-field"
                />
              </div>
            </div>

            {/* 信息预览 */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <p className="text-cream/70 text-sm mb-2">您的生辰信息：</p>
              <p className="text-cream font-medium">
                {formData.year}年{formData.month}月{formData.day}日 
                {formData.hour.toString().padStart(2, '0')}时{formData.minute.toString().padStart(2, '0')}分
                · {formData.gender === 'male' ? '男' : '女'}
                · {formData.location}
              </p>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="btn-ghost"
              >
                返回上一步
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-primary ripple flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loading text="" />
                    <span>计算中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>开始排盘</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* 步骤3：排盘结果 */}
        {step === 3 && baZi && fiveElements && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* 八字排盘 */}
            <div className="glass-card p-8">
              <BaZiVisualization data={baZi} />
            </div>

            {/* 五行分布 */}
            <div className="glass-card p-8">
              <FiveElementsChart data={fiveElements} size={280} />
            </div>

            {/* 服务选择 */}
            <div className="glass-card p-8">
              <h2 className="card-title mb-6">选择服务</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: '详细报告', desc: '获取完整的命理分析报告', path: '/report', icon: '📜' },
                  { title: 'AI对话', desc: '与AI命理顾问深入探讨', path: '/chat', icon: '🤖' },
                  { title: '运势预测', desc: '查看大运流年走势', path: '/report', icon: '🔮' },
                ].map((service) => (
                  <Link
                    key={service.title}
                    to={service.path}
                    className="glass-card-hover p-4 text-center group"
                  >
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <h3 className="text-cream font-medium mb-1 group-hover:text-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-cream/60 text-xs">{service.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* 重新排盘 */}
            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary ripple"
              >
                重新录入
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}