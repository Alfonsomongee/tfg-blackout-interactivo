import { useState } from 'react';
import NextChapter from '../NextChapter';

const RECOVERY_EVENTS = [
  {
    time: '12:33:30',
    label: 'Cero de tensión',
    desc: 'REE activa P.O. 1.6. Fragmentación en 7 islas eléctricas independientes: Zona Sur, Tajo-Centro, Levante y otras.',
    type: 'critical',
    phase: 'COLAPSO',
  },
  {
    time: '12:34',
    label: 'Coordinación bilateral',
    desc: 'REE contacta con REN (Portugal): toda la red lusa también sin tensión. ENTSO-E modifica estado ibérico a "Restauración".',
    type: 'action',
    phase: 'EMERGENCIA',
  },
  {
    time: '12:44',
    label: 'Suspensión del mercado',
    desc: 'REE y OMIE suspenden mercados intradiarios. REE despacha generadores bajo criterios técnicos exclusivos, sin Orden de Mérito.',
    type: 'action',
    phase: 'EMERGENCIA',
  },
  {
    time: '12:49–12:54',
    label: 'Mando europeo activado',
    desc: 'SAM (Swissgrid + Amprion) confirman emergencia. REE = líder de frecuencia ibérica. Swissgrid = estabilidad continental. RTE (Francia) = líder de resincronización.',
    type: 'coordination',
    phase: 'EMERGENCIA',
  },
  {
    time: '13:04',
    label: 'Ancla de Andalucía: Marruecos',
    desc: 'Puerto de la Cruz–Mellousa: ONEE inyecta ~900 MW. Referencia de tensión para Andalucía tras fracasar Black Start hidroeléctrico en la zona sur.',
    type: 'milestone',
    phase: 'BLACK START',
  },
  {
    time: '13:07',
    label: 'Primer suministro',
    desc: 'Subestación de Irún: primeros 31 MW reconectados. Francia (RTE) aporta hasta 4.500 MW por corredor norte.',
    type: 'milestone',
    phase: 'BLACK START',
  },
  {
    time: '20:22',
    label: 'Sincronización ibérica',
    desc: 'Portugal sincroniza sus islas con España y con la frecuencia continental europea. Hito que garantiza la viabilidad de la reposición total.',
    type: 'milestone',
    phase: 'RECUPERACIÓN',
  },
  {
    time: '23:32',
    label: '55% de carga cubierta',
    desc: '21 grupos térmicos sincronizados. Demanda cubierta: 13.039 MW (≈55% de la carga esperada). Renovables aún vetadas.',
    type: 'progress',
    phase: 'RECUPERACIÓN',
  },
  {
    time: '00:06 (29A)',
    label: 'Regulación automática restaurada',
    desc: 'REE reactiva el controlador aFRR (reserva de restauración de frecuencia automática). Sistema deja de depender del control manual.',
    type: 'milestone',
    phase: 'ESTABILIZACIÓN',
  },
  {
    time: '01:38 (29A)',
    label: 'Primera autorización renovables',
    desc: 'CECRE autoriza reintegración paulatina de parques eólicos y cogeneración. Solo tras acreditar robustez inercial suficiente.',
    type: 'action',
    phase: 'ESTABILIZACIÓN',
  },
  {
    time: '07:05 (29A)',
    label: '99,95% del suministro restituido',
    desc: 'REE certifica la restitución total. 19 horas de maniobras ininterrumpidas. Crisis cerrada a nivel de usuarios.',
    type: 'success',
    phase: 'FIN',
  },
];

