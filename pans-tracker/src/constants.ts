import type { SymptomType } from './types';

export const SYMPTOM_COLORS = [
  '#8B5CF6',
  '#3B82F6',
  '#14B8A6',
  '#22C55E',
  '#F59E0B',
  '#F97316',
  '#EF4444',
  '#EC4899',
  '#6366F1',
  '#06B6D4',
];

export const CHILD_EMOJIS = ['🦋', '🌟', '🌈', '🦄', '🐬', '🌻', '🦊', '🐧', '🌺', '🦁', '🐨', '🦉'];

export const SEVERITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Mild', color: '#22C55E' },
  2: { label: 'Low-Mod', color: '#84CC16' },
  3: { label: 'Moderate', color: '#F59E0B' },
  4: { label: 'Severe', color: '#F97316' },
  5: { label: 'Crisis', color: '#EF4444' },
};

export const TYPE_LABELS: Record<SymptomType, string> = {
  tally: 'Counter',
  duration: 'Timer',
  scale: 'Scale',
  toggle: 'Yes / No',
};

export const TYPE_DESCRIPTIONS: Record<SymptomType, string> = {
  tally: 'Tap to count each occurrence',
  duration: 'Record duration and severity',
  scale: 'Rate on a 1–10 scale',
  toggle: 'Did it happen today?',
};

export interface SymptomTemplate {
  name: string;
  type: SymptomType;
  emoji: string;
  color: string;
  higherIsBetter: boolean;
  description: string;
}

export const SYMPTOM_TEMPLATES: SymptomTemplate[] = [
  { name: 'Meltdowns', type: 'duration', emoji: '🌊', color: '#EF4444', higherIsBetter: false, description: 'Duration & severity of rage/meltdown episodes' },
  { name: 'OCD Behaviors', type: 'tally', emoji: '🔄', color: '#8B5CF6', higherIsBetter: false, description: 'Count OCD rituals or compulsive behaviors' },
  { name: 'Anxiety Level', type: 'scale', emoji: '😰', color: '#F97316', higherIsBetter: false, description: 'Daily anxiety rating (1 = calm, 10 = severe)' },
  { name: 'Sleep Quality', type: 'scale', emoji: '😴', color: '#6366F1', higherIsBetter: true, description: 'Rate sleep quality (1 = terrible, 10 = great)' },
  { name: 'Food Refusal', type: 'toggle', emoji: '🍽️', color: '#14B8A6', higherIsBetter: false, description: 'Did food refusal or restriction occur today?' },
  { name: 'Tics', type: 'tally', emoji: '⚡', color: '#F59E0B', higherIsBetter: false, description: 'Count tic episodes observed today' },
  { name: 'Defiance', type: 'tally', emoji: '😤', color: '#EC4899', higherIsBetter: false, description: 'Count significant oppositional episodes' },
  { name: 'Separation Anxiety', type: 'scale', emoji: '🫂', color: '#3B82F6', higherIsBetter: false, description: 'Rate separation anxiety (1 = none, 10 = severe)' },
  { name: 'Focus & Attention', type: 'scale', emoji: '🎯', color: '#22C55E', higherIsBetter: true, description: 'Rate ability to focus (1 = unfocused, 10 = excellent)' },
  { name: 'Urinary Frequency', type: 'tally', emoji: '🚽', color: '#06B6D4', higherIsBetter: false, description: 'Count unusual urgency or frequency episodes' },
  { name: 'Sensory Sensitivity', type: 'scale', emoji: '🌡️', color: '#F59E0B', higherIsBetter: false, description: 'Rate sensory overload (1 = none, 10 = severe)' },
  { name: 'School Attendance', type: 'toggle', emoji: '🏫', color: '#22C55E', higherIsBetter: true, description: 'Did they attend school today?' },
];
