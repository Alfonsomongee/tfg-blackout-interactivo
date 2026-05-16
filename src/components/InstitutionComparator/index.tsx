import { useRef, useState } from 'react';
import NextChapter from '../NextChapter';

interface Institution {
  id: string;
  name: string;
  shortName: string;
  position: string;
  verdict: string;
  color: string;
}

const INITIAL: Institution[] = [
  {
    id: 'entso-e',
    name: 'ENTSO-E',
    shortName: 'Operadores Europeos de Transporte',
    position:
      'Déficit estructural de inercia síncrona. Alta penetración IBR sin código de red adaptado. El umbral de 5 s fue superado meses antes del colapso sin respuesta regulatoria.',
    verdict: 'Causa sistémica: fallo en el marco normativo europeo',
    color: 'var(--accent-blue)',
  },
  {
    id: 'cnmc',
    name: 'CNMC',
    shortName: 'Comisión Nacional de Mercados y Competencia',
    position:
      'El P.O. 7.4 no contemplaba requisitos mínimos de inercia para escenarios de alta penetración IBR. Laguna regulatoria nacional no actualizada desde 2012.',
    verdict: 'Responsabilidad regulatoria principal: normativa desactualizada',
    color: 'var(--warning)',
  },
  {
    id: 'ree',
    name: 'REE',
    shortName: 'Red Eléctrica de España — Operador del Sistema',
    position:
      'Los sistemas de protección operaron según el diseño normativo. La cascada se propagó en 32,7 s, superando los tiempos de intervención operativa humana previstos.',
    verdict: 'Responsabilidad operativa parcial: actuación dentro de protocolo',
    color: 'var(--alarm)',
  },
  {
    id: 'ministerio',
    name: 'Ministerio',
    shortName: 'Ministerio para la Transición Ecológica',
    position:
      'Los objetivos de penetración renovable se alcanzaron conforme a la planificación. Los sistemas de recuperación funcionaron según los protocolos de Black Start establecidos.',
    verdict: 'Posición más defensiva: énfasis en recuperación gestionada',
    color: 'var(--nominal)',
  },
];

export default function InstitutionComparator() {
  const [items, setItems] = useState(INITIAL);
  const [dragging, setDragging] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const handleDragStart = (i: number) => {
    dragItem.current = i;
    setDragging(i);
  };

  const handleDragEnter = (i: number) => {
    dragOver.current = i;
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current === dragOver.current) {
      setDragging(null);
      return;
    }
    const next = [...items];
    const dragged = next.splice(dragItem.current, 1)[0];
    next.splice(dragOver.current, 0, dragged);
    setItems(next);
    dragItem.current = null;
    dragOver.current = null;
    setDragging(null);
  };

  const reset = () => setItems(INITIAL);

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          COMPARADOR INSTITUCIONAL · ARRASTRA PARA ORDENAR
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Posiciones Institucionales
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          Ordena los actores institucionales según tu valoración de su grado de responsabilidad en el
          colapso del 28 de abril. Arrastra las tarjetas para reordenarlas de mayor a menor
          responsabilidad.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
        {items.map((inst, i) => (
          <div
            key={inst.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragEnter={() => handleDragEnter(i)}
            onDragEnd={handleDrop}
            onDragOver={e => e.preventDefault()}
            style={{
              display: 'grid',
              gridTemplateColumns: '3rem 1fr 2rem',
              gap: '1rem',
              alignItems: 'start',
              padding: '1.25rem',
              background: dragging === i ? 'var(--bg-surface)' : 'var(--bg-raised)',
              border: `1px solid ${dragging === i ? inst.color : 'var(--border)'}`,
              borderLeft: `3px solid ${inst.color}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'grab',
              userSelect: 'none',
              opacity: dragging === i ? 0.6 : 1,
              transition: 'opacity 0.15s, border-color 0.2s, background 0.15s',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: inst.color,
                lineHeight: 1,
                paddingTop: '0.125rem',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.625rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.375rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {inst.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {inst.shortName}
                </span>
              </div>
              <p
                style={{
                  margin: '0 0 0.375rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.55,
                }}
              >
                {inst.position}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: inst.color,
                  letterSpacing: '0.02em',
                }}
              >
                {inst.verdict}
              </p>
            </div>

            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '1.25rem',
                textAlign: 'center',
                paddingTop: '0.25rem',
                letterSpacing: '-2px',
              }}
            >
              ⋮⋮
            </div>
          </div>
        ))}
      </div>

      {/* Current order readout */}
      <div
        style={{
          padding: '0.875rem 1.25rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          ORDEN ACTUAL: {items.map(inst => inst.name).join(' → ')}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '0.375rem 0.875rem',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.06em',
          }}
        >
          RESTABLECER
        </button>
      </div>

      <NextChapter
        path="/veredicto"
        label="Veredicto Forense"
        desc="La conclusión definitiva del análisis comparativo de las cuatro narrativas"
      />
    </div>
  );
}
