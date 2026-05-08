// src/contexts/socket.js

import React from "react";
import { io } from "socket.io-client";

// URL du backend
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

// On crée une seule instance de socket pour toute l'application.
// autoConnect: false est la clé ! Le socket attendra qu'on lui dise de se connecter.
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"], 
});

// On crée le contexte qui transportera cette instance.
export const SocketContext = React.createContext(socket);