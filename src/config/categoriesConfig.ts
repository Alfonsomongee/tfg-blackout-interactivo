export interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: NavItem[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'contexto',
    label: 'Contexto',
    icon: '🌍',
    color: '#22d3ee',
    items: [
      { id: 'portada',            path: '/',                    label: 'Portada TFG',          icon: '🎯' },
      { id: 'contexto-energetico',path: '/contexto-energetico', label: 'Contexto Energético',  icon: '⚡' },
      { id: 'brief',              path: '/brief',               label: 'Resumen Ejecutivo',    icon: '📊' },
      { id: 'mix-generacion',     path: '/mix-generacion',      label: 'Mix de Generación',    icon: '🌬️' },
    ],
  },
  {
    id: 'analisis-forense',
    label: 'Análisis Forense',
    icon: '🔬',
    color: '#ef4444',
    items: [
      { id: 'countdown',          path: '/countdown',           label: 'Cronología 90s',       icon: '⏱️' },
      { id: 'cascada',            path: '/cascada',             label: 'Cascada de Colapso',   icon: '⚠️' },
      { id: 'map',                path: '/map',                 label: 'Mapa Propagación',     icon: '🗺️' },
      { id: 'forensic-timeline',  path: '/forensic-timeline',  label: 'Cronología Forense',   icon: '📈' },
      { id: 'timeline',           path: '/timeline',            label: 'Línea de Tiempo',      icon: '📅' },
      { id: 'timeline-moment',    path: '/timeline-moment',    label: 'Momento del Colapso',  icon: '💥' },
      { id: 'heat-map',           path: '/heat-map',            label: 'Mapa de Calor',        icon: '🌡️' },
      { id: 'causal',             path: '/causal',              label: 'Cadena Causal',        icon: '🔗' },
    ],
  },
  {
    id: 'fisica-sistema',
    label: 'Física del Sistema',
    icon: '⚙️',
    color: '#f97316',
    items: [
      { id: 'inercia-vuln',       path: '/inercia-vuln',        label: 'Inercia del Sistema',  icon: '📉' },
      { id: 'inercia-graph',      path: '/inercia-graph',       label: 'Gráfico de Inercia',   icon: '📐' },
      { id: 'grid-following',     path: '/grid-following',      label: 'Grid-Following',       icon: '🔌' },
      { id: 'tap-lag',            path: '/tap-lag',             label: 'Tap-Lag Explainer',    icon: '🌊' },
      { id: 'reactiva',           path: '/reactiva',            label: 'Balance Reactivo',     icon: '⚖️' },
      { id: 'interconexion',      path: '/interconexion',       label: 'Interconexión Ibérica',icon: '🌉' },
      { id: 'simulator',          path: '/simulator',           label: 'Simulador Interactivo',icon: '🎮' },
    ],
  },
  {
    id: 'analisis-comparativo',
    label: 'Análisis Comparativo',
    icon: '🏛️',
    color: '#a78bfa',
    items: [
      { id: 'tres-narrativas',    path: '/tres-narrativas',     label: 'Tres Narrativas',      icon: '🏛️' },
      { id: 'compare',            path: '/compare',             label: 'Comparador Narrativas',icon: '⚖️' },
      { id: 'divergencias',       path: '/divergencias',        label: 'Tabla Divergencias',   icon: '📋' },
      { id: 'matrix',             path: '/matrix',              label: 'Matriz Divergencias',  icon: '📊' },
      { id: 'consenso',           path: '/consenso',            label: 'Consenso / Divergencia',icon:'🤝' },
      { id: 'polarimetro',        path: '/polarimetro',         label: 'Polarímetro',          icon: '🧭' },
      { id: 'comparador-arrastra',path: '/comparador-arrastra', label: 'Comparador Institucional',icon:'🔀'},
      { id: 'narrativa-mediatica',path: '/narrativa-mediatica', label: 'Narrativa Mediática',  icon: '📰' },
    ],
  },
  {
    id: 'soluciones',
    label: 'Soluciones y Propuestas',
    icon: '🔧',
    color: '#22c55e',
    items: [
      { id: 'medidas-propuestas', path: '/medidas-propuestas',  label: 'Medidas Propuestas',   icon: '🔧' },
      { id: 'radar',              path: '/radar',               label: 'Análisis Responsabilidad',icon:'📋'},
      { id: 'reforms',            path: '/reforms',             label: 'Seguimiento Reformas', icon: '📜' },
      { id: 'roadmap',            path: '/roadmap',             label: 'Roadmap Tecnológico',  icon: '🛣️' },
      { id: 'trilema',            path: '/trilema',             label: 'Trilema Energético',   icon: '🔺' },
    ],
  },
  {
    id: 'garantia-academica',
    label: 'Garantía Académica',
    icon: '🎓',
    color: '#60a5fa',
    items: [
      { id: 'black-start',        path: '/black-start',         label: 'Black Start',          icon: '🔋' },
      { id: 'fracturas',          path: '/fracturas',           label: 'Tres Fracturas',       icon: '💔' },
      { id: 'veredicto',          path: '/veredicto',           label: 'Veredicto Forense',    icon: '⚖️' },
      { id: 'metodologia',        path: '/metodologia',         label: 'Metodología',          icon: '📐' },
      { id: 'galeria',            path: '/galeria',             label: 'Galería Forense',      icon: '🖼️' },
    ],
  },
  {
    id: 'interactivo',
    label: 'Interactivo & Recursos',
    icon: '🎓',
    color: '#fbbf24',
    items: [
      { id: 'tribunal',           path: '/tribunal',            label: 'FAQ Tribunal',         icon: '❓' },
      { id: 'quiz-tribunal',      path: '/quiz-tribunal',       label: 'Quiz Tribunal',        icon: '🎯' },
      { id: 'lexicon',            path: '/lexicon',             label: 'Léxico Técnico',       icon: '📖' },
      { id: 'dossier',            path: '/dossier',             label: 'Dossier Técnico',      icon: '📚' },
      { id: 'testimonios',        path: '/testimonios',         label: 'Testimonios',          icon: '💬' },
      { id: 'data-cards',         path: '/data-cards',          label: 'Data Cards',           icon: '🃏' },
    ],
  },
];

export function getCategoryByPath(path: string): Category | undefined {
  return CATEGORIES.find(cat => cat.items.some(item => item.path === path));
}
