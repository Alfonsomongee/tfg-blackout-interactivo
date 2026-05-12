import { useState } from 'react';
import NextChapter from '../NextChapter';

const DIVERGENCES = [
  {
    id: 1,
    eje: 'Origen de la saturación capacitiva',
    icon: '⚡',
    positions: {
      gob: {
        label: 'Gobierno / REE',
        color: 'var(--info)',
        symbol: '●',
        text: 'El sistema tenía márgenes suficientes. La saturación se produjo porque los generadores no absorbieron la potencia reactiva requerida (P.O. 7.4 y RD 413/2014). El mallado fue una medida protocolizada y necesaria ante las oscilaciones.',
        verdict: 'Fallo del parque generador',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--alarm)',
        symbol: '●',
        text: 'El mallado de 11 líneas en vacío inyectó 1,05–2,4 GVAr capacitivos por Efecto Ferranti, contrayendo el margen Q-V de Carmona un 57% (2.964 → 1.268 MW). El colapso era matemáticamente inevitable antes de que fallara ninguna planta.',
        verdict: 'Fallo del operador (mallado)',
      },
      entsoe: {
        label: 'ENTSO-E',
        color: 'var(--warning)',
        symbol: '◦',
        text: 'No atribuye causalidad al mallado, pero documenta que los RCC no detectaron la saturación capacitiva. Identifica la restricción normativa de los IBR como la vulnerabilidad estructural primaria.',
        verdict: 'Fallo del marco normativo',
      },
    },
  },
  {
    id: 2,
    eje: 'Naturaleza de la oscilación de 0,63 Hz',
    icon: '〜',
    positions: {
      gob: {
        label: 'Gobierno / REE',
        color: 'var(--info)',
        symbol: '●',
        text: 'Oscilación forzada con origen en el lazo de control de una planta fotovoltaica en Badajoz. Este comportamiento anómalo es el detonante de la secuencia que llevó al colapso.',
        verdict: 'Origen externo: planta FV de Badajoz',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--alarm)',
        symbol: '●',
        text: 'Las evidencias no son concluyentes. La oscilación pudo ser un modo inter-área natural amplificado por el ratio de amortiguamiento próximo al 1% (límite P.O. 13.1: 5%), consecuencia de la ausencia de PSS activos en los ciclos combinados apagados en la zona sur.',
        verdict: 'Modo natural por baja inercia',
      },
      entsoe: {
        label: 'ENTSO-E',
        color: 'var(--warning)',
        symbol: '◦',
        text: 'Documenta la oscilación como atípica (0,63 Hz, detectada hasta Alemania), pero no atribuye causalidad definitiva. Señala que la baja inercia amplificó cualquier perturbación de origen.',
        verdict: 'Atípica, causalidad no resuelta',
      },
    },
  },
  {
    id: 3,
    eje: 'Legitimidad de los disparos (Tap-Lag)',
    icon: '⚠',
    positions: {
      gob: {
        label: 'Gobierno / REE',
        color: 'var(--info)',
        symbol: '●',
        text: 'Los primeros disparos (12:32:57–12:33:18 CEST) fueron "inadecuados" o prematuros: el SCADA de REE registraba 418 kV en la red de 400 kV, dentro de los límites del P.O. 1.1 (≤ 435 kV). Las plantas no debían haberse desconectado.',
        verdict: 'Disparos prematuros e inadecuados',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--alarm)',
        symbol: '●',
        text: 'Los disparos fueron normativamente correctos. El Tap-Lag creó un point ciego: las redes colectoras de 220 kV alcanzaban 244 kV (> 1,10 pu), invisibles para el SCADA. El titular de la ICE de Granada confirmó que su protección actuó correctamente. 418 kV (400kV) ≠ 244 kV (220kV).',
        verdict: 'Disparos correctos — fallo de observabilidad del operador',
      },
      entsoe: {
        label: 'ENTSO-E',
        color: 'var(--warning)',
        symbol: '◦',
        text: 'No califica los disparos como inadecuados. Subraya la inobservabilidad de la red subyacente como limitación sistémica del operador y de los RCC. La arquitectura de monitorización era insuficiente.',
        verdict: 'Limitación sistémica de observabilidad',
      },
    },
  },
  {
    id: 4,
    eje: 'Despacho en la zona sur',
    icon: '🗺',
    positions: {
      gob: {
        label: 'Gobierno / REE',
        color: 'var(--info)',
        symbol: '◦',
        text: 'Reconoce la indisponibilidad del ciclo combinado andaluz desde la tarde del 27 de abril. Justifica la no sustitución por los niveles de tensión adecuados en ese momento y la disponibilidad de otros recursos en la región.',
        verdict: 'Decisión justificada por condiciones del sistema',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--alarm)',
        symbol: '●',
        text: 'La zona sur disponía de solo 0,2 GVAr de absorción frente a > 0,7 GVAr de inyección capacitiva inducida por el propio operador. La no sustitución del ciclo combinado fue la decisión de despacho más determinante del incidente. El desbalance era matemáticamente insalvable.',
        verdict: 'Error de despacho determinante',
      },
      entsoe: {
        label: 'ENTSO-E',
        color: 'var(--warning)',
        symbol: '◦',
        text: 'No se pronuncia sobre la decisión individual de despacho, pero señala la baja potencia de cortocircuito en Andalucía como factor estructural agravante.',
        verdict: 'Factor estructural agravante',
      },
    },
  },
  {
    id: 5,
    eje: 'Responsabilidad principal',
    icon: '⚖',
    positions: {
      gob: {
        label: 'Gobierno / REE',
        color: 'var(--info)',
        symbol: '●',
        text: 'Los generadores incumplieron sus obligaciones de control de tensión. Si todos los agentes hubieran cumplido la normativa vigente en su punto de conexión, el sistema habría absorbido el transitorio. El apagón fue un fallo del parque generador privado.',
        verdict: '→ RESPONSABILIDAD: Generadores privados',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--alarm)',
        symbol: '●',
        text: 'REE llevó la red a un estado de colapso inevitable mediante el mallado, con visibilidad insuficiente y despacho inadecuado. Los generadores actuaron conforme a la física y a la normativa en su punto de conexión. El apagón fue un fallo del operador y del regulador.',
        verdict: '→ RESPONSABILIDAD: REE / Operador',
      },
      entsoe: {
        label: 'ENTSO-E',
        color: 'var(--warning)',
        symbol: '●',
        text: 'La causa raíz es normativa: la restricción regulatoria que impedía a los IBR controlar tensión dinámicamente. El fallo es del sistema regulatorio europeo y nacional, no atribuible exclusivamente a ningún agente individual.',
        verdict: '→ RESPONSABILIDAD: Marco normativo (P.O. 7.4 / RD 413/2014)',
      },
    },
  },
];

