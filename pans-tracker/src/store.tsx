import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { AppState, Child, Symptom, SymptomEntry, ActiveTimer } from './types';

const STORAGE_KEY = 'pans-tracker-v1';

const defaultState: AppState = {
  children: [],
  symptoms: [],
  entries: [],
  activeChildId: null,
  activeTimer: null,
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* storage full */ }
}

interface StoreContextType {
  children: Child[];
  symptoms: Symptom[];
  entries: SymptomEntry[];
  activeChildId: string | null;
  activeTimer: ActiveTimer | null;
  activeSymptoms: Symptom[];
  addChild: (name: string, emoji: string) => Child;
  updateChild: (id: string, name: string, emoji: string) => void;
  deleteChild: (id: string) => void;
  setActiveChild: (id: string) => void;
  addSymptom: (s: Omit<Symptom, 'id' | 'order'>) => void;
  updateSymptom: (id: string, updates: Partial<Omit<Symptom, 'id' | 'childId'>>) => void;
  deleteSymptom: (id: string) => void;
  reorderSymptom: (childId: string, id: string, direction: 'up' | 'down') => void;
  addEntry: (entry: Omit<SymptomEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  startTimer: (symptomId: string) => void;
  clearTimer: () => ActiveTimer | null;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children: nodeChildren }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const update = useCallback((updater: (s: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      stateRef.current = next;
      saveState(next);
      return next;
    });
  }, []);

  const addChild = useCallback((name: string, emoji: string): Child => {
    const child: Child = { id: crypto.randomUUID(), name, emoji, createdAt: new Date().toISOString() };
    update(s => ({ ...s, children: [...s.children, child], activeChildId: s.activeChildId ?? child.id }));
    return child;
  }, [update]);

  const updateChild = useCallback((id: string, name: string, emoji: string) => {
    update(s => ({ ...s, children: s.children.map(c => c.id === id ? { ...c, name, emoji } : c) }));
  }, [update]);

  const deleteChild = useCallback((id: string) => {
    update(s => ({
      ...s,
      children: s.children.filter(c => c.id !== id),
      symptoms: s.symptoms.filter(sym => sym.childId !== id),
      entries: s.entries.filter(e => e.childId !== id),
      activeChildId: s.activeChildId === id
        ? (s.children.find(c => c.id !== id)?.id ?? null)
        : s.activeChildId,
      activeTimer: (s.activeTimer && s.symptoms.find(sym => sym.id === s.activeTimer?.symptomId)?.childId === id)
        ? null : s.activeTimer,
    }));
  }, [update]);

  const setActiveChild = useCallback((id: string) => {
    update(s => ({ ...s, activeChildId: id }));
  }, [update]);

  const addSymptom = useCallback((sym: Omit<Symptom, 'id' | 'order'>) => {
    const order = stateRef.current.symptoms.filter(s => s.childId === sym.childId).length;
    const newSym: Symptom = { ...sym, id: crypto.randomUUID(), order };
    update(s => ({ ...s, symptoms: [...s.symptoms, newSym] }));
  }, [update]);

  const updateSymptom = useCallback((id: string, updates: Partial<Omit<Symptom, 'id' | 'childId'>>) => {
    update(s => ({ ...s, symptoms: s.symptoms.map(sym => sym.id === id ? { ...sym, ...updates } : sym) }));
  }, [update]);

  const deleteSymptom = useCallback((id: string) => {
    update(s => ({
      ...s,
      symptoms: s.symptoms.filter(sym => sym.id !== id),
      entries: s.entries.filter(e => e.symptomId !== id),
      activeTimer: s.activeTimer?.symptomId === id ? null : s.activeTimer,
    }));
  }, [update]);

  const reorderSymptom = useCallback((childId: string, id: string, direction: 'up' | 'down') => {
    update(s => {
      const syms = s.symptoms.filter(sym => sym.childId === childId).sort((a, b) => a.order - b.order);
      const idx = syms.findIndex(sym => sym.id === id);
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= syms.length) return s;
      const updated = [...syms];
      [updated[idx], updated[targetIdx]] = [updated[targetIdx], updated[idx]];
      const reordered = updated.map((sym, i) => ({ ...sym, order: i }));
      const otherSyms = s.symptoms.filter(sym => sym.childId !== childId);
      return { ...s, symptoms: [...otherSyms, ...reordered] };
    });
  }, [update]);

  const addEntry = useCallback((entry: Omit<SymptomEntry, 'id'>) => {
    const newEntry = { ...entry, id: crypto.randomUUID() } as SymptomEntry;
    update(s => ({ ...s, entries: [...s.entries, newEntry] }));
  }, [update]);

  const deleteEntry = useCallback((id: string) => {
    update(s => ({ ...s, entries: s.entries.filter(e => e.id !== id) }));
  }, [update]);

  const startTimer = useCallback((symptomId: string) => {
    update(s => ({ ...s, activeTimer: { symptomId, startTimestamp: new Date().toISOString() } }));
  }, [update]);

  const clearTimer = useCallback((): ActiveTimer | null => {
    const prev = stateRef.current.activeTimer;
    update(s => ({ ...s, activeTimer: null }));
    return prev;
  }, [update]);

  const activeSymptoms = state.symptoms
    .filter(s => s.childId === state.activeChildId)
    .sort((a, b) => a.order - b.order);

  const value: StoreContextType = {
    children: state.children,
    symptoms: state.symptoms,
    entries: state.entries,
    activeChildId: state.activeChildId,
    activeTimer: state.activeTimer,
    activeSymptoms,
    addChild,
    updateChild,
    deleteChild,
    setActiveChild,
    addSymptom,
    updateSymptom,
    deleteSymptom,
    reorderSymptom,
    addEntry,
    deleteEntry,
    startTimer,
    clearTimer,
  };

  return <StoreContext.Provider value={value}>{nodeChildren}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
