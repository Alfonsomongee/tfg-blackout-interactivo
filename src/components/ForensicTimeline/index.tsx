import { useState } from 'react';
import React from 'react';
import NextChapter from '../NextChapter';

type Severity = 'info' | 'alert' | 'critical' | 'catastrophic';

interface TimelineEvent {
  id: string;
  timestamp: string;
  phase: 0 | 1 | 2 | 3 | 4;
  description: string;
  detail?: string;
  mwLost?: number;
  severity: Severity;
  source: string;
}

const EVENTS: TimelineEvent[] = [
  {
    id: 'osc-0549',
    timestamp: '05:49 CEST',
    phase: 0,
    description: 'Oscilación 0,2 Hz detectada',
    detail: 'Muy baja amplitud. Sin impacto operativo. Sistema estable.',
    severity: 'info',
    source: 'REE / Informe Gobierno p.29',
  },
  {
    id: 'osc-0852',
    timestamp: '08:52 CEST',
    phase: 0,
    description: 'Segunda oscilación 0,2 Hz',
    detail: 'Baja amplitud. Sistema absorbe sin medidas correctoras.',
    severity: 'info',
    source: 'REE / Informe Gobierno p.29',
  },
  {
    id: 'freq-0902',
    timestamp: '09:02 CEST',
    phase: 0,
    description: 'Desvío de frecuencia −148 mHz',
    detail:
      'Motivado por cambios en programas internacionales en Europa. Normalizado sin intervención.',
    severity: 'alert',
    source: 'REE / Informe Gobierno p.30',
  },
  {
    id: 'osc-1103',
    timestamp: '11:03 CEST',
    phase: 0,
    description: 'Oscilación 0,2 Hz — amplitud 7 kV pico-pico',
    detail:
      'Detectada en nudos de 400 kV. Amplitud mayor que episodios previos pero sin superar umbrales de actuación.',
    severity: 'alert',
    source: 'REE / Informe Gobierno p.31',
  },
  {
    id: 'osc-1203',
    timestamp: '12:03 CEST',
    phase: 1,
    description: 'PRIMERA OSCILACIÓN RELEVANTE — 0,6 Hz, 70 mHz',
    detail:
      'Almaraz 400 kV: amplitud pico-pico 31,2 kV. Arroyo de San Serván: 32,7 kV. Tensión baja a 375 kV (93,75% nominal). Detectada en Francia: Tavel, Loony, Albertville. Duración: 4 min 42 s — se amortigua sola.',
    severity: 'critical',
    source: 'REE / Informe Gobierno p.33',
  },
  {
    id: 'hvdc-1211',
    timestamp: '12:11 CEST',
    phase: 1,
    description: 'HVDC Francia-España: modo PMODE activado',
    detail:
      'Interconexión HVDC pasa de emulación AC a PMODE (flujo DC fijo). El ICAI lo señala como factor agravante de la rigidez de flujo durante las oscilaciones.',
    severity: 'alert',
    source: 'REE / Informe Gobierno p.35',
  },
  {
    id: 'osc-1219',
    timestamp: '12:19 CEST',
    phase: 1,
    description: 'Segunda oscilación 0,6 Hz + 0,2 Hz superpuesta',
    detail:
      'Amplitud 0,6 Hz: ~30 mHz. Aparece oscilación 0,2 Hz superpuesta: hasta 200 mHz. Almaraz 400 kV: 23 kV pico-pico.',
    severity: 'critical',
    source: 'REE / Informe Gobierno p.36',
  },
  {
    id: 'ren-1220',
    timestamp: '12:20 CEST',
    phase: 1,
    description: 'REE solicita a REN (Portugal) reducir intercambio',
    detail:
      'Solicitud de reducción a 2.000 MW. REN solicita mantener 2.500 MW. La negociación se alarga hasta el colapso.',
    severity: 'alert',
    source: 'Informe Gobierno p.37',
  },
  {
    id: 'sys-1230',
    timestamp: '12:30 CEST',
    phase: 1,
    description: 'Sistema en estado pre-colapso: 25.184 MW demanda, 82% renovable',
    detail:
      'Demanda: 25.184 MW. Mix: 82% renovable + 10% nuclear + 3% gas + 1% carbón + 4% cogeneración. Bombeo: 2.978 MW. Indisponibles: 12.800 MW (7.400 CCGT + 3.000 nuclear). Precio mercado: 18,50 €/MWh.',
    severity: 'alert',
    source: 'Informe Gobierno p.40',
  },
  {
    id: 'gen-123205',
    timestamp: '12:32:05,000 CEST',
    phase: 2,
    description: 'Primera pérdida de generación',
    mwLost: 2.6,
    detail: 'Inicio de la secuencia de pérdidas por sobretensión. Primeros 2,6 MW perdidos.',
    severity: 'critical',
    source: 'Informe Gobierno p.43',
  },
  {
    id: 'gen-123209',
    timestamp: '12:32:09,000 CEST',
    phase: 2,
    description: 'Pérdidas múltiples simultáneas',
    mwLost: 35.2,
    detail:
      'Cuatro plantas pierden simultáneamente: 21,6 + 5,9 + 4,8 + 2,9 MW. Señal de cascada iniciada.',
    severity: 'critical',
    source: 'Informe Gobierno p.43',
  },
  {
    id: 'gen-123225',
    timestamp: '12:32:25,000 CEST',
    phase: 2,
    description: 'Pérdida 22,6 MW',
    mwLost: 22.6,
    detail: '19,2 + 3,4 MW. La cascada continúa acelerándose.',
    severity: 'critical',
    source: 'Informe Gobierno p.43',
  },
  {
    id: 'gen-123229',
    timestamp: '12:32:29,000 CEST',
    phase: 2,
    description: 'Pérdida crítica: 80,3 MW en un ciclo',
    mwLost: 80.3,
    detail:
      'Evento más grande hasta ahora: 22,4 + 55,6 + 2,3 MW. El pico de 55,6 MW es el disparo más grande individual de la fase de pérdidas.',
    severity: 'catastrophic',
    source: 'Informe Gobierno p.43',
  },
  {
    id: 'gen-123249',
    timestamp: '12:32:49,000 CEST',
    phase: 2,
    description: 'Pérdida 14,4 MW',
    mwLost: 14.4,
    detail: '13,3 + 1,1 MW. La frecuencia empieza a descender de 50 Hz.',
    severity: 'critical',
    source: 'Informe Gobierno p.43',
  },
  {
    id: 'gen-123253',
    timestamp: '12:32:53,000 CEST',
    phase: 2,
    description: 'Cinco pérdidas simultáneas: 52,7 MW',
    mwLost: 52.7,
    detail:
      '11,9 + 20,0 + 4,8 + 10,0 + 6,0 MW. La frecuencia empieza a desestabilizarse aceleradamente.',
    severity: 'catastrophic',
    source: 'Informe Gobierno p.43',
  },
  {
    id: 'event1-123257',
    timestamp: '12:32:57,140 CEST',
    phase: 2,
    description: '⚡ EVENTO 1 — Disparo raíz (Granada/Badajoz)',
    detail:
      'Primer disparo mayor. Generador principal desconecta. Tensiones en nudos próximos superan 430 kV a las 12:33:00. Punto de inflexión de la cascada.',
    severity: 'catastrophic',
    source: 'Informe Gobierno p.44',
  },
  {
    id: 'event2-123316',
    timestamp: '12:33:16,460 CEST',
    phase: 3,
    description: '⚡ EVENTO 2 — Colectora renovables Badajoz',
    detail:
      'Subestación colectora Badajoz dispara. Cascada inmediata: 22,87 MW eólicos (12:33:17,368) + 33,8 MW FV+eólicos (12:33:17,547). Segunda desconexión colectora a 12:33:17,520.',
    severity: 'catastrophic',
    source: 'Informe Gobierno p.45',
  },
  {
    id: 'event3-123317',
    timestamp: '12:33:17,780 CEST',
    phase: 3,
    description: '⚡ EVENTO 3 — Colectora Sevilla',
    detail:
      'Múltiples plantas FV y eólicas en Sevilla disparan en cascada durante 1,17 segundos (17,780 → 18,951). Al menos 6 instalaciones separadas. Total: centenares de MW desconectados.',
    severity: 'catastrophic',
    source: 'Informe Gobierno p.46',
  },
  {
    id: 'freq-123319',
    timestamp: '12:33:19,320 CEST',
    phase: 3,
    description: 'Cambio crítico en derivada de frecuencia (RoCoF)',
    detail:
      'La tasa de cambio de frecuencia (RoCoF) alcanza valores críticos. Los automatismos de respuesta no pueden actuar a la velocidad requerida.',
    severity: 'catastrophic',
    source: 'Informe Gobierno p.47',
  },
  {
    id: 'freq-123320',
    timestamp: '12:33:20,180 CEST',
    phase: 3,
    description: 'Frecuencia cruza umbral deslastre — < 49,00 Hz',
    detail:
      'Primer umbral de deslastre de demanda no-bombeo activado. A 12:33:20,520, el intercambio con Francia alcanza su pico inverso: −5.587 MW (flujo España←Francia).',
    severity: 'catastrophic',
    source: 'Informe Gobierno p.47',
  },
  {
    id: 'sync-123323',
    timestamp: '12:33:23,260 CEST',
    phase: 3,
    description: '🔌 PÉRDIDA DE SINCRONISMO España-Francia',
    detail:
      'La diferencia angular entre España y Francia supera el umbral de estabilidad. España se desconecta del sistema europeo ENTSO-E. Fin del apoyo de frecuencia continental.',
    severity: 'catastrophic',
    source: 'Informe Gobierno p.48',
  },
  {
    id: 'hvdc-block',
    timestamp: '12:33:23,960 CEST',
    phase: 3,
    description: 'HVDC Santa Llogaia bloqueado',
    detail:
      'Tensión colapsa en SE Santa Llogaia 400 kV. La interconexión HVDC Francia-España se bloquea automáticamente. Cesa toda transmisión de potencia con Francia.',
    severity: 'catastrophic',
    source: 'Informe Gobierno p.48',
  },
  {
    id: 'zero-123329',
    timestamp: '12:33:29,741 CEST',
    phase: 3,
    description: '🔴 CERO DE TENSIÓN PENINSULAR',
    detail:
      'España y Portugal se desconectan completamente del sistema europeo. ≈15 GW de generación perdidos en 32,741 segundos. 60 millones de personas sin suministro eléctrico. Inicio del protocolo Black Start.',
    severity: 'catastrophic',
    source: 'ENTSO-E / REE / Informe Gobierno',
  },
  {
    id: 'rest-1244',
    timestamp: '12:44 CEST',
    phase: 4,
    description: 'Tensión en HERNANI — País Vasco',
    detail:
      'Primer suministro recibido desde Francia. País Vasco inicia el proceso de reposición. El Black Start aprovecha la interconexión pirenaica AC.',
    severity: 'info',
    source: 'Informe Gobierno p.59',
  },
  {
    id: 'rest-1335',
    timestamp: '13:35 CEST',
    phase: 4,
    description: 'Tensión en VIC — Cataluña',
    detail:
      'Segundo punto de entrada desde Francia. Cataluña inicia reposición en paralelo con País Vasco.',
    severity: 'info',
    source: 'Informe Gobierno p.59',
  },
  {
    id: 'rest-port',
    timestamp: '13:39 CEST',
    phase: 4,
    description: 'L-400 kV BROVALES-ALQUEVA acoplada — Portugal',
    detail:
      'España activa la reposición en Portugal. Línea de interconexión 400 kV Badajoz-Alqueva energizada.',
    severity: 'info',
    source: 'Informe Gobierno p.59',
  },
  {
    id: 'rest-bal',
    timestamp: '14:13 CEST',
    phase: 4,
    description: 'Interconexión Península-Baleares energizada',
    detail:
      'Baleares recibe suministro continental. Proceso progresivo de reposición en las islas.',
    severity: 'info',
    source: 'Informe Gobierno p.59',
  },
  {
    id: 'rest-99',
    timestamp: '29 ABR — 07:00 CEST',
    phase: 4,
    description: '✅ 99,95% de la demanda repuesta',
    detail:
      '19 horas y 26 minutos de apagón. Solo 0,05% de la demanda peninsular pendiente de reposición.',
    severity: 'info',
    source: 'Informe Gobierno p.59',
  },
  {
    id: 'rest-100',
    timestamp: '29 ABR — 14:36 CEST',
    phase: 4,
    description: '✅ REPOSICIÓN 100% COMPLETADA',
    detail:
      'Sistema eléctrico peninsular completamente restaurado. 26 horas y 3 minutos desde el cero de tensión.',
    severity: 'info',
    source: 'Informe Gobierno p.60',
  },
];

