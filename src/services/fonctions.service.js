// src/services/auth.service.js
import api from '../config/axiosConfig';

const all = async (params) => {
  const response = await api.get(`fonction/all?page=${params.page}&perpage=${params.perPage}`);
  return response;
};

const create = async (user) => {
  const response = await api.post('fonction/create', user);
  return response;
};

const update = async (id, user) => {
  const response = await api.put(`fonction/update?fonctionId=${id}`, user);
  return response;
};

const show = async (id) => {
  const response = await api.get(`fonction/show/${id}`);
  return response;
};

const deleteFonction = async (id) => {
  const response = await api.delete(`fonction/delete?fonctionId=${id}`);
  return response;
};

// ... (fonctions register, forgotPassword à ajouter plus tard)

export const fonctionService = { all, create, update, deleteFonction, show };