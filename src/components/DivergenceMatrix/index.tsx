import React from 'react';
import { useStore } from '../../hooks/useStore';

export const DivergenceMatrix: React.FC = () => {
  const { zoneVoltages, triggerFaultInZone, resetAllFaults } = useStore();

  const isAnyFaulted = Object.values(zoneVoltages).some(z => z.status !== 'nominal');

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur neon-glow-cyan">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isAnyFaulted ? 'bg-rose-400' : 'bg-emerald-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              isAnyFaulted ? 'bg-rose-500' : 'bg-emerald-500'
            }`}></span>
          </span>
          <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-widest font-mono m-0">
            [MATRIZ DE DIVERGENCIA Y DISTRIBUCIÓN]
          </h2>
        </div>
        {isAnyFaulted && (
          <button
            onClick={resetAllFaults}
            className="text-xs bg-rose-950/40 border border-rose-500/50 hover:bg-rose-900/40 text-rose-400 font-mono px-3 py-1 rounded transition duration-200"
          >
            RESTABLECER RED
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-6 font-mono leading-relaxed">
        Haz clic en cualquier nodo regional para simular una avería local (pérdida de generador o cortocircuito de línea). Observa cómo la divergencia de tensión (p.u.) y frecuencia (Hz) se propaga dinámicamente por la red ibérica.
      </p>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(zoneVoltages).map(([zoneName, telemetry]) => {
          const isCritical = telemetry.status === 'critical';
          const isAlert = telemetry.status === 'alert';
          
          return (
            <button
              key={zoneName}
              onClick={() => triggerFaultInZone(zoneName)}
              className={`text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden font-mono group ${
                isCritical
                  ? 'bg-rose-950/20 border-rose-500/80 neon-glow-red'
                  : isAlert
                    ? 'bg-amber-950/20 border-amber-500/60 neon-glow-amber'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              {/* LED status indicator */}
              <div className="absolute right-4 top-4 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  isCritical 
                    ? 'bg-rose-500 animate-blink shadow-[0_0_8px_#ef4444]' 
                    : isAlert 
                      ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]' 
                      : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                }`}></span>
                <span className="text-[9px] text-slate-500 group-hover:text-slate-400 uppercase font-bold transition">
                  {telemetry.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 block border-b border-slate-800/80 pb-1.5 w-4/5">
                {zoneName}
              </h3>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 uppercase">Tensión p.u.</span>
                  <span className={`font-bold font-mono ${
                    isCritical ? 'text-rose-400' : isAlert ? 'text-amber-400' : 'text-slate-200'
                  }`}>
                    {telemetry.voltage.toFixed(3)} p.u.
                  </span>
                </div>
                
                {/* Visual bar indicating voltage level */}
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical ? 'bg-rose-500' : isAlert ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, telemetry.voltage * 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-xs mt-1.5">
                  <span className="text-slate-500 uppercase">Frecuencia</span>
                  <span className={`font-bold font-mono ${
                    isCritical ? 'text-rose-400' : isAlert ? 'text-amber-400' : 'text-slate-200'
                  }`}>
                    {telemetry.freq.toFixed(2)} Hz
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 uppercase">Carga Activa</span>
                  <span className="text-slate-400 font-bold font-mono">
                    {telemetry.load} MW
                  </span>
                </div>
              </div>

              {/* Warning label displayed on critical nodes */}
              {isCritical && (
                <div className="mt-3 text-[10px] text-rose-400 font-bold bg-rose-950/40 p-1.5 rounded border border-rose-800/40 text-center animate-pulse">
                  ⚠️ FALLO DE LÍNEA DISPARADO
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
