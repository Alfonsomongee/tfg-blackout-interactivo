import { create } from 'zustand';
import type { TimelinePhase } from '../types/blackout';
import type { GeneratorUnit } from '../engine/physics/inertia';

interface SimulationState {
  // Timeline State
  phases: TimelinePhase[];
  activePhaseId: number;
  setActivePhaseId: (id: number) => void;

  // Contingency Simulator Parameters
  baselineInertia: number; // H in seconds (typically 2.0 to 8.0)
  gridFormingPenetration: number; // % (0 to 100)
  batteryCapacity: number; // MW (0 to 4000)
  powerImbalance: number; // MW (default -3500 MW)
  setBaselineInertia: (inertia: number) => void;
  setGridFormingPenetration: (p: number) => void;
  setBatteryCapacity: (c: number) => void;
  setPowerImbalance: (imbalance: number) => void;

  // Generator Fleet Status
  generators: GeneratorUnit[];
  toggleGenerator: (name: string) => void;
  updateGeneratorPower: (name: string, power: number) => void;

  // Divergence Matrix (Zone Statuses)
  zoneVoltages: { [key: string]: { voltage: number; freq: number; load: number; status: 'nominal' | 'alert' | 'critical' } };
  triggerFaultInZone: (zone: string) => void;
  resetAllFaults: () => void;
}

const initialPhases: TimelinePhase[] = [
  {
    id: 0,
    timestamp: "2025-04-28T12:00:00Z",
    label: "PRE-FAULT (BASELINE)",
    description: "Iberian synchronous area operating under normal conditions. Inertia levels within safe margins.",
    frequency_hz: 50.0,
    frequency_derivative_hz_per_s: 0.0,
    inertia_seconds: 4.8,
    voltage_zones: [
      { zone: "N-Spain", voltage_pu: 1.01, reactive_power_mvar: 250 },
      { zone: "NE-Spain", voltage_pu: 1.02, reactive_power_mvar: 180 },
      { zone: "Central-Spain", voltage_pu: 1.00, reactive_power_mvar: 410 },
      { zone: "S-Spain", voltage_pu: 1.01, reactive_power_mvar: 320 },
      { zone: "Portugal", voltage_pu: 1.00, reactive_power_mvar: 150 },
      { zone: "France-Link", voltage_pu: 1.03, reactive_power_mvar: 450 }
    ],
    events: []
  },
  {
    id: 1,
    timestamp: "2025-04-28T12:11:17Z",
    label: "HVDC TRIP EVENT",
    description: "Iberian-French PMODE link trips abruptly. High power deficit triggers instantaneous frequency rate decay (RoCoF).",
    frequency_hz: 49.65,
    frequency_derivative_hz_per_s: -1.25,
    inertia_seconds: 4.8,
    voltage_zones: [
      { zone: "N-Spain", voltage_pu: 0.98, reactive_power_mvar: 480 },
      { zone: "NE-Spain", voltage_pu: 0.91, reactive_power_mvar: -80 },
      { zone: "Central-Spain", voltage_pu: 0.96, reactive_power_mvar: 620 },
      { zone: "S-Spain", voltage_pu: 0.97, reactive_power_mvar: 510 },
      { zone: "Portugal", voltage_pu: 0.99, reactive_power_mvar: 200 },
      { zone: "France-Link", voltage_pu: 0.85, reactive_power_mvar: -1200 }
    ],
    events: [
      { timestamp: "2025-04-28T12:11:17Z", type: "hvdc_trip", description: "Iberian-French HVDC link disconnects (Infe-Link 1)", magnitude: 3500, unit: "MW" }
    ]
  },
  {
    id: 2,
    timestamp: "2025-04-28T12:11:19Z",
    label: "FREQUENCY NADIR",
    description: "Frequency hits its absolute lowest point (nadir). High risks of Under-Frequency Load Shedding (UFLS) stage activation.",
    frequency_hz: 48.22,
    frequency_derivative_hz_per_s: 0.05,
    inertia_seconds: 4.2,
    voltage_zones: [
      { zone: "N-Spain", voltage_pu: 0.94, reactive_power_mvar: 680 },
      { zone: "NE-Spain", voltage_pu: 0.88, reactive_power_mvar: -210 },
      { zone: "Central-Spain", voltage_pu: 0.92, reactive_power_mvar: 850 },
      { zone: "S-Spain", voltage_pu: 0.95, reactive_power_mvar: 740 },
      { zone: "Portugal", voltage_pu: 0.96, reactive_power_mvar: 310 },
      { zone: "France-Link", voltage_pu: 0.82, reactive_power_mvar: -1800 }
    ],
    events: [
      { timestamp: "2025-04-28T12:11:19Z", type: "frequency_nadir", description: "Frequency Nadir reached. Emergency load shedding triggered", magnitude: 48.22, unit: "Hz" }
    ]
  },
  {
    id: 3,
    timestamp: "2025-04-28T12:11:45Z",
    label: "RESTORATION PHASE",
    description: "Grid forming converters and primary battery reserves inject virtual inertia. Frequency starts stabilizing back to 50 Hz.",
    frequency_hz: 49.85,
    frequency_derivative_hz_per_s: 0.45,
    inertia_seconds: 6.5,
    voltage_zones: [
      { zone: "N-Spain", voltage_pu: 1.00, reactive_power_mvar: 310 },
      { zone: "NE-Spain", voltage_pu: 0.99, reactive_power_mvar: 120 },
      { zone: "Central-Spain", voltage_pu: 1.00, reactive_power_mvar: 490 },
      { zone: "S-Spain", voltage_pu: 1.00, reactive_power_mvar: 380 },
      { zone: "Portugal", voltage_pu: 1.00, reactive_power_mvar: 190 },
      { zone: "France-Link", voltage_pu: 1.01, reactive_power_mvar: 100 }
    ],
    events: [
      { timestamp: "2025-04-28T12:11:45Z", type: "restoration", description: "BESS & Virtual Inertia stabilizers online", magnitude: 1800, unit: "MW" }
    ]
  }
];

