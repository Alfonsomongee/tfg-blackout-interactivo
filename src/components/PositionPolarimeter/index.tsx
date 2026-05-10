import { useState } from 'react';

interface PositionData {
  actor: string;
  position: string;
  evidence: string;
}

interface Topic {
  id: string;
  title: string;
  left: PositionData;
  center: PositionData;
  right: PositionData;
}

const POSITIONS: Topic[] = [
  {
    id: 'responsibility',
    title: '1. ¿Responsable principal?',
    left: {
      actor: 'REE / Gobierno',
      position: 'Parque generador incumplió P.O. 7.4',
      evidence: 'Incumplimiento normativo colectivo de generadores',
    },
    center: {
      actor: 'Consenso tácito',
      position: 'Arquitectura sistémica insuficiente',
      evidence: 'Falta de monitorización dinámica en tiempo real',
    },
    right: {
      actor: 'ICAI / Generadores',
      position: 'Operador (REE) llevó red a colapso',
      evidence: 'Mallado masivo sin visibilidad adecuada',
    },
  },
  {
    id: 'trigger',
    title: '2. ¿Detonante del colapso?',
    left: {
      actor: 'REE / Gobierno',
      position: 'Incumplimiento de límites de tensión por generadores',
      evidence: 'Generadores no controlaron tensión según P.O.',
    },
    center: {
      actor: 'Física del sistema',
      position: 'Sobretensión capacitiva irreversible',
      evidence: 'Saturación márgenes Q-V en Carmona (57% contracción)',
    },
    right: {
      actor: 'ICAI',
      position: 'Mallado inyectó 1,05-2,4 GVAr capacitivos',
      evidence: 'Maniobra manual sin análisis de impacto dinámico',
    },
  },
  {
    id: 'oscillation',
    title: '3. Oscilación 0,63 Hz: ¿origen?',
    left: {
      actor: 'Gobierno',
      position: 'Forzada por planta FV Badajoz',
      evidence: 'Detección sincronizada con evento PV',
    },
    center: {
      actor: 'ENTSO-E',
      position: 'Causalidad incierta, baja inercia amplificó',
      evidence: 'Sistema vulnerable a cualquier perturbación',
    },
    right: {
      actor: 'ICAI',
      position: 'Modo natural interárea, amortiguamiento 1%',
      evidence: 'Consistente con dinámica de mallado masivo',
    },
  },
  {
    id: 'voltage',
    title: '4. Tensión en disparo Granada: ¿cuánto?',
    left: {
      actor: 'REE SCADA',
      position: '418 kV (dentro de rango normal)',
      evidence: 'Lectura SCADA a las 12:32:57 CEST',
    },
    center: {
      actor: 'Realidad física',
      position: 'Tap-Lag invisible para SCADA',
      evidence: 'Asimetría entre tensión 400kV y 220kV local',
    },
    right: {
      actor: 'ICAI (medición real)',
      position: '244 kV (>110% Vn, fuera de rango)',
      evidence: 'Compass Lexecon + modelos dinámicos verificados',
    },
  },
  {
    id: 'prevention',
    title: '5. Medida preventiva más urgente',
    left: {
      actor: 'Gobierno',
      position: 'Actualizar P.O. 7.4 + disciplina generadores',
      evidence: 'Normativa moderna, responsabilidad clara',
    },
    center: {
      actor: 'Necesidad sistémica',
      position: 'Herramientas dinámicas en RCCs + reforma regulatoria',
      evidence: 'Ambas son esenciales, no excluyentes',
    },
    right: {
      actor: 'ENTSO-E',
      position: 'NC RfG 2.0 + Grid-Forming obligatorio',
      evidence: 'Cambio de paradigma: arquitectura del sistema',
    },
  },
];

export default function PositionPolarimeter() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>Análisis de posiciones</p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400,
        color: 'var(--text-primary)', marginBottom: '0.5rem'
      }}>
        Polarímetro de posiciones institucionales
      </h2>
      <p className="t-body" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        5 temas clave donde las 4 instituciones (REE, ICAI, ENTSO-E, Gobierno) 
        toman posiciones divergentes. Visualiza dónde están EN DESACUERDO.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {POSITIONS.map((topic) => (
          <div key={topic.id} className="surface-raised p-1">
            <button
              onClick={() => setExpanded(expanded === topic.id ? null : topic.id)}
              className="w-full p-4 text-left bg-surface border border-transparent rounded-md cursor-pointer flex justify-between items-center transition-all duration-200 hover:border-main"
            >
              <span className="font-sans font-semibold text-sm sm:text-base text-text-primary">
                {topic.title}
              </span>
              <span className="text-lg text-accent select-none font-bold">
                {expanded === topic.id ? '−' : '+'}
              </span>
            </button>

            {expanded === topic.id && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 mt-1 animate-fade-in">
                {/* LEFT */}
                <div className="bg-raised border-l-4 border-alarm rounded-md p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-alarm bg-alarm/10 border border-alarm/20 px-1.5 py-0.5 rounded mb-2.5 inline-block">
                      {topic.left.actor}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-text-primary mb-2">
                      {topic.left.position}
                    </p>
                  </div>
                  <p className="text-[11px] font-mono text-text-muted mt-2 border-t border-main/20 pt-2 select-text">
                    <strong>Sustento:</strong> {topic.left.evidence}
                  </p>
                </div>

                {/* CENTER */}
                <div className="bg-raised border-l-4 border-info rounded-md p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-info bg-info/10 border border-info/20 px-1.5 py-0.5 rounded mb-2.5 inline-block">
                      {topic.center.actor}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-text-primary mb-2">
                      {topic.center.position}
                    </p>
                  </div>
                  <p className="text-[11px] font-mono text-text-muted mt-2 border-t border-main/20 pt-2 select-text">
                    <strong>Sustento:</strong> {topic.center.evidence}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="bg-raised border-l-4 border-warning rounded-md p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-warning bg-warning/10 border border-warning/20 px-1.5 py-0.5 rounded mb-2.5 inline-block">
                      {topic.right.actor}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-text-primary mb-2">
                      {topic.right.position}
                    </p>
                  </div>
                  <p className="text-[11px] font-mono text-text-muted mt-2 border-t border-main/20 pt-2 select-text">
                    <strong>Sustento:</strong> {topic.right.evidence}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
