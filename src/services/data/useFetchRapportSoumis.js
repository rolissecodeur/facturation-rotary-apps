import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useRapportSoumis({keyword, userId, rapportId, page, perPage, dateDebut, dateFin }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["rapportSoumis",rapportId, page, perPage, keyword, dateDebut, dateFin],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/rapport_soumis/all`,
        { params: { page, perPage, rapportId , userId, keyword, dateDebut, dateFin } }
      );
      // rapportSoumis, allRapportSoumis retouner par le back
      // console.log(response?.data);
      
      return response.data;
    },
    // enabled: Boolean(userId),
    onError: handleError,
  });
}
