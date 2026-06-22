import { motion } from 'framer-motion';
import type { BaZi } from '@/stores';

interface BaZiVisualizationProps {
  data: BaZi;
}

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const STEM_ELEMENTS: Record<string, { element: string; color: string }> = {
  '甲': { element: '木', color: '#4CAF50' },
  '乙': { element: '木', color: '#4CAF50' },
  '丙': { element: '火', color: '#F44336' },
  '丁': { element: '火', color: '#F44336' },
  '戊': { element: '土', color: '#FFC107' },
  '己': { element: '土', color: '#FFC107' },
  '庚': { element: '金', color: '#9E9E9E' },
  '辛': { element: '金', color: '#9E9E9E' },
  '壬': { element: '水', color: '#2196F3' },
  '癸': { element: '水', color: '#2196F3' },
};

const BRANCH_ELEMENTS: Record<string, { element: string; color: string }> = {
  '子': { element: '水', color: '#2196F3' },
  '丑': { element: '土', color: '#FFC107' },
  '寅': { element: '木', color: '#4CAF50' },
  '卯': { element: '木', color: '#4CAF50' },
  '辰': { element: '土', color: '#FFC107' },
  '巳': { element: '火', color: '#F44336' },
  '午': { element: '火', color: '#F44336' },
  '未': { element: '土', color: '#FFC107' },
  '申': { element: '金', color: '#9E9E9E' },
  '酉': { element: '金', color: '#9E9E9E' },
  '戌': { element: '土', color: '#FFC107' },
  '亥': { element: '水', color: '#2196F3' },
};

const PILLAR_NAMES = ['年柱', '月柱', '日柱', '时柱'];

export default function BaZiVisualization({ data }: BaZiVisualizationProps) {
  const pillars = [
    data.yearPillar,
    data.monthPillar,
    data.dayPillar,
    data.hourPillar,
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h3 className="font-serif text-xl text-center text-cream mb-6">八字排盘</h3>

      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {pillars.map((pillar, index) => {
          const stemInfo = STEM_ELEMENTS[pillar.heavenlyStem] || { element: '未知', color: '#888' };
          const branchInfo = BRANCH_ELEMENTS[pillar.earthlyBranch] || { element: '未知', color: '#888' };

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex flex-col items-center"
            >
              {/* 柱名 */}
              <div className="text-cream/60 text-sm mb-2">{PILLAR_NAMES[index]}</div>

              {/* 八字柱 */}
              <div className="glass-card-hover p-4 rounded-xl w-full">
                {/* 天干 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative mb-3"
                >
                  <div
                    className="w-full aspect-square rounded-lg flex items-center justify-center font-serif text-3xl text-cream glow-border"
                    style={{
                      backgroundColor: `${stemInfo.color}20`,
                      borderColor: stemInfo.color,
                    }}
                  >
                    {pillar.heavenlyStem}
                  </div>
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: stemInfo.color }}
                  >
                    {stemInfo.element}
                  </div>
                </motion.div>

                {/* 地支 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div
                    className="w-full aspect-square rounded-lg flex items-center justify-center font-serif text-3xl text-cream glow-border"
                    style={{
                      backgroundColor: `${branchInfo.color}20`,
                      borderColor: branchInfo.color,
                    }}
                  >
                    {pillar.earthlyBranch}
                  </div>
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: branchInfo.color }}
                  >
                    {branchInfo.element}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 说明 */}
      <div className="mt-8 p-4 bg-white/5 rounded-xl max-w-2xl mx-auto">
        <h4 className="font-serif text-cream mb-2">八字解读</h4>
        <p className="text-cream/70 text-sm leading-relaxed">
          您的八字由年柱、月柱、日柱、时柱组成，每柱包含一个天干和一个地支。
          天干代表外在表现，地支代表内在本质。通过分析八字中五行的分布和生克关系，
          可以了解您的性格特点、运势走向以及人生机遇。
        </p>
      </div>

      {/* 五行对应表 */}
      <div className="mt-6 grid grid-cols-5 gap-2 max-w-2xl mx-auto">
        {['木', '火', '土', '金', '水'].map((element, index) => {
          const colors = ['#4CAF50', '#F44336', '#FFC107', '#9E9E9E', '#2196F3'];
          const icons = ['🌳', '🔥', '🏔️', '⚔️', '💧'];
          
          return (
            <motion.div
              key={element}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-2 rounded-lg"
              style={{ backgroundColor: `${colors[index]}15` }}
            >
              <div className="text-2xl mb-1">{icons[index]}</div>
              <div className="text-cream text-sm">{element}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}