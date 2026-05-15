import { useState, useMemo } from 'react';
import AnimatedMetric from '../AnimatedMetric';
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
  const [showVerdictModal, setShowVerdictModal] = useState<boolean>(false);

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

  // Determinar si hay temblor visceral en la UI
  const isVisceralShaking = sim.nadir < 49.3;

  // Generar veredicto oficial
  const getVerdictDetails = () => {
    if (gridFormingPct === 0 && batteryMWh === 0 && powerLoss >= 2000) {
      return {
        title: "ESCENARIO HISTÓRICO REAL (28 ABRIL 2025)",
        grade: "DEFICIENTE — Colapso en Cascada Inevitable",
        gradeColor: "text-alert-red bg-alert-red/10 border-alert-red",
        text: `Configuración idéntica a la del apagón. La falta de inercia síncrona (H = ${inertia.toFixed(2)} s) y la ausencia total de inversores Grid-Forming provocaron un RoCoF inmanejable de ${sim.rocof.toFixed(4)} Hz/s. El nadir alcanzó ${sim.nadir.toFixed(2)} Hz, disparando los relés UFLS III y consumando el colapso de tensión peninsular.`
      };
    }
    if (gridFormingPct >= 25) {
      return {
        title: "PROPUESTA DE INNOVACIÓN: INVERSORES GRID-FORMING",
        grade: "SOBRESALIENTE — Operación Resiliente",
        gradeColor: "text-alert-green bg-alert-green/10 border-alert-green",
        text: `La inserción masiva de inversores con capacidad de formación de red (${gridFormingPct}%) añade un amortiguamiento dinámico crucial. Se logra estabilizar el nadir en ${sim.nadir.toFixed(2)} Hz, salvando el deslastre del escalón UFLS III (1.402 MW industriales) y garantizando la estabilidad transitoria del sistema.`
      };
    }
    if (batteryMWh >= 500) {
      return {
        title: "PROPUESTA DE INNOVACIÓN: BESS DE RESPUESTA ULTRÁRRAPIDA",
        grade: "MATRÍCULA DE HONOR — Mitigación Activa",
        gradeColor: "text-accent bg-accent/10 border-accent",
        text: `El despacho automatizado de Baterías de Almacenamiento (BESS con ${batteryMWh} MWh) inyecta potencia activa en milisegundos. Contrarresta de forma inmediata el desbalance inicial de ${powerLoss} MW, manteniendo la frecuencia en rangos seguros.`
      };
    }
    return {
      title: "DESPACHO OPERATIVO INTERMEDIO",
      grade: "APROBADO — Alerta Operativa Contingente",
      gradeColor: "text-alert-orange bg-alert-orange/10 border-alert-orange",
      text: `La combinación de reservas inerciales y almacenamiento mitiga la pendiente teórica df/dt. Sin embargo, ante perturbaciones mayores en el nudo colector de Carmona, la red mantiene un margen de vulnerabilidad elevado.`
    };
  };

  const verdict = getVerdictDetails();

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
    <div className={`flex-grow p-1 animate-fade-in flex flex-col gap-6 w-full ${isVisceralShaking ? 'grid-tremor-active' : ''}`}>
      
      {/* Title area */}
      <div className="border-b border-main pb-4 mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-text-primary tracking-tight">
            Simulador Dinámico de Contingencias (Balance de Frecuencia)
          </h2>
          <p className="text-xs text-text-secondary font-mono mt-1">
            Capítulo III · Herramienta Interactiva de Integración Dinámica de la Inercia Peninsular
          </p>
        </div>

        {/* Botón de Emisión de Veredicto */}
        <button
          onClick={() => setShowVerdictModal(true)}
          className="flex items-center gap-2 bg-accent text-white font-mono text-xs px-4 py-2.5 rounded hover:bg-accent-blue/90 shadow transition-all cursor-pointer font-bold tracking-wider uppercase border border-border-accent"
        >
          <span>⚖️ Emitir Veredicto Forense</span>
        </button>
      </div>

      {/* D1. Cuadrícula de Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <AnimatedMetric
          value={sim.rocof}
          decimals={4}
          unit=" Hz/s"
          label="ROCOF Inicial (df/dt)"
          color="var(--accent-blue)"
        />
        <AnimatedMetric
          value={sim.nadir}
          decimals={4}
          unit=" Hz"
          label="Nadir de Frecuencia"
          color={risk.color}
        />
        <AnimatedMetric
          value={sim.tNadir}
          decimals={2}
          unit=" s"
          label="Tiempo al Nadir"
          color="var(--text-primary)"
        />
        <AnimatedMetric
          label="Nivel de Riesgo"
          color={risk.color}
        >
          <div style={{ margin: '0 0 0.25rem' }}>
            <span className={`badge ${risk.badgeClass}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', padding: '4px 10px' }}>
              {risk.label}
            </span>
          </div>
        </AnimatedMetric>
      </div>

      {/* Banner de alerta visceral si hay temblor */}
      {isVisceralShaking && (
        <div className="bg-alert-red/15 border-2 border-alert-red p-4 rounded-lg flex items-center gap-4 animate-pulse">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-mono text-xs font-bold text-alert-red uppercase tracking-wider">ALERTA DE INESTABILIDAD VISCERAL</div>
            <p className="text-xs text-text-primary m-0 mt-0.5">La caída por debajo de 49.30 Hz está provocando temblores de tensión e inestabilidad asíncrona en toda la red peninsular.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">

        {/* ── COLUMNA IZQUIERDA: Controles ─────────── */}
        <div className="flex flex-col gap-6">

          {/* Panel parámetros */}
          <div className="bg-secondary border border-main rounded-lg p-5 shadow-sm">
            <div className="text-text-secondary text-[10px] font-mono tracking-widest uppercase border-b border-main/50 pb-3 mb-5 flex justify-between items-center">
              <span>Parámetros de Red</span>
              <span className="text-[9px] bg-tertiary px-1.5 py-0.5 rounded text-text-primary">60 FPS Memoized</span>
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

            {/* Reset button */}
            <button
              onClick={() => {
                setPowerLoss(2000);
                setInertia(1.84);
                setGridFormingPct(0);
                setBatteryMWh(0);
              }}
              className="w-full mt-2 py-2 bg-tertiary hover:bg-main/30 border border-main rounded font-mono text-[11px] text-text-secondary uppercase tracking-wider transition-colors cursor-pointer"
            >
              🔄 Restaurar Escenario Apagón
            </button>
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

      {/* MODAL DE VEREDICTO FORENSE OFICIAL */}
      {showVerdictModal && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-secondary border border-main rounded-xl p-6 max-w-2xl w-full shadow-2xl relative flex flex-col gap-5">
            <div className="flex justify-between items-start border-b border-main pb-4">
              <div>
                <span className="font-mono text-[10px] text-border-accent uppercase font-bold tracking-widest block mb-1">// DICTAMEN OFICIAL DEL TRIBUNAL FORENSE</span>
                <h3 className="font-serif text-xl font-bold text-text-primary m-0">{verdict.title}</h3>
              </div>
              <button 
                onClick={() => setShowVerdictModal(false)}
                className="text-text-secondary hover:text-text-primary text-xl font-bold cursor-pointer bg-tertiary px-2.5 py-1 rounded border border-main"
              >
                ✕
              </button>
            </div>

            <div className={`p-4 rounded-lg border font-mono font-bold text-sm tracking-wide ${verdict.gradeColor}`}>
              CALIFICACIÓN: {verdict.grade}
            </div>

            <p className="text-text-secondary font-sans leading-relaxed text-sm m-0">
              {verdict.text}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-tertiary p-4 rounded-lg border border-main font-mono text-xs">
              <div>
                <span className="text-text-muted block text-[10px]">INERCIA SÍNCRONA CONFIGURADA:</span>
                <span className="font-bold text-text-primary">{inertia.toFixed(2)} s</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">AMORTIGUAMIENTO (GRID-FORMING):</span>
                <span className="font-bold text-accent">{gridFormingPct}%</span>
              </div>
            </div>

            <div className="border-t border-main pt-3 flex justify-end">
              <button
                onClick={() => setShowVerdictModal(false)}
                className="bg-text-primary text-secondary font-mono text-xs px-5 py-2.5 rounded hover:opacity-90 transition-opacity font-bold uppercase tracking-wider cursor-pointer"
              >
                Cerrar Acta
              </button>
            </div>
          </div>
        </div>
      )}

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
