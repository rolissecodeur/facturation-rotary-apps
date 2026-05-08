import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Hash, Loader2, Shield, Building2 } from 'lucide-react';
import { useFetchClub } from "../services/data/useFetchClub";
import clsx from "clsx";

export default function SearchableClubSelect({
    value,
    onClubSelect,
    label = "",
    placeholder = "Rechercher un club...",
    error
}) {
    const { data, isLoading } = useFetchClub({ page: 1, perPage: 1000 });
    const allClubs = data?.clubs?.data || data?.data || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const wrapperRef = useRef(null);

    const getClubLabel = (club) => club?.name || '';

    // Synchronisation du terme de recherche avec la valeur sélectionnée
    useEffect(() => {
        if (value && allClubs.length > 0) {
            const selected = allClubs.find(c => c.id === Number(value));
            if (selected) setSearchTerm(getClubLabel(selected));
        } else if (!value) {
            setSearchTerm('');
        }
    }, [value, allClubs]);

    // Filtrage des clubs
    const filteredClubs = useMemo(() => {
        if (!isFocused && value) return allClubs;
        const search = (searchTerm || '').toLowerCase();
        return allClubs.filter(c => 
            getClubLabel(c).toLowerCase().includes(search) || 
            (c.address || '').toLowerCase().includes(search)
        );
    }, [searchTerm, allClubs, value, isFocused]);

    // Fermeture au clic extérieur
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                const selected = allClubs.find(c => c.id === Number(value));
                setSearchTerm(selected ? getClubLabel(selected) : '');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value, allClubs]);

    const handleSelect = (club) => {
        setIsOpen(false);
        setSearchTerm(getClubLabel(club));
        onClubSelect(club.id);
    };

    return (
        <div ref={wrapperRef} className="w-full relative">
            {label && (
                <label className=" text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1 flex items-center gap-2">
                    <Building2 size={12} className="text-[#f97316]" />
                    {label}
                </label>
            )}

            <div className="relative group">
                <Search className={clsx(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                    isFocused ? "text-[#f97316]" : "text-gray-400"
                )} size={18} />
                
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
                    onFocus={() => { setIsOpen(true); setIsFocused(true); }}
                    onBlur={() => setIsFocused(false)}
                    placeholder={isLoading ? "Chargement..." : placeholder}
                    disabled={isLoading}
                    className={clsx(
                        "w-full h-14 pl-12 pr-10 bg-gray-50 dark:bg-gray-800 border-2 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none transition-all",
                        error ? "border-red-500" : "border-gray-100 dark:border-gray-700 focus:border-[#f97316] focus:bg-white dark:focus:bg-gray-900"
                    )}
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    {isLoading ? (
                        <Loader2 className="animate-spin text-[#f97316]" size={18} />
                    ) : value ? (
                        <button type="button" onClick={() => { onClubSelect(null); setSearchTerm(''); }} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X size={18} />
                        </button>
                    ) : (
                        <ChevronDown className="text-gray-400" size={18} />
                    )}
                </div>
            </div>

            {isOpen && !isLoading && (
                <div className="absolute z-[60] mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border-2 border-slate-100 dark:border-gray-700 rounded-2xl shadow-2xl custom-scrollbar">
                    {filteredClubs.length > 0 ? (
                        filteredClubs.map(club => (
                            <div
                                key={club.id}
                                onClick={() => handleSelect(club)}
                                className={clsx(
                                    "flex items-center gap-3 p-4 cursor-pointer transition-colors border-b last:border-none border-slate-50 dark:border-gray-700",
                                    value === club.id ? "bg-orange-50 dark:bg-orange-900/20" : "hover:bg-slate-50 dark:hover:bg-gray-700/50"
                                )}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    value === club.id ? "bg-[#f97316] text-white" : "bg-slate-100 dark:bg-gray-700 text-slate-400"
                                )}>
                                    <Shield size={16} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className={clsx("font-black text-[10px] uppercase truncate", value === club.id ? "text-[#f97316]" : "text-slate-700 dark:text-slate-200")}>
                                        {club.name}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{club.address || 'Sans adresse'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                            <Hash size={24} className="mb-2 text-slate-200" />
                            <p className="text-[10px] font-black text-slate-400 uppercase">Aucun club trouvé</p>
                        </div>
                    )}
                </div>
            )}
            
            {error && <p className="mt-1.5 text-[9px] font-black text-red-500 uppercase ml-2">{error.message}</p>}
        </div>
    );
}