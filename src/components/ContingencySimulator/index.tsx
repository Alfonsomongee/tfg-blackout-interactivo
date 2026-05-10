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
  { hz: 49.5, mw: 2000, label: '49,5 Hz — UFLS I (2.000 MW bombeo)' },
  { hz: 49.3, mw: 588,  label: '49,3 Hz — UFLS II (588 MW bombeo)'   },
  { hz: 49.0, mw: 1402, label: '49,0 Hz — UFLS III (1.402 MW)'        },
];

function riskLevel(nadir: number): { label: string; color: string; badgeClass: string } {
  if (nadir < 49.0) return { label: '[COLAPSO TOTAL]',  color: 'var(--alarm)', badgeClass: 'badge-alarm' };
  if (nadir < 49.3) return { label: '[ALARMA CRÍTICA]', color: 'var(--alarm)', badgeClass: 'badge-alarm' };
  if (nadir < 49.5) return { label: '[NIVEL ALTO]',      color: 'var(--warning)', badgeClass: 'badge-warning' };
  if (nadir < 49.8) return { label: '[NIVEL MODERADO]',  color: 'var(--info)', badgeClass: 'badge-info' };
  return               { label: '[NOMINAL]',    color: 'var(--nominal)', badgeClass: 'badge-nominal' };
}

function getUFLSLabelInfo(f: number): { label: string; color: string } {
  if (f < 49.0) return { label: '[COLAPSO]', color: 'var(--alarm)' };
  if (f < 49.3) return { label: '[UFLS 3]', color: 'var(--alarm)' };
  if (f < 49.5) return { label: '[UFLS 2]', color: 'var(--warning)' };
  if (f < 49.8) return { label: '[UFLS 1]', color: 'var(--info)' };
  return { label: '[NOMINAL]', color: 'var(--nominal)' };
}

