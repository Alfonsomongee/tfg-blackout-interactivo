import { useState } from 'react';

interface Citation { source: string; color: string; text: string; }
interface DataPoint { label: string; value: string; unit?: string; }
interface Finding { icon: string; text: string; type: 'consensus'|'divergence'|'conclusion'|'warning'; }

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  pages: string;
  color: string;
  icon: string;
  abstract: string;
  keyData: DataPoint[];
  citations: Citation[];
  findings: Finding[];
  divergenceScore: number; // 0-10: grado de desacuerdo institucional
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Introducción',
    subtitle: 'Objeto, justificación técnica y metodología',
    pages: 'pp. 1–4',
    color: '#1d4ed8', // Royal Blue
    icon: '⚡',
    abstract: 'El colapso del 28 de abril de 2025 implicó la pérdida súbita de más de 15 GW de generación en segundos y dejó sin suministro a ~60 millones de personas. Este TFG no realiza una reconstrucción cronológica simple: examina críticamente las divergencias entre tres visiones institucionales —Gobierno/REE, sector generador (ICAI/AELEC) y gestor europeo (ENTSO-E)— y contrasta sus marcos argumentales con los códigos de red europeos y los principios modernos de estabilidad en sistemas dominados por inversores.',
    keyData: [
      { label: 'Potencia perdida', value: '>15', unit: 'GW' },
      { label: 'Personas afectadas', value: '~60', unit: 'millones' },
      { label: 'Penetración renovable', value: '82', unit: '%' },
      { label: 'Interconexión ES-FR', value: '7,9', unit: '% demanda punta' },
      { label: 'Objetivo UE 2030', value: '15', unit: '%' },
      { label: 'Documentación técnica', value: '>170', unit: 'GB registros' },
    ],
    citations: [
      { source: 'ENTSO-E', color: '#0ea5e9', text: 'El sistema transitó de "Normal" a "Blackout" (OB3) a las 12:33:29 CEST sin pasar por ninguna fase intermedia de alerta.' },
      { source: 'ICAI/AELEC', color: '#f97316', text: 'La convergencia de baja inercia síncrona y aislamiento relativo configuró la vulnerabilidad exacta que hizo imposible frenar la cascada a las 12:33:24 CEST.' },
      { source: 'REE', color: '#ef4444', text: 'El sistema operaba con herramientas regulatorias suficientes para mitigar el transitorio; el agravamiento se atribuye a insuficiente absorción de reactiva inductiva conforme a P.O. 7.4.' },
    ],
    findings: [
      { icon: '🔍', text: 'Metodología forense comparativa: triangulación de fuentes primarias divergentes', type: 'conclusion' },
      { icon: '⚠', text: 'Fenómeno Tap-Lag: punto ciego operativo en redes de colectores de 220 kV', type: 'warning' },
      { icon: '📊', text: 'Validación técnica independiente mediante datos PMU paneuropeos', type: 'conclusion' },
    ],
    divergenceScore: 9,
  },
  {
    id: 2,
    title: 'Contexto Eléctrico',
    subtitle: 'Transición energética y condiciones previas',
    pages: 'pp. 5–14',
    color: '#15803d', // Forest Green
    icon: '🌱',
    abstract: 'El sistema peninsular consolidó en 2025 más de 100 GW de capacidad renovable instalada. La paradoja operativa: demanda valle de 25.184 MW a las 12:30 CEST (56% de la demanda punta histórica) coincidió con un pico extremo de solar fotovoltaica (~18.000 MW, 53% del mix). La generación síncrona quedó en mínimos históricos: nuclear 10% (3,4 GW), ciclos combinados 3% (~1.600 MW). Episodios precursores el 16, 22 y 24 de abril: tensiones >430 kV en Núñez de Balboa.',
    keyData: [
      { label: 'Capacidad renovable instalada', value: '>100', unit: 'GW' },
      { label: 'Solar FV ese día', value: '~18.000', unit: 'MW (53%)' },
      { label: 'Demanda a las 12:30', value: '25.184', unit: 'MW' },
      { label: 'Inercia zona sur', value: '1,30', unit: 's (ICAI)' },
      { label: 'Inercia zona centro', value: '1,84', unit: 's (ICAI)' },
      { label: 'Umbral mínimo ENTSO-E', value: '2,0', unit: 's' },
    ],
    citations: [
      { source: 'ICAI', color: '#f97316', text: 'La inercia síncrona cayó a 1,3 s en el área Sur y 1,84 s en el área Centro, por debajo del umbral de 2 s recomendado por ENTSO-E.' },
      { source: 'Gobierno', color: '#8b5cf6', text: 'Las emisiones del sector eléctrico en 2024 se redujeron hasta 27,0 MtCO₂-eq, un descenso del 75,7 % frente al pico de 2007 (110 MtCO₂-eq).' },
      { source: 'REE', color: '#ef4444', text: 'El HVDC INELFE-1 pasó de PMODE3 (emulación AC) a PMODE1 (potencia fija) a las 12:11 CEST, fijando exportación constante de 1.000 MW.' },
    ],
    findings: [
      { icon: '⚡', text: 'Paradoja de la abundancia: exceso de generación barata con déficit de servicios de estabilidad', type: 'warning' },
      { icon: '📉', text: 'Ciclos combinados con factor utilización <15% anual: desincentivo estructural a la generación síncrona', type: 'conclusion' },
      { icon: '🗺', text: 'Península como "isla energética": interconexión ES-FR al 7,9% vs objetivo 15% UE', type: 'warning' },
    ],
    divergenceScore: 4,
  },
  {
    id: 3,
    title: 'Cronología del Colapso',
    subtitle: 'Fases 0–4: de la oscilación al cero de tensión',
    pages: 'pp. 15–25',
    color: '#b91c1c', // Academic Crimson Red
    icon: '💥',
    abstract: 'El colapso se estructura en cinco fases. Fase 0: días previos, estrés dinámico latente. Fase 1 (12:00–12:30): oscilaciones interárea de 0,63 Hz y 0,21 Hz, maniobras de mallado. Fase 2 (12:32:00–12:33:18): subida lineal de tensiones 400 kV (+15 kV en 57 s), pérdidas de generación por 525 MW. Fase 3 (12:33:18–12:33:30): disparo raíz en Granada a 12:32:57, cascada, pérdida de sincronismo a 12:33:21. Fase 4: reposición. Duración total del colapso: 22,5 s desde disparo en Granada.',
    keyData: [
      { label: 'Oscilación 1', value: '0,63', unit: 'Hz (12:03 CEST)' },
      { label: 'Oscilación 2', value: '0,21', unit: 'Hz (12:19 CEST)' },
      { label: 'Disparo raíz', value: '12:32:57', unit: 'CEST (Granada)' },
      { label: 'Pérdida de sincronismo', value: '12:33:21', unit: 'CEST (Francia)' },
      { label: 'Tensión máxima', value: '445', unit: 'kV (Hueneja)' },
      { label: 'Tiempo de reposición', value: '3,5', unit: 'horas' },
    ],
    citations: [
      { source: 'REE', color: '#ef4444', text: 'La separación se desencadenó de forma fortuita debido a la actuación intempestiva de protecciones de distancia ordinarias en la línea Huéneja-Granada a 12:32:57 CEST.' },
      { source: 'ICAI', color: '#f97316', text: 'El disparo de Granada no fue aislado ni fortuito: fue inducido por la sobretensión lineal persistente debida al exceso de inyección reactiva inductiva y capacitiva no modulada.' },
    ],
    findings: [
      { icon: '🕒', text: 'Velocidad de propagación extrema: cascada de fallos completada en 22,5 segundos', type: 'warning' },
      { icon: '📡', text: 'Anomalías en PMU: desfases temporales de telemetría de hasta 40 ms ocultaron la urgencia', type: 'warning' },
      { icon: '🛠', text: 'Protocolo de reposición coordinado: restauración prioritaria de servicios auxiliares', type: 'conclusion' },
    ],
    divergenceScore: 8,
  },
  {
    id: 4,
    title: 'Análisis de Inercia síncrona',
    subtitle: 'Cálculo de la inercia real vs estimaciones estáticas',
    pages: 'pp. 26–41',
    color: '#0369a1', // Sky/Technical Blue
    icon: '⚖',
    abstract: 'La inercia síncrona real del sistema cayó a mínimos críticos. REE basó su operación en un parámetro estático agregado de ~2,3 s. Sin embargo, el análisis zonal del ICAI demostró una asimetría estructural severa: el Noroeste retenía 3,84 s (hidráulica/térmica), mientras que el Sur (área de mayor penetración solar) cayó a 1,30 s. Al producirse la desconexión del enlace francés, el RoCoF peninsular alcanzó los -2,5 Hz/s, superando con creces la capacidad de respuesta de los reguladores de velocidad primarios convencionales.',
    keyData: [
      { label: 'Inercia global REE', value: '2,30', unit: 's' },
      { label: 'Inercia zona sur ICAI', value: '1,30', unit: 's' },
      { label: 'Inercia zona centro ICAI', value: '1,84', unit: 's' },
      { label: 'Inercia zona NW ICAI', value: '3,84', unit: 's' },
      { label: 'RoCoF máximo peninsular', value: '-2,50', unit: 'Hz/s' },
      { label: 'Retardo actuación primario', value: '>2,0', unit: 's' },
    ],
    citations: [
      { source: 'ENTSO-E', color: '#0ea5e9', text: 'Los sistemas síncronos con inercia de red equivalente menor a 2,0 s requieren reservas ultrarrápidas de frecuencia sintonizadas en menos de 150 ms para evitar el colapso.' },
      { source: 'REE', color: '#ef4444', text: 'No existe constancia reglamentaria nacional de asimetría inercial zonal obligatoria para la planificación diaria de operación en el mercado diario.' },
    ],
    findings: [
      { icon: '📈', text: 'Asimetría espacial de inercia: el parque síncronico concentrado en el NW deja al Sur desprotegido', type: 'warning' },
      { icon: '⏱', text: 'Retardo del lazo convencional: las turbinas hidráulicas tardan >2 s en aportar potencia primaria', type: 'conclusion' },
      { icon: '🔋', text: 'Necesidad de BESS Grid-Forming: las baterías en Grid-Following no reducen el RoCoF inicial', type: 'warning' },
    ],
    divergenceScore: 10,
  },
  {
    id: 5,
    title: 'Dinámica de la Tensión',
    subtitle: 'Colectores renovables, sobretensiones y Tap-Lag',
    pages: 'pp. 42–55',
    color: '#0ea5e9', // Blue/Cyan
    icon: '🌐',
    abstract: 'La causa raíz del colapso de tensión radica en la interacción dinámica de los colectores de 220 kV que evacuan energía de grandes plantas solares del Sur. Al operar con baja carga, estas líneas producen reactiva (efecto Ferranti). El control de tensión de los inversores grid-following, sintonizado de forma agresiva, entró en oscilación por falta de amortiguamiento dinámico. Las subestaciones intentaron regular mediante cambiadores de tomas bajo carga (OLTC), pero el retardo inherente de estos mecanismos mecánicos (Tap-Lag de 30-45 s) provocó una avalancha de sobretensión lineal incontrolada.',
    keyData: [
      { label: 'Sobretensión pico registrada', value: '445', unit: 'kV (1,11 p.u.)' },
      { label: 'Retardo cambiador de tomas', value: '45', unit: 's (Tap-Lag)' },
      { label: 'Generación solar evacuada', value: '8.400', unit: 'MW (Sur)' },
      { label: 'Capacitancia shunt parásita', value: '+1.200', unit: 'MVAr (líneas 220kV)' },
      { label: 'Margen de estabilidad de tensión', value: '1.019', unit: 'MW' },
    ],
    citations: [
      { source: 'ICAI', color: '#f97316', text: 'La avalancha por sobretensión lineal fue catalizada por la respuesta lenta de los cambiadores de tomas mecánicos de REE frente a transitorios de milisegundos de los inversores asíncronos.' },
      { source: 'REE', color: '#ef4444', text: 'Las plantas generadoras asíncronas vulneraron el P.O. 7.4 al no absorber la reactiva inductiva exigida de forma dinámica durante el incremento de tensión.' },
    ],
    findings: [
      { icon: '🔄', text: 'Anomalía de Tap-Lag: los mecanismos mecánicos OLTC son inoperantes ante dinámicas ultrarrápidas', type: 'warning' },
      { icon: '〰', text: 'Oscilación de control: acoplamiento inestable entre inversores cercanos de distintas marcas', type: 'warning' },
      { icon: '⚡', text: 'Efecto Ferranti dinámico: sobretensión lineal inducida por líneas de alta capacidad en vacío', type: 'conclusion' },
    ],
    divergenceScore: 7,
  },
  {
    id: 6,
    title: 'Interconexión Internacional',
    subtitle: 'El enlace HVDC de INELFE y su rigidez comercial',
    pages: 'pp. 56–70',
    color: '#a78bfa', // Purple
    icon: '🔌',
    abstract: 'El enlace de corriente continua (HVDC) INELFE entre España y Francia posee una capacidad dinámica de emulación de inercia y soporte automático de frecuencia. No obstante, a las 12:11 CEST, debido a compromisos comerciales rígidos de intercambio internacional en el mercado diario de acoplamiento de precios (SDAC), el enlace se configuró en modo PMODE1 (potencia de exportación constante a 1.000 MW). Al producirse el transitorio de Granada, el lazo dinámico estaba anulado, bloqueando la asistencia mutua y acelerando la pérdida de sincronismo transfronteriza.',
    keyData: [
      { label: 'Capacidad enlace INELFE', value: '2x1000', unit: 'MW' },
      { label: 'Modo de operación real', value: 'PMODE1', unit: 'Potencia Fija' },
      { label: 'Emulación inercia sintética', value: '0', unit: 'MW/Hz (Desactivado)' },
      { label: 'Sobrecarga de AC Francia', value: '+3.807', unit: 'MW (Previo a disparo)' },
      { label: 'Filtros armónicos HVDC', value: '2', unit: 'bancos desconectados' },
    ],
    citations: [
      { source: 'ENTSO-E', color: '#0ea5e9', text: 'Priorizar el cumplimiento contractual comercial rígido frente a la estabilidad operativa en tiempo real de los enlaces HVDC constituye un riesgo crítico sistémico europeo.' },
      { source: 'REE', color: '#ef4444', text: 'La fijación del HVDC en PMODE1 respondió estrictamente a la programación vinculante resultante del mercado diario paneuropeo coordinado.' },
    ],
    findings: [
      { icon: '🚫', text: 'Bloqueo regulatorio: contratos comerciales de exportación prevalecieron sobre la estabilidad física de la red', type: 'warning' },
      { icon: '🔋', text: 'Lazo inercial anulado: la inercia sintética del HVDC habría reducido el RoCoF inicial en un 42%', type: 'conclusion' },
      { icon: '🔌', text: 'Disparo de interconexiones AC: las líneas convencionales de Pirineos abrieron por sobrecorriente a las 12:33:21', type: 'warning' },
    ],
    divergenceScore: 9,
  },
  {
    id: 7,
    title: 'Deslastre de Carga (UFLS)',
    subtitle: 'Análisis del comportamiento del deslastre por subfrecuencia',
    pages: 'pp. 71–85',
    color: '#f43f5e', // Coral Rose
    icon: '📉',
    abstract: 'Al desconectarse España de Europa Continental, la península quedó con un grave déficit de generación síncrona. La frecuencia colapsó rápidamente. Las protecciones automáticas por subfrecuencia (UFLS) actuaron según diseño en tres escalones, deslastrando un total de ~3.990 MW de demanda industrial y urbana. Si bien el UFLS estabilizó la frecuencia peninsular evitando un cero total analítico de tensión, el deslastre se aplicó de forma homogénea sin considerar la asimetría inercial, penalizando innecesariamente a nudos del Noroeste con fuerte inercia síncrona.',
    keyData: [
      { label: 'Escalón I deslastrado (49,5 Hz)', value: '2.000', unit: 'MW (Bombeo)' },
      { label: 'Escalón II deslastrado (49,3 Hz)', value: '588', unit: 'MW (Bombeo)' },
      { label: 'Escalón III deslastrado (49,0 Hz)', value: '1.402', unit: 'MW (Demanda)' },
      { label: 'Total deslastrado', value: '3.990', unit: 'MW' },
      { label: 'Frecuencia de estabilización', value: '49,15', unit: 'Hz' },
    ],
    citations: [
      { source: 'REE', color: '#ef4444', text: 'El deslastre automático de carga UFLS cumplió de forma intachable su misión de salvaguardar el sistema y evitar un blackout total en territorio español.' },
      { source: 'ICAI', color: '#f97316', text: 'El deslastre fue geométricamente ciego: se aplicó un recorte masivo uniforme que sobrepenalizó a zonas con inercia local remanente suficiente.' },
    ],
    findings: [
      { icon: '💡', text: 'Eficacia del deslastre: el corte automático salvó la península de un blackout absoluto de días de duración', type: 'conclusion' },
      { icon: '⚖', text: 'Injusticia inercial: necesidad de esquemas dinámicos de deslastre adaptativos por zonas', type: 'warning' },
      { icon: '💧', text: 'Bombeo hidráulico como freno veloz: el consumo de bombeo se cortó en <100 ms', type: 'conclusion' },
    ],
    divergenceScore: 5,
  },
  {
    id: 8,
    title: 'Reformas Regulatorias',
    subtitle: 'Códigos de red, inercia obligatoria e inversores Grid-Forming',
    pages: 'pp. 86–101',
    color: '#eab308', // Amber
    icon: '📜',
    abstract: 'El análisis forense concluye que el marco normativo actual es insuficiente para operar una red dominada por electrónica de potencia. Se propone una reforma integral estructurada en tres ejes: 1. Obligatoriedad reglamentaria de inercia síncrona mínima zonal de 2,0 s. 2. Modificación de los códigos de red paneuropeos (RfG) para exigir tecnología Grid-Forming con reservas dinámicas en el 100% de nuevas plantas asíncronas. 3. Creación de un mercado específico de inercia sintética y reservas ultrarrápidas de frecuencia para remunerar la estabilidad.',
    keyData: [
      { label: 'Inercia mínima zonal exigida', value: '2,0', unit: 's (Propuesta)' },
      { label: 'Ratio Grid-Forming exigido', value: '100', unit: '% en nuevas plantas' },
      { label: 'Mercado de inercia propuesto', value: '10-15', unit: '€/MWs remun.' },
      { label: 'Modificación código RfG', value: 'Eje 1', unit: 'ENTSO-E aprobado' },
      { label: 'Tiempo de sintonización GFM', value: '<50', unit: 'ms de respuesta' },
    ],
    citations: [
      { source: 'ENTSO-E', color: '#0ea5e9', text: 'La transición energética exige que los inversores asuman los servicios de soporte del sistema que antes proporcionaban los generadores síncronos tradicionales.' },
      { source: 'ICAI', color: '#f97316', text: 'Exigir inversores Grid-Forming sin reformar el mercado eléctrico diario condena a las plantas renovables a inyectar potencia sin rentabilizar la estabilidad de red.' },
    ],
    findings: [
      { icon: '📖', text: 'Reforma del código de red RfG: obligatoriedad del soporte dinámico de tensión en inversores', type: 'conclusion' },
      { icon: '💰', text: 'Remuneración de estabilidad: incentivos económicos directos para plantas con reservas BESS', type: 'conclusion' },
      { icon: '⚖', text: 'Soberanía inercial zonal: planificación del mercado intradiario con restricciones dinámicas de H', type: 'warning' },
    ],
    divergenceScore: 3,
  }
];

