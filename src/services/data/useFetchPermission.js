// src/services/data/useFetchPermission.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";

export function usePermission({ page, perpage }) {
  return useQuery({
    queryKey: ["permissions", page, perpage],
    queryFn: async () => {
      // Axios lance automatiquement une exception si le status n'est pas 2xx
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/permission/all`,
        { params: { page, perPage: perpage } }
      );
      
      return response.data;
    },
    // On garde l'historique 5 minutes pour éviter de spammer l'API si on navigue
    staleTime: 5 * 60 * 1000, 
    keepPreviousData: true, // (v4) ou placeholderData: keepPreviousData (v5) pour une pagination fluide
  });
}