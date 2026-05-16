import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';

interface CopyButtonProps {
  text: string;
  message?: string;
  className?: string;
  icon?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  message = '✓ Copiado',
  className = '',
  icon = true,
}) => {
  const { copied, copy } = useClipboard();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => copy(text, message)}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded font-mono text-xs transition-all ${
        copied
          ? 'bg-nominal/20 text-nominal border border-nominal'
          : 'bg-transparent text-text-secondary hover:text-text-primary border border-border hover:border-text-primary'
      } ${className}`}
    >
      <motion.div
        animate={copied ? { rotate: 0, scale: 1 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {icon && (copied ? <Check size={14} /> : <Copy size={14} />)}
      </motion.div>
      {copied ? 'Copiado' : 'Copiar'}
    </motion.button>
  );
};

export default CopyButton;
