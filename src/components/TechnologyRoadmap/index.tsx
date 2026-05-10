import { useState } from 'react';

const SOLUTIONS = [
  {
    id:'bess',
    name:'BESS con capacidad Grid-Forming',
    desc:'Baterías de almacenamiento con electrónica que proporciona soporte de tensión sincronizado. Inercia sintética.',
    phase:'2025-2026',
    urgency:'CRÍTICA',
    actor:'Generadores privados + MITECO',
    impact:'15-30 GWh de capacidad de respuesta ultrarrápida (<100ms)',
    standard:'NC RfG 2.0',
  },
  {
    id:'sync',
    name:'Condensadores Síncronos',
    desc:'Máquinas síncronas rotativas sin inyección neta de potencia. Proporciona control de tensión y amortiguamiento.',
    phase:'2025-2027',
    urgency:'ALTA',
    actor:'REE (Operador del Sistema)',
    impact:'Margen Q-V +500 MVAr en nudos críticos como Carmona',
    standard:'P.O. 7.4 (actualizado)',
  },
  {
    id:'gridform',
    name:'Grid-Forming Obligatorio ≥1 MW',
    desc:'Todos los inversores nuevos deben funcionar como fuentes de tensión, no dependientes de PLL externo.',
    phase:'2026 (entrada vigor)',
    urgency:'CRÍTICA',
    actor:'Regulador europeo (ACER) + España',
    impact:'82% IBR pasaría a modo GFM. Amortiguamiento natural del sistema.',
    standard:'NC RfG 2.0 (ENTSO-E)',
  },
  {
    id:'csa',
    name:'Herramientas CSA Dinámicas en Tiempo Real',
    desc:'Sustitución del análisis N-1 estático por simulación dinámica en RCCs. Predicción de inestabilidad capacitiva.',
    phase:'2025-2026',
    urgency:'CRÍTICA',
    actor:'REE + RCC europeos',
    impact:'Tiempo de reacción del operador: de >5 min a <2 min ante transitorios ultrarrápidos',
    standard:'ENTSO-E Dynamic Security Assessment',
  },
  {
    id:'po74',
    name:'Actualización P.O. 7.4',
    desc:'Permitir control dinámico de tensión a IBR. Eliminar bandas muertas que "duermen" generación convencional.',
    phase:'2025 (entrada vigor prevista)',
    urgency:'CRÍTICA',
    actor:'Gobierno + REE',
    impact:'Responsabilidad explícita de generadores en soporte de red. Cumplimiento RfG.',
    standard:'Procedimiento de Operación español',
  },
  {
    id:'pmus',
    name:'PMUs en Todas las Subestaciones ≥110 kV',
    desc:'Unidades de Medida Fasorial. Visibilidad digital de la red en tiempo real, cada 20ms.',
    phase:'2025-2026',
    urgency:'ALTA',
    actor:'REE + Distribuidoras (DSO)',
    impact:'Eliminación del Tap-Lag como punto ciego. Observabilidad completa de red 220kV.',
    standard:'ENTSO-E Cyber Security',
  },
  {
    id:'markets',
    name:'Mercado de Inercia Sintética',
    desc:'Remunerar explícitamente la provisión de inercia sintética. Incentivar BESS y GFM.',
    phase:'2026-2027',
    urgency:'MEDIA',
    actor:'Operador del Mercado (OMIE)',
    impact:'Ingresos nuevos para generadores IBR. Capacidad de 5-10 GW en inercia sintética en 2030.',
    standard:'Código de Red de Servicios Auxiliares',
  },
];

export default function TechnologyRoadmap() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const urgencyColor = (u: string) => {
    if(u==='CRÍTICA') return 'var(--alarm)';
    if(u==='ALTA') return 'var(--warning)';
    return 'var(--info)';
  };

  return (
    <div style={{maxWidth:'1100px', margin:'0 auto', padding:'2.5rem 3rem'}}>
      <p className="t-subheading" style={{marginBottom:'0.5rem'}}>
        Resiliencia y futuro
      </p>
      <h2 style={{fontFamily:'var(--font-serif)', fontSize:'1.5rem',
                  fontWeight:400, color:'var(--text-primary)',
                  marginBottom:'0.5rem'}}>
        Hoja de ruta de soluciones tecnológicas
      </h2>
      <p className="t-body" style={{maxWidth:'600px', marginBottom:'2rem'}}>
        7 tecnologías habilitadoras identificadas por ENTSO-E, NREL y el
        TFG para restablecer la estabilidad de la red ibérica ante
        colapsos capacitivos. Fase, urgencia y responsable de cada una.
      </p>

      <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'0.75rem'}}>
        {SOLUTIONS.map(s => (
          <div key={s.id}
               style={{borderLeft:`4px solid ${urgencyColor(s.urgency)}`,
                      background:'var(--bg-surface)',
                      border:'1px solid var(--border-subtle)',
                      borderRadius:'var(--radius-md)',
                      overflow:'hidden'}}>
            <button
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              style={{width:'100%', padding:'1rem', textAlign:'left',
                     background:'transparent', border:'none',
                     cursor:'pointer', display:'flex',
                     justifyContent:'space-between', alignItems:'center',
                     gap:'1rem'}}>
              <div style={{flex:1}}>
                <div style={{display:'flex', alignItems:'center', gap:'0.75rem',
                           marginBottom:'0.25rem'}}>
                  <p style={{margin:0, fontSize:'0.95rem', fontWeight:500,
                            color:'var(--text-primary)'}}>
                    {s.name}
                  </p>
                  <span className="badge"
                        style={{borderColor:urgencyColor(s.urgency),
                               color:urgencyColor(s.urgency)}}>
                    {s.urgency}
                  </span>
                </div>
                <p style={{margin:0, fontSize:'0.8125rem',
                          color:'var(--text-muted)'}}>
                  Fase {s.phase} • {s.actor}
                </p>
              </div>
              <span style={{fontSize:'1.25rem',
                           color:urgencyColor(s.urgency),
                           flexShrink:0}}>
                {expanded === s.id ? '−' : '+'}
              </span>
            </button>

            {expanded === s.id && (
              <div style={{padding:'0 1rem 1rem',
                         borderTop:'1px solid var(--border-subtle)'}}>
                <p style={{fontSize:'0.8125rem', color:'var(--text-secondary)',
                          lineHeight:1.6, margin:'0 0 0.75rem'}}>
                  {s.desc}
                </p>
                <div style={{display:'grid',
                            gridTemplateColumns:'1fr 1fr',
                            gap:'1rem', fontSize:'0.8125rem'}}>
                  <div>
                    <p style={{color:'var(--text-muted)',
                              fontFamily:'var(--font-mono)', margin:'0 0 0.25rem'}}>
                      Impacto esperado
                    </p>
                    <p style={{color:'var(--text-secondary)', margin:0}}>
                      {s.impact}
                    </p>
                  </div>
                  <div>
                    <p style={{color:'var(--text-muted)',
                              fontFamily:'var(--font-mono)', margin:'0 0 0.25rem'}}>
                      Estándar
                    </p>
                    <p style={{color:'var(--text-secondary)', margin:0}}>
                      {s.standard}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
