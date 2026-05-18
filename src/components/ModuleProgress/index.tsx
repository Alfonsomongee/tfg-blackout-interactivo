import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getModuleByPath,
  getModuleIndex,
  getPreviousModule,
  getNextModule,
  getProgressPercentage,
  MODULES_SEQUENCE,
} from '../../config/modulesConfig';
import './ModuleProgress.css';

export const ModuleProgress: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentModule = getModuleByPath(location.pathname);
  const moduleIndex = getModuleIndex(location.pathname);
  const previousModule = getPreviousModule(location.pathname);
  const nextModule = getNextModule(location.pathname);
  const progressPercent = getProgressPercentage(location.pathname);

  // Si no está en una ruta conocida, no mostrar
  if (!currentModule) return null;

  const handlePrevious = () => {
    if (previousModule) navigate(previousModule.path);
  };

  const handleNext = () => {
    if (nextModule) navigate(nextModule.path);
  };

  return (
    <div className="module-progress">
      <div className="progress-container">
        {/* Botón anterior */}
        <button
          className="nav-button prev-button"
          onClick={handlePrevious}
          disabled={!previousModule}
          aria-label="Módulo anterior"
        >
          <span className="arrow">←</span>
          <span className="label">Anterior</span>
        </button>

        {/* Barra de progreso y información */}
        <div className="progress-content">
          <div className="progress-info">
            <div className="module-counter">
              Módulo <span className="current">{moduleIndex + 1}</span>
              <span className="divider">/</span>
              <span className="total">{MODULES_SEQUENCE.length}</span>
            </div>

            <div className="module-details">
              <div className="section-badge">{currentModule.section}</div>
              <p className="module-name">{currentModule.name}</p>
              <p className="module-desc">{currentModule.description}</p>
              <div className="duration">
                <span className="duration-icon">⏱️</span>
                <span>{currentModule.duration}</span>
              </div>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progressPercent}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Botón siguiente */}
        <button
          className="nav-button next-button"
          onClick={handleNext}
          disabled={!nextModule}
          aria-label="Siguiente módulo"
        >
          <span className="label">Siguiente</span>
          <span className="arrow">→</span>
        </button>
      </div>

      {/* Línea de separación */}
      <div className="progress-separator" />
    </div>
  );
};

export default React.memo(ModuleProgress);
