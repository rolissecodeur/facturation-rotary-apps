import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Lock, ChevronRight } from 'lucide-react';

import { useToasts } from '../../hooks/useToasts';
import { authService } from '../../services/auth.service';
import { useHandleError } from '../../utils/FaillureValidationError';
import PasswordInput from './PasswordInput';

const ResetPasswordForm = ({ token, email, userId, onSwitchView }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ mode: 'onBlur' });
  const { showSuccess, showInfo } = useToasts();
  const handleError = useHandleError();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [hasCheckedToken, setHasCheckedToken] = useState(false);

  const fieldClasses = {
    labelClassName: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2",
    inputClassName: "h-14 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:border-[#f97316] transition-all",
  };

  useEffect(() => {
    if (!token || !email || !userId) return;
    if (hasCheckedToken) return;

    let cancelled = false;

    const checkTokenValidity = async () => {
      try {
        await authService.verifyResetToken({ token, email, userId });
        if (!cancelled) {
          showInfo("Token valide. Vous pouvez définir votre nouveau mot de passe.");
          setIsTokenValid(true);
          setHasCheckedToken(true);
        }
      } catch (error) {
        if (!cancelled) {
          handleError(error, "Le lien de réinitialisation est invalide ou a expiré.");
          setHasCheckedToken(true);
          setTimeout(() => onSwitchView('forgotPassword'), 1000);
        }
      }
    };

    checkTokenValidity();

    return () => {
      cancelled = true;
    };
  }, [token, email, userId, handleError, showInfo, hasCheckedToken, onSwitchView]);

  const onSubmit = async (data) => {
    try {
      await authService.resetPassword({ ...data, token, email, userId });
      showSuccess("Votre mot de passe a été modifié avec succès !", "Réinitialisation réussie");
      setTimeout(() => onSwitchView('login'), 1000);
    } catch (error) {
      handleError(error);
    }
  };

  const isFormDisabled = isSubmitting || !isTokenValid;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      
      <PasswordInput
        id="password"
        label="Nouveau mot de passe"
        icon={Lock}
        autoComplete="new-password"
        error={errors.password}
        disabled={isFormDisabled}
        {...fieldClasses}
        {...register('password', {
          required: 'Le nouveau mot de passe est requis',
          minLength: { value: 6, message: 'Au moins 6 caractères' }
        })}
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirmer le mot de passe"
        icon={Lock}
        autoComplete="new-password"
        error={errors.confirmPassword}
        disabled={isFormDisabled}
        {...fieldClasses}
        {...register('confirmPassword', {
          required: 'Confirmation requise',
          validate: (value) => value === watch('password') || 'Non identiques'
        })}
      />

      {/* BOUTON */}
      <button
        type="submit"
        disabled={isFormDisabled}
        className="w-full h-14 bg-[#2d3436] text-white rounded-xl flex items-center justify-center font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#f97316] shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <span>Réinitialiser</span>
            <ChevronRight size={16} strokeWidth={3} />
          </div>
        )}
      </button>

    </form>
  );
};

export default ResetPasswordForm;