import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHILD_EMOJIS } from '../constants';
import type { Child } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, emoji: string) => void;
  editing?: Child | null;
}

export function AddChildModal({ open, onClose, onSave, editing }: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(CHILD_EMOJIS[0]);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setEmoji(editing.emoji);
    } else {
      setName('');
      setEmoji(CHILD_EMOJIS[0]);
    }
  }, [editing, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), emoji);
    onClose();
  };

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
            className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Child' : 'Add a Child'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Choose an avatar
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {CHILD_EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                  style={
                    emoji === e
                      ? { backgroundColor: '#EDE9FE', outline: '2px solid #8B5CF6' }
                      : { backgroundColor: '#F9FAFB' }
                  }
                >
                  {e}
                </button>
              ))}
            </div>

            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Name
            </p>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 text-base outline-none focus:ring-2 focus:ring-violet-300 transition-all mb-4"
              autoFocus
            />

            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-xl bg-violet-500 text-white font-semibold text-base disabled:opacity-40 transition-all active:scale-95"
            >
              {editing ? 'Save Changes' : 'Add Child'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
