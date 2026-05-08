import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Hash, Loader2, Briefcase } from 'lucide-react';
import { useService } from "../services/data/useFetchService";

export default function SearchableServiceSelect({
    value,
    onServiceSelect,
    label = "Votre service",
    placeholder = "Rechercher un service...",
}) {
    const { data, isLoading } = useService({ page: 1, perPage: 1000 });
    const allServices = data?.allServices || data?.services?.data || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const getServiceLabel = (service) => {
        if (!service) return '';
        return service.libelle || 'Service inconnu';
    };

    useEffect(() => {
        if (value && allServices.length > 0) {
            const selected = allServices.find(ref => ref.id === value);
            if (selected) {
                setSearchTerm(getServiceLabel(selected));
            }
        } else if (!value) {
            setSearchTerm('');
        }
    }, [value, allServices]);

    const filteredServices = useMemo(() => {
        if (!isFocused && value) {
            return allServices;
        }

        const lowerCaseSearch = (searchTerm || '').toLowerCase();
        const selectedRef = allServices.find(ref => ref.id === value);
        
        if (selectedRef && lowerCaseSearch === getServiceLabel(selectedRef).toLowerCase()) {
            return allServices;
        }

        return allServices.filter(ref => {
            const labelStr = getServiceLabel(ref).toLowerCase();
            const description = (ref.description || '').toLowerCase();
            return labelStr.includes(lowerCaseSearch) || description.includes(lowerCaseSearch);
        });
    }, [searchTerm, allServices, value, isFocused]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                const selected = allServices.find(ref => ref.id === value);
                if (selected) {
                    setSearchTerm(getServiceLabel(selected));
                } else {
                    setSearchTerm('');
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, value, allServices]);

    const handleSelectService = (service) => {
        setIsOpen(false);
        setSearchTerm(getServiceLabel(service));
        onServiceSelect(service.id);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (!isOpen) {
            setIsOpen(true);
        }
    };
    
    const handleClear = () => {
        onServiceSelect(null);
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    value={searchTerm || ''}
                    onChange={handleInputChange}
                    onFocus={() => { setIsOpen(true); setIsFocused(true); }}
                    onBlur={() => setIsFocused(false)}
                    placeholder={isLoading ? "Chargement..." : placeholder}
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-50 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isLoading ? (
                         <Loader2 className="animate-spin text-emerald-500" size={18} />
                    ) : value ? (
                        <button type="button" onClick={handleClear} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X size={18} />
                        </button>
                    ) : (
                        <ChevronDown className="text-gray-400" size={18} />
                    )}
                </div>
            </div>

            {isOpen && !isLoading && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100">
                    {filteredServices.length > 0 ? (
                        filteredServices.map(service => (
                            <div
                                key={service.id}
                                onClick={() => handleSelectService(service)}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors ${value === service.id ? 'bg-emerald-100 dark:bg-emerald-900/50' : ''}`}
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center">
                                    <Briefcase className="text-emerald-600" size={16} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                                        {getServiceLabel(service)}
                                    </p>
                                    {service.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {service.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
                            <Hash size={32} className="mb-2 text-emerald-200" />
                            <p className="text-sm font-medium">Aucun service trouvé.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}