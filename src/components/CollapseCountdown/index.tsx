import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const COLLAPSE_EVENTS = [
  { seconds: 0, time: '12:32:00', event: 'Sistema en estado "Normal" según EAS. Oscilaciones contenidas tras mallado. REE no declara Alerta.', type: 'context', mwLost: 0, freq: 50.00, tension: 418 },
  { seconds: 57, time: '12:32:57', event: 'DISPARO RAÍZ — Transformador 400/220 kV en Granada. SCADA muestra 418 kV (dentro de límites). Pero el secundario de 220 kV alcanza 244 kV por Tap-Lag. Protección actúa correctamente.', type: 'critical', mwLost: 160, freq: 49.98, tension: 420 },
  { seconds: 60, time: '12:33:00', event: 'Cascada de disparos FV y termosolar en Badajoz. Sin visibilidad del operador en punto frontera.', type: 'cascade', mwLost: 500, freq: 49.95, tension: 425 },
  { seconds: 63, time: '12:33:03', event: 'Disparos eólicos en Segovia y solares en Huelva. Las protecciones actúan ante sobretensión real en 220 kV, invisible para el SCADA de 400 kV.', type: 'cascade', mwLost: 1200, freq: 49.90, tension: 430 },
  { seconds: 67, time: '12:33:07', event: 'Plantas FV en Sevilla y Cáceres disparan. El UFLS (deslastre de cargas) se activa, pero AGRAVA el colapso: al desconectar carga inductiva, elimina sumideros de reactiva.', type: 'paradox', mwLost: 2000, freq: 49.80, tension: 435 },
  { seconds: 72, time: '12:33:12', event: 'Pérdida masiva de generación RCR. 2.000 MW desconectados. El HVDC con Francia sigue exportando 1.000 MW en PMODE1 (potencia constante). No puede invertir el flujo.', type: 'cascade', mwLost: 4000, freq: 49.60, tension: 440 },
  { seconds: 78, time: '12:33:18', event: 'Fase 3 comienza. Cascada irreversible. Las líneas AC con Francia intentan importar hasta 4.609 MW de emergencia, pero el ángulo diverge.', type: 'critical', mwLost: 8000, freq: 49.30, tension: 445 },
  { seconds: 79, time: '12:33:19', event: 'Importación máxima desde Francia: −3.807 MW netos. Último intento del sistema continental de salvar la península.', type: 'milestone', mwLost: 10000, freq: 49.10, tension: 448 },
  { seconds: 80, time: '12:33:20', event: 'MARRUECOS SE DESCONECTA — Relés de subfrecuencia disparan a 49,5 Hz. 900 MW de soporte perdidos. Andalucía queda aislada.', type: 'critical', mwLost: 11000, freq: 48.80, tension: 450 },
  { seconds: 81, time: '12:33:21', event: 'PÉRDIDA DE SINCRONISMO — Protecciones OST abren Pirineos. Líneas AC Baixas-Vic, Argia-Arkale, Argia-Hernani se desconectan. La península queda aislada del sistema europeo.', type: 'critical', mwLost: 13000, freq: 48.00, tension: 455 },
  { seconds: 85, time: '12:33:25', event: 'Frecuencia en caída libre. RoCoF > 1,5 Hz/s. Ninguna intervención humana posible a esta velocidad.', type: 'freefall', mwLost: 14500, freq: 46.50, tension: 460 },
  { seconds: 89, time: '12:33:29', event: 'Disparo del último grupo nuclear. Cero de tensión absoluto a las 12:33:29.741 CEST.', type: 'blackout', mwLost: 15000, freq: 0, tension: 0 },
  { seconds: 90, time: '12:33:30', event: 'CERO DE TENSIÓN — 60 millones de personas sin luz. 15 GW perdidos en 33 segundos. El operador activa P.O. 1.6.', type: 'blackout', mwLost: 15000, freq: 0, tension: 0 },
];

