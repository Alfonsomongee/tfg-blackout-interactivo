import React from 'react';
import TechnicalImage from '../TechnicalImage';

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
    ree: "2,30 s",
    icai: "—",
    entsoE: "—",
    type: "exclusive",
    notes: "REE estima la inercia global de todo el sistema peninsular en base a modelos estáticos tradicionales."
  },
  {
    dimension: "Inercia zona sur",
    unidad: "s",
    ree: "—",
    icai: "1,30 s",
    entsoE: "mín. 2,0 s",
    type: "contrast",
    notes: "Vulnerabilidad extrema calculada por el ICAI frente al estándar recomendado por ENTSO-E para seguridad de red."
  },
  {
    dimension: "Inercia zona centro",
    unidad: "s",
    ree: "—",
    icai: "1,84 s",
    entsoE: "mín. 2,0 s",
    type: "contrast",
    notes: "Inercia del corredor central estimada por debajo del límite de seguridad operacional europeo."
  },
  {
    dimension: "Inercia zona NW",
    unidad: "s",
    ree: "—",
    icai: "3,84 s",
    entsoE: "—",
    type: "exclusive",
    notes: "Zona con mayor inercia debido a la concentración del parque hidroeléctrico y térmico síncrono remanente."
  },
  {
    dimension: "HVDC setpoint",
    unidad: "MW",
    ree: "1.000 MW",
    icai: "1.000 MW",
    entsoE: "1.000 MW",
    type: "consensus",
    notes: "Consenso sobre el consignado estático de exportación comercial fijado previo al inicio de la perturbación."
  },
  {
    dimension: "HVDC modo colapso",
    unidad: "—",
    ree: "PMODE1",
    icai: "PMODE1",
    entsoE: "PMODE1",
    type: "consensus",
    notes: "El enlace operaba en modo rígido de potencia constante, anulando el lazo automático de soporte de frecuencia."
  },
  {
    dimension: "Generación perdida",
    unidad: "MW",
    ree: "~2.000 MW",
    icai: "~2.000 MW",
    entsoE: "—",
    type: "consensus",
    notes: "REE e ICAI coinciden en el volumen del primer bloque de generación renovable desconectado."
  },
  {
    dimension: "Margen colapso V",
    unidad: "MW",
    ree: "—",
    icai: "1.019 MW",
    entsoE: "—",
    type: "exclusive",
    notes: "Cálculo analítico del ICAI sobre el estrecho margen antes del colapso de sobretensión en colectores."
  },
  {
    dimension: "Máx. import Francia",
    unidad: "MW",
    ree: "3.807 MW",
    icai: "—",
    entsoE: "—",
    type: "exclusive",
    notes: "Flujo máximo alcanzado por la interconexión de corriente alterna antes del disparo por sobrecorriente."
  },
  {
    dimension: "Duración colapso",
    unidad: "s",
    ree: "22,50 s",
    icai: "—",
    entsoE: "—",
    type: "exclusive",
    notes: "Tiempo transcurrido desde el transitorio en Granada hasta la apertura definitiva de fronteras."
  },
  {
    dimension: "Oscilación 1",
    unidad: "Hz",
    ree: "forzada",
    icai: "natural",
    entsoE: "forzada",
    type: "divergence",
    notes: "Discrepancia teórica sobre el origen y naturaleza del modo oscilatorio inicial registrado a 0,63 Hz."
  },
  {
    dimension: "Causa raíz",
    unidad: "—",
    ree: "multifactor",
    icai: "tensión",
    entsoE: "multifactor",
    type: "divergence",
    notes: "REE/ENTSO-E determinan un sumatorio accidental aislado; ICAI demuestra colapso de tensión por colectores."
  }
];

