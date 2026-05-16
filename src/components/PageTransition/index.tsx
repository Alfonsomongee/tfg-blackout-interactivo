import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  key?: string | number;
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, key }) => (
  <motion.div
    key={key}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.4, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
