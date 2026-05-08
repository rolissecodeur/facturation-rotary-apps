import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useFetchActivite() {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["activite"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/dashboard/activities`
      );
      console.log(response.data);
      return response.data;
    },
    // enabled: Boolean(userId),
    onError: handleError,
  });
}

