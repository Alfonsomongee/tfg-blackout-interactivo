import React, { useState } from 'react';
import NextChapter from '../NextChapter';

type Category = 'urgente' | 'estructural' | 'regulatorio' | 'seguridad';
type MeasureType = 'electrica' | 'digital';

interface Measure {
  id: string;
  text: string;
  type: MeasureType;
  category: Category;
  progress: number; // 0-100, estimado
  progressLabel: string;
}

const MEASURES: Measure[] = [
  // Medidas Eléctricas — Informe Gobierno, Apartado 6
  {
    id: 'e1',
    text: 'Compensadores síncronos, FACTS y STATCOM para control dinámico de tensión',
    type: 'electrica',
    category: 'estructural',
    progress: 15,
    progressLabel: 'Fase de licitación',
  },
  {
    id: 'e2',
    text: 'Power System Stabilisers (PSS) correctamente ajustados en generadores existentes',
    type: 'electrica',
    category: 'urgente',
    progress: 40,
    progressLabel: 'Auditoría en curso',
  },
  {
    id: 'e3',
    text: 'Equipos STATCOM con funciones de amortiguamiento de oscilaciones de potencia (POD) en la red',
    type: 'electrica',
    category: 'estructural',
    progress: 10,
    progressLabel: 'Estudio técnico',
  },
  {
    id: 'e4',
    text: 'Operar la interconexión HVDC España-Francia en modo diferente al PMODE durante oscilaciones',
    type: 'electrica',
    category: 'urgente',
    progress: 60,
    progressLabel: 'Protocolo en revisión',
  },
  {
    id: 'e5',
    text: 'GFM (Grid-Forming) para inversores de instalaciones renovables — exigencia en nuevas plantas',
    type: 'electrica',
    category: 'regulatorio',
    progress: 20,
    progressLabel: 'Borrador normativo',
  },
  {
    id: 'e6',
    text: 'Almacenamiento eléctrico con nuevas fuentes de ingresos que garanticen su viabilidad económica',
    type: 'electrica',
    category: 'estructural',
    progress: 25,
    progressLabel: 'Marco regulatorio',
  },
  {
    id: 'e7',
    text: 'Mecanismos de capacidad (garantía de potencia) para mantener generación síncrona en el sistema',
    type: 'electrica',
    category: 'regulatorio',
    progress: 35,
    progressLabel: 'Consulta pública',
  },
  {
    id: 'e8',
    text: 'Impulso del almacenamiento y su hibridación en proyectos renovables nuevos y en repotenciación',
    type: 'electrica',
    category: 'estructural',
    progress: 30,
    progressLabel: 'En tramitación',
  },
  {
    id: 'e9',
    text: 'Nuevos requisitos técnicos mínimos para generadores renovables (inercia virtual, control de tensión)',
    type: 'electrica',
    category: 'regulatorio',
    progress: 45,
    progressLabel: 'Propuesta CNMC',
  },

  // Medidas Digitales / Ciberseguridad — Informe Gobierno, Apartado 6
  {
    id: 'd1',
    text: 'Reforzar políticas de gestión de credenciales en todos los sistemas de control industrial (ICS/SCADA)',
    type: 'digital',
    category: 'urgente',
    progress: 70,
    progressLabel: 'Implementado parcialmente',
  },
  {
    id: 'd2',
    text: 'Cambiar todas las credenciales por defecto en dispositivos de red y sistemas de control',
    type: 'digital',
    category: 'urgente',
    progress: 65,
    progressLabel: 'En ejecución',
  },
  {
    id: 'd3',
    text: 'Plan de seguridad con procedimientos de aislamiento rápido ante incidentes cibernéticos',
    type: 'digital',
    category: 'seguridad',
    progress: 50,
    progressLabel: 'Redacción plan',
  },
  {
    id: 'd4',
    text: 'Nombrar responsable de Seguridad como enlace con el CNPIC (infraestructuras críticas)',
    type: 'digital',
    category: 'urgente',
    progress: 80,
    progressLabel: 'Designado en REE',
  },
  {
    id: 'd5',
    text: 'Designar Responsable de Seguridad de la Información (RSI) en cada operador crítico',
    type: 'digital',
    category: 'urgente',
    progress: 75,
    progressLabel: 'En proceso',
  },
  {
    id: 'd6',
    text: 'Protección de backups mediante aislamiento físico (air-gap) de los sistemas de producción',
    type: 'digital',
    category: 'seguridad',
    progress: 55,
    progressLabel: 'Auditoría técnica',
  },
  {
    id: 'd7',
    text: 'Comunicar ciberincidentes inmediatamente a la autoridad competente y al CCN-CERT',
    type: 'digital',
    category: 'seguridad',
    progress: 85,
    progressLabel: 'Protocolo activo',
  },
];

