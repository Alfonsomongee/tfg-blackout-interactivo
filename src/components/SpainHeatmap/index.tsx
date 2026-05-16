import { useState } from 'react';
import NextChapter from '../NextChapter';

type Zone = 'zona-sur' | 'zona-centro' | 'norte' | 'levante';

interface Region {
  id: string;
  name: string;
  zone: Zone;
  timeDisconnect: string;
  capacity: number;
  description: string;
}

const ZONE_CONFIG: Record<Zone, { label: string; color: string; collapseT: string; inertia: string; desc: string }> = {
  'zona-sur': {
    label: 'Zona Sur',
    color: '#8B0000',
    collapseT: 'T+27,1 s',
    inertia: '1,30 s',
    desc: 'Primera zona en colapsar. Inercia síncrona residual insuficiente para sostenerse. Origen de la oscilación de tensión inicial en colectoras fotovoltaicas.',
  },
  'zona-centro': {
    label: 'Zona Centro',
    color: 'var(--alarm)',
    collapseT: 'T+30,4 s',
    inertia: '1,84 s',
    desc: 'Segunda zona en separarse. Intento fallido de continuar operando aislada. Mayor inercia residual que la Zona Sur retrasó el colapso 3,3 segundos.',
  },
  'norte': {
    label: 'Zona Norte',
    color: 'var(--warning)',
    collapseT: 'T+31,9 s',
    inertia: '—',
    desc: 'Afectada por la cascada propagada desde Centro. Mayor capacidad hidroeléctrica síncrona retrasó el colapso. Galicia actuó como último bastión de inercia.',
  },
  'levante': {
    label: 'Levante y Este',
    color: 'var(--accent-blue)',
    collapseT: 'T+32,7 s',
    inertia: '—',
    desc: 'Última zona en separarse. Fuerte generación renovable IBR sin inercia de soporte. Nuclear de Cataluña retrasó levemente el colapso local.',
  },
};

const REGIONS: Region[] = [
  {
    id: 'and',
    name: 'Andalucía',
    zone: 'zona-sur',
    timeDisconnect: '12:33:24',
    capacity: 4.1,
    description: '60% de la fotovoltaica peninsular. Origen de la oscilación de tensión inicial en subestaciones colectoras.',
  },
  {
    id: 'ext',
    name: 'Extremadura',
    zone: 'zona-sur',
    timeDisconnect: '12:33:24',
    capacity: 0.7,
    description: 'Zona colectora de fotovoltaica de gran escala sin inercia síncrona de respaldo.',
  },
  {
    id: 'mur',
    name: 'Murcia',
    zone: 'zona-sur',
    timeDisconnect: '12:33:24',
    capacity: 0.7,
    description: 'Alta densidad de parques solares. Colapsó simultáneamente con Andalucía.',
  },
  {
    id: 'mad',
    name: 'Madrid',
    zone: 'zona-centro',
    timeDisconnect: '12:33:27',
    capacity: 3.2,
    description: 'Mayor carga de demanda peninsular. Centro de control nacional REE. Separación a T+30,4 s.',
  },
  {
    id: 'cyl',
    name: 'Castilla y León',
    zone: 'zona-centro',
    timeDisconnect: '12:33:27',
    capacity: 2.4,
    description: 'Parque eólico peninsular principal. Inercia virtual insuficiente ante la caída de frecuencia.',
  },
  {
    id: 'clm',
    name: 'Castilla-La Mancha',
    zone: 'zona-centro',
    timeDisconnect: '12:33:27',
    capacity: 1.8,
    description: 'Alta penetración fotovoltaica. Subestaciones colectoras críticas en el nudo de red de 400 kV.',
  },
  {
    id: 'gal',
    name: 'Galicia',
    zone: 'norte',
    timeDisconnect: '12:33:28',
    capacity: 1.2,
    description: 'Importante generación hidráulica síncrona. Mayor inercia residual retrasó el colapso en la zona.',
  },
  {
    id: 'ast',
    name: 'Asturias',
    zone: 'norte',
    timeDisconnect: '12:33:28',
    capacity: 0.8,
    description: 'Ciclos combinados y residual térmico. Mayor inercia local que la media peninsular.',
  },
  {
    id: 'pv',
    name: 'País Vasco',
    zone: 'norte',
    timeDisconnect: '12:33:27',
    capacity: 0.9,
    description: 'Industria pesada y cogeneración. Alta densidad de carga industrial.',
  },
  {
    id: 'nav',
    name: 'Navarra',
    zone: 'norte',
    timeDisconnect: '12:33:28',
    capacity: 0.4,
    description: 'Pionero en eólica peninsular. Bajo nivel de inercia síncrona residual.',
  },
  {
    id: 'cat',
    name: 'Cataluña',
    zone: 'levante',
    timeDisconnect: '12:33:29',
    capacity: 2.1,
    description: 'Nuclear y ciclos combinados retrasaron el colapso local. Última gran zona en separarse.',
  },
  {
    id: 'val',
    name: 'Valencia',
    zone: 'levante',
    timeDisconnect: '12:33:29',
    capacity: 1.9,
    description: 'Levante mediterráneo. Alta generación solar de suelo sin inercia de soporte.',
  },
  {
    id: 'ara',
    name: 'Aragón',
    zone: 'levante',
    timeDisconnect: '12:33:28',
    capacity: 1.0,
    description: 'Parques eólicos pirenaicos. Separación por cascada de oscilación de tensión.',
  },
];

