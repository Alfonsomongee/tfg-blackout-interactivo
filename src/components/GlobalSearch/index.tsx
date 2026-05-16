import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchItem {
  type: 'term' | 'chapter' | 'event' | 'reform' | 'interactive';
  label: string;
  subtitle: string;
  path: string;
  id?: string;
}

const SEARCH_INDEX: SearchItem[] = [
  // Lexicon terms (16)
  { type: 'term', label: 'RoCoF', subtitle: 'Rate of Change of Frequency', path: '/lexicon', id: 'rocof' },
  { type: 'term', label: 'Constante H', subtitle: 'Inertia Constant — H = E_k / S_nominal', path: '/lexicon', id: 'inertia' },
  { type: 'term', label: 'Tap-Lag', subtitle: 'Retraso mecánico de los OLTC — punto ciego en 220 kV', path: '/lexicon', id: 'taplag' },
  { type: 'term', label: 'Grid-Following', subtitle: 'Inversor dependiente de PLL externo', path: '/lexicon', id: 'gridfollowing' },
  { type: 'term', label: 'Grid-Forming', subtitle: 'Inversor como fuente de tensión ideal', path: '/lexicon', id: 'gridforming' },
  { type: 'term', label: 'Curvas Q-V', subtitle: 'Estabilidad de tensión — margen hasta colapso', path: '/lexicon', id: 'qv' },
  { type: 'term', label: 'Efecto Ferranti', subtitle: 'Sobretensión en líneas en vacío', path: '/lexicon', id: 'ferranti' },
  { type: 'term', label: 'UFLS', subtitle: 'Under-Frequency Load Shedding — paradoja del 28-A', path: '/lexicon', id: 'ufls' },
  { type: 'term', label: 'HVDC INELFE-1', subtitle: 'Enlace corriente continua España-Francia', path: '/lexicon', id: 'hvdc' },
  { type: 'term', label: 'IBR', subtitle: 'Inverter-Based Resources — 82% penetración el 28-A', path: '/lexicon', id: 'ibr' },
  { type: 'term', label: 'PLL', subtitle: 'Phase-Locked Loop — inestable en red débil', path: '/lexicon', id: 'pll' },
  { type: 'term', label: 'P.O. 7.4', subtitle: 'Procedimiento de Operación — normativa obsoleta', path: '/lexicon', id: 'po74' },
  { type: 'term', label: 'NC RfG 2.0', subtitle: 'Network Code — Grid-Forming obligatorio ≥1 MW', path: '/lexicon', id: 'nrfg' },
  { type: 'term', label: 'Potencia de cortocircuito', subtitle: 'Fortaleza eléctrica de un nudo de la red', path: '/lexicon', id: 'ssc' },
  { type: 'term', label: 'Black Start', subtitle: 'Arranque autónomo sin tensión externa', path: '/lexicon', id: 'blackstart' },
  { type: 'term', label: 'Protecciones OST', subtitle: 'Out-of-Step — actuaron 12:33:21 CEST', path: '/lexicon', id: 'ost' },
  
  // Chapters (9)
  { type: 'chapter', label: 'Cap. 1 — Introducción', subtitle: 'Objeto, metodología forense y triangulación de fuentes', path: '/dossier' },
  { type: 'chapter', label: 'Cap. 2 — Contexto Eléctrico', subtitle: 'Transición energética y condiciones previas al 28-A', path: '/dossier' },
  { type: 'chapter', label: 'Cap. 3 — Cronología del Colapso', subtitle: 'Fases 0-4: de la oscilación al cero de tensión', path: '/timeline' },
  { type: 'chapter', label: 'Cap. 5 — Análisis Comparativo', subtitle: 'Cuatro narrativas: 7 consensos, 5 fracturas irreconciliables', path: '/compare' },
  { type: 'chapter', label: 'Cap. 7 — Resiliencia y Futuro', subtitle: 'BESS-GFM, compensadores síncronos, NC RfG 2.0', path: '/reforms' },
  { type: 'chapter', label: 'Cap. 9 — Conclusiones', subtitle: 'Tres fracturas de gobernanza: operativa, regulatoria, sistémica', path: '/dossier' },
  
  // Events for comparator
  { type: 'event', label: 'Mallado 12:03-12:25', subtitle: '¿Detonante del colapso? — ver comparador de narrativas', path: '/compare' },
  { type: 'event', label: 'HVDC PMODE3→PMODE1 (12:11)', subtitle: 'Cambio de modo — exportación fija 1.000 MW', path: '/compare' },
  { type: 'event', label: 'Disparo raíz Granada (12:32:57)', subtitle: 'Inadecuado (REE) vs. correcto (ICAI) — ver comparador', path: '/compare' },
  { type: 'event', label: 'Paradoja UFLS', subtitle: 'Mecanismo de defensa que agravó el colapso', path: '/compare' },
  
  // Reforms
  { type: 'reform', label: 'Actualización P.O. 7.4', subtitle: 'EN TRAMITACIÓN — reforma más urgente', path: '/reforms' },
  { type: 'reform', label: 'NC RfG 2.0 Grid-Forming', subtitle: 'PROPUESTO — Grid-Forming ≥1 MW obligatorio', path: '/reforms' },
  { type: 'reform', label: 'Derogación RD 413/2014', subtitle: 'IMPLEMENTADO — jun. 2025', path: '/reforms' },

  // Interactive modules
  { type: 'interactive', label: 'Quiz: ¿Quién dijo esto?', subtitle: '5 preguntas — identifica la institución de cada declaración', path: '/quiz-tribunal' },
  { type: 'interactive', label: 'Datos del Colapso', subtitle: '12 métricas clave animadas del apagón del 28-A', path: '/data-cards' },
  { type: 'interactive', label: 'Los 33 Segundos', subtitle: 'Control deslizante 0–33 s del colapso', path: '/timeline-moment' },
  { type: 'interactive', label: 'Mapa de Impacto', subtitle: 'Distribución geográfica por zonas peninsulares', path: '/heat-map' },
  { type: 'interactive', label: 'Gráfico de Inercia', subtitle: 'Evolución H del sistema — umbral ENTSO-E 5 s', path: '/inercia-graph' },
  { type: 'interactive', label: 'Comparador Institucional', subtitle: 'Arrastra para ordenar por responsabilidad', path: '/comparador-arrastra' },
];

