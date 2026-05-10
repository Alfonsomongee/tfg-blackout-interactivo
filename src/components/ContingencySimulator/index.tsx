import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

// ── Física ──────────────────────────────────────────
function calculateROCOF(
  powerImbalance: number,
  inertiaConstant: number,
  basePower = 25000
): number {
  if (inertiaConstant <= 0 || basePower <= 0) return 0;
  return powerImbalance / (2 * inertiaConstant * basePower);
}

function buildFrequencyTrajectory(
  powerImbalance: number,
  inertiaConstant: number,
  gridFormingPct: number,
  batteryMWh: number
): Array<{ t: number; f: number; zone: string }> {

  const STEPS   = 100;
  const T_MAX   = 10; // segundos
  const F0      = 50.0;
  const F_FLOOR = 47.0;

  // Grid-forming añade amortiguamiento y reduce ROCOF efectivo
  const gridFormingFactor  = 1 - gridFormingPct * 0.008;
  // Baterías BESS reducen el desbalance efectivo
  const batteryCorrection  = batteryMWh * 0.3; // MW equivalentes de respuesta rápida
  const effectiveImbalance = powerImbalance + batteryCorrection;
  const effectiveInertia   = inertiaConstant * (1 + gridFormingPct * 0.005);
  const damping            = 1.5 + gridFormingPct * 0.02;

  const rocof0 = calculateROCOF(effectiveImbalance, effectiveInertia);

  return Array.from({ length: STEPS + 1 }, (_, i) => {
    const t = (i / STEPS) * T_MAX;
    const raw =
      F0 +
      (rocof0 * gridFormingFactor / damping) *
        (1 - Math.exp(-damping * t)) -
      (rocof0 * gridFormingFactor * t) / damping;
    const f = Math.max(raw, F_FLOOR);
    const zone =
      f < 49.0 ? 'blackout'
      : f < 49.3 ? 'ufls3'
      : f < 49.5 ? 'ufls2'
      : f < 49.8 ? 'ufls1'
      : 'safe';
    return { t: parseFloat(t.toFixed(2)), f: parseFloat(f.toFixed(4)), zone };
  });
}

// ── Helpers UI ──────────────────────────────────────
const UFLS = [
  { hz: 49.5, mw: 2000, label: '49,5 Hz — UFLS 1 (2.000 MW bombeo)' },
  { hz: 49.3, mw: 588,  label: '49,3 Hz — UFLS 2 (588 MW bombeo)'   },
  { hz: 49.0, mw: 1402, label: '49,0 Hz — UFLS 3 (1.402 MW)'        },
];

function riskLevel(nadir: number): { label: string; color: string; bg: string } {
  if (nadir < 49.0) return { label: 'BLACKOUT',  color: '#ef4444', bg: '#450a0a' };
  if (nadir < 49.3) return { label: 'CRÍTICO',   color: '#f97316', bg: '#431407' };
  if (nadir < 49.5) return { label: 'ALTO',      color: '#eab308', bg: '#422006' };
  if (nadir < 49.8) return { label: 'MODERADO',  color: '#06b6d4', bg: '#083344' };
  return               { label: 'ESTABLE',    color: '#22c55e', bg: '#052e16' };
}

