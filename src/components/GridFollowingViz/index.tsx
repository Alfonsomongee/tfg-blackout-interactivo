import React, { useState } from 'react';
import NextChapter from '../NextChapter';

type GenType = 'sincrono' | 'gfl' | 'gfm';
type SimState = 'idle' | 'running' | 'done';

interface GenProperty {
  label: string;
  sincrono: { value: string; status: 'good' | 'warn' | 'bad' };
  gfl: { value: string; status: 'good' | 'warn' | 'bad' };
  gfm: { value: string; status: 'good' | 'warn' | 'bad' };
}

const PROPERTIES: GenProperty[] = [
  {
    label: 'Inercia intrínseca (H)',
    sincrono: { value: '2 – 6 s', status: 'good' },
    gfl: { value: '0 s (ninguna)', status: 'bad' },
    gfm: { value: 'Configurable (virtual)', status: 'warn' },
  },
  {
    label: 'Reactiva dinámica Q',
    sincrono: { value: 'Natural / autónoma', status: 'good' },
    gfl: { value: 'Software (lenta)', status: 'warn' },
    gfm: { value: 'Rápida / autónoma', status: 'good' },
  },
  {
    label: 'Corriente de cortocircuito',
    sincrono: { value: '5 – 10× Inominal', status: 'good' },
    gfl: { value: '1,1 – 1,2× Inominal', status: 'bad' },
    gfm: { value: '1,5 – 2× Inominal', status: 'warn' },
  },
  {
    label: 'Necesita referencia V/f externa',
    sincrono: { value: 'No — genera referencia', status: 'good' },
    gfl: { value: 'SÍ — depende de PLL', status: 'bad' },
    gfm: { value: 'No — crea referencia', status: 'good' },
  },
  {
    label: 'Respuesta ante colapso de V',
    sincrono: { value: 'Mantiene tensión', status: 'good' },
    gfl: { value: 'PLL pierde sync → disparo', status: 'bad' },
    gfm: { value: 'Sostiene tensión virtual', status: 'good' },
  },
  {
    label: 'Despliegue actual en España',
    sincrono: { value: '~18% del mix 28-A', status: 'warn' },
    gfl: { value: '>82% del mix 28-A', status: 'bad' },
    gfm: { value: '<5% (en despliegue)', status: 'warn' },
  },
];

const STATUS_COLOR: Record<'good' | 'warn' | 'bad', string> = {
  good: 'var(--nominal)',
  warn: 'var(--warning)',
  bad: 'var(--alarm)',
};

const GEN_CONFIG: Record<GenType, { label: string; icon: string; color: string; badge: string }> = {
  sincrono: { label: 'Generador Síncrono', icon: '🔄', color: 'var(--nominal)', badge: 'REFERENCIA PRE-2015' },
  gfl: { label: 'IBR Grid-Following', icon: '⚡', color: 'var(--alarm)', badge: '82% DEL MIX 28-A' },
  gfm: { label: 'IBR Grid-Forming', icon: '🔋', color: 'var(--warning)', badge: 'SOLUCIÓN PROPUESTA' },
};

const SIM_RESULT: Record<GenType, { text: string; color: string; outcome: string }> = {
  sincrono: {
    text: 'La masa rotante absorbe el desequilibrio. La frecuencia cae lentamente. El sistema tiene tiempo para activar reservas.',
    color: 'var(--nominal)',
    outcome: '✓ ESTABILIZA',
  },
  gfl: {
    text: 'El PLL detecta que V colapsa. Sin referencia externa, el inversor pierde sincronismo y dispara en milisegundos. Esto desencadena la cascada.',
    color: 'var(--alarm)',
    outcome: '✗ DISPARO EN CASCADA',
  },
  gfm: {
    text: 'El inversor actúa como fuente de tensión virtual. Crea su propia referencia V y f. Sostiene el sistema hasta que llegan otras reservas.',
    color: 'var(--warning)',
    outcome: '✓ SOSTIENE LA RED',
  },
};

