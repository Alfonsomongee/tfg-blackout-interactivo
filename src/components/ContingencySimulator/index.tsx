import React, { useMemo } from 'react';
import { useStore } from '../../hooks/useStore';
import { calculateROCOF, frequencyTrajectory } from '../../engine/physics/rocof';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const ContingencySimulator: React.FC = () => {
  const {
    baselineInertia,
    gridFormingPenetration,
    batteryCapacity,
    powerImbalance,
    setBaselineInertia,
    setGridFormingPenetration,
    setBatteryCapacity,
    setPowerImbalance
  } = useStore();

  // Compute total equivalent inertia including GFM virtual contribution
  const totalInertia = useMemo(() => {
    // Each percent of grid forming penetration adds virtual inertia contribution
    const virtualInertiaContribution = (gridFormingPenetration / 100) * 3.5;
    return baselineInertia + virtualInertiaContribution;
  }, [baselineInertia, gridFormingPenetration]);

  // Generate frequency curve data for plotting (0 to 12 seconds)
  const chartData = useMemo(() => {
    const t = Array.from({ length: 61 }, (_, i) => i * 0.2); // 0 to 12s in 0.2s steps
    const trajectory = frequencyTrajectory(t, 50.0, powerImbalance, totalInertia, 1.1);
    
    // Batteries respond after 0.5s by injecting active power to help restore frequency
    return t.map((time, index) => {
      let freq = trajectory[index];
      if (time > 0.6) {
        // Battery injection reduces effective imbalance
        const batteryBoost = (batteryCapacity / 1000) * 0.45 * Math.min(3, time - 0.6);
        freq = Math.min(50.0, freq + batteryBoost);
      }
      return {
        time: Number(time.toFixed(1)),
        frecuencia: Number(freq.toFixed(3)),
        limiteUFLS: 48.5,
        nominal: 50.0
      };
    });
  }, [powerImbalance, totalInertia, batteryCapacity]);

  // Compute key safety indicators
  const initialRoCoFHzPerS = useMemo(() => {
    const rawRocof = calculateROCOF(powerImbalance, totalInertia);
    return rawRocof * 50;
  }, [powerImbalance, totalInertia]);

  const frequencyNadir = useMemo(() => {
    return Math.min(...chartData.map(d => d.frecuencia));
  }, [chartData]);

  const timeToNadir = useMemo(() => {
    let minFreq = 50.0;
    let minTime = 0.0;
    chartData.forEach(d => {
      if (d.frecuencia < minFreq) {
        minFreq = d.frecuencia;
        minTime = d.time;
      }
    });
    return minTime;
  }, [chartData]);

  const riskLevel = useMemo(() => {
    if (frequencyNadir < 48.5) return 'ALTO';
    if (frequencyNadir < 49.3) return 'MEDIO';
    return 'BAJO';
  }, [frequencyNadir]);

  const isRocofCritical = Math.abs(initialRoCoFHzPerS) > 1.5;

  return (
    <div className="bg-[#0f1729] border border-[#1e3a5f] rounded-lg p-6 select-none relative overflow-hidden">
      
      {/* Component Header */}
      <div className="flex items-center justify-between border-b border-[#1e3a5f] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
          </span>
          <h2 className="text-sm font-bold text-[#e2e8f0] uppercase tracking-widest font-mono m-0">
            SIMULADOR INTERACTIVO DE ESTABILIDAD Y CONTINGENCIA
          </h2>
        </div>
        <span className="text-[10px] text-[#67e8f9] font-mono uppercase bg-[#141e35] px-2.5 py-1 rounded border border-[#1e3a5f]">
          NUCLEUS: VER_1.0_PHYSICS
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN — Control Room Parameters & Metrics */}
        <div className="xl:col-span-5 flex flex-col justify-between gap-6">
          
          {/* Sliders Block */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-[#06b6d4] tracking-widest border-b border-[#1e3a5f]/40 pb-1.5 mb-3">
              // CONTROL DE PARÁMETROS
            </h3>

            {/* Slider 1: Power Loss */}
            <div className="bg-[#141e35] p-4 rounded border border-[#1e3a5f]/50">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-[#94a3b8] font-bold uppercase font-sans">Pérdida de Generación</span>
                <span className="text-xs font-mono font-bold text-[#ef4444]">
                  {powerImbalance.toLocaleString('es-ES')} MW
                </span>
              </div>
              <input
                type="range"
                min="-5000"
                max="-500"
                step="100"
                value={powerImbalance}
                onChange={(e) => setPowerImbalance(Number(e.target.value))}
                className="w-full h-1 bg-[#0a0e1a] rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#94a3b8]/50 mt-1 font-mono">
                <span>-500 MW</span>
                <span>-5000 MW (Crítico)</span>
              </div>
            </div>

            {/* Slider 2: Base Inertia */}
            <div className="bg-[#141e35] p-4 rounded border border-[#1e3a5f]/50">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-[#94a3b8] font-bold uppercase font-sans">Inercia del Sistema (H)</span>
                <span className="text-xs font-mono font-bold text-[#67e8f9]">
                  {baselineInertia.toFixed(2)} s
                </span>
              </div>
              <input
                type="range"
                min="1.5"
                max="8.0"
                step="0.01"
                value={baselineInertia}
                onChange={(e) => setBaselineInertia(Number(e.target.value))}
                className="w-full h-1 bg-[#0a0e1a] rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#94a3b8]/50 mt-1 font-mono">
                <span>NW: 3,84s</span>
                <span>C: 1,84s</span>
                <span>S: 1,30s</span>
              </div>
            </div>

            {/* Slider 3: Grid-Forming */}
            <div className="bg-[#141e35] p-4 rounded border border-[#1e3a5f]/50">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-[#94a3b8] font-bold uppercase font-sans">Grid-Forming (%)</span>
                <span className="text-xs font-mono font-bold text-[#22c55e]">
                  {gridFormingPenetration}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={gridFormingPenetration}
                onChange={(e) => setGridFormingPenetration(Number(e.target.value))}
                className="w-full h-1 bg-[#0a0e1a] rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#94a3b8]/50 mt-1 font-mono">
                <span>0% (Inercia pura)</span>
                <span>100% (Soporte Máx)</span>
              </div>
            </div>

            {/* Slider 4: Batteries */}
            <div className="bg-[#141e35] p-4 rounded border border-[#1e3a5f]/50">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-[#94a3b8] font-bold uppercase font-sans">Baterías BESS (MWh)</span>
                <span className="text-xs font-mono font-bold text-[#0ea5e9]">
                  {batteryCapacity} MWh
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4000"
                step="100"
                value={batteryCapacity}
                onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                className="w-full h-1 bg-[#0a0e1a] rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#94a3b8]/50 mt-1 font-mono">
                <span>0 MWh</span>
                <span>4000 MWh (Máx)</span>
              </div>
            </div>
          </div>

          {/* Computed Metrics Block */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-[#06b6d4] tracking-widest border-b border-[#1e3a5f]/40 pb-1.5 mb-3">
              // TELEMETRÍA CALCULADA (TIEMPO REAL)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#141e35]/40 border border-[#1e3a5f] p-3 rounded">
                <span className="text-[10px] text-[#94a3b8] font-mono block uppercase">ROCOF inicial</span>
                <span className={`text-[15px] font-mono font-bold ${initialRoCoFHzPerS < -1.0 ? 'text-[#ef4444]' : 'text-[#67e8f9]'}`}>
                  {initialRoCoFHzPerS.toFixed(3)} Hz/s
                </span>
              </div>
              <div className="bg-[#141e35]/40 border border-[#1e3a5f] p-3 rounded">
                <span className="text-[10px] text-[#94a3b8] font-mono block uppercase">Frecuencia Nadir</span>
                <span className={`text-[15px] font-mono font-bold ${frequencyNadir < 49.0 ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
                  {frequencyNadir.toFixed(3)} Hz
                </span>
              </div>
              <div className="bg-[#141e35]/40 border border-[#1e3a5f] p-3 rounded">
                <span className="text-[10px] text-[#94a3b8] font-mono block uppercase">t a Nadir</span>
                <span className="text-[15px] font-mono font-bold text-[#e2e8f0]">
                  {timeToNadir.toFixed(2)} s
                </span>
              </div>
              <div className="bg-[#141e35]/40 border border-[#1e3a5f] p-3 rounded">
                <span className="text-[10px] text-[#94a3b8] font-mono block uppercase">Riesgo Colapso</span>
                <span className={`text-[12px] font-mono font-extrabold uppercase px-2 py-0.5 rounded text-center block mt-1 ${
                  riskLevel === 'ALTO' ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30' : 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30'
                }`}>
                  {riskLevel}
                </span>
              </div>
            </div>

            {/* Dynamic Alarm Badges */}
            <div className="space-y-2">
              {isRocofCritical && (
                <div className="bg-[#ef4444]/15 border border-[#ef4444] text-[#ef4444] font-mono text-[11px] font-bold py-2 px-3 rounded text-center alert-blink">
                  ⚠ WARNING: GRADIENTE ROCOF CRÍTICO (&gt; 1.5 Hz/s)
                </div>
              )}
              {frequencyNadir < 49.0 ? (
                <div className="bg-[#ef4444] text-[#0a0e1a] font-mono text-[11px] font-extrabold py-2 px-3 rounded text-center alert-blink">
                  💣 ALERTA: BLACKOUT INMINENTE (f &lt; 49.0 Hz)
                </div>
              ) : frequencyNadir < 49.5 ? (
                <div className="bg-[#f97316]/20 border border-[#f97316] text-[#f97316] font-mono text-[11px] font-bold py-2 px-3 rounded text-center">
                  ⚡ ALARMA: RELÉ UFLS COMIENZA DESLASTRE
                </div>
              ) : (
                <div className="bg-[#22c55e]/10 border border-[#22c55e] text-[#22c55e] font-mono text-[11px] font-bold py-2 px-3 rounded text-center">
                  🟢 ESTADO: SISTEMA ESTABLE (REGULACIÓN PRIMARIA)
                </div>
              )}
            </div>
          </div>

          {/* UFLS Active Relay Status */}
          <div className="bg-[#0a0e1a]/80 border border-[#1e3a5f] p-4 rounded-lg">
            <span className="text-[10px] font-mono text-[#06b6d4] block uppercase tracking-widest font-bold mb-3">
              // ESTADO DE DISPARO RELES UFLS
            </span>
            <div className="space-y-2 text-[11px] font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#94a3b8]">49.5 Hz (2.000 MW Bombeo):</span>
                <span className={`px-2 py-0.5 rounded font-bold ${frequencyNadir < 49.5 ? 'bg-[#ef4444]/20 text-[#ef4444] alert-blink' : 'bg-[#141e35] text-[#374151]'}`}>
                  {frequencyNadir < 49.5 ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94a3b8]">49.3 Hz (588 MW Bombeo):</span>
                <span className={`px-2 py-0.5 rounded font-bold ${frequencyNadir < 49.3 ? 'bg-[#ef4444]/20 text-[#ef4444] alert-blink' : 'bg-[#141e35] text-[#374151]'}`}>
                  {frequencyNadir < 49.3 ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94a3b8]">49.0 Hz (1.402 MW Industrial):</span>
                <span className={`px-2 py-0.5 rounded font-bold ${frequencyNadir < 49.0 ? 'bg-[#ef4444]/20 text-[#ef4444] alert-blink' : 'bg-[#141e35] text-[#374151]'}`}>
                  {frequencyNadir < 49.0 ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN — Frequency trajectory charts */}
        <div className="xl:col-span-7 bg-[#0f1729] border border-[#1e3a5f] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-[#06b6d4] tracking-widest mb-4 border-b border-[#1e3a5f]/40 pb-2 flex justify-between items-center">
              <span>CURVA TRAYECTORIA DINÁMICA DE FRECUENCIA</span>
              <span className="text-[10px] text-[#94a3b8]">Inercia Equiv: {totalInertia.toFixed(2)} s</span>
            </h3>

            {/* Recharts Trajectory Plotting with Composited Area */}
            <div className="h-[360px] w-full bg-[#0a0e1a]/40 p-2 rounded border border-[#1e3a5f]/30">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="redArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f/30" />
                  
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                    label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  />
                  
                  <YAxis 
                    domain={[47.5, 50.2]} 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    label={{ value: 'Frecuencia (Hz)', angle: -90, position: 'insideLeft', offset: 12, fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  />
                  
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141e35', borderColor: '#0ea5e9', borderRadius: '4px' }}
                    labelStyle={{ color: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 11 }}
                    itemStyle={{ color: '#06b6d4', fontFamily: 'JetBrains Mono', fontSize: 11 }}
                  />

                  {/* Red translucent shading below 49.5 Hz using Area */}
                  <Area
                    type="monotone"
                    dataKey="frecuencia"
                    fill="url(#redArea)"
                    stroke="none"
                    baseValue={49.5}
                    connectNulls={true}
                  />
                  
                  {/* Dotted threshold line 50.0 Hz */}
                  <ReferenceLine y={50.0} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" label={{ value: '50,0 Hz', fill: '#94a3b8', fontSize: 9, fontFamily: 'JetBrains Mono', position: 'top' }} />

                  {/* Orange threshold line UFLS 49.5 Hz */}
                  <ReferenceLine y={49.5} stroke="#f97316" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'Relé 49,5 Hz', fill: '#f97316', fontSize: 9, fontFamily: 'JetBrains Mono', position: 'top' }} />

                  {/* Red threshold line UFLS 49.0 Hz */}
                  <ReferenceLine y={49.0} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" label={{ value: 'Blackout 49,0 Hz', fill: '#ef4444', fontSize: 9, fontFamily: 'JetBrains Mono', position: 'top' }} />

                  {/* Frequency Curve */}
                  <Line 
                    type="monotone" 
                    dataKey="frecuencia" 
                    stroke="#06b6d4" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4 }}
                    name="Frecuencia Red"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom helpful message */}
          <div className="mt-4 p-4 bg-[#141e35]/50 border border-[#1e3a5f]/50 rounded text-[11px] text-[#94a3b8] leading-relaxed select-text">
            💡 <strong>Análisis forense de inercia:</strong> Durante el apagón real, la inercia promedio de la zona Sur descendió a un crítico de <strong>1,30 s</strong> debido al apagado comercial de grupos síncronos convencionales. Prueba a incrementar la penetración de <strong>Grid-Forming</strong> o la inyección ágil de <strong>baterías (BESS)</strong> para observar cómo la trayectoria de la frecuencia se estabiliza de manera inmediata.
          </div>
        </div>

      </div>

    </div>
  );
};
