import React, { useMemo } from "react";
import Pagination from "./Pagination"; 
import NoData from "../NoData";
import { SoulTypeBadge, StatutPhoningBadge , FamilyBadge} from "./badge";
import { FormattedDate } from "../FormattedDate";

export default function RapportTableau({ data, onPageChange }) {
  const groupedSouls = useMemo(() => {
    const soulsData = data?.souls?.data || [];
    if (!soulsData.length) return {};

    return soulsData.reduce((acc, soul) => {
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
  }, [data]);

  const meta = data?.souls?.meta;
  const hasData = Object.keys(groupedSouls).length > 0;

  return (
    <div className="space-y-8">
      {hasData ? (
        Object.values(groupedSouls).map((group) => (
          <div key={group.user}>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-green-500 pb-2">
              Suivi par : {group.user}
            </h2>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nom & Prénom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Famille d'impact
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Commentaires
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {group.souls.map((soul) => (
                    <tr key={soul.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{soul.nom} {soul.prenom}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{soul.email || "Aucun email"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 align-top">
                        {soul.contact || "N/A"}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 align-top">
                        <FormattedDate createdAt={soul.dates} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                        <SoulTypeBadge type={soul.type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                        <FamilyBadge soul={soul} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm align-top">
                        <StatutPhoningBadge statutPhoning={soul.statutPhoning} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 align-top">
                        {soul.commentaires && soul.commentaires.length > 0 ? (
                          <div className="space-y-2">
                            {soul.commentaires.map((commentaire) => (
                              <div key={commentaire.id} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <p className="text-gray-800 dark:text-gray-200">{commentaire.comment}</p>
                                <div className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">
                                  <FormattedDate createdAt={commentaire.createdAt} />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="italic text-gray-400 dark:text-gray-500">Aucun commentaire</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <NoData message="Aucune affectation trouvée pour les filtres sélectionnés." />
      )}

      {meta && meta.lastPage > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={meta.currentPage}
            totalPages={meta.lastPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}