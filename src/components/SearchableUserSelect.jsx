// src/components/SearchableUserSelect.jsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, UserX, Briefcase } from 'lucide-react';

export default function SearchableUserSelect({
  allUsers = [],
  value, // La valeur (ID) contrôlée par le parent
  onUserSelect,
  label = "Sélectionner un utilisateur",
  placeholder = "Rechercher un nom...",
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false); // Pour suivre l'état de focus

  // Synchronise l'affichage interne avec la valeur contrôlée par le parent
  useEffect(() => {
    if (value) {
      const selected = allUsers.find(user => user.id === value);
      if (selected) {
        setSearchTerm(`${selected.nom} ${selected.prenoms}`);
      }
    } else {
      // Si la valeur du parent devient null (ex: via le bouton X), on vide le champ
      setSearchTerm('');
    }
  }, [value, allUsers]);

  // Filtre les utilisateurs en fonction de la recherche
  const filteredUsers = useMemo(() => {
    // Si l'input n'est pas focus et qu'il y a une valeur sélectionnée, pas besoin de filtrer.
    if (!isFocused && value) {
        return allUsers;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    // Si le terme de recherche correspond exactement à l'utilisateur déjà sélectionné,
    // cela signifie que l'utilisateur n'a pas encore commencé à taper une nouvelle recherche.
    // Dans ce cas, nous affichons tous les utilisateurs pour lui permettre de choisir à nouveau.
    const selectedUser = allUsers.find(user => user.id === value);
    if (selectedUser && lowerCaseSearch === `${selectedUser.nom} ${selectedUser.prenoms}`.toLowerCase()) {
        return allUsers;
    }

    return allUsers.filter(user =>
      `${user.nom || ''} ${user.prenoms || ''}`.toLowerCase().includes(lowerCaseSearch) ||
      (user.email || '').toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm, allUsers, value, isFocused]);

  // Gère la fermeture du dropdown en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Si on clique dehors, on restaure le nom de l'utilisateur sélectionné s'il y en a un
        const selected = allUsers.find(user => user.id === value);
        if (selected) {
          setSearchTerm(`${selected.nom} ${selected.prenoms}`);
        } else {
          setSearchTerm('');
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, value, allUsers]);

  const handleSelectUser = (user) => {
    setIsOpen(false);
    onUserSelect(user.id); // On notifie le parent UNIQUEMENT lors d'une sélection
  };

  // CHANGEMENT CLÉ : La gestion de la saisie a été modifiée
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    // On ne notifie PAS le parent ici.
    // `onUserSelect(null);` a été SUPPRIMÉ.
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  
  const handleClear = () => {
      onUserSelect(null); // On notifie le parent pour vider la sélection
      setSearchTerm('');
      setIsOpen(false);
  }

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>


{label && (
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-1">
                                <Briefcase size={16} className="text-emerald-600" />
                                {label}
                            </label>
                        )}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => { setIsOpen(true); setIsFocused(true); }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {value ? ( // On affiche la croix si une valeur est sélectionnée
            <button type="button" onClick={handleClear} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
              <X size={20} />
            </button>
          ) : (
            <ChevronDown className="text-gray-400" size={20} />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/50 ${value === user.id ? 'bg-green-100 dark:bg-green-900' : ''}`}
              >
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={`https://ui-avatars.com/api/?name=${user.nom}+${user.prenoms}&background=random`}
                  alt={`Avatar de ${user.nom}`}
                />
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{user.nom} {user.prenoms}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
              <UserX size={32} className="mb-2" />
              <p className="text-sm font-medium">Aucun utilisateur trouvé.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}