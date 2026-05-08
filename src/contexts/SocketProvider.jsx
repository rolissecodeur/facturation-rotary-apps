// src/contexts/SocketProvider.jsx

import React from "react";
// import PropTypes from "prop-types";
import { socket, SocketContext } from "./socket"; // On importe l'instance et le contexte

export const SocketProvider = ({ children }) => {
  // Ce Provider ne fait plus qu'une chose : fournir le socket via le contexte.
  // Toute la logique de connexion/déconnexion a été retirée.
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// SocketProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };