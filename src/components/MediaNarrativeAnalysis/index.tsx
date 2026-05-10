import { useState } from 'react';

const PHASES = [
  {
    id: 'phase1',
    time: '0–6 horas (28-A 12:33–18:00)',
    title: 'Incertidumbre aguda: desinformación y vacío institucional',
    description: 'La ausencia de comparecencia gubernamental durante las primeras cinco horas generó un proceso de vacuum filling: el vacío informativo fue ocupado por fuentes no verificadas. La extrema opacidad técnica del colapso por sobretensión favoreció la propagación de hipótesis alternativas fácilmente asimilables por el gran público.',
    phenomena: [
      { label: 'Hipótesis "Operación Matrioska"', desc: 'Ciberataque falsificado. Propagado masivamente antes de ser desmentido por REE.' },
      { label: 'Hipótesis de sabotaje externo', desc: 'Correlacionada erróneamente con geopolítica. Sin ninguna base técnica.' },
      { label: 'Hipótesis meteorológica', desc: '"Fenómeno atmosférico anómalo" — incompatible con la física del colapso capacitivo.' },
      { label: 'Humor de afrontamiento', desc: 'Preservación de cervezas en terrazas, ironía costumbrista. Mecanismo de regulación emocional colectiva (Emergent Norm Theory).' },
    ],
    color: 'var(--alarm)',
    icon: '⚠',
  },
  {
    id: 'phase2',
    time: '6–72 horas (28-A 18:00 → 1 may)',
    title: 'Politización: consolidación de narrativas de responsabilidad',
    description: 'Pasado el caos inicial, los medios y actores políticos consolidaron narrativas de atribución de responsabilidad. La selección asimétrica de evidencias polarizó el debate: medios críticos enfatizaron el déficit de generación síncrona (omitiendo el mallado), medios afines a la narrativa oficial enfatizaron el error operativo y el déficit de interconexiones (omitiendo el comportamiento de los generadores).',
    phenomena: [
      { label: 'Encuadre cuestionador', desc: 'Exige responsabilidades institucionales. Énfasis en inestabilidad del sistema y política energética.' },
      { label: 'Encuadre oficial', desc: 'Contención de daños. Desplazamiento narrativo hacia las eléctricas privadas.' },
      { label: 'Encuadre internacional', desc: 'Enfoque sistémico y estructural. Ausencia de polarización doméstica. Más cercano a la realidad técnica.' },
      { label: 'Figuras políticas en X', desc: 'Uso del apagón para agenda electoral. Amplifican el encuadre de su conveniencia.' },
    ],
    color: 'var(--warning)',
    icon: '⚡',
  },
  {
    id: 'phase3',
    time: '>72 horas (a partir del 1 may)',
    title: 'Corrección tardía: explicaciones técnicas de bajo alcance',
    description: 'Las explicaciones técnicas verídicas (colapso capacitivo, Tap-Lag, inercia zonal) llegaron con un alcance significativamente inferior al de las hipótesis iniciales. El debate público se había polarizado en narrativas excluyentes, bloqueando el consenso político necesario para las reformas técnicas urgentes (P.O. 7.4, Grid-Forming, PMUs).',
    phenomena: [
      { label: 'Paradoja de la corrección', desc: 'La verdad técnica llega tarde y con menos viralidad. Las hipótesis erróneas persisten en el imaginario colectivo.' },
      { label: 'Impacto regulatorio', desc: 'La polarización narrativa bloquea el consenso político necesario para aprobación de NC RfG 2.0 y actualización de P.O. 7.4.' },
      { label: 'Lección estructural', desc: 'Cuando el debate público se polariza en narrativas excluyentes, se convierte en obstáculo real para la respuesta regulatoria.' },
    ],
    color: 'var(--info)',
    icon: '→',
  },
];

