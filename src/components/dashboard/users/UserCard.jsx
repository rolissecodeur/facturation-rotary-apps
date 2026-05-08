import React from 'react';
import { 
  Mail, Pencil, Trash2, Calendar, 
  CheckCircle2, XCircle, ShieldCheck, 
  ShieldAlert, Phone, User as UserIcon
} from 'lucide-react';
import { RoleBadge } from "../badge"; 
import { usePermissions } from "../../../hooks/usePermissions";
import clsx from "clsx";

export default function UserCard({ user, onEdit, onDelete }) {
  const { can } = usePermissions();
  
  const formattedDate = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const hasUpdatePermission = can("updateUser");
  const hasDeletePermission = can("deleteUser");

  const API_URL = import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '');
  const avatarSrc = user?.photoProfil ? `${API_URL}/${user.photoProfil}` : null;
  const isAccountActive = user.status;

  return (
    <div className={clsx(
      "bg-white dark:bg-gray-900 rounded-[2rem] border-2 transition-all duration-300 flex flex-col overflow-hidden group",
      !isAccountActive 
        ? "border-red-100 dark:border-red-900/40 opacity-90" 
        : "border-slate-100 dark:border-gray-800 hover:border-[#f97316]/40 shadow-sm hover:shadow-xl"
    )}>
      
      <div className="p-6 flex-grow">
        {/* EN-TÊTE : AVATAR & ROLE */}
        <div className="flex items-start justify-between mb-6">
          <div className="relative">
            <div className={clsx(
              "w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 shadow-inner flex items-center justify-center",
              !isAccountActive 
                ? "grayscale bg-red-50 dark:bg-gray-800 border-red-100 dark:border-red-900/20" 
                : "bg-slate-50 dark:bg-gray-800 border-white dark:border-gray-700"
            )}>
              {avatarSrc ? (
                <img src={avatarSrc} alt={user.nom} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={32} className="text-slate-300 dark:text-gray-600" />
              )}
            </div>
            {/* Indicateur de statut en ligne */}
            <div className={clsx(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 shadow-sm",
              user.enLigne ? "bg-green-500 animate-pulse" : "bg-slate-300 dark:bg-gray-700"
            )} />
          </div>
          <RoleBadge role={user.role} />
        </div>

        {/* IDENTITÉ */}
        <div className="mb-6">
          <h3 className="font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight text-lg leading-none truncate">
            {user.nom} <span className="text-[#f97316]">{user.prenoms}</span>
          </h3>
          <p className="text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-2 italic">
            Référence : #{user.id}
          </p>
        </div>

        {/* GRILLE D'INFORMATIONS */}
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700">
            <Mail size={14} className="text-[#f97316]" />
            <span className="text-[11px] font-bold text-slate-600 dark:text-gray-300 truncate lowercase">
              {user.email}
            </span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700">
            <Phone size={14} className="text-[#f97316]" />
            <span className="text-[11px] font-black text-slate-600 dark:text-gray-300 font-mono">
              {user.contact || '---'}
            </span>
          </div>

          {/* Statut Email & Date */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-100 dark:border-gray-700 bg-white/50 dark:bg-transparent">
              {user.emailVerified ? (
                <CheckCircle2 size={12} className="text-blue-500" />
              ) : (
                <XCircle size={12} className="text-orange-400" />
              )}
              <span className="text-[8px] font-black uppercase text-slate-400 dark:text-gray-500">
                {user.emailVerified ? 'Vérifié' : 'En attente'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-100 dark:border-gray-700 bg-white/50 dark:bg-transparent">
              <Calendar size={12} className="text-slate-400 dark:text-gray-500" />
              <span className="text-[8px] font-black uppercase text-slate-400 dark:text-gray-500">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER : ACTIONS VIVES */}
      <div className={clsx(
        "px-6 py-4 border-t flex items-center justify-between transition-colors",
        !isAccountActive ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30" : "bg-white dark:bg-gray-800 border-slate-50 dark:border-gray-700"
      )}>
        <div className="flex items-center gap-2">
          {isAccountActive ? (
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-black text-[9px] uppercase tracking-widest">
              <ShieldCheck size={14} /> <span>Actif</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-red-600 dark:text-red-500 font-black text-[9px] uppercase tracking-widest animate-pulse">
              <ShieldAlert size={14} /> <span>Suspendu</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {hasUpdatePermission && (
            <button 
              onClick={() => onEdit(user)} 
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-1 border-[#2d3436] dark:border-white text-[#2d3436] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#2d3436] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-90 shadow-sm"
              title="Modifier"
            >
              <Pencil size={14} strokeWidth={2.5} />
            </button>
          )}
          
          {hasDeletePermission && (
            <button 
              onClick={() => onDelete(user)} 
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-1 border-red-500 text-red-500 bg-white dark:bg-gray-800 hover:bg-red-600 hover:text-white transition-all shadow-sm"
              title="Supprimer"
            >
              <Trash2 size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}