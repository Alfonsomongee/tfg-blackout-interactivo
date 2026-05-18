import React, { useState } from 'react';

interface Narrative {
  label: string;
  color: string;
  framing: string;
  keyClaim: string;
  responsibility: string;
  verdict: string;
  verdictType: 'nominal' | 'warning' | 'alarm' | 'info';
  evidence: string;
  criticism: string;
  whyDiverges: string;
}

interface EventData {
  id: string;
  label: string;
  question: string;
  narratives: {
    gov: Narrative;
    icai: Narrative;
    entso: Narrative;
  };
  consensusPoints: string[];
  divergencePoints: string[];
}

const EVENTS: EventData[] = [
  {
    id: 'meshing',
    label: 'Maniobra de mallado (12:03–12:25)',
    question: '¿El mallado de 11 líneas en vacío desencadenó el colapso?',
    narratives: {
      gov: {
        label: 'Gobierno / REE',
        color: 'var(--alarm)',
        framing: 'Medida protocolizada y necesaria para amortiguar las oscilaciones de 0,63 Hz detectadas a las 12:03 CEST. El sistema disponía de márgenes suficientes. Las tensiones en la red de 400 kV se mantuvieron dentro del rango operativo (375–435 kV) durante toda la operación.',
        keyClaim: 'Tensión en SE Carmona 400 kV: dentro de límites normativos hasta el disparo raíz.',
        responsibility: 'Los generadores debían absorber la reactiva capacitiva generada por el mallado conforme al P.O. 7.4.',
        verdict: 'ACCIÓN CORRECTA',
        verdictType: 'nominal',
        evidence: 'Mallado frecuente en red española para mejorar flujos e incrementar estabilidad de tensión estática.',
        criticism: 'No explica por qué inyectó tanta reactiva sin un análisis de impacto dinámico previo en un escenario de baja inercia.',
        whyDiverges: 'Divergencia entre la lógica de operación rutinaria tradicional vs. la evaluación de riesgos dinámicos en una red con un 82% de IBR.',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--warning)',
        framing: 'La maniobra inyectó entre 1,05 y 2,4 GVAr de potencia reactiva capacitiva por efecto Ferranti en líneas en vacío. Contrajo el margen de las curvas Q-V de Carmona un 57%: de 2.964 MW a 1.268 MW. Con 0,2 GVAr de capacidad de absorción disponible frente a >0,7 GVAr inyectados, el colapso era matemáticamente inevitable antes de cualquier disparo de generador.',
        keyClaim: 'Contracción margen Q-V Carmona: 57% (2.964 → 1.268 MW). Déficit neto: −0,6 GVAr.',
        responsibility: 'El operador llevó la red a un estado de colapso inevitable. Los generadores actuaron conforme a la física en su punto de conexión.',
        verdict: 'CAUSA RAÍZ',
        verdictType: 'alarm',
        evidence: 'Mediciones de telemetría refinadas por Compass Lexecon junto a modelos dinámicos detallados de las reactancias del sistema.',
        criticism: 'No justifica por qué los generadores de la zona sur mantuvieron límites de absorción tan restrictivos a pesar de la escalada previa.',
        whyDiverges: 'Asignación de responsabilidad operativa directa vs. incapacidad técnica de los generadores por restricciones normativas de seguridad.',
      },
      entso: {
        label: 'ENTSO-E',
        color: 'var(--info)',
        framing: 'Los RCCs no detectaron la saturación capacitiva derivada del mallado. La herramienta CSA, basada en análisis N-1 estático, evaluó el sistema como "Normal" minutos antes del colapso. La restricción del P.O. 7.4 privó al sistema del soporte reactivo del 82% del parque generador, que disponía de capacidad tecnológica para proveerlo.',
        keyClaim: 'Estado EAS a las 12:32: "Normal". Transición a "Blackout" sin fase intermedia de Alerta.',
        responsibility: 'La causa raíz es normativa: la restricción que impedía a los IBR controlar tensión dinámicamente. Fallo del marco regulatorio.',
        verdict: 'FACTOR AGRAVANTE',
        verdictType: 'warning',
        evidence: 'Auditoría detallada de los registros de estado EAS (Area Security Assessment) paneuropeos y los históricos de consignas reactivas.',
        criticism: 'Evita señalar fallos operacionales concretos de REE para concentrarse exclusivamente en debilidades de regulación a escala europea.',
        whyDiverges: 'Diferencia de perspectiva: un regulador paneuropeo persigue la armonización futura, mientras que los actores locales disputan costes jurídicos inmediatos.',
      },
    },
    consensusPoints: [],
    divergencePoints: [
      'Efecto del mallado sobre los márgenes Q-V: dato técnico disputado',
      'Responsabilidad: ¿del operador o de los generadores?',
    ],
  },
  {
    id: 'hvdc',
    label: 'Cambio HVDC PMODE3→PMODE1 (12:11 CEST)',
    question: '¿El cambio de modo del HVDC eliminó un mecanismo de defensa clave?',
    narratives: {
      gov: {
        label: 'Gobierno / REE',
        color: 'var(--alarm)',
        framing: 'Decisión coordinada entre REE y RTE para amortiguar las oscilaciones de 0,63 Hz. El enlace pasó de modo de emulación AC (PMODE3) a potencia fija de 1.000 MW (PMODE1). Durante el colapso, las líneas AC transpirenaicas intentaron importar hasta 4.609 MW desde Francia. La pérdida de sincronismo se produjo por la dinámica interna del sistema peninsular, no por el comportamiento del HVDC.',
        keyClaim: 'Exportación HVDC durante el colapso: 1.000 MW fijos (PMODE1). Importación AC máxima: 4.609 MW.',
        responsibility: 'Decisión operativa correcta y protocolizada. El HVDC no fue causa raíz.',
        verdict: 'ACCIÓN CORRECTA',
        verdictType: 'nominal',
        evidence: 'Registros de telemetría de las subestaciones de Baixas y Santa Llogaia coordinados con RTE Francia.',
        criticism: 'Oculta el hecho de que fijar de forma rígida el flujo a 1.000 MW limitó gravemente la capacidad amortiguadora del enlace.',
        whyDiverges: 'Prioridad de estabilidad del flujo de intercambio transfronterizo vs. necesidad de control activo dinámico.',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--warning)',
        framing: 'En PMODE3, el HVDC reaccionaba a la diferencia angular entre terminales, proporcionando amortiguamiento interárea. Al fijar 1.000 MW en PMODE1, se eliminó este grado de libertad de control. Cuando la cascada comenzó, el enlace mantuvo exportación constante en lugar de reducirla o invertirla ante la caída de frecuencia peninsular. El soporte efectivo desde Francia quedó reducido respecto al máximo teórico disponible.',
        keyClaim: 'PMODE1 mantuvo exportación de 1.000 MW durante el colapso. En PMODE3, la diferencia angular creciente habría reducido automáticamente la exportación.',
        responsibility: 'La decisión de mantener PMODE1 hasta el último instante limitó la capacidad de defensa de la frontera pirenaica.',
        verdict: 'DECISIÓN CUESTIONADA',
        verdictType: 'warning',
        evidence: 'Modelos dinámicos detallados de las reactancias del enlace HVDC en simulaciones de estabilidad angular de transitorios.',
        criticism: 'No llega a cuantificar con precisión el impacto neto que la inversión inmediata de flujos habría tenido en la estabilidad final de Granada.',
        whyDiverges: 'Filosofía de defensa activa distribuida frente a esquemas convencionales de consigna fija de interconexión.',
      },
      entso: {
        label: 'ENTSO-E',
        color: 'var(--info)',
        framing: 'El cambio a PMODE1 se realizó para amortiguar oscilaciones, conforme a los protocolos bilaterales REE-RTE. El enlace mantuvo una exportación constante de 1.000 MW durante el colapso. Las protecciones OST de las líneas AC actuaron correctamente a las 12:33:21 CEST, aislando la Península y evitando la propagación al sistema europeo continental.',
        keyClaim: 'Protecciones OST actuaron correctamente a las 12:33:21 CEST en Baixas-Vic, Argia-Arkale y Argia-Hernani.',
        responsibility: 'No atribuye causalidad directa al HVDC. Subraya que la separación transpirenaica fue normativamente correcta.',
        verdict: 'POSICIÓN NEUTRAL',
        verdictType: 'info',
        evidence: 'Historial factual de los relés de protección de sobrecarga angular y desfase registrados en las interconexiones pirenaicas.',
        criticism: 'Se limita a sancionar la separación de la red sin cuestionar si el acoplamiento debió operar en modo dinámico ante caídas locales.',
        whyDiverges: 'Prioridad de evitar una desconexión general de Europa Continental frente a la mitigación de la caída de frecuencia en Iberia.',
      },
    },
    consensusPoints: ['El HVDC operaba en PMODE1 exportando 1.000 MW fijos durante el colapso'],
    divergencePoints: [
      '¿Debía el HVDC invertir o reducir su flujo ante la caída de frecuencia peninsular?',
      '¿Fue la decisión de mantener PMODE1 hasta el final una limitación de la defensa?',
    ],
  },
  {
    id: 'cascade_trigger',
    label: 'Disparo raíz en Granada (12:32:57 CEST)',
    question: '¿Fueron los primeros disparos "inadecuados" o normativamente correctos?',
    narratives: {
      gov: {
        label: 'Gobierno / REE',
        color: 'var(--alarm)',
        framing: 'El SCADA de REE registraba 418 kV en la red de 400 kV en el instante del disparo, dentro del límite normativo de 435 kV (P.O. 1.1). Los primeros disparos de generadores en la provincia de Granada fueron "inadecuados" o prematuros en relación con las condiciones que el operador observaba en la red de transporte. Iniciaron la cascada que culminó en el cero de tensión.',
        keyClaim: 'Tensión red 400 kV en Granada: 418 kV (límite: 435 kV). SCADA: condición dentro de rango operativo.',
        responsibility: 'Los generadores dispararon fuera de las condiciones que justificaban su protección. Fallo de disciplina técnica del parque generador privado.',
        verdict: 'DISPAROS INADECUADOS',
        verdictType: 'alarm',
        evidence: 'Datos del SCADA de REE registrados en el centro de control nacional con una resolución temporal convencional.',
        criticism: 'Punto ciego metodológico: ignora el transitorio de sobretensión ocurrido aguas abajo en las líneas colectoras de distribución de 220 kV.',
        whyDiverges: 'Confianza ciega en la telemedida estática del operador vs. la realidad transitoria descentralizada en el punto de generación.',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--warning)',
        framing: 'El fenómeno Tap-Lag generó un punto ciego letal: mientras el SCADA de REE mostraba 418 kV en la red de 400 kV, la inercia mecánica de los OLTC amplificó el transitorio en las redes colectoras subyacentes. El titular de la instalación de Granada confirmó que su protección detectó 244,32 kV en el secundario (>110% de la tensión nominal de 220 kV) y actuó conforme a la Orden TED/749/2020 y los Códigos de Red RfG.',
        keyClaim: 'Tensión secundario red colectora Granada: 244,32 kV (>110% Vn). Condición invisible para el SCADA de REE por efecto Tap-Lag.',
        responsibility: 'Los disparos fueron normativamente correctos. El operador careció de observabilidad en la red de 220 kV. El Tap-Lag es una limitación estructural del sistema de monitorización.',
        verdict: 'ACTUACIÓN CORRECTA',
        verdictType: 'nominal',
        evidence: 'Oscilografías locales del parque fotovoltaico de Granada que verifican la tensión física instantánea del generador.',
        criticism: 'No aclara por qué los ajustes de protección del generador carecían de una temporización coordinada para resistir huecos o transitorios.',
        whyDiverges: 'Defensa de la integridad de los activos de generación distribuida y apego a la norma física local vs. requerimientos de red.',
      },
      entso: {
        label: 'ENTSO-E',
        color: 'var(--info)',
        framing: 'No califica los disparos como inadecuados. Subraya la inobservabilidad de la red subyacente como limitación sistémica del operador y de los RCCs. La cascada que siguió al disparo raíz —de 2.000 MW de generación RCR perdida en los 22,5 s siguientes— demuestra que las herramientas de seguridad estáticas no pudieron anticipar la dinámica ultrarrápida del evento.',
        keyClaim: 'Duración total colapso: 22,5 s desde disparo en Granada. Completamente fuera del horizonte de intervención humana.',
        responsibility: 'La causa raíz es la inobservabilidad estructural de la red de colectores y la inadecuación de los estándares de seguridad para redes de baja inercia.',
        verdict: 'LIMITACIÓN SISTÉMICA',
        verdictType: 'warning',
        evidence: 'Historial consolidado de la cascada dinámica y análisis de tiempos de actuación de los relés de sobretensión.',
        criticism: 'No define claramente quién debe costear el despliegue tecnológico de PMUs para solucionar la inobservabilidad en la red de distribución.',
        whyDiverges: 'Enfoque técnico analítico multinacional vs. disputas contractuales e indemnizatorias por desconexión en el mercado nacional.',
      },
    },
    consensusPoints: [],
    divergencePoints: [
      'Tensión en el punto de disparo: 418 kV (REE, red 400 kV) vs. 244 kV (ICAI, red colectora 220 kV)',
      'Calificación del disparo: "inadecuado" (REE) vs. "normativamente correcto" (ICAI)',
    ],
  },
  {
    id: 'inertia',
    label: 'Papel de la inercia síncrona',
    question: '¿Fue la baja inercia la causa raíz del colapso?',
    narratives: {
      gov: {
        label: 'Gobierno / REE',
        color: 'var(--alarm)',
        framing: 'El sistema operaba con H = 2,3 s en el momento del colapso, por encima del umbral de 2,0 s recomendado por ENTSO-E. El RoCoF no superó 1 Hz/s hasta una fase muy avanzada de la cascada. La inercia del sistema, en este incidente, es irrelevante como causa raíz: el sistema "estaba ya condenado por la pérdida masiva de generación" por sobretensión.',
        keyClaim: 'Inercia global sistema: H = 2,3 s. Umbral ENTSO-E: 2,0 s. RoCoF < 1 Hz/s hasta la fase final.',
        responsibility: 'El déficit de inercia no fue la causa del colapso. Fue un colapso de tensión capacitiva, no de frecuencia.',
        verdict: 'NO FUE LA CAUSA',
        verdictType: 'nominal',
        evidence: 'Cálculos de inercia en tiempo real del despacho nacional de REE en base al despacho de grupos síncronos de gran potencia.',
        criticism: 'El indicador global de inercia de 2,3 s oculta la fragilidad inercial extrema en la zona sur debido al desacoplamiento local.',
        whyDiverges: 'Medida agregada macroscópica y simplicidad analítica vs. análisis multizonal localizado.',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--warning)',
        framing: 'La inercia zonal es más relevante que la global para evaluar la estabilidad local. En la zona sur (epicentro del colapso) la inercia era de 1,3 s; en la zona centro, de 1,84 s — ambas por debajo del umbral ENTSO-E de 2,0 s. La baja inercia zonal no fue causa raíz, pero amplificó la velocidad de propagación de la inestabilidad de tensión y redujo el margen de maniobra disponible.',
        keyClaim: 'Inercia zona sur: 1,30 s. Zona centro: 1,84 s. Ambas bajo el umbral ENTSO-E de 2,0 s.',
        responsibility: 'Factor estructural agravante, no causa raíz. La causa raíz fue la saturación de los márgenes Q-V por el mallado.',
        verdict: 'FACTOR AGRAVANTE',
        verdictType: 'warning',
        evidence: 'Análisis de estabilidad de área detallado y desglose regional de las masas rotatorias síncronas remanentes en despacho.',
        criticism: 'Una inercia infinitamente mayor no habría impedido el colapso dinámico por tensión si la reactiva inyectada superaba la capacidad de absorción del sistema.',
        whyDiverges: 'Prioridad otorgada al comportamiento dinámico localizado frente al análisis estático promediado nacional.',
      },
      entso: {
        label: 'ENTSO-E',
        color: 'var(--info)',
        framing: 'El colapso del 28 de abril no se debió a un exceso de generación renovable ni a una escasez inercial primaria, sino a una incapacidad estructural para controlar los perfiles de tensión del sistema. La baja inercia no fue la causa del colapso del 28-A, pero sí un factor estructural que reducirá los márgenes de seguridad en incidentes futuros conforme avance la descarbonización.',
        keyClaim: 'El colapso fue por inestabilidad de tensión capacitiva. Una mayor inercia habría ralentizado la caída de frecuencia décimas de segundo, sin evitar el colapso.',
        responsibility: 'El paradigma Grid-Following ha agotado su viabilidad. NC RfG 2.0 exigirá Grid-Forming e inercia sintética para todos los módulos ≥1 MW.',
        verdict: 'NO FUE LA CAUSA',
        verdictType: 'nominal',
        evidence: 'Estudios de contingencia multinodo integrados en los códigos de red paneuropeos para la transición energética.',
        criticism: 'El Grid-Forming obligatorio es una meta futura tecnológica y costosa, no una solución aplicable a los parques existentes hoy.',
        whyDiverges: 'Enfoque normativo de largo plazo e incentivo de reforma estructural frente a reparaciones y asignaciones de culpa operativas a corto plazo.',
      },
    },
    consensusPoints: [
      'La inercia no fue la causa raíz del colapso (consenso unánime entre los informes)',
      'El colapso fue por inestabilidad de tensión capacitiva, no déficit de potencia activa',
    ],
    divergencePoints: [
      'Alcance de la medición: inercia global (REE: 2,3 s) vs. inercia zonal (ICAI: 1,3–1,84 s)',
    ],
  },
  {
    id: 'ufls_paradox',
    label: 'Paradoja del deslastre UFLS',
    question: '¿El mecanismo de defensa de frecuencia agravó el colapso de tensión?',
    narratives: {
      gov: {
        label: 'Gobierno / REE',
        color: 'var(--alarm)',
        framing: 'El UFLS se activó correctamente conforme a los umbrales establecidos: 49,5 Hz (2.000 MW de bombeo), 49,3 Hz (588 MW), 49,0 Hz (1.402 MW industriales y distribución). El mecanismo actuó como herramienta universal para restaurar el equilibrio generación-demanda. Su efecto negativo sobre la tensión es una consecuencia intrínseca del diseño, no un fallo operativo.',
        keyClaim: 'UFLS activado: 3 escalones, ~4.000 MW de demanda e instalaciones industriales deslastrados.',
        responsibility: 'El UFLS actuó conforme a su diseño. La paradoja es una limitación estructural del esquema de defensa, no una decisión operativa incorrecta.',
        verdict: 'ACTUACIÓN CORRECTA',
        verdictType: 'nominal',
        evidence: 'Histórico factual del disparo de los relés de frecuencia de transporte y los medidores de subestaciones de distribución.',
        criticism: 'No realiza autocrítica sobre la total desatención de la tensión en los esquemas automáticos de desconexión del sistema.',
        whyDiverges: 'Enfoque de defensa estricta del equilibrio de frecuencia activa frente a esquemas integrales con acoplamiento reactivo.',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--warning)',
        framing: 'El UFLS, al desconectar carga inductiva (motores, industria), eliminó los últimos sumideros de potencia reactiva disponibles en el sistema. En un colapso de tensión capacitiva, esto fue exactamente lo opuesto a lo necesario: en lugar de absorber reactiva, se eliminó la absorción. Las lógicas de defensa diseñadas para déficit de frecuencia resultaron contraproducentes ante un colapso capacitivo. Es la paradoja UFLS del 28-A.',
        keyClaim: 'Deslastre de carga inductiva = supresión de sumideros reactivos = agravamiento de la sobretensión.',
        responsibility: 'El esquema UFLS estaba diseñado para un problema diferente al que se materializó. Inadecuación del marco de defensa para redes dominadas por IBR.',
        verdict: 'PARADOJA CONFIRMADA',
        verdictType: 'alarm',
        evidence: 'Análisis fasorial de carga transitoria y simulación dinámica del comportamiento del factor de potencia de carga tras el deslastre.',
        criticism: 'No aporta una lógica de alternativa viable que permita salvar la frecuencia activa sin agravar la sobretensión capacitiva.',
        whyDiverges: 'Enfoque centrado en la interacción mutua tensión-frecuencia en sistemas débiles frente a la mitología clásica de control aislado.',
      },
      entso: {
        label: 'ENTSO-E',
        color: 'var(--info)',
        framing: 'El deslastre automático de cargas, al eliminar los últimos sumideros de reactiva inductiva, aceleró la escalada de tensión que ya estaba destruyendo la red. Las lógicas de defensa diseñadas para déficit de frecuencia resultaron contraproducentes ante un colapso capacitivo. Punto de consenso unánime entre los cuatro informes. Exige rediseño de los esquemas de defensa para redes de alta penetración IBR.',
        keyClaim: 'Consenso unánime (GOB, REE, ICAI, ENTSO-E): el UFLS agravó el colapso de tensión.',
        responsibility: 'Inadecuación estructural del marco de defensa. Requiere actualización para redes con alta penetración de electrónica de potencia.',
        verdict: 'PARADOJA CONFIRMADA',
        verdictType: 'alarm',
        evidence: 'Modelado dinámico multinodo del impacto del deslastre de carga en escenarios europeos de inercia y potencia de cortocircuito críticas.',
        criticism: 'Denuncia la paradoja estructural pero evita establecer plazos firmes para el costoso rediseño del plan de defensa europeo.',
        whyDiverges: 'Enfoque de regulador multilateral transnacional frente al deseo de los operadores nacionales de autoprotección inmediata.',
      },
    },
    consensusPoints: [
      'El UFLS agravó el colapso de tensión al eliminar sumideros reactivos inductivos (consenso unánime)',
    ],
    divergencePoints: [],
  },
  {
    id: 'oscillation',
    label: 'Naturaleza de la oscilación de 0,63 Hz (12:03 CEST)',
    question: '¿La oscilación fue forzada por una planta FV o un modo natural interárea?',
    narratives: {
      gov: {
        label: 'Gobierno / REE',
        color: 'var(--alarm)',
        framing: 'Oscilación forzada con origen en el lazo de control de una planta fotovoltaica en Badajoz. El comportamiento anómalo de esta instalación fue el detonante de la secuencia de eventos que llevó al colapso. Esta afirmación es compartida por ENTSO-E en términos de la clasificación "forzada", aunque no se ha confirmado la instalación específica.',
        keyClaim: 'Origen: planta FV en Badajoz (sin confirmar por ENTSO-E). Frecuencia: 0,63 Hz. Amplitud intercambio: 470 MW pico a pico.',
        responsibility: 'Fallo de control en instalación de generación privada. Origen del evento desencadenante.',
        verdict: 'OSCILACIÓN FORZADA',
        verdictType: 'alarm',
        evidence: 'Registros de oscilación de potencia activa correlacionados temporalmente en la subestación colectora de Badajoz.',
        criticism: 'No ha publicado un informe público transparente detallando el registro oscilográfico y el código de control del parque señalado.',
        whyDiverges: 'Atracción a la causa singular (fallo del generador privado) frente al análisis sistémico de la debilidad del lazo general.',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--warning)',
        framing: 'Las evidencias no son concluyentes. La oscilación pudo ser un modo interárea natural amplificado por el coeficiente de amortiguamiento próximo al 1%, consecuencia de la ausencia de Estabilizadores del Sistema de Potencia (PSS) activos en los ciclos combinados desacoplados en la zona sur. Las afirmaciones de REE y ENTSO-E sobre el carácter forzado de la oscilación no están soportadas por evidencias y/o análisis suficientes.',
        keyClaim: 'Amortiguamiento del modo: ~1% (críticamente bajo). Sin PSS activos en generación síncrona de la zona sur.',
        responsibility: 'Modo natural amplificado por la ausencia de amortiguamiento síncronico — consecuencia del despacho, no de una planta específica.',
        verdict: 'MODO NATURAL',
        verdictType: 'warning',
        evidence: 'Estimaciones de análisis modal a partir del espectro de respuesta de frecuencia y reactancias de transporte de la zona sur.',
        criticism: 'No descarta por completo la presencia física de perturbaciones externas periódicas provenientes de los lazos de control FV.',
        whyDiverges: 'Enfoque en la estabilidad intrínseca del sistema síncrono frente a la simplificación de culpar a una perturbación externa de control.',
      },
      entso: {
        label: 'ENTSO-E',
        color: 'var(--info)',
        framing: 'Documenta la oscilación como atípica (detectada hasta Alemania, 0,63 Hz), pero no atribuye causalidad definitiva a ninguna instalación específica. Señala que la baja inercia amplificó cualquier perturbación de origen. La segunda oscilación de 0,21 Hz (12:19–12:22 CEST) fue un modo Este-Centro-Oeste natural que sometió los corredores transpirenaicos a estrés electromecánico severo.',
        keyClaim: 'Oscilación detectada en PMUs hasta Alemania. Segunda oscilación 0,21 Hz: amplitud 1.480 MW pico a pico.',
        responsibility: 'No atribuye causalidad definitiva. La baja inercia amplificó el fenómeno independientemente de su origen.',
        verdict: 'CAUSALIDAD INCIERTA',
        verdictType: 'warning',
        evidence: 'Datos integrados de los registradores de PMU distribuidos por todos los operadores del sistema europeo.',
        criticism: 'Falta de resolución en la asignación final de responsabilidades para evitar tensiones regulatorias entre los estados miembros.',
        whyDiverges: 'Prioridad en la caracterización matemática y espectral paneuropea frente a litigios corporativos nacionales.',
      },
    },
    consensusPoints: [],
    divergencePoints: [
      'Naturaleza: forzada por planta FV (REE/GOV) vs. modo natural interárea (ICAI)',
      'Origen específico: sin confirmar por ENTSO-E',
    ],
  },
  {
    id: 'responsibility',
    label: 'Responsabilidad principal del colapso',
    question: '¿Quién es el principal responsable del apagón del 28 de abril?',
    narratives: {
      gov: {
        label: 'Gobierno / REE',
        color: 'var(--alarm)',
        framing: 'Los generadores incumplieron sus obligaciones de control de tensión conforme a los Procedimientos de Operación y al RD 413/2014. Si todos los agentes del sistema hubieran cumplido la normativa vigente en su punto de conexión, el sistema habría absorbido el transitorio. El apagón fue consecuencia de un fallo generalizado de disciplina técnica del parque generador privado.',
        keyClaim: '~22% de la generación RCR no cumplió requisitos de factor de potencia. Un grupo convencional inyectó reactiva en lugar de absorberla en el momento crítico.',
        responsibility: 'PARQUE GENERADOR PRIVADO — incumplimiento normativo colectivo.',
        verdict: 'FALLO DE GENERADORES',
        verdictType: 'alarm',
        evidence: 'Inspecciones técnicas de REE sobre las consignas de reactiva asignadas y el comportamiento oscilográfico en barras de centrales.',
        criticism: 'Pretende exigir un aporte dinámico dinámico y de amortiguamiento para el cual la normativa estática vigente no habilitaba a los generadores.',
        whyDiverges: 'Enfoque fiscalizador/punitivo y protección del monopolio natural del operador frente a culpas externas.',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--warning)',
        framing: 'REE llevó la red a un estado de colapso inevitable mediante la maniobra de mallado, operando con visibilidad insuficiente de la red de colectores (Tap-Lag) y con un despacho inadecuado en la zona sur (0,2 GVAr de absorción frente a >0,7 GVAr de inyección inducida). Los generadores actuaron conforme a la física y a la normativa vigente en su punto de conexión. El apagón fue un fallo del operador y del regulador.',
        keyClaim: 'Decisión de despacho zona sur: 0,2 GVAr absorción vs. >0,7 GVAr inyección. Déficit matemáticamente insalvable.',
        responsibility: 'OPERADOR DEL SISTEMA (REE) — mallado, inobservabilidad y despacho inadecuado.',
        verdict: 'FALLO DEL OPERADOR',
        verdictType: 'alarm',
        evidence: 'Modelos matemáticos dinámicos y simulaciones de márgenes Q-V que demuestran la contracción letal provocada por el mallado en vacío.',
        criticism: 'Minimiza la falta de resiliencia de la electrónica de control de muchos parques y su escaso compromiso con el soporte de red en transitorios.',
        whyDiverges: 'Defensa corporativa y legal de los activos privados de generación frente a la planificación del operador de red.',
      },
      entso: {
        label: 'ENTSO-E',
        color: 'var(--info)',
        framing: 'La causa raíz es normativa: la restricción regulatoria que impedía a los IBR controlar tensión dinámicamente. Tanto el operador como los generadores actuaron dentro de los límites de una normativa inadecuada para el sistema que pretendía gobernar. El P.O. 7.4 y el RD 413/2014 diseñaron un esquema de control para una red dominada por masas síncronas de respuesta lenta: aplicarlo a una red con 82% de penetración IBR fue el fallo sistémico.',
        keyClaim: 'La actualización del P.O. 7.4 llevaba años paralizada. El apagón del 28-A es el coste medible de una demora regulatoria.',
        responsibility: 'MARCO REGULATORIO (P.O. 7.4 / RD 413/2014) — normativa obsoleta para la red actual.',
        verdict: 'FALLO REGULATORIO',
        verdictType: 'alarm',
        evidence: 'Análisis factual del proceso de transposición de directivas europeas de códigos de red y el atraso acumulado del MITECO.',
        criticism: 'Su postura diluye de forma excesiva las responsabilidades operacionales concretas en una abstracción reguladora e institucional.',
        whyDiverges: 'Interés en promover de forma prioritaria los estándares multinacionales unificados del código de red RfG 2.0 en toda la UE.',
      },
    },
    consensusPoints: [
      'El P.O. 7.4 y el RD 413/2014 eran insuficientes para la red con 82% de penetración IBR',
    ],
    divergencePoints: [
      'Responsable principal: generadores (GOV/REE) vs. operador (ICAI) vs. marco regulatorio (ENTSO-E)',
      'Implicaciones jurídicas y económicas directamente contradictorias',
    ],
  },
  {
    id: 'prevention',
    label: 'Prevención: ¿era evitable el colapso?',
    question: '¿Qué habría evitado el apagón del 28 de abril?',
    narratives: {
      gov: {
        label: 'Gobierno / REE',
        color: 'var(--alarm)',
        framing: 'La entrada en vigor de la actualización del P.O. 7.4 habría sido el cambio más relevante para haber evitado el colapso. El despacho del 30 de abril (con mayor generación síncrona en la zona sur) habría incrementado significativamente el margen al colapso por sobretensión. El cumplimiento íntegro del RD 413/2014 por parte de todos los generadores habría absorbido el transitorio.',
        keyClaim: 'El despacho del 30/04 habría aumentado el margen al colapso por sobretensión de 1.019 MW a >2.500 MW (ICAI).',
        responsibility: 'Prevención: actualización P.O. 7.4 + cumplimiento normativo de los generadores.',
        verdict: 'ERA EVITABLE',
        verdictType: 'nominal',
        evidence: 'Auditoría interna de los recursos síncronos despachados el 30/04 que estabilizaron los transitorios homólogos de tensión.',
        criticism: 'Centra la solución en exigencias normativas punitivas que no resuelven la falta física de observabilidad de los centros de control regionales.',
        whyDiverges: 'Enfoque de gobernanza normativo tradicional frente a la necesidad de adaptación digital instantánea de la red.',
      },
      icai: {
        label: 'ICAI / AELEC',
        color: 'var(--warning)',
        framing: 'El colapso era evitable con tres medidas: (1) no ejecutar la maniobra de mallado o revertirla antes de las 12:30; (2) mantener el ciclo combinado de la zona sur acoplado (disponible desde la tarde del 27 de abril); (3) actualización del P.O. 7.4 para permitir control dinámico de tensión a los IBR. El margen al colapso de 1.019 MW era superior al déficit causado por el mallado, lo que confirma que el sistema tenía capacidad para sobrevivir sin esa maniobra.',
        keyClaim: 'Margen al colapso (ICAI): 1.019 MW. Inyección capacitiva del mallado: >1.019 MW. La maniobra superó el margen disponible.',
        responsibility: 'Prevención: revertir o no ejecutar el mallado + mantener generación síncrona en zona sur.',
        verdict: 'ERA EVITABLE',
        verdictType: 'nominal',
        evidence: 'Cálculos de simulación analítica de curvas de transferencia de potencia máxima en el corredor de transporte sur.',
        criticism: 'Propone soluciones inmediatas pero que no resuelven a largo plazo la alta penetración de renovables asíncronas en España.',
        whyDiverges: 'Optimización operacional inmediata de los márgenes existentes vs. reforma estructural de largo plazo del sistema de transporte.',
      },
      entso: {
        label: 'ENTSO-E',
        color: 'var(--info)',
        framing: 'La única respuesta viable a la escala temporal del colapso (<90 s) es la prevención estructural. Se requieren herramientas de análisis de seguridad dinámica en tiempo real en los RCCs (en lugar del CSA estático N-1), modo Grid-Forming obligatorio para módulos IBR ≥1 MW (NC RfG 2.0), y mercados de inercia sintética y potencia de cortocircuito. Sin estas reformas, un incidente similar es estadísticamente probable conforme avance la descarbonización en Europa.',
        keyClaim: 'La velocidad del colapso (<90 s) excluye cualquier intervención humana reactiva. Solo la prevención estructural es viable.',
        responsibility: 'Prevención: NC RfG 2.0 + herramientas CSA dinámicas + mercados de servicios ancilares de inercia.',
        verdict: 'REFORMA ESTRU.',
        verdictType: 'info',
        evidence: 'Informes técnicos comparativos de la implantación de servicios de inercia en mercados de referencia como Escocia o Texas.',
        criticism: 'Ignora el sustancial impacto económico y financiero de obligar al parque existente a modernizarse con tecnología Grid-Forming.',
        whyDiverges: 'Enfoque regulador centrado exclusivamente en la seguridad del suministro a largo plazo frente a los costes económicos inmediatos.',
      },
    },
    consensusPoints: [
      'La actualización del P.O. 7.4 era necesaria y habría contribuido a prevenir el colapso',
      'El criterio N-1 estático es insuficiente para redes con alta penetración IBR',
    ],
    divergencePoints: [
      'Medida preventiva más urgente: normativa (ENTSO-E) vs. operación del sistema (ICAI) vs. disciplina de generadores (GOV/REE)',
    ],
  },
];