const SEVERITY_COLORS: Record<Severity, string> = {
  info: 'var(--nominal)',
  alert: 'var(--warning)',
  critical: 'var(--alarm)',
  catastrophic: '#8B0000',
};

const PHASE_LABELS: Record<number, string> = {
  0: 'FASE 0: Previo',
  1: 'FASE 1: Oscilaciones',
  2: 'FASE 2: Pérdidas',
  3: 'FASE 3: Colapso',
  4: 'FASE 4: Reposición',
};

function ForensicTimeline() {
  const [activePhase, setActivePhase] = useState<number | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    activePhase === 'all'
      ? EVENTS
      : EVENTS.filter(e => e.phase === activePhase);

  const totalMwLost = EVENTS.filter(e => e.phase === 2 || e.phase === 3).reduce(
    (sum, e) => sum + (e.mwLost ?? 0),
    0
  );

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          FUENTE: COMITÉ DE ANÁLISIS 28-A — CONSEJO DE SEGURIDAD NACIONAL
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Cronología Forense: 28 de Abril de 2025
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          {EVENTS.length} eventos documentados extraídos del Informe del Comité de Análisis (junio
          2025). Timestamps al milisegundo de la secuencia de colapso oficial. Total de generación
          perdida en cascada (fases 2-3):{' '}
          <strong>{totalMwLost.toFixed(1)} MW</strong>.
        </p>
      </header>

      {/* Phase filter */}
      <div
        style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}
        data-no-print
      >
        {(['all', 0, 1, 2, 3, 4] as const).map(phase => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            style={{
              padding: '0.5rem 0.875rem',
              background: activePhase === phase ? 'var(--accent-blue)' : 'transparent',
              color: activePhase === phase ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${activePhase === phase ? 'var(--accent-blue)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: activePhase === phase ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            {phase === 'all' ? 'TODOS' : PHASE_LABELS[phase]}
          </button>
        ))}
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            alignSelf: 'center',
          }}
        >
          {filtered.length} eventos
        </span>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '3rem' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: '19px',
            top: '10px',
            bottom: '10px',
            width: '2px',
            background:
              'linear-gradient(180deg, var(--nominal) 0%, var(--warning) 40%, var(--alarm) 70%, #8B0000 85%, var(--nominal) 100%)',
            opacity: 0.35,
          }}
          aria-hidden="true"
        />

        {filtered.map(event => {
          const isExpanded = expandedId === event.id;
          const color = SEVERITY_COLORS[event.severity];
          return (
            <div
              key={event.id}
              style={{ display: 'flex', gap: '1rem', marginBottom: '0.875rem' }}
            >
              {/* Node */}
              <button
                onClick={() => toggle(event.id)}
                aria-expanded={isExpanded}
                style={{
                  flexShrink: 0,
                  position: 'absolute',
                  left: 0,
                  width: '38px',
                  height: '38px',
                  marginTop: '2px',
                  borderRadius: '50%',
                  background: color,
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isExpanded ? `0 0 16px ${color}` : `0 0 6px ${color}50`,
                  transition: 'box-shadow 0.2s',
                  padding: 0,
                }}
              >
                F{event.phase}
              </button>

              {/* Card */}
              <div
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  background: isExpanded ? 'var(--bg-raised)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${isExpanded ? color : 'var(--border)'}`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => toggle(event.id)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          color,
                          fontWeight: 600,
                        }}
                      >
                        {event.timestamp}
                      </span>
                      {event.mwLost !== undefined && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            color: 'var(--alarm)',
                            background: 'rgba(255,32,32,0.1)',
                            padding: '0.125rem 0.375rem',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          −{event.mwLost} MW
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        lineHeight: 1.35,
                      }}
                    >
                      {event.description}
                    </p>

                    {isExpanded && event.detail && (
                      <p
                        style={{
                          margin: '0.5rem 0 0.375rem',
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.65,
                        }}
                      >
                        {event.detail}
                      </p>
                    )}

                    {isExpanded && (
                      <p
                        style={{
                          margin: '0.375rem 0 0',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {event.source}
                      </p>
                    )}
                  </div>

                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                    aria-hidden="true"
                  >
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Causa raíz — cita textual */}
      <div
        className="glass-panel"
        style={{
          marginTop: '2.5rem',
          padding: '1.5rem',
          borderLeft: '4px solid var(--alarm)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
            letterSpacing: '0.1em',
          }}
        >
          CAUSA RAÍZ — CITA TEXTUAL DEL INFORME (p.129)
        </p>
        <blockquote
          style={{
            margin: 0,
            fontSize: '1rem',
            fontStyle: 'italic',
            lineHeight: 1.7,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          "La causa última del cero eléctrico peninsular del pasado 28 de abril fue un
          fenómeno en efecto cascada de desconexiones de generación por sobretensión. No se ha
          identificado un 'fallo único' que pueda explicar por sí solo la caída del sistema."
        </blockquote>
        <p style={{ margin: '1rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          — Comité de Análisis 28-A, Consejo de Seguridad Nacional, 16 de junio de 2025
        </p>
      </div>

      <NextChapter
        path="/mix-generacion"
        label="Mix de Generación"
        desc="El mix 82% renovable que propició el colapso — datos exactos del 28-A"
      />
    </div>
  );
}

export default React.memo(ForensicTimeline);
