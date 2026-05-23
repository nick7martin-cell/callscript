import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Symptom, ScaleEntry } from '../../types';
import { useStore } from '../../store';
import { getTodayEntries, getDailyData, getTrend, hexWithAlpha } from '../../utils';
import { TrendBadge } from './TrendBadge';
import { MiniDots } from './MiniDots';

interface Props {
  symptom: Symptom;
  onEdit: () => void;
}

export function ScaleCard({ symptom, onEdit }: Props) {
  const { entries, addEntry, deleteEntry } = useStore();
  const todayEntries = getTodayEntries(entries, symptom.id) as ScaleEntry[];
  const lastEntry = todayEntries[todayEntries.length - 1];
  const [value, setValue] = useState(lastEntry?.value ?? 5);
  const [saved, setSaved] = useState(!!lastEntry);
  const [justSaved, setJustSaved] = useState(false);
  const dailyData = getDailyData(entries, symptom, 14);
  const trend = getTrend(entries, symptom);

  useEffect(() => {
    const latest = getTodayEntries(entries, symptom.id);
    const last = latest[latest.length - 1] as ScaleEntry | undefined;
    if (last) {
      setValue(last.value);
      setSaved(true);
    } else {
      setValue(5);
      setSaved(false);
    }
  }, [entries, symptom.id]);

  const handleSave = useCallback((v: number) => {
    if (lastEntry) deleteEntry(lastEntry.id);
    const entry: Omit<ScaleEntry, 'id'> = {
      kind: 'scale',
      symptomId: symptom.id,
      childId: symptom.childId,
      timestamp: new Date().toISOString(),
      value: v,
    };
    addEntry(entry);
    setSaved(true);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  }, [addEntry, deleteEntry, lastEntry, symptom]);

  const scaleColor = (v: number) => {
    if (symptom.higherIsBetter) {
      if (v <= 3) return '#EF4444';
      if (v <= 6) return '#F59E0B';
      return '#22C55E';
    } else {
      if (v <= 3) return '#22C55E';
      if (v <= 6) return '#F59E0B';
      return '#EF4444';
    }
  };

  const currentColor = scaleColor(value);

  const lowLabel = symptom.higherIsBetter ? 'Low' : 'Mild';
  const highLabel = symptom.higherIsBetter ? 'High' : 'Severe';

  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
      style={{ borderLeft: `4px solid ${symptom.color}` }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{symptom.emoji}</span>
          <span className="font-semibold text-gray-900">{symptom.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendBadge trend={trend} />
          <button onClick={onEdit} className="text-gray-300 hover:text-gray-500 text-xs transition-colors">•••</button>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        <div className="flex items-center justify-center">
          <motion.span
            key={value}
            initial={{ scale: 1.2, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-5xl font-bold"
            style={{ color: currentColor }}
          >
            {value}
          </motion.span>
          <span className="text-2xl font-light text-gray-300 ml-1">/10</span>
          {justSaved && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="ml-3 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentColor }}
            >
              <Check size={14} color="white" strokeWidth={3} />
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={10}
            value={value}
            onChange={e => setValue(Number(e.target.value))}
            onMouseUp={e => handleSave(Number((e.target as HTMLInputElement).value))}
            onTouchEnd={e => handleSave(Number((e.target as HTMLInputElement).value))}
            style={{
              background: `linear-gradient(to right, ${currentColor} ${(value - 1) / 9 * 100}%, ${hexWithAlpha(currentColor, 0.15)} ${(value - 1) / 9 * 100}%)`,
              color: currentColor,
            }}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1 · {lowLabel}</span>
            <span>10 · {highLabel}</span>
          </div>
        </div>

        {!saved && (
          <p className="text-xs text-gray-400 text-center">Slide to rate, lift to save</p>
        )}
        {saved && !justSaved && (
          <p className="text-xs text-gray-400 text-center">Logged today · slide to update</p>
        )}
      </div>

      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
        <MiniDots data={dailyData} symptom={symptom} />
      </div>
    </div>
  );
}
