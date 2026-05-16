import React, { useState } from 'react';
import NextChapter from '../NextChapter';

type ViewMode = 'os' | 'real';

const TIMELINE_EVENTS = [
  { t: '12:03', label: 'Primera oscilación relevante 0,6 Hz detectada en Almaraz 400kV', color: 'var(--warning)' },
  { t: '12:11', label: 'HVDC Francia-España pasa a PMODE (flujo DC fijo 1.000 MW)', color: 'var(--warning)' },
  { t: '12:19', label: 'Segunda oscilación 0,6 Hz superpuesta con 0,2 Hz (hasta 200 mHz)', color: 'var(--alarm)' },
  { t: '12:21', label: 'Conexión 2 circuitos 400kV adicionales — maniobra de mallado', color: 'var(--alarm)', highlight: true },
  { t: '12:30', label: 'Sistema en condiciones previas al colapso — baja fortaleza eléctrica', color: 'var(--alarm)' },
  { t: '12:32', label: 'Inicio de pérdidas de generación en cascada por sobretensión', color: '#8B0000' },
  { t: '12:33:29', label: 'Cero de tensión peninsular — colapso total', color: '#8B0000' },
];

const OS_VIEW_NODES = [
  { x: 120, y: 80, label: 'Nudo A\n400 kV', color: 'var(--accent-blue)', r: 18 },
  { x: 300, y: 80, label: 'Nudo B\n400 kV', color: 'var(--accent-blue)', r: 18 },
  { x: 480, y: 80, label: 'Nudo C\n400 kV', color: 'var(--accent-blue)', r: 18 },
  { x: 300, y: 200, label: 'SCADA\nREE', color: 'var(--nominal)', r: 22 },
];

