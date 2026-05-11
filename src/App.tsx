import React, { useMemo, useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Hero from './components/Hero/Hero';
import ExecutiveBrief from './components/ExecutiveBrief';

// Lazy-loaded page components
const TimelineNarrative = lazy(() => import('./components/TimelineNarrative').then(m => ({ default: m.TimelineNarrative })));
const DivergenceMatrix = lazy(() => import('./components/DivergenceMatrix').then(m => ({ default: m.DivergenceMatrix })));
const ContingencySimulator = lazy(() => import('./components/ContingencySimulator').then(m => ({ default: m.ContingencySimulator })));
const ChapterDossier = lazy(() => import('./components/ChapterDossier'));
const PropagationMap = lazy(() => import('./components/PropagationMap'));
const ResponsibilityRadar = lazy(() => import('./components/ResponsibilityRadar'));
const TechLexicon = lazy(() => import('./components/TechLexicon'));
const ReformTracker = lazy(() => import('./components/ReformTracker'));
const NarrativeComparator = lazy(() => import('./components/NarrativeComparator'));
const CausalChain = lazy(() => import('./components/CausalChain'));
const ThreeFracturesVisualizer = lazy(() => import('./components/ThreeFracturesVisualizer'));
const ConsensusDivergenceVisualizer = lazy(() => import('./components/ConsensusDivergenceVisualizer'));
const TechnologyRoadmap = lazy(() => import('./components/TechnologyRoadmap'));
const MethodologyTransparency = lazy(() => import('./components/MethodologyTransparency'));
const PositionPolarimeter = lazy(() => import('./components/PositionPolarimeter'));
const ForensicVerdict = lazy(() => import('./components/ForensicVerdict'));
const EnergyContextVisualizer = lazy(() => import('./components/EnergyContextVisualizer'));
const MediaNarrativeAnalysis = lazy(() => import('./components/MediaNarrativeAnalysis'));
const BlackStartTimeline = lazy(() => import('./components/BlackStartTimeline'));
const TribunalFAQ = lazy(() => import('./components/TribunalFAQ'));

// Globals and layout components
import GlobalSearch from './components/GlobalSearch';
import GuidedTour from './components/GuidedTour';
import PresentationMode from './components/PresentationMode';
import FooterSimple from './components/FooterSimple';
import ShareButton from './components/ShareButton';
import ReadingProgress from './components/ReadingProgress';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import { useStore } from './hooks/useStore';

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '60vh', flexDirection: 'column', gap: '1rem'
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '2px solid var(--border)',
        borderTop: '2px solid var(--accent-blue)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{
        fontSize: '0.75rem', color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)'
      }}>
        CARGANDO MÓDULO...
      </p>
    </div>
  );
}

const NAV_GROUPS = [
  {
    title: 'Contexto',
    items: [
      { to: '/', label: 'Portada TFG', type: 'core', icon: '⚡' },
      { to: '/contexto-energetico', label: 'Contexto Energético', type: 'core', icon: '📊' },
      { to: '/brief', label: 'Resumen Ejecutivo', type: 'core', icon: '📋' },
    ]
  },
  {
    title: 'Análisis Forense',
    items: [
      { to: '/timeline', label: 'Línea de Tiempo', type: 'core', icon: '⏳' },
      { to: '/map', label: 'Mapa Propagación', type: 'core', icon: '🗺️' },
      { to: '/matrix', label: 'Matriz Comparada', type: 'detalle', icon: '📊' },
      { to: '/radar', label: 'Radar Causalidad', type: 'detalle', icon: '⚖️' },
      { to: '/compare', label: 'Comparador de Narrativas', type: 'detalle', icon: '📊' },
      { to: '/polarimetro', label: 'Polarímetro', type: 'detalle', icon: '🧭' },
      { to: '/causal', label: 'Cadena Causal', type: 'detalle', icon: '🔗' },
      { to: '/black-start', label: 'Black Start (Fase 4)', type: 'core', icon: '⚡' },
      { to: '/fracturas', label: 'Tres Fracturas', type: 'detalle', icon: '📂' },
      { to: '/consenso', label: 'Consenso/Divergencia', type: 'detalle', icon: '📊' },
      { to: '/narrativa-mediatica', label: 'Narrativa Mediática', type: 'detalle', icon: '📰' },
    ]
  },
  {
    title: 'Modelado y Simulación',
    items: [
      { to: '/simulator', label: 'Simulador Físico', type: 'core', icon: '⚙️' },
      { to: '/roadmap', label: 'Hoja de Ruta', type: 'core', icon: '🗺️' },
    ]
  },
  {
    title: 'Garantía de Calidad',
    items: [
      { to: '/tribunal', label: 'FAQ Tribunal', type: 'core', icon: '⚖️' },
      { to: '/dossier', label: 'Dossier TFG', type: 'detalle', icon: '📚' },
      { to: '/lexicon', label: 'Glosario Técnico', type: 'detalle', icon: '📖' },
      { to: '/metodologia', label: 'Metodología', type: 'detalle', icon: '📊' },
      { to: '/auditoria-reformas', label: 'Historial de Reformas', type: 'detalle', icon: '🔧' },
      { to: '/veredicto', label: 'Veredicto Forense', type: 'core', icon: '⚖️' }
    ]
  }
];

