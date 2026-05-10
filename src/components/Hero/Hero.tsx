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
  const { ref, inView } = useInView(0.1);
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
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.35)',
        margin: '0 0 2rem',
        textTransform: 'uppercase',
      }}>
        COMITÉ FORENSE · ETSI SEVILLA · 28 ABR 2025
      </p>

      {/* Headline */}
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 400,
        color: 'white',
        lineHeight: 1.15,
        maxWidth: '18ch',
        margin: '0 0 1rem',
        letterSpacing: '-0.01em',
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
      <p style={{
        fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
        color: 'rgba(255,255,255,0.5)',
        maxWidth: '56ch',
        lineHeight: 1.7,
        margin: '0 0 3rem',
        fontFamily: 'var(--font-mono)',
      }}>
        Análisis forense comparativo de las narrativas técnicas, regulatorias y
        operativas del apagón del 28 de abril de 2025. Cuatro informes.
        Tres versiones irreconciliables.
      </p>

      {/* Metrics grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        maxWidth: '800px',
        marginBottom: '3rem',
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
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/timeline')}
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
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
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

      {/* Bottom info bar */}
      <div style={{
        position: 'absolute',
        bottom: '2rem', left: 'clamp(1.5rem, 5vw, 5rem)',
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
