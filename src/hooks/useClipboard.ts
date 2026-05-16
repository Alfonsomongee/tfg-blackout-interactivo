import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text: string, message = '✓ Copiado al portapapeles') => {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          toast.success(message);
          setTimeout(() => setCopied(false), timeout);
        },
        () => {
          toast.error('✗ No se pudo copiar');
        }
      );
    },
    [timeout]
  );

  return { copied, copy };
}
