import React, { useState } from "react";
import { SoulTypeBadge } from "../components/dashboard/badge";
import SoumettreUnRapport from "../components/phoning/SoumettreUnRapport";
import RejeterUnRapport from "../components/phoning/RejeterUnRapport";
import ValiderUnRapport from "../components/phoning/ValiderUnRapport";
import { FormattedDate } from "./FormattedDate";
import WelcomeModal from "../components/WelcomeModal";
import {
  StatutPhoningBadge,
  StatutRejeterBadge,
} from "../components/dashboard/badge";
import { useToasts } from "../hooks/useToasts";
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  HeartHandshake,
  User,
  Church,
  MessageSquare,
  Info,
  BookUser,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

const InfoRow = ({
  icon,
  label,
  value,
  isBlock = false,
  defaultValue = "Non renseigné",
}) => {
  const displayValue =
    value && String(value).trim() !== "" ? value : defaultValue;
  const isDefault = displayValue === defaultValue;

  const valueClasses = `
        ${isBlock ? "mt-1" : "ml-2"}
        ${
          isDefault
            ? "italic text-gray-400 dark:text-gray-500"
            : "text-gray-600 dark:text-gray-400"
        }
    `;

  return (
    <div
      className={`flex text-sm ${
        isBlock ? "flex-col items-start" : "items-start gap-3"
      }`}
    >
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-gray-500 dark:text-gray-400 mt-0.5">{icon}</div>
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          {label}:
        </span>
      </div>
      <div className={valueClasses}>{displayValue}</div>
    </div>
  );
};

