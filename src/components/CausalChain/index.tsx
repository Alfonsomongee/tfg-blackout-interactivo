import { useState } from 'react';
import NextChapter from '../NextChapter';
import TooltipTerm from '../TooltipTerm';

const phases = [
  {
    id: 'fase-0',
    timeline: '12:00 - 12:30 CEST · Precondiciones',
    title: 'Fase 1: Precondiciones y Estado de Red',
    description: (
      <>
        El sistema peninsular opera con una demanda valle de 25.2 GW y una penetración récord de energía renovable asíncrona (82% <TooltipTerm term="IBR">IBR</TooltipTerm>). La <TooltipTerm term="Inercia Síncrona">Inercia Síncrona</TooltipTerm> se encuentra en mínimos históricos, comprometiendo la estabilidad dinámica del sistema frente a transitorios rápidos.
      </>
    ),
    keyMetrics: [
      { label: 'Demanda valle', value: '25.2 GW' },
      { label: 'Penetración IBR', value: '82.0%' },
    ],
  },
  {
    id: 'fase-1',
    timeline: '12:30:15 CEST · Detonante y Oscilación',
    title: 'Fase 2: Oscilaciones Forzadas e Inestabilidad',
    description: (
      <>
        El mallado de líneas vacías de 400 kV por parte de REE inyecta excesiva potencia reactiva capacitiva. Se desata una <TooltipTerm term="Oscilación interárea">oscilación de baja frecuencia</TooltipTerm> a 0.63 Hz con un amortiguamiento crítico inferior al 1%, propagando inestabilidad angular por la red transpeninsular.
      </>
    ),
    keyMetrics: [
      { label: 'Frecuencia oscilación', value: '0.63 Hz' },
      { label: 'Amortiguamiento', value: '< 1.0%' },
    ],
  },
  {
    id: 'fase-2',
    timeline: '12:31:40 CEST · Colapso Q-V',
    title: 'Fase 3: Mecanismo de Fallo y Contracción Q-V',
    description: (
      <>
        Se produce una contracción brusca de la curva de tensión (Q-V) en el nudo de Carmona. El fenómeno de <TooltipTerm term="Tap-Lag">"Tap-Lag"</TooltipTerm> provoca una caída severa de la tensión de 418 kV a solo 244 kV, saturando el <TooltipTerm term="Margen de estabilidad">margen de estabilidad de tensión</TooltipTerm> disponible en los colectores del sur.
      </>
    ),
    keyMetrics: [
      { label: 'Tensión Carmona', value: '418 ➔ 244 kV' },
      { label: 'Estado estabilidad', value: 'Saturación Q-V' },
    ],
  },
  {
    id: 'fase-3',
    timeline: '12:32:57 CEST · Cascada de Eventos',
    title: 'Fase 4: Evento Raíz y Disparo en Cascada',
    description: (
      <>
        El <TooltipTerm term="Disparo raíz">disparo raíz</TooltipTerm> de la subestación de Granada desata una pérdida masiva de sincronismo transpeninsular. Las protecciones <TooltipTerm term="UFLS">UFLS</TooltipTerm> (Underfrequency Load Shedding) actúan de forma contraproducente al no discriminar dinámicas transitorias rápidas.
      </>
    ),
    keyMetrics: [
      { label: 'Disparo Granada', value: '12:32:57 CEST' },
      { label: 'Mecanismo UFLS', value: 'Deslastre ineficaz' },
    ],
  },
  {
    id: 'fase-4',
    timeline: '12:33:30 CEST · Separación Física',
    title: 'Fase 5: Colapso Sistémico y Blackout Total',
    description: (
      <>
        Se consuma el blackout ibérico con cero absoluto de tensión. En solo 22.5 segundos, el sistema se fractura completamente tras el deslastre de la <TooltipTerm term="Fase 3">Fase 3</TooltipTerm> de separación física, perdiendo más de 15 GW de generación y aislando la Península Ibérica de Europa continental.
      </>
    ),
    keyMetrics: [
      { label: 'Tiempo de caída', value: '22.5 s' },
      { label: 'Generación perdida', value: '15.0 GW' },
    ],
  },
];

