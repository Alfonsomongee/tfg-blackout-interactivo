import { useState } from 'react';
import NextChapter from '../NextChapter';

interface Question {
  id: number;
  quote: string;
  context: string;
  options: { id: string; label: string; institution: string }[];
  correct: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    quote: '"La inercia del sistema eléctrico peninsular en el momento del colapso era de 2,3 s, muy por debajo del mínimo de seguridad operativa europeo."',
    context: 'Informe técnico sobre el estado del sistema en el instante del colapso.',
    options: [
      { id: 'a', label: 'ENTSO-E', institution: 'Red de operadores europeos de transporte' },
      { id: 'b', label: 'REE', institution: 'Red Eléctrica de España' },
      { id: 'c', label: 'Ministerio', institution: 'Ministerio para la Transición Ecológica' },
      { id: 'd', label: 'CNMC', institution: 'Comisión Nacional de Mercados y Competencia' },
    ],
    correct: 'a',
    explanation:
      'ENTSO-E documentó en su informe técnico de mayo 2025 que la inercia del sistema era de 2,3 s —muy por debajo del umbral de 5 s de los códigos europeos de red— cuando la penetración IBR alcanzó el 82%.',
  },
  {
    id: 2,
    quote: '"Los sistemas de protección operaron conforme al diseño normativo vigente. La velocidad de propagación de la perturbación superó los tiempos de intervención operativa previstos."',
    context: 'Evaluación de los protocolos de emergencia del sistema eléctrico.',
    options: [
      { id: 'a', label: 'ENTSO-E', institution: 'Red de operadores europeos de transporte' },
      { id: 'b', label: 'REE', institution: 'Red Eléctrica de España' },
      { id: 'c', label: 'REN', institution: 'Redes Energéticas Nacionais (Portugal)' },
      { id: 'd', label: 'CECRE', institution: 'Centro de Control de Energías Renovables' },
    ],
    correct: 'b',
    explanation:
      'REE, en su informe técnico preliminar, afirmó que las protecciones actuaron correctamente pero que la cascada se propagó en 32,7 s, imposible de gestionar con los tiempos de respuesta humana.',
  },
  {
    id: 3,
    quote: '"El Procedimiento de Operación P.O. 7.4 no contemplaba requisitos mínimos de inercia para escenarios de penetración renovable superiores al 75% en tiempo real."',
    context: 'Análisis crítico del marco regulatorio del sector eléctrico español.',
    options: [
      { id: 'a', label: 'REE', institution: 'Red Eléctrica de España' },
      { id: 'b', label: 'Gobierno', institution: 'Gobierno de España' },
      { id: 'c', label: 'CNMC', institution: 'Comisión Nacional de Mercados y Competencia' },
      { id: 'd', label: 'ACER', institution: 'Agencia de Cooperación de Reguladores de Energía (UE)' },
    ],
    correct: 'c',
    explanation:
      'La CNMC señaló en su análisis que el P.O. 7.4 no había sido actualizado para contemplar requisitos de estabilidad en sistemas con alta penetración de recursos basados en inversores.',
  },
  {
    id: 4,
    quote: '"La recuperación del 95% del suministro peninsular se completó a las 06:00 del 29 de abril, siguiendo los protocolos de Black Start en las secuencias previstas."',
    context: 'Informe de gestión de la crisis y reposición del servicio eléctrico.',
    options: [
      { id: 'a', label: 'REE', institution: 'Red Eléctrica de España' },
      { id: 'b', label: 'Ministerio', institution: 'Ministerio para la Transición Ecológica' },
      { id: 'c', label: 'ENTSO-E', institution: 'Red de operadores europeos de transporte' },
      { id: 'd', label: 'OMIE', institution: 'Operador del Mercado Ibérico de Electricidad' },
    ],
    correct: 'b',
    explanation:
      'El Ministerio para la Transición Ecológica publicó el timeline oficial de recuperación, indicando que el 95% del suministro quedó restablecido a las 6:00 del 29 de abril de 2025.',
  },
  {
    id: 5,
    quote: '"La instalación prioritaria de compensadores síncronos en los nudos críticos de la red de transporte de 400 kV es la medida más urgente para restaurar la inercia mínima del sistema."',
    context: 'Propuesta de medidas estructurales preventivas post-colapso.',
    options: [
      { id: 'a', label: 'ENTSO-E', institution: 'Red de operadores europeos de transporte' },
      { id: 'b', label: 'CECRE', institution: 'Centro de Control de Energías Renovables' },
      { id: 'c', label: 'REE', institution: 'Red Eléctrica de España' },
      { id: 'd', label: 'Academia', institution: 'Investigadores y expertos técnicos independientes' },
    ],
    correct: 'c',
    explanation:
      'REE, en su plan de acción post-evento, priorizó la instalación de compensadores síncronos en los 23 nudos críticos de la red de 400 kV como medida de refuerzo de inercia a corto plazo.',
  },
];

