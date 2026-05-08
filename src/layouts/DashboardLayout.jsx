// src/layouts/DashboardLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // ÉTAPE 1: Importer Outlet
import Profile from '../components/ProfileModal';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';

// ÉTAPE 2: Supprimer "children" des props. Le routeur s'en occupe maintenant.
export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <div className="absolute top-3 right-16 z-40">
        <Profile />
      </div>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <div className="flex flex-col md:pl-64 transition-all duration-300 ease-in-out">
          <Header onToggleSidebar={() => setSidebarOpen(true)} />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* ÉTAPE 3: Remplacer {children} par <Outlet /> */}
            {/* C'est ici que React Router injectera la page correspondante (DashboardPage, UsersPage, etc.) */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}