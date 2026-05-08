import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  Loader2, 
  CheckCircle2, 
  FileText, 
  Coins, 
  Calendar, 
  Info, 
  ScrollText 
} from "lucide-react";
import { factureService } from "../../../services/factures.service";
import InputField from "../../InputField";
import SearchableClubSelect from "../../SearchableClubSelect";
import { useToasts } from "../../../hooks/useToasts";
import { useHandleError } from "../../../utils/FaillureValidationError";

export default function FactureForm({ facture, onSuccess }) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    mode: "onBlur",
    defaultValues: { clubId: "" }
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess } = useToasts();
  const handleError = useHandleError();
  
  const user = JSON.parse(localStorage.getItem("user"));

  /* ───── INITIALISATION ÉDITION ───── */
  useEffect(() => {
    if (facture) {
      setIsEdit(true);
      reset({
        reference: facture.reference,
        designation: facture.designation || "",
        clubId: facture.clubId,
        montant: facture.montant,
        dates: facture.dates ? facture.dates.split('T')[0] : "",
      });
    }
  }, [facture, reset]);

  /* ───── SOUMISSION ───── */
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = { 
        ...data, 
        userId: user.id, 
        montant: Number(data.montant) 
      };

      if (isEdit) {
        await factureService.update(facture.id, payload);
        showSuccess("Facture mise à jour avec succès");
      } else {
        await factureService.create(payload);
        showSuccess("Nouvelle facture créée avec succès");
      }
      onSuccess?.();
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ───── STYLES INSPIRÉS DE FICHEFORM ───── */
  const textareaClasses = "w-full p-4 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-800 focus:bg-white outline-none focus:ring-4 focus:ring-[#f97316]/10 focus:border-[#f97316] transition-all min-h-[120px] resize-none dark:text-white";
  const labelLabelClasses = "block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1 flex items-center gap-2";

  return (
    <div className="p-2 max-h-[85vh] overflow-y-auto custom-scrollbar pr-4">
      
      {/* HEADER STICKY */}
      <div className="mb-10 text-center sm:text-left sticky top-0 bg-white dark:bg-slate-900 py-2 z-10">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none mb-2">
          {isEdit ? "Édition de la facture" : "Nouvelle Pièce Comptable"}
        </h2>
        <div className="h-1 w-12 bg-[#f97316] rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        
            {/* RÉFÉRENCE */}
            <InputField
              id="reference"
              label="Référence Facture"
              placeholder="Ex: FAC-001..."
              type="text"
              icon={FileText}
              error={errors.reference}
              {...register("reference", { required: "La référence est obligatoire." })}
            />

            {/* SÉLECTEUR DE CLUB */}
            <Controller
              name="clubId"
              control={control}
              rules={{ required: "Veuillez sélectionner un club" }}
              render={({ field }) => (
                <SearchableClubSelect
                  value={field.value}
                  onClubSelect={field.onChange}
                  error={errors.clubId}
                />
              )}
            />
       

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MONTANT */}
            <InputField
              id="montant"
              label="Montant Total (F CFA)"
              placeholder="0"
              type="number"
              icon={Coins}
              error={errors.montant}
              {...register("montant", { 
                required: "Le montant est requis",
                min: { value: 1, message: "Montant invalide" }
              })}
            />

            {/* DATE */}
            <InputField
              id="dates"
              label="Date d'émission"
              type="date"
              icon={Calendar}
              error={errors.dates}
              {...register("dates", { required: "La date est requise" })}
            />
        </div>

        {/* DÉSIGNATION (TEXTAREA STYLE FICHEFORM) */}
        <div>
          <label htmlFor="designation" className={labelLabelClasses}>
            <ScrollText size={12} className="text-[#f97316]" />
            Désignation des prestations
          </label>
          <textarea 
            {...register("designation", { required: "La désignation est obligatoire" })} 
            id="designation" 
            placeholder="Détaillez ici la nature de la facturation..."
            className={textareaClasses}
          ></textarea>
          {errors.designation && (
            <p className="text-[10px] text-red-500 font-bold mt-2 uppercase ml-2 italic">
              {errors.designation.message}
            </p>
          )}
        </div>

        {/* BOUTON DE VALIDATION (STICKY BOTTOM) */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 py-4 border-t border-gray-50 dark:border-gray-800">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#2d3436] text-white rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-[11px] 
                        hover:bg-[#f97316] shadow-xl shadow-gray-200 dark:shadow-none
                        transition-all duration-300 flex items-center justify-center gap-3 active:scale-95
                        disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>
                {isEdit ? "Sauvegarder les modifications" : "Générer la facture"}
              </span>
            </button>
        </div>
      </form>
    </div>
  );
}