const MEDIA_FRAMES = [
  {
    id: 'questioning',
    name: 'Encuadre cuestionador',
    origin: 'Medios críticos con gestión institucional',
    emphasis: [
      'Déficit de generación síncrona (baja inercia)',
      'Falta de interconexiones (isla energética)',
      'Responsabilidad del Gobierno y REE',
    ],
    omission: 'Impacto real del mallado de REE en la inyección capacitiva',
    closestTo: 'Parcialmente correcto — inercia no fue causa raíz, pero isla energética sí agravó',
    color: 'var(--alarm)',
  },
  {
    id: 'official',
    name: 'Encuadre oficial',
    origin: 'Medios alineados con narrativa gubernamental',
    emphasis: [
      'Error operativo de generadores privados',
      'Incumplimiento del P.O. 7.4',
      'Déficit de interconexiones como factor estructural',
    ],
    omission: 'Comportamiento real del parque de generación ante el Tap-Lag y el mallado',
    closestTo: 'Parcialmente correcto — incumplimiento real, pero no explica inobservabilidad',
    color: 'var(--warning)',
  },
  {
    id: 'international',
    name: 'Encuadre internacional',
    origin: 'Medios extranjeros sin agenda doméstica',
    emphasis: [
      'Fragilidad sistémica de la red con alta penetración IBR',
      'Obsolescencia normativa europea (NC RfG)',
      'Lección para toda Europa Continental',
    ],
    omission: 'Detalles técnicos específicos del Tap-Lag y el mallado ibérico',
    closestTo: 'El más cercano a la conclusión del TFG (fractura sistémica)',
    color: 'var(--nominal)',
  },
];

