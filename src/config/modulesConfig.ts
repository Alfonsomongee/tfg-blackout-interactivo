/**
 * Configuración central de módulos educativos
 * Define el orden secuencial de los 20 módulos en el TFG
 */

export interface ModuleConfig {
  id: string;
  path: string;
  name: string;
  section: string;
  description: string;
  duration: string;
  order: number;
  emoji: string;
}

export const MODULES_SEQUENCE: ModuleConfig[] = [
  {
    id: 'portada',
    path: '/',
    name: 'PORTADA TFG',
    section: 'CONTEXTO',
    description: 'Introducción al apagón de 28 de agosto',
    duration: '2 min',
    order: 1,
    emoji: '🎯',
  },
  {
    id: 'contexto-energetico',
    path: '/contexto-energetico',
    name: 'CONTEXTO ENERGÉTICO',
    section: 'CONTEXTO',
    description: 'Panorama del sistema eléctrico español pre-28A',
    duration: '3 min',
    order: 2,
    emoji: '⚡',
  },
  {
    id: 'resumen-ejecutivo',
    path: '/resumen-ejecutivo',
    name: 'RESUMEN EJECUTIVO',
    section: 'CONTEXTO',
    description: 'Datos clave y cronología del evento',
    duration: '3 min',
    order: 3,
    emoji: '📊',
  },
  {
    id: 'timeline-evento',
    path: '/timeline-evento',
    name: 'LÍNEA DE TIEMPO',
    section: 'ANÁLISIS FORENSE',
    description: '90 segundos críticos del colapso',
    duration: '4 min',
    order: 4,
    emoji: '⏱️',
  },
  {
    id: 'tres-narrativas',
    path: '/tres-narrativas',
    name: 'TRES NARRATIVAS',
    section: 'ANÁLISIS FORENSE',
    description: 'Posiciones divergentes: Gobierno, ICAI, ENTSO-E',
    duration: '5 min',
    order: 5,
    emoji: '🏛️',
  },
  {
    id: 'inercia-vuln',
    path: '/inercia-vuln',
    name: 'INERCIA DEL SISTEMA',
    section: 'ANÁLISIS FORENSE',
    description: 'Por qué la inercia colapsa con renovables',
    duration: '4 min',
    order: 6,
    emoji: '📉',
  },
  {
    id: 'grid-following',
    path: '/grid-following',
    name: 'GRID-FOLLOWING',
    section: 'ANÁLISIS FORENSE',
    description: 'Inversores renovables sin soporte de tensión',
    duration: '4 min',
    order: 7,
    emoji: '🔌',
  },
  {
    id: 'tap-lag',
    path: '/tap-lag',
    name: 'TAP-LAG EXPLAINER',
    section: 'ANÁLISIS FORENSE',
    description: 'Maniobra operativa y resonancia en red',
    duration: '4 min',
    order: 8,
    emoji: '🌊',
  },
  {
    id: 'mix-generacion',
    path: '/mix-generacion',
    name: 'MIX DE GENERACIÓN',
    section: 'FACTORES SISTÉMICOS',
    description: 'Evolución hacia renovables y fragilidad',
    duration: '3 min',
    order: 9,
    emoji: '🌬️',
  },
  {
    id: 'interconexion',
    path: '/interconexion',
    name: 'INTERCONEXIÓN IBÉRICA',
    section: 'FACTORES SISTÉMICOS',
    description: 'Restricciones operativas pre-fallo',
    duration: '3 min',
    order: 10,
    emoji: '🌉',
  },
  {
    id: 'cascada-colapso',
    path: '/cascada-colapso',
    name: 'CASCADA DE COLAPSO',
    section: 'FACTORES SISTÉMICOS',
    description: 'Desconexiones en cascada por sobretensión',
    duration: '4 min',
    order: 11,
    emoji: '⚠️',
  },
  {
    id: 'impacto-ciudadano',
    path: '/impacto-ciudadano',
    name: 'IMPACTO CIUDADANO',
    section: 'CONSECUENCIAS',
    description: 'Efectos del apagón en la sociedad',
    duration: '3 min',
    order: 12,
    emoji: '👥',
  },
  {
    id: 'comparativa-europa',
    path: '/comparativa-europa',
    name: 'COMPARATIVA EUROPA',
    section: 'CONTEXTO INTERNACIONAL',
    description: 'Eventos similares en redes europeas',
    duration: '3 min',
    order: 13,
    emoji: '🇪🇺',
  },
  {
    id: 'medidas-propuestas',
    path: '/medidas-propuestas',
    name: 'MEDIDAS PROPUESTAS',
    section: 'SOLUCIONES',
    description: 'Reformas por institución',
    duration: '4 min',
    order: 14,
    emoji: '🔧',
  },
  {
    id: 'criterio-n-1',
    path: '/criterio-n-1',
    name: 'CRITERIO N-1',
    section: 'SOLUCIONES',
    description: 'Marco de seguridad y sus límites',
    duration: '3 min',
    order: 15,
    emoji: '📋',
  },
  {
    id: 'gfm-inversores',
    path: '/gfm-inversores',
    name: 'GFM EN INVERSORES',
    section: 'SOLUCIONES',
    description: 'Grid-Forming como solución de inercia',
    duration: '4 min',
    order: 16,
    emoji: '🔋',
  },
  {
    id: 'compensadores',
    path: '/compensadores',
    name: 'COMPENSADORES SÍNCRONOS',
    section: 'SOLUCIONES',
    description: 'Infraestructura crítica post-28A',
    duration: '3 min',
    order: 17,
    emoji: '⚙️',
  },
  {
    id: 'simulator',
    path: '/simulator',
    name: 'SIMULADOR INTERACTIVO',
    section: 'HERRAMIENTAS',
    description: 'Experimenta el colapso de inercia',
    duration: '5-10 min',
    order: 18,
    emoji: '🎮',
  },
  {
    id: 'quiz',
    path: '/quiz',
    name: 'EVALUACIÓN FINAL',
    section: 'HERRAMIENTAS',
    description: 'Comprueba tu comprensión del 28-A',
    duration: '5 min',
    order: 19,
    emoji: '✅',
  },
  {
    id: 'conclusiones',
    path: '/conclusiones',
    name: 'CONCLUSIONES',
    section: 'CIERRE',
    description: 'Aprendizajes y futuro de redes resilientes',
    duration: '3 min',
    order: 20,
    emoji: '🎓',
  },
];

