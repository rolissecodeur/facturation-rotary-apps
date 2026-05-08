import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, ArrowLeft, ArrowRight, User, Mail, Lock, Phone } from "lucide-react"; 

import { useToasts } from "../../hooks/useToasts";
// import { authService } from "../../services/auth.service";
import { useHandleError } from "../../utils/FaillureValidationError";
import SearchableServiceSelect from "../SearchableServiceSelect";
import SearchableFonctionSelect from "../SearchableFonctionSelect";
import SearchableSiteSelect from "../SearchableSiteSelect";

import InputField from "../../components/InputField"; 
import PasswordInput from "./PasswordInput"; 

const RegisterForm = ({ onSwitchView }) => {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });
  
  const { showError } = useToasts();
  const handleError = useHandleError();

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedFonctionId, setSelectedFonctionId] = useState(null);
  const [selectedSiteId, setSelectedSiteId] = useState(null);

  // --- GESTION DES SELECTS ---
  const handleServiceSelect = (id) => {
    setSelectedServiceId(id);
    setValue("serviceId", id, { shouldValidate: true });
    trigger("serviceId");
  };
  const handleFonctionSelect = (id) => {
    setSelectedFonctionId(id);
    setValue("fonctionId", id, { shouldValidate: true });
    trigger("fonctionId");
  };
  const handleSiteSelect = (id) => {
    setSelectedSiteId(id);
    setValue("siteId", id, { shouldValidate: true });
    trigger("siteId");
  };

  // --- LOGIQUE DE NAVIGATION ---
  const handleNextStep = async () => {
    let isValid = false;

    // Étape 1 : Identité + Email + Contact
    if (step === 1) {
      isValid = await trigger(['nom', 'prenoms', 'email', 'contact']);
      if (isValid) setStep(2);
    }
    
    // Étape 2 : Poste (Service & Fonction)
    else if (step === 2) {
      if (!selectedServiceId || !selectedFonctionId) {
        isValid = await trigger(['serviceId', 'fonctionId']);
        if (!isValid) showError("Veuillez remplir tous les champs obligatoires.", "Champs manquants");
      } else {
        isValid = await trigger(['serviceId', 'fonctionId']);
      }
      
      if (isValid && selectedServiceId && selectedFonctionId) setStep(3);
    }

    // Étape 3 : Localisation (Site)
    else if (step === 3) {
      if (!selectedSiteId) {
        isValid = await trigger(['siteId']);
        if (!isValid) showError("Veuillez sélectionner un site.", "Champs manquants");
      } else {
        isValid = await trigger(['siteId']);
      }
      
      if (isValid && selectedSiteId) setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // eslint-disable-next-line no-unused-vars
  const onSubmit = async (data) => {
    try {
      //const payload = {...data, roleId : 3}
      // await authService.register(payload);
      // showSuccess(
      //   "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      //   "Inscription réussie"
      // );
      setTimeout(() => onSwitchView("login"), 1000);
    } catch (error) {
      handleError(error);
    }
  };

  // Titres des étapes
  const getStepTitle = () => {
    switch(step) {
      case 1: return "Identité & Contact";
      case 2: return "Votre Poste";
      case 3: return "Localisation";
      case 4: return "Sécurité du compte";
      default: return "";
    }
  };

  return (
    <>
      {/* Barre de progression */}
      <div className="mb-6 text-center">
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 block mb-1">
          Étape {step} sur 4
        </span>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {getStepTitle()}
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 dark:bg-gray-700">
            <div className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        
        {/* --- ÉTAPE 1 : NOM, PRÉNOMS, EMAIL, CONTACT --- */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                id="nom"
                label="Nom"
                type="text"
                icon={User}
                autoComplete="family-name"
                error={errors.nom}
                disabled={isSubmitting}
                {...register("nom", { required: "Le nom est requis" })}
              />

              <InputField
                id="prenoms"
                label="Prénoms"
                type="text"
                icon={User}
                autoComplete="given-name"
                error={errors.prenoms}
                disabled={isSubmitting}
                {...register("prenoms", { required: "Le prénom est requis" })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                id="email"
                label="Adresse mail"
                type="email"
                icon={Mail}
                autoComplete="email"
                error={errors.email}
                disabled={isSubmitting}
                {...register("email", {
                  required: "L'adresse e-mail est requise",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Veuillez entrer une adresse e-mail valide",
                  },
                })}
              />

              <InputField
                id="contact"
                label="Contact (Téléphone)"
                type="text"
                icon={Phone}
                error={errors.contact}
                disabled={isSubmitting}
                {...register("contact", {
                  required: "Le numéro de téléphone est requis",
                  pattern: {
                    value: /^[0-9]{8,15}$/,
                    message: "Numéro de téléphone invalide",
                  },
                })}
              />
            </div>
          </div>
        )}

        {/* --- ÉTAPE 2 : SERVICE & FONCTION --- */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <SearchableServiceSelect
                value={selectedServiceId}
                onServiceSelect={handleServiceSelect}
                label="Service"
                placeholder={"Rechercher un service..."}
              />
              <input 
                type="hidden" 
                {...register('serviceId', { required: 'Le service est requis' })} 
                value={selectedServiceId || ''} 
              />
              {errors.serviceId && <p className="mt-1 text-sm text-red-500">{errors.serviceId.message}</p>}
            </div>

            <div>
              <SearchableFonctionSelect
                value={selectedFonctionId}
                onFonctionSelect={handleFonctionSelect}
                label="Fonction"
                placeholder={"Rechercher une fonction..."}
              />
              <input 
                type="hidden" 
                {...register('fonctionId', { required: 'La fonction est requise' })} 
                value={selectedFonctionId || ''} 
              />
              {errors.fonctionId && <p className="mt-1 text-sm text-red-500">{errors.fonctionId.message}</p>}
            </div>
          </div>
        )}

        {/* --- ÉTAPE 3 : SITE --- */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <SearchableSiteSelect
                value={selectedSiteId}
                onSiteSelect={handleSiteSelect}
                label="Site"
                placeholder={"Rechercher un site..."}
              />
              <input 
                type="hidden" 
                {...register('siteId', { required: 'Le site est requis' })} 
                value={selectedSiteId || ''} 
              />
              {errors.siteId && <p className="mt-1 text-sm text-red-500">{errors.siteId.message}</p>}
            </div>
          </div>
        )}

        {/* --- ÉTAPE 4 : MOT DE PASSE (UNIQUEMENT) --- */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <PasswordInput
              id="password"
              label="Mot de passe"
              icon={Lock}
              autoComplete="new-password"
              error={errors.password}
              disabled={isSubmitting}
              {...register("password", {
                required: "Le mot de passe est requis",
                minLength: {
                  value: 6,
                  message: "Le mot de passe doit contenir au moins 6 caractères",
                },
              })}
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirmer le mot de passe"
              icon={Lock}
              autoComplete="new-password"
              error={errors.confirmPassword}
              disabled={isSubmitting}
              {...register("confirmPassword", {
                required: "Veuillez confirmer votre mot de passe",
                validate: (value) =>
                  value === watch("password") ||
                  "Les mots de passe ne correspondent pas",
              })}
            />
          </div>
        )}

        {/* --- NAVIGATION --- */}
        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="w-1/2 flex items-center justify-center text-emerald-600 border border-emerald-600 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Précédent
            </button>
          )}

          <button
            type={step === 4 ? "submit" : "button"}
            onClick={step < 4 ? handleNextStep : undefined}
            className={`${step === 1 ? 'w-full' : 'w-1/2'} flex items-center justify-center py-3 rounded-lg text-white font-semibold bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-emerald-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Traitement...
              </>
            ) : step < 4 ? (
              <>Suivant <ArrowRight className="ml-2 h-5 w-5" /></>
            ) : (
              "S'inscrire"
            )}
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Déjà un compte ?{" "}
          <button
            type="button"
            onClick={() => onSwitchView("login")}
            className="font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            Connectez-vous
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;