export default function SpainHeatmap() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const filteredRegions = selectedZone
    ? REGIONS.filter(r => r.zone === selectedZone)
    : REGIONS;

  const totalCapacity = filteredRegions.reduce((sum, r) => sum + r.capacity, 0);

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          MAPA DE IMPACTO · SISTEMA ELÉCTRICO PENINSULAR
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Distribución del Colapso por Zonas
        </h1>
        <p className="t-body-main" style={{ maxWidth: '70ch' }}>
          Distribución geográfica del apagón del 28 de abril por zonas del sistema eléctrico
          peninsular. El colapso se propagó de Sur a Norte en una ventana de 5,6 segundos.
        </p>
      </header>

      {/* Zone filter */}
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setSelectedZone(null)}
          style={{
            padding: '0.5rem 1rem',
            background: selectedZone === null ? 'var(--accent-blue)' : 'transparent',
            color: selectedZone === null ? 'white' : 'var(--text-secondary)',
            border: `1px solid ${selectedZone === null ? 'var(--accent-blue)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            transition: 'all 0.2s',
          }}
        >
          TODAS LAS ZONAS
        </button>
        {(Object.entries(ZONE_CONFIG) as [Zone, typeof ZONE_CONFIG[Zone]][]).map(
          ([zone, cfg]) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(selectedZone === zone ? null : zone)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedZone === zone ? cfg.color : 'transparent',
                color: selectedZone === zone ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${selectedZone === zone ? cfg.color : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                transition: 'all 0.2s',
              }}
            >
              {cfg.label}
            </button>
          )
        )}
      </div>

      {/* Zone detail panel */}
      {selectedZone && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: `${ZONE_CONFIG[selectedZone].color}12`,
            border: `1px solid ${ZONE_CONFIG[selectedZone].color}`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 0.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
              }}
            >
              COLAPSO
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 700,
                color: ZONE_CONFIG[selectedZone].color,
              }}
            >
              {ZONE_CONFIG[selectedZone].collapseT}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
              }}
            >
              INERCIA RESIDUAL
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 700,
                color: ZONE_CONFIG[selectedZone].color,
              }}
            >
              {ZONE_CONFIG[selectedZone].inertia}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
              }}
            >
              POTENCIA AFECTADA
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 700,
                color: ZONE_CONFIG[selectedZone].color,
              }}
            >
              {totalCapacity.toFixed(1)} GW
            </p>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
              {ZONE_CONFIG[selectedZone].desc}
            </p>
          </div>
        </div>
      )}

      {/* Region cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        {filteredRegions.map(region => {
          const cfg = ZONE_CONFIG[region.zone];
          const isHovered = hoveredRegion === region.id;
          return (
            <div
              key={region.id}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{
                padding: '1rem',
                background: isHovered ? `${cfg.color}12` : 'var(--bg-raised)',
                border: `1px solid ${isHovered ? cfg.color : 'var(--border)'}`,
                borderTop: `3px solid ${cfg.color}`,
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.2s',
                cursor: 'default',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {region.name}
                </p>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    color: cfg.color,
                    background: `${cfg.color}18`,
                    padding: '0.125rem 0.375rem',
                    borderRadius: 'var(--radius-sm)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cfg.label}
                </span>
              </div>
              <p
                style={{
                  margin: '0 0 0.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {region.timeDisconnect} CEST &nbsp;·&nbsp; {region.capacity.toFixed(1)} GW
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                }}
              >
                {region.description}
              </p>
            </div>
          );
        })}
      </div>

      <NextChapter
        path="/inercia-graph"
        label="Gráfico de Inercia"
        desc="Evolución de la constante H del sistema peninsular hasta el 28-A"
      />
    </div>
  );
}
