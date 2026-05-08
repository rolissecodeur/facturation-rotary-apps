// src/services/auth.service.js
import api from '../config/axiosConfig';

const login = async (credentials) => {
  const response = await api.post('login', credentials);
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  return response;
};

// Forgot password
const forgotPassword = async (email) => {
  const response = await api.post('mot_de_passe_oublie', email);
  return response;
};

const verifyResetToken = async ({ token, email, userId }) => {
  const endpoint = `verif_token_to_change_password?token=${token}&userId=${userId}&email=${email}`;
  return await api.get(endpoint); 
};

// FONCTION MISE À JOUR pour changer le mot de passe
const resetPassword = async ({ password, confirmPassword, token, email, userId }) => {
  const endpoint = `new_password?userId=${userId}&token=${token}&email=${email}`;
  return await api.post(endpoint, { password, confirm: confirmPassword }); // Assurez-vous que le body correspond à ce que l'API attend
};
// register
const register = async (user) => {
  const response = await api.post('user/create', user);
  return response;
};

// activeAccount
const activeAccount = async (token) => {
  const response = await api.post('user/activeAccount', { token });
  return response;
};

// logout
const logout = async () => {
  const response = await api.post('logout');
  return response;
};

export const authService = { login, forgotPassword, resetPassword, verifyResetToken, register, activeAccount, logout };