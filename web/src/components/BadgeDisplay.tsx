import { motion } from 'framer-motion';
import type { Badge } from '@/stores';

interface BadgeDisplayProps {
  badges: Badge[];
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const SIZE_CONFIG = {
  sm: { icon: 'text-xl', container: 'w-12 h-12', text: 'text-xs' },
  md: { icon: 'text-2xl', container: 'w-16 h-16', text: 'text-sm' },
  lg: { icon: 'text-3xl', container: 'w-20 h-20', text: 'text-base' },
};

export default function BadgeDisplay({ badges, size = 'md', showDetails = false }: BadgeDisplayProps) {
  const config = SIZE_CONFIG[size];

  if (badges.length === 0) {
    return (
      <div className="text-center text-cream/50 py-8">
        <p>暂无勋章</p>
      </div>
    );
  }

  return (
    <div className={showDetails ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'flex flex-wrap gap-3'}>
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className={`relative group ${showDetails ? 'glass-card p-4' : ''}`}
        >
          {/* 勋章图标 */}
          <div
            className={`${config.container} rounded-full bg-gradient-to-br from-gold/20 to-primary/20 
                       border-2 border-gold/50 flex items-center justify-center mx-auto
                       group-hover:shadow-glow transition-shadow`}
          >
            <span className={config.icon}>{badge.icon}</span>
          </div>

          {/* 勋章名称 */}
          <p className={`text-center text-cream mt-2 ${config.text}`}>
            {badge.name}
          </p>

          {/* 详细信息 */}
          {showDetails && (
            <>
              <p className="text-center text-cream/60 text-xs mt-1">
                {badge.description}
              </p>
              <p className="text-center text-cream/40 text-xs mt-2">
                获得于 {new Date(badge.earnedAt).toLocaleDateString('zh-CN')}
              </p>
            </>
          )}

          {/* 悬停提示 */}
          {!showDetails && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                          transition-opacity pointer-events-none z-10">
              <div className="bg-dark/95 backdrop-blur-md border border-gold/30 rounded-lg px-3 py-2 whitespace-nowrap">
                <p className="text-cream text-sm font-medium">{badge.name}</p>
                <p className="text-cream/60 text-xs">{badge.description}</p>
              </div>
              <div className="w-2 h-2 bg-dark border-r border-b border-gold/30 rotate-45 mx-auto -mt-1" />
            </div>
          )}

          {/* 发光效果 */}
          <div className="absolute inset-0 rounded-full bg-gold/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}