import React, { useState } from 'react';

interface ExplorablePillProps {
  term: string;
  label?: string;
}

interface TermDetails {
  title: string;
  subtitle: string;
  description: string;
  equation: string;
  bulletPoints: string[];
}

const DICTIONARY: Record<string, TermDetails> = {
  'tap-lag': {
    title: 'Inercia del Cambiador de Tomas (Tap-Lag)',
    subtitle: 'Mecanismo Electromecánico de Degradación de Tensión',
    description: 'Fenómeno dinámico en transformadores de potencia donde los reguladores automáticos de tensión (OLTC) intentan restaurar la tensión en el lado de baja impedancia elevando la toma, lo que incrementa el consumo de potencia reactiva en la red de transporte de 400 kV desatando un colapso irreversible.',
    equation: 'ΔQ_loss ≈ (V_sec / N)^2 · B_eq',
    bulletPoints: [
      'Retardo temporal electromecánico de 30 a 90 segundos por escalón.',
      'Efecto perverso ante escasez de reactiva: agrava la caída de tensión primaria.',
      'Invisible para los operadores de despacho en ventanas de telemetría estacionaria.'
    ]
  },
  'pll-instability': {
    title: 'Inestabilidad del Bucle de Enganche de Fase (PLL)',
    subtitle: 'Desacoplo Asíncrono en Redes de Baja Potencia de Cortocircuito',
    description: 'En redes con alta penetración de inversores (IBR) y baja inercia síncrona (SCR < 1.5), el algoritmo PLL pierde la referencia del ángulo de tensión del estator durante huecos de tensión rápidos, provocando el disparo en cascada de los parques eólicos y fotovoltaicos.',
    equation: 'dθ/dt = K_p · v_q + K_i ∫ v_q dt',
    bulletPoints: [
      'Pérdida de sincronismo instantánea (< 50 ms) tras fallos de red.',
      'Mitigable únicamente mediante control Grid-Forming (inversores de tensión).',
      'Causa principal del apagón asíncrono en la zona centro-sur.'
    ]
  },
  'hvdc-pmode1': {
    title: 'Enlace HVDC INELFE: PMODE3 → PMODE1',
    subtitle: 'Bloqueo de Amortiguamiento de Frecuencia',
    description: 'Cambio de modo de control de la interconexión de corriente continua España-Francia. Al pasar de emulación síncrona (PMODE3) a consigna de potencia activa fija (PMODE1 a 1.000 MW), se eliminó la contribución del enlace al control primario de frecuencia.',
    equation: 'P_export = P_ref (Constante independiente de Δf)',
    bulletPoints: [
      'Anula el estatismo de frecuencia entre la Península y Europa.',
      'Decisión tomada por los operadores para evitar sobrecargas térmicas en los Pirineos.',
      'Aceleró la pendiente df/dt durante el desacoplo de Marruecos.'
    ]
  }
};

export const ExplorablePill: React.FC<ExplorablePillProps> = ({ term, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const key = term.toLowerCase().trim();
  const info = DICTIONARY[key] || {
    title: label || term,
    subtitle: 'Definición Técnica Forense',
    description: 'Concepto electrotécnico y de estabilidad de sistemas de energía eléctrica analizado en la instrucción forense del apagón ibérico.',
    equation: 'S = P + jQ',
    bulletPoints: ['Parámetro crítico en el análisis de contingencias de la red de transporte.']
  };

  return (
    <>
      <span
        onClick={() => setIsOpen(true)}
        className="explorable-pill"
        title="Clic para profundizar en el modelo matemático"
      >
        <span>💡</span>
        <span>{label || term}</span>
      </span>

      {isOpen && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in select-text">
          <div className="bg-secondary border border-main rounded-xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 relative">
            <div className="flex justify-between items-start border-b border-main pb-3">
              <div>
                <span className="font-mono text-[9px] text-accent uppercase font-bold tracking-widest block mb-0.5">// EXPLORABLE EXPLANATION · TFG</span>
                <h4 className="font-serif text-lg font-bold text-text-primary m-0">{info.title}</h4>
                <span className="text-xs text-text-secondary font-mono">{info.subtitle}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-text-primary text-lg font-bold bg-tertiary px-2 py-0.5 rounded border border-main cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed m-0 font-sans">
              {info.description}
            </p>

            {/* Ecuación teórica */}
            <div className="bg-tertiary border-l-2 border-accent p-3 rounded font-mono text-xs">
              <span className="text-text-muted text-[10px] block mb-1">MODELO MATEMÁTICO:</span>
              <span className="text-text-primary font-bold">{info.equation}</span>
            </div>

            {/* Puntos clave */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] text-text-muted uppercase">Conclusiones para el Tribunal:</span>
              <ul className="m-0 pl-4 text-xs text-text-secondary space-y-1 font-sans">
                {info.bulletPoints.map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-main pt-2 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-accent text-white font-mono text-xs px-4 py-2 rounded hover:bg-accent-blue/90 font-bold tracking-wider uppercase cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExplorablePill;
