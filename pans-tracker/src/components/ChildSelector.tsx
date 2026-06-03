import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

interface Props {
  onAddChild: () => void;
}

export function ChildSelector({ onAddChild }: Props) {
  const { children, activeChildId, setActiveChild } = useStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 py-2">
      {children.map(child => {
        const isActive = child.id === activeChildId;
        return (
          <motion.button
            key={child.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveChild(child.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all"
            style={
              isActive
                ? { backgroundColor: '#8B5CF6', color: 'white' }
                : { backgroundColor: '#F3F4F6', color: '#6B7280' }
            }
          >
            <span className="text-base leading-none">{child.emoji}</span>
            <span>{child.name}</span>
          </motion.button>
        );
      })}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onAddChild}
        className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
      >
        <Plus size={16} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}
