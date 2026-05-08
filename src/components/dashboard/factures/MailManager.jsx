import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Send, CheckCircle2, Mail, 
  History, ArrowRight 
} from "lucide-react";
import { factureService } from "../../../services/factures.service";
import { useToasts } from "../../../hooks/useToasts";

export default function MailManager({ facture, onClose }) {
  const [loading, setLoading] = useState(null); // 'facture' | 'recap' | null
  const [done, setDone] = useState(false);
  const { showSuccess, showError } = useToasts();

  const handleSend = async (type) => {
    setLoading(type);
    try {
      if (type === 'facture') {
        await factureService.sendFactureMail(facture.id);
      } else {
        await factureService.sendRecapMail(facture.id);
      }
      setDone(true);
      showSuccess(`E-mail transmis avec succès au club ${facture.club?.name}`);
      setTimeout(() => onClose(), 2000);
    } catch (error) {
        console.log(error);
        
      showError(error?.response?.data?.error || "Échec de l'envoi de l'e-mail.");
      setLoading(null);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            {/* HEADER */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 text-[#f97316] rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-sm border border-orange-100 dark:border-orange-500/20">
                <Mail size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white leading-none">
                Transmission Mail
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Réf: {facture.reference} • {facture.club?.name}
              </p>
            </div>

            {/* CHOIX DES ENVOIS */}
            <div className="grid grid-cols-1 gap-4">
              {/* BOUTON FACTURE SIMPLE */}
              <button
                disabled={!!loading}
                onClick={() => handleSend('facture')}
                className="group relative flex items-center justify-between p-5 bg-white dark:bg-gray-800 border-2 border-slate-100 dark:border-white/5 rounded-3xl hover:border-[#f97316] transition-all text-left overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#f97316] transition-colors">
                    {loading === 'facture' ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase dark:text-white">Facture Originale</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Envoi de la pièce comptable seule</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-200 group-hover:text-[#f97316] group-hover:translate-x-1 transition-all" />
              </button>

              {/* BOUTON RÉCAPITULATIF */}
              <button
                disabled={!!loading}
                onClick={() => handleSend('recap')}
                className="group relative flex items-center justify-between p-5 bg-white dark:bg-gray-800 border-2 border-slate-100 dark:border-white/5 rounded-3xl hover:border-teal-500 transition-all text-left overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-teal-500 transition-colors">
                    {loading === 'recap' ? <Loader2 className="animate-spin" /> : <History size={20} />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase dark:text-white">Récapitulatif Financier</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Bilan des versements & Solde restant</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-200 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            <button onClick={onClose} className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">
                Annuler l'opération
            </button>
          </motion.div>
        ) : (
          /* ÉTAT DE SUCCÈS */
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="flex flex-col items-center justify-center text-center py-10"
          >
            <div className="w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-green-500/20 mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-black uppercase dark:text-white">Email Envoyé</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Dossier mis à jour</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}