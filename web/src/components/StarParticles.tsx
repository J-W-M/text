import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StarParticlesProps {
  count?: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function StarParticles({ count = 50, className = '' }: StarParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stars: Star[] = [];

  // 生成星星
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    });
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {stars.map((star, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: index % 3 === 0 ? '#D4AF37' : '#F5E6CC',
          }}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}