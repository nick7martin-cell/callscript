import { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPTOM_TEMPLATES, SYMPTOM_COLORS, TYPE_LABELS, TYPE_DESCRIPTIONS } from '../constants';
import type { SymptomTemplate } from '../constants';
import type { Symptom, SymptomType } from '../types';

interface Props {
  open: boolean;
  childId: string;
  onClose: () => void;
  onSave: (sym: Omit<Symptom, 'id' | 'order'>) => void;
  editing?: Symptom | null;
}

type Step = 'template' | 'custom';

export function AddSymptomModal({ open, childId, onClose, onSave, editing }: Props) {
  const [step, setStep] = useState<Step>('template');
  const [name, setName] = useState('');
  const [type, setType] = useState<SymptomType>('tally');
  const [emoji, setEmoji] = useState('📊');
  const [color, setColor] = useState(SYMPTOM_COLORS[0]);
  const [higherIsBetter, setHigherIsBetter] = useState(false);

  useEffect(() => {
    if (editing) {
      setStep('custom');
      setName(editing.name);
      setType(editing.type);
      setEmoji(editing.emoji);
      setColor(editing.color);
      setHigherIsBetter(editing.higherIsBetter);
    } else {
      setStep('template');
      setName('');
      setType('tally');
      setEmoji('📊');
      setColor(SYMPTOM_COLORS[0]);
      setHigherIsBetter(false);
    }
  }, [editing, open]);

  const handleTemplate = (t: SymptomTemplate) => {
    setName(t.name);
    setType(t.type);
    setEmoji(t.emoji);
    setColor(t.color);
    setHigherIsBetter(t.higherIsBetter);
    setStep('custom');
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ childId, name: name.trim(), type, emoji, color, higherIsBetter });
    onClose();
  };

  const EMOJIS = ['📊', '😤', '🌊', '🔄', '😰', '😴', '🍽️', '⚡', '🫂', '🎯', '🚽', '🌡️', '🏫', '💊', '🧠', '❤️', '🏃', '🎨', '📝', '⭐'];

  const types: SymptomType[] = ['tally', 'duration', 'scale', 'toggle'];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-lg bg-white rounded-t-3xl pb-10 overflow-hidden"
            style={{ maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-2">
                {step === 'custom' && !editing && (
                  <button
                    onClick={() => setStep('template')}
                    className="text-violet-500 font-medium text-sm"
                  >
                    ← Back
                  </button>
                )}
                <h2 className="text-lg font-bold text-gray-900">
                  {editing ? 'Edit Symptom' : step === 'template' ? 'Add a Symptom' : 'Configure'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              {step === 'template' && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-gray-500 mb-4">Choose a common symptom or create your own.</p>
                  <div className="space-y-2">
                    {SYMPTOM_TEMPLATES.map(t => (
                      <button
                        key={t.name}
                        onClick={() => handleTemplate(t)}
                        className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="text-xl">{t.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                          <p className="text-xs text-gray-500 truncate">{t.description}</p>
                        </div>
                        <span
                          className="flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: t.color + '20', color: t.color }}
                        >
                          {TYPE_LABELS[t.type]}
                        </span>
                        <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                    <button
                      onClick={() => setStep('custom')}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-violet-300 transition-colors text-left"
                    >
                      <span className="text-xl">✨</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-600 text-sm">Custom Symptom</p>
                        <p className="text-xs text-gray-400">Create your own</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              )}

              {step === 'custom' && (
                <div className="px-6 pb-6 space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Emoji</p>
                    <div className="flex flex-wrap gap-2">
                      {EMOJIS.map(e => (
                        <button
                          key={e}
                          onClick={() => setEmoji(e)}
                          className="text-xl w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                          style={emoji === e ? { backgroundColor: color + '20', outline: `2px solid ${color}` } : { backgroundColor: '#F9FAFB' }}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Name</p>
                    <input
                      type="text"
                      placeholder="e.g. Meltdowns, Tics, Anxiety..."
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-base outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tracking Type</p>
                    <div className="grid grid-cols-2 gap-2">
                      {types.map(t => (
                        <button
                          key={t}
                          onClick={() => setType(t)}
                          className="p-3 rounded-xl text-left transition-all"
                          style={
                            type === t
                              ? { backgroundColor: color + '15', outline: `2px solid ${color}` }
                              : { backgroundColor: '#F9FAFB' }
                          }
                        >
                          <p className="font-semibold text-sm text-gray-900">{TYPE_LABELS[t]}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{TYPE_DESCRIPTIONS[t]}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Color</p>
                    <div className="flex gap-2 flex-wrap">
                      {SYMPTOM_COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className="w-8 h-8 rounded-full transition-all"
                          style={{
                            backgroundColor: c,
                            outline: color === c ? `3px solid ${c}` : '3px solid transparent',
                            outlineOffset: '2px',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Trend Direction</p>
                    <div className="flex gap-2">
                      {[false, true].map(val => (
                        <button
                          key={String(val)}
                          onClick={() => setHigherIsBetter(val)}
                          className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                          style={
                            higherIsBetter === val
                              ? { backgroundColor: color + '15', color, outline: `2px solid ${color}` }
                              : { backgroundColor: '#F9FAFB', color: '#9CA3AF' }
                          }
                        >
                          {val ? '↑ Higher is better' : '↓ Lower is better'}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {higherIsBetter ? 'E.g. sleep quality, focus (more = good)' : 'E.g. tics, meltdowns (more = bad)'}
                    </p>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={!name.trim()}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-base disabled:opacity-40 transition-all active:scale-95"
                    style={{ backgroundColor: color }}
                  >
                    {editing ? 'Save Changes' : 'Add Symptom'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
