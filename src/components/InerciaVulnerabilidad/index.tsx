import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import NextChapter from '../NextChapter';
import LazyImage from '../LazyImage';

const H_DATA = [
  { year: '2010', hGlobal: 5.5, hSur: null },
  { year: '2013', hGlobal: 4.8, hSur: null },
  { year: '2016', hGlobal: 4.0, hSur: null },
  { year: '2019', hGlobal: 3.2, hSur: null },
  { year: '2022', hGlobal: 2.8, hSur: null },
  { year: '2024', hGlobal: 2.5, hSur: null },
  { year: '28-A', hGlobal: 2.3, hSur: 1.4 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.75rem 1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
      }}
    >
      <p style={{ margin: '0 0 0.375rem', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin: '0 0 0.125rem', color: p.color }}>
          {p.name === 'hGlobal' ? 'H global' : 'H zona sur'}: {p.value?.toFixed(1)} s
        </p>
      ))}
      {label === '28-A' && (
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.625rem', color: 'var(--alarm)' }}>
          ⚠ Zona sur: H = 1,4 s (ICAI/NREL) — por debajo umbral 2,0 s
        </p>
      )}
    </div>
  );
};

const TECNOLOGIAS = [
  { tipo: 'Nuclear', h: 5.5, color: 'var(--nominal)' },
  { tipo: 'CCGT (gas)', h: 3.5, color: 'var(--accent-blue)' },
  { tipo: 'Hidráulica', h: 3.0, color: 'var(--accent-blue)' },
  { tipo: 'Carbón', h: 4.0, color: 'var(--text-muted)' },
  { tipo: 'IBR Grid-Following', h: 0, color: 'var(--alarm)' },
  { tipo: 'IBR Grid-Forming', h: 2.5, color: 'var(--warning)' },
];

