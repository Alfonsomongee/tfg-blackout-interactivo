import React, { useState, useEffect } from 'react';
import { useStore } from '../../hooks/useStore';
import type { TimelinePhase } from '../../types/blackout';
import TechnicalImage from '../TechnicalImage';

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
      <div className="bg-secondary border border-main rounded-lg p-10 flex flex-col justify-center items-center gap-4 font-mono text-xs text-text-secondary shadow-sm">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        INICIALIZANDO TELEMETRÍA SECUENCIAL DEL SISTEMA...
      </div>
    );
  }

  return (
    <div className="flex-grow p-1 animate-fade-in flex flex-col gap-6 w-full">
      
      {/* Title block */}
      <div className="border-b border-main pb-4 mb-2">
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
          Registro de Eventos (Sequence of Events Recorder)
        </h2>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Capítulo II · Cronología y Sucesión de Transitorios de Tensión y Frecuencia Zonal
        </p>
      </div>

      {/* HORIZONTAL TIME SWITCHER */}
      <div className="bg-secondary border border-main rounded-lg p-4 shadow-sm relative">
        <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-main -translate-y-1/2 z-0 hidden sm:block"></div>
        
        <div className="relative z-10 flex justify-between items-center overflow-x-auto gap-4 scrollbar-none">
          {phases.map((phase) => {
            const isActive = phase.id === activePhaseId;
            const isPast = phase.id < activePhaseId;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className="flex flex-col items-center gap-2 focus:outline-none min-w-[75px] cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-accent text-white border-accent'
                      : isPast
                      ? 'bg-tertiary text-text-secondary border-main'
                      : 'bg-secondary text-text-secondary/50 border-main/50'
                  }`}
                >
                  §{phase.id}
                </div>
                <span
                  className={`text-[9px] font-mono uppercase tracking-wider font-bold ${
                    isActive ? 'text-accent' : 'text-text-secondary/60'
                  }`}
                >
                  {new Date(phase.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: 'UTC'
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILED SECTION HEADING */}
      <div className="bg-tertiary border-l-4 border-accent p-5 rounded-r">
        <span className="text-[10px] font-mono text-text-mono block uppercase tracking-widest font-bold mb-1">
          Apartado 2.{currentPhase.id} // SEC_STATUS: {currentPhase.id === 6 ? "FALLO GLOBAL" : currentPhase.id === 0 ? "REGISTRO NOMINAL" : "FALLO SECUENCIAL"}
        </span>
        <h3 className="font-serif text-lg font-bold text-text-primary tracking-tight">
          {currentPhase.label}
        </h3>
        <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed mt-2.5 select-text">
          {currentPhase.description}
        </p>
      </div>

      {/* TELEMETRY TABLE vs FORENSIC PERSPECTIVES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Technical Data as a LaTeX booktabs style summary table */}
        <div className="lg:col-span-5 bg-secondary border border-main p-5 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase text-text-primary tracking-widest border-b border-main/50 pb-3 mb-4">
              TELEMETRÍA FORENSE DE LA FASE
            </h4>

            {/* LaTeX booktabs table representation */}
            <table className="table-academic">
              <thead>
                <tr>
                  <th className="w-1/2">Magnitud Física</th>
                  <th className="text-right">Registro de Red</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Frecuencia del Sistema (f)</td>
                  <td className="text-right font-mono font-bold text-text-mono">
                    {currentPhase.frequency_hz.toFixed(3)} Hz
                  </td>
                </tr>
                <tr>
                  <td>Constante de Inercia (H)</td>
                  <td className="text-right font-mono font-bold text-alert-green">
                    {currentPhase.inertia_seconds.toFixed(2)} s
                  </td>
                </tr>
                <tr>
                  <td>Gradiente de Derivada (df/dt)</td>
                  <td className={`text-right font-mono font-bold ${
                    currentPhase.frequency_derivative_hz_per_s < -0.5 ? 'text-alert-red' : 'text-text-primary'
                  }`}>
                    {currentPhase.frequency_derivative_hz_per_s > 0 ? '+' : ''}
                    {currentPhase.frequency_derivative_hz_per_s.toFixed(2)} Hz/s
                  </td>
                </tr>
                <tr>
                  <td>Desvío de Potencia Estático (&Delta;P)</td>
                  <td className="text-right font-mono font-bold text-alert-orange">
                    {currentPhase.events.reduce((acc, evt) => acc + evt.magnitude, 0) > 0
                      ? `-${currentPhase.events.reduce((acc, evt) => acc + evt.magnitude, 0)} MW`
                      : '0 MW'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Controls areas voltage (p.u.) */}
          {currentPhase.voltage_zones.length > 0 && (
            <div className="border-t border-main/40 pt-4 mt-6">
              <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest block mb-3 font-bold">
                Módulos de Tensión por Áreas de Control (p.u.)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {currentPhase.voltage_zones.map((vz) => (
                  <div key={vz.zone} className="bg-tertiary border border-main p-2.5 rounded">
                    <span className="text-[9px] text-text-secondary font-mono uppercase block">{vz.zone}</span>
                    <span className="text-xs font-mono font-bold text-text-mono">
                      {vz.voltage_pu.toFixed(2)} p.u.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Institutional Interpretations */}
        <div className="lg:col-span-7 bg-secondary border border-main p-5 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase text-text-primary tracking-widest border-b border-main/50 pb-3 mb-4">
              POSICIONAMIENTO FORENSE E INFORME OFICIAL
            </h4>

            {/* Entity blocks */}
            <div className="space-y-4">
              {/* REE */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <span className="text-[9px] font-mono font-bold text-text-primary bg-tertiary border border-main px-2 py-0.5 rounded uppercase tracking-wider">
                    Red Eléctrica de España (REE)
                  </span>
                </div>
                <p className="text-xs text-text-secondary select-text leading-relaxed font-sans">
                  {narrative.ree}
                </p>
              </div>

              {/* ICAI */}
              <div className="flex flex-col gap-1 pt-3.5 border-t border-main/30">
                <div className="flex items-center">
                  <span className="text-[9px] font-mono font-bold text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded uppercase tracking-wider">
                    Informe Técnico ICAI
                  </span>
                </div>
                <p className="text-xs text-text-secondary select-text leading-relaxed font-sans">
                  {narrative.icai}
                </p>
              </div>

              {/* ENTSO-E */}
              <div className="flex flex-col gap-1 pt-3.5 border-t border-main/30">
                <div className="flex items-center">
                  <span className="text-[9px] font-mono font-bold text-alert-orange bg-alert-orange/10 border border-alert-orange/30 px-2 py-0.5 rounded uppercase tracking-wider">
                    Panel Técnico ENTSO-E
                  </span>
                </div>
                <p className="text-xs text-text-secondary select-text leading-relaxed font-sans">
                  {narrative.entso_e}
                </p>
              </div>
            </div>
          </div>

          {/* Divergencia Box styled as formal engineering warning note */}
          <div className="mt-6 bg-tertiary border-l-4 border-alert-orange p-4 rounded-r">
            <div className="flex items-start gap-2.5">
              <span className="text-alert-orange text-sm font-bold">⚠</span>
              <div>
                <span className="text-[9px] font-mono font-bold text-alert-orange block uppercase tracking-wider mb-1">
                  DICTAMEN DE DISCREPANCIA FORENSE
                </span>
                <p className="text-xs text-text-secondary leading-relaxed select-text font-sans">
                  {narrative.divergence}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Evidence Graph row */}
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-secondary border border-main p-5 rounded-lg flex flex-col justify-center shadow-sm text-xs leading-relaxed font-serif text-text-secondary">
          <p>
            <strong className="text-text-primary not-italic font-mono uppercase tracking-wider text-[10px] block mb-1">Nota de calibración forense:</strong> 
            La curva de frecuencia transitoria obtenida mediante la simulación matemática interactiva de inercia y amortiguamiento (df/dt) se contrasta con los registros de oscilografía real capturados por los PMU (Phasor Measurement Units) distribuidos por el sistema peninsular. Las desviaciones observadas entre el modelo síncrono equivalente y los datos reales sirven para validar la presencia de amortiguamientos no lineales inducidos por la microgeneración distribuida y los lazos rápidos de control BESS (Battery Energy Storage Systems) en el nudo de interconexión transpirenaica.
          </p>
        </div>
        <TechnicalImage
          src="/images/curva-frecuencia.png"
          alt="Gráfica de Frecuencia Real al Nadir"
          caption="Figura II.3: Telemetría real de oscilación y caída de frecuencia al Nadir (49,00 Hz) capturada por la red PMU peninsular."
          source="Fuente: Comité de Investigación ENTSO-E"
        />
      </div>

    </div>
  );
};

export default TimelineNarrative;
