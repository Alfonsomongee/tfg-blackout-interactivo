
const CHAIN_STEPS = [
  {
    phase: 'FASE 1',
    title: 'Precondiciones',
    items: ['82% IBR penetration', 'Demanda valle 25.2 GW', 'Inercia zonal baja'],
    color: 'var(--warning)',
    icon: '⚠',
  },
  {
    phase: 'FASE 2',
    title: 'Oscilaciones forzadas',
    items: ['Mallado REE inyecta Q', 'Oscilación 0,63 Hz', '1% amortiguamiento'],
    color: 'var(--alarm)',
    icon: '⚡',
  },
  {
    phase: 'FASE 3',
    title: 'Mecanismo de fallo',
    items: ['Contracción Q-V Carmona', 'Tap-Lag 418→244 kV', 'Saturación Ssc'],
    color: 'var(--alarm)',
    icon: '🔴',
  },
  {
    phase: 'FASE 4',
    title: 'Cascada',
    items: ['Disparo Granada 12:32:57', 'Pérdida sincronismo', 'UFLS contraproducente'],
    color: 'var(--alarm)',
    icon: '💥',
  },
  {
    phase: 'FASE 5',
    title: 'Colapso',
    items: ['Cero de tensión', '22,5 segundos', '15 GW perdidos'],
    color: 'var(--alarm)',
    icon: '⬛',
  },
];

export default function CausalChain() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 3rem' }}>
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
      <p className="t-body" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        Los 5 pasos que llevaron del sistema en "estado normal" (12:32 CEST)
        al cero de tensión (12:33:30 CEST). Cada fase es una condición
        necesaria para la siguiente.
      </p>

      {/* VERSIÓN 1: Vertical Timeline (recomendado para presentación) */}
      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
        {CHAIN_STEPS.map((step, idx) => (
          <div key={idx}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '1.5rem',
              alignItems: 'flex-start',
            }}>
              {/* Indicador visual */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'white',
                  fontWeight: 600,
                  boxShadow: `0 0 20px ${step.color}40`,
                }}>
                  {step.icon}
                </div>
                {idx < CHAIN_STEPS.length - 1 && (
                  <div style={{
                    width: '3px',
                    height: '40px',
                    background: `linear-gradient(180deg, ${step.color}, ${CHAIN_STEPS[idx + 1].color})`,
                  }} />
                )}
              </div>

              {/* Contenido */}
              <div style={{
                background: 'var(--bg-surface)',
                border: `2px solid ${step.color}`,
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
              }}>
                <p style={{
                  margin: '0 0 0.25rem',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: step.color,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                }}>
                  {step.phase}
                </p>
                <h3 style={{
                  margin: '0 0 0.75rem',
                  fontSize: '1.0625rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}>
                  {step.title}
                </h3>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {step.items.map((item, i) => (
                    <p key={i} style={{
                      margin: 0,
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      paddingLeft: '1rem',
                      borderLeft: `2px solid ${step.color}40`,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NOTA CLAVE */}
      <div style={{
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
    </div>
  );
}
