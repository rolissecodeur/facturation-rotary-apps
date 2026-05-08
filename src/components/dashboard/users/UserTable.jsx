import React from 'react';
import { 
  Pencil, Trash2, Mail, ShieldCheck, 
  Hash, Phone, User as UserIcon, CheckCircle2, 
  XCircle, Globe
} from "lucide-react";
import { StatusBadge, RoleBadge } from "../badge";
import { usePermissions } from "../../../hooks/usePermissions";
import clsx from "clsx";

export default function UserTable({ usersList = [], onEdit, onDelete }) {
  const { can } = usePermissions();
  const API_URL = import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            {/* EN-TETE ANTHRACITE */}
            <tr className="bg-[#2d3436] dark:bg-gray-900 text-nowrap">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90">ID</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Utilisateur</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Rôle & Accès</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Vérification</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Session</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">Statut</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {usersList.map((user) => {
              const avatarSrc = user.photoProfil ? `${API_URL}/${user.photoProfil}` : null;

              return (
                <tr 
                  key={user.id} 
                  className="transition-colors group bg-white odd:bg-white even:bg-slate-50/30 dark:odd:bg-gray-800 dark:even:bg-gray-900/30 hover:bg-orange-50/30 align-middle"
                >
                  {/* ID */}
                  <td className="px-6 py-4">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">#USR-{user.id}</span>
                  </td>

                  {/* IDENTITÉ & CONTACTS */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="mt-0.5 w-10 h-10 rounded-xl bg-orange-50 dark:bg-gray-700 border-2 border-white dark:border-gray-600 overflow-hidden shrink-0 shadow-sm">
                        {avatarSrc ? (
                          <img src={avatarSrc} className="w-full h-full object-cover" alt={user.nom} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <UserIcon size={20} />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0 leading-tight">
                        {/* Nom */}
                        <span className="text-[11px] font-black text-slate-700 dark:text-white uppercase truncate">
                          {user.nom} {user.prenoms}
                        </span>
                        
                        {/* Contact */}
                        <div className="flex items-center gap-1 text-slate-400 mt-1">
                          <Phone size={10} className="shrink-0 text-[#f97316]/50" />
                          <span className="text-[9px] font-bold font-mono tracking-tighter">
                            {user.contact || "Pas de numéro"}
                          </span>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                          <Mail size={10} className="shrink-0 text-slate-300" />
                          <span className="text-[9px] lowercase truncate opacity-80">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* RÔLE */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                       <RoleBadge role={user.role} />
                       <div className="flex items-center gap-1 text-[8px] font-black uppercase text-slate-400 ml-1">
                          <ShieldCheck size={10} /> 
                          <span>Permissions standards</span>
                       </div>
                    </div>
                  </td>

                  {/* VÉRIFICATION EMAIL */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {user.emailVerified ? (
                        <div className="flex items-center gap-1 text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-800">
                           <CheckCircle2 size={12} strokeWidth={3} />
                           <span className="text-[8px] font-black uppercase">Vérifié</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-orange-400 bg-orange-50 dark:bg-orange-900/10 px-2 py-0.5 rounded-lg border border-orange-100 dark:border-orange-900/20">
                           <XCircle size={12} strokeWidth={3} />
                           <span className="text-[8px] font-black uppercase">En attente</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* SESSION (En ligne) */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <div className={clsx(
                         "w-2 h-2 rounded-full",
                         user.enLigne ? "bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" : "bg-slate-300 dark:bg-gray-600"
                       )} />
                       <span className="text-[9px] font-black uppercase text-slate-400">
                         {user.enLigne ? "Connecté" : "Hors-ligne"}
                       </span>
                    </div>
                  </td>

                  {/* STATUT DU COMPTE */}
                  <td className="px-6 py-4 text-center">
                    <div className="scale-90 inline-block">
                        <StatusBadge status={user.status} />
                    </div>
                  </td>

                  {/* ACTIONS VIVES */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {can('updateUser') && (
                        <button 
                          onClick={() => onEdit(user)} 
                          className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-[#2d3436] text-[#2d3436] dark:border-white dark:text-white hover:bg-[#2d3436] hover:text-white dark:hover:bg-white dark:hover:text-[#2d3436] transition-all active:scale-95 shadow-sm"
                          title="Modifier l'utilisateur"
                        >
                          <Pencil size={13} strokeWidth={2.5} />
                        </button>
                      )}
                      
                      {can('deleteUser') && (
                        <button 
                          onClick={() => onDelete(user)} 
                          className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
                          title="Supprimer le compte"
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
         <div className="flex items-center gap-2 opacity-30">
            <Hash size={12} className="text-white" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Registre Officiel du Personnel • Rotary Hub</span>
         </div>
      </div>
    </div>
  );
}