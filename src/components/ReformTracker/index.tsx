
const REFORMS = [
  {
    id: 1,
    title: 'Actualización P.O. 7.4',
    description: 'Permitir a los IBR control dinámico de tensión (Q). Eliminar restricción de factor de potencia fijo. El cambio más relevante según el propio Gobierno para haber evitado el colapso.',
    urgency: 'CRÍTICA',
    origin: 'Gobierno / REE / ENTSO-E',
    originColor: '#8b5cf6',
    status: 'en_tramitacion',
    timeline: 'En proceso desde 2023',
    impact: 'alto',
  },
  {
    id: 2,
    title: 'NC RfG 2.0 — Grid-Forming obligatorio',
    description: 'Inversores ≥1 MW deben operar en modo Grid-Forming. Inercia sintética mandatoria. Fuente de tensión ideal sin PLL externo.',
    urgency: 'CRÍTICA',
    origin: 'ENTSO-E',
    originColor: '#0ea5e9',
    status: 'propuesto',
    timeline: 'Propuesta ENTSO-E 2025',
    impact: 'alto',
  },
  {
    id: 3,
    title: 'Despliegue PMU en nudos críticos',
    description: 'Unidades de Medición Fasorial en todos los nudos críticos de la red de colectores de 220 kV. Eliminar el "punto ciego" del Tap-Lag. Sin PMUs, el debate sobre causalidad es irresoluible.',
    urgency: 'ALTA',
    origin: 'ENTSO-E / ICAI',
    originColor: '#f97316',
    status: 'propuesto',
    timeline: 'Pendiente aprobación inversión',
    impact: 'alto',
  },
  {
    id: 4,
    title: 'Mercado de servicios de inercia sintética',
    description: 'Mecanismo de retribución explícita para inercia sintética, POD y potencia de cortocircuito. Sin precio, no hay incentivo para que los IBR incorporen estas capacidades.',
    urgency: 'ALTA',
    origin: 'FutuRed / CNMC',
    originColor: '#22c55e',
    status: 'propuesto',
    timeline: 'Pendiente diseño de mercado',
    impact: 'alto',
  },
  {
    id: 5,
    title: 'Compensadores síncronos en zona sur',
    description: 'Instalación de compensadores síncronos (máquinas sin generación) en Andalucía y Extremadura para proveer inercia física, potencia de cortocircuito y control Q independientemente del mix.',
    urgency: 'ALTA',
    origin: 'REE / Gobierno',
    originColor: '#ef4444',
    status: 'en_tramitacion',
    timeline: 'Licitación REE 2025-2026',
    impact: 'medio',
  },
  {
    id: 6,
    title: 'Herramientas CSA dinámicas en RCCs',
    description: 'Reemplazar análisis de seguridad coordinada (CSA) basados en flujos de carga estáticos N-1 por simulación dinámica en tiempo real. Capacidad para anticipar inestabilidades de tensión en sistemas IBR.',
    urgency: 'ALTA',
    origin: 'ENTSO-E',
    originColor: '#0ea5e9',
    status: 'propuesto',
    timeline: 'Hoja de ruta 2026-2030',
    impact: 'alto',
  },
  {
    id: 7,
    title: 'Nueva interconexión Francia (Mid-Cat/BarMar)',
    description: 'Ampliación de capacidad de interconexión ES-FR hasta el 15% de la demanda punta (objetivo UE). Actualmente al 7,9%. Mayor interconexión habría amortiguado oscilaciones interárea.',
    urgency: 'MEDIA',
    origin: 'Comisión Europea / Gobierno',
    originColor: '#8b5cf6',
    status: 'en_tramitacion',
    timeline: 'Plazos: 2030+',
    impact: 'medio',
  },
  {
    id: 8,
    title: 'Derogación RD 413/2014 (factor potencia fijo)',
    description: 'El RD 413/2014 forzaba a la generación renovable en régimen especial a operar con factor de potencia fijo, impidiendo participación en el control de tensión. Derogación necesaria para el nuevo marco reactivo.',
    urgency: 'CRÍTICA',
    origin: 'ENTSO-E / ICAI',
    originColor: '#f97316',
    status: 'implementado',
    timeline: 'RD derogado junio 2025',
    impact: 'alto',
  },
  {
    id: 9,
    title: 'Protocolo HVDC modo dinámico ante emergencia',
    description: 'Protocolo bilateral REE-RTE para que el HVDC INELFE-1 revierte automáticamente a PMODE3 (o PMODE2) ante caída de frecuencia ibérica. Evita que un enlace de apoyo se convierta en sumidero durante el colapso.',
    urgency: 'ALTA',
    origin: 'ENTSO-E / REE',
    originColor: '#0ea5e9',
    status: 'implementado',
    timeline: 'Protocolo bilateral jun. 2025',
    impact: 'medio',
  },
];

