import { useState } from 'react';
import NextChapter from '../NextChapter';
import TooltipTerm from '../TooltipTerm';

const TRIANGLE_POINTS = {
  descarbonizacion: { x: 350, y: 50 },
  estabilidad: { x: 80, y: 490 },
  coste: { x: 620, y: 490 },
};

// Función para interpolar posición dentro del triángulo
// position: { descarbonizacion: 0-1, estabilidad: 0-1, coste: 0-1 }
// (suma debe ser 1)
function triPoint(d: number, e: number, c: number) {
  const p = TRIANGLE_POINTS;
  return {
    x: p.descarbonizacion.x * d + p.estabilidad.x * e + p.coste.x * c,
    y: p.descarbonizacion.y * d + p.estabilidad.y * e + p.coste.y * c,
  };
}

const AGENTS = [
  {
    label: 'Gobierno / REE',
    color: 'var(--info)',
    // Alta descarbonización, estabilidad media, coste controlado
    pos: triPoint(0.5, 0.3, 0.2),
    desc: 'Prioridad a la descarbonización. Estabilidad gestionada mediante normativa. Coste contenido por mercado.',
  },
  {
    label: 'ICAI / AELEC',
    color: 'var(--alarm)',
    // Alta descarbonización, estabilidad crítica, coste secundario
    pos: triPoint(0.35, 0.55, 0.10),
    desc: 'La estabilidad es condición previa no negociable. Sin Grid-Forming y compensadores síncronos, la descarbonización es insegura.',
  },
  {
    label: 'ENTSO-E',
    color: 'var(--warning)',
    // Balance equilibrado con solución técnica GFM
    pos: triPoint(0.40, 0.35, 0.25),
    desc: 'Los tres objetivos son simultáneamente alcanzables con NC RfG 2.0 (Grid-Forming obligatorio ≥ 1 MW).',
  },
  {
    label: '★ Solución GFM (NC RfG 2.0)',
    color: 'var(--nominal)',
    // Centro del triángulo: balance óptimo
    pos: triPoint(0.37, 0.37, 0.26),
    desc: 'Grid-Forming obligatorio ≥ 1 MW. Inercia sintética mandatoria. Control dinámico de V y Q. La única vía que no sacrifica ningún vértice del trilema.',
  },
];

