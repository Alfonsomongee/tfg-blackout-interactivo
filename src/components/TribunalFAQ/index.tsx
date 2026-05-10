import { useState } from 'react';

const FAQ = [
  {
    category: 'FÍSICA DEL SISTEMA',
    color: 'var(--alarm)',
    questions: [
      {
        q: '¿Por qué la inercia no fue la causa raíz si el sistema tenía poca?',
        a: 'Consenso unánime de los 4 informes: H = 2,3 s estaba por encima del umbral de 2,0 s de ENTSO-E. El colapso fue por inestabilidad capacitiva (tensión), no por caída de frecuencia. Con más inercia, el colapso habría tardado décimas de segundo más, pero habría ocurrido igualmente. La causa raíz fue la saturación de los márgenes Q-V de Carmona (57% de contracción: 2.964 → 1.268 MW).',
        ref: 'Cap. 5.5 — Tabla 5.4',
      },
      {
        q: '¿Qué es el Tap-Lag y por qué fue determinante?',
        a: 'Fenómeno de histéresis en los taps de los autotransformadores 400/220 kV. Cuando la tensión en el lado de 400 kV era de 418 kV (dentro de rango), el lado de 220 kV alcanzaba 244 kV (>110% Vn, fuera de rango). REE solo monitorizaba el SCADA a 400 kV, lo que creó un punto ciego estructural. Las plantas dispararon por sobretensión real, que el operador no podía ver.',
        ref: 'Cap. 3.3 — Fase 2',
      },
      {
        q: '¿Por qué el UFLS (deslastre de carga) agravó el colapso en lugar de ayudar?',
        a: 'Paradoja unánimemente confirmada: el UFLS fue diseñado para déficit de frecuencia (desconecta carga para reducir el desequilibrio P). Pero el 28-A el problema era de tensión (exceso de reactiva capacitiva Q). Al desconectar carga inductiva (motores, industria), eliminó los últimos sumideros de reactiva, acelerando la escalada de tensión. Las lógicas de defensa del siglo XX resultaron contraproducentes ante un colapso del siglo XXI.',
        ref: 'Cap. 5.5 — Tabla 5.4',
      },
      {
        q: '¿Qué es el mallado y por qué es controvertido?',
        a: 'Maniobra del operador que conecta circuitos de la red de transporte para reforzar la topología ante oscilaciones. ICAI sostiene que entre las 12:03 y 12:25 CEST, el mallado inyectó entre 1,05 y 2,4 GVAr de reactiva capacitiva — el "tsunami" que saturó los márgenes Q-V. REE argumenta que fue una medida protocolizada y necesaria. Esta es la divergencia central del caso.',
        ref: 'Cap. 5.1 vs 5.3',
      },
    ],
  },
  {
    category: 'NARRATIVAS Y RESPONSABILIDAD',
    color: 'var(--warning)',
    questions: [
      {
        q: '¿Quién tiene razón: REE o las eléctricas (ICAI)?',
        a: 'Ambas posiciones son termodinámicamente compatibles: el mallado inyectó reactiva capacitiva (ICAI) Y los generadores no absorbieron la suficiente (REE). Ambos factores contribuyeron a la saturación Q-V. Lo que sí son excluyentes es su implicación jurídica: determinan sobre quién recae la responsabilidad económica. La ambigüedad no es un accidente analítico; es el resultado predecible de operar sin PMUs en todos los nudos críticos.',
        ref: 'Cap. 5.5 — Síntesis interpretativa',
      },
      {
        q: '¿Por qué la oscilación de 0,63 Hz es tan importante y por qué discrepan?',
        a: 'El Gobierno/REE la califican de "forzada" (origen en planta FV de Badajoz), lo que implica una causa externa puntual. ICAI argumenta que es un modo natural interárea con amortiguamiento del 1% (límite P.O. 13.1: 5%), lo que implica una debilidad estructural del sistema. La distinción importa porque una oscilación forzada tiene un culpable; una natural tiene un sistema mal diseñado.',
        ref: 'Cap. 5 — Divergencias Tabla 5.5',
      },
      {
        q: '¿Qué posición es la más cercana a la realidad según el análisis del TFG?',
        a: 'La posición de ENTSO-E es la más estructural y la que el TFG valida en mayor medida: ambos operador y generadores actuaron dentro de una normativa que era inadecuada para el sistema que pretendía gobernar. El P.O. 7.4 y el RD 413/2014 diseñaron control de tensión para redes síncronas; aplicarlo a un sistema con 82% de IBR equivale a estabilizar dinámica de milisegundos con reguladores diseñados para minutos.',
        ref: 'Cap. 9 — Síntesis y conclusiones',
      },
    ],
  },
  {
    category: 'METODOLOGÍA Y USO DE IA',
    color: 'var(--info)',
    questions: [
      {
        q: '¿Cómo garantizaste que la IA no inventó datos?',
        a: 'Proceso de triangulación estricto en 3 fases: (1) Compilación de fuentes primarias: 4 informes oficiales de máxima autoridad (Gobierno, REE, ICAI, ENTSO-E). (2) Uso de IA solo para síntesis y clasificación documental, nunca para generar afirmaciones técnicas. (3) Validación manual de cada dato técnico contra las fuentes primarias y la física del sistema. Ejemplo: la discrepancia 418 kV vs 244 kV fue verificada en los oscilogramas de ICAI, no inferida por la IA.',
        ref: 'Cap. 8 — Uso de IA en el TFG',
      },
      {
        q: '¿Por qué usaste IA para un trabajo académico?',
        a: 'El TFG procesó más de 170 GB de registros técnicos y 4 informes de 50-100 páginas cada uno. La IA aceleró la clasificación y síntesis documental — una tarea de organización, no de análisis. El análisis técnico, la evaluación de causalidad y las conclusiones son responsabilidad exclusiva del autor. El Cap. 8 documenta explícitamente los casos donde la IA alucinó y cómo se detectaron y corrigieron.',
        ref: 'Cap. 8.2 — Tabla 8.1',
      },
    ],
  },
  {
    category: 'FUTURO Y SOLUCIONES',
    color: 'var(--nominal)',
    questions: [
      {
        q: '¿Puede volver a pasar?',
        a: 'Sí, si no se implementan las tres reformas identificadas: (1) Actualización del P.O. 7.4 y NC RfG 2.0 con Grid-Forming obligatorio ≥1 MW. (2) Despliegue de PMUs en todas las subestaciones ≥110 kV para eliminar puntos ciegos. (3) Herramientas de análisis dinámico (CSA) en tiempo real en los RCCs europeos en sustitución del criterio N-1 estático. Sin estas tres reformas simultáneas, la vulnerabilidad estructural persiste.',
        ref: 'Cap. 7.3 y Cap. 9.2',
      },
      {
        q: '¿Qué es Grid-Forming y por qué es la solución clave?',
        a: 'Un inversor Grid-Forming (GFM) se comporta como una fuente de tensión ideal detrás de una impedancia interna: impone V y f al sistema sin depender de una referencia externa (no necesita PLL). Los inversores actuales son Grid-Following (GFL): necesitan leer la red para seguirla. Con GFM obligatorio para instalaciones ≥1 MW, el 82% del parque IBR aportaría inercia sintética y amortiguamiento dinámico de tensión — resolviendo estructuralmente la vulnerabilidad del 28-A.',
        ref: 'Cap. 7.2',
      },
      {
        q: '¿Cuánto tardará en recuperarse la confianza inversora en el sistema español?',
        a: 'Esta pregunta excede el análisis forense del TFG, que se centra en la física y la gobernanza del sistema. Lo que sí puede afirmarse desde la ingeniería: la incertidumbre regulatoria post-28A (sanciones pendientes, P.O. 7.4 en revisión, NC RfG 2.0 en desarrollo) genera un entorno de señales de inversión inestables para nuevas instalaciones. El Brattle Group y MIT CEEPR identifican esta incertidumbre como el principal obstáculo a la inversión en almacenamiento y Grid-Forming en España.',
        ref: 'Cap. 7 — Resiliencia',
      },
      {
        q: '¿Cuál es la principal lección para el resto de Europa?',
        a: 'Que el paradigma de operación centralizada — un operador con visibilidad SCADA a 400 kV, criterio N-1 estático y despacho por mercado horario — fue diseñado para redes dominadas por masas síncronas. En una red donde el 82% de la generación responde en milisegundos mediante PLL, ese paradigma ha alcanzado los límites de su capacidad de gestión. El 28-A no fue un accidente ibérico; fue el primer blackout europeo a gran escala causado por inestabilidad capacitiva en red de baja inercia. Puede repetirse en cualquier sistema europeo con alta penetración IBR.',
        ref: 'Cap. 9 — Conclusiones',
      },
    ],
  },
];

