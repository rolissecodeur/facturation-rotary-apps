import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useDetailRapportSoumis({ page, perPage, }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["rapportSoumis", page, perPage],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/detailRapportSoumis/all`,
        { params: { page, perPage} }
      );
      // rapportSoumis, allRapportSoumis retouner par le back
      console.log(response?.data);
      
      return response.data;
    },
    // enabled: Boolean(userId),
    onError: handleError,
  });
}
