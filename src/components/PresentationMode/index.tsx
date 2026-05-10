import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PRESENTATION_PAGES = [
  '/', '/brief', '/timeline', '/map', '/compare', '/causal',
  '/fracturas', '/consenso', '/roadmap', '/metodologia'
];

export function PresentationMode() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = PRESENTATION_PAGES.indexOf(location.pathname);
  const [isActive, setIsActive] = useState(false);

  // Sync state with DOM and fullscreen events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsActive(isCurrentlyFullscreen);
      if (isCurrentlyFullscreen) {
        document.body.classList.add('presentation-mode');
      } else {
        document.body.classList.remove('presentation-mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsActive(false);
        document.body.classList.remove('presentation-mode');
      }
      
      // Only navigate if presentation mode is active
      if (!isActive) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (currentIndex < PRESENTATION_PAGES.length - 1) {
          navigate(PRESENTATION_PAGES[currentIndex + 1]);
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        if (currentIndex > 0) {
          navigate(PRESENTATION_PAGES[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, navigate, isActive]);

  // Click handler on document body to go to next page when presentation mode is active
  useEffect(() => {
    if (!isActive) return;

    const handleBodyClick = (e: MouseEvent) => {
      // Don't trigger if clicked on an interactive element like buttons, inputs or links
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, [role="button"], p, span, h1, h2, h3, a')) {
        // Only trigger next slide if clicked on a general background, not on interactive content
        // Or if clicked outside specific components. Let's make it more selective so they can click text.
        // Actually, if they click a paragraph, they might want to advance. Let's filter out standard buttons, links, sliders:
        if (target.closest('button, a, input, select, textarea, [role="button"], svg, path, .recharts-wrapper, input[type="range"]')) {
          return;
        }
      }
      
      if (currentIndex < PRESENTATION_PAGES.length - 1) {
        navigate(PRESENTATION_PAGES[currentIndex + 1]);
      } else {
        // If last page, exit presentation mode
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsActive(false);
        document.body.classList.remove('presentation-mode');
      }
    };

    document.addEventListener('click', handleBodyClick);
    return () => {
      document.removeEventListener('click', handleBodyClick);
    };
  }, [isActive, currentIndex, navigate]);

  // Wire up the button via DOM
  useEffect(() => {
    const enterPresentation = () => {
      setIsActive(true);
      document.body.classList.add('presentation-mode');
      document.documentElement.requestFullscreen().catch(() => {
        console.log('Fullscreen no disponible');
      });
    };

    const exitPresentation = () => {
      setIsActive(false);
      document.body.classList.remove('presentation-mode');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };

    const handleBtnClick = () => {
      if (document.body.classList.contains('presentation-mode') || !!document.fullscreenElement) {
        exitPresentation();
      } else {
        enterPresentation();
      }
    };

    const btn = document.querySelector('[data-presentation-btn]');
    if (btn) {
      btn.addEventListener('click', handleBtnClick);
    }

    return () => {
      if (btn) {
        btn.removeEventListener('click', handleBtnClick);
      }
    };
  }, []);

  // Info bar en modo presentación
  if (isActive) {
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(0,0,0,0.75)', padding: '0.75rem 1.5rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', color: 'rgba(255,255,255,0.9)',
        fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
        pointerEvents: 'none', zIndex: 9999,
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <span>Pág {currentIndex + 1} / {PRESENTATION_PAGES.length} — {PRESENTATION_PAGES[currentIndex] === '/' ? 'Portada' : PRESENTATION_PAGES[currentIndex].slice(1).toUpperCase()}</span>
        <span>← → / CLICK para navegar | ESC para salir</span>
        <span>MODO PRESENTACIÓN</span>
      </div>
    );
  }

  return null;
}

export default PresentationMode;
