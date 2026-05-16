import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 4, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ backgroundPosition: '200% 0' }}
          animate={{ backgroundPosition: '-200% 0' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.1,
          }}
          style={{
            backgroundImage:
              'linear-gradient(90deg, var(--border) 0%, var(--bg-raised) 25%, var(--border) 50%)',
            backgroundSize: '200% 100%',
            height: '0.875rem',
            borderRadius: 'var(--radius-sm)',
            width: i === lines - 1 ? '70%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonText;
