import React from 'react';

export type AccentColor = 'critical' | 'normal' | 'warning' | 'success' | 'blue' | 'none';

interface BentoCardProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  rows?: 1 | 2 | 3 | 4;
  accent?: AccentColor;
  className?: string;
  style?: React.CSSProperties;
}

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  cols = 1,
  rows = 1,
  accent = 'none',
  className = '',
  style,
}) => {
  const accentClass = accent !== 'none' ? `bento-accent-${accent}` : '';

  return (
    <div
      className={`bento-card bento-col-${cols} bento-row-${rows} ${accentClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => (
  <div className={`bento-grid ${className}`}>
    {children}
  </div>
);

interface BentoMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  variant?: AccentColor;
  pulse?: boolean;
  sublabel?: string;
}

export const BentoMetric: React.FC<BentoMetricProps> = ({
  label,
  value,
  unit,
  variant = 'normal',
  pulse = false,
  sublabel,
}) => {
  const variantClass = variant !== 'none' ? `bento-metric-${variant}` : '';
  const pulseClass = pulse ? 'alert-pulse' : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.5rem' }}>
      <span className="bento-label">{label}</span>
      <div className={`bento-metric ${variantClass} ${pulseClass}`}>
        {value}
        {unit && (
          <span style={{ fontSize: '0.4em', fontWeight: 400, marginLeft: '0.25em', opacity: 0.7 }}>
            {unit}
          </span>
        )}
      </div>
      {sublabel && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {sublabel}
        </div>
      )}
    </div>
  );
};

export default BentoGrid;
