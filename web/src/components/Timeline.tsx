import { motion } from 'framer-motion';
import { ChevronRight, Circle } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date?: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'current' | 'upcoming';
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'vertical' | 'horizontal';
  onItemClick?: (item: TimelineItem) => void;
}

export default function Timeline({ items, variant = 'vertical', onItemClick }: TimelineProps) {
  if (variant === 'horizontal') {
    return (
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max px-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onItemClick?.(item)}
              className={`relative flex flex-col items-center cursor-pointer group ${
                onItemClick ? 'hover:scale-105 transition-transform' : ''
              }`}
            >
              {/* 连接线 */}
              {index < items.length - 1 && (
                <div className="absolute top-5 left-full w-full h-0.5 bg-gradient-to-r from-gold/50 to-transparent z-0" />
              )}

              {/* 图标 */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  item.status === 'current'
                    ? 'bg-gold text-dark shadow-glow'
                    : item.status === 'completed'
                    ? 'bg-primary text-cream'
                    : 'bg-white/10 text-cream/60'
                }`}
              >
                {item.icon || <Circle className="w-4 h-4" />}
              </div>

              {/* 内容 */}
              <div className="text-center max-w-[120px]">
                <p className="text-cream text-sm font-medium truncate">{item.title}</p>
                {item.date && (
                  <p className="text-cream/50 text-xs mt-1">{item.date}</p>
                )}
              </div>

              {/* 悬停效果 */}
              <div className="absolute -inset-2 rounded-lg bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 主线 */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-primary to-transparent" />

      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onItemClick?.(item)}
            className={`relative pl-12 cursor-pointer group ${
              onItemClick ? 'hover:scale-[1.02] transition-transform' : ''
            }`}
          >
            {/* 节点 */}
            <div
              className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                item.status === 'current'
                  ? 'bg-gold text-dark shadow-glow scale-110'
                  : item.status === 'completed'
                  ? 'bg-primary text-cream'
                  : 'bg-white/10 text-cream/60'
              }`}
            >
              {item.icon || <Circle className="w-3 h-3" />}
            </div>

            {/* 内容卡片 */}
            <div className="glass-card-hover p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-cream font-medium mb-1">{item.title}</h4>
                  <p className="text-cream/70 text-sm">{item.description}</p>
                  {item.date && (
                    <p className="text-cream/50 text-xs mt-2">{item.date}</p>
                  )}
                </div>
                {onItemClick && (
                  <ChevronRight className="w-5 h-5 text-cream/40 group-hover:text-gold transition-colors" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}