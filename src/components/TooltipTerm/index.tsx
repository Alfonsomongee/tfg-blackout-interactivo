import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface TermDefinition {
  term: string;
  definition: string;
  chapter: string;
  searchQuery: string;
}

const TOOLTIP_DICTIONARY: Record<string, TermDefinition> = {
  "Tap-Lag": {
    term: "TAP-LAG",
    definition: "Mecánica lenta de Cambiadores de Tomas en Carga (OLTC) que retrasa la regulación de tensión.",
    chapter: "Capítulo 5.4 · Regulación de Tensión",
    searchQuery: "Tap-Lag"
  },
  "Fase 0": {
    term: "FASE 0",
    definition: "Estado previo al colapso caracterizado por baja inercia y alta penetración de inversores (82%).",
    chapter: "Capítulo 4.1 · Puntos de Operación",
    searchQuery: "Constante H"
  },
  "Oscilación interárea": {
    term: "OSCILACIÓN INTERÁREA",
    definition: "Oscilación de baja frecuencia (0.63 Hz) de potencia activa entre áreas del sistema interconectado.",
    chapter: "Capítulo 3.2 · Dinámica Interárea",
    searchQuery: "HVDC INELFE-1"
  },
  "Q-V": {
    term: "Q-V",
    definition: "Estabilidad de tensión que relaciona la potencia reactiva (Q) con la tensión nodal (V).",
    chapter: "Capítulo 5.1 · Curvas Q-V",
    searchQuery: "Curvas Q-V"
  },
  "Margen Q-V": {
    term: "MARGEN Q-V",
    definition: "Reserva neta de potencia reactiva disponible antes de alcanzar el punto de colapso de tensión.",
    chapter: "Capítulo 5.2 · Margen de Reactiva",
    searchQuery: "Curvas Q-V"
  },
  "Criterio N-1": {
    term: "CRITERIO N-1",
    definition: "Exigencia regulatoria de seguridad de que la red soporte la pérdida de cualquier elemento simple.",
    chapter: "Capítulo 2.3 · Seguridad de Red",
    searchQuery: "Ssc Cortocircuito"
  },
  "SCADA": {
    term: "SCADA",
    definition: "Sistema de Supervisión, Control y Adquisición de Datos para operación en tiempo real de la red.",
    chapter: "Capítulo 4.3 · Telemetría y Control",
    searchQuery: "Tap-Lag"
  },
  "Inercia Síncrona": {
    term: "INERCIA SÍNCRONA",
    definition: "Energía cinética rotacional almacenada en alternadores que resiste cambios inmediatos de frecuencia.",
    chapter: "Capítulo 3.1 · Respuesta Inercial",
    searchQuery: "Constante H"
  },
  "IBR": {
    term: "IBR",
    definition: "Recursos basados en inversores (Inverter-Based Resources), como solar FV, eólica y baterías.",
    chapter: "Capítulo 6.1 · Dinámica de IBR",
    searchQuery: "IBR"
  },
  "GFM": {
    term: "GFM",
    definition: "Inversores formadores de red (Grid-Forming) que actúan autónomamente como fuentes de tensión.",
    chapter: "Capítulo 6.3 · Grid-Forming",
    searchQuery: "Grid-Forming"
  },
  "HVDC": {
    term: "HVDC",
    definition: "Enlace de Corriente Continua en Alta Tensión para transmisión de potencia con control activo.",
    chapter: "Capítulo 7.2 · Enlaces HVDC",
    searchQuery: "HVDC INELFE-1"
  },
  "Fase 3": {
    term: "FASE 3",
    definition: "Etapa final de colapso y separación del sistema ante la pérdida de sincronismo angular.",
    chapter: "Capítulo 4.4 · Separación del Sistema",
    searchQuery: "Protecciones OST"
  },
  "UFLS": {
    term: "UFLS",
    definition: "Deslastre automático de cargas por subfrecuencia para reequilibrar generación y demanda.",
    chapter: "Capítulo 8.1 · Planes de Defensa",
    searchQuery: "UFLS"
  },
  "Disparo raíz": {
    term: "DISPARO RAÍZ",
    definition: "Perturbación inicial que desencadena la secuencia de eventos del colapso del sistema.",
    chapter: "Capítulo 5.3 · Evento Iniciador",
    searchQuery: "Tap-Lag"
  },
  "Margen de estabilidad": {
    term: "MARGEN DE ESTABILIDAD",
    definition: "Distancia operativa al límite de colapso de frecuencia o tensión del sistema eléctrico.",
    chapter: "Capítulo 2.1 · Límites de Operación",
    searchQuery: "Curvas Q-V"
  },
  "Fase 1": {
    term: "FASE 1",
    definition: "Fase caracterizada por oscilaciones interárea de potencia activa tras la primera perturbación.",
    chapter: "Capítulo 4.2 · Dinámica Oscilatoria",
    searchQuery: "Tap-Lag"
  },
  "Fase 2": {
    term: "FASE 2",
    definition: "Fase de colapso de tensión localizado por déficit crítico de potencia reactiva.",
    chapter: "Capítulo 4.3 · Colapso de Tensión",
    searchQuery: "Tap-Lag"
  }
};

