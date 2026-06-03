import { useState } from 'react';
import { Trash2, Edit2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { AddChildModal } from '../components/AddChildModal';
import { AddSymptomModal } from '../components/AddSymptomModal';
import type { Child, Symptom } from '../types';
import { TYPE_LABELS } from '../constants';

export function ManagePage() {
  const { children, activeChildId, activeSymptoms, addChild, updateChild, deleteChild, setActiveChild, addSymptom, updateSymptom, deleteSymptom, reorderSymptom } = useStore();
  const [showAddChild, setShowAddChild] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [showAddSymptom, setShowAddSymptom] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);

  const activeChild = children.find(c => c.id === activeChildId);

  const handleDeleteChild = (id: string) => {
    if (confirm('Delete this child and ALL their tracked data? This cannot be undone.')) {
      deleteChild(id);
    }
  };

  const handleDeleteSymptom = (id: string) => {
    if (confirm('Delete this symptom and all its history?')) {
      deleteSymptom(id);
    }
  };

  return (
    <div className="min-h-full pb-4">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage</h1>
        <p className="text-sm text-gray-400 mt-0.5">Children & symptoms</p>
      </div>

      {/* Children section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Children</p>
          <button
            onClick={() => { setEditingChild(null); setShowAddChild(true); }}
            className="flex items-center gap-1 text-violet-500 text-sm font-medium"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {children.map(child => (
            <motion.div
              key={child.id}
              layout
              className="flex items-center gap-3 p-3.5 bg-white rounded-2xl shadow-sm"
            >
              <button
                onClick={() => setActiveChild(child.id)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: child.id === activeChildId ? '#EDE9FE' : '#F3F4F6' }}
                >
                  {child.emoji}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{child.name}</p>
                  <p className="text-xs text-gray-400">
                    {child.id === activeChildId ? '● Active' : 'Tap to select'}
                  </p>
                </div>
              </button>
              <button
                onClick={() => { setEditingChild(child); setShowAddChild(true); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Edit2 size={14} />
              </button>
              {children.length > 1 && (
                <button
                  onClick={() => handleDeleteChild(child.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Symptoms section */}
      {activeChild && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {activeChild.emoji} {activeChild.name}'s Symptoms
            </p>
            <button
              onClick={() => { setEditingSymptom(null); setShowAddSymptom(true); }}
              className="flex items-center gap-1 text-violet-500 text-sm font-medium"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {activeSymptoms.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No symptoms yet</p>
            </div>
          )}

          <div className="space-y-2">
            {activeSymptoms.map((sym, idx) => (
              <motion.div
                key={sym.id}
                layout
                className="flex items-center gap-2 p-3 bg-white rounded-2xl shadow-sm"
              >
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0"
                  style={{ backgroundColor: sym.color }}
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg">{sym.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{sym.name}</p>
                    <span
                      className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: sym.color + '20', color: sym.color }}
                    >
                      {TYPE_LABELS[sym.type]}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => reorderSymptom(sym.childId, sym.id, 'up')}
                    disabled={idx === 0}
                    className="w-6 h-5 flex items-center justify-center text-gray-300 disabled:opacity-30 hover:text-gray-500 transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => reorderSymptom(sym.childId, sym.id, 'down')}
                    disabled={idx === activeSymptoms.length - 1}
                    className="w-6 h-5 flex items-center justify-center text-gray-300 disabled:opacity-30 hover:text-gray-500 transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                <button
                  onClick={() => { setEditingSymptom(sym); setShowAddSymptom(true); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteSymptom(sym.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>

          {activeSymptoms.length > 0 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              Use arrows to reorder · {activeSymptoms.length} symptom{activeSymptoms.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      <AddChildModal
        open={showAddChild}
        onClose={() => { setShowAddChild(false); setEditingChild(null); }}
        onSave={(name, emoji) => {
          if (editingChild) {
            updateChild(editingChild.id, name, emoji);
          } else {
            addChild(name, emoji);
          }
        }}
        editing={editingChild}
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
    </div>
  );
}
