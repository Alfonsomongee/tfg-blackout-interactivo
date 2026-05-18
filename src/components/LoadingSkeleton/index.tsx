import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './LoadingSkeleton.css';

/**
 * LoadingSkeleton - Muestra placeholder durante transiciones de ruta
 * Se desvanece automáticamente después de 600ms
 */
export const LoadingSkeleton: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mostrar skeleton al cambiar ruta
    setIsLoading(true);

    // Ocultarla después de 600ms
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="loading-skeleton">
      <div className="skeleton-content">
        {/* Header skeleton */}
        <div className="skeleton-header">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-subtitle" />
        </div>

        {/* Progress bar skeleton */}
        <div className="skeleton-progress">
          <div className="skeleton-bar" />
        </div>

        {/* Main content placeholder */}
        <div className="skeleton-body">
          <div className="skeleton-line skeleton-large" />
          <div className="skeleton-line skeleton-medium" style={{ marginTop: '1rem' }} />
          <div className="skeleton-line skeleton-medium" />
          <div className="skeleton-line skeleton-medium" style={{ marginBottom: '2rem' }} />

          {/* Chart placeholder */}
          <div className="skeleton-chart" />

          {/* Footer skeleton */}
          <div className="skeleton-footer">
            <div className="skeleton-line skeleton-small" />
            <div className="skeleton-line skeleton-small" style={{ marginTop: '0.5rem' }} />
          </div>
        </div>
      </div>

      {/* Shimmer animation overlay */}
      <div className="skeleton-shimmer" />
    </div>
  );
};

export default React.memo(LoadingSkeleton);
