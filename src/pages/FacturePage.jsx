// src/pages/FacturePage.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Loader2, ServerCrash, FileText, 
  Filter, ArrowRight, Coins, Calculator, X, Calendar, Check
} from "lucide-react";
import Pagination from "../components/dashboard/Pagination";
import NoData from "../components/NoData";
import WelcomeModal from "../components/WelcomeModal";
import FactureTable from "../components/dashboard/factures/FactureTable";
import FactureForm from "../components/dashboard/factures/FactureForm";
import DeleteFacture from "../components/dashboard/factures/DeleteFacture";
import ReglementManager from "../components/dashboard/factures/ReglementManager";
import MailManager from "../components/dashboard/factures/MailManager";
import SearchableClubSelect from "../components/SearchableClubSelect";
import { useFetchFacture } from "../services/data/useFetchFacture";
import { useQueryClient } from "@tanstack/react-query";
import { SocketContext } from "../contexts/socket";
import { usePermissions } from "../hooks/usePermissions";
import { useToasts } from "../hooks/useToasts";
import clsx from "clsx";

export default function FacturePage() {
  const { showWarning } = useToasts();
  const queryClient = useQueryClient();
  const socket = useContext(SocketContext);
  const { can } = usePermissions();

  // États des Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReglementModal, setShowReglementModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  
  const [currentFacture, setCurrentFacture] = useState(null);

  // États des Filtres
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [clubId, setClubId] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  // États temporaires pour le filtre période
  const [tempDateDebut, setTempDateDebut] = useState("");
  const [tempDateFin, setTempDateFin] = useState("");

  const { data, isLoading } = useFetchFacture({ 
    page, perPage, keyword: searchTerm, status: statusFilter, clubId, dateDebut, dateFin
  });

  const facturesList = data?.factures?.data || [];
  const meta = data?.factures?.meta || { current_page: 1, last_page: 1 };
  const globalStats = data?.stats || { totalGlobalFacture: 0, totalGlobalPaye: 0, soldeRestant: 0 };

  // --- HANDLERS ---
  const handleEdit = (facture) => {
    setCurrentFacture(facture);
    setShowFormModal(true);
  };

  const handleDelete = (facture) => {
    setCurrentFacture(facture);
    setShowDeleteModal(true);
  };

  const handleOpenReglements = (facture) => {
    setCurrentFacture(facture);
    setShowReglementModal(true);
  };

  const handleOpenMail = (facture) => {
    setCurrentFacture(facture);
    setShowMailModal(true);
  };

  const handleApplyDateFilter = () => {
    if (tempDateDebut && tempDateFin && tempDateFin < tempDateDebut) {
      showWarning("La date de fin doit être supérieure à la date de début.");
      return;
    }
    setDateDebut(tempDateDebut);
    setDateFin(tempDateFin);
    setPage(1);
    setIsDateFilterOpen(false);
  };

  const handleClearDates = () => {
    setTempDateDebut("");
    setTempDateFin("");
    setDateDebut("");
    setDateFin("");
    setPage(1);
  };

  const handleSuccess = useCallback(() => {
    setShowFormModal(false);
    setShowDeleteModal(false);
    setShowReglementModal(false);
    setShowMailModal(false);
    setCurrentFacture(null);
    queryClient.invalidateQueries({ queryKey: ["factures"] });
  }, [queryClient]);

  // --- TEMPS RÉEL ---
  useEffect(() => {
    if (!socket) return;
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["factures"] });
    socket.on("facture_created", refresh);
    socket.on("facture_updated", refresh);
    socket.on("facture_deleted", refresh);
    socket.on("reglement_created", refresh);
    return () => {
      socket.off("facture_created");
      socket.off("facture_updated");
      socket.off("facture_deleted");
      socket.off("reglement_created");
    };
  }, [socket, queryClient]);

  return (
    <div className="p-4 md:p-0">
      {/* MODALS */}
      <WelcomeModal isActive={showFormModal} onClose={() => setShowFormModal(false)}>
        <FactureForm facture={currentFacture} onSuccess={handleSuccess} />
      </WelcomeModal>
      <WelcomeModal isActive={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteFacture id={currentFacture?.id} reference={currentFacture?.reference} onSuccess={handleSuccess} />
      </WelcomeModal>
      <WelcomeModal isActive={showReglementModal} onClose={() => setShowReglementModal(false)}>
        <ReglementManager factureId={currentFacture?.id} onRefreshParent={handleSuccess} />
      </WelcomeModal>
      <WelcomeModal isActive={showMailModal} onClose={() => setShowMailModal(false)}>
        <MailManager facture={currentFacture} onClose={() => setShowMailModal(false)} />
      </WelcomeModal>

      {/* HEADER */}
      <div className="relative w-full p-8 bg-slate-50 dark:bg-gray-900/50 rounded-[3rem] border border-white dark:border-gray-800 shadow-inner mb-8 overflow-hidden">
        <FileText size={120} className="absolute -right-8 -top-8 text-[#f97316]/10 -rotate-12 pointer-events-none" />
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
              Registre des <span className="text-[#f97316]">Factures</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Pilotage financier Rotary Hub</p>
          </div>
          {can('createFacture') && (
            <button onClick={() => { setCurrentFacture(null); setShowFormModal(true); }} className="w-14 h-14 bg-[#2d3436] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#f97316] transition-all active:scale-95">
              <Plus size={28} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Facturé" amount={globalStats.totalGlobalFacture} icon={<FileText />} color="text-slate-700 dark:text-white" />
          <StatCard title="Recouvré" amount={globalStats.totalGlobalPaye} icon={<Coins />} color="text-green-600" />
          <StatCard title="Dû" amount={globalStats.soldeRestant} icon={<Calculator />} color="text-red-500" />
      </div>

      {/* FILTERS BAR */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-5 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Référence..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}} className="w-full h-12 pl-10 pr-4 text-sm border-2 border-gray-100 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900 focus:border-[#f97316] outline-none transition-all dark:text-white" />
            </div>

            <div className="flex-1 min-w-[200px]">
              <SearchableClubSelect value={clubId} onClubSelect={(id) => {setClubId(id); setPage(1);}} />
            </div>

            <div className="relative w-full lg:w-48">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setPage(1);}} className="w-full h-12 pl-10 pr-4 text-[10px] font-black uppercase border-2 border-gray-100 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900 appearance-none focus:border-[#f97316] outline-none cursor-pointer dark:text-white">
                    <option value="">Tous les états</option>
                    <option value="impaye">🔴 Impayées</option>
                    <option value="paye">🟢 Payées</option>
                    <option value="en_cours">🔵 En cours</option>
                    <option value="annule">⚪ Annulées</option>
                </select>
            </div>

            <button 
              onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
              className={clsx(
                "h-12 px-6 rounded-2xl border-2 flex items-center gap-3 font-black uppercase text-[10px] tracking-widest transition-all relative",
                isDateFilterOpen || dateDebut || dateFin ? "border-[#f97316] bg-orange-50 dark:bg-orange-900/10 text-[#f97316]" : "border-gray-100 dark:border-gray-700 text-gray-400"
              )}
            >
              <Calendar size={18} /> <span>Filtre Date</span>
              {(dateDebut || dateFin) && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#f97316] rounded-full border-2 border-white dark:border-gray-800" />}
            </button>
        </div>

        <AnimatePresence>
          {isDateFilterOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap items-end gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                    <span className="text-[8px] font-black uppercase text-slate-400 ml-1">Début</span>
                    <input type="date" value={tempDateDebut} onChange={(e) => setTempDateDebut(e.target.value)} className="h-11 px-4 text-xs font-bold border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-[#f97316] outline-none dark:bg-gray-800" />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                    <span className="text-[8px] font-black uppercase text-slate-400 ml-1">Fin</span>
                    <input type="date" min={tempDateDebut} value={tempDateFin} onChange={(e) => setTempDateFin(e.target.value)} className="h-11 px-4 text-xs font-bold border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-[#f97316] outline-none dark:bg-gray-800" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleApplyDateFilter} className="h-11 px-6 bg-[#f97316] text-white rounded-xl font-black uppercase text-[10px] flex items-center gap-2 shadow-lg active:scale-95">
                        <Check size={14} /> Appliquer
                    </button>
                    <button onClick={handleClearDates} className="h-11 px-4 bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 text-slate-400 rounded-xl hover:text-red-500 transition-colors">
                        <X size={16} />
                    </button>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TABLE DATA */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#f97316]" />
            <p className="text-[10px] font-black uppercase text-gray-400">Calcul des écritures...</p>
        </div>
      ) : facturesList.length > 0 ? (
        <FactureTable 
          facturesList={facturesList} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onOpenReglements={handleOpenReglements} 
          onOpenMail={handleOpenMail} 
        />
      ) : (
        <NoData message="Aucune facture ne correspond." />
      )}

      {/* PAGINATION */}
      {meta && facturesList.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <select value={perPage} onChange={(e) => {setPerPage(Number(e.target.value)); setPage(1);}} className="bg-gray-50 dark:bg-gray-900 border-none text-xs font-bold rounded-lg px-3 py-1 focus:ring-2 focus:ring-orange-500/20">
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </select>
          <Pagination currentPage={meta.current_page} totalPages={meta.last_page} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

const StatCard = ({ title, amount, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-900 flex items-center justify-center text-slate-400 shadow-inner shrink-0">
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className="flex flex-col min-w-0 leading-none">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest truncate">{title}</span>
            <span className={`text-lg font-black mt-1 ${color}`}>{new Intl.NumberFormat('fr-FR').format(amount)} F</span>
        </div>
    </div>
);