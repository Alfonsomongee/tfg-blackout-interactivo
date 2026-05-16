import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`bg-raised rounded border border-border p-4 ${className}`}>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ backgroundPosition: '200% 0' }}
            animate={{ backgroundPosition: '-200% 0' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{
              backgroundImage:
                'linear-gradient(90deg, var(--border) 0%, var(--bg-raised) 25%, var(--border) 50%)',
              backgroundSize: '200% 100%',
              height: i === lines - 1 ? '0.75rem' : '1rem',
              borderRadius: 'var(--radius-sm)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;
