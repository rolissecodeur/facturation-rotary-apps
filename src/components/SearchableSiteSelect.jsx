import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Hash, Loader2, Calendar, Briefcase } from 'lucide-react';
import { useSite } from "../services/data/useFetchSite";

export default function SearchableSiteSelect({
    value,
    onSiteSelect,
    label = "Votre site",
    placeholder = "Rechercher une site...",
}) {
    const { data, isLoading } = useSite({ page: 1, perPage: 1000 });
    const allSites = data?.allSites || data?.sites?.data || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const getSiteLabel = (site) => {
        if (!site) return '';
        const siteName = site.libelle || 'Site inconnu';
        return `${siteName}`;
    };

    useEffect(() => {
        if (value && allSites.length > 0) {
            const selected = allSites.find(ref => ref.id === value);
            if (selected) {
                setSearchTerm(getSiteLabel(selected));
            }
        } else if (!value) {
            setSearchTerm('');
        }
    }, [value, allSites]);

    const filteredSites = useMemo(() => {
        if (!isFocused && value) {
            return allSites;
        }

        const lowerCaseSearch = (searchTerm || '').toLowerCase();
        const selectedRef = allSites.find(ref => ref.id === value);
        
        if (selectedRef && lowerCaseSearch === getSiteLabel(selectedRef).toLowerCase()) {
            return allSites;
        }

        return allSites.filter(ref => {
            const label = getSiteLabel(ref).toLowerCase();
            const description = (ref.description || '').toLowerCase();
            return label.includes(lowerCaseSearch) || description.includes(lowerCaseSearch);
        });
    }, [searchTerm, allSites, value, isFocused]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                const selected = allSites.find(ref => ref.id === value);
                if (selected) {
                    setSearchTerm(getSiteLabel(selected));
                } else {
                    setSearchTerm('');
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, value, allSites]);

    const handleSelectSite = (site) => {
        setIsOpen(false);
        setSearchTerm(getSiteLabel(site));
        onSiteSelect(site.id);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (!isOpen) {
            setIsOpen(true);
        }
    };
    
    const handleClear = () => {
        onSiteSelect(null);
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
                    {filteredSites.length > 0 ? (
                        filteredSites.map(site => (
                            <div
                                key={site.id}
                                onClick={() => handleSelectSite(site)}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/50 ${value === site.id ? 'bg-green-100 dark:bg-green-900' : ''}`}
                            >
                                <div className="flex-shrink-0">
                                    <Calendar className="text-green-500" size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                                        {getSiteLabel(site)}
                                    </p>
                                    {site.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {site.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
                            <Hash size={32} className="mb-2 text-green-300" />
                            <p className="text-sm font-medium">Aucune site trouvée.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}