export type SymptomType = 'tally' | 'duration' | 'scale' | 'toggle';
export type TrendDirection = 'good' | 'bad' | 'stable' | 'none';

export interface Child {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
}

export interface Symptom {
  id: string;
  childId: string;
  name: string;
  type: SymptomType;
  emoji: string;
  color: string;
  higherIsBetter: boolean;
  order: number;
}

export interface TallyEntry {
  kind: 'tally';
  id: string;
  symptomId: string;
  childId: string;
  timestamp: string;
}

export interface DurationEntry {
  kind: 'duration';
  id: string;
  symptomId: string;
  childId: string;
  timestamp: string;
  durationMinutes: number;
  severity: 1 | 2 | 3 | 4 | 5;
}

export interface ScaleEntry {
  kind: 'scale';
  id: string;
  symptomId: string;
  childId: string;
  timestamp: string;
  value: number;
}

export interface ToggleEntry {
  kind: 'toggle';
  id: string;
  symptomId: string;
  childId: string;
  timestamp: string;
  occurred: boolean;
}

export type SymptomEntry = TallyEntry | DurationEntry | ScaleEntry | ToggleEntry;

export interface ActiveTimer {
  symptomId: string;
  startTimestamp: string;
}

export interface AppState {
  children: Child[];
  symptoms: Symptom[];
  entries: SymptomEntry[];
  activeChildId: string | null;
  activeTimer: ActiveTimer | null;
}

export interface DailyDataPoint {
  date: string;
  value: number;
  hasData: boolean;
  rawEntries: SymptomEntry[];
}

export interface TrendInfo {
  direction: TrendDirection;
  pct: number;
}
