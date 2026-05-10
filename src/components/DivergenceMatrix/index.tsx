import React from 'react';

interface MatrixRow {
  dimension: string;
  unidad: string;
  ree: string;
  icai: string;
  entsoE: string;
  type: 'consensus' | 'divergence' | 'exclusive' | 'contrast';
  notes?: string;
}

const MATRIX_DATA: MatrixRow[] = [
  {
    dimension: "Inercia global",
    unidad: "s",
    ree: "2,3",
    icai: "—",
    entsoE: "—",
    type: "exclusive",
    notes: "REE estima la inercia global de todo el sistema peninsular en base a estimaciones estáticas."
  },
  {
    dimension: "Inercia zona sur",
    unidad: "s",
    ree: "—",
    icai: "1,30",
    entsoE: "mín. 2,0",
    type: "contrast",
    notes: "Divergencia entre la inercia real calculada por el ICAI y el estándar recomendado de ENTSO-E."
  },
  {
    dimension: "Inercia zona centro",
    unidad: "s",
    ree: "—",
    icai: "1,84",
    entsoE: "mín. 2,0",
    type: "contrast",
    notes: "Inercia de la zona central por debajo del límite mínimo recomendado de seguridad de Europa."
  },
  {
    dimension: "Inercia zona NW",
    unidad: "s",
    ree: "—",
    icai: "3,84",
    entsoE: "—",
    type: "exclusive",
    notes: "Zona noroeste con mayor inercia debido al mix síncronico remanente."
  },
  {
    dimension: "HVDC setpoint",
    unidad: "MW",
    ree: "1.000",
    icai: "1.000",
    entsoE: "1.000",
    type: "consensus",
    notes: "Consenso total sobre el setpoint de exportación comercial fijado durante el colapso."
  },
  {
    dimension: "HVDC modo colapso",
    unidad: "—",
    ree: "PMODE1",
    icai: "PMODE1",
    entsoE: "PMODE1",
    type: "consensus",
    notes: "El enlace operaba de manera rígida a potencia fija, anulando la regulación de frecuencia."
  },
  {
    dimension: "Generación perdida",
    unidad: "MW",
    ree: "~2.000",
    icai: "~2.000",
    entsoE: "—",
    type: "consensus",
    notes: "REE e ICAI coinciden en la magnitud de pérdida de generación RCR tras el primer disparo."
  },
  {
    dimension: "Margen colapso V",
    unidad: "MW",
    ree: "—",
    icai: "1.019",
    entsoE: "—",
    type: "exclusive",
    notes: "Dato analítico del ICAI sobre el estrecho margen antes de la avalancha por sobretensión."
  },
  {
    dimension: "Máx. import Francia",
    unidad: "MW",
    ree: "3.807",
    icai: "—",
    entsoE: "—",
    type: "exclusive",
    notes: "Límite máximo registrado de importación por enlace de continua antes de la pérdida de sincronismo."
  },
  {
    dimension: "Duración colapso",
    unidad: "s",
    ree: "22,5",
    icai: "—",
    entsoE: "—",
    type: "exclusive",
    notes: "Tiempo cronometrado por REE desde el disparo de Granada hasta el colapso de sincronismo."
  },
  {
    dimension: "Oscilación 1",
    unidad: "Hz",
    ree: "forzada",
    icai: "natural interá",
    entsoE: "forzada",
    type: "divergence",
    notes: "Discrepancia física sobre el origen de la primera onda registrada de 0,63 Hz."
  },
  {
    dimension: "Oscilación 2",
    unidad: "Hz",
    ree: "forzada",
    icai: "natural interá",
    entsoE: "forzada",
    type: "divergence",
    notes: "Discrepancia sobre la oscilación interárea de 0,21 Hz en el corredor continental."
  },
  {
    dimension: "Causa raíz",
    unidad: "—",
    ree: "multifactor",
    icai: "sobretensión",
    entsoE: "multifactor",
    type: "divergence",
    notes: "REE/ENTSO-E apuntan a un conjunto fortuito de fallos; ICAI demuestra un fallo de tensión en colectores."
  }
];

