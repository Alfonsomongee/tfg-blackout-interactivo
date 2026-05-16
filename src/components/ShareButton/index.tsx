import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail if clipboard API is unavailable
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Compartir esta página"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '4px 10px',
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        color: copied ? 'var(--nominal)' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        transition: 'all 0.2s ease',
        marginLeft: 'auto',
      }}
      onMouseEnter={(e) => {
        if (!copied) e.currentTarget.style.borderColor = 'var(--border-accent)';
      }}
      onMouseLeave={(e) => {
        if (!copied) e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <span>{copied ? '✔ COPIADO' : '🔗 COMPARTIR'}</span>
    </button>
  );
}
