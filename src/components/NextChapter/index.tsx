import { useNavigate } from 'react-router-dom';

interface NextChapterProps {
  path: string;
  label: string;
  desc?: string;
}

export default function NextChapter({ path, label, desc }: NextChapterProps) {
  const navigate = useNavigate();
  return (
    <div style={{
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'flex-end',
    }} data-no-print>
      <button
        onClick={() => navigate(path)}
        style={{
          padding: '0.875rem 1.5rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          textAlign: 'right',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor =
            'var(--accent-blue)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor =
            'var(--border)';
        }}>
        {desc && (
          <p style={{
            margin: '0 0 0.25rem',
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Siguiente
          </p>
        )}
        <p style={{
          margin: 0,
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: 'var(--accent-blue)',
        }}>
          {label} →
        </p>
        {desc && (
          <p style={{
            margin: '0.125rem 0 0',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}>
            {desc}
          </p>
        )}
      </button>
    </div>
  );
}
