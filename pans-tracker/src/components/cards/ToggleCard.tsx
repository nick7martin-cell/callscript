import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { Symptom, ToggleEntry } from '../../types';
import { useStore } from '../../store';
import { getTodayEntries, getDailyData, getTrend } from '../../utils';
import { TrendBadge } from './TrendBadge';
import { MiniDots } from './MiniDots';

interface Props {
  symptom: Symptom;
  onEdit: () => void;
}

export function ToggleCard({ symptom, onEdit }: Props) {
  const { entries, addEntry, deleteEntry } = useStore();
  const todayEntries = getTodayEntries(entries, symptom.id) as ToggleEntry[];
  const todayEntry = todayEntries[0];
  const dailyData = getDailyData(entries, symptom, 14);
  const trend = getTrend(entries, symptom);

  const didOccur = todayEntry?.occurred ?? null;

  const handleToggle = useCallback((occurred: boolean) => {
    if (todayEntry) deleteEntry(todayEntry.id);
    if (todayEntry?.occurred === occurred) return;
    const entry: Omit<ToggleEntry, 'id'> = {
      kind: 'toggle',
      symptomId: symptom.id,
      childId: symptom.childId,
      timestamp: new Date().toISOString(),
      occurred,
    };
    addEntry(entry);
  }, [addEntry, deleteEntry, todayEntry, symptom]);

  const noColor = symptom.higherIsBetter ? symptom.color : '#22C55E';
  const yesColor = symptom.higherIsBetter ? '#9CA3AF' : '#EF4444';

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

      <div className="px-4 pb-4">
        <p className="text-sm text-gray-500 mb-3 text-center">Did this occur today?</p>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToggle(false)}
            className="flex-1 py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 font-semibold transition-all"
            style={
              didOccur === false
                ? { backgroundColor: noColor, color: 'white' }
                : { backgroundColor: noColor + '12', color: noColor }
            }
          >
            <Check size={22} strokeWidth={2.5} />
            <span className="text-sm">No</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToggle(true)}
            className="flex-1 py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 font-semibold transition-all"
            style={
              didOccur === true
                ? { backgroundColor: yesColor, color: 'white' }
                : { backgroundColor: yesColor + '12', color: yesColor }
            }
          >
            <X size={22} strokeWidth={2.5} />
            <span className="text-sm">Yes</span>
          </motion.button>
        </div>

        {didOccur === null && (
          <p className="text-xs text-gray-400 text-center mt-2">Not logged yet today</p>
        )}
      </div>

      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
        <MiniDots data={dailyData} symptom={symptom} />
      </div>
    </div>
  );
}
