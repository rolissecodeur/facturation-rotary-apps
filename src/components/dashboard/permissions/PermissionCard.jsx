// src/components/dashboard/permissions/PermissionCard.jsx
import React, { useState } from "react";
// AJOUT DE L'IMPORTATION MANQUANTE CI-DESSOUS
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion"; 
import {
  Pencil,
  ChevronDown,
  ChevronUp,
  Users,
  LockOpen,
  UserCircle,
  Building2,
  FileText,
  Coins,
  Key,
} from "lucide-react";
import { usePermissions } from "../../../hooks/usePermissions";
import { RoleBadge } from "../badge";
import clsx from "clsx";

/* ─── AFFICHAGE COMPACT DES UTILISATEURS ─── */
const UserListDisplay = ({ users }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayLimit = 2;

  if (!users || users.length === 0) {
    return <span className="text-[10px] font-black uppercase text-slate-400 italic">Aucun utilisateur</span>;
  }

  const visibleUsers = isExpanded ? users : users.slice(0, displayLimit);
  const hiddenCount = users.length - displayLimit;

  return (
    <div className="flex flex-col gap-3">
      {visibleUsers.map((user) => (
        <div key={user.id} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-white dark:border-gray-600">
             {user?.photoProfil ? (
                 <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/${user.photoProfil}`} className="w-full h-full object-cover" alt="" />
             ) : <UserCircle size={14} className="text-slate-400" />}
          </div>
          <div className="min-w-0">
            <div className="font-black text-[10px] text-slate-700 dark:text-gray-200 uppercase truncate leading-none">
                {user.nom} {user.prenoms}
            </div>
          </div>
        </div>
      ))}
      {users.length > displayLimit && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-[9px] font-black uppercase text-[#f97316] hover:underline flex items-center gap-1 mt-1">
          {isExpanded ? <>Réduire <ChevronUp size={12} /></> : <>+{hiddenCount} autres membres <ChevronDown size={12} /></>}
        </button>
      )}
    </div>
  );
};

/* ─── ITEM DE PERMISSION UNITAIRE ─── */
const PermissionItem = ({ label, status }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-slate-50 dark:border-white/5 last:border-b-0">
    <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-tighter">{label}</span>
    <div className={clsx(
        "w-3.5 h-3.5 rounded-full flex items-center justify-center",
        status ? "bg-green-500" : "bg-slate-200 dark:bg-gray-700"
    )}>
        {status && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
    </div>
  </div>
);

/* ─── TITRE DE CATÉGORIE ─── */
// eslint-disable-next-line no-unused-vars
const CategoryTitle = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-3 mt-4 first:mt-0">
     <Icon size={12} className="text-[#f97316]" />
     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{title}</span>
  </div>
);

/* ─── CARTE PRINCIPALE ─── */
export default function PermissionCard({ role, onEdit, permissionsExpanded, setPermissionsExpanded }) {
  const { can } = usePermissions();
  const permission = role.Permission;
  const usersList = role.users || role.rolesUsers?.map(ru => ru.user) || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border-2 border-slate-100 dark:border-white/5 p-6 flex flex-col hover:border-[#f97316]/30 transition-all shadow-sm">
      
      {/* HEADER : RÔLE */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2d3436] flex items-center justify-center text-white shadow-lg">
            <LockOpen size={24} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white leading-none">
                {role.libelle.replace(/_/g, " ")}
            </h3>
            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Profil ID: #{role.id}</span>
          </div>
        </div>
      </div>

      {/* SECTION UTILISATEURS */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
          <Users size={14} /> <span>Équipe ({usersList.length})</span>
        </div>
        <UserListDisplay users={usersList} />
      </div>

      {/* RÉSUMÉ DES PERMISSIONS */}
      <div className="flex-grow">
        <div className="bg-white dark:bg-gray-800/40 border border-slate-100 dark:border-white/5 rounded-3xl p-5">
          <CategoryTitle title="Utilisateurs" icon={Users} />
          <div className="space-y-1">
             <PermissionItem label="Lecture" status={permission?.readUser} />
             <PermissionItem label="Édition" status={permission?.updateUser} />
          </div>

          <CategoryTitle title="Clubs & Factures" icon={Building2} />
          <div className="space-y-1">
             <PermissionItem label="Gérer Clubs" status={permission?.readClub} />
             <PermissionItem label="Gérer Factures" status={permission?.readFacture} />
          </div>

          {/* SECTION DÉPLOYABLE */}
          <AnimatePresence mode="wait">
            {permissionsExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: "auto", opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <CategoryTitle title="Règlements" icon={Coins} />
                <div className="space-y-1">
                   <PermissionItem label="Lecture" status={permission?.readReglement} />
                   <PermissionItem label="Saisie" status={permission?.createReglement} />
                </div>
                
                <CategoryTitle title="Système" icon={Key} />
                <div className="space-y-1">
                   <PermissionItem label="Habilitations" status={permission?.readPermission} />
                   <PermissionItem label="Admin" status={permission?.updatePermission} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setPermissionsExpanded(!permissionsExpanded)} 
            className="w-full mt-4 py-2 text-[8px] font-black uppercase tracking-widest text-[#f97316] bg-orange-50 dark:bg-orange-950/20 rounded-xl transition-all"
          >
            {permissionsExpanded ? "Réduire la vue" : "Détails complets"}
          </button>
        </div>
      </div>

      {/* BOUTON ÉDITION */}
      {can("updatePermission") && (
        <div className="mt-6">
          <button
            onClick={() => onEdit(role)}
            className="w-full h-12 bg-[#2d3436] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#f97316] transition-all shadow-lg active:scale-95"
          >
            <Pencil size={14} strokeWidth={3} /> Gérer les droits
          </button>
        </div>
      )}
    </div>
  );
}