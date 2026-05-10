export function calculateROCOF(
  powerImbalance: number,
  inertiaConstant: number,
  basePower: number = 47000
): number {
  const rocof = powerImbalance / (2 * inertiaConstant * basePower);
  return rocof;
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
    const f = f0 + (rocofInit / damping) * (1 - Math.exp(-damping * time)) - (rocofInit * time) / damping;
    return Math.max(f, 47.5);
  });
}
