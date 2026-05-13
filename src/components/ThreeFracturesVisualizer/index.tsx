import { useState } from 'react';
import TooltipTerm from '../TooltipTerm';

const FRACTURES = [
  {
    id: 'operativa',
    title: 'Fractura Operativa: Causalidad vs. Responsabilidad',
    color: 'var(--alarm)',
    description: 'El debate nuclear entre REE e ICAI sobre el primer eslabón de la cadena causal. La tesis del mallado como detonante (ICAI) y la tesis del incumplimiento colectivo como causa (REE/Gobierno) no son mutuamente excluyentes termodinámicamente: ambos factores contribuyeron a la saturación capacitiva de los márgenes Q-V. Lo que sí es excluyente es su implicación jurídica y económica, determinando sobre quién recae la responsabilidad material del colapso.',
    implications: [
      'Ambigüedad causal inevitable sin instrumentación dinámica suficiente (PMUs en nudos críticos, cálculo de estabilidad Q-V en tiempo real)',
      'Reconstrucción forense queda sujeta a interpretation cuando el sistema no tiene visibilidad completa',
      'El verdadero consenso tácito: la arquitectura de monitorización era insuficiente para gestionar el incidente en tiempo real',
      'Implicación: necesidad de herramientas de análisis de seguridad dinámica en RCCs europeos',
    ],
    chapter: 'Capítulo 5 — Análisis Comparativo',
  },
  {
    id: 'regulatoria',
    title: 'Fractura Regulatoria: Normativa del Siglo XX en Red del XXI',
    color: 'var(--warning)',
    description: 'Posición estructural de ENTSO-E: tanto el operador como los generadores actuaron dentro de los límites de una normativa inadecuada para el sistema que pretendía gobernar. El P.O. 7.4 y RD 413/2014 diseñaron control de tensión para red dominada por masas síncronas de respuesta lenta. Aplicarlo a red con 82% penetración IBR equivale a estabilizar sistema de respuesta en milisegundos con regulador diseñado para dinámicas de minutos.',
    implications: [
      'Propuesta de actualización P.O. 7.4 llevaba años paralizada en aprobación regulatoria',
      'Gobierno reconoce que su entrada en vigor habría sido el cambio más relevante para evitar colapso',
      'El apagón del 28-A es el coste medible de una demora regulatoria de años',
      'Lección: la arquitectura normativa debe evolucionar en sincronía con el equipamiento físico',
      'Necesidad imperiosa de NC RfG 2.0 con Grid-Forming obligatorio ≥1 MW',
    ],
    chapter: 'Capítulo 7 — Resiliencia y Futuro',
  },
  {
    id: 'sistemica',
    title: 'Fractura Sistémica: Herramientas Estáticas en Red Dinámica',
    color: 'var(--info)',
    description: 'Consenso unánime sobre insuficiencia del Criterio N-1 estático. Los modelos de flujo de carga que evaluaron el sistema como "Normal" horas antes del colapso son matemáticamente incapaces de representar inestabilidad capacitiva en redes de baja inercia: no resuelven ecuaciones diferenciales, no modelizan dinámica de lazos de control de inversores, no calculan márgenes Q-V en tiempo real. Esta limitación no es fallo puntual del 28-A; es la condición habitual de TODOS los despachos europeos.',
    implications: [
      'Velocidad del colapso (<90 segundos) sitúa el fenómeno fuera del horizonte temporal de intervención humana',
      'Cuando operador percibió gravedad, el sistema era irrecuperable: la única respuesta viable es prevención estructural',
      'Reformas más urgentes: herramientas de análisis dinámico en tiempo real en RCCs europeos',
      'Paradigma centralizado alcanzó límites de su capacidad de gestión en redes dominadas por IBR',
      'Transición necesaria: de operación centralizada a supervisión distribuida con inteligencia local',
    ],
    chapter: 'Capítulo 9 — Conclusiones',
  },
];