const getBreadcrumb = (pathname: string) => {
  for (const group of NAV_GROUPS) {
    const found = group.items.find(item => item.to === pathname);
    if (found) {
      return { group: group.title, item: found.label };
    }
  }
  return null;
};

// Page wrapper for smooth layout fade-in transition on route change
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const breadcrumb = getBreadcrumb(location.pathname);

  // Sync document title dynamically
  useEffect(() => {
    if (breadcrumb) {
      document.title = `${breadcrumb.item} — TFG Blackout`;
    } else {
      document.title = 'TFG Blackout';
    }
  }, [breadcrumb]);

  return (
    <div
      key={location.pathname}
      className="animate-fade-in flex-grow p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full z-10"
    >
      {breadcrumb && (
        <div className="flex items-center justify-between border-b border-main pb-3 mb-2" data-no-print>
          <div className="flex items-center gap-2 font-mono text-[10px] text-text-muted uppercase tracking-wider">
            <span>{breadcrumb.group}</span>
            <span className="opacity-40">/</span>
            <span className="text-text-secondary font-medium">{breadcrumb.item}</span>
          </div>
          <ShareButton />
        </div>
      )}
      {children}
    </div>
  );
};

const SidebarLink: React.FC<{
  item: { to: string; label: string; type: string; icon: string };
  onClick?: () => void;
}> = ({ item, onClick }) => {
  const isCore = item.type === 'core';
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) => {
        const baseClass = "flex items-center gap-2.5 px-3.5 py-2 font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer text-left border-l-2";
        const typeClass = isCore
          ? "text-[11px] font-bold border-transparent text-text-primary/90 bg-primary/5 hover:bg-primary/20 hover:text-text-primary mb-1 rounded-sm"
          : "text-[10px] text-text-secondary pl-6 border-transparent hover:text-text-primary mb-0.5";
        const activeClass = isActive
          ? isCore
            ? "active bg-raised border-accent text-text-primary font-black"
            : "active bg-raised/50 border-accent/60 text-text-primary font-bold pl-7"
          : "border-transparent";
        return `${baseClass} ${typeClass} ${activeClass}`;
      }}
    >
      <span className="opacity-80 font-normal">{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  );
};

