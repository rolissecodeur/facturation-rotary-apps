import React, { useState } from 'react';
import { Trash2, Loader2, ServerCrash } from 'lucide-react';
import { clubService } from '../../../services/clubs.service';
import ConfirmationInput from '../../ConfirmationInput';
import { useToasts } from '../../../hooks/useToasts';

export default function DeleteClub({ clubId, clubName, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState(null);

  const { showSuccess, showError } = useToasts();

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await clubService.deleteClub(clubId);

      showSuccess(
        `Le club ${clubName} a été supprimé avec succès.`,
        'Suppression réussie'
      );

      onSuccess?.();
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.error ||
        "Une erreur est survenue lors de la suppression.";

      setError(errorMessage);
      showError(errorMessage, 'Erreur de suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-slate-100 dark:border-gray-700 shadow-xl">
      
      {/* HEADER */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4 shadow-sm">
          <Trash2 className="text-red-500" size={36} strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          Supprimer le club
        </h2>

        <p className="mt-2 text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
          Vous êtes sur le point de supprimer définitivement :
        </p>

        <span className="mt-2 px-4 py-1 rounded-full bg-red-100 text-red-600 text-xs font-black uppercase tracking-widest">
          {clubName}
        </span>

        <p className="text-[11px] font-bold text-red-400 mt-3 uppercase tracking-widest">
          Action irréversible
        </p>
      </div>

      {/* CONFIRMATION INPUT */}
      <div className="my-6">
        <ConfirmationInput
          onValidationChange={(isValid) => setIsConfirmed(isValid)}
          codeLength={6}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center p-3 mb-4 text-sm text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl">
          <ServerCrash className="flex-shrink-0 mr-3" size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleDelete}
        disabled={!isConfirmed || isDeleting}
        className={`
          w-full h-14 flex items-center justify-center gap-2 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all
          ${!isConfirmed || isDeleting
            ? "bg-slate-200 dark:bg-gray-700 text-slate-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 text-white shadow-lg active:scale-95"
          }
        `}
      >
        {isDeleting ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Suppression en cours...
          </>
        ) : (
          <>
            <Trash2 size={16} />
            Confirmer la suppression
          </>
        )}
      </button>
    </div>
  );
}