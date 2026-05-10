import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const MIX_EVOLUTION = [
  { year: '2010', renovables: 30, termicas: 45, nuclear: 19, otras: 6 },
  { year: '2015', renovables: 42, termicas: 35, nuclear: 19, otras: 4 },
  { year: '2020', renovables: 52, termicas: 26, nuclear: 16, otras: 6 },
  { year: '2024', renovables: 59, termicas: 24, nuclear: 13, otras: 4 },
];

const MIX_28A = [
  { name: 'Solar FV', gw: 18, pct: 53, color: 'var(--warning)' },
  { name: 'Eólica', gw: 3.5, pct: 11, color: 'var(--info)' },
  { name: 'Nuclear', gw: 3.4, pct: 10, color: 'var(--nominal)' },
  { name: 'Bombeo', gw: 3.0, pct: 9, color: 'var(--accent-blue)' },
  { name: 'CCGT Gas', gw: 1.6, pct: 3, color: 'var(--text-secondary)' },
  { name: 'Otras', gw: 4.7, pct: 14, color: 'var(--border)' },
];

const INERTIA_DATA = [
  { zone: 'Zona Sur', inertia: 1.30, limit: 2.0, label: 'CRÍTICA' },
  { zone: 'Zona Centro', inertia: 1.84, limit: 2.0, label: 'DEGRADADA' },
  { zone: 'Zona NW', inertia: 3.84, limit: 2.0, label: 'SEGURA' },
  { zone: 'Global', inertia: 2.30, limit: 2.0, label: 'NOMINAL' },
];

const INTERCONNECTION_DATA = [
  { country: 'España (real)', pct: 7.9, target: 15 },
  { country: 'Alemania', pct: 18.2, target: 15 },
  { country: 'Francia', pct: 22.4, target: 15 },
  { country: 'Polonia', pct: 14.1, target: 15 },
  { country: 'Italia', pct: 9.8, target: 15 },
];

const PRECURSORS = [
  { date: '16 abr 2025', event: 'Primer episodio de inestabilidad de tensión registrado', severity: 'warning' },
  { date: '22 abr 2025', event: 'Sobretensión >430 kV en Núñez de Balboa. Disparos múltiples de plantas FV/Eólica', severity: 'alarm' },
  { date: '24 abr 2025', event: 'Segundo episodio de inestabilidad. Mismas plantas que dispararán el 28-A', severity: 'alarm' },
  { date: '28 abr 12:00', event: 'Demanda valle: 25.184 MW (56% de la punta histórica). 82% IBR', severity: 'alarm' },
  { date: '28 abr 12:03', event: 'Oscilación forzada 0,63 Hz. Ratio amortiguamiento cae al 1% (límite: 5%)', severity: 'critical' },
];

