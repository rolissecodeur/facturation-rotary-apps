import React, { useState, useEffect, useContext, useCallback } from "react";
import { Plus, Search, Loader2, ServerCrash, LayoutGrid, List, UserCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// Contexts, Hooks et Services
import { SocketContext } from "../contexts/socket";
import { useFetchUser } from "../services/data/useFetchUser";
import { usePermissions } from "../hooks/usePermissions";

// Composants
import Pagination from "../components/dashboard/Pagination";
import NoData from "../components/NoData";
import WelcomeModal from "../components/WelcomeModal";
import UserForm from "../components/dashboard/users/UserForm";
import DeleteUser from "../components/dashboard/users/DeleteUser";
import UserCard from "../components/dashboard/users/UserCard";
import UserTable from "../components/dashboard/users/UserTable"; // Assurez-vous d'avoir ce composant

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function UsersPage() {
  // --- ÉTATS ---
  const [viewType, setViewType] = useState("table"); 
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();
  const socket = useContext(SocketContext);
  const { can } = usePermissions();

  // --- DATA FETCHING ---
  const { data, isLoading, isError, error } = useFetchUser({
    page,
    perPage,
    keyword: debouncedSearchTerm.trim() || undefined,
  });

  const usersList = data?.data || [];
  const meta = data?.meta;

  // --- SYNCHRONISATION TEMPS RÉEL ---
  useEffect(() => {
    if (!socket) return;
    const handleDataUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    };
    socket.on("user_created", handleDataUpdate);
    socket.on("user_updated", handleDataUpdate);
    socket.on("user_deleted", handleDataUpdate);
    return () => {
      socket.off("user_created", handleDataUpdate);
      socket.off("user_updated", handleDataUpdate);
      socket.off("user_deleted", handleDataUpdate);
    };
  }, [socket, queryClient]);

  // --- HANDLERS ---
  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSuccess = useCallback(() => {
    setShowModal(false);
    setShowDeleteModal(false);
    setCurrentUser(null);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  }, [queryClient]);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const openCreateModal = () => {
    setCurrentUser(null);
    setShowModal(true);
  };

  return (
    <div className="p-4 md:p-0">
      {/* MODALS */}
      <WelcomeModal isActive={showModal} onClose={() => setShowModal(false)}>
        <UserForm
          user={currentUser}
          from="dashboard"
          onSuccess={handleSuccess}
        />
      </WelcomeModal>

      <WelcomeModal isActive={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteUser user={currentUser} onSuccess={handleSuccess} />
      </WelcomeModal>

      {/* HEADER PREMIUM STYLE */}
      <div className="relative w-full p-8 bg-slate-50 dark:bg-gray-900/50 rounded-[3rem] border border-white dark:border-gray-800 shadow-inner mb-10 overflow-hidden">
        <UserCircle size={120} className="absolute -right-8 -top-8 text-teal-600/10 dark:text-teal-400/5 -rotate-12 pointer-events-none" />

        <div className="relative z-10 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
              Registre <span className="text-[#f97316]">Utilisateurs</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-[#f97316]"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Gestion des comptes, des rôles et des permissions d'accès
              </p>
            </div>
          </div>

          {can('createUser') && (
            <button 
              onClick={openCreateModal}
              className="w-14 h-14 bg-[#2d3436] text-white rounded-full flex items-center justify-center shadow-xl shadow-gray-500/20 hover:bg-[#f97316] transition-all active:scale-95"
              title="Ajouter un utilisateur"
            >
              <Plus size={28} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* BARRE D'OUTILS */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Switcher de Vue */}
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                <button 
                    onClick={() => setViewType("grid")}
                    className={`p-2 rounded-lg transition-all ${viewType === "grid" ? "bg-white dark:bg-gray-800 text-[#f97316] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <LayoutGrid size={20} />
                </button>
                <button 
                    onClick={() => setViewType("table")}
                    className={`p-2 rounded-lg transition-all ${viewType === "table" ? "bg-white dark:bg-gray-800 text-[#f97316] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <List size={20} />
                </button>
            </div>

            {/* Recherche */}
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Rechercher par nom ou email..." 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    className="w-full md:w-80 pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-all" 
                />
            </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Affichage</span>
          <select value={perPage} onChange={handlePerPageChange} className="bg-gray-50 dark:bg-gray-700 border-none text-sm font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500/20 cursor-pointer">
            <option value="48">48</option>
            <option value="100">100</option>
            <option value="500">500</option>
          </select>
        </div>
      </div>

      {/* CONTENU DYNAMIQUE */}
      {isLoading ? (
        <div className="text-center py-24 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#f97316]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Synchronisation du personnel...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
            <ServerCrash className="mx-auto mb-4 w-12 h-12" />
            <p className="font-bold uppercase tracking-widest text-sm">{error?.message || "Erreur de connexion"}</p>
        </div>
      ) : usersList.length > 0 ? (
        viewType === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {usersList.map((user) => (
              <UserCard 
                key={user.id} 
                user={user} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        ) : (
          <UserTable 
            usersList={usersList} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )
      ) : (
        <NoData message="Aucun utilisateur trouvé pour ces critères." />
      )}

      {/* PAGINATION */}
      {meta && usersList.length > 0 && meta.lastPage > 1 && ( 
        <div className="mt-10 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <Pagination 
            currentPage={meta.currentPage} 
            totalPages={meta.lastPage} 
            onPageChange={setPage} 
          />
        </div> 
      )}
    </div>
  );
}