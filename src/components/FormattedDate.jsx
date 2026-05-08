import React from "react";

export const FormattedDate = ({ createdAt }) => {
  if (!createdAt) return <span>Non renseignée</span>;

  const date = new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return <span>{date}</span>;
};

export const FormattedDateWithDay = ({ createdAt }) => {
  if (!createdAt) return <span>Non renseignée</span>;

  const date = new Date(createdAt);

  // Options pour obtenir le jour en toutes lettres et la date
  const options = { weekday: "long", day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString("fr-FR", options);

  // Mettre la première lettre en majuscule
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return <span>{capitalizedDate}</span>;
};
