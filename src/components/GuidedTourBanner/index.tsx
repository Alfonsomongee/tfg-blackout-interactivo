import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuidedTourBanner.css';

/**
 * GuidedTourBanner - Onboarding interactivo en la portada
 * Guía a usuarios nuevos a través de 3 pasos clave
 * Se puede cerrar y no vuelve a aparecer (localStorage)
 */
export const GuidedTourBanner: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Solo mostrar en portada si no fue cerrado previamente
    const tourClosed = localStorage.getItem('guidedTourClosed');
    if (!tourClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('guidedTourClosed', 'true');
  };

  const handleStepClick = (path: string) => {
    navigate(path);
    // Mantener visible en rutas internas si es necesario
  };

  const steps = [
    {
      number: 1,
      icon: '📚',
      title: 'Entiende el evento',
      description: 'El 28 de agosto: 90 segundos que colapsaron el sistema eléctrico español',
      cta: 'Ver cronología',
      path: '/countdown',
    },
    {
      number: 2,
      icon: '🏛️',
      title: 'Analiza las narrativas',
      description: 'Tres instituciones, tres interpretaciones irreconciliables del mismo evento',
      cta: 'Explorar divergencias',
      path: '/tres-narrativas',
    },
    {
      number: 3,
      icon: '⚙️',
      title: 'Simula y experimenta',
      description: 'Usa el simulador para ver cómo la inercia determina la estabilidad',
      cta: 'Abrir simulador',
      path: '/simulator',
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="guided-tour-banner">
      <div className="tour-header">
        <div className="tour-title">
          <span className="tour-icon">🎯</span>
          <span>Bienvenido al análisis forense del 28-A</span>
        </div>
        <button
          className="tour-close"
          onClick={handleClose}
          aria-label="Cerrar guía"
        >
          ✕
        </button>
      </div>

      <div className="tour-content">
        {/* Step indicators */}
        <div className="tour-steps">
          {steps.map((step, idx) => (
            <button
              key={idx}
              className={`step-indicator ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(idx)}
              aria-label={`Paso ${step.number}`}
            >
              <span className="step-number">{idx < currentStep ? '✓' : step.number}</span>
            </button>
          ))}
        </div>

        {/* Current step content */}
        <div className="tour-step-content">
          <div className="step-icon">{steps[currentStep].icon}</div>
          <h3 className="step-title">{steps[currentStep].title}</h3>
          <p className="step-description">{steps[currentStep].description}</p>

          <div className="step-controls">
            <button
              className="step-button prev"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              ← Anterior
            </button>

            <button
              className="step-button cta"
              onClick={() => handleStepClick(steps[currentStep].path)}
            >
              {steps[currentStep].cta}
            </button>

            <button
              className="step-button next"
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Siguiente →
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="tour-progress">
          {Array.from({ length: steps.length }).map((_, idx) => (
            <div
              key={idx}
              className={`progress-dot ${idx === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(GuidedTourBanner);
