import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  type: string;
  icon: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, navItems }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    if (!query.trim()) return navItems;
    const q = query.toLowerCase();
    return navItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q) ||
        item.icon.includes(q)
    );
  }, [query, navItems]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="bg-primary border border-main rounded-lg shadow-2xl w-full max-w-2xl max-h-96 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="border-b border-main p-4">
          <input
            autoFocus
            type="text"
            placeholder="Type to search modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
            className="w-full bg-transparent text-text-primary font-mono text-sm outline-none placeholder-text-muted"
          />
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-grow">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-text-muted text-sm font-mono">
              No modules found. Try a different search.
            </div>
          ) : (
            <div className="divide-y divide-main">
              {filteredItems.map((item) => (
                <button
                  key={item.to}
                  onClick={() => handleSelect(item.to)}
                  className="w-full px-6 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 group"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-grow">
                    <div className="text-text-primary font-mono text-sm font-medium">{item.label}</div>
                    <div className="text-text-muted text-xs font-mono">{item.to}</div>
                  </div>
                  <div className="text-text-muted text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.type === 'core' ? 'CORE' : 'DETAIL'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t border-main px-4 py-2 text-[11px] text-text-muted font-mono flex gap-4 bg-secondary/30">
          <span>↑↓ Navigate</span>
          <span>Enter to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
