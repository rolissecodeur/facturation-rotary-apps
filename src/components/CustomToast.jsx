import React from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const toastConfig = {
  success: {
    Icon: CheckCircle2,
    accent: 'bg-emerald-500',
    styles: {
      wrapper: 'bg-white/95 dark:bg-[#0f172a]/95 border-emerald-100 dark:border-emerald-500/20',
      iconWrapper: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      title: 'text-slate-900 dark:text-white',
      message: 'text-slate-500 dark:text-slate-400',
      closeButton: 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10',
    },
  },
  error: {
    Icon: XCircle,
    accent: 'bg-red-500',
    styles: {
      wrapper: 'bg-white/95 dark:bg-[#0f172a]/95 border-red-100 dark:border-red-500/20',
      iconWrapper: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400',
      title: 'text-slate-900 dark:text-white',
      message: 'text-slate-500 dark:text-slate-400',
      closeButton: 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10',
    },
  },
  warning: {
    Icon: AlertTriangle,
    accent: 'bg-amber-500',
    styles: {
      wrapper: 'bg-white/95 dark:bg-[#0f172a]/95 border-amber-100 dark:border-amber-500/20',
      iconWrapper: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
      title: 'text-slate-900 dark:text-white',
      message: 'text-slate-500 dark:text-slate-400',
      closeButton: 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10',
    },
  },
  info: {
    Icon: Info,
    accent: 'bg-[#f97316]',
    styles: {
      wrapper: 'bg-white/95 dark:bg-[#0f172a]/95 border-slate-100 dark:border-white/5',
      iconWrapper: 'bg-orange-50 dark:bg-orange-500/10 text-[#f97316]',
      title: 'text-slate-900 dark:text-white',
      message: 'text-slate-500 dark:text-slate-400',
      closeButton: 'text-slate-400 hover:text-[#f97316] hover:bg-orange-50 dark:hover:bg-orange-500/10',
    },
  },
};

// logoSrc

const CustomToast = ({ t, type, title, message }) => {
  const config = toastConfig[type] || toastConfig.info;
  const { Icon, styles, accent } = config;

  return (
    <div
      className={clsx(
        "relative flex max-w-sm w-full shadow-2xl rounded-2xl pointer-events-auto border backdrop-blur-md overflow-hidden transition-all duration-300",
        styles.wrapper,
        t.visible ? 'animate-enter' : 'animate-leave'
      )}
    >
      {/* Barre d'accentuation latérale */}
      <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5", accent)} />

      <div className="flex items-start p-4 w-full">
        {/* Icône stylisée */}
        <div className="flex-shrink-0">
          <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", styles.iconWrapper)}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
        </div>

        {/* Contenu Texte */}
        <div className="ml-4 flex-1 pt-0.5">
          <p className={clsx("text-sm font-black uppercase tracking-tight", styles.title)}>
            {title}
          </p>
          <p className={clsx("mt-1 text-xs font-medium leading-relaxed", styles.message)}>
            {message}
          </p>
          
          {/* Signature ORA ADVICES en petit */}
          <div className="mt-3 flex items-center gap-1.5 opacity-30 select-none">
            <span className="h-px w-4 bg-current" />
            <span className="text-[7px] font-black uppercase tracking-[0.3em] dark:text-white">
                ORA ADVICES
            </span>
          </div>
        </div>

        {/* Bouton de fermeture */}
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => toast.dismiss(t.id)}
            className={clsx("rounded-lg p-1.5 transition-all duration-200 focus:outline-none", styles.closeButton)}
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Logo en filigrane (Commenté comme demandé) */}
      {/* 
      {logoSrc && (
        <img
          src={logoSrc}
          alt=""
          className="absolute -bottom-4 -right-2 h-16 w-auto opacity-10 dark:opacity-5 pointer-events-none transform -rotate-12 grayscale"
        />
      )} 
      */}
    </div>
  );
};

export default CustomToast;