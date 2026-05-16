import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import NextChapter from '../NextChapter';

const DATA = [
  { date: 'Ene 24', inertia: 8.2 },
  { date: 'Feb 24', inertia: 7.9 },
  { date: 'Mar 24', inertia: 7.4 },
  { date: 'Abr 24', inertia: 7.1 },
  { date: 'May 24', inertia: 6.8 },
  { date: 'Jun 24', inertia: 6.4 },
  { date: 'Jul 24', inertia: 6.3 },
  { date: 'Ago 24', inertia: 5.9 },
  { date: 'Sep 24', inertia: 5.6 },
  { date: 'Oct 24', inertia: 5.1 },
  { date: 'Nov 24', inertia: 4.7 },
  { date: 'Dic 24', inertia: 4.2 },
  { date: 'Ene 25', inertia: 3.9 },
  { date: 'Feb 25', inertia: 3.6 },
  { date: 'Mar 25', inertia: 3.4 },
  { date: 'Abr 25', inertia: 3.1 },
  { date: '28-A', inertia: 2.3, isEvent: true },
];

const CustomDot = (props: {
  cx?: number;
  cy?: number;
  payload?: { isEvent?: boolean };
}) => {
  const { cx, cy, payload } = props;
  if (!payload?.isEvent || cx === undefined || cy === undefined) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="var(--alarm)" stroke="white" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={14} fill="none" stroke="var(--alarm)" strokeWidth={1} opacity={0.4} />
    </g>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.625rem 0.875rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
      }}
    >
      <p style={{ margin: '0 0 0.25rem', color: 'var(--text-secondary)' }}>{label}</p>
      <p style={{ margin: 0, color: 'var(--accent-blue)', fontWeight: 700 }}>
        H = {payload[0].value.toFixed(1)} s
      </p>
    </div>
  );
};

export default function InertiaGraph() {
  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          ANÁLISIS DE INERCIA · ENE 2024 – 28 ABR 2025
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Colapso de la Inercia Síncrona
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          Evolución de la constante de inercia síncrona H del sistema peninsular durante el año
          previo al colapso. Cuando la penetración IBR superó el 80%, la inercia cayó por debajo
          del umbral crítico de 5 s establecido por ENTSO-E.
        </p>
      </header>

      <div
        className="surface"
        style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}
      >
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={DATA} margin={{ top: 24, right: 24, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="inertiaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--alarm)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--alarm)" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              label={{
                value: 'Inercia H (s)',
                angle: -90,
                position: 'insideLeft',
                offset: 8,
                style: {
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fill: 'var(--text-secondary)',
                },
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={5}
              stroke="var(--warning)"
              strokeDasharray="6 4"
              label={{
                value: 'Umbral ENTSO-E (5 s)',
                position: 'insideTopRight',
                style: {
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fill: 'var(--warning)',
                },
              }}
            />
            <ReferenceLine
              y={2.3}
              stroke="var(--alarm)"
              strokeDasharray="3 3"
              label={{
                value: '28-A: 2,3 s',
                position: 'insideBottomRight',
                style: {
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fill: 'var(--alarm)',
                },
              }}
            />

            <Area
              type="monotone"
              dataKey="inertia"
              stroke="var(--accent-blue)"
              strokeWidth={2.5}
              fill="url(#inertiaGrad)"
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: 'var(--accent-blue)', stroke: 'none' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2.5px', background: 'var(--accent-blue)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Inercia síncrona H (s)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '20px',
              borderTop: '2px dashed var(--warning)',
              opacity: 0.9,
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>Umbral mínimo ENTSO-E (5 s)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--alarm)',
              border: '2px solid white',
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>Valor el 28-A (2,3 s)</span>
        </div>
      </div>

      {/* Insight callout */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: 'rgba(255,32,32,0.04)',
          border: '1px solid rgba(255,32,32,0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
        }}
      >
        <p
          style={{
            margin: '0 0 0.375rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.1em',
            color: 'var(--alarm)',
          }}
        >
          ANÁLISIS FORENSE — TENDENCIA
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          La inercia síncrona H cayó un 72% en 16 meses — de 8,2 s a 2,3 s. El sistema peninsular
          cruzó el umbral crítico de ENTSO-E (5 s) en octubre de 2024, seis meses antes del
          colapso. Ningún protocolo de contingencia fue activado durante ese periodo.
        </p>
      </div>

      <NextChapter
        path="/comparador-arrastra"
        label="Comparador Institucional"
        desc="Ordena por responsabilidad las posiciones de cada actor del 28-A"
      />
    </div>
  );
}
