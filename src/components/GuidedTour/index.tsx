import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TOUR_SEQUENCE = [
  { path: '/timeline', label: 'Cronología del colapso', duration: 6 },
  { path: '/map', label: 'Propagación geográfica', duration: 5 },
  { path: '/compare', label: 'Narrativas en conflicto', duration: 7 },
  { path: '/causal', label: 'Cadena causal forense', duration: 6 },
  { path: '/fracturas', label: 'Tres fracturas de gobernanza', duration: 6 },
  { path: '/consenso', label: 'Consenso vs. Divergencia', duration: 6 },
  { path: '/roadmap', label: 'Soluciones tecnológicas', duration: 5 },
  { path: '/metodologia', label: 'Rigor metodológico', duration: 4 },
];

const TOTAL_DURATION = TOUR_SEQUENCE.reduce((sum, s) => sum + s.duration, 0);

// Exporting as both default and named export to ensure compatibility
export { TOUR_SEQUENCE, TOTAL_DURATION };

export default function GuidedTour({ isRunning, setIsRunning, onExit }: { 
  isRunning: boolean; 
  setIsRunning: (val: boolean) => void;
  onExit?: () => void;
}) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isRunning || currentIndex >= TOUR_SEQUENCE.length) return;

    const current = TOUR_SEQUENCE[currentIndex];
    navigate(current.path);

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, current.duration * 1000);

    return () => clearTimeout(timer);
  }, [isRunning, currentIndex, navigate]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProg = prev + (100 / (TOTAL_DURATION * 10));
          return Math.min(newProg, 100);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handlePause = () => setIsRunning(false);

  const handleResume = () => setIsRunning(true);

  const handleNext = () => setCurrentIndex(prev => Math.min(TOUR_SEQUENCE.length, prev + 1));

  const handlePrev = () => setCurrentIndex(prev => Math.max(0, prev - 1));

  const handleExit = () => {
    setIsRunning(false);
    setCurrentIndex(0);
    setProgress(0);
    navigate('/');
    if (onExit) onExit();
  };

  if (currentIndex >= TOUR_SEQUENCE.length && isRunning) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'var(--bg-primary)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, flexDirection: 'column', gap: '2rem'
      }}>
        <div style={{textAlign: 'center'}}>
          <h1 style={{fontFamily: 'var(--font-serif)', fontSize: '2rem',
                     color: 'var(--accent)', margin: 0}}>
            Presentación completada
          </h1>
          <p style={{fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '1rem'}}>
            Has visto el análisis forense del apagón del 28 de abril en 8 minutos.
          </p>
        </div>
        <button
          onClick={handleExit}
          style={{padding: '0.75rem 2rem', background: 'var(--accent)',
                 color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                 cursor: 'pointer', fontSize: '1rem', fontWeight: 500}}>
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!isRunning && currentIndex === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)', padding: '1.5rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 1000,
      maxWidth: '400px'
    }}>
      <p style={{fontSize: '0.75rem', color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', margin: '0 0 0.75rem'}}>
        PRESENTACIÓN GUIADA
      </p>
      <p style={{fontSize: '1rem', fontWeight: 500,
                color: 'var(--text-primary)', margin: '0 0 0.5rem'}}>
        {TOUR_SEQUENCE[currentIndex]?.label || 'Completado'}
      </p>
      <p style={{fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0 0 1rem'}}>
        Página {currentIndex + 1} de {TOUR_SEQUENCE.length}
      </p>

      {/* Progress bar */}
      <div style={{height: '4px', background: 'var(--bg-raised)',
                  borderRadius: '2px', marginBottom: '1rem', overflow: 'hidden'}}>
        <div style={{height: '100%', background: 'var(--accent)',
                    width: `${progress}%`, transition: 'width 0.1s linear'}}></div>
      </div>

      {/* Controls */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem', marginBottom: '0.75rem'}}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{padding: '0.5rem', background: 'var(--bg-raised)',
                 border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                 cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)',
                 opacity: currentIndex === 0 ? 0.5 : 1}}>
          ← Anterior
        </button>
        <button
          onClick={handleNext}
          style={{padding: '0.5rem', background: 'var(--bg-raised)',
                 border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                 cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)'}}>
          Siguiente →
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem'}}>
        {!isRunning ? (
          <button
            onClick={handleResume}
            style={{padding: '0.5rem', background: 'var(--accent)',
                   color: 'white', border: 'none', borderRadius: 'var(--radius-sm)',
                   cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500}}>
            ▶ Reanudar
          </button>
        ) : (
          <button
            onClick={handlePause}
            style={{padding: '0.5rem', background: 'var(--warning)',
                   color: 'white', border: 'none', borderRadius: 'var(--radius-sm)',
                   cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500}}>
            ⏸ Pausar
          </button>
        )}
        <button
          onClick={handleExit}
          style={{padding: '0.5rem', background: 'var(--alarm)',
                 color: 'white', border: 'none', borderRadius: 'var(--radius-sm)',
                 cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500}}>
          ✕ Salir
        </button>
      </div>
    </div>
  );
}
