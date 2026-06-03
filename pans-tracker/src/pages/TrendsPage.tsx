import { useState } from 'react';
import { format } from 'date-fns';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { useStore } from '../store';
import { ChildSelector } from '../components/ChildSelector';
import { AddChildModal } from '../components/AddChildModal';
import { getDailyData, getTrend, formatDuration } from '../utils';
import { TrendBadge } from '../components/cards/TrendBadge';
import type { Symptom } from '../types';

type Range = 7 | 14 | 30;

export function TrendsPage() {
  const { children, entries, activeChildId, activeSymptoms, addChild } = useStore();
  const [range, setRange] = useState<Range>(14);
  const [showAddChild, setShowAddChild] = useState(false);

  const activeChild = children.find(c => c.id === activeChildId);

  return (
    <div className="min-h-full pb-4">
      <div className="sticky top-0 z-10 bg-[#FAFAF9]/95 backdrop-blur-sm">
        <div className="px-4 pt-12 pb-2">
          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trends</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {activeChild ? `${activeChild.emoji} ${activeChild.name}` : 'Select a child'}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              {([7, 14, 30] as Range[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={
                    range === r
                      ? { backgroundColor: 'white', color: '#8B5CF6', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                      : { color: '#9CA3AF' }
                  }
                >
                  {r}d
                </button>
              ))}
            </div>
          </div>
        </div>
        <ChildSelector onAddChild={() => setShowAddChild(true)} />
      </div>

      <div className="px-4 pt-3 space-y-4">
        {activeSymptoms.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-gray-500 font-medium">No symptoms to show</p>
            <p className="text-gray-400 text-sm mt-1">Add symptoms in Today to see trends</p>
          </div>
        )}

        {activeSymptoms.map(sym => (
          <TrendCard key={sym.id} symptom={sym} entries={entries} range={range} />
        ))}
      </div>

      <AddChildModal
        open={showAddChild}
        onClose={() => setShowAddChild(false)}
        onSave={(name, emoji) => addChild(name, emoji)}
      />
    </div>
  );
}

function TrendCard({ symptom, entries, range }: { symptom: Symptom; entries: ReturnType<typeof useStore>['entries']; range: Range }) {
  const data = getDailyData(entries, symptom, range);
  const trend = getTrend(entries, symptom);

  const chartData = data.map(d => ({
    date: format(new Date(d.date + 'T00:00:00'), range === 7 ? 'EEE' : 'M/d'),
    value: d.hasData ? d.value : null,
    hasData: d.hasData,
  }));

  const hasAnyData = data.some(d => d.hasData);
  const daysWithData = data.filter(d => d.hasData).length;
  const avg = hasAnyData
    ? data.filter(d => d.hasData).reduce((s, d) => s + d.value, 0) / daysWithData
    : null;

  const formatValue = (v: number) => {
    if (symptom.type === 'duration') return formatDuration(Math.round(v));
    if (symptom.type === 'scale') return v.toFixed(1);
    if (symptom.type === 'toggle') return `${Math.round(v * 100)}%`;
    return Math.round(v).toString();
  };

  const yLabel = {
    tally: 'occurrences',
    duration: 'minutes',
    scale: '/ 10',
    toggle: 'occurred',
  }[symptom.type];

  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
      style={{ borderLeft: `4px solid ${symptom.color}` }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{symptom.emoji}</span>
          <span className="font-semibold text-gray-900">{symptom.name}</span>
        </div>
        <TrendBadge trend={trend} />
      </div>

      {hasAnyData ? (
        <>
          <div className="px-4 pb-2 flex gap-6">
            {avg !== null && (
              <div>
                <p className="text-xs text-gray-400">Avg ({range}d)</p>
                <p className="text-xl font-bold" style={{ color: symptom.color }}>
                  {formatValue(avg)} <span className="text-xs font-normal text-gray-400">{yLabel}</span>
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400">Days logged</p>
              <p className="text-xl font-bold text-gray-700">
                {daysWithData}<span className="text-xs font-normal text-gray-400">/{range}</span>
              </p>
            </div>
          </div>

          <div style={{ height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 16, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${symptom.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor={symptom.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={symptom.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  interval={range === 7 ? 0 : range === 14 ? 1 : 4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  tickCount={4}
                  domain={symptom.type === 'toggle' ? [0, 1] : ['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    border: 'none',
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    fontSize: 12,
                    fontFamily: 'Inter, sans-serif',
                  }}
                  formatter={(val) => {
                    const n = Number(val);
                    return [symptom.type === 'duration' ? formatDuration(Math.round(n)) : n, symptom.name] as [string | number, string];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={symptom.color}
                  strokeWidth={2.5}
                  fill={`url(#grad-${symptom.id})`}
                  dot={{ fill: symptom.color, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: symptom.color }}
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="px-4 pb-6 pt-2 text-center">
          <p className="text-gray-400 text-sm">No data in the last {range} days</p>
          <p className="text-gray-300 text-xs mt-1">Start tracking in Today</p>
        </div>
      )}
    </div>
  );
}