function getDivergenceColor(score: number): string {
  const hue = score <= 3 
    ? 200 - (score * 20) 
    : Math.max(0, 60 - (score - 4) * 10);
  return `hsl(${hue}, 85%, 45%)`;
}

function DivergenceBar({ score }: { score: number }) {
  const dynamicColor = getDivergenceColor(score);
  return (
    <div className="mt-2.5">
      <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary mb-1">
        <span>Nivel de Divergencia Académica:</span>
        <span className="font-bold font-mono" style={{ color: dynamicColor }}>
          {score}/10
        </span>
      </div>
      <div className="w-full h-1.5 bg-tertiary rounded-full overflow-hidden border border-main/40 flex">
        <div 
          className="h-full transition-all duration-300"
          style={{ width: `${score * 10}%`, backgroundColor: dynamicColor }}
        />
      </div>
    </div>
  );
}

function FindingBadge({ finding }: { finding: Finding }) {
  const getColors = () => {
    switch (finding.type) {
      case 'warning': return 'bg-alert-red/10 border-alert-red text-alert-red';
      case 'divergence': return 'bg-alert-orange/10 border-alert-orange text-alert-orange';
      case 'conclusion': return 'bg-alert-green/10 border-alert-green text-alert-green';
      default: return 'bg-tertiary border-main text-text-secondary';
    }
  };

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded border mb-2.5 leading-relaxed text-xs ${getColors()}`}>
      <span className="text-sm">{finding.icon}</span>
      <span className="select-text">{finding.text}</span>
    </div>
  );
}

function CitationCard({ citation }: { citation: Citation }) {
  return (
    <div className="border-l-4 border-accent bg-tertiary p-4 rounded-r mb-3 select-text">
      <div className="font-mono text-[10px] tracking-wider uppercase text-text-mono font-bold mb-1">
        [{citation.source}] — Posicionamiento Forense
      </div>
      <div className="font-serif text-xs md:text-sm text-text-secondary italic leading-relaxed">
        "{citation.text}"
      </div>
    </div>
  );
}

export default function ChapterDossier() {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'findings'|'citations'|'data'>('findings');

  const expanded = CHAPTERS.find(c => c.id === expandedId) ?? null;

  return (
    <div className="flex-grow p-1 animate-fade-in flex flex-col gap-6 w-full">
      
      {/* Title area */}
      <div className="border-b border-main pb-4 mb-2">
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
          Dossier Técnico de Capítulos de la Tesis
        </h2>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Capítulo V · Índice Estructurado y Abstract Académico por Áreas Temáticas del TFG
        </p>
      </div>

      <div className="bg-secondary border border-main rounded-lg p-6 shadow-sm">
        <p className="text-xs md:text-sm text-text-secondary leading-relaxed mb-6 font-sans select-text">
          A continuación se presentan los abstracts, hallazgos empíricos y recopilación de citas bibliográficas de los capítulos clave del Trabajo de Fin de Grado. Cada bloque se estructura para emular la maquetación de una monografía impresa oficial, integrando la catalogación y el grado de debate científico de cada sección.
        </p>

        {/* Visual Index Filter */}
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-tertiary border border-main rounded-lg items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-mono font-bold mr-2">
            Navegación Rápida Dossier:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CHAPTERS.map(ch => (
              <button
                key={ch.id}
                onClick={() => setExpandedId(ch.id)}
                className={`font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded border cursor-pointer transition-all duration-150 ${
                  expandedId === ch.id
                    ? 'bg-accent text-white border-accent font-bold'
                    : 'bg-secondary border-main text-text-secondary hover:text-text-primary hover:border-accent'
                }`}
              >
                Cap. 0{ch.id}
              </button>
            ))}
            <button
              onClick={() => setExpandedId(null)}
              className={`font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded border cursor-pointer transition-all duration-150 ${
                expandedId === null
                  ? 'bg-accent text-white border-accent font-bold'
                  : 'bg-secondary border-main text-text-secondary hover:text-text-primary hover:border-accent'
              }`}
            >
              Mostrar Todos
            </button>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {CHAPTERS.map(ch => {
            const isSelected = ch.id === expandedId;
            return (
              <div
                key={ch.id}
                onClick={() => setExpandedId(isSelected ? null : ch.id)}
                className={`bg-secondary border rounded-lg p-5 cursor-pointer transition-all duration-200 select-none shadow-sm ${
                  isSelected 
                    ? 'border-accent bg-tertiary/20 shadow' 
                    : 'border-main hover:border-accent hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-3">
                  <div 
                    className="w-9 h-9 rounded flex items-center justify-center text-lg flex-shrink-0 border"
                    style={{ 
                      background: `${ch.color}15`, 
                      borderColor: `${ch.color}35`,
                      color: ch.color
                    }}
                  >
                    {ch.icon}
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className="font-mono text-[9px] tracking-widest text-text-mono uppercase mb-0.5 font-bold block">
                      CAPÍTULO 0{ch.id} · {ch.pages}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-text-primary leading-tight truncate select-text">
                      {ch.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-normal mb-3 line-clamp-2 select-text">
                  {ch.subtitle}
                </p>

                <DivergenceBar score={ch.divergenceScore} />

                <div className="flex justify-end mt-4">
                  <span className={`font-mono text-[9px] font-bold tracking-widest uppercase transition-colors ${
                    isSelected ? 'text-accent' : 'text-text-secondary/60'
                  }`}>
                    {isSelected ? '▲ CERRAR APARTADO' : '▼ LEER DETALLE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chapter expanded detail sheet */}
        {expanded && (
          <div className="bg-secondary border-2 border-accent rounded-lg p-6 shadow-sm mt-4 animate-fade-in">
            {/* Expanded Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-main pb-5 mb-5">
              <div className="flex items-start gap-4">
                <div 
                  className="w-11 h-11 rounded flex items-center justify-center text-2xl flex-shrink-0 border"
                  style={{ 
                    background: `${expanded.color}15`, 
                    borderColor: `${expanded.color}35`,
                    color: expanded.color
                  }}
                >
                  {expanded.icon}
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-text-mono font-bold uppercase block mb-1">
                    CAPÍTULO DE TESIS 0{expanded.id} · {expanded.pages}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-text-primary tracking-tight select-text">
                    {expanded.title}
                  </h3>
                  <p className="text-xs text-text-secondary select-text mt-1">{expanded.subtitle}</p>
                </div>
              </div>
              <div className="w-full sm:w-48 flex-shrink-0">
                <DivergenceBar score={expanded.divergenceScore} />
              </div>
            </div>

            {/* Abstract */}
            <div className="bg-tertiary border-l-4 border-accent p-5 rounded-r mb-6 select-text">
              <div className="font-mono text-[9px] font-bold tracking-widest text-text-secondary uppercase mb-2">
                Abstract de la Investigación
              </div>
              <p className="font-serif text-xs md:text-sm text-text-primary italic leading-relaxed margin-0">
                "{expanded.abstract}"
              </p>
            </div>

            {/* Tab selection row */}
            <div className="flex flex-wrap gap-1.5 border-b border-main/50 pb-3 mb-5">
              {(['findings','data','citations'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={e => { e.stopPropagation(); setActiveTab(tab); }}
                  className={`font-mono text-[10px] tracking-wider uppercase px-4 py-2 rounded-t transition-all duration-200 border cursor-pointer ${
                    activeTab === tab
                      ? 'bg-accent text-white border-accent font-bold'
                      : 'bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-tertiary/40'
                  }`}
                >
                  {tab === 'findings' ? '⚡ Hallazgos Críticos'
                    : tab === 'data' ? '📊 Variables Clave'
                    : '💬 Citas de Fuentes'}
                </button>
              ))}
            </div>

            {/* Tab content sheet */}
            <div className="animate-fade-in">
              {activeTab === 'findings' && (
                <div className="space-y-1">
                  {expanded.findings.map((f, i) => <FindingBadge key={i} finding={f} />)}
                </div>
              )}

              {activeTab === 'data' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {expanded.keyData.map((d, i) => (
                    <div key={i} className="bg-tertiary border border-main rounded-lg p-4 text-center shadow-sm">
                      <span className="text-[10px] font-mono tracking-wider text-text-secondary uppercase block mb-1.5">
                        {d.label}
                      </span>
                      <span className="font-mono text-2xl font-extrabold text-accent block leading-none">
                        {d.value}
                      </span>
                      {d.unit && (
                        <span className="font-mono text-[9px] text-text-secondary/70 tracking-widest uppercase mt-1 block">
                          {d.unit}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'citations' && (
                <div className="space-y-1">
                  {expanded.citations.map((c, i) => <CitationCard key={i} citation={c} />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export { CHAPTERS };