export default function MediaNarrativeAnalysis() {
  const [activePhase, setActivePhase] = useState<string | null>('phase1');
  const [activeFrame, setActiveFrame] = useState<string | null>('questioning');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 select-text">
      {/* HEADER SECTION */}
      <div className="border-b border-main pb-4 mb-6">
        <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>
          Cap. 6 — Impacto socio-comunicativo
        </p>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
          fontWeight: 400, color: 'var(--text-primary)', marginBottom: '0.5rem'
        }}>
          Narrativa mediática vs. realidad técnica
        </h2>
        <p className="t-body" style={{ maxWidth: '640px', marginBottom: '2rem' }}>
          Cómo evolucionó la narrativa pública del apagón en 3 fases temporales. Qué dijo cada encuadre mediático, qué omitió, y por qué la polarización narrativa se convirtió en obstáculo para las reformas.
        </p>
      </div>

      {/* PHASES SECTION */}
      <div className="mb-10">
        <h3 className="font-serif text-lg font-bold text-text-primary border-b border-main/30 pb-2 mb-4 text-left">
          Las 3 fases de la narrativa pública
        </h3>

        <div className="grid gap-4">
          {PHASES.map(phase => {
            const isExpanded = activePhase === phase.id;
            return (
              <div
                key={phase.id}
                className="border border-main rounded-lg overflow-hidden bg-secondary/40 transition-all duration-200"
                style={{ borderLeft: `5px solid ${phase.color}` }}
              >
                <button
                  onClick={() => setActivePhase(isExpanded ? null : phase.id)}
                  className="w-full p-4 text-left bg-transparent border-0 cursor-pointer flex justify-between items-start gap-4 select-none"
                >
                  <div className="text-left">
                    <p className="m-0 text-[10px] font-mono font-bold uppercase tracking-widest mb-1" style={{ color: phase.color }}>
                      {phase.time}
                    </p>
                    <h4 className="m-0 text-sm font-bold text-text-primary flex items-center gap-2">
                      <span className="text-base select-none" style={{ color: phase.color }}>{phase.icon}</span>
                      {phase.title}
                    </h4>
                  </div>
                  <span className="text-xl font-bold leading-none select-none" style={{ color: phase.color }}>
                    {isExpanded ? '−' : '+'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-main/20 animate-fade-in text-left">
                    <p className="text-xs text-text-secondary leading-relaxed mb-4 font-sans select-text">
                      {phase.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
                      {phase.phenomena.map((ph, i) => (
                        <div key={i} className="bg-surface/30 border border-main/40 p-3.5 rounded-md flex flex-col justify-between">
                          <p className="m-0 text-xs font-bold text-text-primary mb-1.5 font-serif">
                            {ph.label}
                          </p>
                          <p className="m-0 text-[11px] text-text-secondary leading-relaxed font-sans select-text">
                            {ph.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MEDIA FRAMES SECTION */}
      <div className="mb-8">
        <h3 className="font-serif text-lg font-bold text-text-primary border-b border-main/30 pb-2 mb-4 text-left">
          Análisis de los 3 encuadres mediáticos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MEDIA_FRAMES.map(frame => {
            const isExpanded = activeFrame === frame.id;
            const isInternational = frame.id === 'international';
            return (
              <div
                key={frame.id}
                className={`border rounded-lg bg-secondary/40 flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
                  isExpanded ? 'border-main' : 'border-main/50'
                }`}
                style={{ borderTop: `4px solid ${frame.color}` }}
              >
                {/* Visual badge for best frame */}
                {isInternational && (
                  <div className="absolute top-2 right-2 bg-alert-green/10 border border-alert-green/30 text-alert-green text-[8px] font-mono uppercase font-bold px-1.5 py-0.5 rounded select-none">
                    ★ RECOMENDADO TFG
                  </div>
                )}

                <button
                  onClick={() => setActiveFrame(isExpanded ? null : frame.id)}
                  className="w-full p-4 text-left bg-transparent border-0 cursor-pointer flex justify-between items-center select-none"
                >
                  <div className="text-left">
                    <p className="m-0 text-xs sm:text-sm font-serif font-bold" style={{ color: frame.color }}>
                      {frame.name}
                    </p>
                    <p className="m-0 text-[10px] font-mono text-text-secondary font-bold uppercase tracking-wider mt-1">
                      {frame.origin}
                    </p>
                  </div>
                  <span className="text-lg font-bold select-none leading-none" style={{ color: frame.color }}>
                    {isExpanded ? '−' : '+'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-main/20 animate-fade-in text-left space-y-3.5">
                    {/* Emphasis block */}
                    <div>
                      <p className="m-0 text-[10px] font-mono font-bold uppercase tracking-wider mb-2" style={{ color: frame.color }}>
                        // Énfasis mediático
                      </p>
                      <div className="space-y-1.5">
                        {frame.emphasis.map((e, i) => (
                          <div key={i} className="text-xs text-text-secondary leading-snug pl-3 border-l border-main/50 font-sans select-text">
                            {e}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Omissions block */}
                    <div>
                      <p className="m-0 text-[10px] font-mono font-bold uppercase tracking-wider text-alert-red mb-1.5">
                        // Omisión sistemática
                      </p>
                      <p className="m-0 text-xs text-text-secondary font-sans leading-normal select-text">
                        {frame.omission}
                      </p>
                    </div>

                    {/* Closest to physical truth block */}
                    <div>
                      <p className="m-0 text-[10px] font-mono font-bold uppercase tracking-wider text-accent mb-1.5">
                        // Proximidad a la física real
                      </p>
                      <p className="m-0 text-xs text-text-secondary font-sans leading-normal select-text">
                        {frame.closestTo}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* INFORMATIVE CALLOUT */}
      <div className="bg-secondary border-l-4 border-info rounded-md p-4 text-left mt-8">
        <p className="text-xs sm:text-sm font-bold text-text-primary mb-1">
          Conclusión del análisis mediático
        </p>
        <p className="text-xs text-text-secondary leading-relaxed m-0 font-sans select-text">
          Las reformas técnicas y regulatorias necesarias (P.O. 7.4, condensadores síncronos, Grid-Forming) exigen un consenso político sostenido. Cuando el debate público se polariza en narrativas excluyentes, se bloquea dicho consenso, convirtiendo la gestión mediática de la crisis en un obstáculo real para la respuesta regulatoria que el sistema requiere. — Cap. 6, TFG.
        </p>
      </div>

    </div>
  );
}
