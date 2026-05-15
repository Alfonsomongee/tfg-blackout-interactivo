import { useEffect, useRef, useState } from 'react';
import NextChapter from '../NextChapter';

type NodeStatus = 'stable' | 'alert' | 'critical' | 'failed';

interface CascadeNode {
  id: string;
  x: number;
  y: number;
  title: string;
  detail: string;
  status: NodeStatus;
}

// Coordinates are in the SVG viewBox space (1000 x 660)
const NODES: CascadeNode[] = [
  { id: 'sync', x: 500, y: 60, title: 'Generación síncrona', detail: '18 % del mix · inercia residual', status: 'stable' },
  { id: 'ibr', x: 500, y: 170, title: '82 % IBR (Solar + Eólica)', detail: 'Inversores sin inercia física', status: 'stable' },
  { id: 'volt', x: 500, y: 280, title: 'Oscilación de tensión', detail: 'Subestaciones colectoras · déficit −0,6 GVAr', status: 'alert' },
  { id: 'scada', x: 500, y: 390, title: 'Disparo de protecciones', detail: 'SCADA · desconexión en cascada', status: 'critical' },
  { id: 'south', x: 250, y: 500, title: 'Zona Sur', detail: 'Inercia 1,30 s · colapso de frecuencia', status: 'critical' },
  { id: 'centre', x: 750, y: 500, title: 'Zona Centro', detail: 'Inercia 1,84 s · separación', status: 'critical' },
  { id: 'collapse', x: 500, y: 610, title: 'COLAPSO PENINSULAR', detail: '≈ 15 GW perdidos · 60 M sin suministro', status: 'failed' },
];

const CONNECTIONS: Array<[string, string]> = [
  ['sync', 'ibr'],
  ['ibr', 'volt'],
  ['volt', 'scada'],
  ['scada', 'south'],
  ['scada', 'centre'],
  ['south', 'collapse'],
  ['centre', 'collapse'],
];

const STATUS_COLOR: Record<NodeStatus, string> = {
  stable: 'var(--nominal)',
  alert: 'var(--warning)',
  critical: 'var(--alarm)',
  failed: '#8B0000',
};

// Forensic timeline of the collapse window (CEST)
const PHASE_TIME = [
  '12:32:57.000',
  '12:33:12.300',
  '12:33:21.600',
  '12:33:24.100',
  '12:33:27.400',
  '12:33:28.900',
  '12:33:29.741',
];

const STEP_MS = 1100;

export default function CascadaVisualization() {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = window.setInterval(() => {
      setPhase((p) => {
        if (p >= NODES.length - 1) {
          setPlaying(false);
          return p;
        }
        return p + 1;
      });
    }, STEP_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [playing]);

  const nodeIndex = (id: string) => NODES.findIndex((n) => n.id === id);
  const isReached = (id: string) => phase >= nodeIndex(id);
  const isLeadingEdge = (id: string) => phase === nodeIndex(id);

  const reset = () => {
    setPlaying(false);
    setPhase(0);
  };

  const current = NODES[phase];

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          VISUALIZACIÓN FORENSE · CASCADA DE COLAPSO
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Cascada de colapso en tiempo real
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          Reconstrucción secuencial del colapso del sistema eléctrico peninsular
          del 28 de abril de 2025. La pérdida de inercia síncrona acelera el
          RoCoF hasta que las protecciones desconectan generación en cascada en
          una ventana de 33 segundos.
        </p>
      </header>

      <div
        className="surface"
        style={{ padding: '1.5rem', position: 'relative' }}
      >
        <svg
          viewBox="0 0 1000 680"
          width="100%"
          style={{ display: 'block', maxHeight: '70vh' }}
          role="img"
          aria-label={`Diagrama de cascada de colapso, fase ${phase + 1} de ${NODES.length}: ${current.title}`}
        >
          {/* Connections */}
          {CONNECTIONS.map(([from, to], i) => {
            const a = NODES[nodeIndex(from)];
            const b = NODES[nodeIndex(to)];
            const active = isReached(to);
            return (
              <line
                key={`c-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? 'var(--alarm)' : 'var(--border)'}
                strokeWidth={active ? 3 : 1.5}
                strokeDasharray={active ? '0' : '6 6'}
                className={active ? 'glow-line' : undefined}
                style={{ transition: 'stroke 0.4s ease, stroke-width 0.4s ease' }}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const reached = isReached(node.id);
            const lead = isLeadingEdge(node.id);
            const color = reached ? STATUS_COLOR[node.status] : 'var(--border)';
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={reached ? 26 : 20}
                  fill={reached ? color : 'var(--bg-raised)'}
                  stroke={color}
                  strokeWidth={2}
                  className={lead && node.status !== 'stable' ? 'critical-node' : undefined}
                  style={{ transition: 'r 0.4s ease, fill 0.4s ease, stroke 0.4s ease' }}
                />
                <text
                  x={node.x}
                  y={node.y - 38}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight={reached ? 700 : 500}
                  fill="var(--text-primary)"
                  style={{ fontFamily: 'var(--font-mono)', transition: 'fill 0.3s ease' }}
                >
                  {node.title}
                </text>
                <text
                  x={node.x}
                  y={node.y + 50}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--text-secondary)"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {node.detail}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          margin: '1.5rem 0',
          flexWrap: 'wrap',
        }}
        data-no-print
      >
        <button
          className="btn-spring"
          onClick={() => setPlaying((p) => !p)}
          disabled={phase >= NODES.length - 1}
          style={{
            padding: '0.75rem 1.75rem',
            background: 'var(--accent-blue)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: phase >= NODES.length - 1 ? 'not-allowed' : 'pointer',
            opacity: phase >= NODES.length - 1 ? 0.4 : 1,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            letterSpacing: '0.06em',
          }}
        >
          {playing ? '⏸ PAUSAR' : '▶ REPRODUCIR'}
        </button>
        <button
          className="btn-spring"
          onClick={() => setPhase((p) => Math.min(p + 1, NODES.length - 1))}
          disabled={playing || phase >= NODES.length - 1}
          style={{
            padding: '0.75rem 1.75rem',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            letterSpacing: '0.06em',
          }}
        >
          ⏭ PASO
        </button>
        <button
          className="btn-spring"
          onClick={reset}
          style={{
            padding: '0.75rem 1.75rem',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            letterSpacing: '0.06em',
          }}
        >
          ⏮ REINICIAR
        </button>
      </div>

      {/* Status readout */}
      <div
        className="glass-panel"
        style={{ padding: '1.25rem 1.5rem', display: 'grid', gap: '0.5rem' }}
        aria-live="polite"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span
            className="t-eyebrow"
            style={{ color: STATUS_COLOR[current.status] }}
          >
            FASE {phase + 1} / {NODES.length} — {current.title}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: 'var(--text-mono)',
            }}
          >
            T = {PHASE_TIME[phase]} CEST
          </span>
        </div>
        <p className="t-body-sm" style={{ margin: 0 }}>
          {current.detail}
        </p>
      </div>

      <NextChapter
        path="/causal"
        label="Cadena Causal"
        desc="Las 5 fases del colapso analizadas en detalle"
      />
    </div>
  );
}
