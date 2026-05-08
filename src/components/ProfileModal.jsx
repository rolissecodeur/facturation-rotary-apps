import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Settings, Edit, Mail, Phone, 
  ChevronDown, AlertTriangle, Loader2, User as UserIcon,
  Briefcase, MapPin 
} from 'lucide-react';
import { RoleBadge } from './dashboard/badge';

import { useAuth } from '../hooks/useAuth';
import { useClickOutside } from '../hooks/useClickOutside';
import WelcomeModal from "../components/WelcomeModal";
import UserForm from "./dashboard/users/UserForm";

export default function Profile() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { user, logout } = useAuth();

  const dropdownRef = useClickOutside(() => {
    setDropdownOpen(false);
  });

  const openModal = () => {
    setIsEditing(false);
    setModalOpen(true);
    setDropdownOpen(false);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setIsConfirmLogoutOpen(true);
  };

  const handleSuccess = () => {
    setModalOpen(false);
    setTimeout(logout, 2000);
  };
  
  if (!user) return null;

  const userInitials = user.nom ? `${user.nom[0]}${user.prenoms ? user.prenoms[0] : ''}`.toUpperCase() : '?';
  const avatarSrc = user.photoProfil 
    ? `${import.meta.env.VITE_API_BASE_URL}/${user.photoProfil}` 
    : null;

  return (
    <>
      {/* --- TRIGGER DU MENU (STYLE BOUTON PILULE) --- */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className={`
            group flex items-center gap-2 p-1 pr-3 rounded-full 
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
            transition-all duration-200 shadow-sm
            ${isDropdownOpen ? 'ring-2 ring-green-500 border-transparent' : 'hover:border-green-300'}
          `}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-xs">
            
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">{userInitials}</span>
            )}
          </div>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 hidden sm:block">
            Menu
          </span>
          <ChevronDown 
            size={14} 
            className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-green-500' : 'group-hover:text-green-500'}`} 
          />
        </button>

        {/* --- MENU DÉROULANT --- */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mon Compte</p>
                <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{`${user.nom} ${user.prenoms}`}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={openModal}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                >
                  <Settings size={16} className="text-gray-400" />
                  <span className="font-medium">Profil & Paramètres</span>
                </button>
              </div>

              <div className="border-t dark:border-gray-700 my-1"></div>

              <div className="p-2">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MODALE DE PROFIL --- */}
      <WelcomeModal isActive={isModalOpen} onClose={closeModal}>
        <div className="p-2">
          {isEditing ? (
            <UserForm user={user} from="userHimSelf" onSuccess={handleSuccess} />
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Mon Profil</h3>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-green-600 text-green-600 rounded-md text-sm font-medium hover:bg-green-50 transition-all"
                >
                  <Edit size={14} />
                  Modifier
                </button>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl bg-gray-50 flex items-center justify-center">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-2xl font-bold text-gray-400">
                      {userInitials}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100 uppercase">
                  {user.nom} <span className="font-normal capitalize text-gray-600">{user.prenoms}</span>
                </h3>
                <div className="mt-2">
                  <RoleBadge role={user.role} />
                </div>

                {/* --- GRILLE D'INFORMATIONS EN LECTURE --- */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                   <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Mail size={18} className="text-green-500" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Email</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.email}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Phone size={18} className="text-green-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Contact</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.contact || "Non fourni"}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Briefcase size={18} className="text-green-500" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Service</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.service?.libelle || "Non défini"}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <UserIcon size={18} className="text-green-500" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Fonction</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.fonction?.libelle || "Non définie"}</span>
                      </div>
                   </div>

                   <div className="sm:col-span-2 flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <MapPin size={18} className="text-green-500" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Site d'affectation</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.site?.libelle || "Zone non spécifiée"}</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </WelcomeModal>

      {/* --- MODAL DE CONFIRMATION DE DÉCONNEXION --- */}
      <AnimatePresence>
        {isConfirmLogoutOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Déconnexion
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Souhaitez-vous vraiment quitter votre session ?
              </p>
              
              <div className="mt-8 flex flex-col gap-2">
                <button
                  onClick={logout}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Confirmer la déconnexion
                </button>
                <button
                  onClick={() => setIsConfirmLogoutOpen(false)}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}