import { useState } from 'react';

const CONSENSUS_POINTS = [
  {title:'Inercia no fue causa raíz', desc:'Consenso unánime: H=2,3s estaba sobre el umbral ENTSO-E. El colapso fue por tensión, no por frecuencia.'},
  {title:'Colapso fue por inestabilidad capacitiva', desc:'No déficit de potencia activa. Saturación de márgenes Q-V de Carmona.'},
  {title:'Reservas activas fueron suficientes', desc:'El sistema disponía de energía. El problema fue control reactivo, no energético.'},
  {title:'UFLS agravó el colapso', desc:'Consenso unánime: deslastre de carga inductiva eliminó sumideros reactivos. Paradoja confirmada.'},
  {title:'Protecciones OST actuaron correctamente', desc:'Actuaciones a 12:33:21 CEST fueron normativamente correctas. Separación transpirenaica evitó propagación a Europa.'},
  {title:'Normativa IBR era insuficiente', desc:'P.O. 7.4 y RD 413/2014 no permitían control dinámico de tensión a inversores.'},
  {title:'Criterio N-1 estático es insuficiente', desc:'Para redes con alta penetración IBR, el análisis estático no predice inestabilidad dinámica capacitiva.'},
];

const DIVERGENCE_POINTS = [
  {title:'Responsable principal', 
   gov:'PARQUE GENERADOR — incumplimiento normativo colectivo',
   icai:'OPERADOR (REE) — mallado, despacho inadecuado, inobservabilidad',
   entso:'MARCO REGULATORIO — restricción normativa que impedía control dinámico IBR'},
  {title:'Detonante del colapso',
   gov:'Incumplimiento P.O. 7.4 por generadores',
   icai:'Maniobra de mallado inyectando 1,05-2,4 GVAr capacitivos',
   entso:'Restricción IBR: sin Grid-Forming obligatorio en normativa'},
  {title:'Naturaleza oscilación 0,63 Hz',
   gov:'Forzada — planta FV en Badajoz',
   icai:'Modo natural interárea — baja amortiguamiento (1%)',
   entso:'Causalidad incierta — baja inercia amplificó cualquier perturbación'},
  {title:'Tensión en disparo raíz Granada',
   gov:'418 kV (SCADA) — dentro de rango operativo',
   icai:'244 kV (real en 220kV) — Tap-Lag invisible para SCADA. >110% Vn',
   entso:'No califica. Subraya inobservabilidad como limitación sistémica'},
  {title:'Medida preventiva más urgente',
   gov:'Actualización P.O. 7.4 + disciplina generadores',
   icai:'No ejecutar mallado o mantener gen. síncrona zona sur',
   entso:'NC RfG 2.0 + herramientas dinámicas CSA en tiempo real'},
];

export default function ConsensusDivergenceVisualizer() {
  const [activeDiv, setActiveDiv] = useState<number | null>(null);

  return (
    <div style={{maxWidth:'1100px', margin:'0 auto', padding:'2.5rem 3rem'}}>
      <p className="t-subheading" style={{marginBottom:'0.5rem'}}>
        Análisis comparativo
      </p>
      <h2 style={{fontFamily:'var(--font-serif)', fontSize:'1.5rem',
                  fontWeight:400, color:'var(--text-primary)',
                  marginBottom:'0.5rem'}}>
        Consenso vs. Divergencia
      </h2>
      <p className="t-body" style={{maxWidth:'600px', marginBottom:'2rem'}}>
        7 puntos donde REE, ICAI, ENTSO-E y Gobierno coinciden plenamente.
        5 ejes donde sus interpretaciones son irreconciliables.
      </p>

      {/* CONSENSUS */}
      <div style={{marginBottom:'3rem'}}>
        <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.25rem',
                   fontWeight:400, color:'var(--nominal)',
                   borderBottom:'2px solid var(--nominal)',
                   paddingBottom:'0.5rem', marginBottom:'1rem'}}>
          ✓ 7 Puntos de Consenso Verificado
        </h3>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',
                    gap:'1rem'}}>
          {CONSENSUS_POINTS.map((p, i) => (
            <div key={i} style={{borderLeft:'3px solid var(--nominal)',
                               padding:'0.75rem 1rem',
                               background:'var(--bg-raised)',
                               borderRadius:'var(--radius-md)'}}>
              <p style={{fontSize:'0.95rem', fontWeight:500,
                        color:'var(--text-primary)', margin:'0 0 0.25rem'}}>
                {p.title}
              </p>
              <p style={{fontSize:'0.8125rem', color:'var(--text-secondary)',
                        margin:0, lineHeight:1.5}}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DIVERGENCE */}
      <div>
        <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.25rem',
                   fontWeight:400, color:'var(--warning)',
                   borderBottom:'2px solid var(--warning)',
                   paddingBottom:'0.5rem', marginBottom:'1rem'}}>
          ⚠ 5 Ejes de Divergencia Irreconciliable
        </h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'1rem'}}>
          {DIVERGENCE_POINTS.map((p, i) => (
            <div key={i} style={{borderLeft:'3px solid var(--warning)',
                               background:'var(--bg-surface)',
                               border:'1px solid var(--border-subtle)',
                               borderRadius:'var(--radius-md)',
                               overflow:'hidden'}}>
              <button
                onClick={() => setActiveDiv(activeDiv === i ? null : i)}
                style={{width:'100%', padding:'1rem', textAlign:'left',
                       background:'transparent', border:'none',
                       cursor:'pointer', display:'flex',
                       justifyContent:'space-between',
                       alignItems:'center', gap:'1rem'}}>
                <span style={{fontSize:'0.95rem', fontWeight:500,
                            color:'var(--text-primary)'}}>
                  {p.title}
                </span>
                <span style={{fontSize:'1.25rem', color:'var(--warning)',
                            flexShrink:0}}>
                  {activeDiv === i ? '−' : '+'}
                </span>
              </button>

              {activeDiv === i && (
                <div style={{padding:'0 1rem 1rem',
                           borderTop:'1px solid var(--border-subtle)',
                           display:'grid',
                           gridTemplateColumns:'repeat(3, 1fr)',
                           gap:'1rem'}}>
                  <div>
                    <p style={{fontSize:'0.75rem', color:'var(--alarm)',
                              fontFamily:'var(--font-mono)',
                              fontWeight:500, margin:'0 0 0.5rem'}}>
                      GOV/REE
                    </p>
                    <p style={{fontSize:'0.8125rem',
                              color:'var(--text-secondary)', margin:0}}>
                      {p.gov}
                    </p>
                  </div>
                  <div>
                    <p style={{fontSize:'0.75rem', color:'var(--warning)',
                              fontFamily:'var(--font-mono)',
                              fontWeight:500, margin:'0 0 0.5rem'}}>
                      ICAI/AELEC
                    </p>
                    <p style={{fontSize:'0.8125rem',
                              color:'var(--text-secondary)', margin:0}}>
                      {p.icai}
                    </p>
                  </div>
                  <div>
                    <p style={{fontSize:'0.75rem', color:'var(--info)',
                              fontFamily:'var(--font-mono)',
                              fontWeight:500, margin:'0 0 0.5rem'}}>
                      ENTSO-E
                    </p>
                    <p style={{fontSize:'0.8125rem',
                              color:'var(--text-secondary)', margin:0}}>
                      {p.entso}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
