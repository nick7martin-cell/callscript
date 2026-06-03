import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Square } from 'lucide-react';
import type { Symptom, DurationEntry } from '../../types';
import { useStore } from '../../store';
import { getTodayEntries, getDailyData, getTrend, formatDuration, formatElapsed } from '../../utils';
import { SEVERITY_LABELS } from '../../constants';
import { TrendBadge } from './TrendBadge';
import { MiniDots } from './MiniDots';

interface Props {
  symptom: Symptom;
  onEdit: () => void;
}

export function DurationCard({ symptom, onEdit }: Props) {
  const { entries, addEntry, activeTimer, startTimer, clearTimer } = useStore();
  const [elapsed, setElapsed] = useState(0);
  const [pendingMinutes, setPendingMinutes] = useState<number | null>(null);

  const isActive = activeTimer?.symptomId === symptom.id;
  const todayEntries = getTodayEntries(entries, symptom.id) as DurationEntry[];
  const totalMinutesToday = todayEntries.reduce((s, e) => s + e.durationMinutes, 0);
  const dailyData = getDailyData(entries, symptom, 14);
  const trend = getTrend(entries, symptom);

  useEffect(() => {
    if (!isActive) { setElapsed(0); return; }
    const tick = () => {
      if (activeTimer) {
        setElapsed(Math.floor((Date.now() - new Date(activeTimer.startTimestamp).getTime()) / 1000));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isActive, activeTimer]);

  const handleStart = useCallback(() => {
    startTimer(symptom.id);
    setPendingMinutes(null);
  }, [startTimer, symptom.id]);

  const handleStop = useCallback(() => {
    const prev = clearTimer();
    if (!prev) return;
    const mins = Math.max(1, Math.round((Date.now() - new Date(prev.startTimestamp).getTime()) / 60000));
    setPendingMinutes(mins);
  }, [clearTimer]);

  const handleSeverity = useCallback((sev: 1 | 2 | 3 | 4 | 5) => {
    if (pendingMinutes === null) return;
    const entry: Omit<DurationEntry, 'id'> = {
      kind: 'duration',
      symptomId: symptom.id,
      childId: symptom.childId,
      timestamp: new Date().toISOString(),
      durationMinutes: pendingMinutes,
      severity: sev,
    };
    addEntry(entry);
    setPendingMinutes(null);
  }, [addEntry, pendingMinutes, symptom]);

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
        {!isActive && pendingMinutes === null && (
          <div className="space-y-3">
            {todayEntries.length > 0 && (
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-400 mb-1">Today's sessions</p>
                <div className="space-y-1">
                  {todayEntries.map(e => (
                    <div key={e.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{formatDuration(e.durationMinutes)}</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: SEVERITY_LABELS[e.severity].color, backgroundColor: SEVERITY_LABELS[e.severity].color + '20' }}
                      >
                        {SEVERITY_LABELS[e.severity].label}
                      </span>
                    </div>
                  ))}
                </div>
                {todayEntries.length > 1 && (
                  <p className="text-xs text-gray-400 mt-1.5">Total: {formatDuration(totalMinutesToday)}</p>
                )}
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleStart}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white"
              style={{ backgroundColor: symptom.color }}
            >
              <Play size={18} fill="white" />
              {todayEntries.length > 0 ? 'Record Another' : 'Start Recording'}
            </motion.button>
          </div>
        )}

        {isActive && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: '#EF4444' }}
              />
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Recording</span>
            </div>
            <span className="text-5xl font-bold tabular-nums" style={{ color: symptom.color }}>
              {formatElapsed(elapsed)}
            </span>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleStop}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white"
              style={{ backgroundColor: '#1F2937' }}
            >
              <Square size={16} fill="white" />
              Stop
            </motion.button>
          </div>
        )}

        {pendingMinutes !== null && (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-4xl font-bold" style={{ color: symptom.color }}>{formatDuration(pendingMinutes)}</p>
              <p className="text-sm text-gray-500 mt-1">How severe was it?</p>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {([1, 2, 3, 4, 5] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => handleSeverity(sev)}
                  className="py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{ backgroundColor: SEVERITY_LABELS[sev].color + '20', color: SEVERITY_LABELS[sev].color }}
                >
                  {SEVERITY_LABELS[sev].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
        <MiniDots data={dailyData} symptom={symptom} />
      </div>
    </div>
  );
}
