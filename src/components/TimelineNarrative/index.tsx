import React, { useState, useEffect } from 'react';
import { useStore } from '../../hooks/useStore';
import type { TimelinePhase } from '../../types/blackout';

// High-fidelity narrative interpretations based on the TFG documentation
const INSTITUTIONAL_INTERPRETATIONS: {
  [key: number]: {
    ree: string;
    icai: string;
    entso_e: string;
    divergence: string;
  }
} = {
  0: {
    ree: "Operación en zona de seguridad reglamentaria. Inercia baja debido al mix pero dentro de los márgenes previstos por la normativa nacional.",
    icai: "Inercia crítica y asimétrica ($1,30\\text{ s}$ en zona Sur) causada por el apagón masivo de generación síncrona convencional y el 82% de penetración renovable.",
    entso_e: "Baja inercia generalizada en la península. Debilitamiento estructural por carencia de servicios de inercia sintética reglamentarios en fronteras.",
    divergence: "REE considera el estado seguro basándose en reglas estáticas; ICAI demuestra una vulnerabilidad dinámica severa concentrada en el nodo Sur."
  },
  1: {
    ree: "Oscilación de carácter forzado inducida desde un sistema externo fuera de la red de transporte española.",
    icai: "Oscilación interárea natural provocada por el bajo amortiguamiento intrínseco y el acoplamiento débil del sistema bajo inercia degradada.",
    entso_e: "Oscilación forzada de $0,63\\text{ Hz}$ en el corredor de intercambio AC que amenazó la estabilidad transfronteriza.",
    divergence: "Discrepancia sobre el carácter (forzado vs natural). REE exime la debilidad local; ICAI demuestra resonancia por falta de estabilidad en tensión."
  },
  2: {
    ree: "Acción correctora ejecutada según protocolo para amortiguar la oscilación de $0,63\\text{ Hz}$ fijando el intercambio en $1.000\\text{ MW}$ constante.",
    icai: "Error de operación táctica que desactivó la capacidad dinámica del enlace HVDC (AC-emulación) anulando el soporte de frecuencia automático.",
    entso_e: "Pérdida forzada de la modulación dinámica de frecuencia en el enlace INELFE para dar prioridad a flujos de potencia comercial rígidos.",
    divergence: "REE defiende la fijación comercial; ICAI y ENTSO-E concluyen que esta decisión anuló la última línea de defensa automática de frecuencia."
  },
  3: {
    ree: "Segunda oscilación amortiguada con éxito. Activación del protocolo de solicitud de sincronización de grupos convencionales en zona sur.",
    icai: "El sistema roza la inestabilidad. Los grupos térmicos requeridos por REE ofertaron un tiempo de arranque de $1,5\\text{ h}$, inútil para la velocidad del colapso.",
    entso_e: "Propagación de una oscilación de $0,21\\text{ Hz}$ entre bloques de control. Evidencia la falta de grupos convencionales de arranque rápido en el Sur.",
    divergence: "REE remarca la amortiguación de la oscilación; ICAI enfatiza la inoperancia del mercado diario para proveer inercia ante contingencias dinámicas."
  },
  4: {
    ree: "Sobretensión lineal en barras de 400 kV controlada. Disparo imprevisto de $525\\text{ MW}$ de generación distribuida secundaria.",
    icai: "Pérdida masiva del margen de estabilidad en tensión. Margen al colapso reducido a solo $1.019\\text{ MW}$ debido a la inyección de reactiva descontrolada.",
    entso_e: "Desconexión en cascada de microgeneración fotovoltaica distribuida de $<1\\text{ MW}$ por falta de tolerancia a sobretensiones lineales (fault ride-through).",
    divergence: "REE reporta una contingencia leve; ICAI y ENTSO-E demuestran un colapso en cadena invisible de generación distribuida que dejó al sistema sin soporte."
  },
  5: {
    ree: "Disparo fortuito aislado en la subestación granadina debido a un fallo ordinario en la red de transporte de alta tensión.",
    icai: "Disparo provocado por sobretensión en la red de colectores renovables del Sur, resultando en la pérdida instantánea de $2.000\\text{ MW}$ de generación RCR.",
    entso_e: "Fallo localizado que propagó una onda transitoria de baja frecuencia a toda la península, sobrecargando las líneas francesas.",
    divergence: "REE describe un fallo aislado; ICAI demuestra una desconexión masiva sistémica por sobretensión acumulada en la red de colectores."
  },
  6: {
    ree: "Desconexión irreversible de sincronismo con Europa Continental. Activación correcta del deslastre de carga por subfrecuencia (UFLS) en tres escalones.",
    icai: "Colapso final por incapacidad dinámica. Un RoCoF extremo de $-2,5\\text{ Hz/s}$ superó la inercia local remanente (nula en el Sur). Desconexión de Marruecos.",
    entso_e: "Desconexión automática de interconexiones en Francia por sobrecorriente de $3.807\\text{ MW}$ para salvaguardar la estabilidad del sistema europeo central.",
    divergence: "REE destaca la activación del UFLS; ICAI y ENTSO-E confirman que el deslastre fue insuficiente debido al bloqueo comercial del HVDC (PMODE1)."
  }
};

