import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  Loader2, Save, Check, ShieldCheck, 
  Users, Building2, FileText, Coins, Key 
} from "lucide-react";
import { permissionService } from "../../../services/permissions.service";
import { useToasts } from "../../../hooks/useToasts";
import clsx from "clsx";

// --- Configuration des catégories basées sur ton modèle ---
const permissionCategories = [
  {
    title: 'Gestion Utilisateurs',
    icon: Users,
    keys: ['readUser', 'createUser', 'updateUser', 'deleteUser']
  },
  {
    title: 'Gestion des Clubs',
    icon: Building2,
    keys: ['readClub', 'createClub', 'updateClub', 'deleteClub']
  },
  {
    title: 'Gestion Factures',
    icon: FileText,
    keys: ['readFacture', 'createFacture', 'updateFacture', 'deleteFacture']
  },
  {
    title: 'Gestion Règlements',
    icon: Coins,
    keys: ['readReglement', 'createReglement', 'updateReglement', 'deleteReglement']
  },
  {
    title: 'Système & Habilitations',
    icon: Key,
    keys: ['readPermission', 'updatePermission']
  }
];

const getPermissionLabel = (key) => {
  if (key.startsWith('read')) return "Lecture / Vue";
  if (key.startsWith('create')) return "Création";
  if (key.startsWith('update')) return "Modification";
  if (key.startsWith('delete')) return "Suppression";
  return key;
};

const PermissionCheckbox = ({ label, field }) => (
  <label className="flex items-center group cursor-pointer select-none p-2 rounded-xl hover:bg-white dark:hover:bg-gray-700/50 transition-all">
    <div className="relative flex items-center justify-center">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        {...field} 
        checked={!!field.value} 
      />
      <div className="w-5 h-5 border-2 border-slate-200 dark:border-gray-600 rounded-lg peer-checked:border-[#f97316] peer-checked:bg-[#f97316] transition-all"></div>
      <Check className={clsx(
        "absolute w-3.5 h-3.5 text-white transition-all transform",
        field.value ? "scale-100 opacity-100" : "scale-0 opacity-0"
      )} strokeWidth={4} />
    </div>
    <span className="ml-3 text-[11px] font-black uppercase tracking-tight text-slate-600 dark:text-slate-300 group-hover:text-[#f97316]">
        {label}
    </span>
  </label>
);

export default function PermissionForm({ permission, onSuccess }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: permission
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToasts();
  const userConnected = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    reset(permission);
  }, [permission, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await permissionService.update(permission.role.id, userConnected?.id, data);
      showSuccess(`Habilitations "${permission.role.libelle}" mises à jour`);
      onSuccess?.();
    } catch (err) {
      showError(err?.response?.data?.error || "Erreur de mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 max-w-5xl mx-auto flex flex-col h-full max-h-[85vh]">
      
      {/* HEADER STICKY */}
      <div className="mb-8 shrink-0 sticky top-0 dark:bg-gray-900 -z-10 pb-4 border-b border-slate-100 dark:border-gray-800 text-center sm:text-left">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 text-[#f97316] rounded-xl flex items-center justify-center shadow-sm">
                <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">
                Droit d'accès
            </h2>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f97316]">
          Profil : <span className="text-slate-400 dark:text-slate-500">{permission.role.libelle.replace(/_/g, " ")}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto custom-scrollbar pr-4 flex-1">
          <div className="gap-6">
            {permissionCategories.map((cat) => (
              <div 
                key={cat.title} 
                className="my-6 bg-slate-50 dark:bg-gray-800/40 rounded-3xl p-6 border-2 border-transparent hover:border-orange-100 dark:hover:border-orange-900/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-[#f97316]">
                    <cat.icon size={18} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest dark:text-white">
                    {cat.title}
                  </h3>
                </div>
                
                <div className="">
                  {cat.keys.map(key => (
                    <Controller
                      key={key}
                      name={key}
                      control={control}
                      render={({ field }) => (
                        <PermissionCheckbox
                          label={getPermissionLabel(key)}
                          field={field}
                        />
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-800 flex justify-end bg-white dark:bg-gray-900 z-20">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#2d3436] hover:bg-[#f97316] text-white font-black uppercase tracking-widest text-[11px] py-4 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
            <span>{isLoading ? "Enregistrement..." : "Appliquer les permissions"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}