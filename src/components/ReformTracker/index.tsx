const REFORMS = [
  {
    id: 1,
    title: 'Actualización P.O. 7.4',
    description: 'Permitir a los IBR control dinámico de tensión (Q). Eliminar restricción de factor de potencia fijo. El cambio más relevante según el propio Gobierno para haber evitado el colapso.',
    urgency: 'CRÍTICA',
    origin: 'Gobierno / REE / ENTSO-E',
    originColor: 'var(--alert-red)',
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
    originColor: 'var(--accent)',
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
    originColor: 'var(--alert-orange)',
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
    originColor: 'var(--alert-green)',
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
    originColor: 'var(--alert-red)',
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
    originColor: 'var(--accent)',
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
    originColor: 'var(--text-mono)',
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
    originColor: 'var(--alert-orange)',
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
    originColor: 'var(--accent)',
    status: 'implementado',
    timeline: 'Protocolo bilateral jun. 2025',
    impact: 'medio',
  },
];

import { useState } from 'react';

const REFORM_HISTORY = [
  {
    date: 'Abril 2025',
    title: 'Derogación RD 413/2014 (factor potencia fijo)',
    description: 'El RD 413/2014 forzaba a la generación renovable a operar con factor de potencia fijo, impidiendo el control dinámico de tensión. Su derogación eliminó la restricción que impedía al 82% del parque IBR participar en la estabilización de la red.',
    status: 'IMPLEMENTADO',
    impact: 'CRÍTICO',
    source: 'Gobierno de España / MITECO',
    linkedTo: 'P.O. 7.4',
  },
  {
    date: 'Mayo 2025',
    title: 'Protocolo HVDC modo dinámico ante emergencias',
    description: 'Protocolo bilateral REE-RTE para que el enlace HVDC INELFE-1 cambie automáticamente de PMODE1 (potencia constante) a PMODE2 (control frecuencia) ante caída de frecuencia ibérica. Evita que el enlace exporte potencia durante una emergencia.',
    status: 'IMPLEMENTADO',
    impact: 'ALTO',
    source: 'REE / RTE bilateral',
    linkedTo: 'HVDC INELFE-1',
  },
  {
    date: 'Junio 2025',
    title: 'Actualización P.O. 7.4 — Control dinámico de tensión',
    description: 'Obliga a toda generación con capacidad de control de tensión en tiempo real a activarlo, con penalizaciones por incumplimiento. El propio informe gubernamental reconoce que su entrada en vigor habría sido el cambio más relevante para haber evitado el colapso.',
    status: 'EN TRAMITACIÓN',
    impact: 'CRÍTICO',
    source: 'CNMC / REE',
    linkedTo: 'RD 413/2014',
  },
  {
    date: 'Julio 2025',
    title: 'Compensadores síncronos en zona sur',
    description: 'Instalación de compensadores síncronos (máquinas sin generación) en Andalucía y Extremadura para proveer inercia física, potencia de cortocircuito y control Q continuo. La zona sur disponía de solo 0,2 GVAr de absorción el 28-A.',
    status: 'EN TRAMITACIÓN',
    impact: 'ALTO',
    source: 'REE / Plan de Inversiones',
    linkedTo: 'Balance reactiva zona sur',
  },
  {
    date: 'Sep 2025',
    title: 'Nueva interconexión Francia Mid-Cat/BarMar',
    description: 'Ampliación de la capacidad de interconexión ES-FR hasta el 15% de la demanda punta (objetivo UE). Actualmente en 7,9%. Un mayor acoplamiento con Europa Continental habría reducido la amplitud de las oscilaciones inter-área del 28-A.',
    status: 'EN TRAMITACIÓN',
    impact: 'ALTO',
    source: 'Comisión Europea / ENTSO-E',
    linkedTo: 'Isla energética ibérica',
  },
  {
    date: 'Pendiente',
    title: 'NC RfG 2.0 — Grid-Forming obligatorio ≥ 1 MW',
    description: 'Actualización del Network Code RfG para imponer inversores Grid-Forming como requisito obligatorio para instalaciones ≥ 1 MW. Los inversores deberán comportarse como fuentes de tensión ideales, aportando inercia sintética sin necesidad de red externa.',
    status: 'PROPUESTO',
    impact: 'CRÍTICO',
    source: 'ENTSO-E — Informe Fase II',
    linkedTo: 'IBR Grid-Following vs Grid-Forming',
  },
  {
    date: 'Pendiente',
    title: 'Despliegue PMU en nudos críticos',
    description: 'Unidades de Medición Fasorial en todos los nudos críticos de la red de colectores de 220 kV. Elimina el "punto ciego" del Tap-Lag que impidió al operador ver los 244 kV reales mientras el SCADA mostraba 418 kV en 400 kV.',
    status: 'PROPUESTO',
    impact: 'ALTO',
    source: 'REE / Propuestas post-28A',
    linkedTo: 'Tap-Lag / Observabilidad',
  },
];

