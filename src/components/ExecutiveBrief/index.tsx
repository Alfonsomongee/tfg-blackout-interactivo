import AnimatedMetric from '../AnimatedMetric';
import TooltipTerm from '../TooltipTerm';
import NextChapter from '../NextChapter';
import ExplorablePill from '../shared/ExplorablePill';

export default function ExecutiveBrief() {
  return (
    <div className="flex-grow flex flex-col justify-between text-text-primary font-sans animate-fade-in w-full">
      {/* Header section */}
      <div className="border-b border-main pb-4 mb-4 flex justify-between items-start">
        <div>
          <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
            Resumen Ejecutivo e Informe de Síntesis Forense
          </h2>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Capítulo I · Dictamen de Alto Nivel para Reguladores e Instituciones del Sector Eléctrico
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-tertiary border border-main px-3 py-1.5 rounded font-mono text-[10px] text-accent">
          <span>💡 CONSEJO TRIBUNAL: Clic en píldoras azules para abrir ecuaciones y modelos.</span>
        </div>
      </div>

      {/* Main 3-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch flex-grow">
        
        {/* COLUMNA IZQUIERDA — "LO QUE PASÓ" (30% ancho / 3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-4 bg-secondary border border-main p-5 rounded-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-transparent"></div>
          <div className="font-mono text-text-mono text-[10px] tracking-widest uppercase font-bold border-b border-main/40 pb-2 mb-2">
            // TELEMETRÍA DEL IMPACTO SÍSMICO
          </div>

          <div className="flex flex-col flex-grow justify-around gap-4">
            <AnimatedMetric
              value={22.50}
              decimals={2}
              unit=" s"
              label="Velocidad de propagación"
              color="var(--accent-blue)"
            />
            <AnimatedMetric
              value={15.0}
              decimals={1}
              prefix=">"
              unit=" GW"
              label="Potencia total desconectada"
              color="var(--alert-red)"
            />
            <AnimatedMetric
              value={60}
              prefix="~"
              unit="M"
              label="Población desconectada"
              color="var(--alert-orange)"
            />
            <AnimatedMetric
              value={82.4}
              decimals={1}
              unit="%"
              label="Penetración instantánea renovable"
              color="var(--alert-green)"
            />
          </div>
        </div>

        {/* COLUMNA CENTRAL — "POR QUÉ PASÓ" (40% ancho / 4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4 bg-secondary border border-main p-5 rounded-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-alert-orange to-transparent"></div>
          <div className="font-mono text-alert-orange text-[10px] tracking-widest uppercase font-bold border-b border-main/40 pb-2">
            // FRACTURAS TÉCNICAS E HISTÓRICAS
          </div>

          <div className="flex flex-col justify-between flex-grow gap-4 pt-2">
            
            {/* Fractura Operativa */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-main/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-alert-red animate-pulse"></span>
                <span className="font-mono text-xs font-black text-alert-red tracking-wider uppercase">
                  Fractura Física Operativa
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-sans select-text">
                El mallado masivo inyectó <strong className="text-accent font-bold">&gt;0,7 GVAr</strong> capacitivos frente a apenas <strong className="text-alert-red font-bold">0,2 GVAr</strong> de capacidad de absorción inductiva. Este desbalance desató la sobretensión lineal agravada por el fenómeno de <ExplorablePill term="tap-lag" label="Inercia de Tomas (Tap-Lag)" /> en la <TooltipTerm term="Fase 1">Fase 1</TooltipTerm>.
              </p>
            </div>

            {/* Fractura Regulatoria */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-main/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-alert-orange animate-pulse"></span>
                <span className="font-mono text-xs font-black text-alert-orange tracking-wider uppercase">
                  Fractura Regulatoria Nacional
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-sans select-text">
                La directriz reglamentaria <strong className="text-text-primary font-bold">P.O. 7.4</strong> restringía legalmente al 82% de la potencia activa acoplada regular tensión dinámicamente, desencadenando la <ExplorablePill term="pll-instability" label="Inestabilidad de PLL" /> y la desconexión masiva en cascada en la <TooltipTerm term="Fase 2">Fase 2</TooltipTerm>.
              </p>
            </div>

            {/* Fractura Sistémica */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
                <span className="font-mono text-xs font-black text-accent tracking-wider uppercase">
                  Fractura Sistémica Operativa
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-sans select-text">
                El algoritmo estático tradicional de seguridad <strong className="text-text-primary font-bold">N-1</strong> clasificó el sistema en estado "Seguro" minutos previos al desastre. El bloqueo del enlace <ExplorablePill term="hvdc-pmode1" label="HVDC en PMODE1" /> impidió la respuesta primaria de frecuencia en la <TooltipTerm term="Fase 3">Fase 3</TooltipTerm>.
              </p>
            </div>

          </div>
        </div>

        {/* COLUMNA DERECHA — "QUÉ NO CAUSÓ EL APAGÓN" (30% ancho / 3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3 bg-secondary border border-main p-5 rounded-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-alert-green to-transparent"></div>
          <div className="font-mono text-alert-green text-[10px] tracking-widest uppercase font-bold border-b border-main/40 pb-2 mb-2">
            // MITOS DE OPINIÓN VS HECHOS CIENTÍFICOS
          </div>

          <div className="flex flex-col flex-grow justify-between gap-3">
            {/* Mito 1 */}
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 rounded bg-alert-red/5 border border-alert-red/20 text-[10px] text-alert-red font-mono line-through font-bold">
                ✗ MITO: "Faltó inercia nuclear o carbón"
              </div>
              <div className="px-3 py-1.5 rounded bg-alert-green/5 border border-alert-green/20 text-xs text-text-secondary font-sans leading-normal select-text">
                <span className="font-bold text-alert-green font-mono">✓ HECHO:</span> La inercia sistémica peninsular H era de 2,3 s, holgadamente por encima del umbral mínimo de seguridad de ENTSO-E (2,0 s).
              </div>
            </div>

            {/* Mito 2 */}
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 rounded bg-alert-red/5 border border-alert-red/20 text-[10px] text-alert-red font-mono line-through font-bold">
                ✗ MITO: "Exceso de plantas fotovoltaicas"
              </div>
              <div className="px-3 py-1.5 rounded bg-alert-green/5 border border-alert-green/20 text-xs text-text-secondary font-sans leading-normal select-text">
                <span className="font-bold text-alert-green font-mono">✓ HECHO:</span> El apagón fue motivado por inestabilidad reactiva de sobretensión, no por falta de potencia activa disponible en el mix.
              </div>
            </div>

            {/* Mito 3 */}
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 rounded bg-alert-red/5 border border-alert-red/20 text-[10px] text-alert-red font-mono line-through font-bold">
                ✗ MITO: "Desconexión deliberada de Francia"
              </div>
              <div className="px-3 py-1.5 rounded bg-alert-green/5 border border-alert-green/20 text-xs text-text-secondary font-sans leading-normal select-text">
                <span className="font-bold text-alert-green font-mono">✓ HECHO:</span> Los relés OST transpirenaicos actuaron de forma intachable para aislar la inestabilidad según los códigos de red paneuropeos (ENTSO-E §4.3).
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Component Footer */}
      <footer className="mt-6 border-t border-main/40 pt-4 text-center text-[10px] text-text-secondary/70 font-mono uppercase tracking-wider">
        INFORMES ANALIZADOS: REE (JUNIO 2025) · REPORTE TÉCNICO ICAI (MAYO 2025) · ENTSO-E ICS REPORT (ABRIL 2025) · COMITÉ CIENTÍFICO MITECO
      </footer>
      <NextChapter path="/contexto-energetico" label="Contexto Energético" desc="El estado del sistema eléctrico ibérico antes del 28-A" />
    </div>
  );
}
