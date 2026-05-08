import { useToasts } from "../hooks/useToasts";

export const useHandleError = () => {
  const { showError } = useToasts();

  const handleError = (error) => {
    const validationErrors = error?.response?.data?.error;
    if (validationErrors && Array.isArray(validationErrors)) {
      validationErrors.forEach((err) =>
        showError(err.message, "Erreur")
      );
    } else {
      showError(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data,
        "Erreur"
      );
    }
  };

  return handleError;
};