export const DivergenceMatrix: React.FC = () => {
  return (
    <div className="bg-[#0f1729] border border-[#1e3a5f] rounded-lg p-6 select-none relative overflow-hidden">
      
      {/* Component Title */}
      <div className="flex items-center justify-between border-b border-[#1e3a5f] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ea5e9] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0ea5e9]"></span>
          </span>
          <h2 className="text-sm font-bold text-[#e2e8f0] uppercase tracking-widest font-mono m-0">
            MATRIZ COMPARATIVA DE DIVERGENCIA FORENSE
          </h2>
        </div>
        <span className="text-[10px] text-[#67e8f9] font-mono uppercase bg-[#141e35] px-2.5 py-1 rounded border border-[#1e3a5f]">
          VER_SCHEMA: REE vs ICAI vs ENTSO-E
        </span>
      </div>

      <p className="text-xs text-[#94a3b8] mb-6 font-sans leading-relaxed select-text">
        Análisis cruzado de los informes forenses oficiales sobre el colapso del 28 de abril de 2025. Los colores destacan visualmente el nivel de consenso científico, discrepancia o datos exclusivos aportados por los tres agentes investigadores.
      </p>

      {/* LEGEND / STATUS LABELS */}
      <div className="flex flex-wrap gap-4 mb-6 bg-[#0a0e1a]/80 border border-[#1e3a5f] p-3 rounded-lg font-mono text-[10px] tracking-wider uppercase">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-[#052e16] border border-[#22c55e]/30"></span>
          <span className="text-[#22c55e]">Consenso total</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-[#422006] border border-[#f97316]/30"></span>
          <span className="text-[#f97316]">Divergencia técnica (⚠)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-[#141e35]/60 border border-[#1e3a5f]"></span>
          <span className="text-[#e2e8f0]">Dato exclusivo / Neutro</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-[#1e3a5f] rounded-lg">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="bg-[#141e35] border-b border-[#1e3a5f] text-[#e2e8f0] font-mono uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 border-r border-[#1e3a5f]">Dimensión Evaluada</th>
              <th className="py-3 px-3 border-r border-[#1e3a5f] text-center w-20">Unidad</th>
              <th className="py-3 px-4 border-r border-[#1e3a5f] text-center">Informe REE</th>
              <th className="py-3 px-4 border-r border-[#1e3a5f] text-center">Informe ICAI</th>
              <th className="py-3 px-4 text-center">Informe ENTSO-E</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a5f]/40">
            {MATRIX_DATA.map((row, idx) => {
              
              // Helper to define row-wide background / cell styles based on consensus level
              const isConsensus = row.type === 'consensus';
              const isDivergence = row.type === 'divergence';
              const isContrast = row.type === 'contrast';

              const cellStyle = (val: string, source: 'ree' | 'icai' | 'entso') => {
                if (val === '—') {
                  return 'text-[#374151] text-center font-mono py-3.5 px-4';
                }

                if (isConsensus) {
                  return 'bg-[#052e16] text-[#22c55e] font-bold text-center py-3.5 px-4 border-r border-[#1e3a5f]/30';
                }

                if (isDivergence) {
                  return 'bg-[#422006] text-[#f97316] font-bold text-center py-3.5 px-4 border-r border-[#1e3a5f]/30';
                }

                if (isContrast && (source === 'icai' || source === 'entso')) {
                  return 'bg-[#422006]/40 text-[#f97316]/90 font-semibold text-center py-3.5 px-4 border-r border-[#1e3a5f]/30';
                }

                return 'text-[#94a3b8] text-center py-3.5 px-4 border-r border-[#1e3a5f]/30';
              };

              return (
                <tr 
                  key={idx} 
                  className="hover:bg-[#141e35]/30 transition-colors duration-150 group border-b border-[#1e3a5f]/40"
                >
                  {/* Dimension Name */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#e2e8f0] border-r border-[#1e3a5f] select-text">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5">
                        {isDivergence && <span className="text-[#f97316] text-[11px]">⚠</span>}
                        {row.dimension}
                      </span>
                      {row.notes && (
                        <span className="text-[9px] text-[#94a3b8] font-sans font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {row.notes}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Unit */}
                  <td className="py-3.5 px-3 text-center border-r border-[#1e3a5f] font-mono text-[11px] text-[#67e8f9]">
                    {row.unidad}
                  </td>

                  {/* REE Cell */}
                  <td className={cellStyle(row.ree, 'ree')}>
                    {row.ree}
                  </td>

                  {/* ICAI Cell */}
                  <td className={cellStyle(row.icai, 'icai')}>
                    {row.icai}
                  </td>

                  {/* ENTSO-E Cell */}
                  <td className={`${cellStyle(row.entsoE, 'entso')} border-r-0`}>
                    {row.entsoE}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
