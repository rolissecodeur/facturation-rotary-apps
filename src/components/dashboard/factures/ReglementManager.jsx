// src/components/dashboard/factures/ReglementManager.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Plus, Pencil, Trash2, Coins, 
  Calendar, CheckCircle2, Wallet, X, AlertCircle, ShieldAlert 
} from "lucide-react";
import clsx from "clsx";

import { reglementService } from "../../../services/reglements.service";
import { factureService } from "../../../services/factures.service";
import { useToasts } from "../../../hooks/useToasts";
import { useHandleError } from "../../../utils/FaillureValidationError";
import { FormattedDate } from "../../FormattedDate";
import InputField from "../../InputField";
import ConfirmationInput from "../../ConfirmationInput";

export default function ReglementManager({ factureId, onRefreshParent }) {
  const [facture, setFacture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [idToDelete, setIdToDelete] = useState(null);
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);

  const { showSuccess } = useToasts();
  const handleError = useHandleError();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // 1. Charger les données (On sépare le chargement initial du rafraîchissement silencieux)
  const loadData = useCallback(async (isSilent = false) => {
    if (!factureId) return;
    if (!isSilent) setLoading(true);
    try {
      const res = await factureService.show(factureId);
      setFacture(res.data.facture);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [factureId]); // Retrait de handleError des dépendances pour éviter la boucle

  // Effet de montage unique par factureId
  useEffect(() => { 
    loadData(); 
  }, [factureId]); // Ne dépend que de l'ID de la facture

  const resetForm = () => {
    setEditingId(null);
    setIdToDelete(null);
    setIsDeleteConfirmed(false);
    reset({ montant: "", dates: "" });
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { ...data, factureId, montant: Number(data.montant) };
      if (editingId) {
        await reglementService.update(editingId, payload);
        showSuccess("Règlement mis à jour");
      } else {
        await reglementService.create(payload);
        showSuccess("Règlement enregistré");
      }
      resetForm();
      loadData(true); // Rafraîchissement silencieux sans relancer le loader global
      onRefreshParent?.(); 
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (reg) => {
    setIdToDelete(null);
    setEditingId(reg.id);
    setValue("montant", reg.montant);
    setValue("dates", reg.dates ? reg.dates.split('T')[0] : "");
  };

  const handleDeleteRequest = (id) => {
    setEditingId(null);
    setIdToDelete(id);
    setIsDeleteConfirmed(false);
  };

  const executeDelete = async () => {
    if (!isDeleteConfirmed) return;
    setSubmitting(true);
    try {
      await reglementService.deleteReglement(idToDelete);
      showSuccess("Versement supprimé");
      resetForm();
      loadData(true);
      onRefreshParent?.();
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDU CONDITIONNEL ---

  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#f97316]" size={48} />
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Synchronisation du solde...</p>
    </div>
  );

  if (!facture) return (
    <div className="p-10 text-center flex flex-col items-center gap-3">
      <AlertCircle className="text-red-500" size={40} />
      <p className="text-sm font-bold text-slate-600 uppercase">Données indisponibles</p>
    </div>
  );

  const totalPaye = facture.reglements?.reduce((sum, r) => sum + Number(r.montant), 0) || 0;
  const reste = facture.montant - totalPaye;

  return (
  <div className="space-y-8 max-h-[92vh] overflow-y-auto custom-scrollbar p-2">
  
  {/* 1. HEADER & BILAN FINANCIER GÉANT */}
  <div className="space-y-2">
    <div className="flex flex-col items-center text-center">
      <span className="px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-[#f97316] text-[10px] font-black uppercase tracking-[0.2em] border border-orange-100 dark:border-orange-500/20 shadow-sm">
        Pièce Réf. {new Intl.NumberFormat('fr-FR').format(facture.reference)}
      </span>
      <h2 className="text-2xl font-black uppercase dark:text-white mt-4 tracking-tight leading-none">
        {facture.club?.name}
      </h2>
      <span className="text-[12px] font-black text-white/60 uppercase tracking-[0.2em] mt-2">{totalPaye} F payés</span>
    </div>

    <div className="grid grid-cols-2 gap-0 bg-[#2d3436] rounded-lg overflow-hidden shadow-lg border border-white/5">
      <div className="p-2 flex flex-col items-center justify-center border-r border-white/5">
        <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Montant Global</span>
        <div className="flex items-center gap-2 text-white">
          <Wallet size={18} className="text-orange-400" />
          <span className="text-2xl font-black tracking-tight">{new Intl.NumberFormat('fr-FR').format(facture.montant)} F</span>
        </div>
      </div>
      <div className="p-2 flex flex-col items-center justify-center bg-white/[0.02]">
        <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Solde à recouvrer</span>
        <div className="flex items-center gap-2 text-red-500">
          <Coins size={18} />
          <span className="text-2xl font-black tracking-tight">{new Intl.NumberFormat('fr-FR').format(reste)} F</span>
        </div>
      </div>
    </div>
  </div>

  {/* 2. ZONE DYNAMIQUE : FORMULAIRE OU SUPPRESSION */}
  <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-slate-50 dark:border-white/5 p-4 shadow-sm transition-all">
    <AnimatePresence mode="wait">
      {!idToDelete ? (
        <motion.div 
          key="form-mode" 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 text-[#f97316] rounded-2xl flex items-center justify-center shadow-inner">
              <Plus size={20} strokeWidth={3} />
            </div>
            <h3 className="text-xs font-black uppercase dark:text-white tracking-widest">
              {editingId ? 'Modifier la ligne' : 'Ajouter un règlement'}
            </h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <InputField 
                id="montant" label="Montant du versement" type="number" icon={Wallet} 
                error={errors.montant} {...register("montant", { required: "Montant requis" })} 
              />
              <InputField 
                id="dates" label="Date de l'opération" type="date" icon={Calendar} 
                error={errors.dates} {...register("dates", { required: "Date requise" })} 
              />
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={submitting} 
                className="flex-[2] h-14 bg-[#2d3436] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#f97316] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-black/10"
              >
                {submitting ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
                {editingId ? 'Modifier' : 'Enregistrer'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="flex-1 h-14 flex items-center justify-center bg-slate-100 dark:bg-gray-700 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
                  <X size={20}/>
                </button>
              )}
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div 
          key="delete-mode" 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0 }} 
          className="flex flex-col items-center text-center py-4"
        >
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-500/10">
            <ShieldAlert size={32} />
          </div>
          <h3 className="text-sm font-black uppercase text-red-600 mb-2">Sécurité de suppression</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-8 tracking-widest leading-relaxed max-w-[280px]">
            Saisissez le code confidentiel pour confirmer le retrait de ce versement
          </p>
          
          <div className="mb-8">
            <ConfirmationInput onValidationChange={(val) => setIsDeleteConfirmed(val)} codeLength={6} />
          </div>

          <div className="flex gap-4 w-full max-w-sm">
            <button onClick={resetForm} className="flex-1 h-14 bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase text-[10px] active:scale-95 transition-all">
              Annuler
            </button>
            <button 
              onClick={executeDelete} 
              disabled={!isDeleteConfirmed || submitting} 
              className="flex-[1.5] h-14 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] disabled:opacity-30 shadow-xl shadow-red-500/20 active:scale-95 transition-all"
            >
              {submitting ? <Loader2 className="animate-spin" size={16}/> : 'Supprimer définitivement'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>

  {/* 3. HISTORIQUE DES RÈGLEMENTS */}
  <div className="space-y-5 px-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Journal des versements</h3>
      </div>
      <div className="px-3 py-1 bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-100 dark:border-gray-700">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
          {facture.reglements?.length || 0} Opération(s)
        </span>
      </div>
    </div>

    <div className="overflow-hidden border border-slate-100 dark:border-gray-800 rounded-lg bg-white dark:bg-[#0a0a0a] shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-gray-800/50 text-[8px] font-black text-slate-400 border-b border-slate-100 dark:border-gray-800">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3 text-right">Mt Encaissé</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
          {facture.reglements?.length > 0 ? (
            facture.reglements.map((reg) => (
              <tr key={reg.id} className={clsx(
                "transition-all group",
                idToDelete === reg.id ? "bg-red-50/30 dark:bg-red-900/10" : "hover:bg-slate-50/50 dark:hover:bg-white/5"
              )}>
                <td className="px-2 py-4 text-[11px] font-bold text-slate-700 dark:text-slate-300 align-middle">
                  <FormattedDate createdAt={reg.dates} />
                </td>
                <td className="px-6 py-4 text-right align-middle">
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg font-black text-xs">
                    {new Intl.NumberFormat('fr-FR').format(reg.montant)} F
                  </span>
                </td>
                <td className="px-4 py-4 text-right align-middle">
                  <div className="flex justify-end gap-1.5 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(reg)} className="p-2 bg-white dark:bg-gray-800 text-blue-500 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 hover:scale-110 transition-all"><Pencil size={12}/></button>
                    <button onClick={() => handleDeleteRequest(reg.id)} className="p-2 bg-white dark:bg-gray-800 text-red-500 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 hover:scale-110 transition-all"><Trash2 size={12}/></button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-20 text-center">
                <div className="flex flex-col items-center opacity-20">
                  <Coins size={48} className="mb-4 text-slate-300" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Aucun versement historique</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
}