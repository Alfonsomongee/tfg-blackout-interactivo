import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface EmptySearchProps {
  query?: string;
  onClear?: () => void;
  className?: string;
}

export const EmptySearch: React.FC<EmptySearchProps> = ({
  query = '',
  onClear,
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
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ marginBottom: '1rem' }}
      >
        <Search size={48} color="var(--text-muted)" />
      </motion.div>
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
        Sin resultados
      </h3>
      <p
        style={{
          margin: '0 0 1.5rem',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          maxWidth: '300px',
        }}
      >
        {query ? `No encontramos resultados para "${query}"` : 'Intenta con otros términos de búsqueda'}
      </p>
      {query && onClear && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--border)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          Limpiar búsqueda
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptySearch;
