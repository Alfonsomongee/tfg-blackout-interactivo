import { useState, useEffect } from 'react';

export function useConsoleMode() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('console-mode') === 'true'; } catch { return false; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add('console-mode');
    } else {
      root.classList.remove('console-mode');
    }
    localStorage.setItem('console-mode', String(enabled));
  }, [enabled]);

  return { enabled, toggle: () => setEnabled(p => !p) };
}

interface ConsoleModeButtonProps {
  enabled: boolean;
  onToggle: () => void;
}

export function ConsoleModeButton({ enabled, onToggle }: ConsoleModeButtonProps) {
  return (
    <button
      onClick={onToggle}
      title={enabled ? 'Desactivar modo consola' : 'Activar modo consola retro'}
      style={{
        background: enabled ? '#00ff00' : 'transparent',
        color: enabled ? '#000' : 'rgba(255,255,255,0.5)',
        border: `1px solid ${enabled ? '#00ff00' : 'rgba(255,255,255,0.15)'}`,
        borderRadius: '4px',
        padding: '4px 8px',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        if (!enabled) {
          (e.currentTarget as HTMLElement).style.color = '#00ff00';
          (e.currentTarget as HTMLElement).style.borderColor = '#00ff00';
        }
      }}
      onMouseLeave={e => {
        if (!enabled) {
          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
        }
      }}
    >
      {enabled ? '■ CONSOLE ON' : '▶ CONSOLE'}
    </button>
  );
}

export default ConsoleModeButton;