export default function ReformTracker() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'historial'>('kanban');
  const countPropuestos = REFORMS.filter((r) => r.status === 'propuesto').length;
  const countTramitacion = REFORMS.filter((r) => r.status === 'en_tramitacion').length;
  const countImplementados = REFORMS.filter((r) => r.status === 'implementado').length;

  // Cálculo de progreso ponderado (impacto alto = 3, medio = 1; en tramitación suma 50%)
  let totalWeight = 0;
  let achievedWeight = 0;
  REFORMS.forEach((r) => {
    const w = r.impact === 'alto' ? 3.0 : 1.0;
    totalWeight += w;
    if (r.status === 'implementado') {
      achievedWeight += w;
    } else if (r.status === 'en_tramitacion') {
      achievedWeight += w * 0.5;
    }
  });

  const percentImplemented = Math.round((achievedWeight / totalWeight) * 100);

  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case 'CRÍTICA':
        return 'bg-alert-red/10 border-alert-red text-alert-red font-bold';
      case 'ALTA':
        return 'bg-alert-orange/10 border-alert-orange text-alert-orange font-bold';
      default:
        return 'bg-alert-yellow/10 border-alert-yellow text-alert-yellow font-bold';
    }
  };

  const getImpactClass = (impact: string) => {
    return impact === 'alto'
      ? 'bg-accent/10 border-accent text-accent font-bold'
      : 'bg-text-secondary/10 border-main text-text-secondary font-bold';
  };

  const renderColumnCards = (statusVal: string) => {
    const colReforms = REFORMS.filter((r) => r.status === statusVal);
    return colReforms.map((item) => (
      <div
        key={item.id}
        className="bg-tertiary border border-main hover:border-accent p-4 rounded-lg shadow-sm transition-all duration-200 flex flex-col justify-between gap-3.5 group relative overflow-hidden"
      >
        {/* Border side strip identifier */}
        <div className="absolute top-0 bottom-0 left-0 w-[3px]" style={{ backgroundColor: item.originColor }}></div>
        
        <div className="pl-2 space-y-2.5">
          {/* Urgency Badge */}
          <div className="flex justify-between items-center font-mono text-[8px] tracking-widest uppercase">
            <span className={`px-1.5 py-0.5 rounded border ${getUrgencyClass(item.urgency)}`}>
              {item.urgency}
            </span>
            <span className={`px-1.5 py-0.5 rounded border ${getImpactClass(item.impact)}`}>
              IMPACTO {item.impact.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-serif text-xs font-bold text-text-primary leading-snug group-hover:text-accent transition-colors">
            {item.title}
          </h4>

          {/* Description */}
          <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-3 select-text">
            {item.description}
          </p>
        </div>

        {/* Card Footer tags */}
        <div className="border-t border-main/40 pt-2.5 mt-1.5 pl-2 flex flex-col gap-1.5 font-mono text-[9px] text-text-secondary">
          <div className="flex justify-between">
            <span>ORIGEN CAUSA:</span>
            <span className="font-bold text-text-primary uppercase text-[8.5px] truncate max-w-[150px]">{item.origin}</span>
          </div>
          <div className="flex justify-between">
            <span>TIMELINE:</span>
            <span className="text-text-primary text-[8.5px] font-bold">{item.timeline}</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex-grow flex flex-col justify-between text-text-primary font-sans animate-fade-in w-full">
      
      {/* Header */}
      <div className="border-b border-main pb-4 mb-4">
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
          Tracker de Reformas y Actuaciones Post-Emergencia
        </h2>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Capítulo VIII · Estado de Modificaciones Regulatorias y Técnicas del Sistema Eléctrico Ibérico
        </p>
      </div>

      {/* METRICS HEADER AREA */}
      <div className="bg-secondary border border-main p-5 rounded-lg shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Count Card Summary with metric-cards class in a 3-column grid */}
        <div className="metric-cards grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
          <div className="metric-card bg-tertiary border border-main p-3.5 rounded-lg flex flex-col justify-between">
            <span className="label font-mono text-[9px] uppercase tracking-wider text-text-secondary">Reformas Propuestas</span>
            <span className="value font-mono text-lg font-bold text-accent mt-1" style={{ fontFamily: 'var(--font-mono)' }}>{countPropuestos}</span>
          </div>
          <div className="metric-card bg-tertiary border border-main p-3.5 rounded-lg flex flex-col justify-between">
            <span className="label font-mono text-[9px] uppercase tracking-wider text-text-secondary">En Tramitación</span>
            <span className="value font-mono text-lg font-bold text-alert-orange mt-1 animate-pulse" style={{ fontFamily: 'var(--font-mono)' }}>{countTramitacion}</span>
          </div>
          <div className="metric-card bg-tertiary border border-main p-3.5 rounded-lg flex flex-col justify-between">
            <span className="label font-mono text-[9px] uppercase tracking-wider text-text-secondary">Implementadas</span>
            <span className="value font-mono text-lg font-bold text-alert-green mt-1" style={{ fontFamily: 'var(--font-mono)' }}>{countImplementados}</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex-grow max-w-md font-mono space-y-2 w-full">
          <div className="flex justify-between text-[10px] text-text-secondary uppercase font-bold">
            <span>Progreso de Implantación Estructural</span>
            <span className="font-bold text-alert-green">{percentImplemented}% COMPLETADO</span>
          </div>
          <div className="w-full bg-tertiary h-3 rounded-full border border-main p-0.5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-alert-red via-alert-orange to-alert-green h-full rounded-full transition-all duration-1000"
              style={{ width: `${percentImplemented}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-main mb-6">
        {(['kanban', 'historial'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 font-mono text-xs tracking-wider uppercase transition-all duration-150 border-b-2 -mb-[1px] ${
              activeTab === tab
                ? 'font-bold text-accent border-accent'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            {tab === 'kanban' ? '📊 Kanban de Reformas' : '📜 Historial de Reformas'}
          </button>
        ))}
      </div>

      {activeTab === 'historial' ? (
        <div className="space-y-4 flex-grow animate-fade-in">
          {REFORM_HISTORY.map((item, idx) => {
            const getStatusBadge = (status: string) => {
              switch (status) {
                case 'IMPLEMENTADO':
                  return 'bg-alert-green/10 border-alert-green/30 text-alert-green';
                case 'EN TRAMITACIÓN':
                  return 'bg-alert-orange/10 border-alert-orange/30 text-alert-orange';
                default:
                  return 'bg-accent/10 border-accent/30 text-accent';
              }
            };

            const getImpactBadge = (impact: string) => {
              switch (impact) {
                case 'CRÍTICO':
                  return 'bg-alert-red/10 border-alert-red/30 text-alert-red font-bold';
                default:
                  return 'bg-text-secondary/10 border-main text-text-secondary';
              }
            };

            return (
              <div
                key={idx}
                className="bg-secondary border border-main p-5 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative overflow-hidden shadow-sm group hover:border-accent transition-all duration-200"
              >
                {/* Visual timeline accent strip */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-[4px]"
                  style={{
                    backgroundColor:
                      item.status === 'IMPLEMENTADO'
                        ? 'var(--alert-green)'
                        : item.status === 'EN TRAMITACIÓN'
                        ? 'var(--alert-orange)'
                        : 'var(--accent)',
                  }}
                ></div>

                <div className="pl-3 space-y-2 flex-grow">
                  <div className="flex flex-wrap gap-2 items-center text-[10px] font-mono">
                    <span className="text-text-muted font-bold">{item.date}</span>
                    <span className="text-text-muted/40">•</span>
                    <span className={`px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${getImpactBadge(item.impact)}`}>
                      {item.impact}
                    </span>
                    {item.linkedTo && (
                      <>
                        <span className="text-text-muted/40">•</span>
                        <span className="text-text-muted">VÍNCULO: {item.linkedTo}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-serif text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed max-w-4xl select-text">
                    {item.description}
                  </p>
                </div>

                <div className="pl-3 md:pl-0 flex flex-col items-start md:items-end gap-1 font-mono text-[9px] text-text-secondary md:text-right min-w-[200px] flex-shrink-0">
                  <span className="uppercase text-text-muted">Fuente de información</span>
                  <span className="font-bold text-text-primary uppercase text-[10px]">{item.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* KANBAN BOARD */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow items-stretch">
          
          {/* Column 1: PROPUESTO */}
          <div className="bg-secondary border border-main p-4 rounded-lg flex flex-col gap-4 relative shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-accent"></div>
            
            <div className="border-b border-main/50 pb-2 flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-accent tracking-widest uppercase">
                📌 PROPUESTO
              </span>
              <span className="text-[10px] bg-accent/10 text-accent px-1.5 rounded font-bold">
                {countPropuestos}
              </span>
            </div>

            <div className="flex-grow flex flex-col gap-3.5 overflow-y-auto max-h-[500px] scrollbar-thin">
              {renderColumnCards('propuesto')}
            </div>
          </div>

          {/* Column 2: EN TRAMITACIÓN */}
          <div className="bg-secondary border border-main p-4 rounded-lg flex flex-col gap-4 relative shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-alert-orange"></div>
            
            <div className="border-b border-main/50 pb-2 flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-alert-orange tracking-widest uppercase">
                ⏳ EN TRAMITACIÓN
              </span>
              <span className="text-[10px] bg-alert-orange/10 text-alert-orange px-1.5 rounded font-bold">
                {countTramitacion}
              </span>
            </div>

            <div className="flex-grow flex flex-col gap-3.5 overflow-y-auto max-h-[500px] scrollbar-thin">
              {renderColumnCards('en_tramitacion')}
            </div>
          </div>

          {/* Column 3: IMPLEMENTADO */}
          <div className="bg-secondary border border-main p-4 rounded-lg flex flex-col gap-4 relative shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-alert-green"></div>
            
            <div className="border-b border-main/50 pb-2 flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-alert-green tracking-widest uppercase">
                ✅ IMPLEMENTADO
              </span>
              <span className="text-[10px] bg-alert-green/10 text-alert-green px-1.5 rounded font-bold">
                {countImplementados}
              </span>
            </div>

            <div className="flex-grow flex flex-col gap-3.5 overflow-y-auto max-h-[500px] scrollbar-thin">
              {renderColumnCards('implementado')}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