export function CollapseCountdown() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);

  // FX state
  const [showFlash, setShowFlash] = useState(false);
  const [isBlackoutCompleted, setIsBlackoutCompleted] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);

  // Keep references to prevent layout-blocking ticks
  const timerRef = useRef<any>(null);

  // Format Clock time cleanly
  const formatClockTime = (second: number) => {
    if (second < 60) {
      return `12:32:${second.toString().padStart(2, '0')}`;
    } else {
      const secs = second - 60;
      return `12:33:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Interpolate state logic
  const getInterpolatedValues = useCallback((second: number) => {
    let prevEvent = COLLAPSE_EVENTS[0];
    let nextEvent = COLLAPSE_EVENTS[COLLAPSE_EVENTS.length - 1];

    for (let i = 0; i < COLLAPSE_EVENTS.length; i++) {
      const ev = COLLAPSE_EVENTS[i];
      if (ev.seconds <= second) {
        prevEvent = ev;
      }
    }
    for (let i = COLLAPSE_EVENTS.length - 1; i >= 0; i--) {
      const ev = COLLAPSE_EVENTS[i];
      if (ev.seconds >= second) {
        nextEvent = ev;
      }
    }

    if (prevEvent.seconds === nextEvent.seconds) {
      return {
        freq: prevEvent.freq,
        tension: prevEvent.tension,
        mwLost: prevEvent.mwLost,
        event: prevEvent,
      };
    }

    const progress = (second - prevEvent.seconds) / (nextEvent.seconds - prevEvent.seconds);
    const freq = prevEvent.freq + (nextEvent.freq - prevEvent.freq) * progress;
    const tension = prevEvent.tension + (nextEvent.tension - prevEvent.tension) * progress;
    const mwLost = prevEvent.mwLost + (nextEvent.mwLost - prevEvent.mwLost) * progress;

    return {
      freq,
      tension,
      mwLost,
      event: prevEvent,
    };
  }, []);

  const { freq, tension, mwLost, event: currentEvent } = getInterpolatedValues(currentSecond);

  // Play/Pause toggler
  const togglePlay = useCallback(() => {
    if (showFinalScreen) return;
    setIsPlaying(prev => !prev);
  }, [showFinalScreen]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setIsPlaying(false);
    setCurrentSecond(0);
    setShowFlash(false);
    setIsBlackoutCompleted(false);
    setShowFinalScreen(false);
  }, []);

  // Tick execution
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSecond(prev => {
          if (prev >= 90) {
            setIsPlaying(false);
            return 90;
          }
          const nextVal = prev + 1;

          // Blackout triggering (89th second)
          if (nextVal === 89) {
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 120);
            setIsBlackoutCompleted(true);

            // Final screen timing (3 seconds later)
            setTimeout(() => {
              setShowFinalScreen(true);
            }, 3000);
          }

          return nextVal;
        });
      }, 1000 / speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if focusing elements
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetSimulation();
      } else if (e.key === '1') {
        setSpeed(1);
      } else if (e.key === '2') {
        setSpeed(2);
      } else if (e.key === '5') {
        setSpeed(5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, resetSimulation]);

  // UI styling selectors
  const getFreqColor = (f: number) => {
    if (f === 0) return '#000000';
    if (f >= 49.8) return 'var(--nominal, #22c55e)';
    if (f >= 49.3) return 'var(--warning, #eab308)';
    return 'var(--alarm, #ef4444)';
  };

  const getTensionColor = (v: number) => {
    if (v === 0) return '#000000';
    if (v < 420) return 'var(--nominal, #22c55e)';
    if (v <= 435) return 'var(--warning, #eab308)';
    return 'var(--alarm, #ef4444)';
  };

  const getBorderColorByType = (type: string) => {
    switch (type) {
      case 'context': return 'var(--info, #3b82f6)';
      case 'critical': return 'var(--alarm, #ef4444)';
      case 'cascade': return 'var(--warning, #eab308)';
      case 'paradox': return 'var(--accent-blue, #06b6d4)';
      case 'milestone': return 'var(--info, #3b82f6)';
      case 'freefall': return 'var(--alarm, #ef4444)';
      case 'blackout': return '#ffffff';
      default: return 'var(--border)';
    }
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem 2rem 5rem 2rem',
        minHeight: '82vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'background-color 2s ease, filter 0.5s ease',
        backgroundColor: isBlackoutCompleted ? '#000000' : 'transparent',
        color: isBlackoutCompleted ? '#ffffff' : 'var(--text-primary)',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* 100ms Climax Flash Overlay */}
      {showFlash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#ef4444',
            zIndex: 99999,
            pointerEvents: 'none',
            opacity: 0.95,
          }}
        />
      )}

      {/* FINAL POST-BLACKOUT SUMMARY COVER SCREEN */}
      {showFinalScreen ? (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000000',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem',
            zIndex: 1000,
            fontFamily: 'var(--font-sans)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.5rem',
              color: 'var(--alarm, #ef4444)',
              margin: '0 0 1rem 0',
              letterSpacing: '0.1em',
              fontWeight: 'bold',
            }}
          >
            12:33:29.741 CEST
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              fontWeight: 400,
              margin: '0 0 2rem 0',
              lineHeight: 1.2,
            }}
          >
            Cero de tensión absoluto
          </h2>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '2rem',
              maxWidth: '800px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            {[
              { val: '60M', label: 'Personas afectadas' },
              { val: '15 GW', label: 'Generación perdida' },
              { val: '33s', label: 'Intervalo de caída libre' },
            ].map((metric, i) => (
              <div
                key={i}
                style={{
                  background: '#111111',
                  border: '1px solid #333333',
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '1.5rem 2rem',
                  minWidth: '180px',
                  boxShadow: '0 4px 20px rgba(255,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '2.25rem',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    lineHeight: 1,
                    marginBottom: '0.5rem',
                  }}
                >
                  {metric.val}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              maxWidth: '600px',
              fontSize: '0.9375rem',
              lineHeight: 1.7,
              color: '#aaaaaa',
              marginBottom: '3rem',
            }}
          >
            El operador percibió la gravedad del transitorio cuando el sistema ya era irrecuperable. La velocidad del colapso — RoCoF &gt; 1,5 Hz/s — sitúa el fenómeno completamente fuera del horizonte temporal de cualquier intervención humana.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={resetSimulation}
              className="card-base"
              style={{
                background: '#222222',
                border: '1px solid #444444',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md, 6px)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#444444'}
            >
              ⟲ Repetir Simulación
            </button>
            <button
              onClick={() => navigate('/black-start')}
              className="card-base"
              style={{
                background: 'var(--accent, #3b82f6)',
                border: '1px solid var(--accent)',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md, 6px)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              → Ver Reposición (Fase 4)
            </button>
          </div>
        </div>
      ) : null}

      {/* HEADER BLOCK */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="t-subheading" style={{ marginBottom: '0.25rem', color: isBlackoutCompleted ? '#888' : 'var(--text-muted)' }}>
          Cap. 3 — Los últimos 90 segundos
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 400,
            margin: 0,
            color: isBlackoutCompleted ? '#fff' : 'var(--text-primary)',
          }}
        >
          Reloj del Colapso en Tiempo Real
        </h2>
      </div>

      {/* BIG CLOCK & TELEMETRY PROGRESS CONTAINER */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          flex: 1,
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {/* BIG CENTRAL DIGITAL TIMER */}
        <div
          role="timer"
          aria-live="polite"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              color: isBlackoutCompleted ? 'var(--alarm, #ef4444)' : 'var(--text-primary)',
              transition: 'color 0.5s ease',
              textShadow: isBlackoutCompleted
                ? '0 0 20px rgba(239, 68, 68, 0.8)'
                : '0 0 10px rgba(var(--border-accent-rgb, 59, 130, 246), 0.2)',
            }}
          >
            {formatClockTime(currentSecond)}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginTop: '0.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            [ SEG_ {currentSecond} / 90 ]
          </div>
        </div>

        {/* METRICS ROW (Responsive cards) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            width: '100%',
          }}
        >
          {/* FREQUENCY CARD */}
          <div
            className="card-base"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md, 8px)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Frecuencia de Red
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: getFreqColor(freq),
                  fontWeight: 'bold',
                  backgroundColor: `rgba(0,0,0,0.15)`,
                  padding: '2px 6px',
                  borderRadius: '3px',
                }}
              >
                {freq === 0 ? 'FUERA DE SERVICIO' : freq >= 49.8 ? 'ESTABLE' : freq >= 49.3 ? 'ANOMALÍA' : 'CRÍTICO'}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 'bold', color: getFreqColor(freq) }}>
              {freq.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Hz</span>
            </div>
            {/* Live progress bar */}
            <div style={{ height: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(freq / 50.00) * 100}%`,
                  backgroundColor: getFreqColor(freq),
                  transition: 'width 0.5s ease-out, background-color 0.5s ease',
                  borderRadius: '3px',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>0 Hz</span>
              <span>Nominal: 50.00 Hz</span>
            </div>
          </div>

          {/* VOLTAGE CARD */}
          <div
            className="card-base"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md, 8px)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Tensión Colector
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: getTensionColor(tension),
                  fontWeight: 'bold',
                  backgroundColor: `rgba(0,0,0,0.15)`,
                  padding: '2px 6px',
                  borderRadius: '3px',
                }}
              >
                {tension === 0 ? 'CERO DE TENSIÓN' : tension < 420 ? 'NORMAL' : tension <= 435 ? 'SOPORTE' : 'SOBRETENSIÓN'}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 'bold', color: getTensionColor(tension) }}>
              {tension.toFixed(0)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kV</span>
            </div>
            {/* Live inverted progress bar */}
            <div style={{ height: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(tension / 480.00) * 100}%`,
                  backgroundColor: getTensionColor(tension),
                  transition: 'width 0.5s ease-out, background-color 0.5s ease',
                  borderRadius: '3px',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>0 kV</span>
              <span>Máx: 480 kV</span>
            </div>
          </div>

          {/* POWER LOST CARD */}
          <div
            className="card-base"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md, 8px)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Generación Perdida
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: mwLost > 0 ? 'var(--alarm, #ef4444)' : 'var(--text-muted)',
                  fontWeight: 'bold',
                  backgroundColor: `rgba(0,0,0,0.15)`,
                  padding: '2px 6px',
                  borderRadius: '3px',
                }}
              >
                {mwLost === 0 ? 'NOMINAL' : mwLost >= 10000 ? 'COLAPSO GENERAL' : 'DISPAROS EN CASCADA'}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 'bold', color: mwLost > 0 ? 'var(--alarm, #ef4444)' : 'var(--text-muted)' }}>
              {mwLost.toLocaleString('es-ES', { maximumFractionDigits: 0 })} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>MW</span>
            </div>
            {/* Live power progress bar */}
            <div style={{ height: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(mwLost / 15000) * 100}%`,
                  backgroundColor: mwLost > 0 ? 'var(--alarm, #ef4444)' : 'var(--border)',
                  transition: 'width 0.5s ease-out',
                  borderRadius: '3px',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>0 MW</span>
              <span>Límite: 15.000 MW</span>
            </div>
          </div>
        </div>

        {/* ACTIVE EVENT DESCRIPTION PANEL */}
        <div
          aria-live="polite"
          className="animate-fade-in"
          style={{
            width: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderLeft: `5px solid ${getBorderColorByType(currentEvent?.type || 'context')}`,
            borderRadius: 'var(--radius-md, 6px)',
            padding: '1.25rem 1.5rem',
            minHeight: '110px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: getBorderColorByType(currentEvent?.type || 'context'),
              }}
            >
              // EVENTO DETECTADO @ {currentEvent?.time}
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '1px 5px',
                borderRadius: '3px',
                color: 'var(--text-muted)',
              }}
            >
              TIPO: {currentEvent?.type.toUpperCase()}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
            }}
          >
            {currentEvent?.event}
          </p>
        </div>
      </div>

      {/* TIMELINE PROGRESS & TICK MARKS */}
      <div style={{ width: '100%', margin: '2rem 0' }}>
        <div style={{ position: 'relative', height: '40px', display: 'flex', alignItems: 'center' }}>
          {/* Main Horizontal Timeline Bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, var(--accent-blue, #06b6d4) 0%, var(--alarm, #ef4444) 100%)',
              opacity: 0.25,
            }}
          />
          {/* Active Progress Overlay */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: `${(currentSecond / 90) * 100}%`,
              height: '3px',
              background: 'linear-gradient(90deg, var(--accent-blue, #06b6d4) 0%, var(--alarm, #ef4444) 100%)',
              transition: 'width 0.2s linear',
            }}
          />

          {/* Event Node Dots */}
          {COLLAPSE_EVENTS.map((node, idx) => {
            const pct = (node.seconds / 90) * 100;
            const isNodePassed = currentSecond >= node.seconds;
            const isNodeActive = currentEvent?.seconds === node.seconds;

            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSecond(node.seconds);
                  setIsPlaying(false);
                }}
                style={{
                  position: 'absolute',
                  left: `calc(${pct}% - 6px)`,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: isNodePassed ? getBorderColorByType(node.type) : 'var(--bg-raised)',
                  border: `2px solid ${isNodeActive ? '#ffffff' : 'var(--border)'}`,
                  boxShadow: isNodeActive ? `0 0 10px ${getBorderColorByType(node.type)}` : 'none',
                  cursor: 'pointer',
                  zIndex: 10,
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
                title={`Saltar a ${node.time} (${node.seconds}s)`}
              />
            );
          })}
        </div>

        {/* Labels below timeline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          <span>12:32:00</span>
          <span style={{ color: currentSecond >= 60 ? 'var(--alarm, #ef4444)' : 'var(--text-secondary)' }}>12:33:00</span>
          <span>12:33:30</span>
        </div>
      </div>

      {/* CONTROLS AREA */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
        }}
      >
        {/* Play & Reset buttons */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={togglePlay}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: isPlaying ? 'rgba(0,0,0,0.1)' : 'var(--accent, #3b82f6)',
              color: isPlaying ? 'var(--text-primary)' : '#ffffff',
              border: `1px solid ${isPlaying ? 'var(--border)' : 'var(--accent)'}`,
              borderRadius: 'var(--radius-sm, 4px)',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.2s ease',
              boxShadow: isPlaying ? 'none' : '0 4px 14px rgba(59,130,246,0.35)',
            }}
          >
            {isPlaying ? '⏸ Pausar' : '▶ Iniciar Simulación'}
          </button>

          <button
            onClick={resetSimulation}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: 'var(--bg-raised)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm, 4px)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.2s ease',
            }}
          >
            ⟲ Reiniciar
          </button>
        </div>

        {/* Keyboard shortcut legend (hidden on small devices) */}
        <div
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            display: 'flex',
            gap: '1rem',
          }}
          className="hidden sm:flex"
        >
          <span>[Espacio] Play/Pausa</span>
          <span>[R] Reiniciar</span>
          <span>[1/2/5] Cambiar Velocidad</span>
        </div>

        {/* Speed multiplier selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Velocidad:
          </span>
          {[1, 2, 5].map((multiplier) => (
            <button
              key={multiplier}
              onClick={() => setSpeed(multiplier as 1 | 2 | 5)}
              style={{
                width: '32px',
                height: '24px',
                background: speed === multiplier ? 'var(--bg-surface)' : 'rgba(0,0,0,0.05)',
                border: speed === multiplier ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                borderRadius: '3px',
                color: speed === multiplier ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                fontWeight: speed === multiplier ? 'bold' : 'normal',
                transition: 'all 0.15s ease',
              }}
            >
              {multiplier}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollapseCountdown;
