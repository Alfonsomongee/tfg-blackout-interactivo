import React, { useState } from 'react';
import { SourcesTable } from './SourcesTable';
import { CITATION_FORMATS, METHODOLOGY_DATA } from './citations';
import './MethodologyBanner.css';

export const MethodologyBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCitationFormat, setActiveCitationFormat] = useState<'bibtex' | 'apa' | 'chicago'>('bibtex');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="methodology-banner">
      {/* HEADER COLAPSABLE */}
      <button
        className="methodology-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="methodology-icon">📋</span>
        <span className="methodology-label">
          Metodología & Transparencia
        </span>
        <span className={`methodology-toggle ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </button>

      {/* CONTENIDO EXPANDIBLE */}
      {isExpanded && (
        <div className="methodology-content">

          {/* 1. CLASIFICACIÓN DEL EVENTO */}
          <section className="methodology-section">
            <h3 className="section-title">🔴 Evento Analizado</h3>
            <div className="event-classification">
              <div className="event-row">
                <span className="event-label">Tipo:</span>
                <span className="event-value">{METHODOLOGY_DATA.eventClassification.value}</span>
                <span className="event-badge real">REAL</span>
              </div>
              <div className="event-row">
                <span className="event-label">Fecha:</span>
                <span className="event-value">{METHODOLOGY_DATA.eventClassification.date}</span>
              </div>
              <div className="event-row">
                <span className="event-label">Contexto:</span>
                <span className="event-value">{METHODOLOGY_DATA.eventClassification.context}</span>
              </div>
            </div>
          </section>

          {/* 2. FUENTES ANALIZADAS */}
          <section className="methodology-section">
            <h3 className="section-title">🏛️ Fuentes Institucionales</h3>
            <SourcesTable />
          </section>

          {/* 3. METODOLOGÍA */}
          <section className="methodology-section">
            <h3 className="section-title">⚙️ Enfoque Analítico</h3>
            <p className="methodology-text">{METHODOLOGY_DATA.methodology}</p>
          </section>

          {/* 4. LIMITACIONES */}
          <section className="methodology-section">
            <h3 className="section-title">⚠️ Limitaciones Conocidas</h3>
            <ul className="limitations-list">
              {METHODOLOGY_DATA.limitations.map((limitation, idx) => (
                <li key={idx}>{limitation}</li>
              ))}
            </ul>
          </section>

          {/* 5. CITACIÓN */}
          <section className="methodology-section">
            <h3 className="section-title">📖 Cómo Citar</h3>

            <div className="citation-format-selector">
              {Object.keys(CITATION_FORMATS).map((format) => (
                <button
                  key={format}
                  className={`format-button ${activeCitationFormat === format ? 'active' : ''}`}
                  onClick={() => setActiveCitationFormat(format as any)}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="citation-display">
              <pre className="citation-text">
                {CITATION_FORMATS[activeCitationFormat]}
              </pre>

              <button
                className="copy-button"
                onClick={() => handleCopy(CITATION_FORMATS[activeCitationFormat])}
              >
                {copied ? '✓ Copiado' : '📋 Copiar'}
              </button>
            </div>

            <p className="citation-note">
              Última actualización: {METHODOLOGY_DATA.lastUpdated}
            </p>
          </section>

        </div>
      )}
    </div>
  );
};

export default MethodologyBanner;
