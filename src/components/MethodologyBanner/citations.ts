export const CITATION_FORMATS = {
  bibtex: `@mastersthesis{monge2026blackout,
  author={Monge Díaz-Ángel, Alfonso},
  title={Análisis Forense del Apagón Eléctrico Ibérico 28-A},
  school={Escuela Técnica Superior de Ingeniería, Universidad de Sevilla},
  year={2026},
  url={https://tfg-blackout-interactivo.vercel.app/}
}`,

  apa: `Monge Díaz-Ángel, A. (2026). Análisis forense del apagón eléctrico ibérico 28-A [Trabajo Fin de Grado]. Escuela Técnica Superior de Ingeniería, Universidad de Sevilla. Retrieved from https://tfg-blackout-interactivo.vercel.app/`,

  chicago: `Monge Díaz-Ángel, Alfonso. "Análisis Forense del Apagón Eléctrico Ibérico 28-A." Master's thesis, Escuela Técnica Superior de Ingeniería, Universidad de Sevilla, 2026. https://tfg-blackout-interactivo.vercel.app/`
};

export const METHODOLOGY_DATA = {
  eventClassification: {
    name: 'Evento Analizado',
    value: 'Apagón eléctrico ibérico real',
    date: '28 de agosto de 2023',
    context: 'Análisis retrospectivo enfocado como caso de estudio educativo/profesional (2025-2026)',
    type: 'REAL'
  },

  sources: [
    {
      institution: 'REE',
      fullName: 'Red Eléctrica de España',
      role: 'Narrativa oficial TSO español',
      url: 'https://www.ree.es/',
      report: 'Informe del incidente (2023)'
    },
    {
      institution: 'ENTSO-E',
      fullName: 'European Network of TSOs for Electricity',
      role: 'Marco regulatorio supranacional',
      url: 'https://www.entsoe.eu/',
      report: 'European Grid Code & situational analysis'
    },
    {
      institution: 'ICAI/AELEC',
      fullName: 'Colegio Profesional / Asociación Sector',
      role: 'Perspectiva ingeniería + industria',
      url: 'https://www.icai.es/',
      report: 'Análisis técnico del sector'
    },
    {
      institution: 'Gobierno',
      fullName: 'Ministerios (Energía, Interior)',
      role: 'Narrativa político-administrativa',
      url: 'https://www.lamoncloa.gob.es/',
      report: 'Comunicados y comparecencias'
    }
  ],

  methodology: `Este análisis aplica un enfoque forense basado en triangulación de narrativas. Se examinan 4 fuentes institucionales (REE, ENTSO-E, ICAI/AELEC, Gobierno) para identificar consensos, divergencias y brechas interpretativas en torno al evento del 28-A. El propósito es educativo: preparar a ingenieros y policy makers para reconocer cómo eventos críticos son narrados y contestados según posición institucional.`,

  limitations: [
    'Acceso limitado a datos privados de operadores (constricciones comerciales)',
    'Retrasos en publicación oficial de algunos reportes técnicos',
    'Análisis retrospectivo (no hay posibilidad de medición en tiempo real)',
    'Énfasis en fuentes hispanohablantes; perspectiva europea limitada',
    'Simulaciones basadas en parámetros públicos, no en data proprietaria'
  ],

  lastUpdated: new Date().toISOString().split('T')[0]
};