function InerciaVulnerabilidad() {
  const [sliderH, setSliderH] = useState(2.3);
  const deltaP = 1500; // MW
  const f0 = 50; // Hz
  const rocof = deltaP / (2 * sliderH * f0 * 25184 / 1000);

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="t-eyebrow" style={{ marginBottom: '0.5rem' }}>
          INERCIA SÍNCRONA · VULNERABILIDAD DEL SISTEMA 28-A
        </p>
        <h1 className="t-heading-main" style={{ margin: '0 0 0.75rem' }}>
          Inercia del Sistema y RoCoF
        </h1>
        <p className="t-body-main" style={{ maxWidth: '72ch' }}>
          La constante de inercia H mide la capacidad del sistema para resistir cambios bruscos
          de frecuencia. El 28-A, la inercia global era 2,3 s (REE) — en el límite del umbral
          ENTSO-E. En zonas sur, ICAI/NREL estimaron 1,3-1,8 s: por debajo del umbral.
        </p>
      </header>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'H global 28-A (REE)', value: '2,3 s', sub: 'Valor global peninsular', color: 'var(--warning)' },
          { label: 'H zona sur (ICAI/NREL)', value: '1,4 s', sub: 'Andalucía / Extremadura', color: 'var(--alarm)' },
          { label: 'Umbral ENTSO-E', value: '2,0 s', sub: 'Mínimo de seguridad', color: 'var(--nominal)' },
          { label: 'H sistema 2010', value: '5,5 s', sub: 'Alta generación síncrona', color: 'var(--accent-blue)' },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              padding: '1rem',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderTop: `3px solid ${card.color}`,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <p style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: card.color, lineHeight: 1 }}>
              {card.value}
            </p>
            <p style={{ margin: '0 0 0.125rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {card.label}
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--text-muted)' }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Context images */}
      <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Caída de frecuencia: 50 Hz → 47,5 Hz en 40 segundos
          </p>
          <LazyImage
            src="/images/blackout-content/graficos-ree/frecuencia-caida-40seg.png"
            alt="Caída de frecuencia durante el colapso 28-A"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          />
        </div>
        <div>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Evolución demanda vs. generación
          </p>
          <LazyImage
            src="/images/blackout-content/graficos-ree/consumo-demanda-antes-despues.png"
            alt="Consumo y demanda antes y después del apagón"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Constante de inercia H del sistema: 2,3 s (global) vs. 1,4 s (zona sur)
        </p>
        <LazyImage
          src="/images/blackout-content/graficos-ree/inercia-sistema-h-2-3.png"
          alt="Inercia del sistema H = 2,3 segundos"
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: '1rem',
          }}
        />
      </div>

      {/* Evolution chart */}
      <div className="surface" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <p style={{ margin: '0 0 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          EVOLUCIÓN DE LA CONSTANTE DE INERCIA H (segundos) — 2010 a 28-A-2025
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={H_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="gradGlobal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="gradSur" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--alarm)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--alarm)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
            <XAxis dataKey="year" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
            <YAxis
              domain={[0, 6]}
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-secondary)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(v: number) => `${v}s`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={2} stroke="var(--alarm)" strokeDasharray="6 3" label={{ value: 'Umbral 2,0s', fill: 'var(--alarm)', fontSize: 9, fontFamily: 'var(--font-mono)', position: 'insideTopLeft' }} />
            <ReferenceLine y={3} stroke="var(--warning)" strokeDasharray="4 4" label={{ value: 'Zona alerta', fill: 'var(--warning)', fontSize: 9, fontFamily: 'var(--font-mono)', position: 'insideTopLeft' }} />
            <Area type="monotone" dataKey="hGlobal" name="hGlobal" stroke="var(--accent-blue)" fill="url(#gradGlobal)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent-blue)', strokeWidth: 0 }} connectNulls />
            <Area type="monotone" dataKey="hSur" name="hSur" stroke="var(--alarm)" fill="url(#gradSur)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4, fill: 'var(--alarm)', strokeWidth: 0 }} connectNulls />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '20px', height: '2px', background: 'var(--accent-blue)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-secondary)' }}>H global (REE/Gobierno)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '20px', height: '2px', background: 'var(--alarm)', borderTop: '1px dashed var(--alarm)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-secondary)' }}>H zona sur (ICAI/NREL)</span>
          </div>
        </div>
      </div>

      {/* RoCoF calculator */}
      <div className="surface" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }}>
        <p style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          CALCULADORA RoCoF — RoCoF ≈ ΔP / (2H × S_base)
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 0.375rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
              Mueve H para ver cómo cambia el RoCoF:
            </p>
            <input
              type="range"
              min={0.5}
              max={6}
              step={0.1}
              value={sliderH}
              onChange={e => setSliderH(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
              aria-label="Constante de inercia H en segundos"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              <span>0,5 s (IBR)</span>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>H = {sliderH.toFixed(1)} s</span>
              <span>6 s (síncrono)</span>
            </div>
            <p style={{ margin: '0.5rem 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
              ΔP = {deltaP.toLocaleString('es-ES')} MW · f₀ = {f0} Hz · S_base ≈ 25.184 MW
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              TASA DE CAMBIO DE FRECUENCIA
            </p>
            <p style={{
              margin: '0 0 0.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '2.25rem',
              fontWeight: 700,
              lineHeight: 1,
              color: rocof > 1.5 ? 'var(--alarm)' : rocof > 0.8 ? 'var(--warning)' : 'var(--nominal)',
            }}>
              {rocof.toFixed(3)}
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Hz/s
            </p>
            <p style={{ margin: '0.5rem 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: rocof > 1 ? 'var(--alarm)' : 'var(--nominal)' }}>
              {rocof > 1.5 ? '⚠ PELIGROSO — activa protecciones' : rocof > 0.8 ? '⚡ ALERTA — zona de riesgo' : '✓ TOLERABLE'}
            </p>
          </div>
        </div>
      </div>

      {/* Technology inertia table */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: '0 0 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          CONSTANTE H POR TECNOLOGÍA DE GENERACIÓN
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {TECNOLOGIAS.map(t => (
            <div key={t.tipo} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-primary)', minWidth: '180px' }}>
                {t.tipo}
              </span>
              <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(t.h / 6) * 100}%`, height: '100%', background: t.color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: t.color, minWidth: '40px', textAlign: 'right', fontWeight: 700 }}>
                {t.h.toFixed(1)} s
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divergence note */}
      <div
        style={{
          padding: '0.875rem 1.25rem',
          background: 'rgba(255,136,0,0.05)',
          border: '1px solid rgba(255,136,0,0.25)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
        }}
      >
        <p style={{ margin: '0 0 0.375rem', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--warning)' }}>
          DIVERGENCIA INSTITUCIONAL — MISMO INDICADOR, DISTINTO ALCANCE
        </p>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--accent-blue)' }}>REE/Gobierno</strong> miden H = 2,3 s como valor global peninsular —
          dentro del umbral operativo de 2,0 s.{' '}
          <strong style={{ color: 'var(--warning)' }}>ICAI/NREL</strong> calculan H zonal: 1,3-1,8 s en la zona
          sur (Andalucía, Extremadura) — por debajo del umbral. La misma métrica con distinto alcance
          geográfico produce conclusiones radicalmente diferentes sobre la seguridad del sistema.
        </p>
      </div>

      <NextChapter
        path="/grid-following"
        label="IBR Grid-Following"
        desc="Por qué los inversores electrónicos no tienen inercia y cómo causaron el colapso"
      />
    </div>
  );
}

export default React.memo(InerciaVulnerabilidad);