const CommentaireCard = ({ commentaire, onEdit, onDelete }) => {
  return (
    <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span className="font-semibold">
          {commentaire.user?.prenoms || "Utilisateur"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-blue-500 bg-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-700 p-2 rounded-full"
            title="Modifier"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 bg-red-200 hover:bg-red-600 hover:text-white transition-all duration-700 p-2 rounded-full"
            title="Supprimer"
          >
            <Trash2 size={12} />
          </button>
          <span>
            <FormattedDate createdAt={commentaire.createdAt} />
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-800 dark:text-gray-200">
        {commentaire.comment}
      </p>
    </div>
  );
};

export default function PhoningCard({
  from,
  soul,
  onEditSoulClick,
  onAddCommentClick,
  onEditCommentClick,
  onDeleteCommentClick,
  handleStatutPhoningChange,
}) {
  const [showSubmitRapportModal, setShowSubmitRapportModal] = useState(false);
  const [showRejectRapportModal, setShowRejectRapportModal] = useState(false);
  const [showValidateRapportModal, setShowValidateRapportModal] =
    useState(false);
  const [rejectAction, setRejectAction] = useState("rejeter");
  const [validateAction, setValidateAction] = useState("valider");
  const { showInfo } = useToasts();

  const handleCallClick = (phoneNumber) => {
    if (!phoneNumber) {
      showInfo("Aucun numéro de téléphone disponible.");
      return;
    }
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      showInfo(
        "📱 Cette fonctionnalité est disponible uniquement sur smartphone ou tablette."
      );
    }
  };

  const handleWhatsAppClick = (phoneNumber) => {
    if (!phoneNumber) {
      showInfo("Aucun numéro de téléphone disponible.");
      return;
    }
    // Nettoie le numéro pour ne garder que les chiffres
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanedNumber}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (!soul) {
    return null;
  }

  const onRejectPhoningClick = (action) => {
    setShowRejectRapportModal(true);
    setRejectAction(action);
  };

  const onValidatePhoningClick = (action) => {
    setShowValidateRapportModal(true);
    setValidateAction(action);
  };

  const location = [soul.quartier, soul.ville, soul.pays]
    .filter(Boolean)
    .join(", ");
  const hasComments = soul.commentaires && soul.commentaires.length > 0;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md transition-shadow hover:shadow-xl flex flex-col h-full">
      {from === "rapport" ? (
        <div className="absolute top-3 right-3 bg-green-200 text-green-800 font-semibold px-2 py-1 rounded-3xl text-xs shadow-sm z-0 opacity-80 flex gap-1 items-center">
          Suivi par {soul?.suivi_par.prenoms + " " + soul?.suivi_par.nom || "Non renseigné"}
          {/* {soul?.suivi_par?.nom
            ? `${soul?.suivi_par.nom.charAt(0).toUpperCase()}.`
            : ""} */}
        </div>
      ) : (
        <button
          onClick={() => setShowSubmitRapportModal(true)}
          className="absolute top-3 right-3 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded-full shadow-sm z-0 opacity-80 flex gap-1 items-center"
        >
          Soumettre le rapport
        </button>
      )}

      <WelcomeModal
        isActive={showValidateRapportModal}
        onClose={() => setShowValidateRapportModal(false)}
      >
        <ValiderUnRapport
          soul={soul}
          action={validateAction}
          handleCloseModal={() => setShowValidateRapportModal(false)}
          refreshAffectationsData={() => {
            setShowValidateRapportModal(false);
            handleStatutPhoningChange();
          }}
        />
      </WelcomeModal>

      <WelcomeModal
        isActive={showRejectRapportModal}
        onClose={() => setShowRejectRapportModal(false)}
      >
        <RejeterUnRapport
          soul={soul}
          action={rejectAction}
          handleCloseModal={() => setShowRejectRapportModal(false)}
          refreshAffectationsData={() => {
            setShowRejectRapportModal(false);
            handleStatutPhoningChange();
          }}
        />
      </WelcomeModal>

      <WelcomeModal
        isActive={showSubmitRapportModal}
        onClose={() => setShowSubmitRapportModal(false)}
      >
        <SoumettreUnRapport
          soul={soul}
          handleCloseModal={() => setShowSubmitRapportModal(false)}
          refreshAffectationsData={() => {
            setShowSubmitRapportModal(false);
            handleStatutPhoningChange();
          }}
        />
      </WelcomeModal>

      <div className="p-4 flex-grow space-y-4 mt-12">
        <div className="flex items-center gap-4">
          <img
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/photoProfil/default/${
              (soul.id % 5) + 1
            }.png`}
            alt={`Avatar de ${soul.nom}`}
          />
          <div>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
              {soul.nom} {soul.prenom} <SoulTypeBadge type={soul.type} />
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
              <Mail size={14} />
              {soul.email || "Non renseigné"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
              <Phone size={14} />
              {soul.contact || "Non renseigné"}
            </p>
          </div>
        </div>
        <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between gap-4">
            <InfoRow
              icon={<User size={14} />}
              label="Civilité"
              value={soul.civilite}
            />
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              <StatutRejeterBadge affectation={soul} />
              <StatutPhoningBadge statutPhoning={soul?.statutPhoning} />
            </h3>
          </div>
          <InfoRow
            icon={<Briefcase size={14} />}
            label="Profession"
            value={soul.profession}
          />
          <InfoRow
            icon={<HeartHandshake size={14} />}
            label="Situation"
            value={soul.situation_matrimoniale?.libelle}
          />
          <InfoRow
            icon={<MapPin size={14} />}
            label="Localisation"
            value={location}
          />
          <InfoRow
            icon={<Church size={14} />}
            label="Membre d'une église"
            value={soul.egliseHabituelle}
          />
          <InfoRow
            icon={<Info size={14} />}
            label="Connu par"
            value={soul.connuPar}
          />
          <InfoRow
            icon={<BookUser size={14} />}
            label="Événement"
            value={
              <>
                {soul.reference?.event?.libelle}
                {" - "}
                <FormattedDate createdAt={soul.reference?.dates} />
              </>
            }
          />
          <InfoRow
            icon={<MessageSquare size={14} />}
            label="Sujet"
            value={soul.message}
            isBlock={true}
            defaultValue="Ras"
          />
        </div>
        <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Commentaires
            </h4>
            <button
              onClick={() => onAddCommentClick(soul)}
              className="p-1.5 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
              title="Ajouter un commentaire"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {hasComments ? (
              soul.commentaires.map((comment) => (
                <CommentaireCard
                  key={comment.id}
                  commentaire={comment}
                  onEdit={() => onEditCommentClick(comment, soul)}
                  onDelete={() => onDeleteCommentClick(comment.id)}
                />
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">Aucun commentaire.</p>
            )}
          </div>
        </div>
      </div>

      {from === "rapport" ? (
        <div className="flex items-center justify-between gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
          {soul?.statutPhoning === "Valider" ? (
            <button
              onClick={() => onValidatePhoningClick("annuler")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:text-white transition-all duration-700"
            >
              <Pencil size={16} /> Annuler la validation
            </button>
          ) : (
            <button
              onClick={() => onValidatePhoningClick("valider")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:text-white transition-all duration-700"
            >
              <Pencil size={16} /> Valider
            </button>
          )}
          {soul?.statutPhoning === "Rejeter" ? (
            <button
              onClick={() => onRejectPhoningClick("annuler")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-700 hover:text-white transition-all duration-700"
            >
              <Pencil size={16} /> Annuler le rejet
            </button>
          ) : (
            soul?.statutPhoning !== "Valider" && (
              <button
                onClick={() => onRejectPhoningClick("rejeter")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded-lg hover:bg-red-700 hover:text-white transition-all duration-700"
              >
                <Pencil size={16} /> Rejeter
              </button>
            )
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
          <button
            onClick={() => onEditSoulClick(soul)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:text-white transition-all duration-700"
          >
            <Pencil size={16} /> Modifier
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCallClick(soul.contact)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:text-white transition-all duration-700"
              title="Appeler"
            >
              <Phone size={16} />
            </button>
            <button
              onClick={() => handleWhatsAppClick(soul.contact)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:text-white transition-all duration-700"
              title="Contacter sur WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}