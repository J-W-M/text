import { motion } from 'framer-motion';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ text = '加载中...', fullScreen = false }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* 加载动画 */}
      <div className="relative w-16 h-16">
        {/* 外圈 */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-gold/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* 中圈 */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-primary/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        {/* 内圈 */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-gold"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* 中心点 */}
        <motion.div
          className="absolute inset-6 rounded-full bg-gold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      {/* 文字 */}
      <motion.p
        className="text-cream/70 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}