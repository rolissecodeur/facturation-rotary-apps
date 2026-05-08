import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useFetchClub({ page, perPage, keyword }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["clubs", page, perPage, keyword],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/club/all`,
        { params: { page, perPage, keyword } }
      );
      
      return response.data;
    },
    onError: handleError,
  });
}
