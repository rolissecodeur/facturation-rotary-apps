import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { Loader2, ShieldOff, LayoutDashboard } from "lucide-react";

export default function ProtectedRoute({ children, permission }) {
  const { user, isLoading: authLoading } = useAuth();
  const { can, isLoading: permLoading } = usePermissions();

  // 1. Chargement initial
  if (authLoading || permLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-slate-500 bg-slate-50 dark:bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-2" />
        <p className="animate-pulse">Vérification des accès...</p>
      </div>
    );
  }

  // 2. Non connecté -> Redirection Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Connecté mais pas de permission -> Ecran d'erreur 403
  if (permission && !can(permission)) {
    return (
       <div className="flex items-center justify-center h-full py-20 px-4">
        <div className="text-center">
            <div className="flex flex-col items-center gap-4 text-red-500">
                <ShieldOff className="w-20 h-20" />
                <h2 className="text-3xl font-bold">Accès refusé</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Vous n'avez pas les droits nécessaires pour accéder à cette page. 
                    <br />
                    Permission requise : <span className="font-mono font-bold text-red-600 dark:text-red-400">'{permission}'</span>
                </p>
            </div>

            {/* Bouton de retour */}
            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 border  border-green-600 hover:bg-green-600 hover:text-white text-green-600 font-semibold rounded-xl transition-all shadow-green-600/20 active:scale-95"
            >
              <LayoutDashboard size={20} />
              Retour au Tableau de bord
            </Link>
        </div>
      </div>
    );
  }

  // 4. Tout est OK
  return children;
}