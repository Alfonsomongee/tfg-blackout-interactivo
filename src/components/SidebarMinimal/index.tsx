import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../../config/categoriesConfig';

interface SidebarMinimalProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarMinimal({ collapsed, onToggle }: SidebarMinimalProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getDefaultOpen = (): Record<string, boolean> => {
    try {
      const stored = localStorage.getItem('sidebar-open-cats');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    // Por defecto abre la categoría del path actual
    const openMap: Record<string, boolean> = {};
    CATEGORIES.forEach(cat => {
      const isActive = cat.items.some(i => i.path === location.pathname);
      openMap[cat.id] = isActive;
    });
    return openMap;
  };

  const [openCats, setOpenCats] = useState<Record<string, boolean>>(getDefaultOpen);

  useEffect(() => {
    localStorage.setItem('sidebar-open-cats', JSON.stringify(openCats));
  }, [openCats]);

  // Expand category of current path automatically
  useEffect(() => {
    CATEGORIES.forEach(cat => {
      if (cat.items.some(i => i.path === location.pathname)) {
        setOpenCats(prev => ({ ...prev, [cat.id]: true }));
      }
    });
  }, [location.pathname]);

  const toggleCat = (id: string) => {
    if (collapsed) {
      // Expand sidebar when clicking a category while collapsed
      onToggle();
      setOpenCats(prev => ({ ...prev, [id]: true }));
      return;
    }
    setOpenCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <aside
      style={{
        width: collapsed ? '56px' : '268px',
        minHeight: '100vh',
        background: '#080808',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        transition: 'width 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        zIndex: 30,
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '14px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          justifyContent: collapsed ? 'center' : 'space-between',
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              TFG 2026
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#22d3ee', fontWeight: 600, letterSpacing: '0.05em' }}>
              APAGÓN 28-A
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '6px',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            padding: '5px 7px',
            fontSize: '14px',
            lineHeight: 1,
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
        {CATEGORIES.map(cat => {
          const isOpen = openCats[cat.id];
          const hasActive = cat.items.some(i => i.path === location.pathname);

          return (
            <div key={cat.id}>
              {/* Category Header */}
              <button
                onClick={() => toggleCat(cat.id)}
                title={cat.label}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: collapsed ? '9px 0' : '8px 12px',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  color: hasActive ? cat.color : 'rgba(255,255,255,0.55)',
                  transition: 'color 0.15s ease, background 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <span style={{ fontSize: '14px', flexShrink: 0 }}>{cat.icon}</span>
                  {!collapsed && (
                    <span style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}>
                      {cat.label}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <span style={{
                    fontSize: '10px',
                    opacity: 0.5,
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0,
                  }}>
                    ›
                  </span>
                )}
              </button>

              {/* Items */}
              {!collapsed && isOpen && (
                <div style={{ borderLeft: `2px solid ${cat.color}22`, marginLeft: '22px' }}>
                  {cat.items.map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.path)}
                        style={{
                          width: '100%',
                          background: isActive ? `${cat.color}10` : 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 10px 6px 12px',
                          borderLeft: isActive ? `2px solid ${cat.color}` : '2px solid transparent',
                          marginLeft: '-2px',
                          color: isActive ? cat.color : 'rgba(255,255,255,0.45)',
                          textAlign: 'left',
                          transition: 'all 0.12s ease',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                            (e.currentTarget as HTMLElement).style.background = 'none';
                          }
                        }}
                      >
                        <span style={{ fontSize: '12px', flexShrink: 0 }}>{item.icon}</span>
                        <span style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: isActive ? 600 : 400,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer count */}
      {!collapsed && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 12px',
          fontSize: '9px',
          fontFamily: 'var(--font-mono)',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.1em',
          flexShrink: 0,
        }}>
          {CATEGORIES.reduce((acc, c) => acc + c.items.length, 0)} MÓDULOS · ETSI SEVILLA 2026
        </div>
      )}
    </aside>
  );
}

export default SidebarMinimal;
