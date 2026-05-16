import React from 'react';
import { motion } from 'framer-motion';

interface CircleSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: '24px',
  md: '40px',
  lg: '56px',
  xl: '72px',
};

export const CircleSpinner: React.FC<CircleSpinnerProps> = ({
  size = 'md',
  color = 'var(--accent-blue)',
  className = '',
}) => {
  const dimension = sizeMap[size];

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: dimension,
        height: dimension,
        border: `2px solid ${color}40`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
      }}
      className={className}
    />
  );
};

export default CircleSpinner;
