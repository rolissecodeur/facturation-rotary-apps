// src/components/dashboard/RecentActivityFeed.jsx
import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const actionLabels = {
  create: { label: "ajouté", color: "text-green-600" },
  update: { label: "modifié", color: "text-blue-600" },
  delete: { label: "supprimé", color: "text-red-600" },
};

export default function RecentActivityFeed({ activities, isLoading }) {
  if (isLoading) return <div className="p-4 text-[9px] font-black uppercase text-slate-400 animate-pulse">Chargement...</div>;
  if (!activities?.length) return <div className="p-4 text-[9px] font-black uppercase text-slate-400">Aucun historique</div>;

  return (
    <div className="flex flex-col gap-1">
      {activities.map((item) => (
        <ActivityItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function ActivityItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const action = actionLabels[item.event] || actionLabels.update;

  // Fonction pour extraire uniquement ce qui a changé
  const getChanges = () => {
    if (!item.changes.before || !item.changes.after) return null;
    const diff = [];
    const before = item.changes.before;
    const after = item.changes.after;

    Object.keys(after).forEach((key) => {
      // On ignore les champs techniques
      if (['updatedAt', 'updated_at', 'createdAt', 'created_at', 'meta'].includes(key)) return;
      
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        diff.push({ 
            field: key, 
            old: before[key] ?? 'vide', 
            new: after[key] ?? 'vide' 
        });
      }
    });
    return diff;
  };

  const changes = getChanges();

  return (
    <div className="border-b border-slate-50 dark:border-white/5 last:border-0">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors px-1 rounded-lg"
      >
        <div className="text-[10px] flex-1 truncate pr-2">
          <span className="font-bold text-slate-900 dark:text-slate-200">{item.user}</span>
          <span className={`mx-1 font-medium ${action.color}`}>{action.label}</span>
          <span className="text-slate-500">{item.entity} <span className="font-bold">#{item.entityId}</span></span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] text-slate-400 font-medium">
            {formatDistanceToNow(new Date(item.date), { locale: fr })}
          </span>
          {changes?.length > 0 && (
            isOpen ? <ChevronUp size={12} className="text-slate-300" /> : <ChevronDown size={12} className="text-slate-300" />
          )}
        </div>
      </div>

      {/* DETAIL DES MODIFICATIONS */}
      <AnimatePresence>
        {isOpen && changes && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50 dark:bg-white/5 rounded-md mb-2"
          >
            <div className="p-2 space-y-1">
              {changes.map((chg, i) => (
                <div key={i} className="text-[9px] grid grid-cols-7 gap-1 items-start">
                  <span className="col-span-2 font-black uppercase text-slate-400 tracking-tighter">{chg.field}</span>
                  <div className="col-span-5 flex items-center gap-1 flex-wrap">
                    <span className="text-red-400 line-through truncate max-w-[80px]">{String(chg.old)}</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-green-500 font-bold">{String(chg.new)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}