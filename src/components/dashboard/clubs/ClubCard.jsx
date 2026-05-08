import React from "react";
import {
  Pencil,
  Trash2,
  MapPin,
  AlignLeft,
  FileText,
  ArrowUpRight,
  Building2,
  Coins,
  CheckCircle2,
  Clock,
  Wallet
} from "lucide-react";
import { StatusBadge } from "../badge";
import { usePermissions } from "../../../hooks/usePermissions";

export default function ClubCard({ club, onEdit, onDelete }) {
  const { can } = usePermissions();

  // Extraction des données depuis le "meta" du backend
  const meta = club.meta || {};
  const totalBilled = Number(meta.montant_total_facture || 0);
  const soldeDû = Number(meta.solde_restant || 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.2rem] border border-slate-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group">

      {/* ─── HEADER ─── */}
      <div className="p-5 pb-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[8px] font-black">
            #{club.id}
          </div>
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
            Registre Club
          </span>
        </div>
        <StatusBadge status={club.status} />
      </div>

      <div className="p-6 pt-3 flex-grow">

        {/* ─── TITRE & ADRESSE ─── */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="shrink-0 p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#f97316] border border-orange-100 dark:border-orange-900/30">
              <Building2 size={18} />
            </div>
            <h3 className="text-base font-black text-slate-800 dark:text-white uppercase leading-tight mt-1">
              {club.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 ml-1 text-slate-400">
            <MapPin size={12} />
            <span className="text-[10px] font-bold uppercase truncate">
              {club.address || "Localisation non définie"}
            </span>
          </div>
        </div>

        {/* ─── MINI DASHBOARD DES STATUTS ─── */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="flex flex-col items-center p-2 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20">
            <span className="text-xs font-black text-green-600">{meta.paye_count || 0}</span>
            <span className="text-[6px] font-bold text-green-600/60 uppercase">Payées</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20">
            <span className="text-xs font-black text-blue-600">{meta.encours_count || 0}</span>
            <span className="text-[6px] font-bold text-blue-600/60 uppercase">En cours</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20">
            <span className="text-xs font-black text-red-500">{meta.impaye_count || 0}</span>
            <span className="text-[6px] font-bold text-red-500/60 uppercase">Impayées</span>
          </div>
        </div>

        {/* ─── BILAN FINANCIER ─── */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between px-1">
             <div className="flex items-center gap-2">
                <Wallet size={14} className="text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Facturé</span>
             </div>
             <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                {new Intl.NumberFormat('fr-FR').format(totalBilled)} F
             </span>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-red-500">
                    <Coins size={16} />
                </div>
                <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Solde restant</span>
             </div>
             <span className="text-sm font-black text-red-600">
                {new Intl.NumberFormat('fr-FR').format(soldeDû)} F
             </span>
          </div>
        </div>

        {/* ─── DESCRIPTION ─── */}
        <div className="px-1">
          <div className="flex items-center gap-1.5 mb-1 text-slate-400">
            <AlignLeft size={10} />
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">Note de club</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-gray-400 leading-snug line-clamp-2 italic">
            {club.description || "Aucune description renseignée."}
          </p>
        </div>

      </div>

      {/* ─── FOOTER ACTIONS ─── */}
      <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        
        <div className="flex items-center gap-2 text-[#f97316]">
            <FileText size={14} />
            <span className="text-[10px] font-black uppercase">{meta.total_factures || 0} Docs</span>
        </div>

        <div className="flex gap-2">
          {can("updateClub") && (
            <button
              onClick={() => onEdit(club)}
              className="w-9 h-9 rounded-xl border-2 border-[#2d3436] text-[#2d3436] dark:border-white dark:text-white flex items-center justify-center transition-all hover:bg-[#2d3436] hover:text-white dark:hover:bg-white dark:hover:text-[#2d3436] active:scale-90 shadow-sm"
            >
              <Pencil size={14} strokeWidth={2.5} />
            </button>
          )}

          {can("deleteClub") && (
            <button
              onClick={() => onDelete(club)}
              className="w-9 h-9 rounded-xl border-2 border-red-500 text-red-500 flex items-center justify-center transition-all hover:bg-red-500 hover:text-white active:scale-90 shadow-sm"
            >
              <Trash2 size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}