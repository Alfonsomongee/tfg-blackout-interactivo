import React from 'react';
import { motion } from 'framer-motion';

interface EmptyDataProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyData: React.FC<EmptyDataProps> = ({
  icon = '📊',
  title = 'Sin datos',
  description = 'No hay datos disponibles en este momento',
  action,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
      }}
      className={className}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3
        style={{
          margin: '0 0 0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '0 0 1.5rem',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          maxWidth: '300px',
        }}
      >
        {description}
      </p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--accent-blue)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyData;