export const NarrativeComparator: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('meshing');
  const [expandedNarratives, setExpandedNarratives] = useState<Record<string, boolean>>({});
  
  const currentEvent = EVENTS.find(e => e.id === selectedId) || EVENTS[0];

  const getVerdictBadgeClass = (type: 'nominal' | 'warning' | 'alarm' | 'info') => {
    switch (type) {
      case 'nominal':
        return 'bg-alert-green/10 border-alert-green text-alert-green';
      case 'warning':
        return 'bg-alert-orange/10 border-alert-orange text-alert-orange';
      case 'alarm':
        return 'bg-alert-red/10 border-alert-red text-alert-red';
      case 'info':
        return 'bg-accent-blue/10 border-accent-blue text-accent-blue';
      default:
        return 'bg-tertiary border-main text-text-secondary';
    }
  };

  const renderAnalysisBlock = (key: string, narrative: Narrative) => {
    const isExpanded = !!expandedNarratives[key];
    return (
      <div className="mt-4 pt-3 border-t border-main/30">
        <button
          onClick={() => setExpandedNarratives(prev => ({ ...prev, [key]: !prev[key] }))}
          className="w-full flex items-center justify-between text-[10px] font-mono uppercase font-bold text-accent hover:text-accent-blue transition-colors cursor-pointer select-none"
        >
          <span>🔍 Análisis Crítico</span>
          <span>{isExpanded ? '▲ Contraer' : '▼ Expandir'}</span>
        </button>
        
        {isExpanded && (
          <div className="mt-3 space-y-3.5 bg-secondary/80 border border-main p-3 rounded-md animate-fade-in select-text text-left">
            <div>
              <p className="text-[10px] uppercase font-mono font-bold text-accent-blue mb-1">
                ✓ Evidencia
              </p>
              <p className="text-[11px] text-text-secondary leading-normal">
                {narrative.evidence}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono font-bold text-alarm mb-1">
                ⚠ Crítica
              </p>
              <p className="text-[11px] text-text-secondary leading-normal">
                {narrative.criticism}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono font-bold text-info mb-1">
                → Causa de divergencia
              </p>
              <p className="text-[11px] text-text-secondary leading-normal">
                {narrative.whyDiverges}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-grow p-1 animate-fade-in flex flex-col gap-6 w-full">
      {/* Title area */}
      <div className="border-b border-main pb-4 mb-2">
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
          Comparador Forense de Narrativas Cruzadas
        </h2>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Capítulo III · Análisis de Evidencias, Puntos de Conflicto y Atribución de Responsabilidades
        </p>
      </div>

      {/* Two panel layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-grow">
        
        {/* LEFT PANEL: FIXED WIDTH EVENT SELECTOR */}
        <div className="w-full lg:w-[290px] flex-shrink-0 flex flex-col gap-3">
          <div className="bg-secondary border border-main p-4 rounded-lg flex flex-col gap-1.5 h-full">
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-mono font-bold border-b border-main/50 pb-2 mb-1">
              Eventos de Conflicto (28-A)
            </span>
            <span className="text-[11px] text-text-secondary leading-relaxed mb-3 font-sans">
              Seleccione un hito para desplegar las tres argumentaciones en paralelo:
            </span>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[480px] pr-1">
              {EVENTS.map(ev => {
                const isSelected = ev.id === selectedId;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedId(ev.id)}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all duration-150 cursor-pointer flex flex-col gap-1.5 select-none ${
                      isSelected
                        ? 'bg-tertiary border-accent text-text-primary border-l-4 border-l-accent'
                        : 'bg-transparent border-main text-text-secondary hover:text-text-primary hover:border-accent'
                    }`}
                  >
                    <span className="font-mono text-[9px] tracking-wider text-text-secondary font-bold uppercase">
                      {ev.label}
                    </span>
                    <span className="font-serif font-bold text-text-primary leading-snug">
                      {ev.question}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: DYNAMIC DETAIL SHEETS */}
        <div className="flex-grow flex flex-col justify-between bg-secondary border border-main rounded-lg p-6 shadow-sm">
          
          <div className="space-y-6">
            {/* Event Header */}
            <div className="border-b border-main/50 pb-4">
              <span className="t-subheading text-[10px] uppercase font-mono tracking-widest text-text-secondary block mb-1">
                {currentEvent.label}
              </span>
              <h3 className="font-serif text-lg md:text-xl font-bold text-text-primary leading-snug select-text">
                {currentEvent.question}
              </h3>
            </div>

            {/* Consensuses & Divergences */}
            {(currentEvent.consensusPoints.length > 0 || currentEvent.divergencePoints.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEvent.consensusPoints.length > 0 && (
                  <div className="bg-alert-green/5 border border-alert-green/20 p-4 rounded-lg">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-alert-green font-bold block mb-2.5">
                      ✓ Punto de Consenso Verificado
                    </span>
                    <ul className="list-none m-0 p-0 space-y-1.5 text-xs text-text-secondary">
                      {currentEvent.consensusPoints.map((p, i) => (
                        <li key={i} className="pl-3 border-l-2 border-alert-green select-text leading-relaxed text-left">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {currentEvent.divergencePoints.length > 0 && (
                  <div className="bg-alert-orange/5 border border-alert-orange/20 p-4 rounded-lg">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-alert-orange font-bold block mb-2.5">
                      ⚠ Ejes de Divergencia Irreconciliable
                    </span>
                    <ul className="list-none m-0 p-0 space-y-1.5 text-xs text-text-secondary">
                      {currentEvent.divergencePoints.map((p, i) => (
                        <li key={i} className="pl-3 border-l-2 border-alert-orange select-text leading-relaxed text-left">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Parallel 3-Column Grid of Narratives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Column 1: Government / REE */}
              <div className="bg-secondary border border-main rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-main/50 pb-2.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-alert-red block"></span>
                    <span className="font-mono text-[10px] tracking-widest text-text-primary uppercase font-bold">
                      {currentEvent.narratives.gov.label}
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-secondary leading-relaxed font-sans select-text text-left">
                    {currentEvent.narratives.gov.framing}
                  </p>

                  <div className="border-t border-main/30 my-3"></div>

                  <div className="text-left">
                    <span className="text-[9px] text-text-secondary font-mono uppercase block mb-1">Evidencia / Dato Citado:</span>
                    <span className="font-mono text-[10px] text-text-primary leading-normal block select-text bg-tertiary p-2 rounded border border-main/30">
                      {currentEvent.narratives.gov.keyClaim}
                    </span>
                  </div>

                  <div className="border-t border-main/30 my-3"></div>

                  <div className="text-left">
                    <span className="text-[9px] text-text-secondary font-mono uppercase block mb-1">Atribución de Responsabilidad:</span>
                    <span className="text-xs text-text-secondary font-serif italic block select-text">
                      {currentEvent.narratives.gov.responsibility}
                    </span>
                  </div>

                  {renderAnalysisBlock(`${currentEvent.id}-gov`, currentEvent.narratives.gov)}
                </div>

                <div className="mt-5 border-t border-main/30 pt-3">
                  <span className={`w-full text-center block text-[10px] font-mono tracking-widest py-1.5 rounded border uppercase font-bold ${getVerdictBadgeClass(currentEvent.narratives.gov.verdictType)}`}>
                    {currentEvent.narratives.gov.verdict}
                  </span>
                </div>
              </div>

              {/* Column 2: ICAI / AELEC */}
              <div className="bg-secondary border border-main rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-main/50 pb-2.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-alert-orange block"></span>
                    <span className="font-mono text-[10px] tracking-widest text-text-primary uppercase font-bold">
                      {currentEvent.narratives.icai.label}
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-secondary leading-relaxed font-sans select-text text-left">
                    {currentEvent.narratives.icai.framing}
                  </p>

                  <div className="border-t border-main/30 my-3"></div>

                  <div className="text-left">
                    <span className="text-[9px] text-text-secondary font-mono uppercase block mb-1">Evidencia / Dato Citado:</span>
                    <span className="font-mono text-[10px] text-text-primary leading-normal block select-text bg-tertiary p-2 rounded border border-main/30">
                      {currentEvent.narratives.icai.keyClaim}
                    </span>
                  </div>

                  <div className="border-t border-main/30 my-3"></div>

                  <div className="text-left">
                    <span className="text-[9px] text-text-secondary font-mono uppercase block mb-1">Atribución de Responsabilidad:</span>
                    <span className="text-xs text-text-secondary font-serif italic block select-text">
                      {currentEvent.narratives.icai.responsibility}
                    </span>
                  </div>

                  {renderAnalysisBlock(`${currentEvent.id}-icai`, currentEvent.narratives.icai)}
                </div>

                <div className="mt-5 border-t border-main/30 pt-3">
                  <span className={`w-full text-center block text-[10px] font-mono tracking-widest py-1.5 rounded border uppercase font-bold ${getVerdictBadgeClass(currentEvent.narratives.icai.verdictType)}`}>
                    {currentEvent.narratives.icai.verdict}
                  </span>
                </div>
              </div>

              {/* Column 3: ENTSO-E */}
              <div className="bg-secondary border border-main rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-main/50 pb-2.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent block"></span>
                    <span className="font-mono text-[10px] tracking-widest text-text-primary uppercase font-bold">
                      {currentEvent.narratives.entso.label}
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-secondary leading-relaxed font-sans select-text text-left">
                    {currentEvent.narratives.entso.framing}
                  </p>

                  <div className="border-t border-main/30 my-3"></div>

                  <div className="text-left">
                    <span className="text-[9px] text-text-secondary font-mono uppercase block mb-1">Evidencia / Dato Citado:</span>
                    <span className="font-mono text-[10px] text-text-primary leading-normal block select-text bg-tertiary p-2 rounded border border-main/30">
                      {currentEvent.narratives.entso.keyClaim}
                    </span>
                  </div>

                  <div className="border-t border-main/30 my-3"></div>

                  <div className="text-left">
                    <span className="text-[9px] text-text-secondary font-mono uppercase block mb-1">Atribución de Responsabilidad:</span>
                    <span className="text-xs text-text-secondary font-serif italic block select-text">
                      {currentEvent.narratives.entso.responsibility}
                    </span>
                  </div>

                  {renderAnalysisBlock(`${currentEvent.id}-entso`, currentEvent.narratives.entso)}
                </div>

                <div className="mt-5 border-t border-main/30 pt-3">
                  <span className={`w-full text-center block text-[10px] font-mono tracking-widest py-1.5 rounded border uppercase font-bold ${getVerdictBadgeClass(currentEvent.narratives.entso.verdictType)}`}>
                    {currentEvent.narratives.entso.verdict}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Academic Footer footnote */}
          <div className="mt-8 border-t border-main/50 pt-4 text-center">
            <span className="t-caption text-[10px] text-text-secondary/60 font-mono tracking-wide select-text">
              Fuentes primarias comparadas: Informe Final de REE (Junio 2025) · Dictamen de Modelado de ICAI/AELEC (Mayo 2025) · Informe Factual Oficial de ENTSO-E (Abril 2025)
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default NarrativeComparator;