export default function EnergyContextVisualizer() {
  const [activeTab, setActiveTab] = useState<'mix' | '28a' | 'island' | 'eas'>('mix');

  const tabs = [
    { id: 'mix', label: 'Mix 2010→2024' },
    { id: '28a', label: 'Estado 28-A' },
    { id: 'island', label: '"Isla Energética"' },
    { id: 'eas', label: 'EAS y precursores' },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 select-text">
      {/* HEADER SECTION */}
      <div className="border-b border-main pb-4 mb-6">
        <p className="t-subheading text-[10px] uppercase font-mono tracking-widest text-text-secondary block mb-1">
          Cap. 2 — Contexto energético
        </p>
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
          La vulnerabilidad estructural de la red ibérica
        </h2>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Por qué el sistema eléctrico ibérico era estructuralmente vulnerable antes del 28 de abril. Datos reales del parque generador, la inercia zonal, la condición de "isla energética" y los precursores ignorados.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 flex-wrap border-b border-main/20 pb-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-mono uppercase font-bold border rounded-md transition-all duration-150 cursor-pointer select-none ${
              activeTab === tab.id
                ? 'bg-accent border-accent text-white'
                : 'bg-tertiary/40 border-main/50 text-text-secondary hover:text-text-primary hover:border-main'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MIX EVOLUTION */}
      {activeTab === 'mix' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-secondary border border-main rounded-lg p-5">
            <h3 className="font-serif text-base font-bold text-text-primary mb-2 text-left">
              Evolución del parque generador español (2010–2024)
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-6 max-w-3xl text-left">
              Si en 2010 las fuentes térmicas y nucleares representaban el 65% de la producción, en 2024 las renovables habían invertido esa proporción, alcanzando el 59% del mix total. En enero de 2025, casi el 66% de la capacidad total procedía de fuentes descarbonizadas.
            </p>
            <div className="w-full" style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MIX_EVOLUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                  <YAxis stroke="var(--text-secondary)" unit="%" tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-raised)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)', marginTop: '10px' }} />
                  <Bar dataKey="renovables" name="Renovables" fill="var(--nominal)" />
                  <Bar dataKey="termicas" name="Térmicas" fill="var(--alarm)" />
                  <Bar dataKey="nuclear" name="Nuclear" fill="var(--info)" />
                  <Bar dataKey="otras" name="Otras" fill="var(--text-secondary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Capacidad renovable instalada (ene 2025)', value: '>100 GW', color: 'var(--nominal)' },
              { label: 'Solar FV instalada', value: '48,1 GW', color: 'var(--warning)' },
              { label: 'Eólica instalada', value: '33,1 GW', color: 'var(--info)' },
              { label: 'Ciclos combinados (CCGT)', value: '26 GW / <15% uso', color: 'var(--text-secondary)' },
              { label: 'Reducción emisiones vs 2007', value: '75,7%', color: 'var(--nominal)' },
              { label: 'Emisiones sector eléctrico 2024', value: '27,0 Mt CO₂', color: 'var(--alarm)' },
            ].map((m, i) => (
              <div key={i} className="bg-secondary border border-main rounded-lg p-4 flex flex-col justify-between">
                <p className="text-[10px] text-text-secondary uppercase font-mono tracking-wider mb-2 text-left">
                  {m.label}
                </p>
                <p className="text-xl font-bold text-text-primary text-left" style={{ color: m.color }}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 28-A STATE */}
      {activeTab === '28a' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-secondary border border-main rounded-lg p-5">
            <h3 className="font-serif text-base font-bold text-text-primary mb-2 text-left">
              Estado del sistema a las 12:30 CEST del 28-A: "Paradoja de la abundancia"
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-6 max-w-3xl text-left">
              Temperaturas primaverales (≈25°C) + día festivo = demanda valle de 25.184 MW (56% de la punta histórica). La generación no síncrona (IBR) cubría un histórico 82% del mix.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mix de Generacion */}
              <div className="bg-surface/30 p-4 border border-main/50 rounded-lg">
                <p className="text-xs font-mono font-bold uppercase text-text-primary mb-4 text-left border-b border-main/30 pb-2">
                  // Mix de generación (12:30 CEST)
                </p>
                <div className="space-y-4">
                  {MIX_28A.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                          <span className="font-bold text-text-primary">{item.name}</span>
                        </div>
                        <span className="font-mono text-text-secondary">
                          {item.gw} GW ({item.pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-tertiary rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ background: item.color, width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inercia por zona */}
              <div className="bg-surface/30 p-4 border border-main/50 rounded-lg flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono font-bold uppercase text-text-primary mb-4 text-left border-b border-main/30 pb-2">
                    // Inercia por zona (ICAI)
                  </p>
                  <div className="space-y-4">
                    {INERTIA_DATA.map((z, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-text-primary">{z.zone}</span>
                          <span className="font-mono font-bold" style={{ color: z.inertia < 2.0 ? 'var(--alarm)' : 'var(--nominal)' }}>
                            H = {z.inertia} s — {z.label}
                          </span>
                        </div>
                        <div className="h-2.5 bg-tertiary rounded-full overflow-hidden relative">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              background: z.inertia < 2.0 ? 'var(--alarm)' : 'var(--nominal)',
                              width: `${Math.min(100, (z.inertia / 5) * 100)}%`
                            }}
                          />
                          {/* Limit line indicator */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-warning"
                            style={{ left: `${(2.0 / 5) * 100}%` }}
                            title="Límite ENTSO-E (2.0 s)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-main/30 text-left">
                  <p className="text-[10px] text-text-secondary font-mono leading-normal">
                    <span className="text-warning">■</span> Línea amarilla representa el límite recomendado por ENTSO-E (2,0 s). La baja inercia en la Zona Sur (1,30 s) y Centro (1,84 s) restó capacidad amortiguadora natural al sistema.
                  </p>
                  <p className="text-[9px] text-text-secondary/60 font-mono mt-1">
                    Fuente: Dictamen de Modelado de ICAI / Compass Lexecon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ISLA ENERGÉTICA */}
      {activeTab === 'island' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-secondary border border-main rounded-lg p-5">
            <h3 className="font-serif text-base font-bold text-text-primary mb-2 text-left">
              La Península Ibérica como "isla energética"
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-6 max-w-3xl text-left">
              La capacidad de interconexión de España con Francia se sitúa históricamente entre el 3% y el 5% de la capacidad de generación instalada, o un 7,9% frente a la demanda punta. El objetivo vinculante de la UE para 2030 es alcanzar un mínimo del 15%.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interconnection chart */}
              <div className="bg-surface/30 p-4 border border-main/50 rounded-lg">
                <p className="text-xs font-mono font-bold uppercase text-text-primary mb-4 text-left border-b border-main/30 pb-2">
                  // Interconexión (% demanda punta) vs objetivo UE (15%)
                </p>
                <div className="w-full" style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={INTERCONNECTION_DATA} layout="vertical" margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" stroke="var(--text-secondary)" tick={{ fontSize: 9, fontFamily: 'var(--font-mono)' }} unit="%" />
                      <YAxis dataKey="country" type="category" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} width={90} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-raised)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <Bar dataKey="pct" name="Interconexión real" fill="var(--info)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-text-secondary font-mono mt-3 text-left">
                  Línea de objetivo regulatorio: 15% (Unión Europea 2030). España se mantiene a la cola en un 7,9%. Fuente: MIT CEEPR.
                </p>
              </div>

              {/* Interconnection metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: 'Capacidad HVDC INELFE-1',
                    value: '2.000 MW',
                    note: 'Santa Llogaia → Baixas. Cambió a PMODE1 a 12:08 CEST',
                    color: 'var(--warning)',
                  },
                  {
                    label: 'Máx. importación AC desde Francia',
                    value: '4.609 MW',
                    note: 'Alcanzado a las 12:33:19 CEST. Llegó tarde.',
                    color: 'var(--alarm)',
                  },
                  {
                    label: 'HVDC en PMODE1 exportando',
                    value: '1.000 MW',
                    note: 'Continuó extrayendo potencia de España durante el colapso',
                    color: 'var(--alarm)',
                  },
                  {
                    label: 'Interconexión con Marruecos',
                    value: '900 MW',
                    note: 'Desconectado a 12:33:20 por subfrecuencia 49,5 Hz',
                    color: 'var(--info)',
                  },
                ].map((m, i) => (
                  <div key={i} className="bg-surface/30 border border-main/50 rounded-lg p-4 flex flex-col justify-between text-left" style={{ borderLeft: `4px solid ${m.color}` }}>
                    <div>
                      <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider mb-1">
                        {m.label}
                      </p>
                      <p className="text-lg font-bold text-text-primary mb-1">
                        {m.value}
                      </p>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-snug">
                      {m.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EAS Y PRECURSORES */}
      {activeTab === 'eas' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-secondary border border-main rounded-lg p-5">
            <h3 className="font-serif text-base font-bold text-text-primary mb-2 text-left">
              La "falsa normalidad" del EAS: precursores ignorados
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-6 max-w-3xl text-left">
              A las 12:32:00 CEST, el estado oficial del sistema era "Normal". El sistema transitó abruptamente de "Normal" a "Blackout" a las 12:33:29 CEST, sin pasar por ninguna fase intermedia de Alerta o Emergencia.
            </p>

            {/* Pipeline flowchart */}
            <p className="text-xs font-mono font-bold uppercase text-text-primary mb-3 text-left">
              // Secuencia de estados del EAS (Area Security Assessment)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {[
                { state: 'Normal', active: false, passed: true, color: 'var(--nominal)' },
                { state: 'Alerta', active: false, passed: false, skipped: true, color: 'var(--warning)' },
                { state: 'Emergencia', active: false, passed: false, skipped: true, color: 'var(--alarm)' },
                { state: 'Apagón', active: true, passed: false, color: 'var(--alarm)' },
                { state: 'Restauración', active: false, passed: false, color: 'var(--info)' },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`border rounded-lg p-3 text-center flex flex-col justify-center relative overflow-hidden select-none ${
                    s.active
                      ? 'bg-alert-red/10 border-alert-red'
                      : s.skipped
                      ? 'bg-tertiary/20 border-main/30'
                      : 'bg-surface/30 border-main'
                  }`}
                >
                  {/* Decorative indicator badge */}
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: s.color }} />
                  <p className={`text-[11px] font-mono font-bold uppercase leading-tight ${
                    s.active ? 'text-alert-red' : s.skipped ? 'text-text-secondary/50' : 'text-text-primary'
                  }`}>
                    {s.state}
                  </p>
                  {s.skipped && (
                    <span className="text-[9px] font-mono text-alert-red font-bold uppercase mt-1">
                      (SALTADO)
                    </span>
                  )}
                  {s.active && (
                    <span className="text-[9px] font-mono text-alert-red font-bold uppercase animate-pulse mt-1">
                      (ACTIVO)
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Precursors timeline */}
            <p className="text-xs font-mono font-bold uppercase text-text-primary mb-3 text-left">
              // Precursores físicos de la inestabilidad de tensión
            </p>
            <div className="space-y-3.5 mb-6">
              {PRECURSORS.map((p, i) => (
                <div
                  key={i}
                  className="bg-surface/30 border border-main rounded-lg p-3.5 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start text-left"
                  style={{
                    borderLeft: `4px solid ${
                      p.severity === 'critical' ? 'var(--alarm)' :
                      p.severity === 'alarm' ? 'var(--alarm)' : 'var(--warning)'
                    }`
                  }}
                >
                  <p className="text-[10px] text-text-secondary font-mono uppercase font-bold tracking-wider sm:min-w-[100px] m-0">
                    {p.date}
                  </p>
                  <p className="text-xs text-text-primary m-0 leading-normal">
                    {p.event}
                  </p>
                </div>
              ))}
            </div>

            {/* Insight panel */}
            <div className="bg-surface border border-main p-4 rounded-lg text-left">
              <p className="text-xs text-text-secondary leading-relaxed m-0">
                El EAS actuó no como herramienta de alerta temprana (early warning), sino como notificador post mortem del colapso. Esta limitación estructural —la incapacidad del sistema europeo de monitorización para capturar dinámica rápida de tensión en redes de baja inercia— constituye una de las lecciones regulatorias centrales del incidente. Fuente: ENTSO-E Factual Report.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
