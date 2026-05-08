// src/services/socket.service.js

import { io } from "socket.io-client";

// URL du serveur AdonisJS (prend la valeur de l'environnement ou localhost par défaut)
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3333";
console.log(SOCKET_URL);
// Création d'une seule connexion socket
// Tous les fichiers qui importent "socket" utiliseront la même connexion
export const socket = io(SOCKET_URL, {
  // autoConnect: false, // mettre à false si on veut connecter plus tard avec socket.connect()
});

// --- Écouteurs de base pour suivre l'état de la connexion ---

// Quand la connexion réussit
socket.on("connect", () => {
  console.log("Connecté au serveur Socket.IO ! ID:", socket.id);
});

// Quand on est déconnecté
socket.on("disconnect", () => {
  console.log("Déconnecté du serveur Socket.IO.");
});

// Quand la connexion échoue
socket.on("connect_error", (err) => {
  console.error("Erreur de connexion Socket.IO :", err);
});
