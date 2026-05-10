import React from 'react';
import { useStore } from '../../hooks/useStore';

export const TimelineNarrative: React.FC = () => {
  const { phases, activePhaseId, setActivePhaseId } = useStore();
  const currentPhase = phases.find(p => p.id === activePhaseId) || phases[0];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur neon-glow-cyan">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-widest font-mono m-0">
            [HISTORIAL DE EVENTOS Y TELEMETRÍA]
          </h2>
        </div>
        <span className="text-xs text-slate-500 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-mono">
          SEC: 2025-04-28
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Timeline Navigation */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-1 font-bold">
            FASES DE LA CONTINGENCIA
          </p>
          <div className="flex flex-col gap-2.5">
            {phases.map((phase) => {
              const isActive = phase.id === activePhaseId;
              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhaseId(phase.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-300 font-mono relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-950 border-cyan-500/80 text-cyan-400 shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
                  )}
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-500">PHASE 0{phase.id}</span>
                    <span className="text-xs font-semibold">
                      {new Date(phase.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold tracking-wide uppercase">{phase.label}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Telemetry */}
        <div className="lg:col-span-7 bg-slate-950/80 rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-bold text-slate-200 uppercase tracking-wide">
                Detalles del Estado - Phase 0{currentPhase.id}
              </h3>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                currentPhase.id === 0 
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' 
                  : currentPhase.id === 3 
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-400'
              }`}>
                {currentPhase.id === 0 ? 'NORMAL' : currentPhase.id === 3 ? 'ESTABILIZANDO' : 'ALERTA CRÍTICA'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/40 p-3.5 rounded-lg border border-slate-800/60 mb-5">
              {currentPhase.description}
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Frecuencia</span>
                <span className={`text-xl font-bold font-mono tracking-tight ${
                  currentPhase.frequency_hz < 49.0 ? 'text-rose-400' : 'text-cyan-400'
                }`}>
                  {currentPhase.frequency_hz.toFixed(2)} Hz
                </span>
              </div>
              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Inercia Total</span>
                <span className="text-xl font-bold font-mono tracking-tight text-emerald-400">
                  {currentPhase.inertia_seconds.toFixed(1)} s
                </span>
              </div>
              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Derivada RoCoF</span>
                <span className={`text-xl font-bold font-mono tracking-tight ${
                  currentPhase.frequency_derivative_hz_per_s < -1.0 ? 'text-rose-400' : 'text-slate-300'
                }`}>
                  {currentPhase.frequency_derivative_hz_per_s > 0 ? '+' : ''}
                  {currentPhase.frequency_derivative_hz_per_s.toFixed(2)} Hz/s
                </span>
              </div>
            </div>

            {/* List Events */}
            {currentPhase.events.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-bold">EVENTOS DISPARADOS</p>
                <div className="flex flex-col gap-2">
                  {currentPhase.events.map((evt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        <span className="text-xs text-rose-300 font-bold font-mono">{evt.description}</span>
                      </div>
                      <span className="text-xs font-mono font-bold bg-rose-950 px-2 py-0.5 rounded text-rose-400 border border-rose-800/40">
                        {evt.magnitude} {evt.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Voltage Zones Telemetry */}
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2.5 font-bold">VOLTAJES REGIONALES DE LA FASE</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {currentPhase.voltage_zones.map((vz) => {
                const isUnderVoltage = vz.voltage_pu < 0.95;
                const isCritical = vz.voltage_pu < 0.90;
                return (
                  <div key={vz.zone} className="bg-slate-900/40 p-2.5 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block font-mono font-bold">{vz.zone}</span>
                      <span className={`text-xs font-mono font-bold ${
                        isCritical ? 'text-rose-400' : isUnderVoltage ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {vz.voltage_pu.toFixed(2)} p.u.
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                      vz.reactive_power_mvar < 0 ? 'bg-amber-950/30 text-amber-400' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {vz.reactive_power_mvar} MVAr
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
