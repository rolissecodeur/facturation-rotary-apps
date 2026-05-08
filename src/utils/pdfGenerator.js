// src/utils/pdfGenerator.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateTime } from "luxon";

export const generateRapportPDF = (soumission, details) => {
  const doc = new jsPDF();
console.log(soumission);

  // --- 1. CONFIGURATION & COULEURS ---
  const primaryColor = [22, 163, 74]; // Vert (Green-600 de Tailwind)
  const blackColor = [30, 30, 30];
  
  // --- 2. EN-TÊTE DU DOCUMENT ---
  // Titre du Rapport
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  const title = soumission.rapport?.libelle?.toUpperCase() || "RAPPORT";
  
  // Gestion des titres longs (multiligne auto)
  const splitTitle = doc.splitTextToSize(title, 180);
  doc.text(splitTitle, 14, 20);

  // Ligne de séparation
  //const titleHeight = splitTitle.length * 7; // Ajustement hauteur selon longueur titre
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(14, 25 + (splitTitle.length -1)*7, 196, 25 + (splitTitle.length -1)*7);

  // --- 3. INFOS MÉTA (Utilisateur, Date) ---
  doc.setFontSize(10);
  doc.setTextColor(...blackColor);
  doc.setFont("helvetica", "normal");

  const startYMeta = 35 + (splitTitle.length -1)*7;
  
  const userName = soumission.user ? `${soumission.user.nom} ${soumission.user.prenoms}` : "Utilisateur inconnu";
  const userContact = soumission.user?.contact || "N/A";
  const dateRapport = soumission.dates 
    ? DateTime.fromISO(soumission.dates).setLocale('fr').toLocaleString(DateTime.DATE_FULL)
    : "Non définie";
  const dateSoumission = soumission.createdAt
    ? DateTime.fromISO(soumission.createdAt).setLocale('fr').toLocaleString(DateTime.DATETIME_MED)
    : "Inconnue";

  doc.text(`Soumis par : ${userName}`, 14, startYMeta);
  doc.text(`Contact : ${userContact}`, 14, startYMeta + 6);
  
  doc.text(`Date concernée : ${dateRapport}`, 120, startYMeta);
  doc.text(`Date d'envoi : ${dateSoumission}`, 120, startYMeta + 6);

  // --- 4. TABLEAU DES QUESTIONS / RÉPONSES ---
  const tableColumn = ["#", "Question / Variable", "Réponse"];
  const tableRows = [];

  // Trier les questions par position si disponible, sinon par défaut
  const sortedDetails = [...details].sort((a, b) => 
    (a.rapportQuiz?.position || 0) - (b.rapportQuiz?.position || 0)
  );

  sortedDetails.forEach((item, index) => {
    const question = item.rapportQuiz?.libelle || "Question supprimée";
    
    // Nettoyage de la réponse
    let reponse = item.reponse;
    if (reponse === "null" || reponse === null || reponse === undefined) reponse = "-";
    if (reponse === "true") reponse = "Vrai";
    if (reponse === "false") reponse = "Faux";

    tableRows.push([index + 1, question, reponse]);
  });

  autoTable(doc, {
    startY: startYMeta + 15,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center', fontStyle: 'bold' }, // Colonne ID
      1: { cellWidth: 'auto' }, // Colonne Question (prend la place restante)
      2: { cellWidth: 50, fontStyle: 'bold', textColor: [50, 50, 50] }, // Colonne Réponse
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak', // Retour à la ligne automatique
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // --- 5. PIED DE PAGE ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} / ${pageCount} - Généré le ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // --- 6. SAUVEGARDE ---
  const cleanFileName = `Rapport_${soumission.id}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(cleanFileName);
};