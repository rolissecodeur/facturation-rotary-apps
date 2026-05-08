import React from 'react';
import { 
  Pencil, Trash2, MapPin, Shield, 
  Hash, FileStack, Mail
} from "lucide-react";
import { StatusBadge } from "../badge";
import { usePermissions } from "../../../hooks/usePermissions";

export default function ClubTable({ clubsList = [], onEdit, onDelete }) {
  const { can } = usePermissions();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#2d3436] dark:bg-gray-900 text-nowrap">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Club Rotary</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Factures</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Impayées</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Payées</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">En cours</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Annulées</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right">Solde Dû</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {clubsList.map((club) => {
              // Extraction des stats depuis l'objet meta renvoyé par le back
              const meta = club.meta || {};
              const solde = Number(meta.solde_restant || 0);

              return (
                <tr key={club.id} className="transition-colors group bg-white odd:bg-white even:bg-slate-50/30 dark:odd:bg-gray-800 dark:even:bg-gray-900/30 hover:bg-orange-50/30 align-middle">
                

                <td className="px-6 py-4">
  <div className="flex items-start gap-2.5 ">
    {/* Icône principale réduite */}
    <div className="mt-0.5 w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-[#f97316] flex items-center justify-center shrink-0">
      <Shield size={14} strokeWidth={2.5} />
    </div>

    <div className="flex flex-col min-w-0 leading-tight">
      {/* 1. NOM DU CLUB */}
      <span className="text-[11px] font-black text-slate-700 dark:text-white uppercase ">
        {club?.name || "---"}
      </span>
      
      {/* 2. ADRESSE (Plus fine) */}
      <div className="flex items-center gap-1 text-slate-400 mt-0.5 ">
        <MapPin size={10} className="shrink-0 text-slate-300" />
        <span className="text-[9px] font-bold uppercase tracking-tighter ">
          {club?.address || "Adresse N/A"}
        </span>
      </div>

      {/* 3. EMAILS (Groupés sur une ligne) */}
      <div className="flex items-center gap-1 text-slate-400  mt-0.5">
        <Mail size={10} className="shrink-0 text-[#f97316]/50" />
        <div className="flex items-center divide-x divide-slate-200 dark:divide-slate-800 gap-1.5 overflow-hidden">
          <span className="text-[9px] lowercase ">{club?.email}</span>
          {club?.emailEnCopy && (
            <span className="pl-1.5 text-[9px] lowercase font-semibold italic">
              cc : {club.emailEnCopy}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
</td>

                  {/* TOTAL FACTURES */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-gray-700 rounded-lg border border-slate-200 dark:border-gray-600">
                        <FileStack size={12} className="text-slate-500" />
                        <span className="text-xs font-black text-slate-700 dark:text-white">
                            {meta.total_factures || 0}
                        </span>
                    </div>
                  </td>

                  {/* STATUTS DÉTAILLÉS */}
                  <td className="px-6 py-4 text-center font-black text-red-500 text-xs">
                    {meta.impaye_count || 0}
                  </td>

                  <td className="px-6 py-4 text-center font-black text-green-600 text-xs">
                    {meta.paye_count || 0}
                  </td>

                  <td className="px-6 py-4 text-center font-black text-blue-500 text-xs">
                    {meta.encours_count || 0}
                  </td>

                  <td className="px-6 py-4 text-center font-black text-slate-400 text-xs">
                    {meta.annule_count || 0}
                  </td>

                  {/* SOLDE FINANCIER */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-[13px] font-black ${solde > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {new Intl.NumberFormat('fr-FR').format(solde)} F
                      </span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reste à recouvrer</span>
                    </div>
                  </td>

                  {/* ACTIONS VIVES */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {can('updateClub') && (
                        <button 
                          onClick={() => onEdit(club)} 
                          className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-[#2d3436] text-[#2d3436] dark:border-white dark:text-white hover:bg-[#2d3436] hover:text-white dark:hover:bg-white dark:hover:text-[#2d3436] transition-all active:scale-95 shadow-sm"
                          title="Modifier"
                        >
                          <Pencil size={13} strokeWidth={2.5} />
                        </button>
                      )}
                      
                      {can('deleteClub') && (
                        <button 
                          onClick={() => onDelete(club)} 
                          className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
                          title="Supprimer"
                        >
                          <Trash2 size={13} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* FOOTER */}
      <div className="bg-[#2d3436] dark:bg-gray-900/80 p-3 flex justify-center border-t border-white/5">
         <div className="flex items-center gap-2 opacity-40">
            <Hash size={12} className="text-white" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Registre Financier des Clubs • Rotary Hub</span>
         </div>
      </div>
    </div>
  );
}