export default function ThreeFracturesVisualizer() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{maxWidth:'1100px', margin:'0 auto', padding:'2.5rem 3rem'}}>
      <p className="t-subheading" style={{marginBottom:'0.5rem'}}>Gobernanza del apagón</p>
      <h2 style={{fontFamily:'var(--font-serif)', fontSize:'1.5rem', fontWeight:400,
                  color:'var(--text-primary)', marginBottom:'0.5rem'}}>
        Tres fracturas irreconciliables
      </h2>
      <p className="t-body" style={{maxWidth:'600px', marginBottom:'2rem'}}>
        El colapso del 28 de abril no fue un incidente fortuito sino la
        manifestación convergente de tres fracturas de gobernanza que
        coexistían en el sistema eléctrico ibérico.
      </p>

      <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'1rem'}}>
        {FRACTURES.map(f => (
          <div key={f.id}
               style={{borderLeft:`4px solid ${f.color}`,
                       background:'var(--bg-surface)',
                       border:'1px solid var(--border-subtle)',
                       borderRadius:'var(--radius-md)',
                       overflow:'hidden'}}>

            <button
              onClick={() => setExpanded(expanded === f.id ? null : f.id)}
              style={{width:'100%', padding:'1.25rem', textAlign:'left',
                      background:'transparent', border:'none',
                      cursor:'pointer', display:'flex',
                      justifyContent:'space-between', alignItems:'center',
                      gap:'1rem'}}>
              <div>
                <h3 style={{fontFamily:'var(--font-serif)', fontSize:'1.125rem',
                           fontWeight:400, color:'var(--text-primary)',
                           margin:0, marginBottom:'0.25rem'}}>
                  {f.title}
                </h3>
                <p style={{fontSize:'0.875rem', color:'var(--text-secondary)',
                           margin:0, lineHeight:1.5}}>
                  {f.description.substring(0, 120)}...
                </p>
              </div>
              <span style={{fontSize:'1.5rem', color:f.color,
                           flexShrink:0}}>
                {expanded === f.id ? '−' : '+'}
              </span>
            </button>

            {expanded === f.id && (
              <div style={{padding:'0 1.25rem 1.25rem',
                          borderTop:'1px solid var(--border-subtle)'}}>
                <p style={{fontSize:'0.875rem', color:'var(--text-secondary)',
                           lineHeight:1.7, marginBottom:'1rem'}}>
                  {f.id === 'operativa' ? (
                    <>
                      El debate nuclear entre REE e ICAI sobre el primer eslabón de la cadena causal. La tesis del mallado como detonante (ICAI) y la tesis del incumplimiento colectivo como causa (REE/Gobierno) no son mutuamente excluyentes termodinámicamente: ambos factores contribuyeron a la saturación capacitiva de los márgenes Q-V. Lo que sí es excluyente es su implicación jurídica y económica, determinando sobre quién recae la responsabilidad material del colapso tras alcanzarse la <TooltipTerm term="Fase 3">Fase 3</TooltipTerm> de separación física del sistema.
                    </>
                  ) : f.id === 'regulatoria' ? (
                    <>
                      Posición estructural de ENTSO-E: tanto el operador como los generadores actuaron dentro de los límites de una normativa inadecuada para el sistema que pretendía gobernar. El P.O. 7.4 y RD 413/2014 diseñaron control de tensión para red dominada por <TooltipTerm term="Inercia Síncrona">Inercia Síncrona</TooltipTerm> y masas síncronas de respuesta lenta. Aplicarlo a red con 82% penetración IBR equivale a estabilizar sistema de respuesta en milisegundos con regulador diseñado para dinámicas de minutos.
                    </>
                  ) : (
                    <>
                      Consenso unánime sobre insuficiencia del Criterio N-1 estático. Los modelos de flujo de carga que evaluaron el sistema como "Normal" horas antes del colapso son matemáticamente incapaces de representar inestabilidad capacitiva en redes de baja inercia: no resuelven ecuaciones diferenciales, no modelizan dinámica de lazos de control de inversores, no calculan márgenes Q-V en tiempo real. Esta limitación no es fallo puntual del 28-A; es la condición habitual de TODOS los despachos europeos, donde el automatismo de deslastre <TooltipTerm term="UFLS">UFLS</TooltipTerm> se torna ineficaz ante colapsos de tensión dinámicos.
                    </>
                  )}
                </p>

                <p className="t-subheading" style={{marginBottom:'0.5rem',
                                                    color:f.color}}>
                  Implicaciones
                </p>
                {f.implications.map((imp, i) => (
                  <p key={i} style={{fontSize:'0.8125rem',
                                    color:'var(--text-secondary)',
                                    margin:'0 0 0.5rem 1rem',
                                    paddingLeft:'0.5rem',
                                    borderLeft:'1px solid var(--border)'}}>
                    {imp}
                  </p>
                ))}

                <p style={{fontSize:'0.75rem', color:'var(--text-muted)',
                          marginTop:'1rem', fontFamily:'var(--font-mono)'}}>
                  {f.chapter}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
