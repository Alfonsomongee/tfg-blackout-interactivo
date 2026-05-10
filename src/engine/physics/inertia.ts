// Valores calibrados con datos ICAI y ENTSO-E (informe abril 2025)
export interface GeneratorUnit {
  name: string;
  technology: "sync" | "grid-forming" | "grid-following";
  power_mw: number;
  inertia_constant_h?: number;
  response_time_ms?: number;
}

// Inercia por zona según informe ICAI (tabla zonal 28 abril 2025)
export const IBERIAN_INERTIA_BY_ZONE = {
  northwest: 3.84,   // s — zona noroeste (hidro + nuclear)
  center: 1.84,      // s — zona centro (ciclos combinados reducidos)
  south: 1.30,       // s — zona sur (alta penetración solar, ICAI)
  global_system: 2.3 // s — valor global sistema (REE/Gobierno)
} as const;

// Umbral mínimo recomendado ENTSO-E
export const ENTSO_E_MIN_INERTIA_S = 2.0;

// Generación síncrona aproximada 28/04/2025 a las 12:30 (mix 82% renovable)
export const BASELINE_GENERATORS: GeneratorUnit[] = [
  { name: "Nuclear Almaraz", technology: "sync", power_mw: 1850, inertia_constant_h: 5.0 },
  { name: "Nuclear Cofrentes", technology: "sync", power_mw: 1092, inertia_constant_h: 5.0 },
  { name: "CCGT zona sur (mín. técnico)", technology: "sync", power_mw: 400, inertia_constant_h: 4.5 },
  { name: "CCGT Extremadura", technology: "sync", power_mw: 400, inertia_constant_h: 4.5 },
  { name: "Hidro + otros síncronos", technology: "sync", power_mw: 2500, inertia_constant_h: 4.0 },
  { name: "Solar FV (grid-following)", technology: "grid-following", power_mw: 18000, inertia_constant_h: 0 },
  { name: "Eólica (grid-following)", technology: "grid-following", power_mw: 10000, inertia_constant_h: 0 }
];

export function systemInertia(generators: GeneratorUnit[]): number {
  const syncGenerators = generators.filter((g) => g.technology === "sync");
  const totalPower = generators.reduce((sum, g) => sum + g.power_mw, 0);
  const numerator = syncGenerators.reduce(
    (sum, g) => sum + (g.inertia_constant_h || 0) * g.power_mw,
    0
  );
  return numerator / totalPower;
}

export function virtualInertiaContribution(
  gridFormers: GeneratorUnit[],
  virtualGain: number = 0.8
): number {
  const totalGridFormerPower = gridFormers.reduce((sum, g) => sum + g.power_mw, 0);
  return virtualGain * 0.5 * (totalGridFormerPower / 47000);
}
