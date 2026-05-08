// src/utils.js
export const ErrorFormated = (err) => {
    const message =
      err.response?.data?.error?.message || // si c’est un objet avec message
      err.response?.data?.error ||          // si c’est juste une string
      'Une erreur est survenue';            // fallback
  
    return message;
  };
  