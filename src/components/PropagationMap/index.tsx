import React, { useState } from 'react';

// Definitions of timestamps and events
const TIMELINE_EVENTS = [
  {
    t: 0,
    time: '12:00:00 CEST',
    title: 'Operación Síncrona Nominal',
    description: 'La inercia síncrona ibérica opera dentro de márgenes estables. Penetración renovable del 82%. Tensiones de transporte en 401 kV de media.',
    systemStatus: 'nominal',
    mvaLoad: 4200,
  },
  {
    t: 32,
    time: '12:11:00 CEST',
    title: 'HVDC INELFE-1 Fijado en PMODE1',
    description: 'La interconexión de corriente continua entre España y Francia pasa de modo de emulación AC a consigna de exportación constante de 1.000 MW, eliminando su capacidad dinámica de amortiguamiento.',
    systemStatus: 'alert',
    mvaLoad: 5800,
  },
  {
    t: 70,
    time: '12:32:00 CEST',
    title: 'Escalada Linear de Tensión en Colectores',
    description: 'El mallado desbocado introduce una inyección capacitiva de >0,7 GVAr. Las tensiones inician una rampa destructiva que eleva la red de 400 kV a límites de alerta en el nudo de Carmona.',
    systemStatus: 'alert',
    mvaLoad: 8900,
  },
  {
    t: 75,
    time: '12:32:57 CEST',
    title: 'Disparo Raíz en Granada',
    description: 'Las protecciones de máxima tensión desconectan la subestación B de Granada a 244 kV (Tap-Lag invisible). Se inicia el colapso físico de reactiva. Una onda expansiva dinamoeléctrica avanza.',
    systemStatus: 'critical',
    mvaLoad: 11200,
  },
  {
    t: 77,
    time: '12:33:00 CEST',
    title: 'Desconexiones en Cascada (Sur & Centro)',
    description: 'La inestabilidad de tensión se propaga a Carmona y nudos del centro. Los relés UFLS deslastran carga de forma reactiva, agravando la sobretensión lineal ante la falta de sumideros inductivos.',
    systemStatus: 'critical',
    mvaLoad: 14500,
  },
  {
    t: 80,
    time: '12:33:21 CEST',
    title: 'Separación Europea (Relés OST)',
    description: 'Los relés de pérdida de sincronismo (Out-of-Step) disparan los enlaces transpirenaicos en Baixas-Vic, aislando la Península Ibérica para salvar la red continental. Marruecos se desconecta por subfrecuencia.',
    systemStatus: 'separation',
    mvaLoad: 3100,
  },
  {
    t: 100,
    time: '12:34:00 CEST',
    title: 'Cero de Tensión / Blackout Total',
    description: 'Toda la generación asíncrona (IBR) se desconecta debido a inestabilidad del PLL en red débil. Se consuma el blackout ibérico que afecta a ~60 millones de personas en España, Portugal y Marruecos.',
    systemStatus: 'blackout',
    mvaLoad: 0,
  },
];

