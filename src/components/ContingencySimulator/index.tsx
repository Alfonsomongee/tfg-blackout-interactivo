import React, { useMemo } from 'react';
import { useStore } from '../../hooks/useStore';
import { calculateROCOF, frequencyTrajectory } from '../../engine/physics/rocof';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    // RoCoF is calculated, we multiply by 50 to scale to Hz/s
    const rawRocof = calculateROCOF(powerImbalance, totalInertia);
    return rawRocof * 50;
  }, [powerImbalance, totalInertia]);

  const frequencyNadir = useMemo(() => {
    return Math.min(...chartData.map(d => d.frecuencia));
  }, [chartData]);

  const riskLevel = useMemo(() => {
    if (frequencyNadir < 48.5) return 'CRÍTICO';
    if (frequencyNadir < 49.3) return 'MEDIO';
    return 'BAJO';
  }, [frequencyNadir]);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur neon-glow-cyan grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Parameters Panel - Left */}
      <div className="xl:col-span-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-widest font-mono m-0">
              [SIMULADOR DE CONTINGENCIAS]
            </h2>
          </div>

          <p className="text-xs text-slate-400 mb-5 font-mono leading-relaxed">
            Modifica las variables de inercia real, penetración de inversores formadores de red (Grid-Forming) y reservas rápidas de baterías para modelar y prevenir un colapso en cascada.
          </p>

          {/* Sliders */}
          <div className="flex flex-col gap-4">
            {/* Slider 1: Power Imbalance (Fault) */}
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono">Pérdida de Generación (Fallo)</span>
                <span className="text-sm font-bold font-mono text-rose-400">{Math.abs(powerImbalance)} MW</span>
              </div>
              <input
                type="range"
                min="-5000"
                max="-1000"
                step="100"
                value={powerImbalance}
                onChange={(e) => setPowerImbalance(Number(e.target.value))}
                className="w-full accent-rose-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>-1000 MW</span>
                <span>-5000 MW (Crítico)</span>
              </div>
            </div>

            {/* Slider 2: Base Inertia */}
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono">Constante Inercia Base (H)</span>
                <span className="text-sm font-bold font-mono text-cyan-400">{baselineInertia.toFixed(1)} s</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="8.0"
                step="0.1"
                value={baselineInertia}
                onChange={(e) => setBaselineInertia(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>1.5 s (Baja)</span>
                <span>8.0 s (Alta)</span>
              </div>
            </div>

            {/* Slider 3: Grid Forming */}
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono">Penetración Grid-Forming (GFM)</span>
                <span className="text-sm font-bold font-mono text-emerald-400">{gridFormingPenetration}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={gridFormingPenetration}
                onChange={(e) => setGridFormingPenetration(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0% (Síncrono Puro)</span>
                <span>100% (Inversores Máx)</span>
              </div>
            </div>

            {/* Slider 4: Battery reserves */}
            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono">Reserva Rápida de Batería (BESS)</span>
                <span className="text-sm font-bold font-mono text-indigo-400">{batteryCapacity} MW</span>
              </div>
              <input
                type="range"
                min="0"
                max="4000"
                step="100"
                value={batteryCapacity}
                onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 MW</span>
                <span>4000 MW (Máx)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Safety Gauge */}
        <div className="mt-5 border-t border-slate-800 pt-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-center">
              <span className="text-[9px] text-slate-500 uppercase block mb-1">RoCoF Máx</span>
              <span className={`text-base font-bold ${
                initialRoCoFHzPerS < -1.5 ? 'text-rose-400' : 'text-slate-300'
              }`}>
                {initialRoCoFHzPerS.toFixed(3)} Hz/s
              </span>
            </div>
            
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-center">
              <span className="text-[9px] text-slate-500 uppercase block mb-1">Frecuencia Nadir</span>
              <span className={`text-base font-bold ${
                frequencyNadir < 48.5 ? 'text-rose-400' : frequencyNadir < 49.3 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {frequencyNadir.toFixed(3)} Hz
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-center flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase block mb-0.5">Riesgo de Apagón</span>
              <span className={`text-xs font-black px-1.5 py-0.5 rounded ${
                riskLevel === 'CRÍTICO' 
                  ? 'bg-rose-950/50 text-rose-400 border border-rose-800/50 animate-pulse' 
                  : riskLevel === 'MEDIO' 
                    ? 'bg-amber-950/50 text-amber-400 border border-amber-800/50' 
                    : 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50'
              }`}>
                {riskLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Plotting - Right */}
      <div className="xl:col-span-7 bg-slate-950/80 rounded-xl p-5 border border-slate-800/80 flex flex-col">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2 flex justify-between items-center font-mono">
          <span>CURVA DE TRAYECTORIA DE FRECUENCIA</span>
          <span className="text-[10px] text-slate-500 lowercase">Inercia Equiv: {totalInertia.toFixed(2)} s</span>
        </h3>

        <div className="flex-1 min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                tick={{ fontSize: 10, fontFamily: 'monospace' }} 
                label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
              />
              <YAxis 
                domain={[47.5, 50.2]} 
                stroke="#64748b" 
                tick={{ fontSize: 10, fontFamily: 'monospace' }}
                label={{ value: 'Frecuencia (Hz)', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}
                itemStyle={{ color: '#06b6d4', fontFamily: 'monospace', fontSize: 11 }}
              />
              <Line 
                type="monotone" 
                dataKey="frecuencia" 
                stroke="#06b6d4" 
                strokeWidth={2.5} 
                dot={false}
                name="Frecuencia Red"
              />
              <Line 
                type="monotone" 
                dataKey="limiteUFLS" 
                stroke="#ef4444" 
                strokeWidth={1} 
                strokeDasharray="4 4"
                dot={false}
                name="Límite Disparo (UFLS)"
              />
              <Line 
                type="monotone" 
                dataKey="nominal" 
                stroke="#10b981" 
                strokeWidth={1} 
                strokeDasharray="2 2"
                dot={false}
                name="Frecuencia Nominal"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
          <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
            💡 **Análisis de estabilidad:** Incrementar la constante de inercia base o la penetración de inversores formadores de red (GFM) aplana el declive de frecuencia de forma instantánea. Un aporte ágil de reservas por baterías estabiliza la curva y evita que descienda del límite crítico de 48.5 Hz, previniendo el disparo en cascada.
          </p>
        </div>
      </div>
    </div>
  );
};
