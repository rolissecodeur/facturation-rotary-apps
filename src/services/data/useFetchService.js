import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useService({ page, perPage, keyword }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["services", page, perPage, keyword],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/service/all`,
        { params: { page, perPage, keyword } }
      );
      // services, allServices retouner par le back
      return response.data;
    },
    // enabled: Boolean(userId),
    onError: handleError,
  });
}
