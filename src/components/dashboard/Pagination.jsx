// src/components/common/Pagination.jsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Une fonction helper pour générer les numéros de page à afficher
const getPaginationItems = (currentPage, totalPages) => {
  const delta = 1; // Nombre de pages à afficher de chaque côté de la page actuelle
  const range = [];

  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    range.unshift('...');
  }
  if (currentPage + delta < totalPages - 1) {
    range.push('...');
  }

  range.unshift(1);
  if (totalPages > 1) {
    range.push(totalPages);
  }

  // Élimine les doublons de "..." au cas où il n'y a qu'une page d'écart
  return [...new Set(range)];
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Le composant s'affiche maintenant toujours, comme demandé.
  // La logique pour le cacher si totalPages <= 1 est dans le parent.

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Page {currentPage} sur {totalPages}
      </span>
      <nav className="flex items-center gap-1">
        {/* Bouton Précédent */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center h-9 w-9 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Page précédente"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Numéros de page */}
        {paginationItems.map((item, index) => {
          if (item === '...') {
            return (
              <span key={`ellipsis-${index}`} className="flex items-center justify-center h-9 w-9 text-gray-400">
                ...
              </span>
            );
          }

          const isActive = item === currentPage;
          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              disabled={isActive}
              className={`
                flex items-center justify-center h-9 w-9 rounded-md text-sm font-semibold transition-colors
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-md cursor-default'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {item}
            </button>
          );
        })}

        {/* Bouton Suivant */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center h-9 w-9 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Page suivante"
        >
          <ChevronRight size={20} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;