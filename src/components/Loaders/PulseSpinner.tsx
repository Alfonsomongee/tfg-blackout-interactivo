import React from 'react';
import { motion } from 'framer-motion';

interface PulseSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: '20px',
  md: '32px',
  lg: '48px',
  xl: '64px',
};

export const PulseSpinner: React.FC<PulseSpinnerProps> = ({
  size = 'md',
  color = 'var(--accent-blue)',
  className = '',
}) => {
  const dimension = sizeMap[size];

  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        width: dimension,
        height: dimension,
        background: color,
        borderRadius: '50%',
      }}
      className={className}
    />
  );
};

export default PulseSpinner;
