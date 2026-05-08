// src/services/auth.service.js
import api from '../config/axiosConfig';

const all = async (params) => {
  const response = await api.get(`service/all?page=${params.page}&perpage=${params.perPage}`);
  return response;
};

const create = async (user) => {
  const response = await api.post('service/create', user);
  return response;
};

const update = async (id, user) => {
  const response = await api.put(`service/update?serviceId=${id}`, user);
  return response;
};

const show = async (id) => {
  const response = await api.get(`service/show/${id}`);
  return response;
};

const deleteService = async (id) => {
  const response = await api.delete(`service/delete?serviceId=${id}`);
  return response;
};

// ... (fonctions register, forgotPassword à ajouter plus tard)

export const serviceService = { all, create, update, deleteService, show };