type AnswerState = { selected: string | null; revealed: boolean };

export default function QuizTribunal() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(
    QUESTIONS.map(() => ({ selected: null, revealed: false }))
  );
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[currentQ];
  const answer = answers[currentQ];
  const score = answers.filter((a, i) => a.selected === QUESTIONS[i].correct).length;

  const selectOption = (id: string) => {
    if (answer.revealed) return;
    setAnswers(prev =>
      prev.map((a, i) => (i === currentQ ? { ...a, selected: id, revealed: true } : a))
    );
  };

  const next = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers(QUESTIONS.map(() => ({ selected: null, revealed: false })));
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const verdict =
      pct >= 80
        ? 'Experto forense: conocimiento sólido del caso.'
        : pct >= 60
          ? 'Analista: comprensión parcial del caso.'
          : 'Observador: repasa los informes técnicos.';
    const color = pct >= 80 ? 'var(--nominal)' : pct >= 60 ? 'var(--warning)' : 'var(--alarm)';
    return (
      <div>
        <header style={{ marginBottom: '1.5rem' }}>
          <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
            QUIZ FORENSE · RESULTADO FINAL
          </p>
          <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
            Veredicto del Tribunal
          </h1>
        </header>
        <div
          className="glass-panel"
          style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '5rem',
              fontWeight: 700,
              color,
              margin: '0 0 0.5rem',
              lineHeight: 1,
            }}
          >
            {score}/{QUESTIONS.length}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
            }}
          >
            {verdict}
          </p>
          <button
            className="btn-spring"
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              background: 'var(--accent-blue)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              letterSpacing: '0.06em',
            }}
          >
            REPETIR QUIZ
          </button>
        </div>
        <NextChapter
          path="/data-cards"
          label="Datos del Colapso"
          desc="12 métricas clave del apagón del 28-A animadas"
        />
      </div>
    );
  }

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          QUIZ FORENSE · {currentQ + 1} DE {QUESTIONS.length}
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          ¿Quién dijo esto?
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          Identifica qué institución emitió cada declaración técnica sobre el apagón del 28 de
          abril de 2025. Cuatro actores. Una posición correcta por pregunta.
        </p>
      </header>

      {/* Progress */}
      <div
        style={{
          height: '4px',
          background: 'var(--border)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${((currentQ + (answer.revealed ? 1 : 0)) / QUESTIONS.length) * 100}%`,
            background: 'var(--accent-blue)',
            transition: 'width 0.3s ease',
            borderRadius: 'var(--radius-sm)',
          }}
        />
      </div>

      {/* Quote card */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.0625rem',
            lineHeight: 1.65,
            color: 'var(--text-primary)',
            margin: '0 0 1rem',
            fontStyle: 'italic',
          }}
        >
          {question.quote}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--text-secondary)',
            margin: 0,
            letterSpacing: '0.05em',
          }}
        >
          CONTEXTO: {question.context}
        </p>
      </div>

      {/* Options */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        {question.options.map(opt => {
          const isSelected = answer.selected === opt.id;
          const isCorrect = opt.id === question.correct;
          let borderColor = 'var(--border)';
          let bg = 'transparent';
          if (answer.revealed) {
            if (isCorrect) {
              borderColor = 'var(--nominal)';
              bg = 'rgba(0,119,34,0.08)';
            } else if (isSelected) {
              borderColor = 'var(--alarm)';
              bg = 'rgba(255,32,32,0.08)';
            }
          }
          return (
            <button
              key={opt.id}
              onClick={() => selectOption(opt.id)}
              disabled={answer.revealed}
              style={{
                padding: '1rem',
                background: bg,
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                cursor: answer.revealed ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <p
                style={{
                  margin: '0 0 0.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {opt.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {opt.institution}
              </p>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answer.revealed && (
        <div
          style={{
            padding: '1rem 1.25rem',
            background:
              answer.selected === question.correct
                ? 'rgba(0,119,34,0.06)'
                : 'rgba(255,32,32,0.06)',
            border: `1px solid ${answer.selected === question.correct ? 'var(--nominal)' : 'var(--alarm)'}`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              margin: '0 0 0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              color:
                answer.selected === question.correct ? 'var(--nominal)' : 'var(--alarm)',
            }}
          >
            {answer.selected === question.correct ? '✓ CORRECTO' : '✗ INCORRECTO'}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
            }}
          >
            {question.explanation}
          </p>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          Puntuación: {score} / {currentQ + (answer.revealed ? 1 : 0)}
        </p>
        {answer.revealed && (
          <button
            className="btn-spring"
            onClick={next}
            style={{
              padding: '0.75rem 1.75rem',
              background: 'var(--accent-blue)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              letterSpacing: '0.06em',
            }}
          >
            {currentQ < QUESTIONS.length - 1 ? 'SIGUIENTE →' : 'VER RESULTADO'}
          </button>
        )}
      </div>
    </div>
  );
}