export const DivergenceMatrix: React.FC = () => {
  const consensusCount = MATRIX_DATA.filter(row => row.type === 'consensus').length;
  const divergenceCount = MATRIX_DATA.filter(row => row.type === 'divergence').length;

  return (
    <div className="flex-grow p-1 animate-fade-in flex flex-col gap-6 w-full">
      
      {/* Title block */}
      <div className="border-b border-main pb-4 mb-2">
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
          Tabla de Consenso y Divergencia Forense
        </h2>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Capítulo IV · Matriz de Convergencias Técnicas de los Informes REE, ICAI y ENTSO-E
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Table & Counters Column */}
        <div className="xl:col-span-2 bg-secondary border border-main rounded-lg p-6 shadow-sm flex flex-col gap-6">
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-sans select-text">
            La siguiente tabla muestra el análisis cruzado de parámetros clave del incidente. Sigue las directrices clásicas de edición científica, utilizando coloraciones sobrias y descriptores estáticos para delimitar el consenso, las discrepancias analíticas o los aportes exclusivos de cada institución pericial.
          </p>

          {/* Dynamic Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-tertiary border border-main p-4 rounded flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Puntos de Consenso Absoluto</span>
                <h3 className="text-lg font-mono font-bold text-alert-green mt-1">{consensusCount} puntos</h3>
              </div>
              <span className="text-xl text-alert-green/30 font-mono font-bold">✓</span>
            </div>
            <div className="bg-tertiary border border-main p-4 rounded flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Fracturas Analíticas (Divergencia)</span>
                <h3 className="text-lg font-mono font-bold text-alert-red mt-1">{divergenceCount} puntos</h3>
              </div>
              <span className="text-xl text-alert-red/30 font-mono font-bold">⚠</span>
            </div>
          </div>

          {/* Legend block */}
          <div className="flex flex-wrap gap-4 bg-tertiary border border-main p-4 rounded text-[10px] font-mono uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-alert-green/10 border border-alert-green text-alert-green block"></span>
              <span>Consenso Absoluto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-alert-red/10 border border-alert-red text-alert-red block"></span>
              <span>Divergencia Operacional (⚠)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-accent-cyan/10 border border-accent-cyan text-accent-cyan block"></span>
              <span>Discrepancia de Límites</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-tertiary border border-main block"></span>
              <span>Dato Exclusivo / Neutro</span>
            </div>
          </div>

          {/* LaTeX Styled Table */}
          <div className="overflow-x-auto">
            <table className="table-academic">
              <thead>
                <tr>
                  <th className="w-[30%]">Parámetro / Dimensión Analizada</th>
                  <th className="text-center w-20">Unidad</th>
                  <th className="text-center">Informe Oficial REE</th>
                  <th className="text-center">Modelo Forense ICAI</th>
                  <th className="text-center">Dictamen ENTSO-E</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX_DATA.map((row, idx) => {
                  const isConsensus = row.type === 'consensus';
                  const isDivergence = row.type === 'divergence';
                  const isContrast = row.type === 'contrast';

                  const getCellClass = (val: string, source: 'ree' | 'icai' | 'entsoE') => {
                    if (val === '—') {
                      return "text-text-secondary/30 text-center font-mono py-4 px-4";
                    }
                    if (isConsensus) {
                      return "bg-alert-green/5 text-alert-green font-bold text-center py-4 px-4 font-mono";
                    }
                    if (isDivergence) {
                      return "bg-alert-red/5 text-alert-red font-bold text-center py-4 px-4 font-mono";
                    }
                    if (isContrast && (source === 'icai' || source === 'entsoE')) {
                      return "bg-alert-orange/5 text-alert-orange font-semibold text-center py-4 px-4 font-mono";
                    }
                    return "text-text-secondary text-center py-4 px-4 font-mono";
                  };

                  return (
                    <tr key={idx} className="hover:bg-tertiary/40 transition-colors duration-150">
                      {/* Dimension Name & Static Footnote */}
                      <td className="py-4 px-4 font-serif font-bold text-text-primary select-text leading-tight">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-xs md:text-sm">
                            {(isDivergence || isContrast) && <span className="text-alert-red font-mono">⚠</span>}
                            {row.dimension}
                          </span>
                          {row.notes && (
                            <span className="text-[10px] text-text-secondary font-sans font-normal leading-normal">
                              {row.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Unit */}
                      <td className="py-4 px-3 text-center font-mono text-xs text-text-mono font-bold">
                        {row.unidad}
                      </td>

                      {/* REE Cell */}
                      <td className={getCellClass(row.ree, 'ree')}>
                        {(isDivergence || isContrast) && row.ree !== '—' ? `⚠ ${row.ree}` : row.ree}
                      </td>

                      {/* ICAI Cell */}
                      <td className={getCellClass(row.icai, 'icai')}>
                        {(isDivergence || isContrast) && row.icai !== '—' ? `⚠ ${row.icai}` : row.icai}
                      </td>

                      {/* ENTSO-E Cell */}
                      <td className={getCellClass(row.entsoE, 'entsoE')}>
                        {(isDivergence || isContrast) && row.entsoE !== '—' ? `⚠ ${row.entsoE}` : row.entsoE}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footnote of table */}
          <div className="text-[11px] text-text-secondary font-serif italic text-left select-text">
            Tabla IV.1: Matriz de consenso físico-técnico comparado entre los informes periciales oficiales para el colapso del Sistema Peninsular Español de 2025.
          </div>
        </div>

        {/* Support Evidence Column (Mapa de la Red de Transporte) */}
        <div className="flex flex-col gap-4">
          <TechnicalImage
            src="/images/mapa-400kv.png"
            alt="Mapa de la Red de Transporte de 400 kV"
            caption="Figura IV.2: Esquema geográfico de los corredores críticos de transporte de 400 kV en la Península Ibérica y puntos de inyección capacitiva de reactiva."
            source="Fuente: Red Eléctrica de España (REE)"
          />
        </div>

      </div>

    </div>
  );
};

export default DivergenceMatrix;
