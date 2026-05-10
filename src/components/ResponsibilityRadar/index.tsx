import { useState } from 'react';
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

const AXES_DATA = [
  {
    key: 'mallado',
    subject: 'Mallado / Operación REE',
    description: 'Culpa asignada a las maniobras de mallado de líneas vacías de 400 kV que inyectaron excesivos GVAr capacitivos.',
    gobierno: 2, ree: 1, icai: 10, entsoe: 4,
  },
  {
    key: 'incumplimiento',
    subject: 'Incumplimiento Generadores',
    description: 'Responsabilidad imputada a las desconexiones prematuras de parques de inversores ante transitorios de tensión.',
    gobierno: 9, ree: 10, icai: 1, entsoe: 2,
  },
  {
    key: 'obsolescencia',
    subject: 'Obsolescencia P.O.7.4',
    description: 'Causa asociada a la restricción regulatoria que prohibía a los IBR regular tensión dinámica de forma obligatoria.',
    gobierno: 5, ree: 4, icai: 7, entsoe: 10,
  },
  {
    key: 'inercia',
    subject: 'Baja Inercia Síncrona',
    description: 'Importancia dada al mínimo histórico de generadores rotatorios pesados acoplados el 28 de abril.',
    gobierno: 3, ree: 2, icai: 5, entsoe: 6,
  },
  {
    key: 'interconexiones',
    subject: 'Insuf. Interconexiones',
    description: 'Debilidad estructural derivada de la baja capacidad de enlace transpirenaica (7,9% vs 15% UE).',
    gobierno: 4, ree: 3, icai: 4, entsoe: 7,
  },
  {
    key: 'observabilidad',
    subject: 'Fallo Observabilidad (Tap-Lag)',
    description: 'Punto ciego operativo (transformadores OLTC) que ocultó la sobretensión destructiva del lado de 220 kV.',
    gobierno: 3, ree: 2, icai: 9, entsoe: 6,
  },
  {
    key: 'despacho',
    subject: 'Disciplina Mercado Despacho',
    description: 'Ausencia de incentivos de mercado para remunerar inercia, potencia de cortocircuito y absorción reactiva.',
    gobierno: 2, ree: 1, icai: 8, entsoe: 5,
  },
];

const DIVERGENCES = [
  {
    title: 'Origen de la Reactiva Capacitiva (Sobretensión)',
    reeView: 'Señalaba incumplimiento del P.O. 7.4; aduce que los generadores privados debieron absorber el excedente.',
    icaiView: 'Demostró que el operador inyectó de forma descontrolada >0,7 GVAr mediante mallados, superando el límite físico de absorción del sur (0,2 GVAr).',
    status: 'Divergencia Matemática Absoluta',
  },
  {
    title: 'Desconexiones en Cascada del Parque IBR',
    reeView: 'Comportamiento indebido e injustificado de las turbinas eólicas e inversores solares.',
    icaiView: 'Las plantas actuaron con protecciones de tensión locales correctas conforme al RD 413/2014; el PLL colapsó por debilidad local.',
    status: 'Conflicto Técnico-Regulatorio',
  },
  {
    title: 'El Criterio de Estabilidad N-1 Estático',
    reeView: 'El despacho era seguro bajo N-1 estático estándar. El evento fue de "fuerza mayor".',
    icaiView: 'El criterio N-1 de flujos de carga estático está obsoleto para inestabilidad dinámica y de electrónica de potencia rápida.',
    status: 'Fallo de Doctrina de Operación',
  },
];

const INSTITUTIONS = [
  { id: 'gobierno', name: 'Gobierno de España', color: '#8b5cf6', dataKey: 'gobierno' },
  { id: 'ree', name: 'Red Eléctrica (REE)', color: '#ef4444', dataKey: 'ree' },
  { id: 'icai', name: 'ICAI / AELEC', color: '#f97316', dataKey: 'icai' },
  { id: 'entsoe', name: 'ENTSO-E ICS', color: '#0ea5e9', dataKey: 'entsoe' },
];

