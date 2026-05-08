import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function WelcomeModal({ isActive, onClose, children }) {
  const location = useLocation();
  const [isQcr, setIsQcr] = useState(false);

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "qcr") {
      setIsQcr(true);
    }
  }, [location.pathname]);

  // Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isActive) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  // Fermer avec Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Backdrop animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  // Modal animation
  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.7 },
    },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/30 dark:bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div
              className={`relative pb-4 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl backdrop-blur-xl border ${
                isQcr
                  ? "bg-transparent border-transparent"
                  : "bg-white dark:bg-gray-800/80 border-white/20 dark:border-gray-700/50"
              }`}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#10b981 #d1fae5", // Thumb vert (emerald 500) et Track vert clair (emerald 100)
              }}
            >
              {/* Scrollbar style Webkit */}
              <style>
                {`
                  ::-webkit-scrollbar {
                    width: 8px;
                  }
                  ::-webkit-scrollbar-track {
                    background: #d1fae5;
                    border-radius: 8px;
                  }
                  ::-webkit-scrollbar-thumb {
                    background-color: #10b981;
                    border-radius: 8px;
                  }
                  ::-webkit-scrollbar-thumb:hover {
                    background-color: #059669;
                  }
                  .dark ::-webkit-scrollbar-track {
                    background: #064e3b;
                  }
                  .dark ::-webkit-scrollbar-thumb {
                    background-color: #10b981;
                  }

                  /* Quand on est en mode QCR */
                  .qcr-mode label, 
                  .qcr-mode input,
                  .qcr-mode textarea,
                  .qcr-mode select {
                    color: white !important;
                  }
                  .qcr-mode input, 
                  .qcr-mode textarea, 
                  .qcr-mode select {
                    background-color: transparent !important;
                    border: 1px solid white !important;
                  }
                `}
              </style>

              {/* Bouton fermer */}
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="absolute top-3 right-3 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Contenu dynamique */}
              <div className={isQcr ? "qcr-mode" : ""}>{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}