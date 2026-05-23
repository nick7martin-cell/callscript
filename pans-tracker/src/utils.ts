import { format, subDays } from 'date-fns';
import type { DailyDataPoint, DurationEntry, ScaleEntry, Symptom, SymptomEntry, ToggleEntry, TrendInfo } from './types';

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getTodayEntries(entries: SymptomEntry[], symptomId: string): SymptomEntry[] {
  const today = todayStr();
  return entries.filter(e => e.symptomId === symptomId && e.timestamp.startsWith(today));
}

export function getDailyData(entries: SymptomEntry[], symptom: Symptom, days: number): DailyDataPoint[] {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEntries = entries.filter(e => e.symptomId === symptom.id && e.timestamp.startsWith(dateStr));

    let value = 0;
    if (dayEntries.length > 0) {
      if (symptom.type === 'tally') {
        value = dayEntries.length;
      } else if (symptom.type === 'duration') {
        value = (dayEntries as DurationEntry[]).reduce((s, e) => s + e.durationMinutes, 0);
      } else if (symptom.type === 'scale') {
        const vals = dayEntries as ScaleEntry[];
        value = vals.reduce((s, e) => s + e.value, 0) / vals.length;
      } else if (symptom.type === 'toggle') {
        value = (dayEntries as ToggleEntry[]).some(e => e.occurred) ? 1 : 0;
      }
    }

    return { date: dateStr, value, hasData: dayEntries.length > 0, rawEntries: dayEntries };
  });
}

export function getTrend(entries: SymptomEntry[], symptom: Symptom): TrendInfo {
  const data = getDailyData(entries, symptom, 14);
  const last7 = data.slice(7).filter(d => d.hasData);
  const prior7 = data.slice(0, 7).filter(d => d.hasData);

  if (!last7.length || !prior7.length) return { direction: 'none', pct: 0 };

  const last7Avg = last7.reduce((s, d) => s + d.value, 0) / last7.length;
  const prior7Avg = prior7.reduce((s, d) => s + d.value, 0) / prior7.length;

  if (prior7Avg === 0) return { direction: 'stable', pct: 0 };

  const pct = ((last7Avg - prior7Avg) / prior7Avg) * 100;
  if (Math.abs(pct) < 15) return { direction: 'stable', pct };

  const isUp = pct > 0;
  return { direction: isUp === symptom.higherIsBetter ? 'good' : 'bad', pct };
}
