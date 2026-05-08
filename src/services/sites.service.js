// src/services/auth.service.js
import api from '../config/axiosConfig';

const all = async (params) => {
  const response = await api.get(`site/all?page=${params.page}&perpage=${params.perPage}`);
  return response;
};

const create = async (user) => {
  const response = await api.post('site/create', user);
  return response;
};

const update = async (id, user) => {
  const response = await api.put(`site/update?siteId=${id}`, user);
  return response;
};

const show = async (id) => {
  const response = await api.get(`site/show/${id}`);
  return response;
};

const deleteSite = async (id) => {
  const response = await api.delete(`site/delete?siteId=${id}`);
  return response;
};

// ... (fonctions register, forgotPassword à ajouter plus tard)

export const siteService = { all, create, update, deleteSite, show };