// ── Componente principal ────────────────────────────
export function ContingencySimulator() {
  const [powerLoss,      setPowerLoss]      = useState<number>(2000);  // positivo → déficit MW
  const [inertia,        setInertia]        = useState<number>(1.84);
  const [gridFormingPct, setGridFormingPct] = useState<number>(0);
  const [batteryMWh,     setBatteryMWh]     = useState<number>(0);

  // CRÍTICO: powerLoss, inertia, gridFormingPct, batteryMWh
  // deben estar TODOS en el array de dependencias
  const sim = useMemo(() => {
    const trajectory = buildFrequencyTrajectory(
      -powerLoss,   // negativo = déficit
      inertia,
      gridFormingPct,
      batteryMWh
    );
    const nadir    = Math.min(...trajectory.map(p => p.f));
    const tNadir   = trajectory.find(p => p.f === nadir)?.t ?? 0;
    const rocof    = calculateROCOF(-powerLoss, inertia);
    const uflsHit  = UFLS.filter(s => nadir <= s.hz);
    return { trajectory, nadir, tNadir, rocof, uflsHit };
  }, [powerLoss, inertia, gridFormingPct, batteryMWh]); // ← todas las deps

  const risk = riskLevel(sim.nadir);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{
        background: '#141e35', border: '1px solid #0ea5e9',
        padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12
      }}>
        <div style={{ color: '#94a3b8' }}>t = {d.t} s</div>
        <div style={{ color: '#67e8f9' }}>f = {d.f.toFixed(4)} Hz</div>
      </div>
    );
  };

  return (
    <div style={{
      background: '#0a0e1a', minHeight: '100vh',
      padding: '24px', fontFamily: 'Inter, sans-serif', color: '#e2e8f0'
    }}>
      <h2 style={{
        fontFamily: 'JetBrains Mono, monospace',
        color: '#67e8f9', fontSize: 18, marginBottom: 24, letterSpacing: '0.1em'
      }}>
        ⚡ SIMULADOR DE CONTINGENCIAS — SISTEMA IBÉRICO
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>

        {/* ── COLUMNA IZQUIERDA: Controles ─────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Panel parámetros */}
          <div style={{
            background: '#0f1729', border: '1px solid #1e3a5f',
            borderRadius: 6, padding: 20
          }}>
            <div style={{
              color: '#94a3b8', fontSize: 11, letterSpacing: '0.15em',
              marginBottom: 16, fontFamily: 'JetBrains Mono, monospace'
            }}>
              PARÁMETROS DEL SISTEMA
            </div>

            {/* Slider: Pérdida MW */}
            <SliderField
              label="Pérdida de generación"
              unit="MW"
              value={powerLoss}
              min={200} max={15000} step={100}
              onChange={setPowerLoss}
              displayValue={powerLoss.toLocaleString('es-ES')}
              color="#ef4444"
            />

            {/* Slider: Inercia */}
            <SliderField
              label="Inercia del sistema (H)"
              unit="s"
              value={inertia}
              min={0.5} max={5.0} step={0.1}
              onChange={setInertia}
              displayValue={inertia.toFixed(2)}
              color="#06b6d4"
              hint={`NW: 3,84 s  |  C: 1,84 s  |  S: 1,30 s`}
            />

            {/* Slider: Grid-Forming */}
            <SliderField
              label="Grid-Forming inverters"
              unit="%"
              value={gridFormingPct}
              min={0} max={80} step={1}
              onChange={setGridFormingPct}
              displayValue={`${gridFormingPct}%`}
              color="#22c55e"
              hint="0% = situación real 28/04/2025"
            />

            {/* Slider: BESS */}
            <SliderField
              label="Baterías BESS"
              unit="MWh"
              value={batteryMWh}
              min={0} max={2000} step={50}
              onChange={setBatteryMWh}
              displayValue={`${batteryMWh.toLocaleString('es-ES')}`}
              color="#a78bfa"
              hint="0 MWh = situación real 28/04/2025"
            />
          </div>

          {/* Panel métricas */}
          <div style={{
            background: '#0f1729', border: '1px solid #1e3a5f',
            borderRadius: 6, padding: 20
          }}>
            <div style={{
              color: '#94a3b8', fontSize: 11, letterSpacing: '0.15em',
              marginBottom: 16, fontFamily: 'JetBrains Mono, monospace'
            }}>
              MÉTRICAS CALCULADAS
            </div>

            <Metric
              label="ROCOF"
              value={`${sim.rocof.toFixed(4)} Hz/s`}
              alert={Math.abs(sim.rocof) > 0.0015}
            />
            <Metric
              label="Nadir frecuencia"
              value={`${sim.nadir.toFixed(4)} Hz`}
              color={risk.color}
            />
            <Metric
              label="Tiempo al nadir"
              value={`${sim.tNadir.toFixed(2)} s`}
            />
            <Metric
              label="Nivel de riesgo"
              value={risk.label}
              badge
              badgeBg={risk.bg}
              color={risk.color}
            />
          </div>

          {/* Panel UFLS */}
          <div style={{
            background: '#0f1729', border: '1px solid #1e3a5f',
            borderRadius: 6, padding: 20
          }}>
            <div style={{
              color: '#94a3b8', fontSize: 11, letterSpacing: '0.15em',
              marginBottom: 12, fontFamily: 'JetBrains Mono, monospace'
            }}>
              DESLASTRE UFLS
            </div>
            {UFLS.map(stage => {
              const active = sim.nadir <= stage.hz;
              return (
                <div key={stage.hz} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '6px 0',
                  borderBottom: '1px solid #141e35'
                }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 12, color: active ? '#ef4444' : '#475569'
                  }}>
                    {stage.hz} Hz → {stage.mw.toLocaleString('es-ES')} MW
                  </span>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 3,
                    background: active ? '#450a0a' : '#1e293b',
                    color: active ? '#ef4444' : '#475569',
                    fontFamily: 'JetBrains Mono, monospace',
                    animation: active ? 'blink-alert 1s infinite' : 'none'
                  }}>
                    {active ? '● ACTIVO' : '○ INACTIVO'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── COLUMNA DERECHA: Gráfico ──────────────── */}
        <div style={{
          background: '#0f1729', border: '1px solid #1e3a5f',
          borderRadius: 6, padding: 24
        }}>
          <div style={{
            color: '#94a3b8', fontSize: 11, letterSpacing: '0.15em',
            marginBottom: 16, fontFamily: 'JetBrains Mono, monospace'
          }}>
            TRAYECTORIA DE FRECUENCIA — df/dt = ΔP / (2·H·S<sub>base</sub>)
          </div>

          <ResponsiveContainer width="100%" height={420}>
            <ComposedChart
              data={sim.trajectory}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis
                dataKey="t"
                stroke="#475569"
                tick={{ fill: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
                label={{ value: 'Tiempo (s)', position: 'insideBottomRight', offset: -10, fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                domain={[47.0, 50.3]}
                stroke="#475569"
                tick={{ fill: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
                label={{ value: 'Frecuencia (Hz)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Área roja bajo 49,5 Hz */}
              <Area
                type="monotone"
                dataKey="f"
                fill="#ef4444"
                fillOpacity={0.06}
                stroke="none"
                baseValue={47.0}
              />

              {/* Línea referencia 50 Hz */}
              <ReferenceLine y={50.0} stroke="#334155" strokeDasharray="6 3" label={{ value: '50,0 Hz', fill: '#475569', fontSize: 10 }} />
              {/* UFLS lines */}
              <ReferenceLine y={49.5} stroke="#f97316" strokeDasharray="4 4" label={{ value: '49,5 Hz UFLS', fill: '#f97316', fontSize: 10 }} />
              <ReferenceLine y={49.3} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '49,3 Hz', fill: '#ef4444', fontSize: 10 }} />
              <ReferenceLine y={49.0} stroke="#991b1b" strokeDasharray="4 4" label={{ value: '49,0 Hz', fill: '#991b1b', fontSize: 10 }} />

              {/* Curva principal */}
              <Line
                type="monotone"
                dataKey="f"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Alerta visual */}
          {sim.nadir < 49.5 && (
            <div style={{
              marginTop: 12, padding: '8px 16px',
              background: risk.bg, border: `1px solid ${risk.color}`,
              borderRadius: 4, fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12, color: risk.color,
              animation: 'blink-alert 1s infinite'
            }}>
              ⚠ UFLS ACTIVADO — Nadir: {sim.nadir.toFixed(3)} Hz
              {sim.uflsHit.map(s => ` | ${s.hz} Hz → ${s.mw.toLocaleString('es-ES')} MW`).join('')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-componentes ──────────────────────────────────
interface SliderFieldProps {
  label: string; unit: string; value: number;
  min: number; max: number; step: number;
  onChange: (v: number) => void;
  displayValue: string; color: string; hint?: string;
}

function SliderField({ label, unit, value, min, max, step, onChange, displayValue, color, hint }: SliderFieldProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#94a3b8', fontSize: 12 }}>{label}</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 14, color, fontWeight: 700
        }}>
          {displayValue} <span style={{ color: '#475569', fontSize: 11 }}>{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: color, cursor: 'pointer' }}
      />
      {hint && (
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10, color: '#475569', marginTop: 4
        }}>
          {hint}
        </div>
      )}
    </div>
  );
}

interface MetricProps {
  label: string; value: string;
  alert?: boolean; color?: string;
  badge?: boolean; badgeBg?: string;
}

function Metric({ label, value, alert, color, badge, badgeBg }: MetricProps) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0', borderBottom: '1px solid #141e35'
    }}>
      <span style={{ color: '#94a3b8', fontSize: 12 }}>{label}</span>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
        color: alert ? '#ef4444' : (color ?? '#67e8f9'),
        background: badge ? badgeBg : 'transparent',
        padding: badge ? '2px 8px' : '0',
        borderRadius: badge ? 3 : 0,
        animation: alert ? 'blink-alert 1s infinite' : 'none',
        fontWeight: 700
      }}>
        {value}
      </span>
    </div>
  );
}

export default ContingencySimulator;
