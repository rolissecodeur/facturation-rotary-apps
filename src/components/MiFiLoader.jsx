import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const MiFiLoader = ({ text = "Chargement", subtext = "Rotary Management" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl"
    >
      <div className="relative flex flex-col items-center">
        {/* Conteneur du Logo avec pulsation */}
        {/* <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0px rgba(225, 112, 85, 0)",
              "0 0 40px rgba(225, 112, 85, 0.2)",
              "0 0 0px rgba(225, 112, 85, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 mb-10 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center justify-center"
        >
          <img src="/images/logo.png" alt="Rotary" className="w-full h-full object-contain" />
        </motion.div> */}

        {/* Spinner et Textes */}
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#e17055] mb-6" strokeWidth={2.5} />
          
          <motion.h2 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm font-black uppercase tracking-[0.4em] text-slate-900"
          >
            {text}
          </motion.h2>
          
          <div className="mt-3 flex items-center gap-3">
            <div className="h-[1px] w-8 bg-slate-200"></div>
            <p className="text-[10px] font-bold text-[#e17055] uppercase tracking-widest">
              {subtext}
            </p>
            <div className="h-[1px] w-8 bg-slate-200"></div>
          </div>
        </div>

        {/* Décoration de fond subtile */}
        <div className="absolute -z-10 w-64 h-64 bg-[#e17055]/5 blur-[100px] rounded-full"></div>
      </div>
    </motion.div>
  );
};

export default MiFiLoader;