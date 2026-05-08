import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useSite({ page, perPage, keyword }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["sites", page, perPage, keyword],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/site/all`,
        { params: { page, perPage, keyword } }
      );
      // console.log(response);
      
      // sites, allSites retouner par le back
      return response.data;
    },
    // enabled: Boolean(userId),
    onError: handleError,
  });
}