export default function ResponsibilityRadar() {
  const [superimposed, setSuperimposed] = useState<boolean>(false);
  const [hoveredDescription, setHoveredDescription] = useState<string | null>(null);

  const handlePolarAngleHover = (item: any) => {
    const matched = AXES_DATA.find((axis) => axis.subject === item.value);
    if (matched) {
      setHoveredDescription(matched.description);
    }
  };

  const handlePolarAngleLeave = () => {
    setHoveredDescription(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f1729] border border-[#1e3a5f] p-3 rounded shadow-xl font-mono text-[11px] space-y-1">
          <p className="text-white font-bold uppercase">{payload[0].payload.subject}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }}>
              {p.name}: <span className="font-bold">{p.value}/10</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-grow flex flex-col justify-between text-[#e2e8f0] font-sans">
      
      {/* Header */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-mono text-[#06b6d4] text-lg uppercase tracking-widest font-black flex items-center gap-2">
            <span>⚖️</span> RADAR DE RESPONSABILIDAD CAUSAL
          </h2>
          <p className="text-[#94a3b8] text-xs font-mono uppercase tracking-wider mt-1">
            Análisis de Atribución Causal y Discrepancias sobre el Apagón del 28-A
          </p>
        </div>

        {/* Control Button */}
        <div className="flex gap-2">
          <button
            onClick={() => setSuperimposed(!superimposed)}
            className={`px-4 py-2 rounded text-xs font-mono border transition-all duration-300 ${
              superimposed
                ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] shadow-[0_0_12px_rgba(14,165,233,0.25)]'
                : 'bg-[#0f1729] border-[#1e3a5f] text-[#94a3b8] hover:text-white hover:bg-[#141e35]'
            }`}
          >
            {superimposed ? '⚡ MODO DETALLE (2X2)' : '⚡ SUPERPONER TODO'}
          </button>
        </div>
      </div>

      {/* Axis Hover Description Area */}
      <div className="bg-[#0f1729]/40 border border-[#1e3a5f]/30 p-3 rounded h-12 flex items-center justify-center text-center mb-4 transition-all">
        <span className="text-xs font-mono text-[#94a3b8] italic">
          {hoveredDescription ? `🔍 ${hoveredDescription}` : 'Pasa el cursor por las esquinas del radar para ver el desglose del factor causal'}
        </span>
      </div>

      {/* Charts Display */}
      <div className="flex-grow min-h-[380px] flex items-center justify-center">
        {superimposed ? (
          /* COMBINED RADAR */
          <div className="w-full max-w-2xl aspect-square lg:max-h-[360px] bg-[#0f1729] border border-[#1e3a5f] p-4 rounded-lg relative">
            <div className="absolute top-3 left-4 font-mono text-[10px] text-[#0ea5e9] uppercase tracking-widest font-bold">
              // COMPARATIVA INTEGRADA
            </div>
            <ResponsiveContainer width="100%" height="95%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={AXES_DATA}>
                <PolarGrid stroke="#1e3a5f" />
                <PolarAngleAxis
                  dataKey="subject"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  onMouseEnter={handlePolarAngleHover}
                  onMouseLeave={handlePolarAngleLeave}
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#1e3a5f" tick={{ fill: '#475569', fontSize: 8 }} />
                {INSTITUTIONS.map((inst) => (
                  <Radar
                    key={inst.id}
                    name={inst.name}
                    dataKey={inst.dataKey}
                    stroke={inst.color}
                    fill={inst.color}
                    fillOpacity={0.06}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: '#94a3b8', paddingTop: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* 2X2 GRID OF INDIVIDUAL RADARS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {INSTITUTIONS.map((inst) => (
              <div key={inst.id} className="bg-[#0f1729] border border-[#1e3a5f] p-4 rounded-lg flex flex-col justify-between relative overflow-hidden h-[240px]">
                <div className="absolute top-0 left-0 right-0 h-[2.5px]" style={{ backgroundColor: inst.color }}></div>
                <div className="font-mono text-[9px] uppercase tracking-widest font-black mb-1" style={{ color: inst.color }}>
                  [{inst.name}]
                </div>
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="55%" data={AXES_DATA}>
                      <PolarGrid stroke="#1e3a5f" />
                      <PolarAngleAxis
                        dataKey="subject"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 6.5, fontFamily: 'JetBrains Mono' }}
                        onMouseEnter={handlePolarAngleHover}
                        onMouseLeave={handlePolarAngleLeave}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#1e3a5f" tick={false} />
                      <Radar
                        name={inst.name}
                        dataKey={inst.dataKey}
                        stroke={inst.color}
                        fill={inst.color}
                        fillOpacity={0.12}
                        strokeWidth={1.5}
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
      <div className="mt-6">
        <div className="font-mono text-[#f97316] text-[10px] tracking-widest uppercase font-bold border-b border-[#1e3a5f]/40 pb-2 mb-3">
          // LOS 3 EJES DE FRACTURA IRRECONCILIABLES DEL CAPÍTULO 5
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-[11px] leading-relaxed">
            <thead>
              <tr className="border-b border-[#1e3a5f] text-[#94a3b8] uppercase text-[9px] tracking-wider bg-[#0f1729]/50">
                <th className="py-2.5 px-3 w-[25%] border-r border-[#1e3a5f]/40">Eje de Disputa</th>
                <th className="py-2.5 px-3 w-[35%] border-r border-[#1e3a5f]/40">Marco REE / Gobierno</th>
                <th className="py-2.5 px-3 w-[30%] border-r border-[#1e3a5f]/40">Marco ICAI / ENTSO-E</th>
                <th className="py-2.5 px-3 w-[10%] text-center">Severidad</th>
              </tr>
            </thead>
            <tbody>
              {DIVERGENCES.map((div, index) => (
                <tr key={index} className="border-b border-[#1e3a5f]/30 hover:bg-[#141e35]/30 transition-colors">
                  <td className="py-2.5 px-3 border-r border-[#1e3a5f]/40 font-bold text-white">{div.title}</td>
                  <td className="py-2.5 px-3 border-r border-[#1e3a5f]/40 text-[#ef4444]">{div.reeView}</td>
                  <td className="py-2.5 px-3 border-r border-[#1e3a5f]/40 text-[#0ea5e9]">{div.icaiView}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] px-1.5 py-0.5 rounded text-[8px] tracking-widest uppercase font-bold animate-pulse">
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
}
