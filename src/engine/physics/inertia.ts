export interface GeneratorUnit {
  name: string;
  technology: "sync" | "grid-forming" | "grid-following";
  power_mw: number;
  inertia_constant_h?: number;
  response_time_ms?: number;
}

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
