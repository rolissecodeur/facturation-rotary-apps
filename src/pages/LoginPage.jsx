import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../config/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlayCircle, ShieldCheck, Coins, FileCheck, 
  BarChart3, Sparkles, KeyRound, UserPlus, 
  LockKeyhole, ArrowLeftCircle, BellRing, Loader2 
} from "lucide-react";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import MiFiLoader from "../components/MiFiLoader";

// --- CONFIGURATION DYNAMIQUE DES TITRES ---
const viewConfig = {
  login: { title: "Espace Trésorerie", subtitle: "Portail privé de gestion financière des clubs Rotary.", icon: LockKeyhole },
  register: { title: "Nouveau Club", subtitle: "Créez un compte pour un nouveau club affilié.", icon: UserPlus },
  forgotPassword: { title: "Accès perdu ?", subtitle: "Récupérez vos accès de manière sécurisée.", icon: KeyRound },
  resetPassword: { title: "Réinitialisation", subtitle: "Veuillez définir votre nouveau mot de passe.", icon: ShieldCheck },
};

// --- VARIANTES D'ANIMATION ---
const textReveal = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const backgroundGlow = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.2, 0.4, 0.2],
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
  }
};

const PlaceholderLogo = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
      <path d="M50 10 L55 25 L70 25 L60 35 L65 50 L50 40 L35 50 L40 35 L30 25 L45 25 Z" fill="#f97316" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#0d9488" strokeWidth="8" strokeDasharray="15 5" />
      <circle cx="50" cy="50" r="10" fill="#0d9488" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-xs font-black text-teal-900 mt-0.5">R</span>
    </div>
  </div>
);

export default function LoginPage() {
  const [view, setView] = useState("login");
  const [resetParams, setResetParams] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // --- LOGIQUE ACTIVATION ---
  const activeAccountMutation = useMutation({
    mutationFn: ({ token, email, userId }) =>
      axiosInstance.post(`/verif_email?token=${token}&email=${email}&userId=${userId}`),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Compte activé avec succès !");
      setTimeout(() => { navigate("/login"); setView("login"); }, 2000);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Erreur d'activation");
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1200);
    const render = searchParams.get("render");
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    if (render === "register" && token && email && userId) activeAccountMutation.mutate({ token, email, userId });
    if (render === "reset-password" && token && email && userId) {
      setResetParams({ token, email, userId });
      setView("resetPassword");
    }
    return () => clearTimeout(timer);
  }, [searchParams]);

  const currentConfig = viewConfig[view] || viewConfig.login;
  const IconHeader = currentConfig.icon;
  const showLoader = isPageLoading || activeAccountMutation.isLoading;

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      
      {/* 1. LOADER */}
      <AnimatePresence>
        {showLoader && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
            <MiFiLoader 
              text={activeAccountMutation.isLoading ? "Activation" : "Chargement"} 
              subtext="Sécurisation de l'accès Rotary Hub..." 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen w-full flex relative">
        
        {/* --- SECTION GAUCHE : FORMULAIRE --- */}
        <div className="w-full lg:w-[35%] flex flex-col p-8 sm:p-12 lg:p-16 justify-between relative z-20 bg-white border-r border-slate-100">
          <div className="w-full max-w-sm mx-auto">
            {/* Logo Brand */}
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-3">
                <PlaceholderLogo />
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-black uppercase tracking-tighter text-teal-950">Rotary</span>
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#f97316]">Management</span>
                </div>
              </div>
              <Link to="/" className="text-slate-400 hover:text-[#f97316] transition-colors">
                <ArrowLeftCircle size={24} />
              </Link>
            </div>

            {/* En-tête dynamique */}
            <div className="mb-10 text-center lg:text-left">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 text-[#f97316] mb-6">
                  <IconHeader size={24} />
               </div>
               <h3 className="text-2xl font-black text-teal-950 tracking-tight uppercase leading-none">{currentConfig.title}</h3>
               <p className="text-gray-400 text-sm mt-3 font-medium italic leading-relaxed">{currentConfig.subtitle}</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={view} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {view === "login" && <LoginForm onSwitchView={setView} />}
                {view === "register" && <RegisterForm onSwitchView={setView} />}
                {view === "forgotPassword" && <ForgotPasswordForm onSwitchView={setView} />}
                {view === "resetPassword" && resetParams && (
                  <ResetPasswordForm token={resetParams.token} email={resetParams.email} userId={resetParams.userId} onSwitchView={setView} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8">
             <button onClick={() => navigate("/help")} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#f97316] transition-colors flex items-center gap-2">
               <PlayCircle size={14} /> Support IT
             </button>
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2024 Rotary Hub</span>
          </div>
        </div>

        {/* --- SECTION DROITE : VISUEL HERO (STRICTEMENT TON SCHEMA) --- */}
        <div className="hidden lg:flex flex-1 relative bg-[#0a0a0a] items-center justify-center p-12 overflow-hidden">
          
          <motion.div variants={backgroundGlow} animate="animate" className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#f97316]/20 blur-[100px] rounded-full z-0" />
          <motion.div variants={backgroundGlow} animate="animate" className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full z-0" />

          <div className="absolute inset-8 rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/5 bg-teal-950">
            <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2000" alt="Rotary" className="w-full h-full object-cover opacity-30 grayscale-[30%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <motion.div initial="hidden" animate="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-10 w-full max-w-4xl px-12">
            
            <motion.div animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-12 left-10 text-orange-400">
              <Sparkles size={40} />
            </motion.div>

            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-black text-white tracking-widest uppercase mb-12">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Gestion de trésorerie automatisée
            </motion.div>

            <div className="mb-10 flex overflow-hidden">
              <motion.h1 variants={textReveal} className="flex flex-col">
                <span className="text-4xl xl:text-6xl font-black leading-tight text-white uppercase tracking-tighter">Simplifiez la</span>
                <span className="text-4xl xl:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] via-white to-[#f97316] bg-[length:300%_auto] animate-shimmer uppercase tracking-tighter">
                  Vie de votre Club
                </span>
              </motion.h1>
            </div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6 max-w-2xl">
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group">
                  <FileCheck className="text-[#f97316] group-hover:scale-110 transition-transform" size={24}/>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Facturation</span>
                    <p className="text-gray-400 text-[10px] mt-1 leading-tight">Automatisation complète des cotisations.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group">
                  <BellRing className="text-teal-400 group-hover:scale-110 transition-transform" size={24}/>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Relances</span>
                    <p className="text-gray-400 text-[10px] mt-1 leading-tight">Suivi mensuel intelligent des impayés.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group">
                  <Coins className="text-teal-400 group-hover:scale-110 transition-transform" size={24}/>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Banque</span>
                    <p className="text-gray-400 text-[10px] mt-1 leading-tight">Rapprochement bancaire simplifié.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group">
                  <BarChart3 className="text-[#f97316] group-hover:scale-110 transition-transform" size={24}/>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Reporting</span>
                    <p className="text-gray-400 text-[10px] mt-1 leading-tight">États financiers et statistiques globales.</p>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 20s linear infinite; }
          @keyframes shimmer { to { background-position: 200% center; } }
          .animate-shimmer { animation: shimmer 4s linear infinite; background-size: 200% auto; }
        `}} />
      </div>
    </div>
  );
}