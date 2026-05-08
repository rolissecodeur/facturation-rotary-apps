// src/pages/DashboardPage.jsx
import React, { useEffect, useContext } from "react";
import { 
  Users, Building2, Wallet, Loader2, ServerCrash, 
  BarChart3, TrendingUp, Zap, FileStack, Activity 
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import { SocketContext } from "../contexts/socket";
import { useFetchDashboard } from "../services/data/useFetchDashboard";
import { useFetchActivite } from "../services/data/useFetchActivite";
import RapportStatistics from "../components/dashboard/RapportStatistics";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import clsx from "clsx";

export default function DashboardPage() {
  const socket = useContext(SocketContext);
  const queryClient = useQueryClient();
  const { data: stats, isLoading, isError, error } = useFetchDashboard();
  const { data: activite, isLoading: isLoadingActivite } = useFetchActivite();

  useEffect(() => {
    if (!socket) return;
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["activite"] });
    };
    const events = ["user_created", "club_created", "facture_created", "reglement_created", "audit_update"];
    events.forEach(ev => socket.on(ev, refresh));
    return () => events.forEach(ev => socket.off(ev));
  }, [socket, queryClient]);

  if (isLoading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-[#f97316]" />
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Chargement des données...</p>
    </div>
  );

  if (isError) return (
    <div className="py-20 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-[3rem] border border-red-100 mx-4 font-black uppercase text-[10px]">
      <ServerCrash size={48} className="mx-auto mb-4 opacity-50" />
      {error?.message || "Erreur de connexion"}
    </div>
  );

  if (!stats) return null;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700 p-4 md:p-0">
      
      {/* ─── HEADER PREMIUM ─── */}
      <div className="relative w-full p-8 bg-slate-50 dark:bg-gray-900/50 rounded-[3rem] border border-white dark:border-gray-800 shadow-inner mb-2 overflow-hidden">
        <BarChart3 size={120} className="absolute -right-8 -top-8 text-[#f97316]/10 -rotate-12 pointer-events-none" />
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
              Hub & <span className="text-[#f97316]">Analytique</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-[#f97316]"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vue globale de la performance</p>
            </div>
          </div>
          <button className="w-14 h-14 bg-[#2d3436] text-white rounded-full flex items-center justify-center shadow-xl shadow-gray-500/20 hover:bg-[#f97316] transition-all active:scale-95">
            <Zap size={28} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ─── SECTION UNIFIÉE : FINANCES + CARTES (ALIGNÉES SUR UNE LIGNE) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-4">
        
        {/* Bilan Financier (Prend 4 colonnes sur 12) */}
        <div className="xl:col-span-4 bg-[#2d3436] rounded-[2.5rem] p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-xl">
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-orange-400/80 mb-2">
                    <Wallet size={14} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Facturation Globale</span>
                </div>
                <p className="text-3xl font-[1000] tracking-tighter leading-none mb-4">
                    {new Intl.NumberFormat('fr-FR').format(stats.finances.totalFacture)} <span className="text-xs text-white/20">F</span>
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border-l-2 border-green-500/30 pl-3">
                        <span className="block text-[8px] font-black uppercase text-green-400 opacity-70">Encaissé</span>
                        <p className="text-lg font-black text-green-400 leading-none">{new Intl.NumberFormat('fr-FR').format(stats.finances.totalEncaisse)}</p>
                    </div>
                    <div className="border-l-2 border-red-500/30 pl-3">
                        <span className="block text-[8px] font-black uppercase text-red-400 opacity-70">Solde Dû</span>
                        <p className="text-lg font-black text-red-500 leading-none">{new Intl.NumberFormat('fr-FR').format(stats.finances.resteAPayer)}</p>
                    </div>
                </div>
            </div>
            <div className="relative z-10 mt-4">
                <div className="flex justify-between text-[8px] font-black uppercase mb-1.5 opacity-50">
                    <span>Recouvrement</span>
                    <span>{stats.finances.tauxRecouvrement}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stats.finances.tauxRecouvrement}%` }} className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                </div>
            </div>
        </div>

        {/* Jauge Circulaire (Prend 2 colonnes sur 12) */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] p-4 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center shadow-sm">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="62" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-gray-700" />
                    <circle cx="70" cy="70" r="62" fill="none" stroke="#f97316" strokeWidth="12" strokeDasharray="389.5" strokeDashoffset={389.5 - (389.5 * Number(stats.finances.tauxRecouvrement)) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                    <span className="text-xl font-black dark:text-white">{Math.round(stats.finances.tauxRecouvrement)}%</span>
                    <span className="text-[7px] font-black text-slate-400 uppercase mt-1">Cible</span>
                </div>
            </div>
        </div>

        {/* Clubs (Prend 2 colonnes sur 12) */}
        <div className="xl:col-span-2">
            <EntitySummary title="Clubs" stats={stats.clubs} icon={Building2} accent="bg-[#f97316]" />
        </div>

        {/* Utilisateurs (Prend 2 colonnes sur 12) */}
        <div className="xl:col-span-2">
            <EntitySummary title="Users" stats={stats.users} icon={Users} accent="bg-slate-800" />
        </div>

        {/* Factures (Prend 2 colonnes sur 12) */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600"><FileStack size={16} /></div>
                <div><h3 className="text-sm font-black dark:text-white leading-none">{stats.factures.quantites.total}</h3><span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Factures</span></div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
                <StatusIndicator label="Payées" value={stats.factures.parStatut.paye} color="text-green-500" />
                <StatusIndicator label="En cours" value={stats.factures.parStatut.enCours} color="text-blue-500" />
                <StatusIndicator label="Dues" value={stats.factures.parStatut.impaye} color="text-red-500" />
                <StatusIndicator label="Annulées" value={stats.factures.parStatut.annule} color="text-slate-400" />
            </div>
        </div>

      </div>

      {/* ─── SECTION 3 : ANALYTIQUE & ACTIVITÉ (MIXTE) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg"><TrendingUp size={20} /></div>
                <div>
                    <h2 className="text-base font-black uppercase tracking-tight dark:text-white leading-none">Courbes de tendance</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Analyse comparative des statuts</p>
                </div>
            </div>
            <RapportStatistics data={stats.factures.parStatut} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20"><Activity size={20} /></div>
                <div>
                    <h2 className="text-base font-black uppercase tracking-tight dark:text-white leading-none">Activités</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Flux d'audit temps réel</p>
                </div>
            </div>
            <RecentActivityFeed activities={activite} isLoading={isLoadingActivite} />
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
const EntitySummary = ({ title, stats, icon: Icon, accent }) => (
    <div className="h-full bg-white dark:bg-gray-800 p-4 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex flex-col justify-between shadow-sm transition-all hover:border-[#f97316]/30">
        <div className="flex items-center gap-3">
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-white", accent)}><Icon size={20} /></div>
            <div><h3 className="text-lg font-black dark:text-white leading-none">{stats.total}</h3><span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1 block">{title}</span></div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-50 dark:border-white/5 flex justify-between items-center">
            <span className="text-[8px] font-black text-green-500 uppercase">{stats.actif} Actifs</span>
            <span className="text-[8px] font-black text-red-400 uppercase">{stats.inactif} Inactifs</span>
        </div>
    </div>
);

const StatusIndicator = ({ label, value, color }) => (
    <div className="bg-slate-50 dark:bg-white/5 p-1.5 rounded-xl flex flex-col items-center border border-slate-100 dark:border-white/5">
        <span className={clsx("text-xs font-black leading-none", color)}>{value}</span>
        <span className="text-[7px] font-black uppercase text-slate-500 mt-1">{label}</span>
    </div>
);