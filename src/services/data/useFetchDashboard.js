import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useFetchDashboard() {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/dashboard/stats`
      );
      console.log(response.data);
      return response.data;
    },
    // enabled: Boolean(userId),
    onError: handleError,
  });
}

