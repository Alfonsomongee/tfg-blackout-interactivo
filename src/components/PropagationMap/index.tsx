import { useState } from 'react';

// Definitions of timestamps and events
const TIMELINE_EVENTS = [
  {
    t: 0,
    time: '12:00:00 CEST',
    title: 'Operación Síncrona Nominal',
    description: 'La inercia síncrona ibérica opera dentro de márgenes estables. Penetración renovable del 82%. Tensiones de transporte en 401 kV de media.',
    systemStatus: 'nominal',
  },
  {
    t: 32,
    time: '12:11:00 CEST',
    title: 'HVDC INELFE-1 Fijado en PMODE1',
    description: 'La interconexión de corriente continua entre España y Francia pasa de modo de emulación AC a consigna de exportación constante de 1.000 MW, eliminando su capacidad dinámica de amortiguamiento.',
    systemStatus: 'alert',
  },
  {
    t: 70,
    time: '12:32:00 CEST',
    title: 'Escalada Linear de Tensión en Colectores',
    description: 'El mallado desbocado introduce una inyección capacitiva de >0,7 GVAr. Las tensiones inician una rampa destructiva que eleva la red de 400 kV a límites de alerta en el nudo de Carmona.',
    systemStatus: 'alert',
  },
  {
    t: 75,
    time: '12:32:57 CEST',
    title: 'Disparo Raíz en Granada',
    description: 'Las protecciones de máxima tensión desconectan la subestación B de Granada a 244 kV (Tap-Lag invisible). Se inicia el colapso físico de reactiva. Una onda expansiva dinamoeléctrica avanza.',
    systemStatus: 'critical',
  },
  {
    t: 77,
    time: '12:33:00 CEST',
    title: 'Desconexiones en Cascada (Sur & Centro)',
    description: 'La inestabilidad de tensión se propaga a Carmona y nudos del centro. Los relés UFLS deslastran carga de forma reactiva, agravando la sobretensión lineal ante la falta de sumideros inductivos.',
    systemStatus: 'critical',
  },
  {
    t: 80,
    time: '12:33:21 CEST',
    title: 'Separación Europea (Relés OST)',
    description: 'Los relés de pérdida de sincronismo (Out-of-Step) disparan los enlaces transpirenaicos en Baixas-Vic, aislando la Península Ibérica para salvar la red continental. Marruecos se desconecta por subfrecuencia.',
    systemStatus: 'separation',
  },
  {
    t: 100,
    time: '12:34:00 CEST',
    title: 'Cero de Tensión / Blackout Total',
    description: 'Toda la generación asíncrona (IBR) se desconecta debido a inestabilidad del PLL en red débil. Se consuma el blackout ibérico que afecta a ~60 millones de personas en España, Portugal y Marruecos.',
    systemStatus: 'blackout',
  },
];

