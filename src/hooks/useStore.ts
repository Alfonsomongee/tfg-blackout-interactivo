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
  powerImbalance: number; // MW (default -2000 MW)
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
    timestamp: "2025-04-28T10:03:00Z",
    label: "Operación Normal — 82% Renovable",
    description: "Sistema ibérico en operación normal. Penetración renovable del 82%. Carga ligera. Inercia reducida por baja generación síncrona.",
    frequency_hz: 50.0,
    frequency_derivative_hz_per_s: 0.0,
    inertia_seconds: 2.3,
    voltage_zones: [
      { zone: "N-Spain", voltage_pu: 1.02, reactive_power_mvar: 450 },
      { zone: "S-Spain", voltage_pu: 1.01, reactive_power_mvar: 380 }
    ],
    events: []
  },
  {
    id: 1,
    timestamp: "2025-04-28T10:03:00Z",
    label: "Oscilación Forzada 0,63 Hz",
    description: "Primera oscilación interárea detectada. Carácter forzado según REE/ENTSO-E; carácter natural según ICAI. Amplitud intercambio activo: 470 MW pico a pico.",
    frequency_hz: 49.98,
    frequency_derivative_hz_per_s: -0.05,
    inertia_seconds: 2.3,
    voltage_zones: [
      { zone: "Iberian Peninsula", voltage_pu: 1.03, reactive_power_mvar: 420 }
    ],
    events: [
      {
        timestamp: "2025-04-28T10:03:00Z",
        type: "generator_trip", // use standard type from our union to prevent type errors
        description: "Oscilación 0,63 Hz. Amplitud intercambio: 470 MW pico a pico (REE/ENTSO-E vs ICAI)",
        magnitude: 470,
        unit: "MW"
      }
    ]
  },
  {
    id: 2,
    timestamp: "2025-04-28T10:11:00Z",
    label: "HVDC PMODE3→PMODE1 (12:11 CEST)",
    description: "Operadores reconfiguran el enlace HVDC España-Francia de modo AC-emulación (PMODE3) a potencia fija (PMODE1) a 1.000 MW de exportación. Acción tomada para amortiguar la oscilación 0,63 Hz. Elimina la capacidad del HVDC de responder a desvíos de frecuencia.",
    frequency_hz: 50.0,
    frequency_derivative_hz_per_s: 0.0,
    inertia_seconds: 2.3,
    voltage_zones: [
      { zone: "Iberian Peninsula", voltage_pu: 1.02, reactive_power_mvar: 430 }
    ],
    events: [
      {
        timestamp: "2025-04-28T10:11:00Z",
        type: "hvdc_trip",
        description: "HVDC España-Francia: PMODE3→PMODE1. Exportación fija: 1.000 MW",
        magnitude: 1000,
        unit: "MW"
      }
    ]
  },
  {
    id: 3,
    timestamp: "2025-04-28T10:19:00Z",
    label: "Segunda Oscilación 0,21 Hz (12:19–12:22 CEST)",
    description: "Segunda oscilación interárea. Amplitud: 1.480 MW pico a pico. Península Ibérica oscila coherentemente frente a Europa Continental. Amortiguada a las 12:22. A las 12:26, REE solicita sincronización urgente de grupos convencionales: tiempo mínimo ofertado 1,5 horas.",
    frequency_hz: 49.97,
    frequency_derivative_hz_per_s: -0.08,
    inertia_seconds: 2.3,
    voltage_zones: [
      { zone: "Iberian Peninsula", voltage_pu: 1.025, reactive_power_mvar: 400 }
    ],
    events: [
      {
        timestamp: "2025-04-28T10:19:00Z",
        type: "generator_trip",
        description: "Oscilación interárea 0,21 Hz. 1.480 MW pico a pico. Amortiguada a 12:22",
        magnitude: 1480,
        unit: "MW"
      },
      {
        timestamp: "2025-04-28T10:26:00Z",
        type: "generator_trip",
        description: "REE solicita grupos convencionales zona sur. Tiempo mínimo ofertado: 1.5 h.",
        magnitude: 90,
        unit: "min"
      }
    ]
  },
  {
    id: 4,
    timestamp: "2025-04-28T10:32:00Z",
    label: "Inicio Cascada — Subida de Tensión (12:32 CEST)",
    description: "Tensiones suben de forma casi lineal en toda la red de 400 kV. SE Olmedilla: 413 kV → 428 kV en 57 s. SE Arroyo de San Serván: 411 kV → 424 kV en el mismo periodo. Pérdidas de generación distribuidas: 525 MW (12:32:00–12:32:55), de los cuales 317 MW son generación distribuida <1 MW. Margen al colapso por sobretensión (ICAI): 1.019 MW.",
    frequency_hz: 49.95,
    frequency_derivative_hz_per_s: -0.15,
    inertia_seconds: 2.3,
    voltage_zones: [
      { zone: "S-Spain", voltage_pu: 1.07, reactive_power_mvar: -180 },
      { zone: "Center-Spain", voltage_pu: 1.06, reactive_power_mvar: -120 }
    ],
    events: [
      {
        timestamp: "2025-04-28T10:32:00Z",
        type: "line_fault",
        description: "Subida lineal de tensión 400 kV. Reducción de exportación a Francia",
        magnitude: 15,
        unit: "kV"
      },
      {
        timestamp: "2025-04-28T10:32:55Z",
        type: "generator_trip",
        description: "525 MW perdidos (317 MW generación distribuida <1 MW)",
        magnitude: 525,
        unit: "MW"
      }
    ]
  },
  {
    id: 5,
    timestamp: "2025-04-28T10:32:57Z",
    label: "Evento 1 — Disparo Subestación Granada (12:32:57 CEST)",
    description: "Primer evento mayor. Disparo en subestación de la provincia de Granada. Inicio del colapso en cascada por sobretensión en red de colectores. Generación RCR: ~2.000 MW perdidos en red de transporte.",
    frequency_hz: 49.8,
    frequency_derivative_hz_per_s: -0.8,
    inertia_seconds: 2.3,
    voltage_zones: [
      { zone: "S-Spain", voltage_pu: 1.09, reactive_power_mvar: -350 }
    ],
    events: [
      {
        timestamp: "2025-04-28T10:32:57Z",
        type: "generator_trip",
        description: "Disparo subestación Granada. Inicio cascada. ~2.000 MW RCR",
        magnitude: 2000,
        unit: "MW"
      }
    ]
  },
  {
    id: 6,
    timestamp: "2025-04-28T10:33:17Z",
    label: "Pérdida de Sincronismo — Blackout Total (12:33:17 CEST)",
    description: "22,5 s después del disparo en Granada. Importación Francia alcanza 3.807 MW (4.609 MW por interconexiones AC). Pérdida de sincronismo. UFLS activado: escalón 1 a 49,5 Hz (~2.000 MW bombeo); escalón 2 a 49,3 Hz (588 MW); escalón 3 a 49,0 Hz (~1.402 MW industriales/distribución). Pérdida interconexión Marruecos: 314 MW. Duración total colapso: ~3,20 s desde Subestación B.",
    frequency_hz: 48.0,
    frequency_derivative_hz_per_s: -2.5,
    inertia_seconds: 0.0,
    voltage_zones: [
      { zone: "Iberian Peninsula", voltage_pu: 0.0, reactive_power_mvar: 0 }
    ],
    events: [
      {
        timestamp: "2025-04-28T10:33:19Z",
        type: "frequency_nadir",
        description: "Máxima importación Francia 3.807 MW. Pérdida de sincronismo. Blackout total",
        magnitude: 3807,
        unit: "MW"
      }
    ]
  }
];

const initialGenerators: GeneratorUnit[] = [
  { name: "Nuclear Almaraz", technology: "sync", power_mw: 1850, inertia_constant_h: 5.0 },
  { name: "Nuclear Cofrentes", technology: "sync", power_mw: 1092, inertia_constant_h: 5.0 },
  { name: "CCGT zona sur (mín. técnico)", technology: "sync", power_mw: 400, inertia_constant_h: 4.5 },
  { name: "CCGT Extremadura", technology: "sync", power_mw: 400, inertia_constant_h: 4.5 },
  { name: "Hidro + otros síncronos", technology: "sync", power_mw: 2500, inertia_constant_h: 4.0 },
  { name: "Solar FV (grid-following)", technology: "grid-following", power_mw: 18000, inertia_constant_h: 0 },
  { name: "Eólica (grid-following)", technology: "grid-following", power_mw: 10000, inertia_constant_h: 0 }
];

const initialZones = {
  "N-Spain": { voltage: 1.02, freq: 50.0, load: 4500, status: 'nominal' as const },
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

  baselineInertia: 1.84,
  gridFormingPenetration: 0,
  batteryCapacity: 0,
  powerImbalance: -2000,

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
export type { SimulationState };
