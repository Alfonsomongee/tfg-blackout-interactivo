import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  cols = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-3">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <motion.div
              key={colIdx}
              initial={{ backgroundPosition: '200% 0' }}
              animate={{ backgroundPosition: '-200% 0' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: (rowIdx + colIdx) * 0.05,
              }}
              style={{
                backgroundImage:
                  'linear-gradient(90deg, var(--border) 0%, var(--bg-raised) 25%, var(--border) 50%)',
                backgroundSize: '200% 100%',
                flex: 1,
                height: '1.5rem',
                borderRadius: 'var(--radius-sm)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable;