function TapLagExplainer() {
  const [view, setView] = useState<ViewMode>('os');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('q1');

  const faqs = [
    {
      id: 'q1',
      question: '¿Qué es exactamente el "Tap-Lag"?',
      answer:
        'El Tap-Lag (retraso de derivación) describe la discrepancia temporal entre el estado real de la red de 220kV — tensiones, flujos de potencia, posición de taps de los transformadores OLTC — y lo que el sistema SCADA del Operador del Sistema (Redeia) mostraba en tiempo real. En situaciones dinámicas rápidas, el SCADA no reflejaba la realidad instantánea.',
      source: 'Tesis IIT-ICAI / Compass Lexecon',
      color: 'var(--warning)',
    },
    {
      id: 'q2',
      question: '¿Por qué la maniobra de mallado es relevante para ICAI?',
      answer:
        'A las 12:21, Redeia conectó 2 circuitos 400kV adicionales (mallado). Según ICAI, esto aumentó significativamente la capacitancia total de la red de transporte en un escenario de baja fortaleza eléctrica y baja generación síncrona. El efecto Ferranti (sobretensión en líneas largas en vacío) se agravó. El OS no habría podido detectar plenamente el impacto porque el SCADA de 220kV tenía observabilidad limitada.',
      source: 'Informe pericial IIT-ICAI / AELEC',
      color: 'var(--warning)',
    },
    {
      id: 'q3',
      question: '¿Qué dice el Gobierno sobre el Tap-Lag?',
      answer:
        'El Informe del Comité de Análisis 28-A (Gobierno de España, junio 2025) no menciona el concepto "Tap-Lag". Tampoco atribuye papel causal a la maniobra de mallado. Para el Gobierno, el mallado fue una operación rutinaria dentro de los procedimientos vigentes. La causa principal identificada fue que los generadores renovables no absorbieron reactiva conforme al P.O. 7.4.',
      source: 'Comité de Análisis 28-A — Gobierno de España',
      color: 'var(--accent-blue)',
    },
    {
      id: 'q4',
      question: '¿Por qué esta divergencia es "irreconciliable"?',
      answer:
        'Si el Tap-Lag y el mallado son causas determinantes (tesis ICAI), la responsabilidad recae en el OS. Si no lo son (posición Gobierno), la responsabilidad se distribuye entre generadores. Son dos diagnósticos que implican consecuencias regulatorias y de responsabilidad civil opuestas. No hay acuerdo sobre los hechos — la divergencia es ontológica, no solo de énfasis.',
      source: 'Análisis forense comparativo — TFG Alfonso Monge Díaz-Ángel',
      color: 'var(--alarm)',
    },
  ];

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          TESIS ICAI · DIVERGENCIA FORENSE IRRECONCILIABLE
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          El Fenómeno Tap-Lag
        </h1>
        <p className="t-body-main" style={{ maxWidth: '72ch' }}>
          El concepto más polémico del debate forense post-28A. ICAI/AELEC argumentan que
          Redeia ejecutó una maniobra (mallado) sin visibilidad completa del estado de la red
          de 220kV. El Gobierno no menciona este fenómeno. La asimetría es irreconciliable.
        </p>
      </header>

      {/* Irreconcilable badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(255,32,32,0.08)',
          border: '1px solid rgba(255,32,32,0.3)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--alarm)' }}>
          🔴 DIVERGENCIA IRRECONCILIABLE — SIN CONSENSO INSTITUCIONAL
        </span>
      </div>

      {/* Two panels: ICAI vs Gobierno */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderTop: '3px solid var(--warning)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚙️</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--warning)', background: 'rgba(255,136,0,0.12)', padding: '0.125rem 0.375rem', borderRadius: 'var(--radius-sm)', letterSpacing: '0.06em' }}>
              ICAI / AELEC AFIRMA
            </span>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'El mallado (12:21) aumentó capacitancia en escenario de baja fortaleza',
              'El SCADA de 220kV tenía observabilidad limitada (Tap-Lag)',
              'El OS no detectó que el sistema estaba en zona de inestabilidad',
              'El HVDC en PMODE agravó la situación al retirar soporte dinámico',
              'La responsabilidad operativa recae en Redeia como OS',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
          <p style={{ margin: '0.875rem 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)' }}>
            Fuente: IIT-ICAI / Compass Lexecon (encargo AELEC)
          </p>
        </div>

        <div style={{ padding: '1.25rem', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent-blue)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🏛️</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--accent-blue)', background: 'rgba(46,110,193,0.12)', padding: '0.125rem 0.375rem', borderRadius: 'var(--radius-sm)', letterSpacing: '0.06em' }}>
              GOBIERNO RESPONDE
            </span>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'El mallado fue operación rutinaria dentro de los procedimientos vigentes',
              'No se menciona el concepto "Tap-Lag" en el informe oficial',
              'El SCADA tenía visibilidad adecuada del estado del sistema',
              'El HVDC en PMODE no fue determinante en el colapso',
              'La causa: generadores renovables no absorbieron reactiva (P.O. 7.4)',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
          <p style={{ margin: '0.875rem 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)' }}>
            Fuente: Comité de Análisis 28-A, Gobierno de España (junio 2025)
          </p>
        </div>
      </div>

      {/* Network diagram: OS view vs Real */}
      <div className="surface" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setView('os')}
            style={{ padding: '0.5rem 1rem', background: view === 'os' ? 'var(--warning)' : 'transparent', color: view === 'os' ? 'white' : 'var(--text-secondary)', border: `1px solid ${view === 'os' ? 'var(--warning)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', transition: 'all 0.2s' }}
          >
            ⚙️ Lo que veía el OS (SCADA)
          </button>
          <button
            onClick={() => setView('real')}
            style={{ padding: '0.5rem 1rem', background: view === 'real' ? 'var(--alarm)' : 'transparent', color: view === 'real' ? 'white' : 'var(--text-secondary)', border: `1px solid ${view === 'real' ? 'var(--alarm)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', transition: 'all 0.2s' }}
          >
            ⚡ Lo que ocurría realmente
          </button>
        </div>

        <svg width="100%" viewBox="0 0 600 280" style={{ maxHeight: '240px' }} aria-label={view === 'os' ? 'Vista SCADA del operador del sistema' : 'Estado real de la red con zonas no observadas'}>
          {/* Background zones */}
          <rect x="10" y="10" width="580" height="260" rx="6" fill="var(--bg-raised)" stroke="var(--border)" strokeWidth="1" />

          {/* 400kV observable layer */}
          <rect x="20" y="20" width="560" height="100" rx="4" fill="rgba(46,110,193,0.06)" stroke="rgba(46,110,193,0.25)" strokeWidth="1" strokeDasharray="none" />
          <text x="28" y="38" fontFamily="var(--font-mono)" fontSize="9" fill="var(--accent-blue)" opacity={0.8}>RED 400 kV — OBSERVABLE (SCADA)</text>

          {/* 220kV layer */}
          <rect x="20" y="135" width="560" height="110" rx="4"
            fill={view === 'real' ? 'rgba(255,32,32,0.06)' : 'rgba(255,255,255,0.02)'}
            stroke={view === 'real' ? 'rgba(255,32,32,0.3)' : 'rgba(255,255,255,0.08)'}
            strokeWidth="1" strokeDasharray={view === 'os' ? '5 3' : 'none'} />
          <text x="28" y="153" fontFamily="var(--font-mono)" fontSize="9"
            fill={view === 'real' ? 'var(--alarm)' : 'var(--text-muted)'}
            opacity={view === 'os' ? 0.5 : 0.9}>
            {view === 'os' ? 'RED 220 kV — OBSERVABILIDAD LIMITADA (Tap-Lag)' : 'RED 220 kV — ESTADO REAL (capacitancia aumentada por mallado)'}
          </text>

          {/* 400kV nodes */}
          {OS_VIEW_NODES.slice(0, 3).map((node, i) => (
            <g key={i}>
              <circle cx={node.x} cy={node.y} r={node.r} fill={`${node.color}20`} stroke={node.color} strokeWidth="1.5" />
              <text x={node.x} y={node.y - 3} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--text-primary)">{node.label.split('\n')[0]}</text>
              <text x={node.x} y={node.y + 9} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--text-secondary)">{node.label.split('\n')[1]}</text>
            </g>
          ))}

          {/* 400kV connections */}
          <line x1="138" y1="80" x2="282" y2="80" stroke="var(--accent-blue)" strokeWidth="2" />
          <line x1="318" y1="80" x2="462" y2="80" stroke="var(--accent-blue)" strokeWidth="2" />

          {/* New circuit from mallado */}
          {view === 'real' && (
            <>
              <path d="M 120 98 Q 300 115 480 98" stroke="var(--alarm)" strokeWidth="2" strokeDasharray="6 3" fill="none" />
              <text x="300" y="112" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--alarm)">+ 2 circuitos 400kV (12:21 — mallado)</text>
            </>
          )}

          {/* 220kV nodes */}
          <circle cx="180" cy="195" r="14"
            fill={view === 'real' ? 'rgba(255,32,32,0.15)' : 'rgba(255,255,255,0.03)'}
            stroke={view === 'real' ? 'var(--alarm)' : 'rgba(255,255,255,0.15)'}
            strokeWidth="1.5" strokeDasharray={view === 'os' ? '4 2' : 'none'} />
          <text x="180" y="192" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill={view === 'real' ? 'var(--alarm)' : 'var(--text-muted)'} opacity={view === 'os' ? 0.4 : 1}>S1</text>
          <text x="180" y="203" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill={view === 'real' ? 'var(--alarm)' : 'var(--text-muted)'} opacity={view === 'os' ? 0.4 : 1}>220kV</text>

          <circle cx="420" cy="195" r="14"
            fill={view === 'real' ? 'rgba(255,32,32,0.15)' : 'rgba(255,255,255,0.03)'}
            stroke={view === 'real' ? 'var(--alarm)' : 'rgba(255,255,255,0.15)'}
            strokeWidth="1.5" strokeDasharray={view === 'os' ? '4 2' : 'none'} />
          <text x="420" y="192" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill={view === 'real' ? 'var(--alarm)' : 'var(--text-muted)'} opacity={view === 'os' ? 0.4 : 1}>S2</text>
          <text x="420" y="203" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill={view === 'real' ? 'var(--alarm)' : 'var(--text-muted)'} opacity={view === 'os' ? 0.4 : 1}>220kV</text>

          {/* Capacitance visualization */}
          {view === 'real' && (
            <>
              <text x="300" y="230" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--alarm)">⚡ Capacitancia aumentada → Sobretensión propagada</text>
              <text x="300" y="245" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--text-muted)">El OS no observó este estado en tiempo real (Tap-Lag)</text>
            </>
          )}

          {view === 'os' && (
            <text x="300" y="230" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--text-muted)" opacity={0.5}>
              Estado 220kV: observabilidad limitada en SCADA
            </text>
          )}
        </svg>
      </div>

      {/* Timeline of meshing */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: '0 0 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          SECUENCIA TEMPORAL — CONTEXTO DEL MALLADO
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {TIMELINE_EVENTS.map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px', flexShrink: 0 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ev.color, flexShrink: 0, marginTop: '10px', boxShadow: ev.highlight ? `0 0 8px ${ev.color}` : 'none' }} />
                {i < TIMELINE_EVENTS.length - 1 && <div style={{ width: '1px', flex: 1, minHeight: '24px', background: 'var(--border)' }} />}
              </div>
              <div style={{ padding: '0.5rem 0 0.75rem', borderLeft: ev.highlight ? `2px solid ${ev.color}` : 'none', paddingLeft: ev.highlight ? '0.75rem' : 0, background: ev.highlight ? `${ev.color}08` : 'transparent', borderRadius: ev.highlight ? 'var(--radius-sm)' : 0 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: ev.color, display: 'block' }}>
                  {ev.t}
                  {ev.highlight && <span style={{ marginLeft: '0.5rem', fontSize: '0.5625rem', background: `${ev.color}20`, padding: '0.1rem 0.35rem', borderRadius: '3px' }}>MANIOBRA MALLADO</span>}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{ev.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: '1.5rem' }}>
        {faqs.map(faq => (
          <div key={faq.id} style={{ marginBottom: '0.5rem', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              aria-expanded={expandedFaq === faq.id}
              style={{ width: '100%', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{faq.question}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{expandedFaq === faq.id ? '▲' : '▼'}</span>
            </button>
            {expandedFaq === faq.id && (
              <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ margin: '0.75rem 0 0.5rem', fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.65 }}>{faq.answer}</p>
                <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: faq.color }}>{faq.source}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Academic note */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '2rem' }}>
        <p style={{ margin: '0 0 0.375rem', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          NOTA ACADÉMICA — POSICIÓN METODOLÓGICA DEL TFG
        </p>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Este componente presenta la tesis ICAI sin adoptarla editorialmente. El TFG mantiene
          posición analítica comparativa: la divergencia entre el informe ICAI/AELEC y el Informe
          del Comité de Análisis 28-A es en sí misma un objeto de estudio sobre las fracturas de
          gobernanza técnica y la asimetría informativa en la investigación de incidentes críticos.
        </p>
        <p style={{ margin: '0.5rem 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)' }}>
          Fuente: Análisis forense comparativo — TFG Alfonso Monge Díaz-Ángel, Universidad de Sevilla, 2026
        </p>
      </div>

      <NextChapter
        path="/reforms"
        label="Historial de Reformas"
        desc="Las propuestas regulatorias y tecnológicas para prevenir el próximo colapso"
      />
    </div>
  );
}

export default React.memo(TapLagExplainer);