const PropagationMapContent = function PropagationMap() {
  const [sliderValue, setSliderValue] = useState<number>(0);

  // Find the current active timeline event
  const currentEventIndex = TIMELINE_EVENTS.reduce((acc, current, index) => {
    if (sliderValue >= current.t) {
      return index;
    }
    return acc;
  }, 0);

  const activeEvent = TIMELINE_EVENTS[currentEventIndex];

  // Map state styling helpers
  const isAfterT = (tVal: number) => sliderValue >= tVal;

  // Cálculos dinámicos SCADA para grosor y velocidad de flujo
  const getLineStress = () => {
    if (isAfterT(100)) return { width: 1, color: 'var(--border-main)', dashSpeed: '0s', status: 'Vaciada / Desconectada' };
    if (isAfterT(80)) return { width: 2, color: 'var(--alert-red)', dashSpeed: '0s', status: 'Apertura OST Transfronteriza' };
    if (isAfterT(75)) return { width: 6, color: 'var(--alert-red)', dashSpeed: '0.2s', status: 'Sobrecarga Dinámica MVA Máxima' };
    if (isAfterT(70)) return { width: 4.5, color: 'var(--alert-orange)', dashSpeed: '0.4s', status: 'Alerta de Sobretensión Capacitiva' };
    if (isAfterT(32)) return { width: 3.5, color: 'var(--accent-cyan)', dashSpeed: '0.6s', status: 'Flujo Forzado PMODE1' };
    return { width: 2.5, color: 'var(--alert-green)', dashSpeed: '1.2s', status: 'Flujo Nominal' };
  };

  const stress = getLineStress();

  return (
    <div className="flex-grow flex flex-col justify-between text-text-primary font-sans animate-fade-in w-full">
      
      {/* Header */}
      <div className="border-b border-main pb-4 mb-4 flex justify-between items-start">
        <div>
          <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
            Gemelo Digital SCADA: Propagación Topológica de Flujos
          </h2>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Capítulo III · Diagrama de Inestabilidad de Tensión Dinámica Transpeninsular Ibérica (28-A)
          </p>
        </div>

        {/* Telemetría SCADA flotante */}
        <div className="hidden sm:flex flex-col items-end bg-tertiary border border-main px-4 py-2 rounded-lg font-mono">
          <span className="text-[9px] text-text-secondary uppercase">Estado del Enlace MVA:</span>
          <span className="text-xs font-bold text-accent">{stress.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch flex-grow">
        
        {/* PANEL IZQUIERDO: Slider & Evento */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-secondary border border-main p-5 rounded-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-transparent"></div>
          
          <div>
            <div className="font-mono text-text-mono text-[10px] tracking-widest uppercase font-bold border-b border-main/40 pb-2 mb-4">
              // RECONSTRUCCIÓN CRONOLÓGICA
            </div>

            {/* Slider de tiempo */}
            <div className="space-y-4">
              <div className="flex justify-between items-center font-mono">
                <span className="text-[10px] text-text-secondary uppercase">Línea de Tiempo</span>
                <span className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded animate-pulse">
                  {activeEvent.time}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-1.5 bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent border border-main"
              />

              <div className="flex justify-between text-[9px] font-mono text-text-secondary/70">
                <span>12:00 CEST</span>
                <span>12:15</span>
                <span>12:30</span>
                <span>12:34 CEST</span>
              </div>
            </div>
          </div>

          {/* Caja del evento activo */}
          <div className="flex-grow flex flex-col justify-end pt-6 mt-4 border-t border-main/30">
            <div className="font-mono text-[9px] text-text-secondary uppercase tracking-wider mb-1.5">
              ESTADO OPERATIVO: 
              <span className={`ml-2 font-bold px-1.5 py-0.5 rounded ${
                activeEvent.systemStatus === 'nominal' ? 'bg-alert-green/10 text-alert-green border border-alert-green/20'
                : activeEvent.systemStatus === 'alert' ? 'bg-alert-orange/10 text-alert-orange border border-alert-orange/20 animate-pulse'
                : 'bg-alert-red/10 text-alert-red border border-alert-red/20'
              }`}>
                {activeEvent.systemStatus.toUpperCase()}
              </span>
            </div>

            <h3 className="font-serif text-sm font-bold text-text-primary mt-1.5 leading-snug">
              {activeEvent.title}
            </h3>

            <p className="text-xs text-text-secondary mt-2.5 leading-relaxed font-sans select-text">
              {activeEvent.description}
            </p>

            {/* Micro telemetría del slider */}
            <div className="grid grid-cols-2 gap-3 mt-5 bg-tertiary border border-main p-3 rounded font-mono text-[10px]">
              <div>
                <span className="text-text-secondary uppercase block text-[9px] mb-0.5">Tensión Carmona</span>
                <span className={`font-bold ${isAfterT(70) ? 'text-alert-red' : 'text-text-primary'}`}>
                  {isAfterT(100) ? '0,00 kV' : isAfterT(77) ? '438,2 kV' : isAfterT(70) ? '424,1 kV' : '401,3 kV'}
                </span>
              </div>
              <div>
                <span className="text-text-secondary uppercase block text-[9px] mb-0.5">Flujo Carga MVA</span>
                <span className={`font-bold ${isAfterT(75) && !isAfterT(100) ? 'text-alert-red' : 'text-accent'}`}>
                  {activeEvent.mvaLoad.toLocaleString('es-ES')} MVA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: SVG Mapa */}
        <div className="lg:col-span-7 bg-secondary border border-main p-5 rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-alert-red"></div>
          
          {/* El mapa SVG */}
          <div className="flex-grow flex items-center justify-center relative min-h-[350px]">
            <svg
              viewBox="0 0 500 450"
              className="w-full h-full max-h-[380px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Estilos dinámicos embebidos */}
              <style>{`
                .pulse-red { animation: pulseRed 1.2s infinite ease-in-out; }
                .wave-expand { animation: waveExpand 1.5s infinite linear; }
                .dynamic-flow { 
                  stroke-dasharray: 8, 6; 
                  animation: flowDash ${stress.dashSpeed} infinite linear; 
                }
                .grid-line { stroke: var(--border-main); stroke-width: 0.5; stroke-opacity: 0.2; }
                @keyframes pulseRed {
                  0%, 100% { r: 8; fill: var(--alert-red); filter: opacity(0.8); }
                  50% { r: 14; fill: var(--alert-red); filter: opacity(1); }
                }
                @keyframes waveExpand {
                  0% { r: 6; opacity: 1; stroke-width: 2; }
                  100% { r: 110; opacity: 0; stroke-width: 4; }
                }
                @keyframes flowDash {
                  to { stroke-dashoffset: -20; }
                }
              `}</style>

              {/* Red de cuadrículas tecnológicas */}
              {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((v) => (
                <g key={v}>
                  <line x1={v} y1="0" x2={v} y2="450" className="grid-line" />
                  <line x1="0" y1={v} x2="500" y2={v} className="grid-line" />
                </g>
              ))}

              {/* ZONAS DE INERCIA (Polígonos estilizados) */}
              {/* Noroeste (Galicia/Asturias/Cantabria) - Alta inercia H=3.84s */}
              <polygon
                points="40,110 130,50 180,90 190,160 110,160 40,160"
                fill={isAfterT(100) ? 'var(--alert-red)' : 'var(--alert-green)'}
                stroke="var(--alert-green)"
                strokeWidth="1.2"
                fillOpacity={isAfterT(100) ? 0.05 : 0.12}
                className="transition-colors duration-500"
              />

              {/* Centro/Norte (Madrid, Aragón, Castilla) - Inercia baja H=1.84s */}
              <polygon
                points="180,90 350,70 410,140 370,280 200,280 190,160"
                fill={isAfterT(77) ? 'var(--alert-red)' : 'var(--alert-orange)'}
                stroke="var(--alert-orange)"
                strokeWidth="1.2"
                fillOpacity={isAfterT(77) ? 0.08 : 0.10}
                className="transition-colors duration-500"
              />

              {/* Sur/Extremadura/Andalucía - Inercia crítica H=1.30s */}
              <polygon
                points="110,160 200,280 370,280 360,370 290,410 130,410 90,320"
                fill="var(--alert-red)"
                stroke="var(--alert-red)"
                strokeWidth={isAfterT(70) ? '1.8' : '1.2'}
                fillOpacity={isAfterT(75) ? 0.22 : isAfterT(70) ? 0.18 : 0.08}
                className="transition-colors duration-500"
              />

              {/* Contorno unificado de Portugal y España continental */}
              <path
                d="M 40,110 L 130,50 L 350,70 L 410,140 L 460,180 L 410,290 L 360,370 L 290,410 L 130,410 L 90,320 L 40,260 Z"
                fill="none"
                stroke="var(--border-main)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* LÍNEAS DE TRANSPORTE Y FLUXOS REACTIVOS SCADA */}
              {/* Línea Central Madrid - Sur */}
              <path
                d="M 250,365 L 285,220 L 350,70"
                stroke={stress.color}
                strokeWidth={stress.width}
                className={`transition-all duration-300 ${isAfterT(100) ? '' : 'dynamic-flow'}`}
                fill="none"
              />

              {/* España-Francia AC */}
              <line
                x1="350"
                y1="70"
                x2="350"
                y2="15"
                stroke={isAfterT(80) ? 'var(--border-main)' : stress.color}
                strokeWidth={isAfterT(80) ? 1.5 : stress.width}
                strokeDasharray={isAfterT(80) ? '4,4' : 'none'}
                className={`transition-all duration-300 ${isAfterT(80) ? '' : 'dynamic-flow glow-line'}`}
              />

              {/* HVDC INELFE-1 */}
              <path
                d="M 370,70 L 370,15"
                stroke={isAfterT(80) ? 'var(--border-main)' : isAfterT(32) ? 'var(--alert-orange)' : 'var(--accent-cyan)'}
                strokeWidth={isAfterT(80) ? 2 : stress.width + 1}
                strokeDasharray={isAfterT(80) ? '4,4' : 'none'}
                className={`transition-all duration-300 ${isAfterT(80) ? '' : 'dynamic-flow glow-line'}`}
                fill="none"
              />

              {/* España-Marruecos */}
              <line
                x1="220"
                y1="410"
                x2="220"
                y2="445"
                stroke={isAfterT(80) ? 'var(--border-main)' : isAfterT(70) ? 'var(--alert-red)' : 'var(--alert-orange)'}
                strokeWidth={isAfterT(80) ? 1.5 : stress.width}
                strokeDasharray={isAfterT(80) ? '4,4' : 'none'}
                className={`transition-all duration-300 ${isAfterT(80) ? '' : 'dynamic-flow glow-line'}`}
              />

              {/* ONDA DE PROPAGACIÓN CONCÉNTRICA DESDE GRANADA */}
              {isAfterT(75) && !isAfterT(100) && (
                <>
                  <circle cx="320" cy="350" r="10" fill="none" stroke="var(--alert-red)" className="wave-expand" />
                  <circle cx="320" cy="350" r="25" fill="none" stroke="var(--alert-red)" className="wave-expand" style={{ animationDelay: '0.4s' }} />
                </>
              )}

              {/* FRANCIA Indicator */}
              <circle
                cx="360"
                cy="42"
                r={isAfterT(32) ? 8 : 5}
                fill={isAfterT(80) ? 'var(--alert-red)' : isAfterT(32) ? 'var(--alert-orange)' : 'var(--border-main)'}
                className={isAfterT(32) && !isAfterT(80) ? 'animate-pulse' : ''}
                stroke="var(--bg-primary)"
                strokeWidth="1.5"
              />
              <text x="375" y="45" fill="var(--text-primary)" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">FRANCIA</text>

              {/* Marruecos Indicator */}
              <circle
                cx="220"
                cy="435"
                r="5"
                fill={isAfterT(80) ? 'var(--alert-red)' : 'var(--alert-orange)'}
                stroke="var(--bg-primary)"
                strokeWidth="1.5"
              />
              <text x="235" y="438" fill="var(--text-primary)" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">MARRUECOS</text>

              {/* Núñez de Balboa (Extremadura) */}
              <circle
                cx="165"
                cy="280"
                r="6"
                fill={isAfterT(70) ? 'var(--alert-red)' : 'var(--alert-orange)'}
                className={isAfterT(70) ? 'critical-node' : ''}
                stroke="var(--bg-primary)"
                strokeWidth="1.5"
              />
              <text x="110" y="270" fill="var(--text-secondary)" fontSize="8" fontFamily="JetBrains Mono">Balboa</text>

              {/* Carmona */}
              <circle
                cx="250"
                cy="365"
                r="6.5"
                fill={isAfterT(77) ? 'var(--alert-red)' : isAfterT(70) ? 'var(--alert-orange)' : 'var(--border-main)'}
                className={isAfterT(70) ? 'critical-node' : ''}
                stroke="var(--bg-primary)"
                strokeWidth="1.5"
              />
              <text x="210" y="380" fill="var(--text-secondary)" fontSize="8" fontFamily="JetBrains Mono">Carmona</text>

              {/* Granada (Disparo raíz) */}
              <circle
                cx="320"
                cy="350"
                r={isAfterT(75) && !isAfterT(100) ? 9 : 6}
                fill={isAfterT(75) ? 'var(--alert-red)' : 'var(--border-main)'}
                className={isAfterT(75) && !isAfterT(100) ? 'pulse-red critical-node' : isAfterT(75) ? 'critical-node' : ''}
                stroke="var(--bg-primary)"
                strokeWidth="1.5"
              />
              <text x="332" y="348" fill={isAfterT(75) ? 'var(--alert-red)' : 'var(--text-secondary)'} fontSize="9" fontFamily="JetBrains Mono" fontWeight={isAfterT(75) ? 'bold' : 'normal'}>
                Granada {isAfterT(75) && '💥'}
              </text>
            </svg>

            {/* Marcadores flotantes de zonas */}
            <div className="absolute top-16 left-12 font-mono text-[9px] text-alert-green bg-secondary/90 px-2 py-1 border border-alert-green/35 rounded shadow-sm">
              ZONA NORESTE · H = 3,84 s
            </div>
            <div className="absolute top-28 right-24 font-mono text-[9px] text-alert-orange bg-secondary/90 px-2 py-1 border border-alert-orange/35 rounded shadow-sm">
              ZONA CENTRO · H = 1,84 s
            </div>
            <div className="absolute bottom-28 left-36 font-mono text-[9px] text-alert-red bg-secondary/90 px-2 py-1 border border-alert-red/35 rounded shadow-sm">
              ZONA SUR · H = 1,30 s
            </div>
          </div>

          {/* LEYENDA DEL MAPA */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-tertiary border border-main p-3 rounded font-mono text-[9px] text-text-secondary gap-3">
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-alert-green/10 border border-alert-green"></span>
                Inercia Segura (H &gt; 2,0s)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-alert-orange/10 border border-alert-orange"></span>
                Inercia Degradada
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-alert-red/10 border border-alert-red"></span>
                Inercia Crítica (Sur)
              </span>
            </div>

            <div className="flex gap-4 border-t sm:border-t-0 sm:border-l border-main/40 pt-2.5 sm:pt-0 sm:pl-4 w-full sm:w-auto justify-center">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-0.5 border-t border-dashed border-accent"></span>
                Interconexión AC
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-1 bg-accent-cyan rounded"></span>
                HVDC INELFE
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(PropagationMapContent);
