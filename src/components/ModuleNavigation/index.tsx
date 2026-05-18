import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MODULES_SEQUENCE, getModuleByPath, getPreviousModule, getNextModule } from '../../config/modulesConfig';
import './ModuleNavigation.css';

export const ModuleNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentModule = getModuleByPath(location.pathname);
  const previousModule = currentModule ? getPreviousModule(currentModule.order) : null;
  const nextModule = currentModule ? getNextModule(currentModule.order) : null;

  // Keyboard shortcuts: Arrow keys for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && previousModule && e.ctrlKey) {
        e.preventDefault();
        navigate(previousModule.path);
      } else if (e.key === 'ArrowRight' && nextModule && e.ctrlKey) {
        e.preventDefault();
        navigate(nextModule.path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previousModule, nextModule, navigate]);

  // Only show on non-home routes
  if (!currentModule || location.pathname === '/') {
    return null;
  }

  return (
    <footer className="module-navigation">
      <div className="nav-container">
        {/* Previous button */}
        <div className="nav-section nav-prev">
          {previousModule ? (
            <button
              className="nav-button"
              onClick={() => navigate(previousModule.path)}
              title="Anterior (Ctrl+←)"
              aria-label={`Ir a ${previousModule.name}`}
            >
              <span className="nav-arrow">←</span>
              <span className="nav-label">Anterior</span>
              <span className="nav-module">{previousModule.emoji} {previousModule.name}</span>
              <span className="nav-hint">Ctrl+←</span>
            </button>
          ) : (
            <div className="nav-button disabled">
              <span className="nav-arrow">←</span>
              <span className="nav-label">Anterior</span>
            </div>
          )}
        </div>

        {/* Breadcrumb center */}
        <div className="nav-breadcrumb">
          <span className="breadcrumb-section">{currentModule.section}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-name">{currentModule.name}</span>
        </div>

        {/* Next button */}
        <div className="nav-section nav-next">
          {nextModule ? (
            <button
              className="nav-button"
              onClick={() => navigate(nextModule.path)}
              title="Siguiente (Ctrl+→)"
              aria-label={`Ir a ${nextModule.name}`}
            >
              <span className="nav-module">{nextModule.emoji} {nextModule.name}</span>
              <span className="nav-label">Siguiente</span>
              <span className="nav-arrow">→</span>
              <span className="nav-hint">Ctrl+→</span>
            </button>
          ) : (
            <div className="nav-button disabled">
              <span className="nav-label">Siguiente</span>
              <span className="nav-arrow">→</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default React.memo(ModuleNavigation);