export default function ReformTracker() {
  // Compute metrics dynamically
  const total = REFORMS.length;
  const countPropuestos = REFORMS.filter((r) => r.status === 'propuesto').length;
  const countTramitacion = REFORMS.filter((r) => r.status === 'en_tramitacion').length;
  const countImplementados = REFORMS.filter((r) => r.status === 'implementado').length;

  // Percentage of implemented reforms (rounded to integer)
  const percentImplemented = Math.round((countImplementados / total) * 100);

  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case 'CRÍTICA':
        return 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]';
      case 'ALTA':
        return 'bg-[#f97316]/10 border-[#f97316]/30 text-[#f97316]';
      default:
        return 'bg-[#eab308]/10 border-[#eab308]/30 text-[#eab308]';
    }
  };

  const getImpactClass = (impact: string) => {
    return impact === 'alto'
      ? 'bg-[#06b6d4]/10 border-[#06b6d4]/30 text-[#06b6d4]'
      : 'bg-[#94a3b8]/10 border-[#94a3b8]/20 text-[#94a3b8]';
  };

  const renderColumnCards = (statusVal: string) => {
    const colReforms = REFORMS.filter((r) => r.status === statusVal);
    return colReforms.map((item) => (
      <div
        key={item.id}
        className="bg-[#0a0e1a] border border-[#1e3a5f]/80 hover:border-[#0ea5e9]/60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-3 group relative overflow-hidden"
      >
        {/* Border side strip identifier */}
        <div className="absolute top-0 bottom-0 left-0 w-[3px]" style={{ backgroundColor: item.originColor }}></div>
        
        <div className="pl-1.5 space-y-2">
          {/* Urgency Badge */}
          <div className="flex justify-between items-center font-mono text-[8px] tracking-widest font-black uppercase">
            <span className={`px-1.5 py-0.5 rounded border ${getUrgencyClass(item.urgency)}`}>
              {item.urgency}
            </span>
            <span className={`px-1.5 py-0.5 rounded border ${getImpactClass(item.impact)}`}>
              IMPACTO {item.impact.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xs font-bold text-white leading-snug group-hover:text-[#06b6d4] transition-colors">
            {item.title}
          </h4>

          {/* Description */}
          <p className="text-[11px] text-[#94a3b8] leading-relaxed line-clamp-3">
            {item.description}
          </p>
        </div>

        {/* Card Footer tags */}
        <div className="border-t border-[#1e3a5f]/40 pt-2.5 mt-1.5 pl-1.5 flex flex-col gap-1.5 font-mono text-[9px]">
          <div className="flex justify-between text-[#475569]">
            <span>ORIGEN CAUSA:</span>
            <span className="font-bold text-[#e2e8f0] uppercase text-[8.5px] truncate max-w-[150px]">{item.origin}</span>
          </div>
          <div className="flex justify-between text-[#475569]">
            <span>TIMELINE:</span>
            <span className="text-white text-[8.5px] font-bold">{item.timeline}</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex-grow flex flex-col justify-between text-[#e2e8f0] font-sans">
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-mono text-[#06b6d4] text-lg uppercase tracking-widest font-black flex items-center gap-2">
          <span>📋</span> TRACKER DE REFORMAS POST-EMERGENCIA
        </h2>
        <p className="text-[#94a3b8] text-xs font-mono uppercase tracking-wider mt-1">
          Hoja de Ruta de Modificaciones Regulatorias y Actuaciones Técnicas Tras el Colapso del 28-A
        </p>
      </div>

      {/* METRICS HEADER AREA */}
      <div className="bg-[#0f1729] border border-[#1e3a5f] p-5 rounded-lg shadow-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Count Pill Summary */}
        <div className="flex flex-wrap gap-2.5 font-mono text-xs">
          <div className="bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#0ea5e9] px-3.5 py-2 rounded-lg font-bold">
            [{countPropuestos} PROPUESTAS]
          </div>
          <div className="bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] px-3.5 py-2 rounded-lg font-bold animate-pulse">
            [{countTramitacion} EN TRAMITACIÓN]
          </div>
          <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] px-3.5 py-2 rounded-lg font-bold">
            [{countImplementados} IMPLEMENTADAS]
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex-grow max-w-md font-mono space-y-2">
          <div className="flex justify-between text-[10px] text-[#94a3b8] uppercase">
            <span>Progreso de Implantación Estructural</span>
            <span className="font-bold text-[#22c55e]">{percentImplemented}% COMPLETADO</span>
          </div>
          <div className="w-full bg-[#0a0e1a] h-3 rounded-full border border-[#1e3a5f]/60 p-0.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#ef4444] via-[#f97316] to-[#22c55e] h-full rounded-full transition-all duration-1000"
              style={{ width: `${percentImplemented}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow items-stretch">
        
        {/* Column 1: PROPUESTO */}
        <div className="bg-[#0f1729] border border-[#1e3a5f] p-4 rounded-lg flex flex-col gap-4 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#06b6d4]"></div>
          
          <div className="border-b border-[#1e3a5f]/50 pb-2 flex justify-between items-center font-mono">
            <span className="text-xs font-black text-[#06b6d4] tracking-widest uppercase">
              📌 PROPUESTO
            </span>
            <span className="text-[10px] bg-[#06b6d4]/10 text-[#06b6d4] px-1.5 rounded">
              {countPropuestos}
            </span>
          </div>

          <div className="flex-grow flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
            {renderColumnCards('propuesto')}
          </div>
        </div>

        {/* Column 2: EN TRAMITACIÓN */}
        <div className="bg-[#0f1729] border border-[#1e3a5f] p-4 rounded-lg flex flex-col gap-4 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#f97316]"></div>
          
          <div className="border-b border-[#1e3a5f]/50 pb-2 flex justify-between items-center font-mono">
            <span className="text-xs font-black text-[#f97316] tracking-widest uppercase">
              ⏳ EN TRAMITACIÓN
            </span>
            <span className="text-[10px] bg-[#f97316]/10 text-[#f97316] px-1.5 rounded">
              {countTramitacion}
            </span>
          </div>

          <div className="flex-grow flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
            {renderColumnCards('en_tramitacion')}
          </div>
        </div>

        {/* Column 3: IMPLEMENTADO */}
        <div className="bg-[#0f1729] border border-[#1e3a5f] p-4 rounded-lg flex flex-col gap-4 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#22c55e]"></div>
          
          <div className="border-b border-[#1e3a5f]/50 pb-2 flex justify-between items-center font-mono">
            <span className="text-xs font-black text-[#22c55e] tracking-widest uppercase">
              ✅ IMPLEMENTADO
            </span>
            <span className="text-[10px] bg-[#22c55e]/10 text-[#22c55e] px-1.5 rounded">
              {countImplementados}
            </span>
          </div>

          <div className="flex-grow flex flex-col gap-3 overflow-y-auto max-h-[500px] scrollbar-thin">
            {renderColumnCards('implementado')}
          </div>
        </div>

      </div>
    </div>
  );
}
