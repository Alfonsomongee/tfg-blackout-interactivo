import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';
import NextChapter from '../NextChapter';

const METRICS = [
  { label: 'Potencia perdida', value: 15, unit: ' GW', desc: 'En menos de 90 segundos', color: 'var(--alarm)', decimals: 0 },
  { label: 'Personas afectadas', value: 60, unit: 'M', desc: 'Sin suministro eléctrico', color: 'var(--alarm)', decimals: 0 },
  { label: 'Penetración IBR', value: 82, unit: '%', desc: 'Solar + Eólica sin inercia física', color: 'var(--warning)', decimals: 0 },
  { label: 'Inercia síncrona', value: 2.3, unit: ' s', desc: 'Umbral mínimo seguro: 5 s', color: 'var(--warning)', decimals: 1 },
  { label: 'Ventana de colapso', value: 32.7, unit: ' s', desc: 'De oscilación a separación total', color: 'var(--alarm)', decimals: 1 },
  { label: 'Déficit reactivo', value: 0.6, unit: ' GVAr', desc: 'Balance Q-V negativo acumulado', color: 'var(--warning)', decimals: 1 },
  { label: 'RoCoF máximo', value: 1.8, unit: ' Hz/s', desc: 'Tasa de cambio de frecuencia', color: 'var(--alarm)', decimals: 1 },
  { label: 'Frecuencia mínima', value: 47.1, unit: ' Hz', desc: 'Nadir antes del colapso total', color: 'var(--alarm)', decimals: 1 },
  { label: 'Generación síncrona', value: 18, unit: '%', desc: 'Residual en el mix eléctrico', color: 'var(--nominal)', decimals: 0 },
  { label: 'Zonas separadas', value: 2, unit: '', desc: 'Zona Sur + Zona Centro', color: 'var(--accent-blue)', decimals: 0 },
  { label: 'Horas para reposición', value: 18, unit: ' h', desc: 'Al 95% del suministro peninsular', color: 'var(--warning)', decimals: 0 },
  { label: 'Coste económico est.', value: 1.6, unit: ' B€', desc: 'Impacto económico total estimado', color: 'var(--alarm)', decimals: 1 },
] as const;

type Metric = typeof METRICS[number];

function MetricCard({
  metric,
  delay,
  animate,
}: {
  metric: Metric;
  delay: number;
  animate: boolean;
}) {
  const [started, setStarted] = useState(false);
  const val = useCountUp(metric.value, 1500, started, metric.decimals);

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [animate, delay]);

  return (
    <div
      style={{
        padding: '1.25rem',
        background: 'var(--bg-raised)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = metric.color;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${metric.color}20`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ width: '24px', height: '3px', background: metric.color, borderRadius: '2px' }} />
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '2rem',
          fontWeight: 700,
          color: metric.color,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {val.toFixed(metric.decimals)}
        {metric.unit}
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
        }}
      >
        {metric.label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.4,
        }}
      >
        {metric.desc}
      </p>
    </div>
  );
}

export default function DataCardsShowcase() {
  const { ref, inView } = useInView(0.1);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (inView) setTimeout(() => setAnimate(true), 200);
  }, [inView]);

  return (
    <div ref={ref}>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          PANEL DE MÉTRICAS · COLAPSO 28-A
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Datos del Colapso
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          12 métricas clave del apagón del 28 de abril de 2025, extraídas de los informes técnicos
          de REE, ENTSO-E y el análisis forense comparativo.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {METRICS.map((m, i) => (
          <MetricCard key={i} metric={m} delay={i * 80} animate={animate} />
        ))}
      </div>

      <NextChapter
        path="/timeline-moment"
        label="Los 33 Segundos"
        desc="Recorre el colapso segundo a segundo con control deslizante"
      />
    </div>
  );
}