export const TimelineNarrative: React.FC = () => {
  const { activePhaseId, setActivePhaseId } = useStore();
  const [phases, setPhases] = useState<TimelinePhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/timeline.json')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.phases) {
          const mapped: TimelinePhase[] = data.phases.map((p: any) => ({
            id: p.id,
            timestamp: p.timestamp,
            label: p.label,
            description: p.description,
            frequency_hz: p.frequency_hz,
            frequency_derivative_hz_per_s: p.frequency_derivative_hz_per_s,
            inertia_seconds: p.inertia_by_zone?.global_system ?? p.inertia_seconds ?? 2.3,
            voltage_zones: p.voltage_zones ?? [],
            events: (p.events ?? []).map((e: any) => ({
              timestamp: e.timestamp,
              type: (e.type === 'hvdc_mode_change' ? 'hvdc_trip' : e.type === 'forced_oscillation' ? 'generator_trip' : e.type) as any,
              description: e.description,
              magnitude: e.magnitude,
              unit: e.unit
            }))
          }));
          setPhases(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar la telemetría del colapso:", err);
        setLoading(false);
      });
  }, []);

  const currentPhase = phases.find((p) => p.id === activePhaseId) || phases[0];
  const narrative = INSTITUTIONAL_INTERPRETATIONS[activePhaseId] || {
    ree: "Sin telemetría disponible para esta fase.",
    icai: "Sin telemetría disponible para esta fase.",
    entso_e: "Sin telemetría disponible para esta fase.",
    divergence: "Sin divergencias reportadas."
  };

  if (loading) {
    return (
      <div className="bg-[#0f1729] border border-[#1e3a5f] rounded-lg p-10 flex flex-col justify-center items-center gap-4 font-mono text-xs text-[#06b6d4]">
        <div className="w-8 h-8 border-2 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
        INICIALIZANDO TELEMETRÍA DEL SISTEMA...
      </div>
    );
  }

  return (
    <div className="bg-[#0f1729] border border-[#1e3a5f] rounded-lg p-6 select-none relative overflow-hidden">
      
      {/* Component Title */}
      <div className="flex items-center justify-between border-b border-[#1e3a5f] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
          </span>
          <h2 className="text-sm font-bold text-[#e2e8f0] uppercase tracking-widest font-mono m-0">
            LÍNEA TEMPORAL FORENSE DEL COLAPSO
          </h2>
        </div>
        <span className="text-[10px] text-[#94a3b8] bg-[#141e35] px-2.5 py-1 rounded border border-[#1e3a5f] font-mono uppercase tracking-wider">
          SEC: 28 ABRIL 2025
        </span>
      </div>

      {/* HORIZONTAL MISSION TIMELINE NAVIGATION */}
      <div className="mb-8 relative py-4 px-2 bg-[#0a0e1a]/80 border border-[#1e3a5f] rounded-lg">
        {/* Horizontal thin track line with gradient */}
        <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-gradient-to-r from-[#1e3a5f] via-[#0ea5e9]/40 to-[#1e3a5f] -translate-y-1/2 z-0"></div>

        {/* Nodes */}
        <div className="relative z-10 flex justify-between items-center overflow-x-auto gap-4 scrollbar-none">
          {phases.map((phase) => {
            const isActive = phase.id === activePhaseId;
            const isPast = phase.id < activePhaseId;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className="flex flex-col items-center gap-1.5 focus:outline-none min-w-[70px] cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-[13px] font-bold border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0a0e1a] text-[#06b6d4] border-[#0ea5e9] pulse-active'
                      : isPast
                      ? 'bg-[#1e3a5f]/40 text-[#94a3b8] border-[#1e3a5f]'
                      : 'bg-[#0a0e1a] text-[#374151] border-[#1e3a5f]'
                  }`}
                >
                  {phase.id}
                </div>
                <span
                  className={`text-[9px] font-mono uppercase font-bold tracking-wider ${
                    isActive ? 'text-[#06b6d4]' : 'text-[#374151]'
                  }`}
                >
                  {new Date(phase.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PHASE HEADER LABEL */}
      <div className="mb-6 bg-[#141e35] border-l-4 border-[#0ea5e9] p-4 rounded-r">
        <span className="text-[10px] font-mono text-[#06b6d4] block uppercase tracking-widest font-bold mb-1">
          FASE {currentPhase.id} // SEC_STATUS: {currentPhase.id === 6 ? "FALLO TOTAL" : currentPhase.id === 0 ? "ESTABLE" : "SITUACIÓN INESTABLE"}
        </span>
        <h3 className="font-sans text-base font-bold text-[#e2e8f0] uppercase tracking-wide">
          {currentPhase.label}
        </h3>
        <p className="font-sans text-xs text-[#94a3b8] leading-relaxed mt-2 select-text">
          {currentPhase.description}
        </p>
      </div>

      {/* DETAIL TWO-COLUMN PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Technical Data */}
        <div className="lg:col-span-5 bg-[#141e35]/40 border border-[#1e3a5f] p-5 rounded-lg flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-[#06b6d4] tracking-widest border-b border-[#1e3a5f] pb-2 mb-4">
              // TELEMETRÍA DINÁMICA
            </h4>

            <div className="space-y-4 mb-6">
              {/* Stat 1: Frecuencia */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#94a3b8] font-mono">Frecuencia (f):</span>
                <span className="text-sm font-mono font-extrabold text-[#67e8f9]">
                  {currentPhase.frequency_hz.toFixed(3)} Hz
                </span>
              </div>

              {/* Stat 2: Inercia global */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#94a3b8] font-mono">Inercia Global (H):</span>
                <span className="text-sm font-mono font-extrabold text-[#22c55e]">
                  {currentPhase.inertia_seconds.toFixed(2)} s
                </span>
              </div>

              {/* Stat 3: Derivada de Frecuencia */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#94a3b8] font-mono">Gradiente RoCoF (df/dt):</span>
                <span
                  className={`text-sm font-mono font-extrabold ${
                    currentPhase.frequency_derivative_hz_per_s < -0.5
                      ? 'text-[#ef4444] alert-blink'
                      : 'text-[#e2e8f0]'
                  }`}
                >
                  {currentPhase.frequency_derivative_hz_per_s > 0 ? '+' : ''}
                  {currentPhase.frequency_derivative_hz_per_s.toFixed(2)} Hz/s
                </span>
              </div>

              {/* Stat 4: Desvío de Potencia */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#94a3b8] font-mono">Desvío de Potencia (ΔP):</span>
                <span className="text-sm font-mono font-extrabold text-[#f97316]">
                  {currentPhase.events.reduce((acc, evt) => acc + evt.magnitude, 0) > 0
                    ? `-${currentPhase.events.reduce((acc, evt) => acc + evt.magnitude, 0)} MW`
                    : '0 MW'}
                </span>
              </div>
            </div>
          </div>

          {/* Regional Volts */}
          {currentPhase.voltage_zones.length > 0 && (
            <div className="border-t border-[#1e3a5f] pt-4">
              <span className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider block mb-2.5">
                Tensión por Áreas de Control
              </span>
              <div className="grid grid-cols-2 gap-2">
                {currentPhase.voltage_zones.map((vz) => (
                  <div key={vz.zone} className="bg-[#0a0e1a]/60 border border-[#1e3a5f] p-2 rounded">
                    <span className="text-[9px] text-[#94a3b8] font-mono uppercase block">{vz.zone}</span>
                    <span className="text-xs font-mono font-bold text-[#67e8f9]">
                      {vz.voltage_pu.toFixed(2)} p.u.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Institutional Narrative */}
        <div className="lg:col-span-7 bg-[#141e35]/20 border border-[#1e3a5f] p-5 rounded-lg flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-[#06b6d4] tracking-widest border-b border-[#1e3a5f] pb-2 mb-4">
              // POSICIONAMIENTO FORENSE E INFORME OFICIAL
            </h4>

            {/* Narratives row */}
            <div className="space-y-4">
              {/* REE */}
              <div>
                <span className="text-[10px] font-mono font-bold text-white uppercase bg-[#1e3a5f] px-1.5 py-0.5 rounded mr-2">
                  REE
                </span>
                <p className="text-xs text-[#94a3b8] inline select-text leading-relaxed font-sans">
                  {narrative.ree}
                </p>
              </div>

              {/* ICAI */}
              <div className="pt-2 border-t border-[#1e3a5f]/30">
                <span className="text-[10px] font-mono font-bold text-[#0a0e1a] uppercase bg-[#06b6d4] px-1.5 py-0.5 rounded mr-2">
                  ICAI
                </span>
                <p className="text-xs text-[#94a3b8] inline select-text leading-relaxed font-sans">
                  {narrative.icai}
                </p>
              </div>

              {/* ENTSO-E */}
              <div className="pt-2 border-t border-[#1e3a5f]/30">
                <span className="text-[10px] font-mono font-bold text-white uppercase bg-[#f97316] px-1.5 py-0.5 rounded mr-2">
                  ENTSO-E
                </span>
                <p className="text-xs text-[#94a3b8] inline select-text leading-relaxed font-sans">
                  {narrative.entso_e}
                </p>
              </div>
            </div>
          </div>

          {/* Divergencia highlighted badge */}
          <div className="mt-6 bg-[#422006] border border-[#f97316]/30 p-3.5 rounded flex items-start gap-2.5">
            <span className="text-lg">⚠</span>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#f97316] block uppercase tracking-wider mb-0.5">
                FOCO DE DIVERGENCIA FORENSE
              </span>
              <p className="text-xs text-[#94a3b8] leading-relaxed select-text font-sans">
                {narrative.divergence}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
