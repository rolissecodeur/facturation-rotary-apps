// src/components/InvalidLink.jsx
import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Link2Off, Home } from "lucide-react";

export default function InvalidLink() {
  return (
    <div className="flex items-center justify-center dark:bg-gray-900 text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}    
        transition={{ duration: 0.5, ease: "easeOut" }} 
        className="flex flex-col items-center gap-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md"
      >
        {/* Icône d'erreur */}
        <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-full">
          <Link2Off className="w-16 h-16 text-red-500 dark:text-red-400" strokeWidth={1.5} />
        </div>

        {/* Textes informatifs */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Lien invalide ou expiré
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Oups ! Il semble que le lien que vous essayez d'utiliser n'est plus valide.
            Veuillez vérifier l'URL ou retourner à l'accueil.
          </p>
        </div>

        {/* Bouton retour accueil */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <Home size={20} />
          Retourner à l'accueil
        </Link>
      </motion.div>
    </div>
  );
}
