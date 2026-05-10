// Valores calibrados con datos REE / ICAI / ENTSO-E
// Potencia base sistema ibérico: ~25.000 MW demanda neta + exportaciones a las 12:30

// UFLS thresholds según REE (informe junio 2025)
export const UFLS_STAGES = [
  { threshold_hz: 49.5, shed_mw: 2000, description: "Bombeo escalón 1" },
  { threshold_hz: 49.3, shed_mw: 588,  description: "Bombeo escalón 2" },
  { threshold_hz: 49.0, shed_mw: 1402, description: "Industrial + distribución" }
] as const;

// Parámetros HVDC España-Francia (INELFE)
export const HVDC_PARAMS = {
  mode_at_collapse: "PMODE1_fixed_power",
  setpoint_mw: 1000,
  max_import_reached_mw: 3807,
  ac_interconnection_total_mw: 4609,
  mode_change_timestamp_cest: "12:11"
} as const;

export function calculateROCOF(
  powerImbalance: number,  // MW (negativo = déficit)
  inertiaConstant: number, // H (s)
  basePower: number = 25000 // MW demanda sistema ibérico ~12:30
): number {
  // df/dt = ΔP / (2·H·Sbase)
  return powerImbalance / (2 * inertiaConstant * basePower);
}

export function frequencyTrajectory(
  t: number[],
  f0: number,
  powerImbalance: number,
  inertiaConstant: number,
  damping: number = 1.2
): number[] {
  return t.map((time) => {
    const rocofInit = calculateROCOF(powerImbalance, inertiaConstant);
    const f =
      f0 +
      (rocofInit / damping) * (1 - Math.exp(-damping * time)) -
      (rocofInit * time) / damping;
    return Math.max(f, 47.0); // floor absoluto sistema ibérico
  });
}

// Calcula si se activa algún escalón UFLS para una frecuencia dada
export function getActiveUFLSStage(frequency: number): typeof UFLS_STAGES[number] | null {
  for (const stage of [...UFLS_STAGES].reverse()) {
    if (frequency <= stage.threshold_hz) return stage;
  }
  return null;
}
