import React, { useState } from 'react';
import NextChapter from '../NextChapter';
import LazyImage from '../LazyImage';

interface Testimonio {
  id: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  source: string;
  impact: 'ciudadano' | 'medios' | 'digital';
}

const TESTIMONIOS: Testimonio[] = [
  {
    id: 't1',
    title: 'Impacto en el ciudadano',
    description: 'Oscuridad total en calles y hogares. La velocidad del colapso dejó a millones sin suministro.',
    src: '/images/blackout-content/redes-sociales/ciudadano-oscuridad-testimonio.jpg',
    alt: 'Testimonio visual: oscuridad total durante el apagón 28-A',
    source: 'Redes sociales / Ciudadanos',
    impact: 'ciudadano',
  },
  {
    id: 't2',
    title: 'Cierre del comercio',
    description: 'Tiendas y negocios cerrados. Sin electricidad, sin punto de venta. Crisis económica instantánea.',
    src: '/images/blackout-content/redes-sociales/comercio-cerrado-blackout.jpg',
    alt: 'Comercio cerrado durante el apagón',
    source: 'Medios / Redes sociales',
    impact: 'medios',
  },
  {
    id: 't3',
    title: 'Narrativa digital del colapso',
    description: 'Twitter/X como fuente de información en tiempo real. La red social fue el medio de comunicación durante el apagón.',
    src: '/images/blackout-content/redes-sociales/twitter-apagon-28a-tweet-1.png',
    alt: 'Tweet sobre el apagón 28-A viralizándose en tiempo real',
    source: 'Twitter/X',
    impact: 'digital',
  },
];

const IMPACT_COLORS: Record<string, string> = {
  ciudadano: 'var(--alarm)',
  medios: 'var(--warning)',
  digital: 'var(--accent-blue)',
};

function Testimonios() {
  const [expandedId, setExpandedId] = useState<string | null>('t1');

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          IMPACTO SOCIAL DEL EVENTO · NARRATIVA PÚBLICA
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Testimonios del Apagón 28-A
        </h1>
        <p className="t-body-main" style={{ maxWidth: '72ch' }}>
          Más allá del análisis técnico, el apagón fue una experiencia vivida por 60 millones
          de personas. Estos testimonios visuales muestran el impacto inmediato en ciudadanía,
          comercio y narrativa pública en redes sociales.
        </p>
      </header>

      {/* Testimonios grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {TESTIMONIOS.map(t => {
          const isExpanded = expandedId === t.id;
          const color = IMPACT_COLORS[t.impact];

          return (
            <div
              key={t.id}
              style={{
                background: 'var(--bg-raised)',
                border: `1px solid ${isExpanded ? color : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isExpanded ? `0 0 12px ${color}20` : 'none',
              }}
              onClick={() => setExpandedId(isExpanded ? null : t.id)}
            >
              {/* Image */}
              <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                <LazyImage
                  src={t.src}
                  alt={t.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: isExpanded ? 'transparent' : `${color}15`,
                  pointerEvents: 'none',
                  transition: 'background 0.2s',
                }} />
              </div>

              {/* Content */}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5625rem',
                      fontWeight: 700,
                      color: color,
                      background: `${color}15`,
                      padding: '0.125rem 0.375rem',
                      borderRadius: 'var(--radius-sm)',
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t.impact.toUpperCase()}
                  </span>
                </div>

                <h3 style={{
                  margin: '0 0 0.375rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {t.title}
                </h3>

                {isExpanded && (
                  <>
                    <p style={{
                      margin: '0.5rem 0',
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}>
                      {t.description}
                    </p>
                    <p style={{
                      margin: '0.75rem 0 0',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--text-muted)',
                    }}>
                      Fuente: {t.source}
                    </p>
                  </>
                )}

                <div style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: color,
                  }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Context note */}
      <div
        className="glass-panel"
        style={{ padding: '1rem 1.25rem', marginBottom: '2rem' }}
      >
        <p style={{ margin: '0 0 0.375rem', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          NOTA SOBRE TESTIMONIOS VISUALES
        </p>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Estos testimonios humaniza el análisis forense técnico. Mientras los cuatro informes
          (Gobierno, ICAI, ENTSO-E y este TFG) debaten responsabilidades y causas técnicas,
          la realidad del 28-A fue: 60 millones sin suministro, comercio paralizado, y una
          narrativa digital que viajaba más rápido que los reportes técnicos.
        </p>
      </div>

      <NextChapter
        path="/veredicto"
        label="Veredicto Forense"
        desc="Síntesis final: cuatro narrativas irreconciliables y una conclusión arquitectónica"
      />
    </div>
  );
}

export default React.memo(Testimonios);
