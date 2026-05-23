import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StoreProvider, useStore } from './store';
import { BottomNav } from './components/BottomNav';
import { TodayPage } from './pages/TodayPage';
import { TrendsPage } from './pages/TrendsPage';
import { ManagePage } from './pages/ManagePage';
import { AddChildModal } from './components/AddChildModal';

type Tab = 'today' | 'trends' | 'manage';

function AppInner() {
  const [tab, setTab] = useState<Tab>('today');
  const { children, addChild } = useStore();

  if (children.length === 0) {
    return <Onboarding onAdd={addChild} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-[#FAFAF9] overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {tab === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <TodayPage />
            </motion.div>
          )}
          {tab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <TrendsPage />
            </motion.div>
          )}
          {tab === 'manage' && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <ManagePage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

function Onboarding({ onAdd }: { onAdd: (name: string, emoji: string) => void }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#FAFAF9]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-7xl mb-5 inline-block"
          >
            🌿
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Bloom</h1>
          <p className="text-gray-500 leading-relaxed">
            A gentle symptom tracker for<br />PANS & PANDAS families
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Get started</p>
          <p className="text-gray-500 text-sm mb-4">Add your first child to begin tracking.</p>
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3.5 rounded-xl bg-violet-500 text-white font-semibold text-base transition-all active:scale-95 hover:bg-violet-600"
          >
            Add a Child →
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            All data stays on your device.<br />Nothing is ever shared or uploaded.
          </p>
        </div>
      </motion.div>

      <AddChildModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={(name, emoji) => onAdd(name, emoji)}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
