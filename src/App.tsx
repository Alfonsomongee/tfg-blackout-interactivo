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
import NarrativeComparator from './components/NarrativeComparator';
import CausalChain from './components/CausalChain';
import GlobalSearch from './components/GlobalSearch';
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
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Theme state: default 'light' for printed monograph paper aesthetic
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  // Keyboard shortcut for Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Sync theme with document class list
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

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
      status: hasCritical ? 'REG. CRÍTICA' : hasAlert ? 'ALERTA DE SISTEMA' : 'ESTABLE (NOMINAL)'
    };
  }, [zoneVoltages]);

  // Sidebar link styles builder using our unified .nav-item CSS classes
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-item ${isActive ? 'active' : ''}`;

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans flex flex-col tech-grid relative overflow-x-hidden select-none">
      
      {/* Top decorative corporate line */}
      <div className="h-1 w-full bg-gradient-to-r from-accent via-accent-cyan to-alert-red fixed top-0 left-0 right-0 z-50"></div>

      {/* MOBILE HEADER & DRAWER */}
      <header className="lg:hidden h-14 bg-secondary border-b border-main flex justify-between items-center px-4 fixed top-1 left-0 right-0 z-40">
        <div className="flex items-center gap-3">
          <img 
            src="/images/logo-etsi.png" 
            alt="Logo ETSI" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="h-8 w-auto object-contain select-none"
          />
          <div className="flex flex-col">
            <span className="document-stamp w-fit">ENTSO-E TFG</span>
            <span className="text-[10px] font-serif font-bold tracking-tight text-text-primary mt-0.5">Análisis Blackout</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-text-secondary hover:text-text-primary focus:outline-none"
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
        <div className="lg:hidden fixed inset-0 top-15 bg-primary/95 z-30 flex flex-col p-6 gap-0.5 overflow-y-auto">
          {/* CONTEXTO */}
          <div style={{
            padding: '0.75rem 1.25rem 0.375rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)'
          }}>
            CONTEXTO
          </div>
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>⚡ Portada / Monografía</span>
          </NavLink>
          <NavLink to="/brief" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📋 Resumen Ejecutivo</span>
          </NavLink>

          {/* ANÁLISIS */}
          <div style={{
            padding: '1.25rem 1.25rem 0.375rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)'
          }}>
            ANÁLISIS
          </div>
          <NavLink to="/timeline" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>⏳ Línea de Tiempo</span>
          </NavLink>
          <NavLink to="/map" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>🗺️ Mapa de Propagación</span>
          </NavLink>
          <NavLink to="/matrix" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📊 Matriz de Divergencias</span>
          </NavLink>
          <NavLink to="/radar" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>⚖️ Radar de Responsabilidad</span>
          </NavLink>
          <NavLink to="/compare" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📊 Comparador de Narrativas</span>
          </NavLink>
          <NavLink to="/causal" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>🔗 Cadena Causal</span>
          </NavLink>

          {/* HERRAMIENTAS */}
          <div style={{
            padding: '1.25rem 1.25rem 0.375rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)'
          }}>
            HERRAMIENTAS
          </div>
          <NavLink to="/simulator" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>⚡ Simulador Físico</span>
          </NavLink>

          {/* DOCUMENTACIÓN */}
          <div style={{
            padding: '1.25rem 1.25rem 0.375rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)'
          }}>
            DOCUMENTACIÓN
          </div>
          <NavLink to="/dossier" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📚 Dossier TFG</span>
          </NavLink>
          <NavLink to="/lexicon" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📖 Glosario Técnico</span>
          </NavLink>
          <NavLink to="/reforms" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
            <span>📋 Progreso Reformas</span>
          </NavLink>

          <button
            onClick={() => {
              setSearchOpen(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded text-[11px] font-mono border border-main bg-tertiary text-text-secondary hover:text-text-primary uppercase tracking-widest mt-4"
          >
            <span>🔍 BUSCAR... [CTRL+K]</span>
          </button>
          
          <button
            onClick={() => {
              setTheme(theme === 'light' ? 'dark' : 'light');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded text-[11px] font-mono border border-main bg-tertiary text-text-secondary hover:text-text-primary uppercase tracking-widest mt-2"
          >
            {theme === 'light' ? '🌙 TEMA: CONSOLA' : '☀️ TEMA: IMPRESO'}
          </button>
        </div>
      )}

      {/* PERSISTENT SIDEBAR FOR LARGE SCREENS */}
      <aside className="hidden lg:flex flex-col w-64 bg-secondary border-r border-main fixed top-1 bottom-0 left-0 z-40 p-6 justify-between overflow-y-auto">
        <div className="space-y-6">
          {/* Institution / Report Area */}
          <div className="border-b border-main pb-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="document-stamp">ENTSO-E / REE</span>
              <img 
                src="/images/logo-etsi.png" 
                alt="Logo ETSI" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="h-10 w-auto object-contain select-none opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono m-0 leading-tight">
                COMITÉ FORENSE
              </h1>
              <span className="text-[9px] text-text-secondary font-mono block mt-1">
                ESTUDIO DE ESTABILIDAD SINCRONA
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-0.5">
            {/* CONTEXTO */}
            <div style={{
              padding: '0.75rem 1.25rem 0.375rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)'
            }}>
              CONTEXTO
            </div>
            
            <NavLink to="/" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Portada TFG</span>
            </NavLink>

            <NavLink to="/brief" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Resumen Ejecutivo</span>
            </NavLink>

            {/* ANÁLISIS */}
            <div style={{
              padding: '1.25rem 1.25rem 0.375rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)'
            }}>
              ANÁLISIS
            </div>

            <NavLink to="/timeline" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Línea de Tiempo</span>
            </NavLink>

            <NavLink to="/map" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Mapa Propagación</span>
            </NavLink>

            <NavLink to="/matrix" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Matriz Comparada</span>
            </NavLink>

            <NavLink to="/radar" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5" />
              </svg>
              <span>Radar Causalidad</span>
            </NavLink>

            <NavLink to="/compare" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Comparador de Narrativas</span>
            </NavLink>

            <NavLink to="/causal" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Cadena Causal</span>
            </NavLink>

            {/* HERRAMIENTAS */}
            <div style={{
              padding: '1.25rem 1.25rem 0.375rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)'
            }}>
              HERRAMIENTAS
            </div>

            <NavLink to="/simulator" className={linkClass}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Simulador Físico</span>
            </NavLink>

            {/* DOCUMENTACIÓN */}
            <div style={{
              padding: '1.25rem 1.25rem 0.375rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)'
            }}>
              DOCUMENTACIÓN
            </div>

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

            <button
              onClick={() => setSearchOpen(true)}
              className="nav-item text-left flex items-center gap-3 w-full border-t border-main/30 mt-2 pt-2.5"
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="flex-grow text-[11px] font-mono">Buscar...</span>
              <span className="text-[9px] font-mono opacity-60 bg-tertiary border border-main px-1.5 py-0.5 rounded">⌘K</span>
            </button>
          </nav>

          {/* Theme switch button */}
          <div className="border-t border-main pt-4">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded text-[10px] font-mono border border-main bg-tertiary text-text-secondary hover:text-text-primary transition-all duration-200 uppercase tracking-wider"
            >
              {theme === 'light' ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>MODO CONSOLA</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                  <span>MODO IMPRESO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Footer branding */}
        <div className="border-t border-main pt-4">
          <span className="text-[9px] text-text-secondary font-mono uppercase block tracking-wider">
            SISTEMA: US_ETSI_2026
          </span>
          <span className="text-[9px] text-text-secondary/70 font-mono block">
            Alfonso Monge Díaz-Ángel
          </span>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN PANEL */}
      <div className="flex-grow flex flex-col min-h-screen lg:pl-64 pt-14 lg:pt-1">
        
        {/* PERSISTENT ACADEMIC TOP HEADER */}
        <header className="border-b border-main bg-primary/90 backdrop-blur-md px-6 py-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 z-25 relative">
          
          {/* Document Reference Block */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[9px] font-black font-mono bg-tertiary text-accent border border-main px-2 py-0.5 rounded tracking-wide uppercase">
                INFORME TÉCNICO OFICIAL
              </span>
              <span className="text-[10px] text-alert-red font-mono font-bold flex items-center gap-1 bg-alert-red/10 border border-alert-red/30 px-2 py-0.5 rounded">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-alert-red"></span>
                RESOLUCIÓN FORENSE: SEPARACIÓN DE SISTEMA (28 ABRIL 2025)
              </span>
            </div>
            <h1 className="text-lg font-black text-text-primary tracking-tight font-serif m-0 leading-tight">
              Investigación de Estabilidad Dinámica e Inercia en la Península Ibérica
            </h1>
          </div>

          {/* Core publication telemetries */}
          <div className="flex flex-wrap items-center gap-3 bg-secondary border border-main p-2.5 rounded-lg">
            {/* Sincronized system UTC time */}
            <div className="px-3 border-r border-main/40">
              <span className="text-[9px] text-text-secondary uppercase font-mono block">Instante UTC</span>
              <span className="text-xs font-mono font-bold text-text-primary tracking-wider">
                {currentTime.toLocaleTimeString('es-ES', { timeZone: 'UTC' })}
              </span>
            </div>

            {/* Average frequency */}
            <div className="px-3 border-r border-main/40">
              <span className="text-[9px] text-text-secondary uppercase font-mono block">Frecuencia (f)</span>
              <span className="text-xs font-mono font-bold text-text-mono tracking-wider">
                {telemetry.avgFreq.toFixed(3)} Hz
              </span>
            </div>

            {/* Total Demand in Gigawatts */}
            <div className="px-3 border-r border-main/40">
              <span className="text-[9px] text-text-secondary uppercase font-mono block">Carga Peninsular</span>
              <span className="text-xs font-mono font-bold text-text-primary tracking-wider">
                {(telemetry.totalLoad / 1000).toFixed(2)} GW
              </span>
            </div>

            {/* Publication document status */}
            <div className="px-3">
              <span className="text-[9px] text-text-secondary uppercase font-mono block mb-0.5">DOCUMENTO</span>
              <span className="text-[9px] font-mono font-bold text-alert-green bg-alert-green/10 border border-alert-green/30 px-1.5 py-0.5 rounded uppercase">
                {telemetry.status === 'ESTABLE (NOMINAL)' ? 'APROBADO REE' : 'REVISIÓN forense'}
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
            <Route path="/compare" element={<PageWrapper><NarrativeComparator /></PageWrapper>} />
            <Route path="/causal" element={<PageWrapper><CausalChain /></PageWrapper>} />
            <Route path="/simulator" element={<PageWrapper><ContingencySimulator /></PageWrapper>} />
            <Route path="/dossier" element={<PageWrapper><ChapterDossier /></PageWrapper>} />
            <Route path="/lexicon" element={<PageWrapper><TechLexicon /></PageWrapper>} />
            <Route path="/reforms" element={<PageWrapper><ReformTracker /></PageWrapper>} />
          </Routes>
        </main>

        {/* BOTTOM GLOBAL TECHNICAL PANEL */}
        <section className="bg-secondary border-t border-main px-6 py-6 font-mono text-xs z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-text-secondary leading-relaxed">
            <div>
              <h4 className="text-text-primary font-bold uppercase mb-2">// DINÁMICA DE FRECUENCIA (EC. OSCILACIÓN)</h4>
              <p className="select-text text-[11px]">
                La inercia síncrona real define el RoCoF inicial tras perturbaciones de potencia de acuerdo con la ley de balance de potencia. La inercia sintética o reservas ultrarrápidas de frecuencia permiten mitigar y estabilizar el nadir.
              </p>
            </div>
            <div>
              <h4 className="text-text-primary font-bold uppercase mb-2">// MARGEN DE TENSIÓN COLECTOR</h4>
              <p className="select-text text-[11px]">
                La transición energética acopla generadores asíncronos mediante inversores con bajo amortiguamiento dinámico de tensión en subestaciones colectoras lejanas, aumentando el riesgo de avalancha por sobretensión lineal.
              </p>
            </div>
            <div>
              <h4 className="text-text-primary font-bold uppercase mb-2">// DOCUMENTACIÓN ACADÉMICA</h4>
              <p className="select-text text-[11px]">
                Desarrollado como prototipo interactivo para el Trabajo de Fin de Grado de Alfonso Monge Díaz-Angel. Escuela Técnica Superior de Ingeniería, ETSI, Universidad de Sevilla, 2026.
              </p>
            </div>
          </div>
        </section>

        {/* PUBLICATION FOOTER */}
        <footer className="border-t border-main bg-primary py-4.5 px-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-text-secondary/50 z-10 font-mono gap-2">
          <span>ETSI SEVILLA — DEPARTAMENTO DE INGENIERÍA ELÉCTRICA</span>
          <span>AUTOR: ALFONSO MONGE DÍAZ-ANGEL</span>
        </footer>

        {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}

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
