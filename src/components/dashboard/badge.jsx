import React, { useState } from "react";
import WelcomeModal from "../WelcomeModal";
import { Eye, Shield, UserCog, Users, Heart, UserPlus, Cpu, User } from "lucide-react";

const baseClasses =
  "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 transition-colors duration-200";

const Badge = ({ label, className, icon: Icon }) => (
  <span className={`${baseClasses} ${className}`}>
    {Icon && <Icon size={14} />}
    {label}
  </span>
);

const RoleBadge = ({ role }) => {
  const rolesMap = {
    super_admin: {
      label: "Super Admin",
      className:
        "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300",
      icon: Shield,
    },
    admin: {
      label: "Admin",
      className:
        "bg-sky-100 text-sky-800 hover:bg-sky-200 dark:bg-sky-900/50 dark:text-sky-300",
      icon: UserCog,
    },
    conseiller: {
      label: "Conseiller",
      className:
        "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300",
      icon: Users,
    },
    berger: {
      label: "Berger",
      className:
        "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300",
      icon: Heart,
    },
    assistant_berger: {
      label: "Assistant Berger",
      className:
        "bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200 dark:bg-fuchsia-900/50 dark:text-fuchsia-300",
      icon: UserPlus,
    },
    operateur: {
      label: "Opérateur",
      className:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300",
      icon: Cpu,
    },
    operator: {
      label: "Operator",
      className:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300",
      icon: Cpu,
    },
  };

  // Si aucun rôle n'est défini
  if (!role) {
    return (
      <Badge
        label="Aucun rôle"
        icon={User}
        className="bg-slate-100 text-slate-800 hover:bg-slate-200"
      />
    );
  }

  // Récupération de la configuration du rôle
  const key = role?.libelle?.toLowerCase?.() || "inconnu";
  
  const roleData = rolesMap[key] || {
    label: role?.libelle || "Inconnu",
    className: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    icon: User,
  };

  return (
    <Badge
      label={roleData.label}
      className={roleData.className}
      icon={roleData.icon}
    />
  );
};


const StatusBadge = ({ status }) => {
  const isActive = status === true || status === "Actif";
  return (
    <Badge
      label={isActive ? "Actif" : "Inactif"}
      className={
        isActive
          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300"
          : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
      }
    />
  );
};

const ConnectedBadge = ({ status }) => (
  <Badge
    label={status ? "En ligne" : "Déconnecté"}
    className={
      status
        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300"
        : "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-100 dark:text-rose-700"
    }
  />
);
const EmailVerifiedBadge = ({ status }) => (
  <Badge
    label={status ? "Vérifié" : "Non vérifié"}
    className={
      status
        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300"
        : "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-100 dark:text-rose-700"
    }
  />
);

const SoulTypeBadge = ({ type }) => (
  <Badge
    label={type || "N/A"}
    className="capitalize bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300"
  />
);

const StatutRejeterBadge = ({ affectation }) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  if (affectation?.statutPhoning !== "Rejeter") return null;

  return (
    <>
      <button
        onClick={() => setShowCommentModal(true)}
        className="flex items-center gap-1.5 text-rose-600 hover:text-rose-800 transition-colors"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
        </span>
        <Eye className="w-4 h-4" />
      </button>

      <WelcomeModal
        isActive={showCommentModal}
        onClose={() => setShowCommentModal(false)}
      >
        <h3 className="text-lg font-bold mb-2">Raison du rejet</h3>
        <p className="bg-slate-100 p-3 rounded-md dark:bg-slate-700">
          {affectation?.messagePolePhoning || "Aucune raison spécifiée."}
        </p>
      </WelcomeModal>
    </>
  );
};

const StatutPhoningBadge = ({ statutPhoning }) => {
  const styles = {
    Rejeter:
      "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-100 dark:text-rose-700",
    Valider:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300",
    Soumis:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300",
    "À Faire":
      "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-100 dark:text-rose-700",
    "À Vérifier":
      "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300",
  };

  let value =
    !statutPhoning || statutPhoning.trim() === ""
      ? "À Faire"
      : statutPhoning === "Soumis"
      ? "À Vérifier"
      : statutPhoning;

  return <Badge label={value} className={styles[value] || styles.Rejeter} />;
};


const FiStatusBadge = ({ soul }) => {
  if (!soul?.famille_dimpact) return null;
  return (
    <Badge
      label={soul.statutFi ? "Actif" : "Inactif"}
      className={
        soul.statutFi
          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300"
          : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300"
      }
    />
  );
};

const TriColorBadge = ({ value }) => {
  const styles = {
    Oui: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300",
    Non: "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-100 dark:text-rose-700",
    Rien: "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300",
  };
  return <Badge label={value} className={styles[value] || "bg-slate-100 text-slate-800"} />;
};

const SingleRoleBadge = ({ role }) => {
  const rolesMap = {
    super_admin: { label: "Super Admin", className: "bg-emerald-100 text-emerald-800", icon: Shield },
    admin: { label: "Admin", className: "bg-sky-100 text-sky-800", icon: UserCog },
    conseiller: { label: "Conseiller", className: "bg-amber-100 text-amber-800", icon: Users },
    berger: { label: "Berger", className: "bg-orange-100 text-orange-800", icon: Heart },
    assistant_berger: { label: "Assistant Berger", className: "bg-fuchsia-100 text-fuchsia-800", icon: UserPlus },
    operateur: { label: "Opérateur", className: "bg-slate-100 text-slate-800", icon: Cpu },
    operator: { label: "Operator", className: "bg-slate-100 text-slate-800", icon: Cpu },
  };

  const key = role?.toLowerCase?.() || 'inconnu';
  const roleData = rolesMap[key] || {
      label: role || "Inconnu",
      className: "bg-slate-100 text-slate-800",
      icon: User,
  };

  return (
      <Badge
        label={roleData.label}
        className={roleData.className}
        icon={roleData.icon}
      />
  );
};

export {
  RoleBadge,
  StatusBadge,
  StatutPhoningBadge,
  EmailVerifiedBadge,
  ConnectedBadge,
  FiStatusBadge,
  TriColorBadge,
  SoulTypeBadge,
  StatutRejeterBadge,
  SingleRoleBadge,
};
