import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MODULES_SEQUENCE } from '../../config/modulesConfig';

export function ModulesGrid() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <>
      {/* Grid Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-40 p-2 rounded border border-main/50 hover:border-accent-cyan bg-secondary/50 hover:bg-secondary transition-all"
        title="Modules (Ctrl+M)"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
      >
        <span style={{ fontSize: '16px' }}>⊞</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Grid Modal */}
      {isOpen && (
        <div className="fixed inset-4 md:inset-8 z-50 bg-primary border border-main rounded-lg overflow-hidden flex flex-col animate-fade-in">
          {/* Header */}
          <div className="border-b border-main px-6 py-4 flex justify-between items-center bg-secondary/30">
            <div>
              <h2 className="font-serif text-lg font-bold text-text-primary">
                NAVEGACIÓN DE MÓDULOS
              </h2>
              <p className="text-xs text-text-secondary font-mono mt-1">
                {MODULES_SEQUENCE.length} módulos • Presiona ESC para cerrar
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-secondary hover:text-text-primary transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {MODULES_SEQUENCE.map((module) => {
                const isCurrent = isCurrentPath(module.path);
                return (
                  <button
                    key={module.id}
                    onClick={() => handleNavigate(module.path)}
                    className={`p-4 rounded border transition-all text-left group relative ${
                      isCurrent
                        ? 'border-accent-cyan bg-secondary shadow-lg shadow-accent-cyan/20'
                        : 'border-main/50 bg-secondary/50 hover:border-accent-cyan hover:bg-secondary'
                    }`}
                  >
                    {/* Module Number Badge */}
                    <div
                      className={`text-xs font-bold font-mono mb-2 ${
                        isCurrent ? 'text-accent-cyan' : 'text-text-secondary'
                      }`}
                    >
                      {String(module.order).padStart(2, '0')}
                    </div>

                    {/* Emoji */}
                    <div className="text-2xl mb-2">{module.emoji}</div>

                    {/* Title */}
                    <h3
                      className={`text-xs font-bold leading-tight ${
                        isCurrent ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                      style={{
                        fontSize: '11px',
                        lineHeight: '1.3',
                      }}
                    >
                      {module.name}
                    </h3>

                    {/* Section Tag */}
                    <div className="mt-2 inline-block">
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded border font-mono"
                        style={{
                          borderColor: isCurrent ? 'var(--accent-cyan)' : 'var(--border-main)',
                          color: isCurrent ? 'var(--accent-cyan)' : 'var(--text-muted)',
                          backgroundColor: isCurrent ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255,255,255,0.03)',
                        }}
                      >
                        {module.section}
                      </span>
                    </div>

                    {/* Current Indicator */}
                    {isCurrent && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-main px-6 py-3 bg-secondary/30 text-xs text-text-muted font-mono">
            <span>Ctrl+M para alternar • ESC para cerrar • Click en tarjeta para navegar</span>
          </div>
        </div>
      )}
    </>
  );
}

export default ModulesGrid;
