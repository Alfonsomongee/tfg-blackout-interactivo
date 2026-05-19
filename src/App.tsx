import React, { useMemo, useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero/Hero';
import ExecutiveBrief from './components/ExecutiveBrief';
import PageTransition from './components/PageTransition';
import ToastProvider from './components/Notifications/ToastProvider';
import { MethodologyBanner } from './components/MethodologyBanner';

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
const CascadaVisualization = lazy(() => import('./components/CascadaVisualization'));
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
const CollapseCountdown = lazy(() => import('./components/CollapseCountdown'));
const DivergenceTable = lazy(() => import('./components/DivergenceTable'));
const ReactiveBalance = lazy(() => import('./components/ReactiveBalance'));
const EnergyTrilemma = lazy(() => import('./components/EnergyTrilemma'));
const ForensicGallery = lazy(() => import('./components/ForensicGallery'));
const QuizTribunal = lazy(() => import('./components/QuizTribunal'));
const DataCardsShowcase = lazy(() => import('./components/DataCardsShowcase'));
const CollapseTimelineMoment = lazy(() => import('./components/CollapseTimelineMoment'));
const SpainHeatmap = lazy(() => import('./components/SpainHeatmap'));
const InertiaGraph = lazy(() => import('./components/InertiaGraph'));
const InstitutionComparator = lazy(() => import('./components/InstitutionComparator'));
const ForensicTimeline = lazy(() => import('./components/ForensicTimeline'));
const MixGeneracion = lazy(() => import('./components/MixGeneracion'));
const MedidasPropuestas = lazy(() => import('./components/MedidasPropuestas'));
const InterconexionViz = lazy(() => import('./components/InterconexionViz'));
const TresNarrativas = lazy(() => import('./components/TresNarrativas'));
const InerciaVulnerabilidad = lazy(() => import('./components/InerciaVulnerabilidad'));
const GridFollowingViz = lazy(() => import('./components/GridFollowingViz'));
const TapLagExplainer = lazy(() => import('./components/TapLagExplainer'));
const Testimonios = lazy(() => import('./components/Testimonios'));

import { CommandPalette } from './components/CommandPalette';
import { Breadcrumbs } from './components/Breadcrumbs';
import { ModulesGrid } from './components/ModulesGrid';
import { SidebarMinimal } from './components/SidebarMinimal';
import GuidedTour from './components/GuidedTour';
import PresentationMode from './components/PresentationMode';
import FooterSimple from './components/FooterSimple';
import ShareButton from './components/ShareButton';
import ReadingProgress from './components/ReadingProgress';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import { ModuleProgress } from './components/ModuleProgress';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { GlossaryFloating } from './components/GlossaryFloating';
import { ModuleNavigation } from './components/ModuleNavigation';
import { useStore } from './hooks/useStore';

function getAllNavItems(navGroups: typeof NAV_GROUPS) {
  return navGroups.flatMap(group => group.items);
}

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
      { to: '/countdown', label: '⏱ 90 Segundos (Tiempo Real)', type: 'core', icon: '⏱️' },
      { to: '/cascada', label: 'Cascada de Colapso', type: 'core', icon: '🌊' },
      { to: '/timeline', label: 'Línea de Tiempo', type: 'core', icon: '⏳' },
      { to: '/map', label: 'Mapa Propagación', type: 'core', icon: '🗺️' },
      { to: '/matrix', label: 'Matriz Comparada', type: 'detalle', icon: '📊' },
      { to: '/radar', label: 'Radar Causalidad', type: 'detalle', icon: '⚖️' },
      { to: '/compare', label: 'Comparador de Narrativas', type: 'detalle', icon: '📊' },
      { to: '/divergencias', label: 'Divergencias Irreconciliables', type: 'core', icon: '⚡' },
      { to: '/reactiva', label: 'Balance de Reactiva', type: 'detalle', icon: '📊' },
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
    title: 'Interactivo',
    items: [
      { to: '/quiz-tribunal', label: 'Quiz: ¿Quién dijo esto?', type: 'core', icon: '🎯' },
      { to: '/data-cards', label: 'Datos del Colapso', type: 'core', icon: '📊' },
      { to: '/timeline-moment', label: 'Los 33 Segundos', type: 'core', icon: '⏱️' },
      { to: '/heat-map', label: 'Mapa de Impacto', type: 'core', icon: '🗺️' },
      { to: '/inercia-graph', label: 'Gráfico de Inercia', type: 'core', icon: '📉' },
      { to: '/comparador-arrastra', label: 'Comparador Institucional', type: 'core', icon: '⚖️' },
      { to: '/forensic-timeline', label: 'Cronología Forense', type: 'core', icon: '⏱️' },
      { to: '/mix-generacion', label: 'Mix de Generación', type: 'core', icon: '⚡' },
      { to: '/medidas-propuestas', label: 'Medidas Propuestas', type: 'core', icon: '📋' },
      { to: '/interconexion', label: 'Interconexión ES-FR', type: 'core', icon: '🔌' },
    ]
  },
  {
    title: 'Análisis Comparativo',
    items: [
      { to: '/tres-narrativas', label: 'Tres Narrativas', type: 'core', icon: '⚖️' },
      { to: '/inercia-vuln', label: 'Inercia del Sistema', type: 'core', icon: '🌀' },
      { to: '/grid-following', label: 'IBR Grid-Following', type: 'core', icon: '⚡' },
      { to: '/tap-lag', label: 'Fenómeno Tap-Lag', type: 'core', icon: '🔍' },
      { to: '/testimonios', label: 'Testimonios del 28-A', type: 'detalle', icon: '💬' },
    ]
  },
  {
    title: 'Garantía de Calidad',
    items: [
      { to: '/tribunal', label: 'FAQ Tribunal', type: 'core', icon: '⚖️' },
      { to: '/dossier', label: 'Dossier TFG', type: 'detalle', icon: '📚' },
      { to: '/galeria', label: 'Galería de Figuras', type: 'detalle', icon: '🖼️' },
      { to: '/lexicon', label: 'Glosario Técnico', type: 'detalle', icon: '📖' },
      { to: '/metodologia', label: 'Metodología', type: 'detalle', icon: '📊' },
      { to: '/reforms', label: 'Historial de Reformas', type: 'detalle', icon: '🔧' },
      { to: '/trilema', label: 'Trilema Energético', type: 'core', icon: '🔺' },
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

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const breadcrumb = getBreadcrumb(location.pathname);

  useEffect(() => {
    const customTitles: Record<string, string> = {
      '/countdown': '⏱ 90 Segundos — Colapso en Tiempo Real | Apagón 28-A',
      '/cascada': 'Cascada de Colapso — Visualización Forense | Apagón 28-A',
      '/divergencias': 'Divergencias Irreconciliables | Apagón 28-A',
      '/reactiva': 'Balance de Reactiva | Apagón 28-A',
      '/trilema': 'Trilema Energético | Apagón 28-A',
      '/galeria': 'Galería Forense — Figuras del TFG | Apagón 28-A',
      '/quiz-tribunal': 'Quiz Forense — ¿Quién dijo esto? | Apagón 28-A',
      '/data-cards': 'Datos del Colapso — 12 Métricas Clave | Apagón 28-A',
      '/timeline-moment': 'Los 33 Segundos del Colapso | Apagón 28-A',
      '/heat-map': 'Mapa de Impacto por Zonas | Apagón 28-A',
      '/inercia-graph': 'Gráfico de Inercia Síncrona | Apagón 28-A',
      '/comparador-arrastra': 'Comparador Institucional | Apagón 28-A',
      '/forensic-timeline': 'Cronología Forense — 26 Eventos Oficiales | Apagón 28-A',
      '/mix-generacion': 'Mix de Generación 28-A — 82% Renovable | Apagón 28-A',
      '/medidas-propuestas': 'Medidas Propuestas — Plan Post-Colapso | Apagón 28-A',
      '/interconexion': 'Interconexión ES-FR — Flujo HVDC | Apagón 28-A',
      '/tres-narrativas': 'Tres Narrativas Institucionales — Análisis Comparativo | Apagón 28-A',
      '/inercia-vuln': 'Inercia del Sistema y RoCoF — Vulnerabilidad 28-A | Apagón 28-A',
      '/grid-following': 'IBR Grid-Following vs Grid-Forming | Apagón 28-A',
      '/tap-lag': 'Fenómeno Tap-Lag — Tesis ICAI | Apagón 28-A',
    };

    if (customTitles[location.pathname]) {
      document.title = customTitles[location.pathname];
    } else if (breadcrumb) {
      document.title = `${breadcrumb.item} — TFG Blackout`;
    } else {
      document.title = 'TFG Blackout';
    }
  }, [breadcrumb, location.pathname]);

  return (
    <PageTransition key={location.pathname}>
      <div className="flex-grow p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full z-10">
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
    </PageTransition>
  );
};

const Layout: React.FC = () => {
  const { zoneVoltages, tourRunning, setTourRunning } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem('sidebar-collapsed') === 'true'; } catch { return false; }
  });
  const [theme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'light' ? 'light' : 'dark';
  });

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

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

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      import('./components/TimelineNarrative');
      import('./components/NarrativeComparator');
      import('./components/ForensicVerdict');
      import('./components/CollapseCountdown');
      import('./components/DivergenceTable');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-primary text-text-primary font-sans tech-grid relative select-none" style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <SidebarMinimal collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      </div>

      {/* Main content column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ScrollToTop />
        <ReadingProgress />
        <BackToTop />
        <ModulesGrid />

        <div className="h-1 w-full bg-gradient-to-r from-accent via-accent-cyan to-alert-red fixed top-0 left-0 right-0 z-50"></div>

        <div className="flex-grow flex flex-col min-h-screen pt-1">
          <LoadingSkeleton />
          <header className="glass-header border-b border-main px-6 py-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 z-25 relative sticky top-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[9px] font-black font-mono bg-tertiary text-accent border border-main px-2 py-0.5 rounded tracking-wide uppercase">INFORME TÉCNICO OFICIAL</span>
              <span className="text-[10px] text-alert-red font-mono font-bold flex items-center gap-1 bg-alert-red/10 border border-alert-red/30 px-2 py-0.5 rounded"><span className="inline-block w-1.5 h-1.5 rounded-full bg-alert-red"></span>RESOLUCIÓN FORENSE: SEPARACIÓN DE SISTEMA (28 ABRIL 2025)</span>
            </div>
            <div role="heading" aria-level={2} className="text-lg font-black text-text-primary tracking-tight font-serif m-0 leading-tight">
              Investigación de Estabilidad Dinámica e Inercia en la Península Ibérica
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 bg-secondary border border-main p-2.5 rounded-lg">
            <div className="px-3 border-r border-main/40">
              <span className="text-[9px] text-text-secondary uppercase font-mono block">Instante UTC</span>
              <span className="text-xs font-mono font-bold text-text-primary tracking-wider">{currentTime.toLocaleTimeString('es-ES', { timeZone: 'UTC' })}</span>
            </div>
            <div className="px-3 border-r border-main/40">
              <span className="text-[9px] text-text-secondary uppercase font-mono block">Frecuencia (f)</span>
              <span className="text-xs font-mono font-bold text-text-mono tracking-wider">{telemetry.avgFreq.toFixed(3)} Hz</span>
            </div>
            <div className="px-3 border-r border-main/40">
              <span className="text-[9px] text-text-secondary uppercase font-mono block">Carga Peninsular</span>
              <span className="text-xs font-mono font-bold text-text-primary tracking-wider">{(telemetry.totalLoad / 1000).toFixed(2)} GW</span>
            </div>
            <div className="px-3 border-r border-main/40">
              <span className="text-[9px] text-text-secondary uppercase font-mono block mb-0.5">DOCUMENTO</span>
              <span className="text-[9px] font-mono font-bold text-alert-green bg-alert-green/10 border border-alert-green/30 px-1.5 py-0.5 rounded uppercase">{telemetry.status === 'ESTABLE (NOMINAL)' ? 'APROBADO REE' : 'REVISIÓN forense'}</span>
            </div>
            <div className="px-3">
              <button data-presentation-btn className="px-3 py-1 bg-accent/10 border border-accent/40 rounded text-[10px] font-mono font-bold text-accent hover:bg-accent hover:text-white transition-all duration-200 uppercase tracking-wider cursor-pointer flex items-center gap-1.5">
                🖥 Presentación
              </button>
            </div>
          </div>
        </header>

        <Breadcrumbs />

        <main className="flex-grow flex flex-col justify-start">
          {location.pathname !== '/' && <MethodologyBanner />}
          <ModuleProgress />
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageWrapper><Hero /></PageWrapper>} />
                <Route path="/brief" element={<PageWrapper><ExecutiveBrief /></PageWrapper>} />
                <Route path="/contexto-energetico" element={<PageWrapper><EnergyContextVisualizer /></PageWrapper>} />
                <Route path="/countdown" element={<PageWrapper><CollapseCountdown /></PageWrapper>} />
                <Route path="/cascada" element={<PageWrapper><CascadaVisualization /></PageWrapper>} />
                <Route path="/map" element={<PageWrapper><PropagationMap /></PageWrapper>} />
                <Route path="/timeline" element={<PageWrapper><TimelineNarrative /></PageWrapper>} />
                <Route path="/radar" element={<PageWrapper><ResponsibilityRadar /></PageWrapper>} />
                <Route path="/matrix" element={<PageWrapper><DivergenceMatrix /></PageWrapper>} />
                <Route path="/compare" element={<PageWrapper><NarrativeComparator /></PageWrapper>} />
                <Route path="/divergencias" element={<PageWrapper><DivergenceTable /></PageWrapper>} />
                <Route path="/reactiva" element={<PageWrapper><ReactiveBalance /></PageWrapper>} />
                <Route path="/trilema" element={<PageWrapper><EnergyTrilemma /></PageWrapper>} />
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
                <Route path="/galeria" element={<PageWrapper><ForensicGallery /></PageWrapper>} />
                <Route path="/lexicon" element={<PageWrapper><TechLexicon /></PageWrapper>} />
                <Route path="/metodologia" element={<PageWrapper><MethodologyTransparency /></PageWrapper>} />
                <Route path="/reforms" element={<PageWrapper><ReformTracker /></PageWrapper>} />
                <Route path="/tribunal" element={<PageWrapper><TribunalFAQ /></PageWrapper>} />
                <Route path="/quiz-tribunal" element={<PageWrapper><QuizTribunal /></PageWrapper>} />
                <Route path="/data-cards" element={<PageWrapper><DataCardsShowcase /></PageWrapper>} />
                <Route path="/timeline-moment" element={<PageWrapper><CollapseTimelineMoment /></PageWrapper>} />
                <Route path="/heat-map" element={<PageWrapper><SpainHeatmap /></PageWrapper>} />
                <Route path="/inercia-graph" element={<PageWrapper><InertiaGraph /></PageWrapper>} />
                <Route path="/comparador-arrastra" element={<PageWrapper><InstitutionComparator /></PageWrapper>} />
                <Route path="/forensic-timeline" element={<PageWrapper><ForensicTimeline /></PageWrapper>} />
                <Route path="/mix-generacion" element={<PageWrapper><MixGeneracion /></PageWrapper>} />
                <Route path="/medidas-propuestas" element={<PageWrapper><MedidasPropuestas /></PageWrapper>} />
                <Route path="/interconexion" element={<PageWrapper><InterconexionViz /></PageWrapper>} />
                <Route path="/tres-narrativas" element={<PageWrapper><TresNarrativas /></PageWrapper>} />
                <Route path="/inercia-vuln" element={<PageWrapper><InerciaVulnerabilidad /></PageWrapper>} />
                <Route path="/grid-following" element={<PageWrapper><GridFollowingViz /></PageWrapper>} />
                <Route path="/tap-lag" element={<PageWrapper><TapLagExplainer /></PageWrapper>} />
                <Route path="/testimonios" element={<PageWrapper><Testimonios /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>

        {location.pathname === '/' ? (
          <>
            <section className="bg-secondary border-t border-main px-6 py-6 font-mono text-xs z-10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-text-secondary leading-relaxed">
                <div>
                  <h4 className="text-text-primary font-bold uppercase mb-2">// DINÁMICA DE FRECUENCIA (EC. OSCILACIÓN)</h4>
                  <p className="select-text text-[11px]">La inercia síncrona real define el RoCoF inicial tras perturbaciones de potencia de acuerdo con la ley de balance de potencia. La inercia sintética o reservas ultrarrápidas de frecuencia permiten mitigar y estabilizar el nadir.</p>
                </div>
                <div>
                  <h4 className="text-text-primary font-bold uppercase mb-2">// MARGEN DE TENSIÓN COLECTOR</h4>
                  <p className="select-text text-[11px]">La transición energética acopla generadores asíncronos mediante inversores con bajo amortiguamiento dinámico de tensión en subestaciones colectoras lejanas, aumentando el riesgo de avalancha por sobretensión lineal.</p>
                </div>
                <div>
                  <h4 className="text-text-primary font-bold uppercase mb-2">// DOCUMENTACIÓN ACADÉMICA</h4>
                  <p className="select-text text-[11px]">Desarrollado como prototipo interactivo para el Trabajo de Fin de Grado de Alfonso Monge Díaz-Angel. Escuela Técnica Superior de Ingeniería, ETSI, Universidad de Sevilla, 2026.</p>
                </div>
              </div>
            </section>
            <footer className="border-t border-main bg-primary py-4.5 px-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-text-secondary/50 z-10 font-mono gap-2">
              <span>ETSI SEVILLA — DEPARTAMENTO DE INGENIERÍA ELÉCTRICA</span>
              <span>AUTOR: ALFONSO MONGE DÍAZ-ANGEL</span>
            </footer>
          </>
        ) : (
          <FooterSimple />
        )}

        <ModuleNavigation />

        <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} navItems={getAllNavItems(NAV_GROUPS)} />
        <GuidedTour isRunning={tourRunning} setIsRunning={setTourRunning} />
        <GlossaryFloating />
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <PresentationMode />
        <Layout />
      </Router>
    </ToastProvider>
  );
};

export default App;