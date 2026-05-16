import React, { useState } from 'react';
import NextChapter from '../NextChapter';

type Institution = 'gobierno' | 'icai' | 'entso';
type Agreement = 'discrepa' | 'matiza' | 'coincide';

interface InstitutionDef {
  id: Institution;
  name: string;
  badge: string;
  icon: string;
  color: string;
  source: string;
}

interface DivergenceRow {
  id: string;
  question: string;
  gobierno: { text: string; agreement: Agreement };
  icai: { text: string; agreement: Agreement };
  entso: { text: string; agreement: Agreement };
}

const INSTITUTIONS: InstitutionDef[] = [
  {
    id: 'gobierno',
    name: 'Gobierno / Redeia',
    badge: 'ADMINISTRACIÓN',
    icon: '🏛️',
    color: 'var(--accent-blue)',
    source: 'Comité 28-A / REE',
  },
  {
    id: 'icai',
    name: 'ICAI / AELEC',
    badge: 'SECTOR GENERADOR',
    icon: '⚙️',
    color: 'var(--warning)',
    source: 'IIT-ICAI / Compass Lexecon',
  },
  {
    id: 'entso',
    name: 'ENTSO-E',
    badge: 'GESTOR EUROPEO',
    icon: '🇪🇺',
    color: 'var(--nominal)',
    source: 'ENTSO-E Incident Report 2025',
  },
];

const DIVERGENCES: DivergenceRow[] = [
  {
    id: 'd1',
    question: '¿Quién tiene la responsabilidad operativa?',
    gobierno: {
      text: 'Los generadores renovables no absorbieron reactiva conforme al P.O. 7.4. La culpa es distribuida entre agentes del mercado.',
      agreement: 'discrepa',
    },
    icai: {
      text: 'Redeia ejecutó la maniobra de mallado que aumentó la capacitancia total. La decisión operativa del OS fue determinante.',
      agreement: 'discrepa',
    },
    entso: {
      text: 'El sistema tenía fragilidad estructural previa acumulada. La responsabilidad es sistémica, no de un único actor.',
      agreement: 'matiza',
    },
  },
  {
    id: 'd2',
    question: '¿Fue el HVDC en PMODE un factor clave?',
    gobierno: {
      text: 'No fue determinante. El PMODE es una operación normal del enlace INELFE. No incidió causalmente en el colapso.',
      agreement: 'discrepa',
    },
    icai: {
      text: 'SÍ fue agravante determinante. El PMODE retiró el soporte dinámico de tensión del HVDC en el momento más crítico.',
      agreement: 'discrepa',
    },
    entso: {
      text: 'El HVDC en PMODE contribuyó a la propagación de oscilaciones inter-área. Factor agravante, no único.',
      agreement: 'matiza',
    },
  },
  {
    id: 'd3',
    question: '¿Cuál es la causa raíz del colapso?',
    gobierno: {
      text: '"No hay fallo único. Fue una cascada de desconexiones de generación por sobretensión, con factores sistémicos acumulados."',
      agreement: 'matiza',
    },
    icai: {
      text: '"Decisión operativa sistémica del OS: el mallado aumentó capacitancia en escenario de baja fortaleza, con Tap-Lag como factor clave."',
      agreement: 'discrepa',
    },
    entso: {
      text: '"Sistema IBR sin inercia síncrona suficiente + criterio N-1 insuficiente para fenómenos dinámicos ultrarrápidos."',
      agreement: 'discrepa',
    },
  },
  {
    id: 'd4',
    question: '¿Cómo se mide la inercia el 28-A?',
    gobierno: {
      text: 'H global del sistema: 2,3 s. Valor dentro del umbral operativo. No hay evidencia de déficit de inercia como causa directa.',
      agreement: 'discrepa',
    },
    icai: {
      text: 'H zonal sur (ICAI/NREL): 1,3-1,8 s en Andalucía/Extremadura. Por debajo del umbral ENTSO-E de 2 s.',
      agreement: 'discrepa',
    },
    entso: {
      text: 'La métrica global oculta vulnerabilidades zonales. El análisis debe incluir inercia por área, no solo el agregado continental.',
      agreement: 'matiza',
    },
  },
  {
    id: 'd5',
    question: '¿Qué reformas son prioritarias?',
    gobierno: {
      text: 'Compensadores síncronos, STATCOM con POD, GFM para inversores renovables. Marco regulatorio de capacidad.',
      agreement: 'matiza',
    },
    icai: {
      text: 'Cambio operativo inmediato: no operar HVDC en PMODE. Mejorar observabilidad 220kV en SCADA. Criterios mallado más estrictos.',
      agreement: 'discrepa',
    },
    entso: {
      text: 'Revisión del Criterio N-1 para fenómenos dinámicos. Nuevas métricas de fortaleza síncrona. Obligatoriedad GFM en nuevas instalaciones.',
      agreement: 'matiza',
    },
  },
];

const AGREEMENT_CONFIG: Record<Agreement, { label: string; color: string }> = {
  discrepa: { label: '🔴 DISCREPA', color: 'var(--alarm)' },
  matiza: { label: '🟡 MATIZA', color: 'var(--warning)' },
  coincide: { label: '🟢 COINCIDE', color: 'var(--nominal)' },
};

