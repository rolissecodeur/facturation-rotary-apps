import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast'; // Assurez-vous d'avoir react-hot-toast installé

/**
 * Génère une chaîne de caractères alphanumériques aléatoire.
 * @param {number} length - La longueur du code à générer.
 * @returns {string} Le code généré.
 */
const generateRandomCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Un composant qui affiche un code de confirmation aléatoire et demande à
 * l'utilisateur de le saisir pour valider une action. Il empêche également le
 * copier-coller pour renforcer la sécurité.
 */
function ConfirmationInput({ onValidationChange, codeLength = 8 }) {
  // Génère le code de confirmation. `useMemo` garantit qu'il n'est généré qu'une
  // seule fois par instance du composant.
  const confirmationCode = useMemo(() => generateRandomCode(codeLength), [codeLength]);

  // État pour stocker la saisie de l'utilisateur
  const [userInput, setUserInput] = useState('');

  // Informe le composant parent si la saisie correspond au code
  useEffect(() => {
    const isValid = userInput === confirmationCode;
    onValidationChange(isValid);
  }, [userInput, confirmationCode, onValidationChange]);

  /**
   * Empêche l'événement de collage et notifie l'utilisateur.
   * @param {React.ClipboardEvent<HTMLInputElement>} e - L'événement du presse-papiers.
   */
  const preventPaste = (e) => {
    e.preventDefault();
    toast.error("Le copier-coller est désactivé pour des raisons de sécurité.", {
      duration: 3000,
      icon: '📋',
    });
  };

  /**
   * Empêche l'événement de glisser-déposer et notifie l'utilisateur.
   * @param {React.DragEvent<HTMLInputElement>} e - L'événement de glisser-déposer.
   */
  const preventDrop = (e) => {
    e.preventDefault();
    toast.error("Le glisser-déposer est désactivé.", {
      duration: 3000,
      icon: '💧',
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-md border border-gray-800">
      {/* <p className="text-sm text-gray-300 text-center">
        Pour confirmer cette action, veuillez recopier le code suivant :
      </p> */}
      <div className="text-center my-3">
        <span className="bg-gray-800 text-red-600 font-bold tracking-widest text-2xl p-2 rounded-md">
          {confirmationCode}
        </span>
      </div>
      <input
        type="text"
        className="w-full p-2 rounded-md border border-gray-800 bg-gray-700 text-gray-200 outline-none focus:outline-none focus:border-gray-600"
        placeholder="Saisir le code ici..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value.toUpperCase().trim())}
        autoComplete="off"
        maxLength={codeLength}
        onPaste={preventPaste}
        onDrop={preventDrop}
      />
    </div>
  );
}

export default ConfirmationInput;