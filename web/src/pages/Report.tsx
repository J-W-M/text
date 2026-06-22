import { motion } from 'framer-motion';
import { FileText, Download, Share2, Clock, ChevronRight } from 'lucide-react';
import { useFortuneStore } from '@/stores';
import { Timeline, Loading } from '@/components';

export default function Report() {
  const { birthInfo, baZi, fiveElements, daYunList, liuNianList, reports, isLoading } = useFortuneStore();

  // 模拟报告数据
  const mockReport = {
    id: '1',
    title: '八字命理综合分析报告',
    createdAt: new Date().toISOString(),
    sections: [
      {
        title: '命格概述',
        content: '您的命格以木为主，性格温和，富有创造力。日主戊土，坐辰土，根基稳固，为人稳重踏实。年柱甲子，祖上根基深厚，有良好的家庭背景。',
      },
      {
        title: '性格分析',
        content: '您性格温和，待人友善，有较强的责任心和使命感。思维敏捷，善于分析问题，做事有条理。有时会过于谨慎，建议适当放开，勇于尝试。',
      },
      {
        title: '事业运势',
        content: '事业方面，您适合从事文化、教育、管理或创意类工作。当前处于事业上升期，建议把握机会，积极进取。未来五年有望取得显著成就。',
      },
      {
        title: '感情婚姻',
        content: '感情方面，您与异性相处融洽，容易获得异性好感。建议在感情中保持真诚，多沟通理解。2026年有较好的感情机遇。',
      },
      {
        title: '健康建议',
        content: '健康方面，注意肝胆和消化系统的保养。建议保持规律作息，适当运动，饮食清淡。五行火弱，可多接触阳光，增强体质。',
      },
    ],
  };

  const reportTimelineItems = reports.length > 0 
    ? reports.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.summary || '命理分析报告',
        date: new Date(r.createdAt).toLocaleDateString('zh-CN'),
        status: 'completed' as const,
      }))
    : [
        {
          id: '1',
          title: '八字综合报告',
          description: '完整的命理分析',
          date: new Date().toLocaleDateString('zh-CN'),
          status: 'completed' as const,
        },
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
          <h1 className="section-title">命理报告</h1>
          <p className="section-subtitle">详尽的命理分析，洞察人生轨迹</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loading text="正在生成报告..." />
          </div>
        ) : (
          <div className="space-y-8">
            {/* 报告时间轴 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="card-title mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                报告记录
              </h2>
              <Timeline items={reportTimelineItems} />
            </motion.div>

            {/* 主报告 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8"
            >
              {/* 报告头部 */}
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/10">
                <div>
                  <h2 className="font-serif text-2xl text-cream mb-2">
                    {mockReport.title}
                  </h2>
                  <p className="text-cream/60 text-sm">
                    生成时间：{new Date(mockReport.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="下载">
                    <Download className="w-5 h-5 text-cream/60 hover:text-gold" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="分享">
                    <Share2 className="w-5 h-5 text-cream/60 hover:text-gold" />
                  </button>
                </div>
              </div>

              {/* 基本信息 */}
              {birthInfo && (
                <div className="mb-8 p-4 bg-white/5 rounded-xl">
                  <h3 className="text-cream font-medium mb-3">基本信息</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-cream/60">出生日期：</span>
                      <span className="text-cream ml-2">
                        {birthInfo.year}年{birthInfo.month}月{birthInfo.day}日
                      </span>
                    </div>
                    <div>
                      <span className="text-cream/60">出生时间：</span>
                      <span className="text-cream ml-2">
                        {birthInfo.hour}时{birthInfo.minute}分
                      </span>
                    </div>
                    <div>
                      <span className="text-cream/60">性别：</span>
                      <span className="text-cream ml-2">
                        {birthInfo.gender === 'male' ? '男' : '女'}
                      </span>
                    </div>
                    <div>
                      <span className="text-cream/60">出生地：</span>
                      <span className="text-cream ml-2">{birthInfo.location}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 报告内容 */}
              <div className="space-y-6">
                {mockReport.sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-6 bg-white/5 rounded-xl hover:bg-white/8 transition-colors"
                  >
                    <h3 className="font-serif text-lg text-gold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {section.title}
                    </h3>
                    <p className="text-cream/80 leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}
              </div>

              {/* 五行分析 */}
              {fiveElements && (
                <div className="mt-8 p-6 bg-white/5 rounded-xl">
                  <h3 className="font-serif text-lg text-gold mb-4">五行分析</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(fiveElements).map(([key, value]) => {
                      const colors: Record<string, string> = {
                        wood: '#4CAF50',
                        fire: '#F44336',
                        earth: '#FFC107',
                        metal: '#9E9E9E',
                        water: '#2196F3',
                      };
                      const names: Record<string, string> = {
                        wood: '木',
                        fire: '火',
                        earth: '土',
                        metal: '金',
                        water: '水',
                      };
                      return (
                        <div key={key} className="text-center">
                          <div
                            className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2"
                            style={{ backgroundColor: `${colors[key]}20`, border: `2px solid ${colors[key]}` }}
                          >
                            <span className="text-cream font-serif">{names[key]}</span>
                          </div>
                          <p className="text-cream/60 text-xs">{value}%</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 大运流年 */}
              {daYunList.length > 0 && (
                <div className="mt-8 p-6 bg-white/5 rounded-xl">
                  <h3 className="font-serif text-lg text-gold mb-4">大运流年</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-cream font-medium mb-3">大运走势</h4>
                      <div className="space-y-2">
                        {daYunList.slice(0, 5).map((dy) => (
                          <div key={dy.id} className="flex items-center gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${
                              dy.startAge <= 30 && dy.endAge >= 30 ? 'bg-gold' : 'bg-primary'
                            }`} />
                            <span className="text-cream">{dy.startAge}-{dy.endAge}岁</span>
                            <span className="text-cream/60">{dy.heavenlyStem}{dy.earthlyBranch}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-cream font-medium mb-3">近期流年</h4>
                      <div className="space-y-2">
                        {liuNianList.slice(0, 5).map((ln) => (
                          <div key={ln.id} className="flex items-center gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${
                              ln.fortune === 'good' ? 'bg-green-500' :
                              ln.fortune === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <span className="text-cream">{ln.year}年</span>
                            <span className="text-cream/60">{ln.heavenlyStem}{ln.earthlyBranch}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 操作按钮 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <button className="btn-secondary ripple flex items-center gap-2">
                <Download className="w-4 h-4" />
                下载报告
              </button>
              <button className="btn-primary ripple flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                分享报告
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}