interface GlobalSearchProps {
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>(SEARCH_INDEX);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter results
  useEffect(() => {
    if (!query.trim()) {
      setResults(SEARCH_INDEX);
    } else {
      const q = query.toLowerCase();
      const filtered = SEARCH_INDEX.filter(
        item =>
          item.label.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      );
      setResults(filtered);
    }
    setSelectedIndex(0);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    if (item.id) {
      setTimeout(() => {
        const el = document.getElementById(item.id!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('highlight-flash');
          setTimeout(() => el.classList.remove('highlight-flash'), 2000);
        }
      }, 150);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const getBadgeClass = (type: SearchItem['type']) => {
    switch (type) {
      case 'term':
        return 'bg-accent/10 text-accent border border-accent/20';
      case 'chapter':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'event':
        return 'bg-alert-orange/10 text-alert-orange border border-alert-orange/20';
      case 'reform':
        return 'bg-alert-green/10 text-alert-green border border-alert-green/20';
      case 'interactive':
        return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
    }
  };

  const getBadgeLabel = (type: SearchItem['type']) => {
    switch (type) {
      case 'term': return 'TÉRMINO';
      case 'chapter': return 'CAPÍTULO';
      case 'event': return 'EVENTO';
      case 'reform': return 'REFORMA';
      case 'interactive': return 'INTERACTIVO';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex justify-center pt-[10vh] px-4">
      <div
        ref={containerRef}
        className="w-full max-w-xl bg-secondary border border-main rounded-xl shadow-2xl h-fit max-h-[70vh] flex flex-col overflow-hidden animate-fade-in"
        onKeyDown={handleKeyDown}
      >
        {/* Search header bar */}
        <div className="flex items-center px-4 border-b border-main gap-3 h-14 bg-tertiary">
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-transparent border-none text-text-primary placeholder:text-text-secondary/60 text-sm focus:outline-none focus:ring-0 font-sans"
            placeholder="Buscar término, capítulo, evento, reforma..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="text-[10px] font-mono text-text-secondary bg-primary border border-main px-2 py-1 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-grow overflow-y-auto max-h-[50vh] p-2 divide-y divide-main/40">
          {results.length > 0 ? (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.label + item.id}
                  onClick={() => handleSelect(item)}
                  className={`flex items-center justify-between p-3.5 rounded-lg cursor-pointer transition-all duration-100 ${
                    isSelected ? 'bg-tertiary border-l-4 border-l-accent pl-2.5' : 'bg-transparent border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="font-serif text-xs font-bold text-text-primary leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-text-secondary leading-normal">
                      {item.subtitle}
                    </span>
                  </div>
                  
                  <span className={`text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded ${getBadgeClass(item.type)}`}>
                    {getBadgeLabel(item.type)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs text-text-secondary font-mono">
              Ningún resultado coincide con "{query}"
            </div>
          )}
        </div>

        {/* Search footer help bar */}
        <div className="border-t border-main px-4 py-2.5 bg-tertiary flex items-center justify-between text-[10px] text-text-secondary/60 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ para navegar</span>
            <span>↵ para seleccionar</span>
          </div>
          <span>Búsqueda Académica Unificada</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
