import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className = '', onClick, disabled, type = 'button' }, ref) => {
    const variants = {
      rest: { scale: 1 },
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
    };

    return (
      <motion.button
        ref={ref}
        className={`transition-all duration-200 ${className}`}
        variants={variants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
