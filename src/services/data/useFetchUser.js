import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useFetchUser({ page, perPage, keyword }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["users", page, perPage, keyword],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/all`,
        { params: { page, perPage, keyword } }
      );
      // console.log(response.data)
      return response.data;
    },
    onError: handleError,
  });
}

