import React, { useState } from 'react';
import { Trash2, Loader2, ServerCrash, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { factureService } from '../../../services/factures.service';
import ConfirmationInput from '../../ConfirmationInput';
import { useToasts } from '../../../hooks/useToasts';

export default function DeleteFacture({ id, reference, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState(null);

  const { showSuccess, showError } = useToasts();

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await factureService.deleteFacture(id);

      showSuccess(
        `La facture ${reference} a été supprimée avec succès.`,
        'Suppression réussie'
      );

      onSuccess?.();
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.error ||
        "Une erreur est survenue lors de la suppression de la facture.";

      setError(errorMessage);
      showError(errorMessage, 'Erreur de suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-slate-100 dark:border-white/5 relative overflow-hidden">
      
      {/* GLOW DE DANGER EN FOND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* ICON CONTAINER */}
        <div className="w-20 h-20 rounded-[2rem] bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 flex items-center justify-center mb-6 shadow-xl shadow-red-500/5">
          <Trash2 className="text-red-500" size={32} strokeWidth={2} />
        </div>

        {/* TEXTS */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#2d3436] dark:text-white uppercase tracking-tight leading-none">
            Supprimer la Facture
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest">
            Retrait définitif de la comptabilité
          </p>
        </div>

        <div className="mt-8 p-6 w-full rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 italic">
            Confirmez-vous la suppression de la pièce :
          </p>
          <div className="text-lg font-black text-red-600 dark:text-red-500 uppercase tracking-tighter">
            Réf: {reference || "Inconnue"}
          </div>
        </div>

        {/* CONFIRMATION CODE SECTION */}
        <div className="w-full mt-8">
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-500">
             <AlertTriangle size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">Validation de sécurité</span>
          </div>
          <ConfirmationInput
            onValidationChange={(isValid) => setIsConfirmed(isValid)}
            codeLength={6}
          />
        </div>

        {/* ERROR BOX */}
        {error && (
          <div className="mt-6 flex items-center p-4 w-full text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-2xl animate-in shake duration-300">
            <ServerCrash className="flex-shrink-0 mr-3" size={16} />
            <span className="uppercase tracking-tight text-left">{error}</span>
          </div>
        )}

        {/* ACTIONS */}
        <div className="w-full mt-8">
          <button
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className={`
              w-full h-16 flex items-center justify-center gap-3 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all duration-300
              ${!isConfirmed || isDeleting
                ? "bg-slate-100 dark:bg-gray-800 text-slate-400 border-2 border-slate-200 dark:border-gray-700 cursor-not-allowed opacity-50"
                : "bg-red-600 hover:bg-red-700 text-white shadow-2xl shadow-red-500/30 border-2 border-transparent active:scale-95"
              }
            `}
          >
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Suppression...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Supprimer la pièce comptable
              </>
            )}
          </button>
          
          <p className="mt-4 text-[9px] font-bold text-red-400/60 uppercase tracking-widest">
            Attention : Cette action est irréversible et supprimera les règlements associés.
          </p>
        </div>
      </div>
    </div>
  );
}