const initialGenerators: GeneratorUnit[] = [
  { name: "Almaraz Nuclear I & II", technology: "sync", power_mw: 2044, inertia_constant_h: 5.5, response_time_ms: 100 },
  { name: "Cofrentes Nuclear", technology: "sync", power_mw: 1092, inertia_constant_h: 5.2, response_time_ms: 100 },
  { name: "San Roque CCGT (Gas)", technology: "sync", power_mw: 800, inertia_constant_h: 4.0, response_time_ms: 250 },
  { name: "As Pontes Coal (Legacy)", technology: "sync", power_mw: 1400, inertia_constant_h: 4.5, response_time_ms: 300 },
  { name: "Extremadura Solar Hub", technology: "grid-following", power_mw: 1500, inertia_constant_h: 0, response_time_ms: 500 },
  { name: "Galicia Wind Fields", technology: "grid-following", power_mw: 1800, inertia_constant_h: 0, response_time_ms: 600 },
  { name: "GigaBattery BESS (Virtual Inertia)", technology: "grid-forming", power_mw: 600, inertia_constant_h: 6.8, response_time_ms: 10 },
  { name: "Andalucía GFM Solar Park", technology: "grid-forming", power_mw: 400, inertia_constant_h: 6.0, response_time_ms: 15 }
];

const initialZones = {
  "N-Spain": { voltage: 1.01, freq: 50.0, load: 4500, status: 'nominal' as const },
  "NE-Spain": { voltage: 1.02, freq: 50.0, load: 3800, status: 'nominal' as const },
  "Central-Spain": { voltage: 1.00, freq: 50.0, load: 8200, status: 'nominal' as const },
  "S-Spain": { voltage: 1.01, freq: 50.0, load: 5600, status: 'nominal' as const },
  "Portugal": { voltage: 1.00, freq: 50.0, load: 3100, status: 'nominal' as const },
  "France-Link": { voltage: 1.03, freq: 50.0, load: 3500, status: 'nominal' as const }
};

export const useStore = create<SimulationState>((set) => ({
  phases: initialPhases,
  activePhaseId: 0,
  setActivePhaseId: (id) => set({ activePhaseId: id }),

  baselineInertia: 4.5,
  gridFormingPenetration: 15,
  batteryCapacity: 600,
  powerImbalance: -3500,

  setBaselineInertia: (inertia) => set({ baselineInertia: inertia }),
  setGridFormingPenetration: (p) => set({ gridFormingPenetration: p }),
  setBatteryCapacity: (c) => set({ batteryCapacity: c }),
  setPowerImbalance: (imbalance) => set({ powerImbalance: imbalance }),

  generators: initialGenerators,
  toggleGenerator: (name) => set((state) => {
    const updated = state.generators.map(g => 
      g.name === name ? { ...g, power_mw: g.power_mw > 0 ? 0 : initialGenerators.find(ig => ig.name === name)!.power_mw } : g
    );
    return { generators: updated };
  }),
  updateGeneratorPower: (name, power) => set((state) => ({
    generators: state.generators.map(g => g.name === name ? { ...g, power_mw: power } : g)
  })),

  zoneVoltages: initialZones,
  triggerFaultInZone: (zone) => set((state) => {
    const nextZones = { ...state.zoneVoltages };
    
    if (nextZones[zone]) {
      const isCurrentlyFaulted = nextZones[zone].status === 'critical';
      nextZones[zone] = {
        ...nextZones[zone],
        voltage: isCurrentlyFaulted ? 1.00 : 0.78,
        freq: isCurrentlyFaulted ? 50.0 : 48.15,
        status: isCurrentlyFaulted ? 'nominal' : 'critical'
      };
      
      // Affect neighboring zones
      if (!isCurrentlyFaulted) {
        Object.keys(nextZones).forEach((otherZone) => {
          if (otherZone !== zone && otherZone !== 'France-Link') {
            nextZones[otherZone] = {
              ...nextZones[otherZone],
              voltage: Math.max(0.85, nextZones[otherZone].voltage - 0.08),
              freq: Math.max(48.5, nextZones[otherZone].freq - 0.5),
              status: 'alert'
            };
          }
        });
      } else {
        // Reset system to nominal when clearing fault
        Object.keys(nextZones).forEach((otherZone) => {
          nextZones[otherZone] = {
            ...initialZones[otherZone as keyof typeof initialZones],
            status: 'nominal'
          };
        });
      }
    }
    return { zoneVoltages: nextZones };
  }),
  resetAllFaults: () => set({ zoneVoltages: initialZones })
}));