export default function EnergyTrilemma() {
  const [hovered, setHovered] = useState<number | null>(null);

  const tp = TRIANGLE_POINTS;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 3rem' }}>
      <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>
        Cap. 9 — Conclusiones
      </p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
        fontWeight: 400, color: 'var(--text-primary)', marginBottom: '0.5rem',
      }}>
        El trilema de la transición energética
      </h2>
      <p className="t-body" style={{ maxWidth: '620px', marginBottom: '2.5rem' }}>
        La transición hacia una red basada en <TooltipTerm term="IBR">IBR</TooltipTerm> exige maximizar simultáneamente 
        Descarbonización, Estabilidad y Coste. La integración masiva de <TooltipTerm term="HVDC">HVDC</TooltipTerm> y 
        generación renovable sin control de tensión adecuado provocó el fallo del 28-A. Cada agente 
        sitúa su solución en un punto distinto del trilema.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'start',
      }}>
        {/* SVG Triángulo */}
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <svg
            viewBox="0 0 700 560"
            role="img"
            aria-label="Trilema energético de la transición: Descarbonización, Estabilidad y Coste"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}>
            {/* Fondo */}
            <rect width="700" height="560" fill="transparent" />

            {/* Triángulo principal */}
            <polygon
              points={`${tp.descarbonizacion.x},${tp.descarbonizacion.y} ${tp.estabilidad.x},${tp.estabilidad.y} ${tp.coste.x},${tp.coste.y}`}
              fill="rgba(59,130,246,0.04)"
              stroke="var(--border)"
              strokeWidth="2"
            />

            {/* Líneas internas (grid) */}
            {[0.33, 0.67].map((t, i) => (
              <g key={i}>
                <line
                  x1={tp.descarbonizacion.x * t + tp.estabilidad.x * (1 - t)}
                  y1={tp.descarbonizacion.y * t + tp.estabilidad.y * (1 - t)}
                  x2={tp.descarbonizacion.x * t + tp.coste.x * (1 - t)}
                  y2={tp.descarbonizacion.y * t + tp.coste.y * (1 - t)}
                  stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"
                />
                <line
                  x1={tp.estabilidad.x * t + tp.descarbonizacion.x * (1 - t)}
                  y1={tp.estabilidad.y * t + tp.descarbonizacion.y * (1 - t)}
                  x2={tp.estabilidad.x * t + tp.coste.x * (1 - t)}
                  y2={tp.estabilidad.y * t + tp.coste.y * (1 - t)}
                  stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"
                />
                <line
                  x1={tp.coste.x * t + tp.descarbonizacion.x * (1 - t)}
                  y1={tp.coste.y * t + tp.descarbonizacion.y * (1 - t)}
                  x2={tp.coste.x * t + tp.estabilidad.x * (1 - t)}
                  y2={tp.coste.y * t + tp.estabilidad.y * (1 - t)}
                  stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" opacity="0.5"
                />
              </g>
            ))}

            {/* Etiquetas de vértices */}
            <text x={tp.descarbonizacion.x} y={tp.descarbonizacion.y - 16}
              textAnchor="middle" fill="var(--accent-blue)"
              fontSize="13" fontFamily="var(--font-mono)" fontWeight="600">
              DESCARBONIZACIÓN
            </text>
            <text x={tp.estabilidad.x} y={tp.estabilidad.y + 24}
              textAnchor="middle" fill="var(--alarm)"
              fontSize="13" fontFamily="var(--font-mono)" fontWeight="600">
              ESTABILIDAD
            </text>
            <text x={tp.coste.x} y={tp.coste.y + 24}
              textAnchor="middle" fill="var(--nominal)"
              fontSize="13" fontFamily="var(--font-mono)" fontWeight="600">
              COSTE
            </text>

            {/* Puntos de agentes */}
            {AGENTS.map((agent, i) => (
              <g key={i}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}>
                <circle
                  cx={agent.pos.x} cy={agent.pos.y}
                  r={hovered === i ? 14 : 10}
                  fill={agent.color}
                  opacity={hovered === i ? 1 : 0.85}
                  style={{ transition: 'r 0.15s, opacity 0.15s' }}
                />
                {agent.label.startsWith('★') && (
                  <text x={agent.pos.x} y={agent.pos.y + 4}
                    textAnchor="middle" fill="white"
                    fontSize="12" fontFamily="var(--font-mono)">
                    ★
                  </text>
                )}
                {/* Label pequeño debajo del punto */}
                {hovered === i && (
                  <text x={agent.pos.x} y={agent.pos.y - 18}
                    textAnchor="middle" fill={agent.color}
                    fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
                    {agent.label.replace('★ ', '')}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Leyenda derecha */}
        <div style={{ display: 'grid', gap: '1rem', minWidth: '220px' }}>
          {AGENTS.map((agent, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '0.875rem',
                background: hovered === i ? 'var(--bg-raised)' : 'var(--bg-surface)',
                border: `1px solid ${hovered === i ? agent.color : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'default',
                transition: 'all 0.15s',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: agent.color, flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '0.75rem', fontWeight: 500,
                  color: 'var(--text-primary)',
                }}>
                  {agent.label}
                </span>
              </div>
              <p style={{
                margin: 0, fontSize: '0.6875rem',
                color: 'var(--text-secondary)', lineHeight: 1.5,
              }}>
                {agent.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Nota conclusiva */}
      <div style={{
        marginTop: '2rem', padding: '1.25rem',
        background: 'var(--bg-surface)',
        borderLeft: '4px solid var(--accent-blue)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{
          margin: '0 0 0.5rem', fontSize: '0.875rem',
          fontWeight: 500, color: 'var(--text-primary)',
        }}>
          Lección estructural del 28-A
        </p>
        <p style={{
          margin: 0, fontSize: '0.8125rem',
          color: 'var(--text-secondary)', lineHeight: 1.7,
          boxSizing: 'border-box'
        }}>
          El 28 de abril de 2025 no fue el fracaso de las renovables.
          Fue el coste medible de optimizar la descarbonización sin
          actualizar simultáneamente las herramientas de estabilidad.
          El Grid-Forming (<TooltipTerm term="GFM">GFM</TooltipTerm>) obligatorio (NC RfG 2.0) es la única tecnología
          que permite avanzar en los tres vértices del trilema sin
          sacrificar ninguno. — Cap. 9.1, TFG.
        </p>
      </div>

      <p style={{
        marginTop: '1rem', fontSize: '0.6875rem',
        color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
        textAlign: 'right',
      }}>
        Fuente: Fig. 9.1 — Elaboración propia / TFG
      </p>
      <NextChapter path="/black-start" label="Black-Start (Reposición)" desc="El proceso de reconstrucción del sistema" />
    </div>
  );
}