export default function CausalChain() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('fase-0');

  const currentPhaseIndex = phases.findIndex(p => p.id === selectedPhaseId);
  const phaseProgress = ((currentPhaseIndex + 1) / phases.length) * 100;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>
      
      {/* Title block */}
      <div className="border-b border-main pb-4 mb-6">
        <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>
          Cap. 3 — Anatomía del colapso
        </p>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.5rem',
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          La cadena causal del apagón
        </h2>
        <p className="t-body" style={{ maxWidth: '600px', marginBottom: '0px' }}>
          Los 5 pasos que llevaron del sistema en "estado normal" (12:32 CEST)
          al cero de tensión (12:33:30 CEST). Cada fase es una condición
          necesaria para la siguiente.
        </p>
      </div>

      {/* CAMBIO #1: STICKY HEADER CON PROGRESO */}
      <div style={{
        position: 'sticky',
        top: '80px',  // Debajo de la barra de navegación principal
        background: 'var(--bg-primary)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem',
        marginBottom: '2rem',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 'var(--radius-md)',
      }}>
        
        {/* COLUMNA IZQUIERDA: Breadcrumb + Título */}
        <div>
          <p style={{
            margin: '0 0 0.5rem',
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Fase {currentPhaseIndex + 1} de 5
          </p>
          <h3 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}>
            {phases[currentPhaseIndex].title}
          </h3>
        </div>

        {/* COLUMNA DERECHA: Circular progress bar (SVG) */}
        <div style={{
          position: 'relative',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="60" height="60" style={{ position: 'absolute' }}>
            {/* Círculo de fondo */}
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke="var(--bg-raised)"
              strokeWidth="2"
            />
            {/* Círculo de progreso animado */}
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke="var(--accent-blue)"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - phaseProgress / 100)}`}
              style={{
                transition: 'stroke-dashoffset 0.3s ease',
              }}
            />
          </svg>
          <span style={{
            position: 'relative',
            zIndex: 1,
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--accent-blue)',
          }}>
            {Math.round(phaseProgress)}%
          </span>
        </div>
      </div>

      {/* CAMBIO #4: LÍNEA VERTICAL DE TIMELINE */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <div style={{
          position: 'absolute',
          left: '1.75rem', // Aligned with node center
          top: '1rem',
          bottom: '1rem',
          width: '2px',
          background: 'var(--border)',
          zIndex: 1,
        }} />
        
        {/* CAMBIO #2: FASES CON PULSE */}
        {phases.map((phase) => {
          const isSelected = selectedPhaseId === phase.id;
          return (
            <div
              key={phase.id}
              id={`phase-${phase.id}`}
              onClick={() => {
                setSelectedPhaseId(phase.id);
                document.getElementById(`phase-${phase.id}`)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }}
              style={{
                marginBottom: '2.5rem',
                cursor: 'pointer',
                opacity: isSelected ? 1 : 0.5,
                transition: 'opacity 0.2s ease',
                position: 'relative',
              }}
            >
              {/* NODO CON PULSE ANIMATION */}
              <div
                style={{
                  position: 'absolute',
                  left: '-1rem',
                  top: '0.5rem',
                  width: '24px',
                  height: '24px',
                  background: isSelected ? 'var(--accent-blue)' : 'var(--bg-raised)',
                  border: `2px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border)'}`,
                  borderRadius: '50%',
                  zIndex: 10,
                  animation: isSelected ? 'pulse 1.5s ease-in-out infinite' : 'none',
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '50%',
                      border: '2px solid var(--accent-blue)',
                      opacity: 0.3,
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                )}
              </div>

              {/* CARD CONTENIDO */}
              <div
                style={{
                  background: isSelected ? 'var(--bg-raised)' : 'transparent',
                  border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  transition: 'all 0.2s ease',
                  marginLeft: '2rem',  // Espacio para el nodo
                }}
              >
                {/* Timeline label */}
                <p style={{
                  margin: '0 0 0.5rem',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-blue)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {phase.timeline}
                </p>

                {/* Título fase */}
                <h4 style={{
                  margin: '0 0 0.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}>
                  {phase.title}
                </h4>

                {/* Contenido expandido solo si selected */}
                {isSelected && (
                  <>
                    <p style={{
                      margin: '0 0 1rem',
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}>
                      {phase.description}
                    </p>

                    {/* Key Metrics Grid */}
                    {phase.keyMetrics && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '0.75rem',
                        marginBottom: '1rem',
                      }}>
                        {phase.keyMetrics.map((m, i) => (
                          <div key={i} style={{
                            background: 'var(--bg-primary)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            borderLeft: '3px solid var(--accent-blue)',
                          }}>
                            <p style={{
                              margin: 0,
                              fontSize: '0.625rem',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                            }}>
                              {m.label}
                            </p>
                            <p style={{
                              margin: '0.25rem 0 0',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: 'var(--accent-blue)',
                            }}>
                              {m.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CAMBIO #3: NAVIGATION BUTTONS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
        }}
      >
        {/* BOTÓN ANTERIOR */}
        <button
          onClick={() => {
            if (currentPhaseIndex > 0) {
              const prevId = phases[currentPhaseIndex - 1].id;
              setSelectedPhaseId(prevId);
              document.getElementById(`phase-${prevId}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }}
          disabled={currentPhaseIndex === 0}
          style={{
            padding: '0.625rem 1.25rem',
            background: currentPhaseIndex === 0
              ? 'var(--bg-raised)' : 'var(--accent-blue)',
            color: currentPhaseIndex === 0
              ? 'var(--text-muted)' : 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: currentPhaseIndex === 0 ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
        >
          ← Anterior
        </button>

        {/* DOT INDICATORS */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
        }}>
          {phases.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPhaseId(phases[idx].id);
                document.getElementById(`phase-${phases[idx].id}`)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: idx <= currentPhaseIndex
                  ? 'var(--accent-blue)' : 'var(--bg-raised)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s ease',
              }}
              aria-label={`Ir a ${phases[idx].title}`}
            />
          ))}
        </div>

        {/* BOTÓN SIGUIENTE */}
        <button
          onClick={() => {
            if (currentPhaseIndex < phases.length - 1) {
              const nextId = phases[currentPhaseIndex + 1].id;
              setSelectedPhaseId(nextId);
              document.getElementById(`phase-${nextId}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }}
          disabled={currentPhaseIndex === phases.length - 1}
          style={{
            padding: '0.625rem 1.25rem',
            background: currentPhaseIndex === phases.length - 1
              ? 'var(--bg-raised)' : 'var(--accent-blue)',
            color: currentPhaseIndex === phases.length - 1
              ? 'var(--text-muted)' : 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: currentPhaseIndex === phases.length - 1
              ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
        >
          Siguiente →
        </button>
      </div>

      {/* NOTA CLAVE */}
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: 'var(--bg-raised)',
        borderLeft: '4px solid var(--info)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{
          margin: '0 0 0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
        }}>
          Lección de la cadena causal
        </p>
        <p style={{
          margin: 0,
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
        }}>
          Ninguna fase individual causa el colapso. Es la secuencia. Eliminar
          cualquier eslabón (más generación síncrona, mejor observabilidad del
          Tap-Lag, Grid-Forming obligatorio) habría interrumpido la cadena.
          La vulnerabilidad fue estructural, no accidental.
        </p>
      </div>

      <NextChapter path="/divergencias" label="Divergencias Irreconciliables" desc="Las 5 posturas académicas" />

      {/* CAMBIO #4: KEYFRAMES */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
