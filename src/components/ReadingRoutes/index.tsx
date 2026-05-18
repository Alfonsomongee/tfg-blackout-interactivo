import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadingRoutes.css';

interface Route {
  id: string;
  title: string;
  duration: string;
  description: string;
  emoji: string;
  color: string;
  path: string;
  firstComponent?: string;
}

const READING_ROUTES: Route[] = [
  {
    id: 'technical',
    title: 'Para Técnicos',
    duration: '30 min',
    description: 'Física del colapso, inercia síncrona y análisis Grid-Forming',
    emoji: '⚡',
    color: 'var(--accent-blue)',
    path: '/inercia-vuln',
    firstComponent: 'inercia'
  },
  {
    id: 'policy',
    title: 'Para Policy Makers',
    duration: '20 min',
    description: 'Timeline en tiempo real, narrativas comparadas de 4 instituciones',
    emoji: '🏛️',
    color: 'var(--warning)',
    path: '/tres-narrativas',
    firstComponent: 'narrativas'
  },
  {
    id: 'explorer',
    title: 'Exploración Libre',
    duration: '∞ min',
    description: 'Acceso a todas las 34+ visualizaciones sin ruta predefinida',
    emoji: '🔍',
    color: 'var(--nominal)',
    path: '/',
    firstComponent: 'index'
  }
];

export const ReadingRoutes: React.FC = () => {
  const navigate = useNavigate();

  const handleRouteClick = (route: Route) => {
    navigate(route.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="reading-routes-container">
      <h2 className="reading-routes-title">Elige tu ruta de lectura</h2>

      <div className="reading-routes-grid">
        {READING_ROUTES.map((route) => (
          <button
            key={route.id}
            className="reading-route-card"
            onClick={() => handleRouteClick(route)}
            style={{
              '--route-color': route.color,
              '--route-color-alpha': 'rgba(59, 130, 246, 0.094)',
            } as React.CSSProperties}
          >
            <div className="route-accent-top" style={{ backgroundColor: route.color }}></div>

            <div className="route-emoji">{route.emoji}</div>

            <h3 className="route-title">{route.title}</h3>

            <span className="route-duration">{route.duration}</span>

            <p className="route-description">{route.description}</p>

            <div className="route-cta" style={{ color: route.color }}>Comenzar →</div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ReadingRoutes;
