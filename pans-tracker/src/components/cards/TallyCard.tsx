import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus } from 'lucide-react';
import type { Symptom, TallyEntry } from '../../types';
import { useStore } from '../../store';
import { getTodayEntries, getDailyData, getTrend } from '../../utils';
import { TrendBadge } from './TrendBadge';
import { MiniDots } from './MiniDots';

interface Props {
  symptom: Symptom;
  onEdit: () => void;
}

interface Floaty {
  id: number;
  x: number;
}

export function TallyCard({ symptom, onEdit }: Props) {
  const { entries, addEntry, deleteEntry } = useStore();
  const [floaties, setFloaties] = useState<Floaty[]>([]);
  const [pressing, setPressing] = useState(false);

  const todayEntries = getTodayEntries(entries, symptom.id);
  const count = todayEntries.length;
  const dailyData = getDailyData(entries, symptom, 14);
  const trend = getTrend(entries, symptom);

  const handleTap = useCallback(() => {
    const entry: Omit<TallyEntry, 'id'> = {
      kind: 'tally',
      symptomId: symptom.id,
      childId: symptom.childId,
      timestamp: new Date().toISOString(),
    };
    addEntry(entry);
    const id = Date.now();
    const x = (Math.random() - 0.5) * 40;
    setFloaties(prev => [...prev, { id, x }]);
    setTimeout(() => setFloaties(prev => prev.filter(f => f.id !== id)), 800);
  }, [addEntry, symptom]);

  const handleUndo = useCallback(() => {
    if (todayEntries.length === 0) return;
    const last = todayEntries[todayEntries.length - 1];
    deleteEntry(last.id);
  }, [todayEntries, deleteEntry]);

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
          <button
            onClick={onEdit}
            className="text-gray-300 hover:text-gray-500 text-xs font-medium transition-colors"
          >
            •••
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="relative flex items-center justify-center mb-3">
          <AnimatePresence>
            {floaties.map(f => (
              <motion.span
                key={f.id}
                initial={{ opacity: 1, y: 0, x: f.x, scale: 1.3 }}
                animate={{ opacity: 0, y: -55, x: f.x }}
                exit={{}}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="absolute font-bold text-xl pointer-events-none select-none"
                style={{ color: symptom.color, bottom: '100%' }}
              >
                +1
              </motion.span>
            ))}
          </AnimatePresence>

          <motion.button
            onTapStart={() => setPressing(true)}
            onTap={() => { setPressing(false); handleTap(); }}
            onTapCancel={() => setPressing(false)}
            animate={{ scale: pressing ? 0.92 : 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="flex-1 py-5 rounded-2xl flex flex-col items-center justify-center gap-1 select-none cursor-pointer"
            style={{ backgroundColor: symptom.color + '12' }}
          >
            <motion.span
              key={count}
              initial={{ scale: 1.4, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="text-5xl font-bold leading-none"
              style={{ color: symptom.color }}
            >
              {count}
            </motion.span>
            <span className="text-sm font-medium" style={{ color: symptom.color + 'BB' }}>
              {count === 1 ? 'time today' : 'times today'} · tap to add
            </span>
          </motion.button>
        </div>

        {count > 0 && (
          <button
            onClick={handleUndo}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-xs transition-colors mx-auto"
          >
            <Minus size={12} />
            undo last
          </button>
        )}
      </div>

      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
        <MiniDots data={dailyData} symptom={symptom} />
      </div>
    </div>
  );
}
