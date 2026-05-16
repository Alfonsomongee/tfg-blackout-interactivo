import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import TooltipTerm from '../TooltipTerm';

const AXES_DATA = [
  {
    key: 'mallado',
    subject: 'Mallado / Operación REE',
    description: 'Nivel de responsabilidad atribuido a las maniobras de mallado de líneas vacías de 400 kV que inyectaron excesiva potencia reactiva capacitiva.',
    gobierno: 2, ree: 1, icai: 10, entsoe: 4,
  },
  {
    key: 'incumplimiento',
    subject: 'Incumplimiento Generadores',
    description: 'Fallo adjudicado a las desconexiones masivas prematuras del parque fotovoltaico y eólico por límites de tensión rígidos.',
    gobierno: 9, ree: 10, icai: 1, entsoe: 2,
  },
  {
    key: 'obsolescencia',
    subject: 'Obsolescencia P.O.7.4',
    description: 'Causa asociada a la rigidez normativa que impedía a los inversores aportar soporte dinámico de tensión obligatorio.',
    gobierno: 5, ree: 4, icai: 7, entsoe: 10,
  },
  {
    key: 'inercia',
    subject: 'Baja Inercia Síncrona',
    description: 'Gravedad asignada a la caída de inercia a mínimos históricos debido al masivo desplazamiento de centrales tradicionales.',
    gobierno: 3, ree: 2, icai: 5, entsoe: 6,
  },
  {
    key: 'interconexiones',
    subject: 'Insuf. Interconexiones',
    description: 'Vulnerabilidad estructural derivada de la débil interconexión con Francia (7,9% frente al estándar recomendado del 15%).',
    gobierno: 4, ree: 3, icai: 4, entsoe: 7,
  },
  {
    key: 'observabilidad',
    subject: 'Punto Ciego Tap-Lag',
    description: 'Insuficiencia de observabilidad del operador sobre la red de colectores de 220 kV del Sur, ocultando la sobretensión lineal.',
    gobierno: 3, ree: 2, icai: 9, entsoe: 6,
  },
  {
    key: 'despacho',
    subject: 'Disciplina del Mercado',
    description: 'Falta de remuneración o subasta de servicios auxiliares como inercia sintética, potencia de cortocircuito o tensión.',
    gobierno: 2, ree: 1, icai: 8, entsoe: 5,
  },
];

const DIVERGENCES = [
  {
    title: 'Origen de la Reactiva Capacitiva (Sobretensión)',
    reeView: 'Incumplimiento de la absorción inductiva exigida a plantas renovables bajo P.O. 7.4.',
    icaiView: <><>El operador inyectó &gt;0,7 GVAr por mallado excesivo, reduciendo el </><TooltipTerm term="Margen de estabilidad">Margen de estabilidad</TooltipTerm> de Carmona.</>,
    status: 'Divergencia Matemática Absoluta',
  },
  {
    title: 'Desconexiones en Cascada del Parque IBR',
    reeView: <><>Desconexión indebida local de relés ante el </><TooltipTerm term="Disparo raíz">Disparo raíz</TooltipTerm> en Granada.</>,
    icaiView: 'Las plantas actuaron según el RD 413/2014; el transitorio del lazo de enganche (PLL) fue inevitable.',
    status: 'Conflicto Técnico-Regulatorio',
  },
  {
    title: <><TooltipTerm term="Criterio N-1">Criterio N-1</TooltipTerm> de Estabilidad Estático</>,
    reeView: 'La red operaba en zona segura bajo la regla N-1 clásica de despacho diario.',
    icaiView: 'La regla N-1 estática clásica está obsoleta ante dinámicas de electrónica de potencia rápida.',
    status: 'Fallo de Doctrina de Operación',
  },
];

