import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, Mail, Lock, ChevronRight } from 'lucide-react';

import { useToasts } from '../../hooks/useToasts';
import { authService } from '../../services/auth.service';
import { useHandleError } from "../../utils/FaillureValidationError";
import { useAuth } from '../../hooks/useAuth';

import InputField from '../../components/InputField';
import PasswordInput from './PasswordInput';

const LoginForm = ({ onSwitchView }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onBlur' });
  const navigate = useNavigate();
  const { showSuccess } = useToasts();
  const handleError = useHandleError();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await authService.login(data);
      const user = response.data?.user;

      if (!user || !user.token?.token) {
        throw new Error("Réponse du serveur invalide");
      }

      login(user);

      const fullName = `${user.nom} ${user.prenoms}`.trim();
      showSuccess(`Bienvenue, ${fullName} !`, "Connexion réussie");

      // Redirection vers ton dashboard spécifique
      setTimeout(() => navigate("/dashboard/factures"), 1000);
    } catch (error) {
      console.error("Erreur de connexion :", error);
      handleError(error);
    }
  };

  const fieldClasses = {
    labelClassName: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2",
    inputClassName: "h-14 bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:border-[#f97316] transition-all",
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* CHAMP EMAIL */}
        <InputField
          id="email"
          label="Adresse e-mail"
          type="email"
          icon={Mail}
          placeholder="votre@email.com"
          autoComplete="email"
          error={errors.email}
          disabled={isSubmitting}
          {...fieldClasses}
          {...register('email', { 
            required: 'L\'adresse e-mail est requise',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Format d\'email invalide'
            }
          })}
        />

        {/* CHAMP MOT DE PASSE */}
        <div className="relative">
          <PasswordInput
            id="password"
            label="Mot de passe"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password}
            disabled={isSubmitting}
            {...fieldClasses}
            {...register('password', { 
              required: 'Le mot de passe est requis' 
            })}
          />
          {/* BOUTON MOT DE PASSE OUBLIÉ */}
          <button 
            type="button" 
            onClick={() => onSwitchView('forgotPassword')} 
            className="absolute top-0 right-0 text-[9px] font-bold text-[#f97316] uppercase tracking-widest hover:underline"
          >
            Accès perdu ?
          </button>
        </div>
      </div>

      {/* BOUTON DE CONNEXION */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-[#2d3436] text-white rounded-xl flex items-center justify-center font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#f97316] shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <span>Se connecter</span>
            <ChevronRight size={16} strokeWidth={3} />
          </div>
        )}
      </button>

      {/* FOOTER DU FORMULAIRE */}
      <div className="text-center pt-2">
        <button 
          type="button" 
          // onClick={() => onSwitchView('register')} 
          className="text-[10px] font-bold text-gray-400 hover:text-[#f97316]  italic tracking-widest transition-colors"
        >
          Veuillez joindre contact@oraadvices.com pour avoir un accès.
          {/* Pas encore de compte ? <span className="text-[#f97316] underline decoration-2 underline-offset-4 ml-1">S'inscrire</span> */}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;