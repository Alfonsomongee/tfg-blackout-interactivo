import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const pathname = location.pathname;
    if (pathname === '/') return [];

    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: 'TFG Blackout', path: '/' }];

    segments.forEach((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      items.push({ label, path });
    });

    return items;
  }, [location.pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      className="px-6 py-3 border-b border-main bg-primary/50 font-mono text-[11px] text-text-muted"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.path} className="flex items-center gap-2">
            {index > 0 && <span className="text-text-muted/50">/</span>}
            <a
              href={item.path}
              className={`transition-colors ${
                index === breadcrumbs.length - 1
                  ? 'text-text-primary font-semibold'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
