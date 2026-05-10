import React, { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';

interface AnimatedMetricProps {
  value?: number;
  unit?: string;
  label: string;
  sublabel?: string;
  color?: string;
  decimals?: number;
  prefix?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export default function AnimatedMetric({
  value = 0,
  unit = '',
  label,
  sublabel,
  color = 'var(--accent-blue)',
  decimals = 0,
  prefix = '',
  size = 'md',
  children,
}: AnimatedMetricProps) {
  const { ref, inView } = useInView();
  const [started, setStarted] = useState(false);
  const counted = useCountUp(value, 1200, started, decimals);

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  const fontSize = size === 'lg' ? '2.5rem' : size === 'sm' ? '1.5rem' : '2rem';

  return (
    <div ref={ref} style={{
      padding: '1.25rem',
      background: 'var(--bg-raised)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      transition: 'transform 0.2s, border-color 0.2s',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      (e.currentTarget as HTMLElement).style.borderColor = color;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
    }}>
      {children ? (
        children
      ) : (
        <p style={{
          margin: '0 0 0.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize,
          fontWeight: 600,
          color,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {prefix}{counted.toFixed(decimals)}{unit}
        </p>
      )}
      <p style={{
        margin: sublabel ? '0 0 0.25rem' : 0,
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        fontWeight: 500,
        lineHeight: 1.4,
      }}>
        {label}
      </p>
      {sublabel && (
        <p style={{
          margin: 0,
          fontSize: '0.6875rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.4,
        }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}
