import React from 'react';
import { Menu } from 'lucide-react';
import ButtonToggle from "../../components/ButtonToggle";
import { useTheme } from '../../hooks/useTheme'; // Assurez-vous d'importer votre hook de thème

export default function Header({ onToggleSidebar }) {
  // Le hook est nécessaire pour que le ButtonToggle fonctionne
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 w-full flex items-center justify-between p-4 
      bg-gradient-to-r from-white/80 to-slate-100/80 
      dark:from-gray-900/90 dark:to-slate-800/80 
      backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-white/10 
      text-gray-900 dark:text-gray-200">
      
      {/* Le bouton pour changer le thème */}
      <div className="-mt-2">
        <ButtonToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      
      {/* Le bouton pour ouvrir/fermer la sidebar sur mobile */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 md:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      {/* Espaceur pour centrer le titre sur mobile si nécessaire, sinon il peut être retiré */}
      <div className="flex-grow md:hidden"></div>
      
      {/* Section droite du header (ex: profil utilisateur) */}
      <div className="flex items-center space-x-4 ml-auto">
        <div className="w-9 h-9">
          {/* Vous pouvez placer un avatar ou un menu profil ici */}
        </div>
      </div>
    </header>
  );
}