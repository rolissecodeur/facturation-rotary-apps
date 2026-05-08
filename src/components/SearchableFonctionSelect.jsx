import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Hash, Loader2, Calendar, Briefcase } from 'lucide-react';
import { useFonction } from "../services/data/useFetchFonction";

export default function SearchableFonctionSelect({
    value,
    onFonctionSelect,
    label = "Votre fonction",
    placeholder = "Rechercher une fonction...",
}) {
    const { data, isLoading } = useFonction({ page: 1, perPage: 1000 });
    const allFonctions = data?.allFonctions || data?.fonctions?.data || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const getFonctionLabel = (fonction) => {
        if (!fonction) return '';
        const fonctionName = fonction.libelle || 'Fonction inconnu';
        return `${fonctionName}`;
    };

    useEffect(() => {
        if (value && allFonctions.length > 0) {
            const selected = allFonctions.find(ref => ref.id === value);
            if (selected) {
                setSearchTerm(getFonctionLabel(selected));
            }
        } else if (!value) {
            setSearchTerm('');
        }
    }, [value, allFonctions]);

    const filteredFonctions = useMemo(() => {
        if (!isFocused && value) {
            return allFonctions;
        }

        const lowerCaseSearch = (searchTerm || '').toLowerCase();
        const selectedRef = allFonctions.find(ref => ref.id === value);
        
        if (selectedRef && lowerCaseSearch === getFonctionLabel(selectedRef).toLowerCase()) {
            return allFonctions;
        }

        return allFonctions.filter(ref => {
            const label = getFonctionLabel(ref).toLowerCase();
            const description = (ref.description || '').toLowerCase();
            return label.includes(lowerCaseSearch) || description.includes(lowerCaseSearch);
        });
    }, [searchTerm, allFonctions, value, isFocused]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                const selected = allFonctions.find(ref => ref.id === value);
                if (selected) {
                    setSearchTerm(getFonctionLabel(selected));
                } else {
                    setSearchTerm('');
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, value, allFonctions]);

    const handleSelectFonction = (fonction) => {
        setIsOpen(false);
        setSearchTerm(getFonctionLabel(fonction));
        onFonctionSelect(fonction.id);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (!isOpen) {
            setIsOpen(true);
        }
    };
    
    const handleClear = () => {
        onFonctionSelect(null);
        setSearchTerm('');
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="w-full">

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
                    value={searchTerm || ''}
                    onChange={handleInputChange}
                    onFocus={() => { setIsOpen(true); setIsFocused(true); }}
                    onBlur={() => setIsFocused(false)}
                    placeholder={isLoading ? "Chargement..." : placeholder}
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isLoading ? (
                         <Loader2 className="animate-spin text-green-500" size={20} />
                    ) : value ? (
                        <button type="button" onClick={handleClear} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                            <X size={20} />
                        </button>
                    ) : (
                        <ChevronDown className="text-gray-400" size={20} />
                    )}
                </div>
            </div>

            {isOpen && !isLoading && (
                <div className="absolute z-50 mt-1 w-[332px] max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                    {filteredFonctions.length > 0 ? (
                        filteredFonctions.map(fonction => (
                            <div
                                key={fonction.id}
                                onClick={() => handleSelectFonction(fonction)}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/50 ${value === fonction.id ? 'bg-green-100 dark:bg-green-900' : ''}`}
                            >
                                <div className="flex-shrink-0">
                                    <Calendar className="text-green-500" size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                                        {getFonctionLabel(fonction)}
                                    </p>
                                    {fonction.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {fonction.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
                            <Hash size={32} className="mb-2 text-green-300" />
                            <p className="text-sm font-medium">Aucune fonction trouvée.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}