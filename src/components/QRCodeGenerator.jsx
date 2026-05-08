// src/components/QRCodeGenerator.jsx
import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // <-- export nommé

/**
 * Génère un QR code à partir d'un lien.
 * @param {string} url - L'URL à encoder dans le QR code
 * @param {number} size - Taille du QR code (optionnel, défaut 128)
 */
const QRCodeGenerator = ({ url, size = 128 }) => {
  if (!url) return null; // ne rien afficher si pas de lien

  return (
    <div className="flex justify-center items-center">
      <QRCodeCanvas value={url} size={size} fgColor="#000" bgColor="#fff" />
    </div>
  );
};

export default QRCodeGenerator;
