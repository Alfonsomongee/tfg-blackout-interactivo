import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Share2 as TwitterIcon, Bookmark as LinkedinIcon } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';

export default function ShareButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { copy } = useClipboard();

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pageTitle = typeof document !== 'undefined' ? document.title : 'TFG Blackout';

  const handleCopyLink = () => {
    copy(currentUrl, 'Link copiado al portapapeles');
    setMenuOpen(false);
  };

  const handleTwitterShare = () => {
    const text = `Explorando el análisis forense del apagón ibérico 28-A 🔌⚡\n${pageTitle}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setMenuOpen(false);
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setMenuOpen(false);
  };

  const shareOptions = [
    { icon: Copy, label: 'Copiar link', action: handleCopyLink },
    { icon: TwitterIcon, label: 'Twitter', action: handleTwitterShare },
    { icon: LinkedinIcon, label: 'LinkedIn', action: handleLinkedInShare },
  ];

  return (
    <>
      <div style={{ position: 'relative' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Compartir esta página"
          aria-expanded={menuOpen}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '4px 10px',
            background: menuOpen ? 'var(--bg-raised)' : 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            transition: 'all 0.2s ease',
            marginLeft: 'auto',
          }}
        >
          <Share2 size={12} />
          <span>Compartir</span>
        </motion.button>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              minWidth: '160px',
            }}
          >
            {shareOptions.map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.625rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </div>

    </>
  );
}
