import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PRESENTATION_PAGES = [
  '/', '/brief', '/contexto-energetico', '/countdown', '/cascada', '/timeline', '/map', '/matrix',
  '/radar', '/compare', '/divergencias', '/reactiva', '/polarimetro', '/causal', '/black-start',
  '/fracturas', '/consenso', '/narrativa-mediatica', '/simulator',
  '/quiz-tribunal', '/data-cards', '/timeline-moment', '/heat-map', '/inercia-graph', '/comparador-arrastra',
  '/roadmap', '/dossier', '/lexicon', '/metodologia', '/reforms', '/trilema',
  '/veredicto', '/tribunal', '/galeria'
];

const AUTO_PLAY_INTERVAL = 5000;

export function PresentationMode() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = PRESENTATION_PAGES.indexOf(location.pathname);
  const [isActive, setIsActive] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const currentIndexRef = useRef(currentIndex);
  
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

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

  // Auto-play timer
  useEffect(() => {
    if (!isActive || !autoPlay) return;
    const timer = setInterval(() => {
      const idx = currentIndexRef.current;
      if (idx < PRESENTATION_PAGES.length - 1) {
        navigate(PRESENTATION_PAGES[idx + 1]);
      } else {
        setAutoPlay(false);
      }
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isActive, autoPlay, navigate]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsActive(false);
        setAutoPlay(false);
        document.body.classList.remove('presentation-mode');
      }

      // Only navigate if presentation mode is active
      if (!isActive) return;

      if (e.key === ' ') {
        e.preventDefault();
        setAutoPlay(p => !p);
      }
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        setAutoPlay(false);
        if (currentIndex < PRESENTATION_PAGES.length - 1) {
          navigate(PRESENTATION_PAGES[currentIndex + 1]);
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        setAutoPlay(false);
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
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsActive(false);
        setAutoPlay(false);
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
        // Fullscreen API not available — silently degrade
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
    const pageDisplay = currentIndex >= 0
      ? (PRESENTATION_PAGES[currentIndex] === '/' ? 'PORTADA' : PRESENTATION_PAGES[currentIndex].slice(1).toUpperCase())
      : 'EXTERNO';

    return (
      <div id="presentation-info-bar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(0,0,0,0.85)', padding: '0.75rem 1.5rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', color: 'rgba(255,255,255,0.9)',
        fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
        pointerEvents: 'none', zIndex: 9999,
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <span>Pág {currentIndex >= 0 ? currentIndex + 1 : '?'} / {PRESENTATION_PAGES.length} — {pageDisplay}</span>
        <span>← → navegar | SPACE {autoPlay ? 'pausar' : 'auto-play'} | ESC salir</span>
        <span style={{ color: autoPlay ? 'var(--nominal)' : 'rgba(255,255,255,0.7)' }}>
          {autoPlay ? '▶ AUTO-PLAY' : '⏸ MANUAL'}
        </span>
      </div>
    );
  }

  return null;
}

export default PresentationMode;
