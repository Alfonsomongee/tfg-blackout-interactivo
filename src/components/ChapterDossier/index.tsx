import { useState } from 'react';

const DIM    = '#475569';
const PANEL  = '#0f1729';
const BORDER = '#1e3a5f';
const TEXT   = '#e2e8f0';
const MUTED  = '#94a3b8';
const MONO   = '#67e8f9';
const RED    = '#ef4444';
const GREEN  = '#22c55e';
const ORANGE = '#f97316';
const YELLOW = '#eab308';

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
    color: '#06b6d4',
    icon: '⚡',
    abstract: 'El colapso del 28 de abril de 2025 implicó la pérdida súbita de más de 15 GW de generación en segundos y dejó sin suministro a ~60 millones de personas. Este TFG no realiza una reconstrucción cronológica: examina críticamente las divergencias entre tres visiones institucionales —Gobierno/REE, sector generador (ICAI/AELEC) y gestor europeo (ENTSO-E)— y contrasta sus marcos argumentales con los códigos de red europeos y los principios modernos de estabilidad en sistemas dominados por inversores.',
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
    color: '#22c55e',
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
    color: '#ef4444',
    icon: '💥',
    abstract: 'El colapso se estructura en cinco fases. Fase 0: días previos, estrés dinámico latente. Fase 1 (12:00–12:30): oscilaciones interárea de 0,63 Hz y 0,21 Hz, maniobras de mallado. Fase 2 (12:32:00–12:33:18): subida lineal de tensiones 400 kV (+15 kV en 57 s), pérdidas de generación por 525 MW. Fase 3 (12:33:18–12:33:30): disparo raíz en Granada a 12:32:57, cascada, pérdida de sincronismo a 12:33:21. Fase 4: reposición. Duración total del colapso: 22,5 s desde disparo en Granada.',
    keyData: [
      { label: 'Oscilación 1', value: '0,63', unit: 'Hz (12:03 CEST)' },
      { label: 'Oscilación 2', value: '0,21', unit: 'Hz (12:19 CEST)' },
      { label: 'Disparo raíz', value: '12:32:57', unit: 'CEST (Granada)' },
      { label: 'Pérdida de sincronismo', value: '12:33:21', unit: 'CEST' },
      { label: 'Duración colapso', value: '22,5', unit: 's' },
      { label: 'Máx. importación Francia', value: '3.807', unit: 'MW' },
    ],
    citations: [
      { source: 'REE', color: '#ef4444', text: 'A las 12:33:19.620 se alcanza la máxima importación de Francia, 3.807 MW en total (4.609 MW por interconexiones AC). Solo han pasado 3,20 s desde el disparo en la subestación B.' },
      { source: 'ENTSO-E', color: '#0ea5e9', text: 'El sistema transitó de "Normal" a "Blackout" sin declaración previa de estado de Alerta. Las herramientas N-1 evaluaron el sistema como seguro hasta los instantes previos.' },
      { source: 'ICAI', color: '#f97316', text: 'El margen al colapso por sobretensión se encontraba en 1.019 MW, inferior a la generación desconectada. El sistema no tenía margen de seguridad suficiente.' },
    ],
    findings: [
      { icon: '⏱', text: '22,5 s: intervención humana imposible, solo la prevención estructural puede evitarlo', type: 'warning' },
      { icon: '🔴', text: 'UFLS activado a 49,5 Hz (2.000 MW) agravó el colapso de tensión al eliminar sumideros reactivos', type: 'warning' },
      { icon: '🌍', text: 'Separación transpirenaica a 12:33:21 evitó la propagación al sistema europeo continental', type: 'conclusion' },
    ],
    divergenceScore: 7,
  },
  {
    id: 4,
    title: 'Gestión de Emergencia',
    subtitle: 'Black Start y reposición del suministro',
    pages: 'pp. 26–36',
    color: '#a78bfa',
    icon: '🔧',
    abstract: 'La reposición siguió el P.O. 1.6 con fragmentación topológica en islas eléctricas. Estrategia dual Top-Down (desde Francia e interconexión con Marruecos) y Bottom-Up (arranque autónomo hidroeléctrico). La inyección de tensión desde el sur marroquí proporcionó la referencia necesaria para los Black Start de ciclos combinados andaluces. Coordinación con los Centros de Coordinación Regional (RCC). REE solicitó a las 12:26 CEST grupos convencionales en la zona sur: tiempo mínimo ofertado, 1,5 horas.',
    keyData: [
      { label: 'Tiempo mínimo grupos síncronos', value: '1,5', unit: 'h (solicitados 12:26)' },
      { label: 'Soporte marroquí inicio reposición', value: '314', unit: 'MW' },
      { label: 'Bombeo deslastrado (escalón 1)', value: '~2.000', unit: 'MW a 49,5 Hz' },
      { label: 'Bombeo deslastrado (escalón 2)', value: '588', unit: 'MW a 49,3 Hz' },
      { label: 'Industrial/distribución deslastrado', value: '~1.402', unit: 'MW a 49,0 Hz' },
      { label: 'Pérdida Marruecos (subfrecuencia)', value: '314', unit: 'MW' },
    ],
    citations: [
      { source: 'REE', color: '#ef4444', text: 'La inyección de tensión importada desde el sur proporcionó la referencia necesaria para iniciar las estrategias de Black Start de los ciclos combinados de Andalucía.' },
      { source: 'Gobierno', color: '#8b5cf6', text: 'El UFLS, mecanismo universal para restaurar la frecuencia, elevó la tensión al eliminar carga, agravando el problema de control de tensión que ya existía en el sistema.' },
    ],
    findings: [
      { icon: '🔋', text: 'BESS-GFM: único recurso capaz de Black Start distribuido sin dependencia de tensión externa', type: 'conclusion' },
      { icon: '⚡', text: 'Paradoja UFLS: mecanismo de defensa de frecuencia resultó contraproducente ante colapso capacitivo', type: 'consensus' },
      { icon: '🤝', text: 'Coordinación RCC-ENTSO-E eficaz para evitar propagación; insuficiente para prevención', type: 'conclusion' },
    ],
    divergenceScore: 2,
  },
  {
    id: 5,
    title: 'Análisis Comparativo',
    subtitle: 'Cuatro narrativas institucionales: consensos y fracturas',
    pages: 'pp. 37–55',
    color: '#f97316',
    icon: '⚖',
    abstract: 'Núcleo analítico del TFG. Las cuatro visiones institucionales convergen en 7 puntos técnicos y divergen irreconciliablemente en 5 ejes. Tres fracturas de gobernanza: operativa (causalidad vs. responsabilidad), regulatoria (normativa del s. XX en red del s. XXI), y sistémica (criterio N-1 estático en red dinámica). Conclusión de segundo orden: el 28 de abril marca el fin de la viabilidad del modelo de despacho centralizado en sistemas con alta penetración de electrónica de potencia.',
    keyData: [
      { label: 'Puntos de consenso técnico', value: '7', unit: 'verificados' },
      { label: 'Ejes de divergencia irreconciliable', value: '5', unit: 'sistematizados' },
      { label: 'Capacidad absorción reactiva zona sur', value: '0,2', unit: 'GVAr disponible' },
      { label: 'Inyección capacitiva (ICAI)', value: '>0,7', unit: 'GVAr por mallado' },
      { label: 'Contracción margen Q-V Carmona', value: '57', unit: '%' },
      { label: 'Tensión secundario Granada (disparo)', value: '244,32', unit: 'kV (>110% Vn)' },
    ],
    citations: [
      { source: 'ICAI/AELEC', color: '#f97316', text: 'El desbalance era matemáticamente insalvable: 0,2 GVAr de absorción frente a >0,7 GVAr de inyección capacitiva inducida por las propias maniobras del operador.' },
      { source: 'ENTSO-E', color: '#0ea5e9', text: 'El colapso del 28 de abril no se debió a un exceso de generación renovable ni a una escasez inercial primaria, sino a una incapacidad estructural para controlar los perfiles de tensión.' },
      { source: 'Gobierno/REE', color: '#ef4444', text: 'Si todos los agentes hubieran cumplido la normativa vigente en su punto de conexión, el sistema habría absorbido el transitorio. El apagón fue un fallo del parque generador privado.' },
    ],
    findings: [
      { icon: '✅', text: 'CONSENSO: La inercia (H=2,3 s) no fue la causa raíz; fue un colapso por inestabilidad capacitiva', type: 'consensus' },
      { icon: '✅', text: 'CONSENSO: El P.O. 7.4 y RD 413/2014 impedían a los IBR controlar tensión dinámicamente', type: 'consensus' },
      { icon: '⚡', text: 'DIVERGENCIA: Causa raíz — ¿error del operador (mallado) o incumplimiento de generadores?', type: 'divergence' },
      { icon: '⚡', text: 'DIVERGENCIA: Disparos en cascada — ¿inadecuados (REE) o normativamente correctos (ICAI)?', type: 'divergence' },
      { icon: '⚡', text: 'DIVERGENCIA: Naturaleza oscilación 0,6 Hz — ¿forzada por planta FV (REE) o natural interárea (ICAI)?', type: 'divergence' },
    ],
    divergenceScore: 10,
  },
  {
    id: 6,
    title: 'Impacto Socio-Comunicativo',
    subtitle: 'Prensa, redes sociales y gestión del vacío informativo',
    pages: 'pp. 56–64',
    color: '#ec4899',
    icon: '📡',
    abstract: 'Crisis communication failure: primera comparecencia gubernamental a las 18:00 CEST (+5h). El vacío fue ocupado por infodemia (hipótesis de ciberataques rusos, experimentos, sabotaje). La cobertura mediática polarizó el debate en marcos interpretativos preexistentes. Ningún medio ofreció una representación íntegra de la multicausalidad pericial. Consecuencia estructural: la distancia entre el consenso técnico y la narrativa mediática bloquea el consenso político necesario para las reformas regulatorias.',
    keyData: [
      { label: 'Retraso comparecencia oficial', value: '+5', unit: 'horas' },
      { label: 'Inercia en titulares (ABC)', value: '"falta de nuclear"', unit: '— refutado por informes' },
      { label: 'Inercia real certificada', value: '2,3', unit: 's (sobre umbral 2,0 s)' },
      { label: 'Causa según FT', value: '"solar dependency"', unit: '— desmentido por consenso técnico' },
    ],
    citations: [
      { source: 'ABC', color: '#64748b', text: '"La falta de energía nuclear y el boom renovable fulminaron la red." [Entra en contradicción directa con el consenso técnico: H=2,3 s, sobre el umbral recomendado.]' },
      { source: 'ENTSO-E', color: '#0ea5e9', text: 'El incidente no se debió a un exceso de generación renovable per se, sino a la obsolescencia de los códigos de red que impedían a los IBR participar en el control de tensión.' },
      { source: 'Financial Times', color: '#64748b', text: '"Spain and Portugal blackout blamed on solar power dependency." [Entra en contradicción con el consenso técnico: el sistema contaba con reservas operativas sólidas y cuatro reactores nucleares.]' },
    ],
    findings: [
      { icon: '📰', text: 'Framing mediático: reducción de fenómeno multicausal a ecuación "más renovables = apagón"', type: 'warning' },
      { icon: '🐦', text: 'Emergent norm theory: humor y normalización pragmática como reguladores emocionales colectivos', type: 'conclusion' },
      { icon: '⚠', text: 'La gestión mediática de la crisis actúa como obstáculo real para la respuesta regulatoria necesaria', type: 'warning' },
    ],
    divergenceScore: 1,
  },
  {
    id: 7,
    title: 'Resiliencia y Futuro de la Red',
    subtitle: 'Tecnologías habilitadoras y reforma normativa',
    pages: 'pp. 65–73',
    color: '#22c55e',
    icon: '🔬',
    abstract: 'Tres líneas de actuación complementarias: (1) reformulación de códigos de red para exigir Grid-Forming en IBR ≥1 MW (propuesta ENTSO-E NC RfG 2.0); (2) mercados de servicios ancilares que remuneren inercia sintética, POD y potencia de cortocircuito; (3) despliegue de compensadores síncronos, STATCOM y reactancias de regulación continua. La lección central: la transición no puede ser solo sustitución tecnológica de la generación sin sustitución paralela de las funciones sistémicas que la generación síncrona proveía.',
    keyData: [
      { label: 'Umbral Grid-Forming propuesto', value: '≥1', unit: 'MW (NC RfG 2.0)' },
      { label: 'Tiempo respuesta GFM vs GFL', value: '<ms', unit: 'vs. segundos' },
      { label: 'Tensión PCC disparo Granada', value: '244,32', unit: 'kV (Tap-Lag invisible)' },
      { label: 'BESS-GFM: capacidad Black Start', value: '✓', unit: 'sin tensión externa' },
    ],
    citations: [
      { source: 'ENTSO-E', color: '#0ea5e9', text: 'El paradigma Grid-Following ha agotado su viabilidad técnica en sistemas con alta penetración IBR. El NC RfG 2.0 impondrá grid-forming obligatorio para todos los módulos ≥1 MW.' },
      { source: 'FutuRed', color: '#22c55e', text: 'La inercia física, la fortaleza de red y el control dinámico de tensión han dejado de ser externalidades positivas para convertirse en atributos cuya provisión debe ser explícitamente remunerada.' },
      { source: 'Gobierno', color: '#8b5cf6', text: 'La propuesta de actualización del P.O. 7.4 llevaba años paralizada en aprobación regulatoria. El apagón del 28 de abril es el coste medible de una demora regulatoria.' },
    ],
    findings: [
      { icon: '🔋', text: 'BESS-GFM: fuente de tensión ideal detrás de impedancia interna, sin PLL externo', type: 'conclusion' },
      { icon: '⚙', text: 'Compensadores síncronos: inercia física sin emisiones para nudos críticos de 400 kV', type: 'conclusion' },
      { icon: '📋', text: 'NC RfG 2.0: inversores como "fuentes de tensión ideales" con inercia sintética obligatoria', type: 'conclusion' },
    ],
    divergenceScore: 3,
  },
  {
    id: 8,
    title: 'IA en el TFG',
    subtitle: 'Aplicación metodológica y validación crítica',
    pages: 'pp. 74–77',
    color: '#8b5cf6',
    icon: '🤖',
    abstract: 'Uso de LLMs como herramienta de asistencia documental para clasificar y sintetizar >170 GB de registros técnicos. Limitaciones documentadas: los modelos presentan restricciones ante fenómenos de dinámica rápida (Paradoja UFLS, Tap-Lag). La comparación técnica, la evaluación de causalidad y las conclusiones son responsabilidad exclusiva del criterio del autor. Se incluye tabla de alucinaciones detectadas y correcciones físicas aplicadas.',
    keyData: [
      { label: 'Alucinaciones documentadas', value: 'tabla', unit: '(Tabla 8.1)' },
      { label: 'Alcance IA', value: 'clasificación', unit: 'y síntesis documental' },
      { label: 'Validación técnica', value: 'autor', unit: 'exclusivamente' },
    ],
    citations: [
      { source: 'TFG (autor)', color: '#8b5cf6', text: 'Los modelos de lenguaje presentan limitaciones conocidas ante fenómenos de dinámica rápida —la interpretación de la Paradoja del UFLS o el mecanismo del Tap-Lag— por lo que la comparación técnica y las conclusiones son responsabilidad exclusiva del criterio del autor.' },
    ],
    findings: [
      { icon: '🤖', text: 'IA como herramienta de síntesis: válida para organización, inválida para causalidad técnica', type: 'warning' },
      { icon: '✅', text: 'Bucle de validación física: todo output de IA contrastado con fuentes primarias y normativa', type: 'conclusion' },
    ],
    divergenceScore: 0,
  },
  {
    id: 9,
    title: 'Conclusiones',
    subtitle: 'Síntesis comparativa y reflexión sobre la transición energética',
    pages: 'pp. 78–81',
    color: '#06b6d4',
    icon: '🏁',
    abstract: 'El apagón del 28 de abril no fue un "Cisne Negro" imprevisible ni el fracaso de una tecnología concreta, sino la manifestación convergente de tres fracturas de gobernanza: operativa, regulatoria y sistémica. El evento marca el fin de la viabilidad del modelo de despacho centralizado en sistemas con alta penetración de electrónica de potencia. El trilema estructural de la transición energética exige alinear sostenibilidad, asequibilidad y seguridad de suministro mediante una nueva arquitectura de control distribuido en tiempo real.',
    keyData: [
      { label: 'Fracturas de gobernanza identificadas', value: '3', unit: 'operativa / regulatoria / sistémica' },
      { label: 'Demora P.O. 7.4 (coste medible)', value: 'años', unit: 'de tramitación' },
      { label: 'Tiempo colapso total (s → 0V)', value: '<90', unit: 's' },
      { label: 'Horizonte temporal intervención humana', value: '0', unit: 's (imposible)' },
    ],
    citations: [
      { source: 'TFG (autor)', color: '#06b6d4', text: 'El 28 de abril de 2025 es el evento que marca el fin de la viabilidad operativa del modelo de despacho centralizado en sistemas con alta penetración de electrónica de potencia.' },
      { source: 'TFG (autor)', color: '#06b6d4', text: 'El verdadero consenso tácito entre las partes, que ningún informe enuncia explícitamente, es que la arquitectura de monitorización del sistema era insuficiente para gestionar el incidente en tiempo real o resolverlo unívocamente a posteriori.' },
    ],
    findings: [
      { icon: '🔴', text: 'Fractura operativa: causalidad vs. responsabilidad — jurídicamente irresolubles sin más PMUs', type: 'divergence' },
      { icon: '🟡', text: 'Fractura regulatoria: normativa del siglo XX para una red del siglo XXI', type: 'warning' },
      { icon: '🔵', text: 'Fractura sistémica: herramientas N-1 estáticas incompatibles con dinámica de electrónica de potencia', type: 'warning' },
      { icon: '✅', text: 'La única respuesta viable: prevención estructural con análisis de seguridad dinámica en tiempo real', type: 'consensus' },
    ],
    divergenceScore: 8,
  },
];

