import React, { useState } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import NextChapter from '../NextChapter';

// Flujo España→Francia (MW positivo = exportación, negativo = importación)
// Datos extraídos del Informe Gobierno de España (pp.35-48)
const FLOW_DATA = [
  { t: '00:00', flow: 2590, label: null },
  { t: '06:00', flow: 2100, label: null },
  { t: '12:03', flow: 1600, label: 'Oscilación 0,6 Hz' },
  { t: '12:11', flow: 2545, label: 'HVDC → PMODE' },
  { t: '12:20', flow: 2000, label: 'Reducción solicitada' },
  { t: '12:27', flow: 1000, label: 'Reducción ejecutada' },
  { t: '12:30', flow: 1000, label: 'Estado pre-colapso' },
  { t: '12:32', flow: 900, label: null },
  { t: '12:33:20', flow: 0, label: 'Flujo cero' },
  { t: '12:33:20.5', flow: -5587, label: 'Pico importador (oscilatorio)' },
  { t: '12:33:23', flow: -3000, label: null },
  { t: '12:33:24', flow: 0, label: 'HVDC bloqueado' },
  { t: '12:44', flow: 0, label: 'Hernani activo' },
];



const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: typeof FLOW_DATA[0] }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const entry = payload[0].payload;
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
      <p
        style={{
          margin: '0 0 0.125rem',
          fontWeight: 700,
          color: val >= 0 ? 'var(--nominal)' : 'var(--alarm)',
        }}
      >
        {val >= 0 ? '+' : ''}
        {val.toLocaleString('es-ES')} MW
      </p>
      <p
        style={{
          margin: 0,
          color: val >= 0 ? 'var(--nominal)' : 'var(--alarm)',
          fontSize: '0.625rem',
        }}
      >
        {val >= 0 ? 'España exporta → Francia' : 'España importa ← Francia'}
      </p>
      {entry.label && (
        <p style={{ margin: '0.25rem 0 0', color: 'var(--warning)', fontSize: '0.625rem' }}>
          {entry.label}
        </p>
      )}
    </div>
  );
};

const PHASES = [
  {
    title: 'Exportación normal',
    time: '00:00 – 12:03',
    flow: '2.590 → 1.600 MW',
    color: 'var(--nominal)',
    desc: 'España exporta electricidad a Francia durante toda la madrugada y mañana, reduciendo gradualmente el programa.',
  },
  {
    title: 'HVDC en PMODE',
    time: '12:11 CEST',
    flow: '~2.545 MW fijo',
    color: 'var(--warning)',
    desc: 'La interconexión HVDC pasa a modo de flujo DC fijo (PMODE). El flujo queda "rígido" durante las oscilaciones, incapaz de amortiguar variaciones de potencia.',
  },
  {
    title: 'Reducción del programa',
    time: '12:20 – 12:27 CEST',
    flow: '2.545 → 1.000 MW',
    color: 'var(--warning)',
    desc: 'REE solicita a REN reducir el intercambio. El programa se reduce de 2.545 a 1.000 MW. España sigue siendo exportadora neta.',
  },
  {
    title: 'Inversión del flujo',
    time: '12:33:20 CEST',
    flow: '0 → −5.587 MW',
    color: 'var(--alarm)',
    desc: 'Durante el colapso, el flujo se invierte violentamente. España pasa a importar hasta 5.587 MW desde Francia en un pico oscilatorio antes de la pérdida de sincronismo.',
  },
  {
    title: 'Bloqueo HVDC',
    time: '12:33:23-24 CEST',
    flow: 'Bloqueado',
    color: '#8B0000',
    desc: 'Pérdida de sincronismo España-Francia (12:33:23). Tensión colapsa en Santa Llogaia 400 kV. HVDC se bloquea automáticamente. Cesa toda transmisión.',
  },
];

