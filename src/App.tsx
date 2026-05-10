import React, { useMemo, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Hero } from './components/Hero/Hero';
import { TimelineNarrative } from './components/TimelineNarrative';
import { DivergenceMatrix } from './components/DivergenceMatrix';
import { ContingencySimulator } from './components/ContingencySimulator';
import ChapterDossier from './components/ChapterDossier';
import ExecutiveBrief from './components/ExecutiveBrief';
import PropagationMap from './components/PropagationMap';
import ResponsibilityRadar from './components/ResponsibilityRadar';
import TechLexicon from './components/TechLexicon';
import ReformTracker from './components/ReformTracker';
import { useStore } from './hooks/useStore';

// Page wrapper for smooth layout fade-in transition on route change
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div
      key={location.pathname}
      className="animate-fade-in flex-grow p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full z-10"
    >
      {children}
    </div>
  );
};

const Layout: React.FC = () => {
  const { zoneVoltages } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync real-time UTC / system clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute live averages of telemetry for status display
  const telemetry = useMemo(() => {
    const zones = Object.values(zoneVoltages);
    const avgVoltage = zones.reduce((sum, z) => sum + z.voltage, 0) / zones.length;
    const avgFreq = zones.reduce((sum, z) => sum + z.freq, 0) / zones.length;
    const totalLoad = zones.reduce((sum, z) => sum + z.load, 0);
    const hasCritical = zones.some(z => z.status === 'critical');
    const hasAlert = zones.some(z => z.status === 'alert');

    return {
      avgVoltage,
      avgFreq,
      totalLoad,
      status: hasCritical ? 'CRÍTICO' : hasAlert ? 'ALERTA' : 'NOMINAL'
    };
  }, [zoneVoltages]);

  // Sidebar link styles builder
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded text-[11px] font-mono border transition-all duration-200 uppercase tracking-widest ${
      isActive
        ? 'bg-[#141e35] border-[#0ea5e9] text-[#06b6d4] font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
        : 'bg-transparent border-transparent text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#141e35]/30'
    }`;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e2e8f0] font-sans flex flex-col crt-grid tech-grid relative overflow-x-hidden select-none">
      
      {/* Top decorative gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0ea5e9] via-[#06b6d4] to-[#ef4444] fixed top-0 left-0 right-0 z-50"></div>

      {/* MOBILE HEADER & DRAWER */}
      <header className="lg:hidden h-14 bg-[#0f1729] border-b border-[#1e3a5f] flex justify-between items-center px-4 fixed top-1 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#ef4444] rounded-full animate-pulse"></span>
          <span className="text-xs font-mono font-bold tracking-widest text-[#e2e8f0]">SCADA_TFG</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#94a3b8] hover:text-[#e2e8f0] focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-15 bg-[#0a0e1a]/95 z-30 flex flex-col p-6 gap-2.5 overflow-y-auto">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>⚡ Inicio / SCADA</span>
          </NavLink>
          <NavLink to="/brief" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📋 Resumen Ejecutivo</span>
          </NavLink>
          <NavLink to="/map" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>🗺️ Mapa de Propagación</span>
          </NavLink>
          <NavLink to="/timeline" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>⏳ Línea de Tiempo</span>
          </NavLink>
          <NavLink to="/radar" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>⚖️ Radar de Responsabilidad</span>
          </NavLink>
          <NavLink to="/matrix" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📊 Matriz de Divergencias</span>
          </NavLink>
          <NavLink to="/simulator" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>⚡ Simulador Físico</span>
          </NavLink>
          <NavLink to="/dossier" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📚 Dossier TFG</span>
          </NavLink>
          <NavLink to="/lexicon" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📖 Glosario Técnico</span>
          </NavLink>
          <NavLink to="/reforms" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📋 Seguimiento de Reformas</span>
          </NavLink>
        </div>
      )}

      {/* PERSISTENT SIDEBAR FOR LARGE SCREENS */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f1729] border-r border-[#1e3a5f] fixed top-1 bottom-0 left-0 z-40 p-6 justify-between">
        <div className="space-y-6">
          {/* Logo / Title Area */}
          <div className="border-b border-[#1e3a5f] pb-5">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#06b6d4] animate-pulse"></span>
              <span className="text-[10px] font-mono text-[#06b6d4] uppercase tracking-widest font-black">
                SISTEMA INTEGRAL SCADA
              </span>
            </div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider font-mono m-0 leading-tight">
              CENTRO DE CONTROL
            </h1>
            <span className="text-[9px] text-[#94a3b8] font-mono block mt-1">
              TFG / UNIVERSIDAD DE SEVILLA
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            <NavLink to="/" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Panel de Inicio</span>
            </NavLink>

            <NavLink to="/brief" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Resumen Ejecutivo</span>
            </NavLink>

            <NavLink to="/map" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Mapa Propagación</span>
            </NavLink>

            <NavLink to="/timeline" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Línea de Tiempo</span>
            </NavLink>

            <NavLink to="/radar" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5" />
              </svg>
              <span>Radar Causalidad</span>
            </NavLink>

            <NavLink to="/matrix" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Matriz Comparada</span>
            </NavLink>

            <NavLink to="/simulator" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Simulador Físico</span>
            </NavLink>

            <NavLink to="/dossier" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Dossier TFG</span>
            </NavLink>

            <NavLink to="/lexicon" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Glosario Técnico</span>
            </NavLink>

            <NavLink to="/reforms" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Progreso Reformas</span>
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer branding */}
        <div className="border-t border-[#1e3a5f]/40 pt-4">
          <span className="text-[9px] text-[#94a3b8] font-mono uppercase block tracking-wider">
            SISTEMA: US_ETSI_2026
          </span>
          <span className="text-[9px] text-[#94a3b8]/60 font-mono block">
            Autor: A. Monge Díaz-Angel
          </span>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN PANEL */}
      <div className="flex-grow flex flex-col min-h-screen lg:pl-64 pt-14 lg:pt-1">
        
        {/* PERSISTENT SCADA TOP HEADER */}
        <header className="border-b border-[#1e3a5f] bg-[#0a0e1a]/90 backdrop-blur-md px-6 py-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 z-25 relative">
          
          {/* Slogan and Live Alert Beacon */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[9px] font-black font-mono bg-[#141e35] text-[#0ea5e9] border border-[#1e3a5f] px-2 py-0.5 rounded tracking-wide">
                ANÁLISIS DINÁMICO TFG
              </span>
              <span className="text-[10px] text-[#ef4444] font-mono font-bold alert-blink flex items-center gap-1 bg-[#ef4444]/10 border border-[#ef4444]/30 px-2 py-0.5 rounded">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                SISTEMA COLAPSADO — BLACKOUT 28/04/2025
              </span>
            </div>
            <h1 className="text-lg font-black text-white tracking-widest font-mono uppercase m-0 leading-tight">
              SISTEMA DE ESTABILIDAD SINCRONA IBERICA
            </h1>
          </div>

          {/* Core telemetries */}
          <div className="flex flex-wrap items-center gap-3 bg-[#0f1729]/80 border border-[#1e3a5f] p-2.5 rounded-lg">
            {/* Sincronized system UTC time */}
            <div className="px-3 border-r border-[#1e3a5f]/40">
              <span className="text-[9px] text-[#94a3b8] uppercase font-mono block">Reloj UTC</span>
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                {currentTime.toLocaleTimeString('es-ES', { timeZone: 'UTC' })}
              </span>
            </div>

            {/* Average frequency */}
            <div className="px-3 border-r border-[#1e3a5f]/40">
              <span className="text-[9px] text-[#94a3b8] uppercase font-mono block">Frec. Media (f)</span>
              <span className="text-xs font-mono font-bold text-[#67e8f9] tracking-wider">
                {telemetry.avgFreq.toFixed(3)} Hz
              </span>
            </div>

            {/* Total Demand in Gigawatts */}
            <div className="px-3 border-r border-[#1e3a5f]/40">
              <span className="text-[9px] text-[#94a3b8] uppercase font-mono block">Demanda Total</span>
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                {(telemetry.totalLoad / 1000).toFixed(2)} GW
              </span>
            </div>

            {/* National grid status */}
            <div className="px-3">
              <span className="text-[9px] text-[#94a3b8] uppercase font-mono block mb-0.5">SCADA STATUS</span>
              <span className="text-[10px] font-mono font-bold text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/30 px-1.5 py-0.5 rounded alert-blink">
                {telemetry.status}
              </span>
            </div>
          </div>
        </header>

        {/* CONTAINER FOR ACTIVE SCENE */}
        <main className="flex-grow flex flex-col justify-start">
          <Routes>
            <Route path="/" element={<PageWrapper><Hero /></PageWrapper>} />
            <Route path="/brief" element={<PageWrapper><ExecutiveBrief /></PageWrapper>} />
            <Route path="/map" element={<PageWrapper><PropagationMap /></PageWrapper>} />
            <Route path="/timeline" element={<PageWrapper><TimelineNarrative /></PageWrapper>} />
            <Route path="/radar" element={<PageWrapper><ResponsibilityRadar /></PageWrapper>} />
            <Route path="/matrix" element={<PageWrapper><DivergenceMatrix /></PageWrapper>} />
            <Route path="/simulator" element={<PageWrapper><ContingencySimulator /></PageWrapper>} />
            <Route path="/dossier" element={<PageWrapper><ChapterDossier /></PageWrapper>} />
            <Route path="/lexicon" element={<PageWrapper><TechLexicon /></PageWrapper>} />
            <Route path="/reforms" element={<PageWrapper><ReformTracker /></PageWrapper>} />
          </Routes>
        </main>

        {/* BOTTOM GLOBAL TECHNICAL PANEL */}
        <section className="bg-[#0f1729]/30 border-t border-[#1e3a5f] px-6 py-6 font-mono text-xs z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-[#94a3b8] leading-relaxed">
            <div>
              <h4 className="text-white font-bold uppercase mb-2">// DINÁMICA DE FRECUENCIA</h4>
              <p className="select-text text-[11px]">
                La inercia síncrona real define el RoCoF inicial tras perturbaciones de potencia de acuerdo con la ley de balance de potencia. La inercia sintética o reservas ultrarrápidas de frecuencia permiten mitigar y estabilizar el nadir.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase mb-2">// MARGEN DE TENSIÓN</h4>
              <p className="select-text text-[11px]">
                La transición energética acopla generadores asíncronos mediante inversores con bajo amortiguamiento dinámico de tensión en subestaciones colectoras lejanas, aumentando el riesgo de avalancha por sobretensión lineal.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase mb-2">// RESPONSABILIDAD</h4>
              <p className="select-text text-[11px]">
                Desarrollado como prototipo interactivo para el Trabajo de Fin de Grado de Alfonso Monge Díaz-Angel. Escuela Técnica Superior de Ingeniería, ETSI, Universidad de Sevilla, 2026.
              </p>
            </div>
          </div>
        </section>

        {/* SCADA FOOOTER */}
        <footer className="border-t border-[#1e3a5f] bg-[#0a0e1a]/95 py-4.5 px-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#94a3b8]/50 z-10 font-mono gap-2">
          <span>ETSI SEVILLA — DEPARTAMENTO DE INGENIERÍA ELÉCTRICA</span>
          <span>AUTOR: ALFONSO MONGE DÍAZ-ANGEL</span>
        </footer>

      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
