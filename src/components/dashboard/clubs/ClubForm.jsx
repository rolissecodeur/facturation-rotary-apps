import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Loader2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Home,
  MapPin,
  Power,
  Info,
  Mail,
  MailPlus
} from "lucide-react";
import clsx from "clsx";

import { clubService } from "../../../services/clubs.service";
import InputField from "../../InputField";
import { useToasts } from "../../../hooks/useToasts";
import { useHandleError } from "../../../utils/FaillureValidationError";

export default function ClubForm({ club, onSuccess }) {
  const [step, setStep] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { showSuccess } = useToasts();
  const handleError = useHandleError();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      status: true
    }
  });

  const statusValue = watch("status");

  // Initialisation en mode édition
  useEffect(() => {
    if (club) {
      setIsEdit(true);
      reset({
        name: club.name,
        email: club.email,
        emailEnCopy: club.eemailEnCopy || club.emailEnCopy,
        address: club.address,
        description: club.description,
        status: !!club.status
      });
    }
  }, [club, reset]);

  // Validation par étape
  const handleNextStep = async (e) => {
    e.preventDefault();
    let fields = [];
    if (step === 1) fields = ["name", "email", "emailEnCopy"];

    const valid = await trigger(fields);
    if (valid) setStep(2);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        status: !!data.status,
      };

      if (isEdit) {
        await clubService.update(club.id, payload);
        showSuccess("Informations du club mises à jour");
      } else {
        await clubService.create(payload);
        showSuccess("Nouveau club créé avec succès");
      }
      onSuccess?.();
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const textareaClass =
    "w-full p-4 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-800 focus:bg-white outline-none focus:ring-4 focus:ring-[#f97316]/10 focus:border-[#f97316] transition-all min-h-[100px] resize-none";

  const labelClass =
    "block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1 flex items-center gap-2";

  return (
    <div className="p-3 max-h-[85vh] overflow-y-auto custom-scrollbar pr-2">
      {/* HEADER & PROGRESS */}
      <div className="mb-8 sticky top-0 bg-white dark:bg-gray-900 py-3 z-20 border-b border-gray-50 dark:border-gray-800">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {isEdit ? "Fiche Club" : "Nouveau Club"}
            </h2>
            <p className="text-[10px] font-bold text-[#f97316] uppercase tracking-widest">
              Configuration • Étape 0{step} / 02
            </p>
          </div>
          <div className="h-1 w-12 bg-[#f97316] rounded-full"></div>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#f97316] h-full transition-all duration-500 shadow-[0_0_10px_#f97316]"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ÉTAPE 1 : IDENTITÉ & EMAILS */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <InputField
              id="name"
              label="Nom du club"
              icon={Home}
              placeholder="Ex: Rotary Club Cotonou..."
              error={errors.name}
              {...register("name", { required: "Le nom est obligatoire" })}
            />

          
              <InputField
                id="email"
                label="Email Officiel"
                type="email"
                icon={Mail}
                placeholder="club@example.com"
                error={errors.email}
                {...register("email", { 
                  required: "Email requis",
                  pattern: { value: /^\S+@\S+$/i, message: "Email invalide" }
                })}
              />
              <InputField
                id="emailEnCopy"
                label="Email Trésorerie (Copie)"
                type="email"
                icon={MailPlus}
                placeholder="tresorerie@example.com"
                error={errors.emailEnCopy}
                {...register("emailEnCopy", { 
                  required: "Email de copie requis",
                  pattern: { value: /^\S+@\S+$/i, message: "Email invalide" }
                })}
              />
           
          </div>
        )}

        {/* ÉTAPE 2 : LOCALISATION & DÉTAILS */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <InputField
              id="address"
              label="Adresse / Ville"
              icon={MapPin}
              placeholder="Ex: Quartier Haie Vive, Rue 120"
              error={errors.address}
              {...register("address", { required: "L'adresse est requise" })}
            />

            <div>
              <label className={labelClass}>
                <Info size={12} className="text-[#f97316]" />
                Description & Notes
              </label>
              <textarea
                {...register("description", { required: "Une description est requise" })}
                className={textareaClass}
                placeholder="Informations complémentaires sur le club..."
              />
              {errors.description && <p className="text-[9px] text-red-500 mt-1 font-bold uppercase">{errors.description.message}</p>}
            </div>

            {/* STATUS SWITCH */}
            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-[#2d3436] text-white shadow-2xl">
              <div className="flex items-center gap-4">
                <div className={clsx(
                    "p-3 rounded-2xl transition-colors",
                    statusValue ? "bg-[#f97316] text-white" : "bg-gray-700 text-gray-400"
                )}>
                  <Power size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Disponibilité</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    Club {statusValue ? "actif dans le système" : "suspendu / inactif"}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" {...register("status")} />
                <div className="w-14 h-7 bg-gray-600 rounded-full peer peer-checked:bg-[#f97316] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-7"></div>
              </label>
            </div>
          </div>
        )}

        {/* ACTIONS FOOTER */}
        <div className="flex gap-4 pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 h-14 bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <ArrowLeft size={16} strokeWidth={3} /> Précédent
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-[2] h-14 bg-[#2d3436] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#f97316] transition-all shadow-xl active:scale-95"
            >
              Suivant <ArrowRight size={16} strokeWidth={3} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] h-14 bg-[#f97316] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} strokeWidth={3} />
              ) : (
                <CheckCircle2 size={20} strokeWidth={3} />
              )}
              {isEdit ? "Enregistrer les modifications" : "Finaliser la création"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}