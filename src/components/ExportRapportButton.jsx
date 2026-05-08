import React, { useState } from 'react';
import { FileDown, Loader2 } from "lucide-react";
import { rapportSoumisService } from '../services/rapports_soumis.service';
import { generateRapportPDF } from '../utils/pdfGenerator';
import { useToasts } from '../hooks/useToasts';

export default function ExportRapportButton({ soumission, className }) {
  const [isExporting, setIsExporting] = useState(false);
  const { showError, showSuccess } = useToasts();

  const handleExport = async (e) => {
    e.stopPropagation(); // Évite de déclencher le clic de la carte si nécessaire
    setIsExporting(true);

    try {
      // 1. On récupère les détails complets depuis l'API
      const response = await rapportSoumisService.detailRapportSoumis(soumission.id);
      const details = response.data?.detailRapport?.data || response.data?.detailRapport || [];

      if (details.length === 0) {
        showError("Aucune donnée à exporter pour ce rapport.");
        return;
      }

      generateRapportPDF(soumission, details);
      showSuccess("PDF téléchargé avec succès !");
      
    } catch (error) {
      console.error("Erreur export PDF", error);
      showError("Impossible de générer le PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`p-2 rounded-lg transition-all duration-200 border ${className} 
        ${isExporting 
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-wait" 
          : "text-green-600 bg-green-50 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/50"
        }`}
      title="Exporter en PDF"
    >
      {isExporting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <FileDown size={16} />
      )}
    </button>
  );
}