const INSTITUTIONS = [
  { id: 'gobierno', name: 'Gobierno de España', color: '#1e3a8a', dataKey: 'gobierno' },
  { id: 'ree', name: 'Red Eléctrica (REE)', color: '#b91c1c', dataKey: 'ree' },
  { id: 'icai', name: 'ICAI / AELEC', color: '#c2410c', dataKey: 'icai' },
  { id: 'entsoe', name: 'ENTSO-E ICS', color: '#0369a1', dataKey: 'entsoe' },
];
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: {
      subject: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary border border-main p-3 rounded shadow-md font-mono text-[11px] space-y-1">
        <p className="text-text-primary font-bold uppercase">{payload[0].payload.subject}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}/10</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ResponsibilityRadarContent = function ResponsibilityRadar() {
  const [superimposed, setSuperimposed] = useState<boolean>(false);
  const [hoveredDescription, setHoveredDescription] = useState<string | null>(null);

  const handlePolarAngleHover = (item: { value: string }) => {
    const matched = AXES_DATA.find((axis) => axis.subject === item.value);
    if (matched) {
      setHoveredDescription(matched.description);
    }
  };

  const handlePolarAngleLeave = () => {
    setHoveredDescription(null);
  };

  return (
    <div className="flex-grow flex flex-col justify-between text-text-primary font-sans animate-fade-in w-full">
      
      {/* Header */}
      <div className="border-b border-main pb-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
            Radar de Atribución Causal y Responsabilidades
          </h2>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Capítulo VI · Triangulación Forense del Reparto de Causas del Blackout Peninsular
          </p>
        </div>

        {/* Control Button */}
        <div className="flex gap-2">
          <button
            onClick={() => setSuperimposed(!superimposed)}
            className={`px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase border transition-all duration-200 cursor-pointer ${
              superimposed
                ? 'bg-accent text-white border-accent shadow-sm'
                : 'bg-transparent border-main text-text-secondary hover:text-text-primary hover:bg-tertiary/40'
            }`}
          >
            {superimposed ? '⚡ Modo Detalle (Individual)' : '⚡ Superponer Todos'}
          </button>
        </div>
      </div>

      {/* Axis Hover Description Area */}
      <div className="bg-tertiary border-l-4 border-accent p-3.5 rounded-r min-h-[50px] flex items-center mb-6">
        <span className="text-xs font-mono text-text-secondary select-text">
          {hoveredDescription ? `🔍 ${hoveredDescription}` : 'Pasa el cursor sobre los nombres de las dimensiones del radar para ver su definición forense.'}
        </span>
      </div>

      {/* Charts Display */}
      <div className="flex-grow min-h-[380px] flex items-center justify-center">
        {superimposed ? (
          /* COMBINED RADAR */
          <div className="w-full max-w-2xl aspect-square lg:max-h-[360px] bg-secondary border border-main p-5 rounded-lg relative shadow-sm">
            <div className="absolute top-4 left-4 font-mono text-[9px] text-text-mono uppercase tracking-widest font-bold">
              // COMPARACIÓN ANALÍTICA INTEGRADA
            </div>
            <ResponsiveContainer width="100%" height="95%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={AXES_DATA}>
                <PolarGrid stroke="var(--border-main)" />
                <PolarAngleAxis
                  dataKey="subject"
                  stroke="var(--text-secondary)"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
                  onMouseEnter={handlePolarAngleHover}
                  onMouseLeave={handlePolarAngleLeave}
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="var(--border-main)" tick={{ fill: 'var(--text-secondary)', fontSize: 8 }} />
                {INSTITUTIONS.map((inst) => (
                  <Radar
                    key={inst.id}
                    name={inst.name}
                    dataKey={inst.dataKey}
                    stroke={inst.color}
                    fill={inst.color}
                    fillOpacity={0.05}
                    strokeWidth={2}
                    className="glow-line"
                  />
                ))}
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', paddingTop: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* 2X2 GRID OF INDIVIDUAL RADARS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {INSTITUTIONS.map((inst) => (
              <div key={inst.id} className="bg-secondary border border-main p-4 rounded-lg flex flex-col justify-between relative overflow-hidden h-[240px] shadow-sm hover:border-accent transition-all duration-200">
                <div className="absolute top-0 left-0 right-0 h-[2.5px]" style={{ backgroundColor: inst.color }}></div>
                <div className="font-mono text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: inst.color }}>
                  [{inst.name}]
                </div>
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="55%" data={AXES_DATA}>
                      <PolarGrid stroke="var(--border-main)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        stroke="var(--text-secondary)"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 7, fontFamily: 'var(--font-mono)' }}
                        onMouseEnter={handlePolarAngleHover}
                        onMouseLeave={handlePolarAngleLeave}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="var(--border-main)" tick={false} />
                      <Radar
                        name={inst.name}
                        dataKey={inst.dataKey}
                        stroke={inst.color}
                        fill={inst.color}
                        fillOpacity={0.08}
                        strokeWidth={1.5}
                        className="glow-line"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TABLE OF DIVERGENCES */}
      <div className="mt-8 bg-secondary border border-main p-5 rounded-lg shadow-sm">
        <div className="font-mono text-alert-orange text-[10px] tracking-widest uppercase font-bold border-b border-main/50 pb-2.5 mb-4">
          // LOS TRES EJES DE CONFLICTO DOCTRINAL IRRECONCILIABLES
        </div>

        <div className="overflow-x-auto">
          <table className="table-academic">
            <thead>
              <tr>
                <th className="w-[25%]">Eje de Disputa Forense</th>
                <th className="w-[35%]">Marco Argumental REE / Gobierno</th>
                <th className="w-[30%]">Marco Técnico ICAI / ENTSO-E</th>
                <th className="text-center w-[12%]">Severidad</th>
              </tr>
            </thead>
            <tbody>
              {DIVERGENCES.map((div, index) => (
                <tr key={index} className="hover:bg-tertiary/40 transition-colors">
                  <td className="py-3 px-3 font-serif font-bold text-text-primary select-text leading-tight">{div.title}</td>
                  <td className="py-3 px-3 text-alert-red font-sans select-text leading-relaxed text-xs">{div.reeView}</td>
                  <td className="py-3 px-3 text-accent font-sans select-text leading-relaxed text-xs">{div.icaiView}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block bg-alert-red/10 border border-alert-red text-alert-red px-2 py-0.5 rounded text-[8px] tracking-widest uppercase font-bold">
                      CRÍTICO
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ResponsibilityRadarContent);