function TresNarrativas() {
  const [expandedRow, setExpandedRow] = useState<string | null>('d1');
  const [focusInstitution, setFocusInstitution] = useState<Institution | null>(null);

  const discrepancias = DIVERGENCES.filter(d => {
    const agreements = [d.gobierno.agreement, d.icai.agreement, d.entso.agreement];
    return agreements.some(a => a === 'discrepa');
  }).length;

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          ANÁLISIS FORENSE COMPARATIVO · CAPÍTULO 5 DEL TFG
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Las Tres Narrativas Institucionales
        </h1>
        <p className="t-body-main" style={{ maxWidth: '72ch' }}>
          Los mismos hechos, tres interpretaciones divergentes. Este componente no adopta
          posición editorial: presenta cada visión atribuida a su fuente institucional,
          reflejando las fracturas irreconciliables del debate forense post-28A.
        </p>
      </header>

      {/* Institution cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {INSTITUTIONS.map(inst => (
          <button
            key={inst.id}
            onClick={() => setFocusInstitution(focusInstitution === inst.id ? null : inst.id)}
            style={{
              padding: '1rem',
              background: focusInstitution === inst.id ? `${inst.color}18` : 'var(--bg-raised)',
              border: `1px solid ${focusInstitution === inst.id ? inst.color : 'var(--border)'}`,
              borderTop: `3px solid ${inst.color}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{inst.icon}</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: inst.color,
                  background: `${inst.color}15`,
                  padding: '0.125rem 0.375rem',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.06em',
                }}
              >
                {inst.badge}
              </span>
            </div>
            <p style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {inst.name}
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              Fuente: {inst.source}
            </p>
          </button>
        ))}
      </div>

      {/* Divergence table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {DIVERGENCES.map(div => {
          const isExpanded = expandedRow === div.id;
          return (
            <div
              key={div.id}
              style={{
                background: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setExpandedRow(isExpanded ? null : div.id)}
                aria-expanded={isExpanded}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)', minWidth: '2rem' }}>
                  D{div.id.slice(1)}
                </span>
                <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {div.question}
                </span>
                {/* Mini badges */}
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {(['gobierno', 'icai', 'entso'] as Institution[]).map(inst => {
                    const pos = div[inst];
                    const cfg = AGREEMENT_CONFIG[pos.agreement];
                    return (
                      <span
                        key={inst}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: cfg.color,
                          display: 'inline-block',
                        }}
                      />
                    );
                  })}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {isExpanded ? '▲' : '▼'}
                </span>
              </button>

              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {INSTITUTIONS.map(inst => {
                    const pos = div[inst.id as Institution];
                    const cfg = AGREEMENT_CONFIG[pos.agreement];
                    const isFocused = focusInstitution === null || focusInstitution === inst.id;
                    return (
                      <div
                        key={inst.id}
                        style={{
                          padding: '1rem 1.25rem',
                          borderRight: '1px solid var(--border)',
                          opacity: isFocused ? 1 : 0.35,
                          transition: 'opacity 0.2s',
                          borderLeft: `3px solid ${inst.color}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem' }}>{inst.icon}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, color: inst.color }}>
                            {inst.name}
                          </span>
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.5625rem',
                              color: cfg.color,
                              background: `${cfg.color}18`,
                              padding: '0.1rem 0.35rem',
                              borderRadius: 'var(--radius-sm)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.55, fontStyle: pos.text.startsWith('"') ? 'italic' : 'normal' }}>
                          {pos.text}
                        </p>
                        <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)' }}>
                          Fuente: {inst.source}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Consensus panel */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: 'rgba(255,32,32,0.04)',
          border: '1px solid rgba(255,32,32,0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div>
          <p style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--alarm)', lineHeight: 1 }}>
            {discrepancias}/5
          </p>
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--alarm)' }}>
            DIVERGENCIAS
          </p>
        </div>
        <div>
          <p style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Consenso irreconciliable en {discrepancias} de 5 puntos
          </p>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Las tres instituciones convergen en que existía fragilidad sistémica previa, pero
            divergen radicalmente en la asignación de responsabilidad operativa y en las reformas prioritarias.
          </p>
        </div>
      </div>

      {/* Academic note */}
      <div
        className="glass-panel"
        style={{ padding: '1rem 1.25rem', marginBottom: '2rem' }}
      >
        <p style={{ margin: '0 0 0.375rem', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          NOTA METODOLÓGICA — TFG ANÁLISIS FORENSE COMPARATIVO
        </p>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Este componente presenta cada posición institucional sin adoptarla editorialmente. Las
          divergencias son el objeto de estudio del TFG, no un problema a resolver. Cada afirmación
          está atribuida a su fuente: Comité 28-A (Gobierno), IIT-ICAI/Compass Lexecon (AELEC),
          ENTSO-E Incident Report 2025.
        </p>
      </div>

      <NextChapter
        path="/inercia-vuln"
        label="Inercia del Sistema"
        desc="Evolución de H y cálculo de RoCoF — por qué la inercia colapsa con las renovables"
      />
    </div>
  );
}

export default React.memo(TresNarrativas);
