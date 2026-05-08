import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useToasts } from '../hooks/useToasts';
import { commentaireService } from '../services/commentaire.service';

export default function CommentForm({ soul, comment, onSuccess }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { showSuccess, showError } = useToasts();
    const user = JSON.parse(localStorage.getItem("user"));
    
    const isEditMode = !!comment;

    useEffect(() => {
        if (isEditMode) {
            reset({ comment: comment.comment });
        } else {
            reset({ comment: '' });
        }
    }, [comment, reset, isEditMode]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {

            const payload = {
                comment: data.comment,
                soulId: soul.id,
                userId: user.id,
            };

            if (isEditMode) {
                await commentaireService.update(comment.id, payload);
                showSuccess("Commentaire modifié avec succès !");
            } else {
                
                await commentaireService.create(payload);
                showSuccess("Commentaire ajouté avec succès !");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            showError("Une erreur est survenue.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const formTitle = isEditMode ? 'Modifier le commentaire' : `Ajouter un commentaire pour ${soul?.prenom}`;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">{formTitle}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Contenu du commentaire
                    </label>
                    <textarea
                        id="comment"
                        {...register("comment", { required: "Le comment ne peut pas être vide." })}
                        rows="4"
                        className="mt-1 block w-full rounded-md sm:text-sm px-3 py-2 border dark:bg-gray-700 dark:text-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 outline-none"
                    ></textarea>
                    {errors.comment && <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-white rounded-lg transition-colors bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500"
                >
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                    <span>{isLoading ? 'Enregistrement...' : (isEditMode ? 'Enregistrer les modifications' : 'Ajouter le commentaire')}</span>
                </button>
            </form>
        </div>
    );
}