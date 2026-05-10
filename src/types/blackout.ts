export interface TimelinePhase {
  id: number;
  timestamp: string;
  label: string;
  description: string;
  frequency_hz: number;
  frequency_derivative_hz_per_s: number;
  inertia_seconds: number;
  voltage_zones: VoltageZone[];
  events: BlackoutEvent[];
}

export interface VoltageZone {
  zone: string;
  voltage_pu: number;
  reactive_power_mvar: number;
}

export interface BlackoutEvent {
  timestamp: string;
  type: "generator_trip" | "line_fault" | "hvdc_trip" | "frequency_nadir" | "restoration";
  description: string;
  magnitude: number;
  unit: string;
}

export interface ContingencyScenario {
  id: string;
  name: string;
  baselineInertia: number;
  gridFormingPenetration: number;
  batteryCapacity: number;
  result: {
    frequency_nadir: number;
    time_to_nadir: number;
    voltage_recovery_time: number;
    cascadeRisk: "low" | "medium" | "high";
  };
}
