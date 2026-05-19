import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '80vh', flexDirection: 'column', gap: '2rem', textAlign: 'center',
    padding: '2rem',
  }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '6rem', fontWeight: 700, color: 'var(--accent-ice-blue, #3dd5f3)', opacity: 0.25, letterSpacing: '0.05em', lineHeight: 1 }}>
      404
    </div>
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
        Sistema No Encontrado
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.75, maxWidth: '44ch', margin: '0 auto' }}>
        La ruta que buscas no existe en nuestra investigación.
        <br />
        Así como el apagón fue inesperado, esta página también escapó a nuestro análisis.
      </p>
    </div>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link
        to="/"
        style={{
          padding: '0.75rem 1.5rem',
          background: 'rgba(61,213,243,0.1)',
          color: 'var(--accent-ice-blue, #3dd5f3)',
          border: '1px solid rgba(61,213,243,0.3)',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'all 0.15s ease-out',
        }}
      >
        ← Volver a Inicio
      </Link>
      <Link
        to="/brief"
        style={{
          padding: '0.75rem 1.5rem',
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          textDecoration: 'none',
          transition: 'all 0.15s ease-out',
        }}
      >
        Ver Resumen Ejecutivo
      </Link>
    </div>
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      SISTEMA ELÉCTRICO IBÉRICO — ANÁLISIS FORENSE 28-A
    </p>
  </div>
);

export default NotFound;
