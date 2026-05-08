// src/components/dashboard/factures/FactureTable.jsx
import React from 'react';
import { Pencil, Trash2, Shield, Clock, CheckCircle2, XCircle, Activity, Coins, MapPin, Mail } from "lucide-react";
import { FormattedDate } from "../../FormattedDate";

export default function FactureTable({ facturesList = [], onEdit, onDelete, onOpenReglements, onOpenMail }) {
  
  const getStatusStyle = (status) => {
    switch (status) {
      case 'paye': return { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2, label: 'Payée' };
      case 'en_cours': return { color: 'text-blue-600', bg: 'bg-blue-50', icon: Activity, label: 'En cours' };
      case 'annule': return { color: 'text-slate-500', bg: 'bg-slate-100', icon: XCircle, label: 'Annulée' };
      default: return { color: 'text-red-600', bg: 'bg-red-50', icon: Clock, label: 'Impayée' };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#2d3436] dark:bg-gray-900 text-nowrap">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Référence</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Club Rotary</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Notification</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right">Montant</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right">Payé</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right">Solde</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">État</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {facturesList.map((f) => {
              const totalPaye = Number(f.meta?.total_paye || 0);
              const reste = f.montant - totalPaye;
              const s = getStatusStyle(f.status);

              return (
                <tr key={f.id} className="transition-colors group bg-white odd:bg-white even:bg-slate-50/30 dark:odd:bg-gray-800 dark:even:bg-gray-900/30 hover:bg-orange-50/10 align-middle">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">{f.reference}</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase"><FormattedDate createdAt={f.dates} /></span>
                    </div>
                  </td>

                                   <td className="px-6 py-4">
  <div className="flex items-start gap-2.5 ">
    {/* Icône principale réduite */}
    <div className="mt-0.5 w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#f97316] flex items-center justify-center shrink-0">
      <Shield size={14} strokeWidth={2.5} />
    </div>

    <div className="flex flex-col min-w-0 leading-tight">
      {/* 1. NOM DU CLUB */}
      <span className="text-[11px] font-black text-slate-700 dark:text-white uppercase ">
        {f?.club?.name || "---"}
      </span>
      
      {/* 2. ADRESSE (Plus fine) */}
      <div className="flex items-center gap-1 text-slate-400 mt-0.5 ">
        <MapPin size={10} className="shrink-0 text-slate-300" />
        <span className="text-[9px] font-bold uppercase tracking-tighter ">
          {f?.club?.address || "Adresse N/A"}
        </span>
      </div>

      {/* 3. EMAILS (Groupés sur une ligne) */}
      <div className="flex items-center gap-1 text-slate-400  mt-0.5">
        <Mail size={10} className="shrink-0 text-[#f97316]/50" />
        <div className="flex items-center divide-x divide-slate-200 dark:divide-slate-800 gap-1.5 overflow-hidden">
          <span className="text-[9px] lowercase ">{f?.club?.email}</span>
          {f?.club?.emailEnCopy && (
            <span className="pl-1.5 text-[9px] lowercase font-semibold italic">
              cc : {f?.club.emailEnCopy}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
</td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      {f?.statutMail ? (
                        <div className="flex flex-col items-center gap-0.5 text-green-500">
                            <CheckCircle2 size={16} strokeWidth={3} />
                            <span className="text-[7px] font-black uppercase">Envoyé</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-0.5 text-slate-300">
                            <XCircle size={16} strokeWidth={2} />
                            <span className="text-[7px] font-black uppercase">Non transmis</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-black text-xs">{new Intl.NumberFormat().format(f.montant)} F</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-black text-green-600">{new Intl.NumberFormat().format(totalPaye)} F</span>
                      <div className="w-12 h-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${f.montant > 0 ? (totalPaye/f.montant)*100 : 0}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-xs text-red-500">{new Intl.NumberFormat().format(reste)} F</td>

                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${s.bg} ${s.color}`}>
                       <s.icon size={10} strokeWidth={3} />
                       <span className="text-[8px] font-black uppercase">{s.label}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {/* BOUTON MAIL */}
                      <button onClick={() => onOpenMail(f)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-sm" title="Envoyer par mail"><Mail size={14} /></button>
                      <button onClick={() => onOpenReglements(f)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all active:scale-90 shadow-sm" title="Règlements"><Coins size={14} /></button>
                      <button onClick={() => onEdit(f)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#2d3436] text-[#2d3436] dark:border-white dark:text-white hover:bg-[#2d3436] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"><Pencil size={12} strokeWidth={2.5}/></button>
                      <button onClick={() => onDelete(f)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"><Trash2 size={12} strokeWidth={2.5}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}