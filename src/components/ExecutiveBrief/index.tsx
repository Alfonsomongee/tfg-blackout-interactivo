
export default function ExecutiveBrief() {
  return (
    <div className="flex-grow flex flex-col justify-between text-[#e2e8f0] font-sans">
      {/* Header section */}
      <div className="mb-4">
        <h2 className="font-mono text-[#06b6d4] text-lg uppercase tracking-widest font-black flex items-center gap-2">
          <span>📋</span> RESUMEN EJECUTIVO: ALERTA NACIONAL 28-A
        </h2>
        <p className="text-[#94a3b8] text-xs font-mono uppercase tracking-wider mt-1">
          Informe de Síntesis Forense de Alto Nivel para Autoridades y Reguladores
        </p>
      </div>

      {/* Main 3-column Grid (designed for no vertical scroll on typical screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch flex-grow">
        
        {/* COLUMNA IZQUIERDA — "LO QUE PASÓ" (30% ancho / 3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-4 bg-[#0f1729] border border-[#1e3a5f] p-5 rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#06b6d4] to-transparent"></div>
          <div className="font-mono text-[#06b6d4] text-[10px] tracking-widest uppercase font-bold border-b border-[#1e3a5f]/40 pb-2 mb-2">
            // TELEMETRÍA DE IMPACTO
          </div>

          <div className="flex flex-col flex-grow justify-around gap-4">
            <div>
              <div className="font-mono text-5xl font-black text-[#0ea5e9] leading-none tracking-tight">
                22,5 s
              </div>
              <div className="text-xs font-mono uppercase text-[#94a3b8] tracking-widest mt-1">
                Duración del colapso
              </div>
            </div>

            <div>
              <div className="font-mono text-5xl font-black text-[#ef4444] leading-none tracking-tight">
                &gt;15 GW
              </div>
              <div className="text-xs font-mono uppercase text-[#94a3b8] tracking-widest mt-1">
                Generación perdida
              </div>
            </div>

            <div>
              <div className="font-mono text-5xl font-black text-[#f97316] leading-none tracking-tight">
                ~60 M
              </div>
              <div className="text-xs font-mono uppercase text-[#94a3b8] tracking-widest mt-1">
                Personas afectadas
              </div>
            </div>

            <div>
              <div className="font-mono text-5xl font-black text-[#22c55e] leading-none tracking-tight">
                82 %
              </div>
              <div className="text-xs font-mono uppercase text-[#94a3b8] tracking-widest mt-1">
                Penetración renovable
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA CENTRAL — "POR QUÉ PASÓ" (40% ancho / 4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4 bg-[#0f1729] border border-[#1e3a5f] p-5 rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#f97316] to-transparent"></div>
          <div className="font-mono text-[#f97316] text-[10px] tracking-widest uppercase font-bold border-b border-[#1e3a5f]/40 pb-2">
            // ANÁLISIS DE CAUSAS RAÍZ
          </div>

          <div className="flex flex-col justify-between flex-grow gap-4 pt-2">
            
            {/* Fractura Operativa */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-[#1e3a5f]/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse"></span>
                <span className="font-mono text-xs font-black text-[#ef4444] tracking-wider uppercase">
                  🔴 FRACTURA OPERATIVA
                </span>
              </div>
              <p className="text-xs text-[#e2e8f0] leading-relaxed font-mono">
                El mallado de 11 líneas de 400 kV inyectó <strong className="text-[#0ea5e9] font-normal">&gt;0,7 GVAr</strong> capacitivos frente a apenas <strong className="text-[#ef4444] font-normal">0,2 GVAr</strong> de absorción inductiva real disponible. Este desequilibrio generó una sobretensión masiva irreversible.
              </p>
            </div>

            {/* Fractura Regulatoria */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-[#1e3a5f]/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] animate-pulse"></span>
                <span className="font-mono text-xs font-black text-[#eab308] tracking-wider uppercase">
                  🟡 FRACTURA REGULATORIA
                </span>
              </div>
              <p className="text-xs text-[#e2e8f0] leading-relaxed font-mono">
                El Procedimiento de Operación <strong className="text-white font-normal">P.O. 7.4</strong> prohibía legalmente al 82% de la generación activa (IBR) regular tensión dinámicamente, forzándolas a factor de potencia fijo. Años de demora regulatoria acumulada.
              </p>
            </div>

            {/* Fractura Sistémica */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9] animate-pulse"></span>
                <span className="font-mono text-xs font-black text-[#0ea5e9] tracking-wider uppercase">
                  🔵 FRACTURA SISTÉMICA
                </span>
              </div>
              <p className="text-xs text-[#e2e8f0] leading-relaxed font-mono">
                El criterio estático de seguridad <strong className="text-white font-normal">N-1</strong> clasificó el estado del sistema como plenamente "Normal" 5 minutos antes del colapso, resultando ciego ante la inestabilidad de tensión en régimen dinámico rápido.
              </p>
            </div>

          </div>
        </div>

        {/* COLUMNA DERECHA — "QUÉ NO CAUSÓ EL APAGÓN" (30% ancho / 3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3 bg-[#0f1729] border border-[#1e3a5f] p-5 rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#22c55e] to-transparent"></div>
          <div className="font-mono text-[#22c55e] text-[10px] tracking-widest uppercase font-bold border-b border-[#1e3a5f]/40 pb-2 mb-2">
            // MITOS VS REALIDADES HISTÓRICAS
          </div>

          <div className="flex flex-col flex-grow justify-between gap-3">
            {/* Mito 1 */}
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 rounded bg-[#450a0a] border border-[#ef4444]/30 text-xs text-[#ef4444] font-mono line-through font-bold">
                ✗ FALSO: "Faltó energía nuclear"
              </div>
              <div className="px-3 py-1.5 rounded bg-[#052e16] border border-[#22c55e]/30 text-xs text-[#4ade80] font-mono leading-relaxed">
                <span className="font-bold">✓ REAL:</span> H=2,3 s global. El colchón inercial superaba holgadamente el umbral mínimo de seguridad de ENTSO-E (2,0 s).
              </div>
            </div>

            {/* Mito 2 */}
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 rounded bg-[#450a0a] border border-[#ef4444]/30 text-xs text-[#ef4444] font-mono line-through font-bold">
                ✗ FALSO: "Exceso de renovables"
              </div>
              <div className="px-3 py-1.5 rounded bg-[#052e16] border border-[#22c55e]/30 text-xs text-[#4ade80] font-mono leading-relaxed">
                <span className="font-bold">✓ REAL:</span> El blackout fue provocado por inestabilidad capacitiva de tensión y saturación reactiva, no por escasez de potencia activa.
              </div>
            </div>

            {/* Mito 3 */}
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 rounded bg-[#450a0a] border border-[#ef4444]/30 text-xs text-[#ef4444] font-mono line-through font-bold">
                ✗ FALSO: "Ciberataque ruso en subestaciones"
              </div>
              <div className="px-3 py-1.5 rounded bg-[#052e16] border border-[#22c55e]/30 text-xs text-[#4ade80] font-mono leading-relaxed">
                <span className="font-bold">✓ REAL:</span> Explicación estrictamente física: saturación destructiva de curvas Q-V en el nudo crítico andaluz de Carmona de 400 kV.
              </div>
            </div>

            {/* Mito 4 */}
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 rounded bg-[#450a0a] border border-[#ef4444]/30 text-xs text-[#ef4444] font-mono line-through font-bold">
                ✗ FALSO: "Francia nos abandonó y cortó"
              </div>
              <div className="px-3 py-1.5 rounded bg-[#052e16] border border-[#22c55e]/30 text-xs text-[#4ade80] font-mono leading-relaxed">
                <span className="font-bold">✓ REAL:</span> Los relés OST transpirenaicos abrieron de forma automática e impecable de acuerdo con el código de red (ENTSO-E §4.3) salvando a Europa.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Component Footer */}
      <footer className="mt-5 border-t border-[#1e3a5f]/40 pt-3 text-center text-[10px] text-[#475569] font-mono uppercase tracking-wider">
        Fuentes: REE (jun. 2025) · ICAI/AELEC (may. 2025) · ENTSO-E ICS (abr. 2025) · Comité de Análisis MITECO (jun. 2025)
      </footer>
    </div>
  );
}