interface TooltipTermProps {
  term: string;
  children: React.ReactNode;
  variant?: 'inline' | 'highlight';
}

export default function TooltipTerm({ term, children, variant = 'inline' }: TooltipTermProps) {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const [leftOffset, setLeftOffset] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const def = TOOLTIP_DICTIONARY[term] || {
    term: term.toUpperCase(),
    definition: `Término técnico relacionado con el TFG Blackout 2025.`,
    chapter: "Glosario General del TFG",
    searchQuery: term
  };

  useEffect(() => {
    if (visible && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Determine vertical placement (top or bottom)
      if (containerRect.top < tooltipRect.height + 20) {
        setPlacement('bottom');
      } else {
        setPlacement('top');
      }

      // Determine horizontal shift to prevent offscreen clipping
      let offset = 0;
      const tooltipCenter = containerRect.left + containerRect.width / 2;
      const halfTooltipWidth = tooltipRect.width / 2;

      if (tooltipCenter - halfTooltipWidth < 10) {
        // Too close to left edge
        offset = 10 - (tooltipCenter - halfTooltipWidth);
      } else if (tooltipCenter + halfTooltipWidth > viewportWidth - 10) {
        // Too close to right edge
        offset = (viewportWidth - 10) - (tooltipCenter + halfTooltipWidth);
      }
      setLeftOffset(offset);
    }
  }, [visible]);

  const handleMouseEnter = () => setVisible(true);
  const handleMouseLeave = () => setVisible(false);
  const handleFocus = () => setVisible(true);
  const handleBlur = () => setVisible(false);

  const inlineStyles = {
    trigger: {
      cursor: 'help',
      borderBottom: '1px dashed var(--accent)',
      color: variant === 'highlight' ? 'var(--text-mono)' : 'inherit',
      backgroundColor: variant === 'highlight' ? 'rgba(var(--accent-rgb, 14, 165, 233), 0.1)' : 'transparent',
      padding: variant === 'highlight' ? '1px 4px' : '0',
      borderRadius: variant === 'highlight' ? '2px' : '0',
      transition: 'all 0.2s ease',
    },
    tooltip: {
      position: 'absolute' as const,
      left: '50%',
      transform: `translateX(calc(-50% + ${leftOffset}px))`,
      zIndex: 50,
      width: '210px',
      padding: '0.875rem',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-main)',
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      fontFamily: 'var(--font-sans)',
      textAlign: 'left' as const,
      animation: 'fadeIn 0.2s ease-out forwards',
      pointerEvents: 'auto' as const,
      ...(placement === 'top' 
        ? { bottom: '125%', marginBottom: '6px' } 
        : { top: '125%', marginTop: '6px' }
      )
    },
    arrow: {
      position: 'absolute' as const,
      left: '50%',
      transform: `translateX(calc(-50% - ${leftOffset}px))`,
      width: '0',
      height: '0',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      ...(placement === 'top'
        ? {
            bottom: '-5px',
            borderTop: '5px solid var(--border-main)',
          }
        : {
            top: '-5px',
            borderBottom: '5px solid var(--border-main)',
          }
      )
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
      style={{ whiteSpace: 'normal' }}
    >
      <span
        tabIndex={0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={inlineStyles.trigger}
        className="hover:text-accent"
      >
        {children}
      </span>

      {visible && (
        <div
          ref={tooltipRef}
          style={inlineStyles.tooltip}
          className="bg-secondary border border-main text-text-primary z-50 animate-fade-in"
          onMouseEnter={handleMouseEnter} // Keep open when hovering the tooltip itself
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          <div style={inlineStyles.arrow} />

          {/* Title */}
          <div className="font-mono text-[10px] font-bold text-text-mono uppercase tracking-wider mb-1">
            {def.term}
          </div>

          {/* Definition */}
          <div className="text-[11px] text-text-secondary leading-relaxed mb-2.5 font-sans">
            {def.definition}
          </div>

          {/* Chapter / Location Metadata */}
          <div className="text-[9px] font-mono font-bold text-text-muted/80 uppercase tracking-tight mb-2">
            {def.chapter}
          </div>

          {/* Divider */}
          <div className="border-t border-main/40 my-2" />

          {/* Link to Lexicon */}
          <Link
            to={`/lexicon?search=${encodeURIComponent(def.searchQuery)}`}
            className="font-mono text-[9px] font-bold text-accent hover:underline flex items-center justify-between"
          >
            <span>VER EN GLOSARIO</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