const CONSENSUS = [
  { text: 'La inercia NO fue la causa raíz (H = 2,3 s > umbral 2,0 s)', all: true },
  { text: 'Colapso por sobretensión capacitiva, no por déficit de frecuencia', all: true },
  { text: 'Las reservas de potencia activa eran suficientes (> 7.000 MW)', all: true },
  { text: 'El UFLS agravó el colapso al eliminar sumideros de reactiva', all: true },
  { text: 'Las protecciones OST de los Pirineos actuaron correctamente', all: true },
  { text: 'La normativa IBR (P.O. 7.4 / RD 413/2014) era insuficiente', all: true },
  { text: 'El Criterio N−1 estático es incapaz de anticipar colapsos dinámicos', all: true },
];

export default function DivergenceTable() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'divergencias' | 'consenso'>('divergencias');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 3rem' }}>
      <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>
        Cap. 5 — Análisis comparativo de informes
      </p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
        fontWeight: 400, color: 'var(--text-primary)', marginBottom: '0.5rem',
      }}>
        5 Divergencias irreconciliables entre los 4 informes
      </h2>
      <p className="t-body" style={{ maxWidth: '650px', marginBottom: '2rem' }}>
        Gobierno, REE, ICAI y ENTSO-E coinciden en 7 puntos técnicos y
        divergen radicalmente en 5. Estas divergencias tienen
        implicaciones jurídicas directas sobre la responsabilidad del colapso.
      </p>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '0.5rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '2rem',
      }}>
        {(['divergencias', 'consenso'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.625rem 1.25rem',
              background: 'transparent', border: 'none',
              cursor: 'pointer',
              fontSize: '0.8125rem', fontFamily: 'var(--font-mono)',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--accent-blue)' : 'var(--text-muted)',
              borderBottom: activeTab === tab
                ? '2px solid var(--accent-blue)'
                : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'all 0.15s',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
            {tab === 'divergencias'
              ? `⚡ 5 Divergencias`
              : `✓ 7 Consensos`}
          </button>
        ))}
      </div>

      {activeTab === 'divergencias' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {DIVERGENCES.map((div) => (
            <div key={div.id} style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}>
              <button
                id={`divergence-btn-${div.id}`}
                onClick={() => setOpenId(openId === div.id ? null : div.id)}
                aria-expanded={openId === div.id}
                aria-controls={`divergence-panel-${div.id}`}
                style={{
                  width: '100%', padding: '1rem 1.25rem',
                  background: openId === div.id
                    ? 'var(--bg-raised)' : 'var(--bg-surface)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: '1rem',
                  textAlign: 'left',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                  }}>
                    EJE {div.id}
                  </span>
                  <span style={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}>
                    {div.icon} {div.eje}
                  </span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                  {openId === div.id ? '−' : '+'}
                </span>
              </button>

              {openId === div.id && (
                <div 
                  id={`divergence-panel-${div.id}`}
                  role="region"
                  aria-labelledby={`divergence-btn-${div.id}`}
                  className="accordion-content" 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '0',
                    borderTop: '1px solid var(--border)',
                  }}>
                  {Object.values(div.positions).map((pos, i) => (
                    <div key={i} style={{
                      padding: '1.25rem',
                      borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                      borderTop: 'none',
                    }}>
                      <p style={{
                        margin: '0 0 0.5rem',
                        fontSize: '0.6875rem',
                        fontFamily: 'var(--font-mono)',
                        color: pos.color,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                      }}>
                        {pos.symbol} {pos.label}
                      </p>
                      <p style={{
                        margin: '0 0 1rem',
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                      }}>
                        {pos.text}
                      </p>
                      <p style={{
                        margin: 0, padding: '0.5rem 0.75rem',
                        background: 'var(--bg-raised)',
                        borderLeft: `3px solid ${pos.color}`,
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: pos.color,
                        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                      }}>
                        {pos.verdict}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{
            marginTop: '1rem', padding: '1.25rem',
            background: 'var(--bg-surface)',
            borderLeft: '4px solid var(--alarm)',
            borderRadius: 'var(--radius-md)',
          }}>
            <p style={{
              margin: '0 0 0.5rem', fontSize: '0.875rem',
              fontWeight: 500, color: 'var(--text-primary)',
            }}>
              ¿Por qué estas divergencias son irreconciliables?
            </p>
            <p style={{
              margin: 0, fontSize: '0.8125rem',
              color: 'var(--text-secondary)', lineHeight: 1.7,
            }}>
              Las posiciones de REE e ICAI no son mutuamente excluyentes
              en términos termodinámicos: ambos factores contribuyeron
              a la saturación Q-V. Lo que sí son excluyentes es su
              implicación jurídica: determinan sobre quién recae la
              responsabilidad económica del colapso. La ambigüedad no es
              un accidente analítico — es el resultado predecible de operar
              sin PMUs en todos los nudos críticos. — Cap. 5.5, TFG.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'consenso' && (
        <div>
          <p style={{
            fontSize: '0.8125rem', color: 'var(--text-secondary)',
            marginBottom: '1.5rem', maxWidth: '560px',
          }}>
            A pesar de la polarización, todos los informes coinciden en
            7 puntos técnicos. Estos consensos desmienten las narrativas
            mediáticas más extendidas.
          </p>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {CONSENSUS.map((c, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                padding: '1rem 1.25rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderLeft: '3px solid var(--nominal)',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{
                  color: 'var(--nominal)',
                  fontSize: '1rem', flexShrink: 0, marginTop: '1px',
                }}>✓</span>
                <div>
                  <p style={{
                    margin: '0 0 0.375rem', fontSize: '0.875rem',
                    fontWeight: 500, color: 'var(--text-primary)',
                  }}>
                    {c.text}
                  </p>
                  <p style={{
                    margin: 0, fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                  }}>
                    GOB ✓ · REE ✓ · ICAI ✓ · ENTSO-E ✓
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <NextChapter path="/reactiva" label="Balance Q-V" desc="El déficit de reactiva zonal" />
    </div>
  );
}
