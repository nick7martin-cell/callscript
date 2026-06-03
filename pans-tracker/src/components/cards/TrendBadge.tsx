import type { TrendInfo } from '../../types';

interface Props {
  trend: TrendInfo;
}

export function TrendBadge({ trend }: Props) {
  if (trend.direction === 'none') return null;

  const config = {
    good: { symbol: '↓', color: '#16A34A', bg: '#F0FDF4', label: 'Better' },
    bad: { symbol: '↑', color: '#DC2626', bg: '#FEF2F2', label: 'Worse' },
    stable: { symbol: '→', color: '#D97706', bg: '#FFFBEB', label: 'Stable' },
  }[trend.direction];

  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.symbol} {config.label}
    </span>
  );
}