const BLACK_START_ATTEMPTS = [
  { zone: 'Galicia / Asturias / Duero', result: 'EXITOSO', note: 'Arranque hidroeléctrico estable. Primer anclaje del norte peninsular.' },
  { zone: 'Cantabria', result: 'FALLIDO → REINICIO', note: 'Colapso por transitorio capacitivo en líneas vacías. Reiniciada.' },
  { zone: 'Levante', result: 'FALLIDO → REINICIO', note: 'Colapsó. Tuvo que reiniciarse y apoyarse en corredor francés.' },
  { zone: 'Madrid', result: 'MÚLTIPLES FALLOS', note: 'Central asignada no logró estabilizar parámetros tras varios intentos.' },
  { zone: 'Andalucía', result: 'INFRUCTUOSO', note: 'Black Start hidroeléctrico imposible. Dependió de Marruecos (900 MW).' },
  { zone: 'Portugal (Centro)', result: 'EXITOSO (2º intento)', note: 'Disparo en 1er intento al conectar transformador 220/60 kV. Estable en 2º.' },
];

const phaseColor = (phase: string) => {
  if (phase === 'COLAPSO') return 'var(--alarm)';
  if (phase === 'EMERGENCIA') return 'var(--warning)';
  if (phase === 'BLACK START') return 'var(--info)';
  if (phase === 'RECUPERACIÓN') return 'var(--accent-blue)';
  if (phase === 'ESTABILIZACIÓN') return 'var(--accent-blue)';
  if (phase === 'FIN') return 'var(--nominal)';
  return 'var(--border)';
};

const typeIcon = (type: string) => {
  if (type === 'critical') return '●';
  if (type === 'milestone') return '◆';
  if (type === 'success') return '✓';
  if (type === 'coordination') return '↔';
  return '→';
};

