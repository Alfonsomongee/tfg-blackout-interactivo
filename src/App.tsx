import React, { useMemo, useState, useEffect } from 'react';
import { TimelineNarrative } from './components/TimelineNarrative';
import { DivergenceMatrix } from './components/DivergenceMatrix';
import { ContingencySimulator } from './components/ContingencySimulator';
import { useStore } from './hooks/useStore';

const App: React.FC = () => {
  const { zoneVoltages } = useStore();
  const [systemTime, setSystemTime] = useState(new Date());

  // Live clock simulation
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live averages for the header bar
  const systemStatus = useMemo(() => {
    const zones = Object.values(zoneVoltages);
    const avgVoltage = zones.reduce((sum, z) => sum + z.voltage, 0) / zones.length;
    const avgFreq = zones.reduce((sum, z) => sum + z.freq, 0) / zones.length;
    const totalLoad = zones.reduce((sum, z) => sum + z.load, 0);
    const hasCritical = zones.some(z => z.status === 'critical');
    const hasAlert = zones.some(z => z.status === 'alert');

    return {
      avgVoltage,
      avgFreq,
      totalLoad,
      status: hasCritical ? 'CRÍTICO' : hasAlert ? 'ALERTA' : 'NOMINAL'
    };
  }, [zoneVoltages]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono flex flex-col crt-grid tech-grid relative overflow-x-hidden">
      {/* Decorative cyber line overlay at the very top */}
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500"></div>

      {/* Main Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black bg-cyan-950 text-cyan-400 border border-cyan-800/50 px-2 py-0.5 rounded tracking-wide">
              TFG INTERACTIVO
            </span>
            <span className="text-xs text-slate-500 font-bold">| ESTABILIDAD DE RED ELÉCTRICA</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-wider m-0 uppercase">
            Centro de Control de Estabilidad Síncrona
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modelado Dinámico de Inercia, RoCoF y Simulación de Apagones en la Península Ibérica
          </p>
        </div>

        {/* Global Telemetry Bar */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="px-3 border-r border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block">Hora Sistema</span>
            <span className="text-xs font-bold text-slate-300 font-mono">
              {systemTime.toLocaleTimeString('es-ES')}
            </span>
          </div>

          <div className="px-3 border-r border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block">Frecuencia Media</span>
            <span className={`text-xs font-bold font-mono ${
              systemStatus.avgFreq < 49.5 ? 'text-rose-400 animate-blink' : 'text-cyan-400'
            }`}>
              {systemStatus.avgFreq.toFixed(3)} Hz
            </span>
          </div>

          <div className="px-3 border-r border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block">Tensión Media</span>
            <span className={`text-xs font-bold font-mono ${
              systemStatus.avgVoltage < 0.95 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {systemStatus.avgVoltage.toFixed(3)} p.u.
            </span>
          </div>

          <div className="px-3 border-r border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block">Demanda Total</span>
            <span className="text-xs font-bold text-slate-300 font-mono">
              {(systemStatus.totalLoad / 1000).toFixed(2)} GW
            </span>
          </div>

          <div className="px-3">
            <span className="text-[9px] text-slate-500 uppercase block mb-0.5">Estado Global</span>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
              systemStatus.status === 'CRÍTICO'
                ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40 animate-blink'
                : systemStatus.status === 'ALERTA'
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
            }`}>
              {systemStatus.status}
            </span>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="flex-grow p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full z-10">
        {/* Top Section: Timeline & Matrix Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TimelineNarrative />
          <DivergenceMatrix />
        </div>

        {/* Bottom Section: Full-Width Physics Simulator */}
        <ContingencySimulator />
      </main>

      {/* Scientific details banner */}
      <section className="bg-slate-900/40 border-t border-slate-900 px-6 py-6 font-mono text-xs z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-400 leading-relaxed">
          <div>
            <h4 className="text-slate-300 font-bold uppercase mb-2">⚙️ Leyes Físicas del Simulador</h4>
            <p>
              La dinámica de frecuencia responde a la ecuación de oscilación del generador síncrono. El RoCoF inicial es calculado directamente por: <br />
              <code className="text-[10px] text-cyan-400 bg-slate-950/60 border border-slate-800 px-1 py-0.5 rounded mt-1.5 inline-block">
                RoCoF = ΔP / (2 * H * S_base)
              </code>
            </p>
          </div>
          <div>
            <h4 className="text-slate-300 font-bold uppercase mb-2">💡 Transición Energética</h4>
            <p>
              El reemplazo de la generación síncrona convencional por energías renovables acopladas por inversores (Grid-Following) disminuye la inercia total del sistema (H), haciendo indispensable la inercia virtual aportada por inversores formadores de red (Grid-Forming).
            </p>
          </div>
          <div>
            <h4 className="text-slate-300 font-bold uppercase mb-2">🎓 Información Académica</h4>
            <p>
              Este simulador interactivo constituye el núcleo analítico y demostrativo del Trabajo Fin de Grado desarrollado por **Alfonso Monge Díaz-Angel** para la **Universidad de Sevilla**.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/90 py-4 px-6 flex justify-between items-center text-[10px] text-slate-500 z-10">
        <span>© 2026 Universidad de Sevilla - Escuela Técnica Superior de Ingeniería</span>
        <span>Autor: Alfonso Monge Díaz-Angel</span>
      </footer>
    </div>
  );
};

export default App;
