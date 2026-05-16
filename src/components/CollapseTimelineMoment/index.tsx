import { useState } from 'react';
import NextChapter from '../NextChapter';

const EVENTS = [
  {
    t: 0,
    label: 'Primera oscilación detectada',
    detail:
      'Sistema en operación normal. Primera oscilación de tensión detectada en subestación colectora de la zona Sur. La inercia del sistema es de 2,3 s — muy por debajo del umbral de 5 s.',
    phase: 'alert' as const,
    time: '12:32:57.000',
  },
  {
    t: 15.3,
    label: 'Desconexión en cascada de inversores IBR',
    detail:
      'Los inversores de parques solares y eólicos comienzan a desconectarse automáticamente por sobretensión en subestaciones colectoras. El RoCoF supera 1,8 Hz/s, umbral de disparo de las protecciones.',
    phase: 'critical' as const,
    time: '12:33:12.300',
  },
  {
    t: 24.6,
    label: 'Disparo de protecciones OST',
    detail:
      'SCADA activa las protecciones Out-of-Step (OST). Las protecciones de baja frecuencia UFLS intentan actuar pero, paradójicamente, agravan la cascada de desconexiones al eliminar generación residual.',
    phase: 'critical' as const,
    time: '12:33:21.600',
  },
  {
    t: 27.1,
    label: 'Colapso de frecuencia — Zona Sur',
    detail:
      'La Zona Sur peninsular sufre colapso de frecuencia con inercia residual de 1,30 s. Andalucía, Extremadura y Murcia quedan sin suministro. Se pierden ~6 GW de generación de golpe.',
    phase: 'failed' as const,
    time: '12:33:24.100',
  },
  {
    t: 30.4,
    label: 'Separación eléctrica — Zona Centro',
    detail:
      'La Zona Centro se separa eléctricamente con inercia de 1,84 s. Madrid, Castilla y León y Castilla-La Mancha quedan aisladas. El sistema intenta sostenerse pero la demanda supera la generación restante.',
    phase: 'failed' as const,
    time: '12:33:27.400',
  },
  {
    t: 31.9,
    label: 'Cascada total en curso',
    detail:
      'La cascada de desconexiones abarca toda la Península. Los últimos generadores síncronos en el Norte intentan mantener la tensión sin éxito. La interconexión con Francia (HVDC INELFE) queda fuera de servicio.',
    phase: 'failed' as const,
    time: '12:33:28.900',
  },
  {
    t: 32.741,
    label: 'COLAPSO TOTAL DEL SISTEMA',
    detail:
      'Separación completa del sistema eléctrico peninsular. ≈15 GW de generación perdida en 32,741 segundos. 60 millones de personas sin suministro eléctrico. Inicio del protocolo Black Start.',
    phase: 'failed' as const,
    time: '12:33:29.741',
  },
];

const PHASE_COLOR: Record<'alert' | 'critical' | 'failed', string> = {
  alert: 'var(--warning)',
  critical: 'var(--alarm)',
  failed: '#8B0000',
};

export default function CollapseTimelineMoment() {
  const [sliderValue, setSliderValue] = useState(0);

  const currentT = (sliderValue / 100) * 32.741;
  const activeEvents = EVENTS.filter(e => e.t <= currentT);
  const currentEvent = activeEvents[activeEvents.length - 1] ?? EVENTS[0];

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          LÍNEA DE TIEMPO INTERACTIVA · 0 – 33 SEGUNDOS
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Los 33 Segundos del Colapso
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          Arrastra el control deslizante para recorrer los 32,741 segundos del colapso del sistema
          eléctrico peninsular. Cada posición revela el estado del sistema en ese instante.
        </p>
      </header>

      {/* Slider card */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>T = 0 s</span>
          <span
            style={{
              color: PHASE_COLOR[currentEvent.phase],
              fontWeight: 700,
            }}
          >
            T = {currentT.toFixed(2)} s &nbsp;·&nbsp; {currentEvent.time} CEST
          </span>
          <span>T = 32.7 s</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={sliderValue}
          onChange={e => setSliderValue(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: PHASE_COLOR[currentEvent.phase],
            cursor: 'pointer',
            height: '6px',
          }}
        />

        {/* Event markers */}
        <div style={{ position: 'relative', height: '20px', marginTop: '0.5rem' }}>
          {EVENTS.map((event, i) => (
            <button
              key={i}
              onClick={() => setSliderValue(Math.round((event.t / 32.741) * 100))}
              title={event.label}
              style={{
                position: 'absolute',
                left: `${(event.t / 32.741) * 100}%`,
                transform: 'translateX(-50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: event.t <= currentT ? PHASE_COLOR[event.phase] : 'var(--border)',
                border: `2px solid ${event.t <= currentT ? PHASE_COLOR[event.phase] : 'var(--border)'}`,
                cursor: 'pointer',
                padding: 0,
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Current event highlight */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${PHASE_COLOR[currentEvent.phase]}`,
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}
      >
        <p
          style={{
            margin: '0 0 0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.1em',
            color: PHASE_COLOR[currentEvent.phase],
          }}
        >
          FASE ACTIVA — {currentEvent.label.toUpperCase()}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: 'var(--text-primary)',
          }}
        >
          {currentEvent.detail}
        </p>
      </div>

      {/* Event list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        {EVENTS.map((event, i) => {
          const isActive = event.t <= currentT;
          const isCurrent = activeEvents[activeEvents.length - 1]?.t === event.t;
          return (
            <button
              key={i}
              onClick={() => setSliderValue(Math.round((event.t / 32.741) * 100))}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '0.75rem 1rem',
                background: isCurrent ? 'rgba(255,255,255,0.04)' : 'transparent',
                border: `1px solid ${isCurrent ? PHASE_COLOR[event.phase] : 'transparent'}`,
                borderRadius: 'var(--radius-sm)',
                opacity: isActive ? 1 : 0.35,
                transition: 'all 0.3s',
                cursor: 'pointer',
                textAlign: 'left',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  minWidth: '62px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: isActive ? PHASE_COLOR[event.phase] : 'var(--text-secondary)',
                  fontWeight: 700,
                  paddingTop: '0.125rem',
                }}
              >
                T+{event.t.toFixed(1)}s
              </div>
              <div>
                <p
                  style={{
                    margin: '0 0 0.125rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {event.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {event.time} CEST
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <NextChapter
        path="/heat-map"
        label="Mapa de Impacto"
        desc="Distribución geográfica del apagón por zonas peninsulares"
      />
    </div>
  );
}
