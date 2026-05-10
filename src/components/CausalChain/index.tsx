import React, { useState } from 'react';
import TechnicalImage from '../TechnicalImage';

interface CausalNode {
  id: string;
  label: string;
  level: number;
  type: 'precondition' | 'gov' | 'icai' | 'entso' | 'failure' | 'cascade' | 'result';
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const NODES: CausalNode[] = [
  // NIVEL 1 — CONDICIONES PREVIAS
  {
    id: 'n1a',
    label: '82% penetración IBR',
    level: 1,
    type: 'precondition',
    description: 'Nivel histórico de generación basada en inversores (fotovoltaica y eólica) que redujo críticamente la inercia síncrona natural del sistema peninsular.',
    x: 80, y: 40, w: 210, h: 55
  },
  {
    id: 'n1b',
    label: 'Demanda valle 25.184 MW',
    level: 1,
    type: 'precondition',
    description: 'Bajo consumo en la red en horas centrales del día, lo que acentuó la sobretensión capacitiva debido a la baja carga de los corredores de transporte.',
    x: 345, y: 40, w: 210, h: 55
  },
  {
    id: 'n1c',
    label: 'Isla energética 7,9%',
    level: 1,
    type: 'precondition',
    description: 'Baja capacidad de interconexión con el resto de Europa continental, limitando el amortiguamiento de transitorios rápidos desde el exterior.',
    x: 610, y: 40, w: 210, h: 55
  },

  // NIVEL 2 — FACTORES OPERATIVOS
  {
    id: 'n2a',
    label: 'Incumplimiento P.O. 7.4',
    level: 2,
    type: 'gov',
    description: 'Según REE, múltiples parques de generación no cumplieron con la obligación normativa de absorber reactiva capacitiva para equilibrar el perfil de tensiones.',
    x: 80, y: 160, w: 210, h: 55
  },
  {
    id: 'n2b',
    label: 'Maniobra de mallado REE',
    level: 2,
    type: 'icai',
    description: 'Según ICAI, el mallado de 11 líneas en vacío inyectó más de 1,05 GVAr de reactiva capacitiva, sobrecargando los márgenes dinámicos del nudo SE Carmona.',
    x: 345, y: 160, w: 210, h: 55
  },
  {
    id: 'n2c',
    label: 'Restricción FP fija IBR',
    level: 2,
    type: 'entso',
    description: 'Según ENTSO-E, la normativa obsoleta impidió a las plantas renovables regular tensión de forma dinámica, forzándolas a operar con un factor de potencia fijo.',
    x: 610, y: 160, w: 210, h: 55
  },

  // NIVEL 3 — MECANISMO DE FALLO
  {
    id: 'n3a',
    label: 'Contracción Q-V Carmona',
    level: 3,
    type: 'failure',
    description: 'Pérdida drástica del 57% del margen de estabilidad de tensión en el epicentro de la red de transporte sur, dejando el sistema vulnerable a cualquier transitorio.',
    x: 210, y: 280, w: 220, h: 55
  },
  {
    id: 'n3b',
    label: 'Punto Ciego Tap-Lag',
    level: 3,
    type: 'failure',
    description: 'Retraso de los reguladores OLTC de distribución que enmascaró una sobretensión real de 244 kV en colectores (220 kV) mientras el SCADA de REE leía 418 kV (400 kV).',
    x: 470, y: 280, w: 220, h: 55
  },

  // NIVEL 4 — CASCADA
  {
    id: 'n4a',
    label: 'Disparo raíz Granada',
    level: 4,
    type: 'cascade',
    description: 'Desacoplamiento automático del parque de Granada al rebasar el umbral normativo de sobretensión en su punto de conexión colectora.',
    x: 80, y: 400, w: 210, h: 55
  },
  {
    id: 'n4b',
    label: 'Pérdida 2.000 MW RCR',
    level: 4,
    type: 'cascade',
    description: 'Efecto dominó ultrarrápido (22,5 s) de disparos automáticos por sobretensión en inversores de generación distribuida desprovistos de capacidad de soporte de tensión.',
    x: 345, y: 400, w: 210, h: 55
  },
  {
    id: 'n4c',
    label: 'Paradoja de defensa UFLS',
    level: 4,
    type: 'cascade',
    description: 'El deslastre automático por baja frecuencia eliminó demandas de carácter inductivo, acelerando la sobretensión capacitiva descontrolada en lugar de estabilizar el sistema.',
    x: 610, y: 400, w: 210, h: 55
  },

  // NIVEL 5 — RESULTADO
  {
    id: 'n5',
    label: 'Cero de Tensión Peninsular (12:33:30 CEST)',
    level: 5,
    type: 'result',
    description: 'Colapso final de tensión y frecuencia. Desacoplo automático transpirenaico de salvaguarda y cero de tensión que afectó a cerca de 60 millones de personas en España y Portugal.',
    x: 250, y: 520, w: 400, h: 60
  }
];

export const CausalChain: React.FC = () => {
  const [activeNode, setActiveNode] = useState<CausalNode | null>(NODES.find(n => n.id === 'n5') || null);

  const getNodeColorClass = (type: CausalNode['type'], isActive: boolean) => {
    if (isActive) {
      switch (type) {
        case 'precondition': return 'fill-secondary stroke-text-secondary stroke-[2.5]';
        case 'gov': return 'fill-alert-red/10 stroke-alert-red stroke-[2.5]';
        case 'icai': return 'fill-alert-orange/10 stroke-alert-orange stroke-[2.5]';
        case 'entso': return 'fill-accent/10 stroke-accent stroke-[2.5]';
        case 'failure': return 'fill-alert-orange/10 stroke-alert-orange stroke-[2.5]';
        case 'cascade': return 'fill-tertiary stroke-text-primary stroke-[2.5]';
        case 'result': return 'fill-alert-red/15 stroke-alert-red stroke-[3]';
      }
    }
    switch (type) {
      case 'precondition': return 'fill-tertiary/60 stroke-main hover:stroke-text-secondary';
      case 'gov': return 'fill-tertiary/40 stroke-alert-red/60 hover:stroke-alert-red';
      case 'icai': return 'fill-tertiary/40 stroke-alert-orange/60 hover:stroke-alert-orange';
      case 'entso': return 'fill-tertiary/40 stroke-accent/60 hover:stroke-accent';
      case 'failure': return 'fill-tertiary/50 stroke-alert-orange/70 hover:stroke-alert-orange';
      case 'cascade': return 'fill-tertiary/40 stroke-main hover:stroke-text-primary';
      case 'result': return 'fill-alert-red/5 stroke-alert-red/50 hover:stroke-alert-red hover:stroke-[2]';
    }
  };

  const getNodeLabelClass = (type: CausalNode['type'], isActive: boolean) => {
    if (isActive) {
      switch (type) {
        case 'gov': return 'fill-alert-red font-bold';
        case 'icai': return 'fill-alert-orange font-bold';
        case 'entso': return 'fill-accent font-bold';
        case 'result': return 'fill-alert-red font-black';
        default: return 'fill-text-primary font-bold';
      }
    }
    switch (type) {
      case 'gov': return 'fill-alert-red/80';
      case 'icai': return 'fill-alert-orange/80';
      case 'entso': return 'fill-accent/80';
      case 'result': return 'fill-alert-red/80 font-bold';
      default: return 'fill-text-secondary';
    }
  };

  return (
    <div className="flex-grow p-1 animate-fade-in flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="border-b border-main pb-4 mb-2">
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
          Cadena Causal de Fractura del Sistema
        </h2>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Visualización de Flujo Forense · Triangulación de Vías Operativas, Técnicas y Regulatorias
        </p>
      </div>

      {/* Narrative Intro */}
      <div className="bg-secondary border border-main p-4.5 rounded-lg text-xs leading-relaxed max-w-4xl">
        <p className="text-text-secondary font-sans">
          Las tres principales instituciones analíticas comparten el diagnóstico de la cascada de fallos, pero discrepan significativamente sobre el <strong className="text-text-primary">primer eslabón</strong> de la cadena causal. Las flechas representan los flujos lógicos postulados por cada uno de los informes de investigación.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* DIAGRAM PANEL */}
        <div className="xl:col-span-3 bg-secondary border border-main rounded-lg p-5 shadow-sm overflow-x-auto">
          <svg
            viewBox="0 0 900 620"
            className="w-full h-auto min-w-[800px] select-none"
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.02))' }}
          >
            {/* DEFINITIONS FOR SVG MARKERS (ARROWHEADS) */}
            <defs>
              <marker id="arrow-gray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border)" />
              </marker>
              <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--alarm)" />
              </marker>
              <marker id="arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--warning)" />
              </marker>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--info)" />
              </marker>
              <marker id="arrow-text" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--text-primary)" />
              </marker>
            </defs>

            {/* LEVEL LABELS */}
            <text x="15" y="70" className="fill-text-secondary/50 font-mono text-[9px] uppercase tracking-widest font-bold">Fase 1: Precondiciones</text>
            <text x="15" y="190" className="fill-text-secondary/50 font-mono text-[9px] uppercase tracking-widest font-bold">Fase 2: Operaciones</text>
            <text x="15" y="310" className="fill-text-secondary/50 font-mono text-[9px] uppercase tracking-widest font-bold">Fase 3: Mecanismo de Fallo</text>
            <text x="15" y="430" className="fill-text-secondary/50 font-mono text-[9px] uppercase tracking-widest font-bold">Fase 4: Cascada Forense</text>
            <text x="15" y="550" className="fill-text-secondary/50 font-mono text-[9px] uppercase tracking-widest font-bold">Fase 5: Colapso Cero</text>

            {/* CAUSAL PATHWAY ARROWS / CONNECTIONS */}
            
            {/* Level 1 -> Level 2 */}
            <path d="M 185 95 L 185 150" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#arrow-gray)" />
            <path d="M 450 95 L 450 150" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#arrow-gray)" />
            <path d="M 715 95 L 715 150" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#arrow-gray)" />

            {/* Level 2 GOV (2A) -> Level 3 Fail (3A) */}
            <path d="M 185 215 C 185 245, 320 250, 320 273" fill="none" stroke="var(--alarm)" strokeWidth="2" markerEnd="url(#arrow-red)" />
            
            {/* Level 2 ICAI (2B) -> Level 3 Fail (3A, 3B) */}
            <path d="M 450 215 L 320 273" fill="none" stroke="var(--warning)" strokeWidth="2" markerEnd="url(#arrow-orange)" />
            <path d="M 450 215 L 580 273" fill="none" stroke="var(--warning)" strokeWidth="2" markerEnd="url(#arrow-orange)" />

            {/* Level 2 ENTSO (2C) -> Level 3 Fail (3A) */}
            <path d="M 715 215 C 715 245, 320 250, 320 273" fill="none" stroke="var(--info)" strokeWidth="2" markerEnd="url(#arrow-blue)" />

            {/* Level 3 Fail -> Level 4 Cascade */}
            {/* 3A -> 4A, 4B */}
            <path d="M 320 335 L 185 393" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" markerEnd="url(#arrow-text)" />
            <path d="M 320 335 L 450 393" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" markerEnd="url(#arrow-text)" />
            
            {/* 3B -> 4A (Tap Lag -> Granada Root Trip) */}
            <path d="M 580 335 L 185 393" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" markerEnd="url(#arrow-text)" />

            {/* Level 4 Cascade -> Level 5 Result */}
            {/* 4A -> 4B -> 4C -> 5 */}
            <path d="M 185 455 C 185 490, 450 490, 450 513" fill="none" stroke="var(--text-primary)" strokeWidth="2" markerEnd="url(#arrow-text)" />
            <path d="M 450 455 L 450 513" fill="none" stroke="var(--text-primary)" strokeWidth="2" markerEnd="url(#arrow-text)" />
            <path d="M 715 455 C 715 490, 450 490, 450 513" fill="none" stroke="var(--text-primary)" strokeWidth="2" markerEnd="url(#arrow-text)" />

            {/* DRAW INTERACTIVE NODES */}
            {NODES.map(node => {
              const isActive = activeNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onClick={() => setActiveNode(node)}
                >
                  {/* Outer border/shadow on active */}
                  {isActive && (
                    <rect
                      x="-3"
                      y="-3"
                      width={node.w + 6}
                      height={node.h + 6}
                      rx="8"
                      className="fill-transparent stroke-accent/40 stroke-[2] animate-pulse"
                    />
                  )}
                  {/* Main Rectangle */}
                  <rect
                    x="0"
                    y="0"
                    width={node.w}
                    height={node.h}
                    rx="6"
                    className={`transition-all duration-150 ${getNodeColorClass(node.type, isActive)}`}
                  />
                  {/* Label Text */}
                  <text
                    x={node.w / 2}
                    y={node.h / 2 + 4}
                    textAnchor="middle"
                    className={`font-mono text-[10px] uppercase tracking-wider ${getNodeLabelClass(node.type, isActive)}`}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* SVG Legend */}
          <div className="border-t border-main pt-4 mt-2 flex flex-wrap gap-x-6 gap-y-2 justify-center font-mono text-[9px] uppercase tracking-wider text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-alert-red block"></span>
              <span>Hipótesis GOV/REE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-alert-orange block"></span>
              <span>Hipótesis ICAI/AELEC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-accent block"></span>
              <span>Hipótesis ENTSO-E</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-text-primary block"></span>
              <span>Dinámica de Consenso</span>
            </div>
          </div>
        </div>

        {/* DETAILS COLUMN (Side-sheet & HVDC Image) */}
        <div className="flex flex-col gap-6">
          
          {/* DETAILS SIDE-SHEET */}
          <div className="bg-secondary border border-main rounded-lg p-5 shadow-sm space-y-4">
            <div className="border-b border-main pb-2.5">
              <span className="text-[9px] font-mono uppercase tracking-widest text-text-secondary block">
                Ficha de Detalle Causal
              </span>
              <h4 className="font-serif text-sm font-bold text-text-primary mt-0.5">
                Análisis Técnico del Eslabón
              </h4>
            </div>

            {activeNode ? (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <span className="text-[8px] font-mono text-text-secondary uppercase block">Fase de la Crisis</span>
                  <span className="text-xs font-mono font-bold text-accent tracking-wider uppercase mt-0.5 block">
                    FASE {activeNode.level} · {
                      activeNode.level === 1 ? 'PRECONDICIONES' :
                      activeNode.level === 2 ? 'OPERACIONES' :
                      activeNode.level === 3 ? 'MECANISMO DE FALLO' :
                      activeNode.level === 4 ? 'CASCADA FORENSE' : 'RESULTADO FINAL'
                    }
                  </span>
                </div>

                <div>
                  <span className="text-[8px] font-mono text-text-secondary uppercase block">Concepto</span>
                  <span className="text-sm font-serif font-black text-text-primary mt-1 block leading-tight">
                    {activeNode.label}
                  </span>
                </div>

                <div className="border-t border-main/50 pt-3">
                  <span className="text-[8px] font-mono text-text-secondary uppercase block mb-1">Descripción Forense</span>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans select-text">
                    {activeNode.description}
                  </p>
                </div>

                {activeNode.type === 'gov' && (
                  <div className="bg-alert-red/5 border border-alert-red/20 p-3 rounded-lg text-[11px] font-mono text-alert-red leading-normal">
                    📌 Causalidad postulada por la Administración Pública y el Operador del Sistema REE como origen decisivo.
                  </div>
                )}
                {activeNode.type === 'icai' && (
                  <div className="bg-alert-orange/5 border border-alert-orange/20 p-3 rounded-lg text-[11px] font-mono text-alert-orange leading-normal">
                    📌 Causalidad postulada por el peritaje independiente de ICAI como fallo decisivo de planificación.
                  </div>
                )}
                {activeNode.type === 'entso' && (
                  <div className="bg-accent/5 border border-accent/20 p-3 rounded-lg text-[11px] font-mono text-accent leading-normal">
                    📌 Causalidad atribuida por ENTSO-E como limitación de índole regulatoria y de gobernanza europea.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-text-secondary text-xs">
                Haga clic sobre cualquier nodo del grafo para desplegar su descripción forense.
              </div>
            )}
          </div>

          {/* HVDC Connection Technical Image */}
          <TechnicalImage
            src="/images/enlace-hvdc.png"
            alt="Esquema del enlace HVDC INELFE"
            caption="Figura III.4: Esquema técnico del lazo convertidor VSC del enlace de corriente continua transpirenaico (INELFE)."
            source="Fuente: Especificaciones Técnicas de Interconexión ENTSO-E"
          />

        </div>

      </div>
    </div>
  );
};

export default CausalChain;
