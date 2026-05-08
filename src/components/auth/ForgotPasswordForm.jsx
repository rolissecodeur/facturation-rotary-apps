import React from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Mail, ChevronRight } from 'lucide-react';

import { useToasts } from '../../hooks/useToasts';
import { authService } from '../../services/auth.service';
import { useHandleError } from "../../utils/FaillureValidationError";

import InputField from '../../components/InputField';

const ForgotPasswordForm = ({ onSwitchView }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onBlur' });
  const { showInfo } = useToasts();
  const handleError = useHandleError();

  const fieldClasses = {
    labelClassName: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2",
    inputClassName: "h-14 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:border-[#f97316] transition-all",
  };

  const onSubmit = async (data) => {
    try {
      const response = await authService.forgotPassword(data);
      showInfo(response.data.message, "Vérifiez vos emails");
      onSwitchView('login');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      
      <InputField
        id="email"
        label="Adresse mail"
        type="email"
        icon={Mail}
        autoComplete="email"
        error={errors.email}
        disabled={isSubmitting}
        {...fieldClasses}
        {...register('email', {
          required: 'L\'adresse e-mail est requise',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Veuillez entrer une adresse e-mail valide'
          }
        })}
      />

      {/* BOUTON */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-[#2d3436] text-white rounded-xl flex items-center justify-center font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#f97316] shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <span>Envoyer le lien</span>
            <ChevronRight size={16} strokeWidth={3} />
          </div>
        )}
      </button>

      {/* FOOTER */}
      <div className="text-center pt-2">
        <button 
          type="button" 
          onClick={() => onSwitchView('login')} 
          className="text-[10px] font-bold text-gray-400 hover:text-[#f97316] uppercase tracking-widest transition-colors"
        >
          ← Retour à la connexion
        </button>
      </div>

    </form>
  );
};

export default ForgotPasswordForm;