import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GLOSSARY } from './glossaryData';
import type { GlossaryTerm } from './glossaryData';
import './GlossaryFloating.css';

export const GlossaryFloating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>(GLOSSARY);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter terms based on search
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = GLOSSARY.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        term.fullName.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
    );
    setFilteredTerms(filtered);
    setSelectedTermId(filtered.length > 0 ? filtered[0].id : null);
  }, [searchQuery]);

  // Focus trap: when modal opens, focus search input
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on click outside
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  }, []);

  const selectedTerm = filteredTerms.find((t) => t.id === selectedTermId);

  return (
    <>
      {/* Floating button */}
      <button
        className="glossary-float-button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir glosario"
        title="Glosario técnico (G)"
      >
        <span className="glossary-icon">📖</span>
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="glossary-backdrop"
          onClick={handleBackdropClick}
          role="presentation"
        >
          <div
            className="glossary-modal"
            ref={modalRef}
            role="dialog"
            aria-labelledby="glossary-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="glossary-header">
              <h2 id="glossary-title" className="glossary-title">
                🔍 Glosario Técnico
              </h2>
              <button
                className="glossary-close"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar glosario"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="glossary-search-container">
              <input
                ref={searchInputRef}
                type="text"
                className="glossary-search-input"
                placeholder="Buscar término... (RoCoF, Inercia, Grid-Forming)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar en glosario"
              />
            </div>

            {/* Content */}
            <div className="glossary-content">
              {/* Terms list */}
              <div className="glossary-list">
                <div className="glossary-list-header">
                  <span className="glossary-list-title">
                    Términos ({filteredTerms.length})
                  </span>
                </div>
                <ul className="glossary-terms">
                  {filteredTerms.map((term) => (
                    <li key={term.id}>
                      <button
                        className={`glossary-term-button ${
                          selectedTermId === term.id ? 'active' : ''
                        }`}
                        onClick={() => setSelectedTermId(term.id)}
                        aria-selected={selectedTermId === term.id}
                      >
                        <span className="term-name">{term.term}</span>
                        <span className="term-full-name">{term.fullName}</span>
                      </button>
                    </li>
                  ))}
                  {filteredTerms.length === 0 && (
                    <li className="glossary-no-results">
                      No se encontraron términos
                    </li>
                  )}
                </ul>
              </div>

              {/* Term details */}
              {selectedTerm && (
                <div className="glossary-details">
                  <div className="details-header">
                    <h3 className="details-term">{selectedTerm.term}</h3>
                    <p className="details-full-name">{selectedTerm.fullName}</p>
                  </div>

                  <div className="details-section">
                    <h4 className="details-label">Definición</h4>
                    <p className="details-text">{selectedTerm.definition}</p>
                  </div>

                  {selectedTerm.formula && (
                    <div className="details-section">
                      <h4 className="details-label">Fórmula</h4>
                      <div className="details-formula">{selectedTerm.formula}</div>
                    </div>
                  )}

                  {selectedTerm.relatedTerms.length > 0 && (
                    <div className="details-section">
                      <h4 className="details-label">Términos relacionados</h4>
                      <div className="details-related">
                        {selectedTerm.relatedTerms.map((relatedTerm) => (
                          <span key={relatedTerm} className="related-tag">
                            {relatedTerm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTerm.seenInModules.length > 0 && (
                    <div className="details-section">
                      <h4 className="details-label">Módulos relacionados</h4>
                      <div className="details-modules">
                        {selectedTerm.seenInModules.map((modulePath) => (
                          <span key={modulePath} className="module-tag">
                            {modulePath.replace(/-/g, ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {filteredTerms.length === 0 && (
                <div className="glossary-empty">
                  <p>No hay términos que coincidan con tu búsqueda</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="glossary-footer">
              <span className="glossary-tip">
                💡 Presiona <kbd>ESC</kbd> para cerrar
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(GlossaryFloating);
