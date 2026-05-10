import React, { useState } from 'react';

interface TechnicalImageProps {
  src: string;
  alt: string;
  caption: string;
  source: string;
  className?: string;
}

export const TechnicalImage: React.FC<TechnicalImageProps> = ({
  src,
  alt,
  caption,
  source,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Extract basename from path for user friendliness
  const filename = src.split('/').pop() || src;

  return (
    <div className={`bg-secondary border border-main p-2.5 rounded-lg flex flex-col gap-3 shadow-sm select-none ${className}`}>
      <div className="relative aspect-video w-full bg-tertiary border border-main/50 rounded overflow-hidden flex items-center justify-center">
        {hasError ? (
          /* Premium Academic Blueprint Fallback */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0d1117] text-text-primary overflow-hidden">
            <svg
              viewBox="0 0 400 200"
              className="w-full max-w-[280px] h-auto opacity-40 mb-3"
              fill="none"
              stroke="currentColor"
            >
              {/* Technical grid */}
              <defs>
                <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />

              {/* Axes */}
              <line x1="30" y1="20" x2="30" y2="170" stroke="var(--border)" strokeWidth="1.5" />
              <line x1="30" y1="170" x2="380" y2="170" stroke="var(--border)" strokeWidth="1.5" />

              {/* Ticks & Labels */}
              <line x1="25" y1="50" x2="30" y2="50" stroke="var(--border)" />
              <line x1="25" y1="110" x2="30" y2="110" stroke="var(--border)" />
              <line x1="150" y1="170" x2="150" y2="175" stroke="var(--border)" />
              <line x1="270" y1="170" x2="270" y2="175" stroke="var(--border)" />

              {/* Technical decay curve (sine wave dying) */}
              <path
                d="M 30,80 Q 70,30 110,80 T 190,110 T 270,150 L 380,155"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-pulse"
              />

              {/* Critical threshold line */}
              <line x1="30" y1="140" x2="380" y2="140" stroke="var(--alarm)" strokeWidth="1" strokeDasharray="3,3" />
              <text x="320" y="133" fill="var(--alarm)" className="text-[8px] font-mono font-bold uppercase tracking-wider">Umbral Crítico</text>

              {/* Target placeholder icon */}
              <circle cx="200" cy="100" r="22" fill="rgba(13, 17, 23, 0.9)" stroke="var(--accent)" strokeWidth="1" />
              <path d="M 194,100 L 206,100 M 200,94 L 200,106" stroke="var(--accent)" strokeWidth="1.5" />
            </svg>

            <span className="text-[10px] font-mono tracking-widest text-accent font-bold uppercase block mb-1">
              EVIDENCIA GRÁFICA ASOCIADA
            </span>
            <span className="text-[11px] font-serif italic text-text-secondary leading-snug max-w-[280px] block">
              Arrastre el archivo <strong className="text-text-primary not-italic font-mono bg-secondary border border-main px-1 py-0.5 rounded">{filename}</strong> a la carpeta <code className="text-text-primary bg-secondary px-1 py-0.5 rounded">public/images/</code>
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="max-h-full max-w-full object-contain transition-opacity duration-300 select-text"
          />
        )}
      </div>

      <div className="border-t border-main/50 pt-2 flex flex-col gap-1">
        <span className="font-mono text-xs text-text-primary font-bold leading-snug">
          {caption}
        </span>
        <span className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">
          {source}
        </span>
      </div>
    </div>
  );
};

export default TechnicalImage;