const Layout: React.FC = () => {
  const { zoneVoltages, tourRunning, setTourRunning } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  
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

  // Silent preload of critical paths after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      import('./components/TimelineNarrative');
      import('./components/NarrativeComparator');
      import('./components/ForensicVerdict');
    }, 2000);
    return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans flex flex-col tech-grid relative overflow-x-hidden select-none">
      <ScrollToTop />
      <ReadingProgress />
      <BackToTop />
      
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
        <div className="lg:hidden fixed inset-0 top-15 bg-primary/95 z-30 flex flex-col p-6 gap-2 overflow-y-auto">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="mb-4">
              <div style={{
                padding: '0.5rem 1rem 0.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)'
              }}>
                // {group.title}
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item, iIdx) => (
                  <SidebarLink key={iIdx} item={item} onClick={() => setMobileMenuOpen(false)} />
                ))}
              </div>
            </div>
          ))}

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
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
            {NAV_GROUPS.map((group, gIdx) => (
              <div key={gIdx} className="mb-4">
                <div style={{
                  padding: '0.5rem 1rem 0.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)'
                }}>
                  // {group.title}
                </div>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item, iIdx) => (
                    <SidebarLink key={iIdx} item={item} />
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded text-[10px] font-mono border border-main bg-tertiary text-text-secondary hover:text-text-primary hover:bg-primary uppercase tracking-widest mt-2 transition-all"
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="flex-grow text-left">Buscar...</span>
              <span className="text-[8px] font-mono opacity-60 bg-secondary border border-main px-1 py-0.5 rounded">⌘K</span>
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
            <div className="px-3 border-r border-main/40">
              <span className="text-[9px] text-text-secondary uppercase font-mono block mb-0.5">DOCUMENTO</span>
              <span className="text-[9px] font-mono font-bold text-alert-green bg-alert-green/10 border border-alert-green/30 px-1.5 py-0.5 rounded uppercase">
                {telemetry.status === 'ESTABLE (NOMINAL)' ? 'APROBADO REE' : 'REVISIÓN forense'}
              </span>
            </div>

            {/* Presentation Mode Button */}
            <div className="px-3">
              <button
                data-presentation-btn
                className="px-3 py-1 bg-accent/10 border border-accent/40 rounded text-[10px] font-mono font-bold text-accent hover:bg-accent hover:text-white transition-all duration-200 uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
              >
                🖥 Presentación
              </button>
            </div>
          </div>
        </header>

        {/* CONTAINER FOR ACTIVE SCENE */}
        <main className="flex-grow flex flex-col justify-start">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<PageWrapper><Hero /></PageWrapper>} />
              <Route path="/brief" element={<PageWrapper><ExecutiveBrief /></PageWrapper>} />
              <Route path="/contexto-energetico" element={<PageWrapper><EnergyContextVisualizer /></PageWrapper>} />
              <Route path="/map" element={<PageWrapper><PropagationMap /></PageWrapper>} />
              <Route path="/timeline" element={<PageWrapper><TimelineNarrative /></PageWrapper>} />
              <Route path="/radar" element={<PageWrapper><ResponsibilityRadar /></PageWrapper>} />
              <Route path="/matrix" element={<PageWrapper><DivergenceMatrix /></PageWrapper>} />
              <Route path="/compare" element={<PageWrapper><NarrativeComparator /></PageWrapper>} />
              <Route path="/polarimetro" element={<PageWrapper><PositionPolarimeter /></PageWrapper>} />
              <Route path="/causal" element={<PageWrapper><CausalChain /></PageWrapper>} />
              <Route path="/black-start" element={<PageWrapper><BlackStartTimeline /></PageWrapper>} />
              <Route path="/fracturas" element={<PageWrapper><ThreeFracturesVisualizer /></PageWrapper>} />
              <Route path="/consenso" element={<PageWrapper><ConsensusDivergenceVisualizer /></PageWrapper>} />
              <Route path="/narrativa-mediatica" element={<PageWrapper><MediaNarrativeAnalysis /></PageWrapper>} />
              <Route path="/veredicto" element={<PageWrapper><ForensicVerdict /></PageWrapper>} />
              <Route path="/simulator" element={<PageWrapper><ContingencySimulator /></PageWrapper>} />
              <Route path="/roadmap" element={<PageWrapper><TechnologyRoadmap /></PageWrapper>} />
              <Route path="/dossier" element={<PageWrapper><ChapterDossier /></PageWrapper>} />
              <Route path="/lexicon" element={<PageWrapper><TechLexicon /></PageWrapper>} />
              <Route path="/metodologia" element={<PageWrapper><MethodologyTransparency /></PageWrapper>} />
              <Route path="/reforms" element={<PageWrapper><ReformTracker /></PageWrapper>} />
              <Route path="/tribunal" element={<PageWrapper><TribunalFAQ /></PageWrapper>} />
            </Routes>
          </Suspense>
        </main>

        {/* BOTTOM GLOBAL TECHNICAL PANEL */}
        {location.pathname === '/' ? (
          <>
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
          </>
        ) : (
          <FooterSimple />
        )}

        {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
        <GuidedTour isRunning={tourRunning} setIsRunning={setTourRunning} />

      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <PresentationMode />
      <Layout />
    </Router>
  );
};

export default App;
