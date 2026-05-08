import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useRapport({ page, perPage, keyword }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["rapports", page, perPage, keyword],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/rapport/all`,
        { params: { page, perPage, keyword } }
      );
      // rapports, allRapports retouner par le back
      console.log(response.data);
      
      return response.data;
    },
    // enabled: Boolean(userId),
    onError: handleError,
  });
}