export default function PropagationMap() {
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

  return (
    <div className="flex-grow flex flex-col justify-between text-[#e2e8f0] font-sans">
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-mono text-[#06b6d4] text-lg uppercase tracking-widest font-black flex items-center gap-2">
          <span>🗺️</span> MAPA DE PROPAGACIÓN DEL COLAPSO (28-A)
        </h2>
        <p className="text-[#94a3b8] text-xs font-mono uppercase tracking-wider mt-1">
          Simulador Georreferenciado de Dinámica Rápida e Inestabilidad de Tensión Transpeninsular
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch flex-grow">
        
        {/* PANEL IZQUIERDO: Slider & Evento */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-[#0f1729] border border-[#1e3a5f] p-5 rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#06b6d4] to-transparent"></div>
          
          <div>
            <div className="font-mono text-[#06b6d4] text-[10px] tracking-widest uppercase font-bold border-b border-[#1e3a5f]/40 pb-2 mb-4">
              // CONTROL TEMPORAL SCADA
            </div>

            {/* Slider de tiempo */}
            <div className="space-y-4">
              <div className="flex justify-between items-center font-mono">
                <span className="text-xs text-[#94a3b8] uppercase">Línea Temporal</span>
                <span className="text-xs font-bold text-[#06b6d4] bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 px-2.5 py-0.5 rounded animate-pulse">
                  {activeEvent.time}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-1.5 bg-[#0f172a] rounded-lg appearance-none cursor-pointer accent-[#06b6d4] border border-[#1e3a5f]/60"
              />

              <div className="flex justify-between text-[9px] font-mono text-[#475569]">
                <span>12:00 CEST</span>
                <span>12:15</span>
                <span>12:30</span>
                <span>12:34 CEST</span>
              </div>
            </div>
          </div>

          {/* Caja del evento activo */}
          <div className="flex-grow flex flex-col justify-end pt-6 mt-4 border-t border-[#1e3a5f]/30">
            <div className="font-mono text-[9px] text-[#94a3b8] uppercase tracking-wider mb-1">
              ESTADO DEL SISTEMA: 
              <span className={`ml-1.5 font-bold px-1.5 py-0.5 rounded ${
                activeEvent.systemStatus === 'nominal' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30'
                : activeEvent.systemStatus === 'alert' ? 'bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30 animate-pulse'
                : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 alert-blink'
              }`}>
                {activeEvent.systemStatus.toUpperCase()}
              </span>
            </div>

            <h3 className="text-sm font-mono font-black text-white mt-2 leading-snug">
              {activeEvent.title}
            </h3>

            <p className="text-xs text-[#94a3b8] mt-3 leading-relaxed font-mono">
              {activeEvent.description}
            </p>

            {/* Micro telemetría del slider */}
            <div className="grid grid-cols-2 gap-3 mt-5 bg-[#0a0e1a] border border-[#1e3a5f]/40 p-2.5 rounded font-mono text-[10px]">
              <div>
                <span className="text-[#475569] uppercase block text-[9px]">Tensión Carmona</span>
                <span className={`font-bold ${isAfterT(70) ? 'text-[#ef4444]' : 'text-white'}`}>
                  {isAfterT(100) ? '0,00 kV' : isAfterT(77) ? '438,2 kV' : isAfterT(70) ? '424,1 kV' : '401,3 kV'}
                </span>
              </div>
              <div>
                <span className="text-[#475569] uppercase block text-[9px]">Inercia Peninsular</span>
                <span className={`font-bold ${isAfterT(75) ? 'text-[#ef4444]' : 'text-[#67e8f9]'}`}>
                  {isAfterT(100) ? '0,0 s' : isAfterT(80) ? 'Aislado' : isAfterT(75) ? '1,56 s' : '2,30 s'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: SVG Mapa */}
        <div className="lg:col-span-7 bg-[#0f1729] border border-[#1e3a5f] p-5 rounded-lg shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0ea5e9] to-[#ef4444]"></div>
          
          {/* El mapa SVG */}
          <div className="flex-grow flex items-center justify-center relative min-h-[350px]">
            <svg
              viewBox="0 0 500 450"
              className="w-full h-full max-h-[380px] drop-shadow-[0_0_15px_rgba(15,23,42,0.6)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Estilos dinámicos embebidos */}
              <style>{`
                .pulse-red { animation: pulseRed 1.2s infinite ease-in-out; }
                .wave-expand { animation: waveExpand 2s infinite linear; }
                .flow-active { stroke-dasharray: 6, 4; animation: flowDash 0.8s infinite linear; }
                .grid-line { stroke: #1e3a5f; stroke-width: 0.5; stroke-opacity: 0.25; }
                @keyframes pulseRed {
                  0%, 100% { r: 8; fill: #ef4444; filter: drop-shadow(0 0 2px #ef4444); }
                  50% { r: 12; fill: #ef4444; filter: drop-shadow(0 0 10px #ef4444); }
                }
                @keyframes waveExpand {
                  0% { r: 6; opacity: 1; stroke-width: 1; }
                  100% { r: 75; opacity: 0; stroke-width: 3; }
                }
                @keyframes flowDash {
                  to { stroke-dashoffset: -10; }
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
                fill={isAfterT(100) ? '#450a0a' : '#052e16'}
                stroke="#16a34a"
                strokeWidth="1"
                fillOpacity={isAfterT(100) ? 0.3 : 0.65}
                className="transition-colors duration-500"
              />

              {/* Centro/Norte (Madrid, Aragón, Castilla) - Inercia baja H=1.84s */}
              <polygon
                points="180,90 350,70 410,140 370,280 200,280 190,160"
                fill={isAfterT(100) ? '#450a0a' : isAfterT(77) ? '#450a0a' : '#422006'}
                stroke="#d97706"
                strokeWidth="1"
                fillOpacity={isAfterT(100) ? 0.3 : isAfterT(77) ? 0.65 : 0.55}
                className="transition-colors duration-500"
              />

              {/* Sur/Extremadura/Andalucía - Inercia crítica H=1.30s */}
              <polygon
                points="110,160 200,280 370,280 360,370 290,410 130,410 90,320"
                fill={isAfterT(100) ? '#450a0a' : isAfterT(75) ? '#450a0a' : isAfterT(70) ? '#450a0a' : '#450a0a'}
                stroke="#ef4444"
                strokeWidth={isAfterT(70) ? '1.5' : '1'}
                fillOpacity={isAfterT(100) ? 0.45 : isAfterT(75) ? 0.8 : isAfterT(70) ? 0.65 : 0.4}
                className="transition-colors duration-500"
              />

              {/* Contorno unificado de Portugal y España continental */}
              <path
                d="M 40,110 L 130,50 L 350,70 L 410,140 L 460,180 L 410,290 L 360,370 L 290,410 L 130,410 L 90,320 L 40,260 Z"
                fill="none"
                stroke="#1e3a5f"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* LÍNEAS DE INTERCONEXIÓN */}
              {/* España-Francia AC (línea punteada cian) */}
              <line
                x1="350"
                y1="70"
                x2="350"
                y2="15"
                stroke={isAfterT(80) ? '#ef4444' : '#06b6d4'}
                strokeWidth="2.5"
                strokeDasharray={isAfterT(80) ? '0' : '4,3'}
                className={isAfterT(80) ? '' : 'flow-active'}
              />

              {/* HVDC INELFE-1 (línea sólida azul más gruesa) */}
              <path
                d="M 370,70 L 370,15"
                stroke={isAfterT(80) ? '#ef4444' : isAfterT(32) ? '#f97316' : '#0284c7'}
                strokeWidth="4"
                className={isAfterT(80) ? '' : 'flow-active'}
                fill="none"
              />

              {/* España-Marruecos (línea sólida naranja) */}
              <line
                x1="220"
                y1="410"
                x2="220"
                y2="445"
                stroke={isAfterT(80) ? '#ef4444' : '#f97316'}
                strokeWidth="3"
                className={isAfterT(80) ? '' : 'flow-active'}
              />

              {/* ONDA DE PROPAGACIÓN CONCÉNTRICA DESDE GRANADA */}
              {isAfterT(75) && !isAfterT(85) && (
                <circle
                  cx="320"
                  cy="350"
                  r="10"
                  fill="none"
                  stroke="#ef4444"
                  className="wave-expand"
                />
              )}

              {/* EVENTOS CLAVE Y NODOS */}
              
              {/* Frontera Francia (HVDC) */}
              <circle
                cx="360"
                cy="42"
                r={isAfterT(32) ? 8 : 5}
                fill={isAfterT(80) ? '#ef4444' : isAfterT(32) ? '#f97316' : '#64748b'}
                className={isAfterT(32) && !isAfterT(80) ? 'animate-pulse' : ''}
                stroke="#1e3a5f"
                strokeWidth="1"
              />
              <text x="375" y="45" fill="#e2e8f0" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">FRANCIA</text>

              {/* Marruecos */}
              <circle
                cx="220"
                cy="435"
                r="5"
                fill={isAfterT(80) ? '#ef4444' : '#f97316'}
                stroke="#1e3a5f"
                strokeWidth="1"
              />
              <text x="235" y="438" fill="#e2e8f0" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">MARRUECOS</text>

              {/* Núñez de Balboa (Extremadura) */}
              <circle
                cx="165"
                cy="280"
                r="6"
                fill={isAfterT(100) ? '#ef4444' : isAfterT(70) ? '#ef4444' : '#eab308'}
                stroke="#1e3a5f"
                strokeWidth="1"
              />
              <text x="110" y="270" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">Balboa</text>

              {/* Carmona */}
              <circle
                cx="250"
                cy="365"
                r="6.5"
                fill={isAfterT(100) ? '#ef4444' : isAfterT(77) ? '#ef4444' : isAfterT(70) ? '#f97316' : '#64748b'}
                stroke="#1e3a5f"
                strokeWidth="1"
              />
              <text x="210" y="380" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono">Carmona</text>

              {/* Granada (Disparo raíz) */}
              <circle
                cx="320"
                cy="350"
                r={isAfterT(75) && !isAfterT(100) ? 8 : 6}
                fill={isAfterT(75) ? '#ef4444' : '#64748b'}
                className={isAfterT(75) && !isAfterT(100) ? 'pulse-red' : ''}
                stroke="#1e3a5f"
                strokeWidth="1.5"
              />
              <text x="332" y="348" fill={isAfterT(75) ? '#ef4444' : '#94a3b8'} fontSize="9" fontFamily="JetBrains Mono" fontWeight={isAfterT(75) ? 'bold' : 'normal'}>
                Granada {isAfterT(75) && '💥'}
              </text>
            </svg>

            {/* Marcadores flotantes de zonas */}
            <div className="absolute top-16 left-12 font-mono text-[9px] text-[#22c55e] bg-[#052e16]/80 px-2 py-1 border border-[#16a34a]/30 rounded">
              ZONA NORESTE · H=3,84s
            </div>
            <div className="absolute top-28 right-24 font-mono text-[9px] text-[#eab308] bg-[#422006]/80 px-2 py-1 border border-[#d97706]/30 rounded">
              ZONA CENTRO · H=1,84s
            </div>
            <div className="absolute bottom-28 left-36 font-mono text-[9px] text-[#ef4444] bg-[#450a0a]/80 px-2 py-1 border border-[#dc2626]/30 rounded">
              ZONA SUR · H=1,30s
            </div>
          </div>

          {/* LEYENDA DEL MAPA */}
          <div className="flex justify-between items-center bg-[#0a0e1a]/80 border border-[#1e3a5f]/40 p-3 rounded font-mono text-[9px] text-[#94a3b8]">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#052e16] border border-[#16a34a]"></span>
                Inercia Segura
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#422006] border border-[#d97706]"></span>
                Bajo Umbral ENTSO-E
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#450a0a] border border-[#ef4444]"></span>
                Inercia Crítica
              </span>
            </div>

            <div className="flex gap-4 border-l border-[#1e3a5f]/30 pl-4">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 border-t border-dashed border-[#06b6d4]"></span>
                Interconexión AC
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-1 bg-[#0284c7]"></span>
                HVDC INELFE-1
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
