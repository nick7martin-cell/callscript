import { Home, BarChart2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

type Tab = 'today' | 'trends' | 'manage';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: 'today', label: 'Today', Icon: Home },
  { id: 'trends', label: 'Trends', Icon: BarChart2 },
  { id: 'manage', label: 'Manage', Icon: Settings },
];

export function BottomNav({ active, onChange }: Props) {
  return (
    <div className="flex-shrink-0 border-t border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="flex">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors"
            >
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  color={isActive ? '#8B5CF6' : '#9CA3AF'}
                />
              </motion.div>
              <span
                className="text-[11px] font-medium transition-colors"
                style={{ color: isActive ? '#8B5CF6' : '#9CA3AF' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
