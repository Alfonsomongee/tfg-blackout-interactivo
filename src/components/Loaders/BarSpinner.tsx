import React from 'react';
import { motion } from 'framer-motion';

interface BarSpinnerProps {
  width?: string;
  height?: string;
  color?: string;
  className?: string;
}

export const BarSpinner: React.FC<BarSpinnerProps> = ({
  width = '100%',
  height = '3px',
  color = 'var(--accent-blue)',
  className = '',
}) => {
  return (
    <div
      style={{ width, height, background: `${color}20`, borderRadius: '2px' }}
      className={className}
    >
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          height: '100%',
          width: '40%',
          background: color,
          borderRadius: '2px',
        }}
      />
    </div>
  );
};

export default BarSpinner;
