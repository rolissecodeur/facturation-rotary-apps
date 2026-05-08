// src/components/DateRangePicker.jsx

import React from "react";

// CORRIGÉ: Le composant reçoit maintenant les valeurs et la fonction de rappel en props.
// Il ne gère plus son propre état.
export default function DateRangePicker({ dateDebut, dateFin, onChangeDates }) {
  
  // Fonction qui se déclenche quand la date de début change
  const handleDebutChange = (e) => {
    const newDateDebut = e.target.value;
    // On notifie le parent du changement, en lui envoyant la nouvelle
    // date de début et la date de fin actuelle.
    if (onChangeDates) {
      onChangeDates({ dateDebut: newDateDebut, dateFin });
    }
  };

  // Fonction qui se déclenche quand la date de fin change
  const handleFinChange = (e) => {
    const newDateFin = e.target.value;
    // On notifie le parent du changement, en lui envoyant la date de début
    // actuelle et la nouvelle date de fin.
    if (onChangeDates) {
      onChangeDates({ dateDebut, dateFin: newDateFin });
    }
  };

  return (
    <div className="flex max-sm:flex-col gap-2">
      <div className="w-full">
        <label htmlFor="date-debut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date Début
        </label>
        <input
          id="date-debut"
          type="date"
          // La valeur est directement celle passée par le parent.
          // `|| ''` pour s'assurer que la valeur est toujours une chaîne.
          value={dateDebut || ""}
          onChange={handleDebutChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
      <div className="w-full">
        <label htmlFor="date-fin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date Fin
        </label>
        <input
          id="date-fin"
          type="date"
          // La valeur est directement celle passée par le parent.
          value={dateFin || ""}
          onChange={handleFinChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
    </div>
  );
}