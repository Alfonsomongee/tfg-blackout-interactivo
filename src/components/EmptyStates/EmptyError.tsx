import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface EmptyErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const EmptyError: React.FC<EmptyErrorProps> = ({
  message = 'Algo salió mal',
  onRetry,
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
      <motion.div
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ marginBottom: '1rem' }}
      >
        <AlertTriangle size={48} color="var(--alarm)" />
      </motion.div>
      <h3
        style={{
          margin: '0 0 0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--alarm)',
          textTransform: 'uppercase',
        }}
      >
        Error
      </h3>
      <p
        style={{
          margin: '0 0 1.5rem',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          maxWidth: '300px',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--alarm)',
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
          Reintentar
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyError;
