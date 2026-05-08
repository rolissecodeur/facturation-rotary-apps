import React, { useState } from 'react';
import { Trash2, Loader2, ServerCrash } from 'lucide-react';
import { usersService } from '../../../services/users.service';
import ConfirmationInput from '../../../components/ConfirmationInput';
import { useToasts } from '../../../hooks/useToasts';

export default function DeleteUser({ user, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState(null);

  const { showSuccess, showError } = useToasts();

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await usersService.deleteUser(user.id);
      showSuccess(`L'utilisateur ${user.nom} a été supprimé avec succès.`, 'Suppression réussie');
      onSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data || "Une erreur est survenue lors de la suppression.";
      setError(errorMessage);
      showError(errorMessage, 'Erreur de suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-900 text-gray-200 rounded-lg">
      <div className="flex flex-col items-center text-center mb-6">
        <Trash2 className="text-red-500 mx-auto mb-4" size={48} strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-white">Supprimer l'utilisateur</h2>
        <p className="mt-2 text-gray-400">
          Supprimer définitivement <strong className="text-red-400">{user.nom}</strong>.
        </p>
        <p className="text-sm font-bold text-red-400">Cette action est irréversible.</p>
      </div>

      <div className="my-6">
        <ConfirmationInput 
          onValidationChange={(isValid) => setIsConfirmed(isValid)} 
          codeLength={6}
        />
      </div>
      {error && (
        <div className="flex items-center p-3 mb-4 text-sm text-red-300 bg-red-900/50 border border-red-700 rounded-lg">
          <ServerCrash className="flex-shrink-0 mr-3" size={20} />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleDelete}
        disabled={!isConfirmed || isDeleting}
        className="
          w-full flex items-center justify-center p-3 font-bold text-white rounded-lg transition-colors 
          bg-red-600 hover:bg-red-700 
          disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed
        "
      >
        {isDeleting ? (
          <>
            <Loader2 className="mr-2 animate-spin" size={20} />
            Suppression en cours...
          </>
        ) : (
          'Confirmer la suppression'
        )}
      </button>
    </div>
  );
}