function GridFollowingViz() {
  const [simType, setSimType] = useState<GenType | null>(null);
  const [simState, setSimState] = useState<SimState>('idle');
  const [perturbacion, setPerturbacion] = useState(false);

  const runSim = (type: GenType) => {
    setSimType(type);
    setSimState('running');
    setPerturbacion(true);
    setTimeout(() => setSimState('done'), 1800);
  };

  const resetSim = () => {
    setSimType(null);
    setSimState('idle');
    setPerturbacion(false);
  };

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          CONCEPTO TÉCNICO CENTRAL · ANÁLISIS FORENSE 28-A
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          IBR: Grid-Following vs Grid-Forming
        </h1>
        <p className="t-body-main" style={{ maxWidth: '72ch' }}>
          El 82% de la generación el 28-A eran recursos basados en inversores (IBR) del tipo
          grid-following. Cuando la tensión empezó a colapsar, todos buscaron una referencia
          estable externa... que ya no existía. La cascada fue inevitable.
        </p>
      </header>

      {/* 3-column comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {(Object.entries(GEN_CONFIG) as [GenType, typeof GEN_CONFIG[GenType]][]).map(([type, cfg]) => (
          <div
            key={type}
            style={{
              padding: '1.25rem',
              background: 'var(--bg-raised)',
              border: `1px solid var(--border)`,
              borderTop: `3px solid ${cfg.color}`,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cfg.icon}</div>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                fontWeight: 700,
                color: cfg.color,
                background: `${cfg.color}15`,
                padding: '0.125rem 0.375rem',
                borderRadius: 'var(--radius-sm)',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
              }}
            >
              {cfg.badge}
            </span>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {cfg.label}
            </p>
          </div>
        ))}
      </div>

      {/* Property comparison table */}
      <div className="surface" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', background: 'var(--bg-raised)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ padding: '0.625rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>PROPIEDAD</div>
          {(Object.entries(GEN_CONFIG) as [GenType, typeof GEN_CONFIG[GenType]][]).map(([type, cfg]) => (
            <div key={type} style={{ padding: '0.625rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, color: cfg.color, letterSpacing: '0.06em' }}>
              {cfg.icon} {type.toUpperCase()}
            </div>
          ))}
        </div>
        {PROPERTIES.map((prop, idx) => (
          <div
            key={prop.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr repeat(3, 1fr)',
              borderBottom: idx < PROPERTIES.length - 1 ? '1px solid var(--border)' : 'none',
              background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
            }}
          >
            <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {prop.label}
            </div>
            {(['sincrono', 'gfl', 'gfm'] as GenType[]).map(type => {
              const cell = prop[type];
              return (
                <div key={type} style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                  <span style={{ marginTop: '1px', fontSize: '0.625rem', color: STATUS_COLOR[cell.status], flexShrink: 0 }}>
                    {cell.status === 'good' ? '✓' : cell.status === 'warn' ? '◐' : '✗'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: STATUS_COLOR[cell.status], lineHeight: 1.4 }}>
                    {cell.value}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Simulation panel */}
      <div className="surface" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <p style={{ margin: '0 0 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          SIMULACIÓN — RESPUESTA ANTE PERTURBACIÓN DE TENSIÓN
        </p>

        {/* Perturbation indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem 1rem', background: perturbacion ? 'rgba(255,32,32,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${perturbacion ? 'rgba(255,32,32,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', transition: 'all 0.4s' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: perturbacion ? 'var(--alarm)' : 'var(--border)', boxShadow: perturbacion ? '0 0 8px var(--alarm)' : 'none', transition: 'all 0.4s', flexShrink: 0 }} />
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: perturbacion ? 'var(--alarm)' : 'var(--text-muted)' }}>
            {perturbacion ? '⚡ PERTURBACIÓN ACTIVA — Colapso de tensión propagándose...' : 'Sin perturbación — sistema nominal'}
          </p>
        </div>

        <p style={{ margin: '0 0 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
          Selecciona un tipo de generador para simular su respuesta:
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {(Object.entries(GEN_CONFIG) as [GenType, typeof GEN_CONFIG[GenType]][]).map(([type, cfg]) => (
            <button
              key={type}
              onClick={() => simState === 'running' ? undefined : runSim(type)}
              disabled={simState === 'running'}
              style={{
                padding: '0.625rem 1.25rem',
                background: simType === type ? `${cfg.color}20` : 'transparent',
                border: `1px solid ${simType === type ? cfg.color : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: simState === 'running' ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: simType === type ? cfg.color : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {cfg.icon} {cfg.label}
            </button>
          ))}
          {simState !== 'idle' && (
            <button onClick={resetSim} style={{ padding: '0.625rem 1rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
              Reiniciar
            </button>
          )}
        </div>

        {simState === 'running' && (
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Analizando respuesta del sistema...
            </p>
          </div>
        )}

        {simState === 'done' && simType && (
          <div style={{ padding: '1rem 1.25rem', background: `${STATUS_COLOR[simType === 'sincrono' ? 'good' : simType === 'gfm' ? 'warn' : 'bad']}10`, border: `1px solid ${STATUS_COLOR[simType === 'sincrono' ? 'good' : simType === 'gfm' ? 'warn' : 'bad']}40`, borderRadius: 'var(--radius-sm)' }}>
            <p style={{ margin: '0 0 0.375rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: SIM_RESULT[simType].color }}>
              {SIM_RESULT[simType].outcome}
            </p>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {SIM_RESULT[simType].text}
            </p>
          </div>
        )}
      </div>

      {/* 28-A highlight */}
      <div style={{ padding: '1rem 1.25rem', background: 'rgba(255,32,32,0.04)', border: '1px solid rgba(255,32,32,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        <p style={{ margin: '0 0 0.375rem', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--alarm)' }}>
          LA PARADOJA DEL 28-A — 82% GRID-FOLLOWING
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.65 }}>
          "El 82% del sistema era IBR grid-following. Cuando la tensión empezó a colapsar
          por sobretensión, todos los IBR miraron al exterior buscando una referencia
          estable... que no existía. Resultado: todos dispararon en cascada en 32,7 segundos."
        </p>
        <p style={{ margin: '0.5rem 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)' }}>
          Análisis forense — TFG Alfonso Monge Díaz-Ángel · Fuente: Comité 28-A / ENTSO-E
        </p>
      </div>

      <NextChapter
        path="/tap-lag"
        label="Fenómeno Tap-Lag"
        desc="La tesis ICAI: inobservabilidad de red 220kV y la maniobra de mallado"
      />
    </div>
  );
}

export default React.memo(GridFollowingViz);
