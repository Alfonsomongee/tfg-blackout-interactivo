import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import NextChapter from '../NextChapter';

// Estado a las 12:30 — Informe Gobierno de España, p.40
const MIX_28A = [
  { name: 'Solar FV', value: 55, mw: 13850, color: '#F59E0B', inercia: false },
  { name: 'Eólica', value: 13, mw: 3275, color: '#3B82F6', inercia: false },
  { name: 'Hidráulica', value: 14, mw: 3530, color: '#06B6D4', inercia: true },
  { name: 'Nuclear', value: 10, mw: 2520, color: '#8B5CF6', inercia: true },
  { name: 'Gas (CCGT)', value: 3, mw: 755, color: '#6B7280', inercia: true },
  { name: 'Carbón', value: 1, mw: 252, color: '#374151', inercia: true },
  { name: 'Cogeneración', value: 4, mw: 1008, color: '#10B981', inercia: true },
];

// Mix típico 2024 (referencia)
const MIX_2024 = [
  { name: 'Solar FV', value: 25, color: '#F59E0B', inercia: false },
  { name: 'Eólica', value: 25, color: '#3B82F6', inercia: false },
  { name: 'Hidráulica', value: 12, color: '#06B6D4', inercia: true },
  { name: 'Nuclear', value: 20, color: '#8B5CF6', inercia: true },
  { name: 'Gas (CCGT)', value: 12, color: '#6B7280', inercia: true },
  { name: 'Carbón', value: 2, color: '#374151', inercia: true },
  { name: 'Cogeneración', value: 4, color: '#10B981', inercia: true },
];

// Disponibilidad de potencia (MW)
const DISPONIBILIDAD = [
  { grupo: 'CCGT', acoplada: 755, indisponible: 7400 },
  { grupo: 'Nuclear', acoplada: 2520, indisponible: 3000 },
  { grupo: 'Carbón', acoplada: 252, indisponible: 800 },
  { grupo: 'Solar FV', acoplada: 13850, indisponible: 0 },
  { grupo: 'Eólica', acoplada: 3275, indisponible: 0 },
  { grupo: 'Hidráulica', acoplada: 3530, indisponible: 600 },
];

const CustomTooltipPie = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: typeof MIX_28A[0] }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.75rem 1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
      }}
    >
      <p style={{ margin: '0 0 0.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {d.name}
      </p>
      <p style={{ margin: '0 0 0.125rem', color: 'var(--text-secondary)' }}>
        {d.value}% del mix
      </p>
      {'mw' in d && (
        <p style={{ margin: '0 0 0.125rem', color: 'var(--text-secondary)' }}>
          {d.mw.toLocaleString('es-ES')} MW
        </p>
      )}
      {'inercia' in d && (
        <p
          style={{
            margin: '0.25rem 0 0',
            color: d.inercia ? 'var(--nominal)' : 'var(--alarm)',
            fontWeight: 600,
          }}
        >
          {d.inercia ? '✓ Aporta inercia síncrona' : '✗ Sin inercia síncrona (IBR)'}
        </p>
      )}
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  value = 0,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  value?: number;
  name?: string;
}) => {
  if (value < 5) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontFamily="var(--font-mono)"
      fontWeight={700}
    >
      {`${value}%`}
    </text>
  );
};

function MixGeneracion() {
  const [view, setView] = useState<'28a' | '2024' | 'compare'>('28a');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const pctSinInercia28A = MIX_28A.filter(d => !d.inercia).reduce(
    (s, d) => s + d.value,
    0
  );

  const pieData = view === '2024' ? MIX_2024 : MIX_28A;

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          MIX ENERGÉTICO · ESTADO 12:30 CEST — INFORME GOBIERNO P.40
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Mix de Generación el 28-A
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          El {pctSinInercia28A}% del mix eléctrico estaba formado por recursos basados en
          inversores (IBR) — solar fotovoltaica y eólica — sin inercia síncrona física. Demanda
          peninsular: 25.184 MW. Precio de mercado: 18,50 €/MWh.
        </p>
      </header>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {([['28a', 'Mix 28-A (12:30)'], ['2024', 'Mix típico 2024'], ['compare', 'Disponibilidad']] as const).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              style={{
                padding: '0.5rem 1rem',
                background: view === key ? 'var(--accent-blue)' : 'transparent',
                color: view === key ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${view === key ? 'var(--accent-blue)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          )
        )}
      </div>

      {view !== 'compare' ? (
        <div
          className="surface"
          style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* Pie chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={130}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                    stroke={activeIndex === index ? 'white' : 'transparent'}
                    strokeWidth={2}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend with inertia indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p
              style={{
                margin: '0 0 0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
              }}
            >
              {view === '28a' ? 'MIX 28 DE ABRIL — 12:30 CEST' : 'MIX PROMEDIO 2024'}
            </p>
            {pieData.map((d, i) => (
              <div
                key={d.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  opacity: activeIndex === null || activeIndex === i ? 1 : 0.4,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    background: d.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-primary)',
                    flex: 1,
                  }}
                >
                  {d.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    minWidth: '32px',
                    textAlign: 'right',
                  }}
                >
                  {d.value}%
                </span>
                {'inercia' in d && (
                  <span
                    style={{
                      fontSize: '0.625rem',
                      color: d.inercia ? 'var(--nominal)' : 'var(--alarm)',
                      minWidth: '12px',
                    }}
                  >
                    {d.inercia ? 'H' : '∅'}
                  </span>
                )}
              </div>
            ))}
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.625rem 0.875rem',
                background: 'rgba(255,32,32,0.05)',
                border: '1px solid rgba(255,32,32,0.2)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--alarm)',
                }}
              >
                H = inercia síncrona &nbsp;·&nbsp; ∅ = sin inercia (IBR)
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Disponibilidad bar chart */
        <div
          className="surface"
          style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <p
            style={{
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.1em',
            }}
          >
            POTENCIA ACOPLADA VS INDISPONIBLE (MW) — 12:30 CEST
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DISPONIBILIDAD} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <XAxis
                dataKey="grupo"
                tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)' }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis
                tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)' }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)} GW`}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                }}
                formatter={(v: unknown, name: unknown) => [
                  `${(v as number).toLocaleString('es-ES')} MW`,
                  name === 'acoplada' ? 'Acoplada' : 'Indisponible',
                ]}
              />
              <Legend
                wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                formatter={(value: string) =>
                  value === 'acoplada' ? 'Potencia acoplada' : 'Potencia indisponible'
                }
              />
              <Bar dataKey="acoplada" fill="var(--accent-blue)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="indisponible" fill="var(--alarm)" radius={[3, 3, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insight card */}
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
          IMPLICACIÓN FORENSE — INERCIA CERO EN EL {pctSinInercia28A}% DEL MIX
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          El {pctSinInercia28A}% del mix (solar FV + eólica) opera mediante inversores de
          electrónica de potencia que no aportan inercia síncrona al sistema. Esa inercia es la
          "masa de volante" del sistema eléctrico que resiste los cambios bruscos de frecuencia.
          Con solo un 18% de generación síncrona activa, el RoCoF ante la pérdida de generación
          superó el umbral de actuación de las protecciones en 32,7 segundos.
        </p>
      </div>

      <NextChapter
        path="/medidas-propuestas"
        label="Medidas Propuestas"
        desc="Las 16 medidas del Gobierno para prevenir un nuevo colapso"
      />
    </div>
  );
}

export default React.memo(MixGeneracion);
