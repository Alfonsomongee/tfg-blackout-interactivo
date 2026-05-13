import { useState, useEffect } from 'react';
import LazyImage from '../LazyImage';
import NextChapter from '../NextChapter';

const GALLERY_IMAGES = [
  // ─── TIER 1: FÍSICAS DEL COLAPSO ───
  {
    id: 'disparo-raiz',
    src: '/images/tfg/fig-disparo-raiz.png',
    figure: 'Fig. 3.5',
    title: 'Disparo raíz — 12:32:57 CEST',
    caption: 'Registro oscilográfico del disparo del transformador 400/220 kV en Granada. El SCADA mostraba 418 kV (dentro de límites); el secundario real era 244 kV por efecto Tap-Lag.',
    source: 'Informe de Red Eléctrica [4]',
    chapter: 'Cap. 3 — Fase 2',
    tag: 'FÍSICO',
    tagColor: 'var(--alarm)',
    tier: 1,
  },
  {
    id: 'curvas-qv',
    src: '/images/tfg/fig-curvas-qv-carmona.png',
    figure: 'Fig. 5.4',
    title: 'Curvas Q-V en Carmona 400 kV',
    caption: 'El mallado de REE desplazó el punto de operación contrayendo el margen al colapso de 2.964 MW a 1.268 MW (−57%). La línea azul muestra que revertir las maniobras habría mantenido margen seguro.',
    source: 'Informe IIT-ICAI / Compass Lexecon [5]',
    chapter: 'Cap. 5.3 — Visión ICAI',
    tag: 'ANÁLISIS',
    tagColor: 'var(--accent-blue)',
    tier: 1,
  },
  {
    id: 'taplag-granada',
    src: '/images/tfg/fig-taplag-granada.png',
    figure: 'Fig. 5.5',
    title: 'Tap-Lag — El punto ciego del operador',
    caption: 'Oscilografía del disparo raíz en Granada 12:32:56.993 CEST. Panel inferior: fase A alcanza ~145 kV (>1,10 pu) en el secundario, invisible para el SCADA de REE en 400 kV.',
    source: 'Informe IIT-ICAI / AELEC [5]',
    chapter: 'Cap. 5.3 — Tap-Lag',
    tag: 'CRÍTICO',
    tagColor: 'var(--alarm)',
    tier: 1,
  },
  {
    id: 'balance-reactiva',
    src: '/images/tfg/fig-balance-reactiva.png',
    figure: 'Fig. 5.6',
    title: 'Balance de potencia reactiva — 12:30 CEST',
    caption: 'Las maniobras de REE aportaron 0,7 GVAr adicionales. La generation síncrona disponible absorbía solo 0,2 GVAr. Déficit neto de −0,6 GVAr matemáticamente insalvable.',
    source: 'Informe IIT-ICAI / Compass Lexecon [5]',
    chapter: 'Cap. 5.3 — Balance Q',
    tag: 'ANÁLISIS',
    tagColor: 'var(--accent-blue)',
    tier: 1,
  },
  {
    id: 'tension-frecuencia',
    src: '/images/tfg/fig-tension-frecuencia-colapso.png',
    figure: 'Fig. 3.9',
    title: 'Colapso acoplado tensión-frecuencia',
    caption: 'Evolución simultánea de la tensión (kV) y frecuencia (Hz) durante los 11 segundos de la Fase 3. La frecuencia cae mientras la tensión sube — dinámica opuesta a un blackout convencional.',
    source: 'Comité de Análisis del Gobierno [3]',
    chapter: 'Cap. 3 — Fase 3',
    tag: 'FÍSICO',
    tagColor: 'var(--alarm)',
    tier: 1,
  },
  {
    id: 'recuperacion-demanda',
    src: '/images/tfg/fig-recuperacion-demanda.png',
    figure: 'Fig. 4.9',
    title: 'Desplome y recuperación — 19 horas',
    caption: 'Pérdida de 25 GW en 33 segundos y recuperación progresiva en 19 horas. La reintegración de renovables (IBR) fue vetada hasta las 07:05 del 29 de abril.',
    source: 'Presentación Comité de Análisis [3]',
    chapter: 'Cap. 4 — Reposición',
    tag: 'OPERATIVO',
    tagColor: 'var(--warning)',
    tier: 1,
  },
  // ─── TIER 2: CONTEXTO Y ANÁLISIS ───
  {
    id: 'mix-28a',
    src: '/images/tfg/fig-mix-28a.png',
    figure: 'Fig. 2.5',
    title: 'Perfil de generación del 28-A',
    caption: '82% de penetración IBR a las 12:30 CEST. Solar FV: 18.000 MW (53%). Eólica: 3.500 MW (11%). CCGT: 1.600 MW (3%). Demanda: 25.184 MW (56% de la punta histórica).',
    source: 'NREL / Red Eléctrica',
    chapter: 'Cap. 2.3 — Estado 28-A',
    tag: 'CONTEXTO',
    tagColor: 'var(--info)',
    tier: 2,
  },
  {
    id: 'wams-oscilacion',
    src: '/images/tfg/fig-wams-oscilacion.png',
    figure: 'Fig. 3.2',
    title: 'WAMS — Oscilación 0,63 Hz en Carmona',
    caption: 'Registro del Wide Area Monitoring System capturando la oscilación electromecánica de 0,63 Hz a las 12:03 CEST. Amortiguamiento: 1% (límite P.O. 13.1: 5%).',
    source: 'Informe Factual ENTSO-E / REE',
    chapter: 'Cap. 3 — Fase 0',
    tag: 'FÍSICO',
    tagColor: 'var(--alarm)',
    tier: 2,
  },
  {
    id: 'propagacion-cascada',
    src: '/images/tfg/fig-propagacion-cascada.png',
    figure: 'Fig. 3.8',
    title: 'Propagación espacial — Fase 3',
    caption: 'Mapa de pérdida de generación en cascada durante los 11 segundos de la Fase 3. La cascada se propaga de sur a norte en menos de lo que tarda un humano en reaccionar.',
    source: 'Comité de Análisis del Gobierno [3]',
    chapter: 'Cap. 3 — Fase 3',
    tag: 'GEOGRÁFICO',
    tagColor: 'var(--warning)',
    tier: 2,
  },
  {
    id: 'islas-reposicion',
    src: '/images/tfg/fig-islas-reposicion.png',
    figure: 'Fig. 4.2',
    title: '7 islas eléctricas — P.O. 1.6',
    caption: 'Fragmentación topológica de la Península Ibérica en 7 islas independientes para la reposición. Cada isla debía estabilizarse antes de sincronizarse con las demás.',
    source: 'Informe Factual ENTSO-E / REE',
    chapter: 'Cap. 4 — Black Start',
    tag: 'OPERATIVO',
    tagColor: 'var(--warning)',
    tier: 2,
  },
  {
    id: 'sincronismo-frontera',
    src: '/images/tfg/fig-sincronismo-frontera.png',
    figure: 'Fig. 5.7',
    title: 'Pérdida de sincronismo ES-FR',
    caption: 'Evolución del intercambio España-Francia durante la Fase 3. De exportar 469 MW a importar −3.807 MW en 22 segundos. Pérdida de sincronismo a las 12:33:19.620 CEST.',
    source: 'Informe Factual ENTSO-E [1]',
    chapter: 'Cap. 5.4 — ENTSO-E',
    tag: 'ANÁLISIS',
    tagColor: 'var(--accent-blue)',
    tier: 2,
  },
  {
    id: 'gfl-vs-gfm',
    src: '/images/tfg/fig-gfl-vs-gfm.png',
    figure: 'Fig. 7.2',
    title: 'Grid-Following vs Grid-Forming',
    caption: 'Comparativa de topologías de control de inversores. GFL necesita red externa para sincronizar. GFM genera su propia referencia de tensión — la solución al 28-A.',
    source: 'Cap. 7 — TFG / FutuRed',
    chapter: 'Cap. 7.2 — Tecnologías',
    tag: 'SOLUCIÓN',
    tagColor: 'var(--nominal)',
    tier: 2,
  },
  // ─── TIER 3: COMPLEMENTARIAS ───
  {
    id: 'estrategia-dual',
    src: '/images/tfg/fig-estrategia-dual.png',
    figure: 'Fig. 4.3',
    title: 'Estrategia dual Top-Down + Bottom-Up',
    caption: 'La reposición combinó soporte externo (Francia + Marruecos) con arranque autónomo de hidroeléctricas internas. Ilustración de la doble estrategia de re-energización.',
    source: 'Informe Factual ENTSO-E / REE',
    chapter: 'Cap. 4.2 — Black Start',
    tag: 'OPERATIVO',
    tagColor: 'var(--warning)',
    tier: 3,
  },
  {
    id: 'trilema',
    src: '/images/tfg/fig-trilema.png',
    figure: 'Fig. 9.1',
    title: 'Trilema estructural de la transición',
    caption: 'Las tres tensiones irresolubles: Descarbonización ↔ Estabilidad ↔ Coste. El 28-A fue el coste de optimizar el primer vértice sin reforzar el segundo.',
    source: 'Elaboración propia — Cap. 9',
    chapter: 'Cap. 9 — Conclusiones',
    tag: 'SÍNTESIS',
    tagColor: 'var(--accent-blue)',
    tier: 3,
  },
  {
    id: 'flujo-ia',
    src: '/images/tfg/fig-flujo-ia.png',
    figure: 'Fig. 8.1',
    title: 'Flujo de trabajo con IA y validación',
    caption: 'Metodología del TFG: las fuentes primarias alimentan la asistencia por IA, cuya salida es validada contra la física del sistema antes de ser incorporada al análisis.',
    source: 'Elaboración propia — Cap. 8',
    chapter: 'Cap. 8 — Uso de IA',
    tag: 'METODOLÓGICO',
    tagColor: 'var(--info)',
    tier: 3,
  },
];

