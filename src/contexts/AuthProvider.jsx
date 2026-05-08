// src/contexts/AuthProvider.js

import React, { useState, useEffect, useCallback, useContext } from "react";
// import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket"; 
import { aggregatePermissions } from "../utils/permissions";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const socket = useContext(SocketContext); 
  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // On suppose que l'objet user contient maintenant une propriété 'role'
        // ex: user = { id: 1, name: "...", role: { id: 2, name: "Admin", Permission: {...} } }
        if (parsedUser.role) {
          setPermissions(aggregatePermissions(parsedUser.role));
        }

        // Si l'utilisateur est déjà connecté au rechargement, on connecte le socket
        if (socket.disconnected) {
            socket.auth = { token };
            socket.connect();
        }
      }
    } catch (error) {
      console.error("❌ [AuthProvider] Erreur lecture localStorage:", error);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []); // Exécuté une seule fois au montage

  useEffect(() => {
    if (!socket) return; 

    const handlePermissionsUpdate = (updatedRoleData) => {
      console.log('📡 [AuthProvider] Événement "permissions_updated" reçu. Mise à jour...');
      
      // On récupère l'user actuel pour vérifier si son rôle est celui qui a été mis à jour
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        try {
          const currentUser = JSON.parse(storedUser);

          // Si l'ID du rôle mis à jour correspond au rôle de l'utilisateur
          if (currentUser.role && currentUser.role.id === updatedRoleData.id) {
            
            // On met à jour le rôle dans l'objet user
            // Note: On garde updatedRoleData comme nouvelle source de vérité pour le rôle (et ses permissions)
            const updatedUser = { ...currentUser, role: updatedRoleData };
            
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setPermissions(aggregatePermissions(updatedRoleData));
            
            console.log("✅ [AuthProvider] Permissions mises à jour pour l'utilisateur courant.");
          }
        } catch (e) { console.error(e); }
      }
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    };
    
    socket.on('connect', () => console.log('✅ [AuthProvider] Socket connecté et authentifié.'));
    socket.on('disconnect', () => console.log('❌ [AuthProvider] Socket déconnecté.'));
    socket.on("permissions_updated", handlePermissionsUpdate);
    
    return () => {
      socket.off("permissions_updated", handlePermissionsUpdate);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket, queryClient]);

  const login = useCallback((userData) => {
    const token = userData?.token?.token;
    if (token) {
      localStorage.setItem("authToken", token);
      // On sauvegarde l'user complet (qui contient son role)
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      
      // Calcul des permissions basé sur le rôle unique
      if (userData.role) {
        setPermissions(aggregatePermissions(userData.role));
      }
      
      // ✅ LOGIQUE DE CONNEXION DU SOCKET
      socket.auth = { token };
      socket.connect();
    }
  }, [socket]);

  const logout = useCallback(() => {
    // ✅ LOGIQUE DE DÉCONNEXION DU SOCKET
    socket.disconnect();
    localStorage.clear();
    localStorage.removeItem('theme');
    setUser(null);
    setPermissions({});
    window.location.href = "/";
  }, [socket]);

  const value = { user, permissions, isLoading, isLoggedIn: !!user && !!localStorage.getItem("authToken"), login, logout };

  if (isLoading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};