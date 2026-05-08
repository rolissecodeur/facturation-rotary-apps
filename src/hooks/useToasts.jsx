import { toast } from 'react-hot-toast';
import CustomToast from '../components/CustomToast';

// const LOGO_PATH = '/images/logo/logo.png';

export const useToasts = () => {

  const showToast = (type, message, title, options = {}) => {
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          type={type}
          title={title}
          message={message}
          // logoSrc={LOGO_PATH}
        />
      ),
      { 
        duration: 5000,
        position: 'top-right',
        ...options
      }
    );
  };

  const showSuccess = (message, title = "Succès") => showToast('success', message, title);
  const showError   = (message, title = "Erreur") => showToast('error', message, title);
  const showWarning = (message, title = "Attention") => showToast('warning', message, title);
  const showInfo    = (message, title = "Information") => showToast('info', message, title);

  return { showSuccess, showError, showWarning, showInfo };
};