/**
 * Obtiene un módulo por su path
 */
export function getModuleByPath(path: string): ModuleConfig | undefined {
  return MODULES_SEQUENCE.find((m) => m.path === path);
}

/**
 * Obtiene el índice de un módulo (0-based)
 */
export function getModuleIndex(path: string): number {
  const module = getModuleByPath(path);
  return module ? module.order - 1 : -1;
}

/**
 * Obtiene el módulo anterior al actual
 */
export function getPreviousModule(path: string): ModuleConfig | undefined {
  const index = getModuleIndex(path);
  return index > 0 ? MODULES_SEQUENCE[index - 1] : undefined;
}

/**
 * Obtiene el módulo siguiente al actual
 */
export function getNextModule(path: string): ModuleConfig | undefined {
  const index = getModuleIndex(path);
  return index >= 0 && index < MODULES_SEQUENCE.length - 1
    ? MODULES_SEQUENCE[index + 1]
    : undefined;
}

/**
 * Obtiene la sección actual del módulo
 */
export function getCurrentSection(path: string): string {
  const module = getModuleByPath(path);
  return module?.section || 'SIN SECCIÓN';
}

/**
 * Calcula el progreso total como porcentaje
 */
export function getProgressPercentage(path: string): number {
  const index = getModuleIndex(path);
  if (index < 0) return 0;
  return Math.round(((index + 1) / MODULES_SEQUENCE.length) * 100);
}
