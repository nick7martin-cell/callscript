import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useStore } from '../store';
import { ChildSelector } from '../components/ChildSelector';
import { AddChildModal } from '../components/AddChildModal';
import { AddSymptomModal } from '../components/AddSymptomModal';
import { TallyCard } from '../components/cards/TallyCard';
import { DurationCard } from '../components/cards/DurationCard';
import { ScaleCard } from '../components/cards/ScaleCard';
import { ToggleCard } from '../components/cards/ToggleCard';
import type { Symptom } from '../types';

export function TodayPage() {
  const { children, activeChildId, activeSymptoms, addChild, addSymptom, updateSymptom, deleteSymptom } = useStore();
  const [showAddChild, setShowAddChild] = useState(false);
  const [showAddSymptom, setShowAddSymptom] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);

  const activeChild = children.find(c => c.id === activeChildId);
  const today = new Date();

  const handleEditSymptom = (sym: Symptom) => {
    setEditingSymptom(sym);
    setShowAddSymptom(true);
  };

  const handleDeleteSymptom = (id: string) => {
    if (confirm('Delete this symptom and all its history?')) {
      deleteSymptom(id);
    }
  };

  return (
    <div className="min-h-full pb-4">
      <div className="sticky top-0 z-10 bg-[#FAFAF9]/95 backdrop-blur-sm">
        <div className="px-4 pt-12 pb-2">
          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Today</h1>
              <p className="text-sm text-gray-400 mt-0.5">{format(today, 'EEEE, MMMM d')}</p>
            </div>
            {activeChild && (
              <span className="text-sm text-gray-500">
                {activeChild.emoji} {activeChild.name}
              </span>
            )}
          </div>
        </div>
        <ChildSelector onAddChild={() => setShowAddChild(true)} />
      </div>

      <div className="px-4 pt-3 space-y-3">
        <AnimatePresence initial={false}>
          {activeSymptoms.map(sym => (
            <motion.div
              key={sym.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {sym.type === 'tally' && (
                <TallyCard symptom={sym} onEdit={() => handleEditSymptom(sym)} />
              )}
              {sym.type === 'duration' && (
                <DurationCard symptom={sym} onEdit={() => handleEditSymptom(sym)} />
              )}
              {sym.type === 'scale' && (
                <ScaleCard symptom={sym} onEdit={() => handleEditSymptom(sym)} />
              )}
              {sym.type === 'toggle' && (
                <ToggleCard symptom={sym} onEdit={() => handleEditSymptom(sym)} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {activeSymptoms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🌱</div>
            <p className="text-gray-500 font-medium">No symptoms tracked yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first symptom below</p>
          </motion.div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditingSymptom(null); setShowAddSymptom(true); }}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-violet-300 flex items-center justify-center gap-2 text-gray-400 hover:text-violet-500 transition-all"
        >
          <Plus size={18} />
          <span className="font-medium text-sm">Add Symptom</span>
        </motion.button>
      </div>

      <AddChildModal
        open={showAddChild}
        onClose={() => setShowAddChild(false)}
        onSave={(name, emoji) => addChild(name, emoji)}
      />

      <AddSymptomModal
        open={showAddSymptom}
        childId={activeChildId ?? ''}
        onClose={() => { setShowAddSymptom(false); setEditingSymptom(null); }}
        onSave={sym => {
          if (editingSymptom) {
            updateSymptom(editingSymptom.id, sym);
          } else {
            addSymptom(sym);
          }
        }}
        editing={editingSymptom}
      />

      {/* Inline edit menu — shown as a bottom sheet when ••• is tapped */}
      {editingSymptom && !showAddSymptom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/20"
          onClick={() => setEditingSymptom(null)}
        >
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            className="w-full max-w-lg bg-white rounded-t-2xl pb-10 p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{editingSymptom.emoji}</span>
              <span className="font-semibold text-gray-900">{editingSymptom.name}</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setShowAddSymptom(true); }}
                className="w-full py-3 rounded-xl bg-gray-50 text-gray-700 font-medium text-sm text-left px-4"
              >
                ✏️ Edit symptom
              </button>
              <button
                onClick={() => { setEditingSymptom(null); handleDeleteSymptom(editingSymptom.id); }}
                className="w-full py-3 rounded-xl bg-red-50 text-red-500 font-medium text-sm text-left px-4"
              >
                🗑️ Delete symptom & history
              </button>
              <button
                onClick={() => setEditingSymptom(null)}
                className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