function DivergenceBar({ score }: { score: number }) {
  const color =
    score >= 8 ? RED
    : score >= 5 ? ORANGE
    : score >= 3 ? YELLOW
    : GREEN;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: MUTED, minWidth: 80 }}>
        Divergencia
      </span>
      <div style={{ flex: 1, height: 4, background: '#1e293b', borderRadius: 2 }}>
        <div style={{
          width: `${score * 10}%`, height: '100%',
          background: color, borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color, minWidth: 20 }}>
        {score}/10
      </span>
    </div>
  );
}

function FindingBadge({ finding }: { finding: Finding }) {
  const colors = {
    consensus:   { bg: '#052e16', border: '#16a34a', text: '#4ade80' },
    divergence:  { bg: '#450a0a', border: '#dc2626', text: '#f87171' },
    conclusion:  { bg: '#082f49', border: '#0284c7', text: '#38bdf8' },
    warning:     { bg: '#422006', border: '#d97706', text: '#fbbf24' },
  };
  const c = colors[finding.type];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '8px 12px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`,
      marginBottom: 6,
    }}>
      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{finding.icon}</span>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11, color: c.text, lineHeight: 1.5,
      }}>
        {finding.text}
      </span>
    </div>
  );
}

function CitationCard({ citation }: { citation: Citation }) {
  return (
    <div style={{
      borderLeft: `3px solid ${citation.color}`,
      padding: '10px 14px', marginBottom: 8,
      background: '#0a0e1a', borderRadius: '0 4px 4px 0',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10, color: citation.color,
        marginBottom: 4, letterSpacing: '0.1em',
      }}>
        [{citation.source}]
      </div>
      <div style={{
        fontSize: 12, color: MUTED, lineHeight: 1.6,
        fontStyle: 'italic',
      }}>
        "{citation.text}"
      </div>
    </div>
  );
}

