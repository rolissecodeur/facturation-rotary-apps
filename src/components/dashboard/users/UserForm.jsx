import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, CheckCircle2, User, Mail, Phone, Camera, 
  ShieldCheck, Lock, ArrowRight, ArrowLeft, X, Sparkles
} from "lucide-react";

import { usersService } from "../../../services/users.service";
import { useToasts } from "../../../hooks/useToasts";
import { useHandleError } from "../../../utils/FaillureValidationError";

import InputField from "../../InputField";
import PasswordInput from "../../../components/auth/PasswordInput";
import clsx from "clsx";

const ROLES = [
  { id: 1, label: 'Super Administrateur' },
  { id: 2, label: 'Administrateur' },
  { id: 3, label: 'Trésorier' },
  { id: 4, label: 'Membre' },
];

const StepIndicator = ({ step }) => (
  <div className="mb-10 sticky top-0 dark:bg-slate-900 py-3 -z-10">
    <div className="flex justify-between items-end mb-4">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-2">
            Gestion Utilisateur
        </h2>
        <p className="text-[10px] font-bold text-[#f97316] uppercase tracking-widest">Étape 0{step} / 02</p>
      </div>
      <div className="h-1.5 w-12 bg-[#f97316] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></div>
    </div>
    <div className="w-full bg-slate-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: "50%" }}
        animate={{ width: step === 1 ? "50%" : "100%" }}
        className="bg-[#f97316] h-full transition-all duration-500" 
      />
    </div>
  </div>
);

export default function UserForm({ user, onSuccess, from }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const { showSuccess, showWarning } = useToasts();
  const handleError = useHandleError();
  const isEdit = !!user;

  const { register, handleSubmit, trigger, watch, reset, formState: { errors } } = useForm({
    mode: "onBlur",
    defaultValues: { status: true }
  });

  const isStatusActive = watch("status");
  const watchPhoto = watch("photo");

  useEffect(() => {
    if (user) {
      reset({
        nom: user.nom,
        prenoms: user.prenoms,
        email: user.email,
        contact: user.contact,
        status: user.status === true || user.status === 1,
        roleId: user.roleId || user.role?.id,
      });
      if (user.photoProfil) {
        setPreview(`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/${user.photoProfil}`);
      }
    }
  }, [user, reset]);

  // Prévisualisation Photo
  useEffect(() => {
    if (watchPhoto && watchPhoto[0]) {
      const file = watchPhoto[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchPhoto]);

  const handleNextStep = async (e) => {
    e.preventDefault();
    const fieldsToValidate = ["nom", "prenoms", "email", "contact"];
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep(2);
    } else {
      const firstError = fieldsToValidate.find(f => errors[f]);
      showWarning(`Champ "${firstError}" requis ou invalide.`);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("nom", data.nom);
    formData.append("prenoms", data.prenoms);
    formData.append("email", data.email);
    formData.append("contact", data.contact || "");
    formData.append("roleId", String(data.roleId));
    formData.append("status", data.status ? "true" : "false");

    if (data.password) formData.append("password", data.password);
    if (data.photo && data.photo[0]) formData.append("photo", data.photo[0]);

    try {
      if (isEdit) {
        await usersService.update(user.id, formData);
        showSuccess("Compte mis à jour");
      } else {
        await usersService.create(formData);
        showSuccess("Compte créé avec succès");
      }
      onSuccess?.();
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 max-h-[85vh] overflow-y-auto custom-scrollbar pr-4">
      <StepIndicator step={step} />

      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} className="space-y-8">
        
        <AnimatePresence mode="wait">
          {/* ÉTAPE 1 : PROFIL PERSONNEL */}
          {step === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* PHOTO AVATAR */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 dark:border-gray-800 shadow-xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-105">
                    {preview ? <img src={preview} className="w-full h-full object-cover" alt="Avatar" /> : <User size={40} className="text-slate-300" />}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-[#f97316] p-2.5 rounded-2xl text-white cursor-pointer hover:bg-orange-600 transition-all shadow-lg border-4 border-white dark:border-gray-900">
                    <Camera size={18} />
                    <input type="file" accept="image/*" className="hidden" {...register("photo")} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="nom" label="Nom" icon={User} error={errors.nom} {...register("nom", { required: "Le nom est requis" })} />
                <InputField id="prenoms" label="Prénoms" icon={User} error={errors.prenoms} {...register("prenoms", { required: "Le prénom est requis" })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="email" label="Adresse Email" type="email" icon={Mail} error={errors.email} {...register("email", { required: "Email requis", pattern: { value: /^\S+@\S+$/i, message: "Email invalide" } })} />
                <InputField id="contact" label="Contact Téléphonique" icon={Phone} error={errors.contact} {...register("contact", { required: "Le contact est requis" })} />
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 2 : ACCÈS & RÔLE */}
          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="p-6 bg-slate-50 dark:bg-gray-800/50 rounded-[2rem] border-2 border-slate-100 dark:border-gray-700 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-[#f97316]"><Lock size={18}/></div>
                    <span className="text-xs font-black uppercase tracking-widest dark:text-white">Sécurité du compte</span>
                </div>
                
                <PasswordInput
                    id="password"
                    label={isEdit ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                    icon={Lock}
                    error={errors.password}
                    {...register("password", { required: !isEdit && "Le mot de passe est obligatoire" })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                   <ShieldCheck size={14} className="text-[#f97316]" /> Attribution du rôle
                </label>
                <select
                  {...register("roleId", { required: "Veuillez choisir un rôle" })}
                  className="w-full h-14 px-5 border-2 border-slate-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 outline-none focus:border-[#f97316] font-bold text-sm transition-all"
                >
                  <option value="">-- Sélectionner un rôle --</option>
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                {errors.roleId && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.roleId.message}</p>}
              </div>

              {from === "dashboard" && (
                <div className={clsx(
                  "flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all",
                  isStatusActive ? "bg-green-50 border-green-100 dark:bg-green-900/10" : "bg-red-50 border-red-100 dark:bg-red-900/10"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={clsx("p-3 rounded-2xl", isStatusActive ? "bg-green-500 text-white" : "bg-red-500 text-white shadow-lg")}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight dark:text-white">Statut du compte</p>
                      <p className={clsx("text-[10px] font-bold uppercase mt-1", isStatusActive ? "text-green-600" : "text-red-500")}>
                        {isStatusActive ? "Accès Autorisé" : "Accès Bloqué"}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" {...register("status")} />
                    <div className="w-14 h-7 bg-slate-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-7"></div>
                  </label>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION FOOTER */}
        <div className="flex gap-4 pt-6 border-t border-slate-50 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900 py-4">
          {step > 1 && (
            <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="flex-1 h-14 bg-slate-50 dark:bg-gray-800 text-slate-500 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-95"
            >
              <ArrowLeft size={16} /> Précédent
            </button>
          )}

          {step === 1 ? (
            <button 
                type="button" 
                onClick={handleNextStep} 
                className="flex-[2] h-14 bg-[#2d3436] text-white rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-[#f97316] transition-all shadow-xl active:scale-95"
            >
              Suivant <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] h-14 bg-[#f97316] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              {isEdit ? "Enregistrer les modifications" : "Valider l'inscription"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}