// ── Componente principal ────────────────────────────
export function ContingencySimulator() {
  const [powerLoss,      setPowerLoss]      = useState<number>(2000);  // positivo → déficit MW
  const [inertia,        setInertia]        = useState<number>(1.84);
  const [gridFormingPct, setGridFormingPct] = useState<number>(0);
  const [batteryMWh,     setBatteryMWh]     = useState<number>(0);

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
  }, [powerLoss, inertia, gridFormingPct, batteryMWh]);

  const risk = riskLevel(sim.nadir);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const uflsInfo = getUFLSLabelInfo(d.f);
    return (
      <div className="bg-secondary border border-main p-3 font-mono text-[11px] shadow-md rounded">
        <div className="text-text-secondary">Instante t = {d.t} s</div>
        <div className="text-accent font-bold">
          Frecuencia f = {d.f.toFixed(4)} Hz <span className="text-[10px] px-1.5 py-0.5 rounded ml-1.5 border font-bold" style={{ color: uflsInfo.color, borderColor: uflsInfo.color, background: `${uflsInfo.color}10` }}>{uflsInfo.label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-grow p-1 animate-fade-in flex flex-col gap-6 w-full">
      
      {/* Title area */}
      <div className="border-b border-main pb-4 mb-2">
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
          Simulador Dinámico de Contingencias (Balance de Frecuencia)
        </h2>
        <p className="text-xs text-text-secondary font-mono mt-1">
          Capítulo III · Herramienta Interactiva de Integración Dinámica de la Inercia Peninsular
        </p>
      </div>

      {/* D1. Cuadrícula de Métricas principales */}
      <div className="metric-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="metric-card flex flex-col justify-between">
          <span className="label font-mono text-[10px] uppercase tracking-wider text-text-secondary">ROCOF Inicial (df/dt)</span>
          <span className="value font-mono text-xl font-bold mt-2" style={{ fontFamily: 'var(--font-mono)' }}>
            {sim.rocof.toFixed(4)} <span className="text-xs text-text-secondary">Hz/s</span>
          </span>
        </div>
        
        <div className="metric-card flex flex-col justify-between">
          <span className="label font-mono text-[10px] uppercase tracking-wider text-text-secondary">Nadir de Frecuencia</span>
          <span className="value font-mono text-xl font-bold mt-2" style={{ color: risk.color, fontFamily: 'var(--font-mono)' }}>
            {sim.nadir.toFixed(4)} <span className="text-xs text-text-secondary">Hz</span>
          </span>
        </div>

        <div className="metric-card flex flex-col justify-between">
          <span className="label font-mono text-[10px] uppercase tracking-wider text-text-secondary">Tiempo al Nadir</span>
          <span className="value font-mono text-xl font-bold mt-2" style={{ fontFamily: 'var(--font-mono)' }}>
            {sim.tNadir.toFixed(2)} <span className="text-xs text-text-secondary">s</span>
          </span>
        </div>

        <div className="metric-card flex flex-col justify-between">
          <span className="label font-mono text-[10px] uppercase tracking-wider text-text-secondary">Nivel de Riesgo</span>
          <div className="mt-2">
            <span className={`badge ${risk.badgeClass}`} style={{ fontFamily: 'var(--font-mono)' }}>
              {risk.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">

        {/* ── COLUMNA IZQUIERDA: Controles ─────────── */}
        <div className="flex flex-col gap-6">

          {/* Panel parámetros */}
          <div className="bg-secondary border border-main rounded-lg p-5 shadow-sm">
            <div className="text-text-secondary text-[10px] font-mono tracking-widest uppercase border-b border-main/50 pb-3 mb-5">
              Parámetros de Entrada de Red
            </div>

            {/* Slider: Pérdida MW */}
            <SliderField
              label="Pérdida de generación"
              unit="MW"
              value={powerLoss}
              min={200} max={15000} step={100}
              onChange={setPowerLoss}
              displayValue={powerLoss.toLocaleString('es-ES')}
              color="var(--alert-red)"
            />

            {/* Slider: Inercia */}
            <SliderField
              label="Inercia del sistema (H)"
              unit="s"
              value={inertia}
              min={0.5} max={5.0} step={0.1}
              onChange={setInertia}
              displayValue={inertia.toFixed(2)}
              color="var(--accent-cyan)"
              hint={`Norm: 3,84s | Cb: 1,84s | Sur: 1,30s`}
            />

            {/* Slider: Grid-Forming */}
            <SliderField
              label="Inversores Grid-Forming"
              unit="%"
              value={gridFormingPct}
              min={0} max={80} step={1}
              onChange={setGridFormingPct}
              displayValue={`${gridFormingPct}%`}
              color="var(--alert-green)"
              hint="0% = Escenario histórico 28/04"
            />

            {/* Slider: BESS */}
            <SliderField
              label="Baterías de Respuesta Rápida"
              unit="MWh"
              value={batteryMWh}
              min={0} max={2000} step={50}
              onChange={setBatteryMWh}
              displayValue={`${batteryMWh.toLocaleString('es-ES')}`}
              color="var(--border-accent)"
              hint="Reserva de energía de almacenamiento"
            />
          </div>

          {/* Panel UFLS */}
          <div className="bg-secondary border border-main rounded-lg p-5 shadow-sm">
            <div className="text-text-secondary text-[10px] font-mono tracking-widest uppercase border-b border-main/50 pb-3 mb-4">
              Escalones de Deslastre (UFLS)
            </div>
            {UFLS.map(stage => {
              const active = sim.nadir <= stage.hz;
              return (
                <div key={stage.hz} className="flex justify-between items-center py-2.5 border-b border-main/30 last:border-0">
                  <span className={`font-mono text-xs ${active ? 'text-alert-red font-bold' : 'text-text-secondary'}`} style={{ fontFamily: 'var(--font-mono)' }}>
                    {stage.hz} Hz → {stage.mw.toLocaleString('es-ES')} MW
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded tracking-wider border ${
                    active 
                      ? 'bg-alert-red/15 border-alert-red text-alert-red font-bold' 
                      : 'bg-tertiary border-main text-text-secondary'
                  }`} style={{ fontFamily: 'var(--font-mono)' }}>
                    {active ? 'DISPARADO' : 'SOPORTADO'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── COLUMNA DERECHA: Gráfico ──────────────── */}
        <div className="bg-secondary border border-main rounded-lg p-6 shadow-sm flex flex-col justify-between">
          
          <div>
            <div className="text-text-secondary text-[10px] font-mono tracking-widest uppercase mb-4">
              Ecuación Teórica del Oscilador Síncrono (Swing Equation)
            </div>

            {/* LaTeX Equation rendered elegantly in HTML */}
            <div className="latex-equation flex justify-center items-center gap-1.5 py-4 my-6 bg-tertiary border-l-4 border-accent rounded-r font-serif text-lg relative select-text">
              <span className="italic">df</span>
              <span className="mx-0.5">/</span>
              <span className="italic">dt</span>
              <span className="mx-2">=</span>
              <div className="flex flex-col items-center justify-center text-xs mx-1">
                <span className="border-b border-text-primary pb-0.5 px-2 italic">&Delta;P</span>
                <span className="pt-0.5 px-2 font-mono">2 &middot; H &middot; S<sub>base</sub></span>
              </div>
              <span className="mx-1">&middot;</span>
              <span className="italic">f<sub>0</sub></span>
              <span className="absolute right-6 font-mono text-xs text-text-secondary italic" style={{ fontFamily: 'var(--font-mono)' }}>(Ecuación 3.1)</span>
            </div>
          </div>

          {/* Gráfico Recharts */}
          <div className="my-6">
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart
                data={sim.trajectory}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" strokeOpacity={0.5} />
                <XAxis
                  dataKey="t"
                  stroke="var(--border)"
                  tick={{ fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}
                  label={{ value: 'Tiempo transcurrido (s)', position: 'insideBottomRight', offset: -5, fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                />
                <YAxis
                  domain={[47.0, 50.3]}
                  stroke="var(--border)"
                  tick={{ fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}
                  label={{ value: 'Frecuencia de Red (Hz)', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Área roja bajo 49,5 Hz */}
                <Area
                  type="monotone"
                  dataKey="f"
                  fill="var(--alarm)"
                  fillOpacity={0.04}
                  stroke="none"
                  baseValue={47.0}
                />

                {/* Líneas de referencia técnica */}
                <ReferenceLine y={50.0} stroke="var(--border)" strokeDasharray="4 4" label={{ value: '50,0 Hz — nominal', fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                <ReferenceLine y={49.5} stroke="var(--warning)" strokeDasharray="3 3" label={{ value: '49,50 Hz (UFLS I)', fill: 'var(--warning)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                <ReferenceLine y={49.3} stroke="var(--alarm)" strokeDasharray="3 3" label={{ value: '49,30 Hz (UFLS II)', fill: 'var(--alarm)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                <ReferenceLine y={49.0} stroke="var(--alarm)" strokeWidth={1} strokeDasharray="3 3" label={{ value: '49,00 Hz (UFLS III - Disparo)', fill: 'var(--alarm)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />

                {/* Línea de referencia vertical en el nadir */}
                <ReferenceLine x={sim.tNadir} stroke="var(--alarm)" strokeWidth={1} strokeDasharray="4 4" label={{ value: `Nadir: ${sim.nadir.toFixed(4)} Hz`, fill: 'var(--alarm)', fontSize: 10, fontFamily: 'var(--font-mono)', position: 'top' }} />

                {/* Curva principal */}
                <Line
                  type="monotone"
                  dataKey="f"
                  stroke="var(--info)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Pie de figura formal */}
          <div className="border-t border-main/50 pt-4 text-xs text-text-secondary font-serif italic text-center select-text">
            Figura 7.1: Evolución dinámica de la frecuencia del sistema peninsular ante la contingencia parametrizada (Pérdida de Generación y Amortiguamiento).
          </div>
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
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-text-secondary text-xs">{label}</span>
        <span className="font-mono text-sm font-bold" style={{ color, fontFamily: 'var(--font-mono)' }}>
          {displayValue} <span className="text-text-secondary/70 text-[10px] font-normal" style={{ fontFamily: 'var(--font-mono)' }}>{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer h-1 rounded-lg bg-tertiary accent-current"
        style={{ color }}
      />
      {hint && (
        <div className="font-mono text-[9px] text-text-secondary/60 mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export default ContingencySimulator;