const TAGS = ['TODOS', 'FÍSICO', 'ANÁLISIS', 'OPERATIVO', 'CONTEXTO',
              'GEOGRÁFICO', 'SOLUCIÓN', 'SÍNTESIS', 'METODOLÓGICO', 'CRÍTICO'];

export default function ForensicGallery() {
  const [activeTag, setActiveTag] = useState('TODOS');
  const [selected, setSelected] = useState<typeof GALLERY_IMAGES[0] | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = activeTag === 'TODOS'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.tag === activeTag);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 3rem' }}>

      {/* HEADER */}
      <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>
        Archivo visual — TFG completo
      </p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
        fontWeight: 400, color: 'var(--text-primary)', marginBottom: '0.5rem',
      }}>
        Galería forense de figuras del TFG
      </h2>
      <p className="t-body" style={{ maxWidth: '620px', marginBottom: '2rem' }}>
        Registro visual de los oscilogramas, cartografías, análisis de
        estabilidad y diagramas técnicos que sustentan el análisis
        forense comparativo del apagón del 28 de abril de 2025.
      </p>

      {/* FILTROS POR TAG */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
        marginBottom: '2rem',
      }}>
        {TAGS.map(tag => (
          <button key={tag}
            onClick={() => setActiveTag(tag)}
            style={{
              padding: '0.375rem 0.875rem',
              background: activeTag === tag
                ? 'var(--accent-blue)' : 'var(--bg-surface)',
              border: `1px solid ${activeTag === tag
                ? 'var(--accent-blue)' : 'var(--border)'}`,
              borderRadius: '999px',
              color: activeTag === tag
                ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: activeTag === tag ? 600 : 400,
              letterSpacing: '0.06em',
              transition: 'all 0.15s',
            }}>
            {tag}
          </button>
        ))}
        <span style={{
          marginLeft: 'auto',
          fontSize: '0.6875rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          alignSelf: 'center',
        }}>
          {filtered.length} figura{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* GRID DE IMÁGENES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem',
        marginBottom: '3rem',
      }}>
        {filtered.map((img) => (
          <button key={img.id}
            onClick={() => setSelected(img)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              padding: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor =
                img.tagColor;
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                `0 8px 24px rgba(0,0,0,0.15)`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor =
                'var(--border)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}>

            {/* IMAGEN CON LazyImage */}
            <div style={{ position: 'relative' }}>
              <LazyImage
                src={img.src}
                alt={img.title}
                containerStyle={{
                  width: '100%',
                  height: '200px',
                  borderBottom: '1px solid var(--border)',
                }}
                style={{
                  objectFit: 'cover',
                }}
              />

              {/* Badge tier 1 */}
              {img.tier === 1 && (
                <div style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  padding: '0.125rem 0.5rem',
                  background: 'rgba(0,0,0,0.7)',
                  borderRadius: '999px',
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--alarm)',
                  border: '1px solid var(--alarm)',
                  zIndex: 2,
                }}>
                  CLAVE
                </div>
              )}
            </div>

            {/* INFO */}
            <div style={{ padding: '1rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '0.5rem',
              }}>
                <span style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}>
                  {img.figure}
                </span>
                <span style={{
                  padding: '0.125rem 0.5rem',
                  background: `${img.tagColor}15`,
                  border: `1px solid ${img.tagColor}40`,
                  borderRadius: '999px',
                  fontSize: '0.5625rem',
                  fontFamily: 'var(--font-mono)',
                  color: img.tagColor,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}>
                  {img.tag}
                </span>
              </div>
              <p style={{
                margin: '0 0 0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.4,
              }}>
                {img.title}
              </p>
              <p style={{
                margin: '0 0 0.75rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {img.caption}
              </p>
              <p style={{
                margin: 0,
                fontSize: '0.625rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                {img.chapter}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* MODAL LIGHTBOX */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada: ${selected.title}`}
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000, padding: '2rem',
            backdropFilter: 'blur(4px)',
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '900px', width: '100%',
              maxHeight: '90vh', overflow: 'auto',
            }}>

            {/* Imagen grande */}
            <LazyImage
              src={selected.src}
              alt={selected.title}
              containerStyle={{
                background: 'var(--bg-raised)',
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                overflow: 'hidden',
                maxHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              style={{
                maxWidth: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
              }}
            />

            {/* Metadata */}
            <div style={{ padding: '1.5rem 2rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '0.75rem',
                flexWrap: 'wrap', gap: '0.5rem',
              }}>
                <div>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    color: selected.tagColor,
                    fontWeight: 600,
                  }}>
                    {selected.figure} · {selected.chapter}
                  </span>
                  <h3 style={{
                    margin: '0.25rem 0 0',
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                  }}>
                    {selected.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Cerrar imagen"
                  style={{
                    background: 'var(--bg-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    width: '32px', height: '32px',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                  ×
                </button>
              </div>
              <p style={{
                margin: '0 0 1rem',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}>
                {selected.caption}
              </p>
              <p style={{
                margin: 0,
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                Fuente: {selected.source}
              </p>
            </div>
          </div>
        </div>
      )}
      <NextChapter path="/lexicon" label="Glosario Técnico" desc="Definiciones precisas de cada término" />
    </div>
  );
}
