import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';

const ABSORPTION_CONTEXT = [
  { label: 'Absorción disponible normal', value: 3.3, color: 'var(--nominal)', note: 'Antes del mallado y despacho reducido' },
  { label: 'Absorción real zona sur (28-A)', value: 0.2, color: 'var(--alarm)', note: 'Tras despacho mínimo de generación síncrona' },
];

const CAPACITIVE_SOURCES = [
  { label: 'Líneas en vacío (Efecto Ferranti)', value: 3.4, color: 'var(--warning)', note: 'Red de 400 kV con 35% de líneas desconectadas' },
  { label: 'Inyección mallado REE', value: 0.7, color: 'var(--alarm)', note: '11 circuitos reconectados entre 12:03 y 12:25 CEST' },
];

export default function ReactiveBalance() {
  const { ref, inView } = useInView();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView) setAnimated(true);
  }, [inView]);

  const maxVal = 4.5;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 3rem' }}>
      <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>
        Cap. 5.3 — Informe ICAI / AELEC
      </p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
        fontWeight: 400, color: 'var(--text-primary)', marginBottom: '0.5rem',
      }}>
        El balance de reactiva que hizo inevitable el colapso
      </h2>
      <p className="t-body" style={{ maxWidth: '620px', marginBottom: '2.5rem' }}>
        A las 12:30 CEST, la zona sur del sistema tenía 4,10 GVAr
        de generación capacitiva y solo 0,20 GVAr de capacidad de
        absorción. El déficit de −0,60 GVAr era matemáticamente
        insalvable con independencia del comportamiento de los generadores.
      </p>

      {/* Métrica central */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem', marginBottom: '3rem',
      }}>
        {[
          { val: '4,10 GVAr', label: 'Reactiva capacitiva total', color: 'var(--alarm)' },
          { val: '0,20 GVAr', label: 'Capacidad de absorción zona sur', color: 'var(--warning)' },
          { val: '−0,60 GVAr', label: 'Déficit neto insalvable', color: 'var(--alarm)' },
        ].map((m, i) => (
          <div key={i} style={{
            padding: '1.25rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderTop: `3px solid ${m.color}`,
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}>
            <p style={{
              margin: '0 0 0.375rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.625rem', fontWeight: 700,
              color: m.color,
            }}>
              {m.val}
            </p>
            <p style={{
              margin: 0, fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Diagrama de barras visual */}
      <div ref={ref} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        marginBottom: '2.5rem',
      }}>
        {/* Columna izquierda: Generación capacitiva */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
            letterSpacing: '0.12em', color: 'var(--alarm)',
            marginBottom: '1.5rem', textTransform: 'uppercase',
          }}>
            Generación capacitiva (exceso)
          </h3>
          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: '0.75rem', position: 'relative',
          }}>
            {CAPACITIVE_SOURCES.map((src, i) => (
              <div key={i}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '0.25rem',
                }}>
                  <span style={{
                    fontSize: '0.75rem', color: 'var(--text-secondary)',
                  }}>
                    {src.label}
                  </span>
                  <span style={{
                    fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
                    color: src.color, fontWeight: 600,
                  }}>
                    {src.value} GVAr
                  </span>
                </div>
                <div style={{
                  height: '36px', background: 'var(--bg-raised)',
                  borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: animated ? `${(src.value / maxVal) * 100}%` : '0%',
                    background: src.color,
                    transition: `width ${0.6 + i * 0.2}s ease-out`,
                    opacity: 0.85,
                  }} />
                </div>
                <p style={{
                  margin: '0.25rem 0 0',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                }}>
                  {src.note}
                </p>
              </div>
            ))}

            {/* Línea de total */}
            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: 'var(--bg-raised)',
              borderLeft: '3px solid var(--alarm)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <span style={{
                fontSize: '0.8125rem', fontFamily: 'var(--font-mono)',
                color: 'var(--alarm)', fontWeight: 600,
              }}>
                TOTAL: 4,10 GVAr capacitivos
              </span>
            </div>
          </div>
        </div>

        {/* Columna derecha: Capacidad de absorción */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
            letterSpacing: '0.12em', color: 'var(--nominal)',
            marginBottom: '1.5rem', textTransform: 'uppercase',
          }}>
            Capacidad de absorción disponible
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ABSORPTION_CONTEXT.map((abs, i) => (
              <div key={i}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '0.25rem',
                }}>
                  <span style={{
                    fontSize: '0.75rem', color: 'var(--text-secondary)',
                  }}>
                    {abs.label}
                  </span>
                  <span style={{
                    fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
                    color: abs.color, fontWeight: 600,
                  }}>
                    {abs.value} GVAr
                  </span>
                </div>
                <div style={{
                  height: '36px', background: 'var(--bg-raised)',
                  borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: animated ? `${(abs.value / maxVal) * 100}%` : '0%',
                    background: abs.color,
                    transition: `width ${0.6 + i * 0.2}s ease-out`,
                    opacity: 0.85,
                  }} />
                </div>
                <p style={{
                  margin: '0.25rem 0 0',
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                }}>
                  {abs.note}
                </p>
              </div>
            ))}

            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: 'var(--bg-raised)',
              borderLeft: '3px solid var(--alarm)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <span style={{
                fontSize: '0.8125rem', fontFamily: 'var(--font-mono)',
                color: 'var(--alarm)', fontWeight: 600,
              }}>
                DÉFICIT: −0,60 GVAr · Insalvable
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nota analítica */}
      <div style={{
        padding: '1.25rem',
        background: 'var(--bg-surface)',
        borderLeft: '4px solid var(--alarm)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{
          margin: '0 0 0.5rem', fontSize: '0.875rem',
          fontWeight: 500, color: 'var(--text-primary)',
        }}>
          Implicación forense del balance
        </p>
        <p style={{
          margin: 0, fontSize: '0.8125rem',
          color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          El déficit de −0,60 GVAr es la prueba cuantitativa central del
          informe ICAI: incluso si la totalidad de los generadores privados
          hubiera cumplido el P.O. 7.4 al pie de la letra, el colapso
          habría ocurrido igualmente. El argumento del Gobierno presupone
          que los 3,50 GVAr de absorción teórica estaban disponibles;
          el informe ICAI demuestra que solo 0,20 GVAr lo estaban.
          — Fig. 5.6, TFG / Informe IIT-ICAI.
        </p>
      </div>

      {/* Fuente */}
      <p style={{
        marginTop: '1rem', fontSize: '0.6875rem',
        color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
        textAlign: 'right',
      }}>
        Fuente: Fig. 5.6 — Informe IIT-ICAI / Compass Lexecon / AELEC [5]
      </p>
    </div>
  );
}
