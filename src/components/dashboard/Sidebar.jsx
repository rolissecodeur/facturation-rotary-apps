import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import {
  LayoutDashboard, Users, ShieldCheck, Sparkles,
  CalendarDays, X, LogOut,
} from "lucide-react";

const sidebarGroups = [
  {
    title: "Analyse & Suivi",
    items: [
      { name: "Tableau de bord", to: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Gestion des Données",
    items: [
      { name: "Clubs", to: "/dashboard/clubs", icon: CalendarDays, permission: "readClub" },
      { name: "Factures", to: "/dashboard/factures", icon: CalendarDays, permission: "readFacture" },
    ],
  },
  {
    title: "Administration",
    items: [
      { name: "Utilisateurs", to: "/dashboard/users", icon: Users, permission: "readUser" },
      { name: "Permissions", to: "/dashboard/permissions", icon: ShieldCheck, permission: "readPermission" },
    ],
  },
];

// eslint-disable-next-line no-unused-vars
const NavItem = ({ to, icon: Icon, children }) => {
  const baseClasses = "flex items-center p-4 my-1 rounded-full font-medium transition-all duration-200";
  // Couleurs raffinées : orange-50 et orange logo (#f97316)
  const lightModeClasses = "text-gray-700 hover:bg-orange-50 hover:text-[#f97316]";
  const darkModeClasses = "dark:text-gray-300 dark:hover:bg-white/10";
  // Couleur active calquée sur le orange du logo
  const activeClasses = "bg-[#f97316] text-white shadow-lg dark:bg-[#f97316]/20 dark:text-orange-300";

  return (
    <NavLink to={to} end={to === "/dashboard"}
      className={({ isActive }) => `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${isActive ? activeClasses : ''}`}
    >
      <Icon className="w-5 h-5 mr-4 flex-shrink-0" />
      <span>{children}</span>
    </NavLink>
  );
};

const SidebarContent = ({ onClose }) => {
  const { can } = usePermissions();

  return (
    <div className="h-full w-full bg-gradient-to-b from-white to-slate-100 dark:from-gray-900 dark:to-slate-800 border-r border-slate-200 dark:border-white/10 p-4 flex flex-col">
       {/* LOGO SECTION */}
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Sparkles size={20} />
        </div>
        <div className="flex flex-col leading-none">
            <span className="text-lg font-black uppercase tracking-tighter dark:text-white">Rotary <span className="text-[#f97316]">Hub</span></span>
            <span className="text-[7px] font-bold uppercase tracking-[0.4em] text-slate-400">Management</span>
        </div>
      </div>

      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 p-1 md:hidden text-gray-500 hover:bg-gray-200 rounded-full">
          <X size={20} />
        </button>
      )}

      <nav className="flex-1 overflow-y-auto pr-2 -mr-2">
        {sidebarGroups.map((group) => {
          const visibleItems = group.items.filter(i => !i.permission || can(i.permission));
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} className="mb-6">
              {/* Couleur raffinée : Teal/Emeraude profond (#0d9488) pour les titres */}
              <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-[#0d9488] dark:text-teal-500 uppercase">
                {group.title}
              </h3>
              {visibleItems.map((item) => (
                <NavItem key={item.name} to={item.to} icon={item.icon}>{item.name}</NavItem>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-gray-700">
        <NavItem to="/logout" icon={LogOut}>Déconnexion</NavItem>
      </div>
    </div>
  );
};

export default function Sidebar({ isSidebarOpen, onClose }) {
  const variants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };

  return (
    <>
      <div className="hidden md:block fixed top-0 left-0 h-full w-64">
        <SidebarContent />
      </div>

      <motion.div
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-30 md:hidden ${isSidebarOpen ? "block" : "hidden"}`}
      />
      
      <motion.div
        variants={variants}
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="md:hidden fixed top-0 left-0 h-full w-64 z-40"
      >
        <SidebarContent onClose={onClose} />
      </motion.div>
    </>
  );
}