export default function BlackStartTimeline() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 3rem' }}>
      <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>
        Cap. 4 — Reposición del suministro
      </p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
        fontWeight: 400, color: 'var(--text-primary)', marginBottom: '0.5rem'
      }}>
        Black Start: las 19 horas que devolvieron la luz
      </h2>
      <p className="t-body" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        Desde el cero de tensión a las 12:33:30 CEST hasta la restitución
        del 99,95% del suministro a las 07:05 del 29 de abril. Estrategia
        dual Top-Down (Francia + Marruecos) + Bottom-Up (hidroeléctricas).
      </p>

      {/* Métricas clave */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem', marginBottom: '2.5rem'
      }}>
        {[
          { val: '19h', label: 'Duración reposición', color: 'var(--alarm)' },
          { val: '7', label: 'Islas eléctricas independientes', color: 'var(--warning)' },
          { val: '4.500 MW', label: 'Soporte máximo desde Francia (RTE)', color: 'var(--info)' },
          { val: '900 MW', label: 'Ancla de Andalucía desde Marruecos', color: 'var(--accent-blue)' },
          { val: '21', label: 'Grupos térmicos sincronizados (23:32)', color: 'var(--nominal)' },
          { val: '99,95%', label: 'Suministro restituido (07:05 del 29A)', color: 'var(--nominal)' },
        ].map((m, i) => (
          <div key={i} style={{
            padding: '1rem',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderTop: `3px solid ${m.color}`,
            borderRadius: 'var(--radius-md)',
          }}>
            <p style={{
              margin: '0 0 0.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.5rem', fontWeight: 600,
              color: m.color, lineHeight: 1,
            }}>
              {m.val}
            </p>
            <p style={{
              margin: 0, fontSize: '0.75rem',
              color: 'var(--text-secondary)', lineHeight: 1.4,
            }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline de eventos */}
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.125rem',
        fontWeight: 400, color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0.5rem', marginBottom: '1.5rem'
      }}>
        Cronología de la reposición
      </h3>

      <div style={{ position: 'relative', marginBottom: '3rem' }}>
        <div style={{
          position: 'absolute', left: '90px', top: 0, bottom: 0,
          width: '1px', background: 'var(--border)',
        }} />

        {RECOVERY_EVENTS.map((ev, i) => (
          <div key={i} style={{
            display: 'flex', gap: '1.5rem',
            marginBottom: '1rem', alignItems: 'flex-start',
          }}>
            <p style={{
              margin: 0, width: '80px', flexShrink: 0,
              fontSize: '0.6875rem', color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', textAlign: 'right',
              paddingTop: '0.75rem', lineHeight: 1.3,
            }}>
              {ev.time}
            </p>

            <div style={{
              width: '12px', height: '12px', borderRadius: '50%',
              background: phaseColor(ev.phase),
              flexShrink: 0, marginTop: '0.85rem',
              boxShadow: `0 0 0 3px var(--bg-primary)`,
              zIndex: 1,
            }} />

            <button
              onClick={() => setExpanded(expanded === `ev-${i}` ? null : `ev-${i}`)}
              style={{
                flex: 1, textAlign: 'left', background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${phaseColor(ev.phase)}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem', cursor: 'pointer',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{
                    fontSize: '0.6875rem', color: phaseColor(ev.phase),
                    fontFamily: 'var(--font-mono)', fontWeight: 500,
                    marginRight: '0.5rem',
                  }}>
                    {typeIcon(ev.type)} {ev.phase}
                  </span>
                  <p style={{
                    margin: '0.1rem 0 0', fontSize: '0.875rem',
                    fontWeight: 500, color: 'var(--text-primary)',
                  }}>
                    {ev.label}
                  </p>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                  {expanded === `ev-${i}` ? '−' : '+'}
                </span>
              </div>

              {expanded === `ev-${i}` && (
                <p style={{
                  margin: '0.75rem 0 0', fontSize: '0.8125rem',
                  color: 'var(--text-secondary)', lineHeight: 1.7,
                  borderTop: '1px solid var(--border)', paddingTop: '0.75rem',
                }}>
                  {ev.desc}
                </p>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Intentos Black Start */}
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.125rem',
        fontWeight: 400, color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0.5rem', marginBottom: '1rem'
      }}>
        Intentos de arranque autónomo (Black Start) por zona
      </h3>
      <p style={{
        fontSize: '0.8125rem', color: 'var(--text-secondary)',
        marginBottom: '1.5rem', maxWidth: '560px'
      }}>
        Los IBR en modo grid-following son incapaces de generar tensión sin red externa.
        Solo las máquinas síncronas con Black Start podían reiniciar el sistema.
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {BLACK_START_ATTEMPTS.map((a, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '1rem', alignItems: 'center',
            padding: '0.875rem 1rem',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div>
              <p style={{
                margin: '0 0 0.25rem', fontSize: '0.875rem',
                fontWeight: 500, color: 'var(--text-primary)',
              }}>
                {a.zone}
              </p>
              <p style={{
                margin: 0, fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}>
                {a.note}
              </p>
            </div>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              background: a.result === 'EXITOSO'
                ? 'rgba(var(--nominal-rgb, 34,197,94), 0.1)'
                : 'rgba(var(--alarm-rgb, 239,68,68), 0.1)',
              color: a.result === 'EXITOSO' ? 'var(--nominal)' : 'var(--alarm)',
              border: `1px solid ${a.result === 'EXITOSO' ? 'var(--nominal)' : 'var(--alarm)'}`,
              whiteSpace: 'nowrap',
            }}>
              {a.result}
            </span>
          </div>
        ))}
      </div>

      {/* Lección clave */}
      <div style={{
        marginTop: '2rem', padding: '1.25rem',
        background: 'var(--bg-surface)',
        borderLeft: '4px solid var(--info)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{
          margin: '0 0 0.5rem', fontSize: '0.875rem',
          fontWeight: 500, color: 'var(--text-primary)',
        }}>
          Lección operativa del Black Start
        </p>
        <p style={{
          margin: 0, fontSize: '0.8125rem',
          color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          La reposición demostró de forma empírica lo inverso al colapso: el 82% de IBR
          (solar + eólica) estaba físicamente intacto y disponible, pero fue inútil durante
          19 horas. Solo las máquinas síncronas — centrales hidráulicas, CCGT y nucleares —
          podían generar la onda de tensión inicial. Su ausencia en el despacho previo fue
          condición necesaria del colapso; su priorización en la reposición fue condición
          suficiente de la recuperación. — Cap. 4, TFG.
        </p>
      </div>
      <NextChapter path="/simulator" label="Simulador de Contingencias" desc="Interactúa con la estabilidad del sistema" />
    </div>
  );
}
