import React from 'react';
import { motion } from 'framer-motion';

interface DotsSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: '8px',
  md: '12px',
  lg: '16px',
};

export const DotsSpinner: React.FC<DotsSpinnerProps> = ({
  size = 'md',
  color = 'var(--accent-blue)',
  className = '',
}) => {
  const dimension = sizeMap[size];


  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
          style={{
            width: dimension,
            height: dimension,
            background: color,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
};

export default DotsSpinner;