export default function TribunalFAQ() {
  const [openQ, setOpenQ] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 3rem' }}>
      <p className="t-subheading" style={{ marginBottom: '0.5rem' }}>
        Preparación para la defensa
      </p>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
        fontWeight: 400, color: 'var(--text-primary)', marginBottom: '0.5rem',
      }}>
        Preguntas del tribunal — Respuestas calibradas
      </h2>
      <p className="t-body" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        15 preguntas probables del tribunal con respuestas técnicas
        ancladas en el TFG. Cada respuesta incluye la referencia exacta
        al capítulo y página correspondiente.
      </p>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {FAQ.map((section, si) => (
          <div key={si}>
            <h3 style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
              letterSpacing: '0.15em', color: section.color,
              borderBottom: `1px solid ${section.color}`,
              paddingBottom: '0.5rem', marginBottom: '1rem',
            }}>
              {section.category}
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {section.questions.map((item, qi) => {
                const key = `${si}-${qi}`;
                return (
                  <div key={qi} style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${section.color}`,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}>
                    <button
                      onClick={() => setOpenQ(openQ === key ? null : key)}
                      style={{
                        width: '100%', padding: '1rem', textAlign: 'left',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', gap: '1rem',
                      }}>
                      <p style={{
                        margin: 0, fontSize: '0.9rem', fontWeight: 500,
                        color: 'var(--text-primary)', lineHeight: 1.5,
                      }}>
                        {item.q}
                      </p>
                      <span style={{
                        fontSize: '1.25rem', color: section.color,
                        flexShrink: 0,
                      }}>
                        {openQ === key ? '−' : '+'}
                      </span>
                    </button>

                    {openQ === key && (
                      <div style={{
                        padding: '0 1rem 1rem',
                        borderTop: '1px solid var(--border)',
                      }}>
                        <p style={{
                          fontSize: '0.8125rem', color: 'var(--text-secondary)',
                          lineHeight: 1.8, margin: '0 0 0.75rem',
                        }}>
                          {item.a}
                        </p>
                        <p style={{
                          fontSize: '0.6875rem', color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)', margin: 0,
                        }}>
                          → {item.ref}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
