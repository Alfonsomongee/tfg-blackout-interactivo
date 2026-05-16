import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

interface ScrollAnimationCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollAnimationCard: React.FC<ScrollAnimationCardProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimationCard;
