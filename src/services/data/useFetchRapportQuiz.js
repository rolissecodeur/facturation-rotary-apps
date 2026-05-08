import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useHandleError } from "../../hooks/useHandleError";

export function useRapportQuiz({rapportId, page, perPage, keyword }) {
  const handleError = useHandleError();

  return useQuery({
    queryKey: ["rapportQuizs",rapportId, page, perPage, keyword],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/rapport_quiz/all`,
        { params: { page, perPage, rapportId, keyword } }
      );
      // rapportQuizs, allRapportQuizs retouner par le back
      return response.data;
    },
    // enabled: Boolean(userId),
    onError: handleError,
  });
}
