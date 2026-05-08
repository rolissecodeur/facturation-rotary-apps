import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useFetchFacture({ page, perPage, keyword, status, dateDebut, dateFin, clubId }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["factures", page, perPage, keyword, status, dateDebut, dateFin, clubId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/facture/all`,
        { params: { page, perPage, keyword, status, dateDebut, dateFin, clubId } }
      );
      console.log(response.data);
      return response.data;
    },
    onError: handleError,
  });
}

