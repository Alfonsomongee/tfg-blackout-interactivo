import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp';
import { useInView } from '../../hooks/useInView';

const KEY_METRICS = [
  { value: 60, unit: 'M', label: 'personas sin suministro', decimals: 0 },
  { value: 82, unit: '%', label: 'penetración renovable no síncrona', decimals: 0 },
  { value: 15, unit: ' GW', label: 'generación perdida en < 90 s', decimals: 0 },
  { value: 2.3, unit: ' s', label: 'inercia síncrona del sistema', decimals: 1 },
];

function MetricCard({
  metric,
  delay,
  animate,
}: {
  metric: typeof KEY_METRICS[0];
  delay: number;
  animate: boolean;
}) {
  const [started, setStarted] = useState(false);
  const val = useCountUp(metric.value, 1200, started, metric.decimals);

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [animate, delay]);

  return (
    <div style={{
      padding: '1.25rem 1.5rem',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 'var(--radius-md)',
      transition: 'border-color 0.3s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-blue)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
    }}>
      <p style={{
        margin: '0 0 0.25rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '2rem',
        fontWeight: 600,
        color: 'white',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        {val.toFixed(metric.decimals)}{metric.unit}
      </p>
      <p style={{
        margin: 0,
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1.4,
      }}>
        {metric.label}
      </p>
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [seconds, setSeconds] = useState(0);
  const [metricsAnimated, setMetricsAnimated] = useState(false);

  // Animación de los 22 segundos del colapso
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev >= 22) {
          clearInterval(interval);
          return 22;
        }
        return prev + 1;
      });
    }, 80);
    setTimeout(() => setMetricsAnimated(true), 400);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div
      ref={ref}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0a0e1a 0%, #0d1520 50%, #0a0e1a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 5rem) clamp(1.5rem, 5vw, 5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}>

      {/* Grid background sutil */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Eyebrow */}
      <p className="hero-reveal" style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.35)',
        margin: '0 0 2rem',
        textTransform: 'uppercase',
        animationDelay: '0.05s',
      }}>
        COMITÉ FORENSE · ETSI SEVILLA · 28 ABR 2025
      </p>

      {/* Headline */}
      <h1 className="hero-reveal" style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 400,
        color: 'white',
        lineHeight: 1.15,
        maxWidth: '18ch',
        margin: '0 0 1rem',
        letterSpacing: '-0.01em',
        animationDelay: '0.15s',
      }}>
        ¿Por qué colapsó la red eléctrica ibérica en{' '}
        <span style={{
          color: 'var(--accent-blue)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
        }}>
          {seconds} segundos
        </span>
        ?
      </h1>

      {/* Subheadline */}
      <p className="hero-reveal" style={{
        fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
        color: 'rgba(255,255,255,0.5)',
        maxWidth: '56ch',
        lineHeight: 1.7,
        margin: '0 0 3rem',
        fontFamily: 'var(--font-mono)',
        animationDelay: '0.25s',
      }}>
        Análisis forense comparativo de las narrativas técnicas, regulatorias y
        operativas del apagón del 28 de abril de 2025. Cuatro informes.
        Tres versiones irreconciliables.
      </p>

      {/* Metrics grid */}
      <div className="hero-reveal" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        maxWidth: '800px',
        marginBottom: '3rem',
        animationDelay: '0.35s',
      }}>
        {KEY_METRICS.map((m, i) => (
          <MetricCard
            key={i}
            metric={m}
            delay={i * 150}
            animate={metricsAnimated}
          />
        ))}
      </div>

      {/* Divider */}
      <div style={{
        width: '48px', height: '1px',
        background: 'rgba(255,255,255,0.15)',
        marginBottom: '2rem',
      }} />

      {/* CTAs */}
      <div className="hero-reveal" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animationDelay: '0.45s' }}>
        <button
          className="btn-spring"
          onClick={() => navigate('/countdown')}
          style={{
            padding: '0.875rem 2rem',
            background: 'var(--accent-blue)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}>
          INICIAR ANÁLISIS FORENSE →
        </button>

        <button
          onClick={() => navigate('/brief')}
          style={{
            padding: '0.875rem 2rem',
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = 'white';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.4)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
          }}>
          RESUMEN EJECUTIVO
        </button>

        {/* TODO: Alfonso debe copiar su PDF a /public/tfg-blackout-2025.pdf */}
        <a
          href="/tfg-blackout-2025.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.875rem 2rem',
            background: 'transparent',
            color: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
          }}>
          ↓ DESCARGAR TFG (PDF)
        </a>
      </div>

      {/* Tribunal quick access */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.75rem',
        maxWidth: '720px',
      }}>
        {[
          { label: '⏱ 90 SEGUNDOS', desc: 'Colapso en tiempo real', path: '/countdown', color: 'var(--alarm)' },
          { label: '🔗 CADENA CAUSAL', desc: 'Las 5 fases del colapso', path: '/causal', color: 'var(--warning)' },
          { label: '🌊 CASCADA', desc: 'Visualización interactiva', path: '/cascada', color: 'var(--accent-blue)' },
          { label: '⚖️ VEREDICTO', desc: 'Conclusión forense', path: '/veredicto', color: 'var(--nominal)' },
        ].map((btn, i) => (
          <button
            key={i}
            className="btn-spring"
            onClick={() => navigate(btn.path)}
            style={{
              padding: '1rem',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${btn.color}40`,
              borderTop: `2px solid ${btn.color}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'white',
            }}
          >
            <p style={{
              margin: '0 0 0.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: btn.color,
              letterSpacing: '0.04em',
            }}>
              {btn.label}
            </p>
            <p style={{
              margin: 0,
              fontSize: '0.6875rem',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'var(--font-mono)',
            }}>
              {btn.desc}
            </p>
          </button>
        ))}
      </div>

      {/* GUÍA DE DEFENSA */}
      <div style={{
        marginTop: '3rem',
        padding: '1.25rem 1.5rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'var(--radius-md)',
        maxWidth: '680px',
      }}>
        <p style={{
          margin: '0 0 1rem',
          fontSize: '0.6875rem',
          fontFamily: 'var(--font-mono)',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.12em',
        }}>
          GUÍA DE DEFENSA — RECORRIDO EN 15 MINUTOS
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}>
          {[
            { step: '01', label: '90 Segundos', desc: 'El colapso en tiempo real', path: '/countdown', color: 'var(--alarm)' },
            { step: '02', label: 'Cadena Causal', desc: 'Las 5 fases del colapso', path: '/causal', color: 'var(--warning)' },
            { step: '03', label: 'Divergencias', desc: '5 ejes irreconciliables', path: '/divergencias', color: 'var(--accent-blue)' },
            { step: '04', label: 'Balance Q-V', desc: 'El déficit de −0,6 GVAr', path: '/reactiva', color: 'var(--warning)' },
            { step: '05', label: 'Trilema', desc: 'La solución estructural', path: '/trilema', color: 'var(--nominal)' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              style={{
                background: 'transparent',
                border: `1px solid rgba(255,255,255,0.06)`,
                borderLeft: `2px solid ${item.color}`,
                borderRadius: 'var(--radius-sm)',
                padding: '0.625rem 0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background =
                  'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background =
                  'transparent';
              }}>
              <p style={{
                margin: '0 0 0.125rem',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                color: item.color,
              }}>
                {item.step}
              </p>
              <p style={{
                margin: '0 0 0.125rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
              }}>
                {item.label}
              </p>
              <p style={{
                margin: 0,
                fontSize: '0.6875rem',
                color: 'rgba(255,255,255,0.35)',
              }}>
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom info bar */}
      <div style={{
        position: 'relative',
        marginTop: '3rem',
        right: 'clamp(1.5rem, 5vw, 5rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <p style={{
          margin: 0, fontSize: '0.6875rem',
          color: 'rgba(255,255,255,0.2)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
        }}>
          ALFONSO MONGE DÍAZ-ÁNGEL · GRADO EN INGENIERÍA DE LA ENERGÍA
        </p>
        <p style={{
          margin: 0, fontSize: '0.6875rem',
          color: 'rgba(255,255,255,0.2)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
        }}>
          DIRECTOR: DAVID TOMÁS SANCHEZ MARTÍNEZ · SEVILLA 2026
        </p>
      </div>
    </div>
  );
}
