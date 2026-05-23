import type { DailyDataPoint, Symptom } from '../../types';
import { hexWithAlpha } from '../../utils';

interface Props {
  data: DailyDataPoint[];
  symptom: Symptom;
}

export function MiniDots({ data, symptom }: Props) {
  const last7 = data.slice(-7);
  const maxVal = Math.max(...last7.map(d => d.value), 1);

  return (
    <div className="flex items-center gap-1">
      {last7.map((d, i) => {
        if (!d.hasData) {
          return (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2"
              style={{ borderColor: '#E5E7EB', backgroundColor: 'transparent' }}
            />
          );
        }

        let alpha = 0.3;
        if (symptom.type === 'tally' || symptom.type === 'duration') {
          alpha = 0.3 + (d.value / maxVal) * 0.7;
        } else if (symptom.type === 'scale') {
          alpha = 0.3 + (d.value / 10) * 0.7;
        } else if (symptom.type === 'toggle') {
          alpha = d.value === 1 ? 0.85 : 0.25;
        }

        return (
          <div
            key={i}
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: hexWithAlpha(symptom.color, alpha) }}
          />
        );
      })}
      <span className="text-[10px] text-gray-400 ml-1">7d</span>
    </div>
  );
}
