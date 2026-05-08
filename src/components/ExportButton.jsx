import React from 'react';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

export default function ExportButton({ data, disabled }) {

  const handleExport = () => {
    // 1. Regrouper les données comme dans le composant RapportTableau
    const groupedSouls = (data || []).reduce((acc, soul) => {
      const suiviPar = soul.suivi_par;
      const key = suiviPar ? suiviPar.id : "non-affecte";

      if (!acc[key]) {
        acc[key] = {
          user: suiviPar ? `${suiviPar.prenoms} ${suiviPar.nom}` : "Non Affecté",
          souls: [],
        };
      }
      acc[key].souls.push(soul);
      return acc;
    }, {});

    // 2. Construire les données pour la feuille de calcul, groupe par groupe
    const sheetData = [];
    const tableHeaders = ["Nom & Prénom", "Contact", "Date", "Type", "Statut", "Commentaires"];
    
    Object.values(groupedSouls).forEach(group => {
      // Ajouter une ligne vide pour l'espacement
      sheetData.push([]); 
      // Ajouter l'en-tête du groupe
      sheetData.push([`Suivi par : ${group.user}`]);
      // Ajouter les en-têtes du tableau
      sheetData.push(tableHeaders);

      // Ajouter les lignes de données pour ce groupe
      group.souls.forEach(soul => {
        const soulRow = [
          // Prénoms/Nom et email sur une nouvelle ligne (uniquement si l'email existe)
          `${soul.nom} ${soul.prenom}${soul.email ? `\n${soul.email}` : ''}`,
          
          soul.contact || 'N/A',
          
          soul.dates ? new Date(soul.dates).toLocaleDateString('fr-FR') : 'N/A',
          
          // Type en format court (NC/NV)
          soul.type ? soul.type.toUpperCase() : 'N/A',
          
          soul.statutPhoning || 'Non soumis',
          
          // Formatage spécifique des commentaires
          soul.commentaires && soul.commentaires.length > 0
            ? soul.commentaires.map((c, index) => {
                const date = new Date(c.createdAt).toLocaleDateString('fr-FR');
                return `${index + 1}-) ${date}\n${c.comment}`;
              }).join('\n\n') // Double saut de ligne pour espacer les commentaires
            : 'Aucun'
        ];
        sheetData.push(soulRow);
      });
    });

    // 3. Créer la feuille de calcul à partir du tableau de tableaux (AOA)
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // 4. Appliquer la mise en forme avancée
    const merges = [];
    const headerStyle = { font: { bold: true } };
    const groupHeaderStyle = { 
        font: { bold: true, sz: 14, color: { rgb: "FFFFFFFF" } },
        fill: { fgColor: { rgb: "FF6A0DAD" } } // Couleur violette
    };
    
    // Ajuster la largeur des colonnes
    worksheet['!cols'] = [ {wch: 40}, {wch: 20}, {wch: 12}, {wch: 10}, {wch: 15}, {wch: 50} ];
    
    let rowIndex = 0;
    Object.values(groupedSouls).forEach(group => {
        rowIndex++; // Ligne vide

        // Fusionner et styliser l'en-tête du groupe
        const groupHeaderRow = rowIndex;
        merges.push({ s: { r: groupHeaderRow, c: 0 }, e: { r: groupHeaderRow, c: tableHeaders.length - 1 } });
        const groupHeaderCell = XLSX.utils.encode_cell({ r: groupHeaderRow, c: 0 });
        if (worksheet[groupHeaderCell]) {
            worksheet[groupHeaderCell].s = groupHeaderStyle;
        }
        rowIndex++;

        // Styliser les en-têtes du tableau
        const tableHeaderRow = rowIndex;
        for (let i = 0; i < tableHeaders.length; i++) {
            const cell = XLSX.utils.encode_cell({ r: tableHeaderRow, c: i });
            if (worksheet[cell]) {
                worksheet[cell].s = headerStyle;
            }
        }
        
        // Appliquer le renvoi à la ligne pour les cellules de données
        for (let i = 0; i < group.souls.length; i++) {
            const dataRowIndex = tableHeaderRow + 1 + i;
            // Colonne Nom/Prénom/Email
            const nameCell = XLSX.utils.encode_cell({ r: dataRowIndex, c: 0 });
            if (worksheet[nameCell]) worksheet[nameCell].s = { alignment: { wrapText: true, vertical: 'top' } };
            // Colonne Commentaires
            const commentCell = XLSX.utils.encode_cell({ r: dataRowIndex, c: 5 });
            if (worksheet[commentCell]) worksheet[commentCell].s = { alignment: { wrapText: true, vertical: 'top' } };
        }
        
        rowIndex += group.souls.length;
    });

    worksheet['!merges'] = merges;

    // 5. Créer le classeur et déclencher le téléchargement
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport Groupé');
    XLSX.writeFile(workbook, 'Rapport_Appels_Groupe.xlsx');
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-green-600 text-green-600 hover:text-white hover:bg-green-600 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-700"
    >
      <Download size={16} />
      Exporter en Excel
    </button>
  );
}