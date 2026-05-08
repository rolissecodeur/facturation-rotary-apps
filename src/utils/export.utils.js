// src/utils/export.utils.js

// AMÉLIORATION 2 : Une fonction de formatage de date plus "humaine"
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Formate la date en JJ/MM/AAAA pour une meilleure lisibilité
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    console.error("Erreur lors de la conversion de la date:", e);
    return "";
  }
};

// Fonction pour s'assurer qu'une valeur est "propre" pour le CSV
const sanitizeValue = (value) => {
  if (value === null || value === undefined) return "";
  let strValue = String(value);

  // AMÉLIORATION 2 : Nettoyage spécifique pour les prénoms qui contiennent des virgules
  // On remplace la virgule par un espace pour éviter les problèmes dans Excel
  strValue = strValue.replace(/,/g, ' ');

  // Si la valeur contient encore des caractères spéciaux, on l'entoure de guillemets
  if (strValue.includes('"') || strValue.includes('\n')) {
    return `"${strValue.replace(/"/g, '""')}"`;
  }
  return strValue;
};

export const exportSoulsToCSV = (souls) => {
  if (!souls || souls.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }

  // AMÉLIORATION 1 : Tri des données par conseiller (le plus important !)
  const sortedSouls = [...souls].sort((a, b) => {
    const nameA = `${a.suivi_par?.nom || ''} ${a.suivi_par?.prenoms || ''}`.toUpperCase();
    const nameB = `${b.suivi_par?.nom || ''} ${b.suivi_par?.prenoms || ''}`.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const headers = [
    'Conseiller', 'Nom', 'Prénom', 'Contact', 'Email', 'Statut Phoning',
    'Type', 'Date Affectation', 'Ville', 'Connu Par', 'Sujet de prière'
  ];

  const rows = sortedSouls.map(soul => [
    // AMÉLIORATION 2 : Standardisation du nom du conseiller en "NOM Prénom"
    sanitizeValue(`${soul.suivi_par?.nom?.toUpperCase() || ''} ${soul.suivi_par?.prenoms || ''}`.trim()),
    sanitizeValue(soul.nom),
    sanitizeValue(soul.prenom), // Le nettoyage se fait dans sanitizeValue
    sanitizeValue(soul.contact),
    sanitizeValue(soul.email),
    sanitizeValue(soul.statutPhoning || 'Non traité'),
    sanitizeValue(soul.type),
    formatDate(soul.afecterLe), // Utilise la nouvelle fonction de formatage
    sanitizeValue(soul.ville),
    sanitizeValue(soul.connuPar),
    sanitizeValue(soul.message)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  
  // AMÉLIORATION 3 : Ajout du BOM pour garantir la bonne lecture des accents dans Excel
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `rapport-phoning-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};