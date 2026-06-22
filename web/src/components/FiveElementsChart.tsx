import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import type { FiveElements } from '@/stores';

interface FiveElementsChartProps {
  data: FiveElements;
  size?: number;
}

const ELEMENT_COLORS = {
  wood: '#4CAF50',   // 绿色 - 木
  fire: '#F44336',   // 红色 - 火
  earth: '#FFC107',  // 黄色 - 土
  metal: '#9E9E9E',  // 银色 - 金
  water: '#2196F3',  // 蓝色 - 水
};

const ELEMENT_NAMES = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

const ELEMENT_ICONS = {
  wood: '🌳',
  fire: '🔥',
  earth: '🏔️',
  metal: '⚔️',
  water: '💧',
};

export default function FiveElementsChart({ data, size = 300 }: FiveElementsChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: ELEMENT_NAMES[key as keyof FiveElements],
    value,
    key,
    color: ELEMENT_COLORS[key as keyof FiveElements],
    icon: ELEMENT_ICONS[key as keyof FiveElements],
  }));

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { icon: string; color: string } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-dark/90 backdrop-blur-md border border-gold/30 rounded-lg px-4 py-2">
          <p className="text-cream font-medium">
            {item.payload.icon} {item.name}: {item.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string; payload: { icon: string } }> }) => {
    if (!payload) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-cream/80 text-sm">
              {entry.payload?.icon} {entry.value}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h3 className="font-serif text-xl text-center text-cream mb-4">五行分布</h3>
      
      <div style={{ width: '100%', height: size }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.15}
              outerRadius={size * 0.35}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 详细数据 */}
      <div className="grid grid-cols-5 gap-2 mt-6">
        {chartData.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="text-center"
          >
            <div
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl mb-2"
              style={{ backgroundColor: `${item.color}20`, border: `2px solid ${item.color}` }}
            >
              {item.icon}
            </div>
            <p className="text-cream/60 text-xs">{item.name}</p>
            <p className="text-cream font-medium">{item.value}%</p>
          </motion.div>
        ))}
      </div>

      {/* 五行统计 */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-cream/60 text-sm">最强五行</p>
            <p className="text-gold font-serif text-lg">
              {chartData.sort((a, b) => b.value - a.value)[0]?.icon} {chartData.sort((a, b) => b.value - a.value)[0]?.name}
            </p>
          </div>
          <div>
            <p className="text-cream/60 text-sm">最弱五行</p>
            <p className="text-primary-300 font-serif text-lg">
              {chartData.sort((a, b) => a.value - b.value)[0]?.icon} {chartData.sort((a, b) => a.value - b.value)[0]?.name}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}