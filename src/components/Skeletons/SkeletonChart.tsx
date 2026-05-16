import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonChartProps {
  height?: number;
  className?: string;
}

export const SkeletonChart: React.FC<SkeletonChartProps> = ({
  height = 280,
  className = '',
}) => {
  return (
    <div className={`bg-raised rounded border border-border p-4 ${className}`}>
      <div className="space-y-3 mb-4">
        <motion.div
          initial={{ backgroundPosition: '200% 0' }}
          animate={{ backgroundPosition: '-200% 0' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage:
              'linear-gradient(90deg, var(--border) 0%, var(--bg-raised) 25%, var(--border) 50%)',
            backgroundSize: '200% 100%',
            height: '0.75rem',
            width: '30%',
            borderRadius: 'var(--radius-sm)',
          }}
        />
      </div>
      <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ backgroundPosition: '200% 0', height: '30%' }}
            animate={{
              backgroundPosition: '-200% 0',
              height: `${20 + Math.random() * 60}%`,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.05,
            }}
            style={{
              backgroundImage:
                'linear-gradient(90deg, var(--accent-blue) 0%, var(--accent-cyan) 25%, var(--accent-blue) 50%)',
              backgroundSize: '200% 100%',
              flex: 1,
              borderRadius: 'var(--radius-sm)',
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonChart;
