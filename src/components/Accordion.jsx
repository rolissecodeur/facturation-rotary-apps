// src/components/Accordion.jsx

import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function Accordion({ title, children, startOpen = false }) {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className="w-full rounded-lg border border-green-500 dark:border-green-400 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-between w-full p-4 text-left font-medium
          text-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-slate-200
          hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
      >
        <span className="font-semibold text-lg">{title}</span>
        <div className="text-slate-500">
          {isOpen ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-slate-900 overflow-x-auto">
              {children}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}