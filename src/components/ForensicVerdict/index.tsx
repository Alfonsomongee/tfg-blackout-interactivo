

interface VerdictSection {
  num: number;
  title: string;
  points: string[];
  color: string;
}

const VERDICT: VerdictSection[] = [
  {
    num: 1,
    title: 'Lo que TODOS acuerdan (consenso verificado)',
    points: [
      'Inercia no fue causa raíz: 2,3 s está sobre el límite de seguridad de 2,0 s recomendado por ENTSO-E.',
      'El colapso se debió enteramente a inestabilidad capacitiva por sobretensión, no a un déficit de potencia activa energética primario.',
      'El deslastre UFLS de cargas agravó letalmente el colapso al suprimir de golpe los únicos sumideros reactivos inductivos de la red: paradoja física confirmada.',
      'El criterio N-1 estático clásico demostró ser rotundamente insuficiente para la toma de decisiones en tiempo real con un 82% de penetración IBR.',
      'La normativa operativa y de control de tensión vigente en el momento del incidente (P.O. 7.4, RD 413/2014) está obsoleta y es inadecuada para el mix energético actual.',
    ],
    color: 'var(--nominal)',
  },
  {
    num: 2,
    title: 'Dónde divergen y por qué (causa de la brecha)',
    points: [
      'Responsabilidad básica: ¿Operador imprudente al ejecutar el mallado o generadores incapaces por límites de diseño? → Falta de resolución y densidad de datos SCADA y oscilográficos de PMU en los nudos de distribución.',
      'Detonante: ¿La maniobra de mallado masivo o el incumplimiento de los parques distribuidos? → Ambos fenómenos retroalimentaron el pico transitorio capacitivo en una proporción que resulta incuantificable sin plena observabilidad.',
      'Prioridad de prevención: ¿Reforma regulatoria integral para actualizar el P.O. 7.4 o despliegue inmediato de herramientas en tiempo real? → Ambas son necesarias, pero el orden de priorización de inversiones tiene un trasfondo político y económico.',
    ],
    color: 'var(--warning)',
  },
  {
    num: 3,
    title: 'Qué sostiene la física del sistema (no opinión)',
    points: [
      'El margen Q-V de la subestación de Carmona colapsó físicamente: pasó de 2.964 MW a 1.268 MW (una contracción neta del 57%) tras completarse la maniobra de mallado.',
      'La inyección reactiva capacitiva inducida por el efecto Ferranti de las 11 líneas en vacío se situó en la banda de 1,05-2,4 GVAr.',
      'La frecuencia del sistema permaneció de forma estable sobre el límite crítico de 49,5 Hz hasta el último segundo de la cascada dinámica.',
      'La velocidad total de colapso y caída de la red fue inferior a los 90 segundos, lo que sitúa el evento dinámico completamente fuera del horizonte de intervención humana del operador.',
    ],
    color: 'var(--accent-blue)',
  },
  {
    num: 4,
    title: 'Qué sostiene la gobernanza sistémica (estructura)',
    points: [
      'El paradigma de control puramente centralizado (un único operador basándose en telemedidas de transporte a 400kV) ha alcanzado sus límites físicos ante un mix con un 82% de IBR.',
      'Existe una ausencia generalizada de herramientas de monitorización y análisis dinámico transitorio en tiempo real en los RCCs europeos.',
      'Se hace indispensable y urgente legislar el modo Grid-Forming obligatorio e inercia sintética en la reforma del código de red nc RfG 2.0 europeo.',
      'La brecha estructural entre la operación rutinaria basada en históricos normativos estáticos y el análisis adaptativo rápido de transitorios de red.',
    ],
    color: 'var(--info)',
  },
  {
    num: 5,
    title: 'Conclusión global: ¿Qué pasó realmente?',
    points: [
      'El incidente del 28 de Abril no fue un accidente fortuito o aislado. Constituye la convergencia letal de 3 fracturas de gobernanza que coexistían de forma latente en el sistema eléctrico ibérico.',
      'No se puede reducir el debate a una "culpa de X". Es un caso clásico de "arquitectura tecnológica insuficiente para sostener Y". Tanto el operador de red como los generadores operaban formalmente dentro de sus límites legales de competencia, pero las normas eran inadecuadas para las dinámicas transitorias reales.',
      'La física matemática de la red es clara y unívoca; la atribución de responsabilidad resulta áspera e interpretable porque depende enteramente del marco que cada institución utilice para definir el "deber de anticipación voluntaria".',
      'La gran lección: el sistema eléctrico necesita una transición rápida en tres ejes ineludibles: (1) despliegue de herramientas dinámicas transitorias en RCCs, (2) modernización regulatoria de códigos y procedimientos (P.O. 7.4), y (3) adopción de un paradigma cooperativo y distribuido de control de tensión.',
    ],
    color: 'var(--text-primary)',
  },
];

export default function ForensicVerdict() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 select-text">
      <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>Síntesis y conclusiones</p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400,
        color: 'var(--text-primary)', marginBottom: '0.5rem'
      }}>
        Veredicto forense: ¿Qué pasó realmente?
      </h2>
      <p className="t-body" style={{ maxWidth: '600px', marginBottom: '2.5rem' }}>
        Análisis meta-analítico: desprovisto de política o atribuciones subjetivas. 
        Solo hechos verificables, divergencias de perspectiva fundamentadas y lecciones estructurales.
      </p>

      <div className="grid grid-cols-1 gap-6">
        {VERDICT.map((section, i) => (
          <div key={i} className="surface-raised p-6 border border-main rounded-md transition-all duration-200 hover:border-accent" style={{
            borderLeft: `5px solid ${section.color}`
          }}>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-xl sm:text-2xl font-black leading-none select-none" style={{
                color: section.color
              }}>
                0{section.num}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-text-primary margin-0">
                {section.title}
              </h3>
            </div>

            <ul className="list-none m-0 p-0 space-y-3">
              {section.points.map((point, j) => (
                <li key={j} className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-4 border-l border-main/40 select-text">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