const CATEGORY_CONFIG: Record<Category, { label: string; color: string }> = {
  urgente: { label: 'URGENTE', color: 'var(--alarm)' },
  estructural: { label: 'ESTRUCTURAL', color: 'var(--warning)' },
  regulatorio: { label: 'REGULATORIO', color: 'var(--accent-blue)' },
  seguridad: { label: 'SEGURIDAD', color: 'var(--nominal)' },
};

function MedidasPropuestas() {
  const [filter, setFilter] = useState<MeasureType | 'all'>('all');

  const filtered =
    filter === 'all' ? MEASURES : MEASURES.filter(m => m.type === filter);

  const electricas = MEASURES.filter(m => m.type === 'electrica');
  const digitales = MEASURES.filter(m => m.type === 'digital');
  const avgProgressE =
    Math.round(electricas.reduce((s, m) => s + m.progress, 0) / electricas.length);
  const avgProgressD =
    Math.round(digitales.reduce((s, m) => s + m.progress, 0) / digitales.length);

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          MEDIDAS PROPUESTAS · INFORME GOBIERNO DE ESPAÑA — APARTADO 6
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Plan de Acción Post-Colapso
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          Las 16 medidas propuestas por el Comité de Análisis 28-A para prevenir un nuevo colapso
          del sistema eléctrico peninsular: 9 técnicas eléctricas y 7 de ciberseguridad.
        </p>
      </header>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          {
            label: 'Total medidas',
            value: '16',
            sub: '9 eléctricas + 7 digitales',
            color: 'var(--accent-blue)',
          },
          {
            label: 'Medidas urgentes',
            value: String(MEASURES.filter(m => m.category === 'urgente').length),
            sub: 'Implementación inmediata',
            color: 'var(--alarm)',
          },
          {
            label: 'Implementación media (eléctricas)',
            value: `${avgProgressE}%`,
            sub: 'Estimado — datos no oficiales',
            color: 'var(--warning)',
          },
          {
            label: 'Implementación media (digitales)',
            value: `${avgProgressD}%`,
            sub: 'Estimado — datos no oficiales',
            color: 'var(--nominal)',
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              padding: '1rem',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderTop: `3px solid ${card.color}`,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <p
              style={{
                margin: '0 0 0.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: card.color,
                lineHeight: 1,
              }}
            >
              {card.value}
            </p>
            <p
              style={{
                margin: '0 0 0.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {card.label}
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'var(--text-secondary)',
              }}
            >
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {([['all', 'TODAS (16)'], ['electrica', 'ELÉCTRICAS (9)'], ['digital', 'DIGITALES (7)']] as const).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '0.5rem 1rem',
                background: filter === key ? 'var(--accent-blue)' : 'transparent',
                color: filter === key ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filter === key ? 'var(--accent-blue)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Measures list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
        {filtered.map((m, idx) => {
          const cat = CATEGORY_CONFIG[m.category];
          return (
            <div
              key={m.id}
              style={{
                padding: '1rem 1.25rem',
                background: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${cat.color}`,
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.875rem',
                }}
              >
                {/* Number */}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    minWidth: '1.5rem',
                    paddingTop: '1px',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      marginBottom: '0.375rem',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        color: cat.color,
                        background: `${cat.color}15`,
                        padding: '0.125rem 0.375rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {cat.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        color: 'var(--text-muted)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '0.125rem 0.375rem',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {m.type === 'electrica' ? 'ELÉCTRICA' : 'DIGITAL'}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '0 0 0.625rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.5,
                    }}
                  >
                    {m.text}
                  </p>

                  {/* Progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '4px',
                        background: 'var(--border)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${m.progress}%`,
                          background:
                            m.progress >= 70
                              ? 'var(--nominal)'
                              : m.progress >= 40
                                ? 'var(--warning)'
                                : 'var(--alarm)',
                          borderRadius: '2px',
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ~{m.progress}% · {m.progressLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div
        style={{
          padding: '0.875rem 1.25rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
          }}
        >
          ⚠ Los porcentajes de implementación son ESTIMADOS con fines ilustrativos — no hay
          datos públicos oficiales de seguimiento disponibles a mayo de 2026. Fuente de las
          medidas: Comité de Análisis 28-A, Gobierno de España (junio 2025).
        </p>
      </div>

      {/* Cita textual */}
      <div
        className="glass-panel"
        style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            marginBottom: '0.625rem',
            letterSpacing: '0.08em',
          }}
        >
          INFORME GOBIERNO — CONCLUSIÓN CLAVE
        </p>
        <blockquote
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9375rem',
            fontStyle: 'italic',
            lineHeight: 1.65,
            color: 'var(--text-primary)',
          }}
        >
          "La causa no fue un fallo único sino una combinación de factores sistémicos: bajo nivel
          de inercia síncrona, oscilaciones previas no amortiguadas, y una respuesta en cascada
          de las protecciones ante una sobretensión propagada."
        </blockquote>
      </div>

      <NextChapter
        path="/interconexion"
        label="Interconexión ES-FR"
        desc="Los flujos de potencia España-Francia durante el colapso — datos al milisegundo"
      />
    </div>
  );
}

export default React.memo(MedidasPropuestas);
