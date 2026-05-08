import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useFonction({ page, perPage, keyword }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["fonctions", page, perPage, keyword],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/fonction/all`,
        { params: { page, perPage, keyword } }
      );
      return response.data;
    },
    onError: handleError,
  });
}