function InterconexionViz() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          INTERCONEXIÓN ESPAÑA-FRANCIA · FLUJOS DE POTENCIA 28 ABR 2025
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Flujo HVDC España-Francia durante el Colapso
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          Evolución del intercambio de potencia España↔Francia el 28 de abril de 2025.
          El flujo pasó de 2.590 MW exportador a −5.587 MW importador en segundos, antes
          del bloqueo del HVDC en Santa Llogaia a las 12:33:23 CEST.
        </p>
      </header>

      {/* Flow chart */}
      <div
        className="surface"
        style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}
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
          FLUJO MW — POSITIVO = EXPORTACIÓN ESPAÑA→FRANCIA
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={FLOW_DATA} margin={{ top: 20, right: 20, left: 10, bottom: 8 }}>
            <defs>
              <linearGradient id="flowGradPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--nominal)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--nominal)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="flowGradNeg" x1="0" y1="1" x2="0" y2="0">
                <stop offset="5%" stopColor="var(--alarm)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--alarm)" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: 'var(--text-secondary)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)} GW`}
              domain={[-6500, 3500]}
            />
            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={0}
              stroke="var(--border)"
              strokeWidth={1.5}
              label={{
                value: '0 MW',
                position: 'insideTopLeft',
                style: {
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  fill: 'var(--text-muted)',
                },
              }}
            />
            <ReferenceLine
              x="12:11"
              stroke="var(--warning)"
              strokeDasharray="4 3"
              label={{
                value: 'PMODE',
                position: 'top',
                style: { fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--warning)' },
              }}
            />
            <ReferenceLine
              x="12:33:20"
              stroke="var(--alarm)"
              strokeDasharray="3 3"
              label={{
                value: '−5587 MW',
                position: 'insideBottomRight',
                style: { fontFamily: 'var(--font-mono)', fontSize: 8, fill: 'var(--alarm)' },
              }}
            />
            <ReferenceLine
              x="12:33:24"
              stroke="#8B0000"
              strokeDasharray="3 3"
              label={{
                value: 'BLOQUEADO',
                position: 'top',
                style: { fontFamily: 'var(--font-mono)', fontSize: 8, fill: '#8B0000' },
              }}
            />

            <Area
              type="monotone"
              dataKey="flow"
              stroke="none"
              fill="url(#flowGradPos)"
              baseValue={0}
            />
            <Line
              type="monotone"
              dataKey="flow"
              stroke="var(--accent-blue)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: 'var(--accent-blue)', stroke: 'none' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* SVG schematic Spain-France */}
      <div
        className="glass-panel"
        style={{ padding: '1.25rem', marginBottom: '1.5rem' }}
      >
        <p
          style={{
            marginBottom: '0.875rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.1em',
          }}
        >
          ESQUEMA DE INTERCONEXIÓN — SANTA LLOGAIA (ES) ↔ BAIXAS (FR)
        </p>
        <svg viewBox="0 0 600 140" width="100%" style={{ display: 'block' }} aria-label="Esquema interconexión España-Francia">
          {/* Spain block */}
          <rect x="20" y="30" width="180" height="80" rx="8" fill="rgba(46,110,193,0.15)" stroke="var(--accent-blue)" strokeWidth="1.5" />
          <text x="110" y="62" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill="var(--text-primary)">ESPAÑA</text>
          <text x="110" y="82" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-secondary)">Santa Llogaia 400 kV</text>
          <text x="110" y="98" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-secondary)">Hernani · Vic</text>

          {/* France block */}
          <rect x="400" y="30" width="180" height="80" rx="8" fill="rgba(16,185,129,0.12)" stroke="var(--nominal)" strokeWidth="1.5" />
          <text x="490" y="62" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill="var(--text-primary)">FRANCE</text>
          <text x="490" y="82" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-secondary)">Baixas 400 kV</text>
          <text x="490" y="98" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-secondary)">Tavel · Loony · Albertville</text>

          {/* HVDC line */}
          <line x1="200" y1="70" x2="400" y2="70" stroke="var(--accent-blue)" strokeWidth="3" strokeDasharray="8 4" />

          {/* Arrow export (normal) */}
          <polygon points="380,62 400,70 380,78" fill="var(--nominal)" opacity="0.9" />

          {/* HVDC label */}
          <text x="300" y="55" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="var(--accent-blue)">HVDC INELFE</text>
          <text x="300" y="68" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--text-secondary)">2.000 MW × 2 circuitos</text>

          {/* Pyrenees label */}
          <line x1="298" y1="18" x2="302" y2="125" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="2 2" />
          <text x="300" y="14" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--text-muted)">PIRINEOS</text>

          {/* Status label */}
          <rect x="220" y="88" width="160" height="22" rx="4" fill="rgba(255,32,32,0.1)" />
          <text x="300" y="103" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" fill="var(--alarm)">BLOQUEADO 12:33:24</text>
        </svg>
      </div>

      {/* Phase timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
        {PHASES.map((phase, i) => {
          const isSelected = selectedPhase === i;
          return (
            <button
              key={i}
              onClick={() => setSelectedPhase(isSelected ? null : i)}
              aria-expanded={isSelected}
              style={{
                padding: '1rem 1.25rem',
                background: isSelected ? 'var(--bg-raised)' : 'rgba(255,255,255,0.01)',
                border: `1px solid ${isSelected ? phase.color : 'var(--border)'}`,
                borderLeft: `3px solid ${phase.color}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {phase.title}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: phase.color,
                      }}
                    >
                      {phase.time}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--text-secondary)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '0.125rem 0.375rem',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {phase.flow}
                    </span>
                  </div>
                  {isSelected && (
                    <p
                      style={{
                        margin: '0.375rem 0 0',
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                      }}
                    >
                      {phase.desc}
                    </p>
                  )}
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', flexShrink: 0 }}>
                  {isSelected ? '▲' : '▼'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Key data */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        {[
          { label: 'Flujo máximo exportador', value: '2.590 MW', color: 'var(--nominal)', t: '00:00' },
          { label: 'Pico importador máximo', value: '−5.587 MW', color: 'var(--alarm)', t: '12:33:20' },
          { label: 'Pérdida sincronismo', value: '12:33:23', color: '#8B0000', t: '260 ms' },
          { label: 'HVDC bloqueado', value: '12:33:24', color: '#8B0000', t: '960 ms' },
          { label: 'Primer flujo reposición', value: '12:44 CEST', color: 'var(--accent-blue)', t: 'Hernani' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: '0.875rem',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderTop: `2px solid ${item.color}`,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <p
              style={{
                margin: '0 0 0.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 700,
                color: item.color,
                lineHeight: 1,
              }}
            >
              {item.value}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.35,
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                margin: '0.25rem 0 0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'var(--text-muted)',
              }}
            >
              {item.t}
            </p>
          </div>
        ))}
      </div>

      <NextChapter
        path="/reforms"
        label="Historial de Reformas"
        desc="El estado de implementación de las reformas regulatorias post-colapso"
      />
    </div>
  );
}

export default React.memo(InterconexionViz);