export default function ChapterDossier() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'findings'|'citations'|'data'>('findings');

  const expanded = CHAPTERS.find(c => c.id === expandedId) ?? null;

  return (
    <div style={{
      background: '#0a0e1a', minHeight: '100vh',
      padding: '24px', fontFamily: 'Inter, sans-serif', color: TEXT,
    }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: MONO, fontSize: 18, letterSpacing: '0.1em', marginBottom: 4,
        }}>
          📚 DOSSIER TÉCNICO — TFG BLACKOUT 2025
        </h2>
        <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>
          Análisis del Apagón del 28 de Abril · Alfonso Monge Díaz-Ángel · Universidad de Sevilla · 2026
        </p>
      </div>

      {/* Grid de capítulos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12, marginBottom: 24,
      }}>
        {CHAPTERS.map(ch => (
          <div
            key={ch.id}
            onClick={() => setExpandedId(expandedId === ch.id ? null : ch.id)}
            style={{
              background: PANEL,
              border: `1px solid ${expandedId === ch.id ? ch.color : BORDER}`,
              borderRadius: 6, padding: 16, cursor: 'pointer',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: expandedId === ch.id ? `0 0 0 1px ${ch.color}22` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 4,
                background: `${ch.color}22`,
                border: `1px solid ${ch.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>
                {ch.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10, color: ch.color,
                  letterSpacing: '0.1em', marginBottom: 2,
                }}>
                  CAP. {ch.id} · {ch.pages}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: TEXT,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {ch.title}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 12, lineHeight: 1.4 }}>
              {ch.subtitle}
            </div>
            <DivergenceBar score={ch.divergenceScore} />
            <div style={{
              display: 'flex', justifyContent: 'flex-end', marginTop: 8,
            }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, color: expandedId === ch.id ? ch.color : DIM,
              }}>
                {expandedId === ch.id ? '▲ CERRAR' : '▼ EXPANDIR'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Panel de detalle expandido */}
      {expanded && (
        <div style={{
          background: PANEL,
          border: `1px solid ${expanded.color}`,
          borderRadius: 8, padding: 24,
          animation: 'fadeIn 0.2s ease',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 6,
              background: `${expanded.color}22`,
              border: `1px solid ${expanded.color}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>
              {expanded.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11, color: expanded.color,
                letterSpacing: '0.12em', marginBottom: 4,
              }}>
                CAPÍTULO {expanded.id} · {expanded.pages}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: '0 0 4px' }}>
                {expanded.title}
              </h3>
              <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{expanded.subtitle}</p>
            </div>
            <DivergenceBar score={expanded.divergenceScore} />
          </div>

          {/* Abstract */}
          <div style={{
            background: '#0a0e1a',
            border: `1px solid ${BORDER}`,
            borderRadius: 4, padding: 16, marginBottom: 20,
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10, color: MUTED,
              letterSpacing: '0.12em', marginBottom: 8,
            }}>
              ABSTRACT
            </div>
            <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.7, margin: 0 }}>
              {expanded.abstract}
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {(['findings','data','citations'] as const).map(tab => (
              <button
                key={tab}
                onClick={e => { e.stopPropagation(); setActiveTab(tab); }}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11, padding: '6px 14px',
                  background: activeTab === tab ? `${expanded.color}22` : 'transparent',
                  border: `1px solid ${activeTab === tab ? expanded.color : BORDER}`,
                  borderRadius: 4, color: activeTab === tab ? expanded.color : MUTED,
                  cursor: 'pointer', letterSpacing: '0.08em',
                }}
              >
                {tab === 'findings' ? '⚡ HALLAZGOS'
                  : tab === 'data' ? '📊 DATOS CLAVE'
                  : '💬 CITAS FUENTES'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'findings' && (
            <div>
              {expanded.findings.map((f, i) => <FindingBadge key={i} finding={f} />)}
            </div>
          )}

          {activeTab === 'data' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 8,
            }}>
              {expanded.keyData.map((d, i) => (
                <div key={i} style={{
                  background: '#0a0e1a',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4, padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{d.label}</div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 20, fontWeight: 700, color: MONO,
                  }}>
                    {d.value}
                  </div>
                  {d.unit && (
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10, color: DIM, marginTop: 2,
                    }}>
                      {d.unit}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'citations' && (
            <div>
              {expanded.citations.map((c, i) => <CitationCard key={i} citation={c} />)}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export { CHAPTERS };
