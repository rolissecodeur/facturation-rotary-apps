// src/services/auth.service.js
import api from '../config/axiosConfig';

const all = async (params) => {
  const response = await api.get(`rapport/all?page=${params.page}&perpage=${params.perPage}&status=${params.status}`);
  return response;
};

const create = async (user) => {
  const response = await api.post('rapport/create', user);
  return response;
};

const update = async (id, user) => {
  const response = await api.put(`rapport/update?rapportId=${id}`, user);
  return response;
};

const show = async (id) => {
  const response = await api.get(`rapport/show?rapportId=${id}`);
  return response;
};

const getGraphStats = async (rapportId, startDate = '', endDate = '') => {
  const response = await api.get(`statistics/graphs?rapportId=${rapportId}&startDate=${startDate}&endDate=${endDate}`);
  return response;
};;

const deleteRapport = async (id) => {
  const response = await api.delete(`rapport/delete?rapportId=${id}`);
  return response;
};

// ... (fonctions register, forgotPassword à ajouter plus tard)

export const rapportService = { getGraphStats, all, create, update, deleteRapport, show };