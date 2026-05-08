import React, { useState, useEffect, useMemo, useContext, useCallback } from "react";
import { 
  ShieldCheck, Search, Loader2, ServerCrash, 
  Plus, Key, Hash, LayoutGrid 
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// Contexts & Hooks
import { SocketContext } from "../contexts/socket";
import { usePermission } from "../services/data/useFetchPermission";

// Composants
import Pagination from "../components/dashboard/Pagination";
import NoData from "../components/NoData";
import WelcomeModal from "../components/WelcomeModal";
import PermissionForm from "../components/dashboard/permissions/PermissionForm";
import PermissionCard from "../components/dashboard/permissions/PermissionCard";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function PermissionsPage() {
  // --- ÉTATS ---
  const [showModal, setShowModal] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [globalPermissionsExpanded, setGlobalPermissionsExpanded] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();
  const socket = useContext(SocketContext);

  // --- DATA FETCHING ---
  const { data, isLoading, isError, error } = usePermission({ 
    page, 
    perpage: perPage 
  });

  const roles = data?.data || [];
  const meta = data?.meta || { currentPage: 1, lastPage: 1 };

  // --- FILTRAGE LOCAL (Pour la recherche fluide) ---
  const filteredRoles = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return roles;
    return roles.filter((role) => 
      role.libelle.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [roles, debouncedSearchTerm]);

  // --- SYNCHRONISATION TEMPS RÉEL ---
  useEffect(() => {
    if (!socket) return;
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["permissions"] });
    socket.on("permission_updated", refresh);
    socket.on("role_created", refresh);
    return () => {
      socket.off("permission_updated", refresh);
      socket.off("role_created", refresh);
    };
  }, [socket, queryClient]);

  // --- HANDLERS ---
  const handleSuccess = useCallback(() => {
    setShowModal(false);
    setCurrentPermission(null);
    queryClient.invalidateQueries({ queryKey: ["permissions"] });
  }, [queryClient]);

  const handleEditClick = (role) => {
    setCurrentPermission({ 
      ...role.Permission, 
      role: { id: role.id, libelle: role.libelle } 
    });
    setShowModal(true);
  };

  return (
    <div className="p-4 md:p-0">
      {/* MODAL FORMULAIRE */}
      <WelcomeModal isActive={showModal} onClose={() => setShowModal(false)}>
        {currentPermission && (
          <PermissionForm permission={currentPermission} onSuccess={handleSuccess} />
        )}
      </WelcomeModal>

      {/* HEADER PREMIUM ROTARY STYLE */}
      <div className="relative w-full p-8 bg-slate-50 dark:bg-gray-900/50 rounded-[3rem] border border-white dark:border-gray-800 shadow-inner mb-10 overflow-hidden">
        <ShieldCheck size={120} className="absolute -right-8 -top-8 text-teal-600/10 dark:text-teal-400/5 -rotate-12 pointer-events-none" />

        <div className="relative z-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
              Permissions & <span className="text-[#f97316]">Habilitations</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-[#f97316]"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Définissez les niveaux d'accès et les droits par profil utilisateur
              </p>
            </div>
          </div>

          {/* Bouton "+" sans action spécifique pour le moment */}
          <button 
            className="w-14 h-14 bg-[#2d3436] text-white rounded-full flex items-center justify-center shadow-xl shadow-gray-500/20 hover:bg-[#f97316] transition-all active:scale-95"
            title="Ajouter un rôle (Non configuré)"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* BARRE D'OUTILS */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center bg-gray-100 dark:bg-gray-900 p-1.5 rounded-xl text-teal-600 dark:text-teal-400">
                <LayoutGrid size={20} />
            </div>

            {/* Recherche */}
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Chercher un rôle ou profil..." 
                    value={searchTerm} 
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} 
                    className="w-full md:w-80 pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-all" 
                />
            </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Affichage</span>
          <select 
            value={perPage} 
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} 
            className="bg-gray-50 dark:bg-gray-700 border-none text-sm font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
          >
            <option value="8">8 profils</option>
            <option value="12">12 profils</option>
            <option value="24">24 profils</option>
          </select>
        </div>
      </div>

      {/* CONTENU DYNAMIQUE */}
      {isLoading ? (
        <div className="text-center py-24 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#f97316]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sécurisation des accès en cours...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
            <ServerCrash className="mx-auto mb-4 w-12 h-12" />
            <p className="font-bold uppercase tracking-widest text-sm">{error?.message || "Erreur de chargement"}</p>
        </div>
      ) : filteredRoles.length > 0 ? (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                {filteredRoles.map((role) => (
                    <PermissionCard 
                        key={role.id} 
                        role={role} 
                        onEdit={handleEditClick} 
                        permissionsExpanded={globalPermissionsExpanded} 
                        setPermissionsExpanded={setGlobalPermissionsExpanded} 
                    />
                ))}
            </div>

            {/* PAGINATION */}
            {meta && meta.lastPage > 1 && ( 
                <div className="mt-10 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <Pagination 
                        currentPage={meta.currentPage} 
                        totalPages={meta.lastPage} 
                        onPageChange={setPage} 
                    />
                </div> 
            )}
        </>
      ) : (
        <NoData message="Aucun rôle ou permission trouvé pour cette recherche." />
      )}

      {/* FOOTER */}
      <div className="mt-12 bg-[#2d3436] dark:bg-gray-900/80 p-3 flex justify-center rounded-2xl border-t border-white/5">
         <div className="flex items-center gap-2 opacity-30">
            <Hash size={12} className="text-white" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white italic">
                Rotary Security System v2.0
            </span>
         </div>
      </div>
    </div>
  );
}