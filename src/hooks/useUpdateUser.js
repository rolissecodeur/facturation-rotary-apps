import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../config/axiosConfig";

const updateUserApi = ({ userId, data }) => {
  return axiosInstance.put(`/user?userId=${userId}`, data);
};

export const useUpdateUser = (onSuccessCallback) => {
  const handleError = (error) => {
    const validationErrors = error?.response?.data?.error;
    if (validationErrors && Array.isArray(validationErrors)) {
      validationErrors.forEach((err) => toast.error(err.message));
    } else {
      toast.error(error?.response?.data?.message || "La mise à jour a échoué.");
    }
  };

  return useMutation(updateUserApi, {
    onSuccess: () => {
      toast.success("Profil mis à jour avec succès. Vous serez déconnecté.");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: handleError,
  });
};