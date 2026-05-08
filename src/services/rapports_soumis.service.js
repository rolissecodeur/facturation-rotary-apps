// src/services/auth.service.js
import api from '../config/axiosConfig';

const all = async (params) => {
  const response = await api.get(`rapport_soumis/all?page=${params.page}&perpage=${params.perPage}`);
  return response;
};

const create = async (rapportId, userId, data) => {
  console.log(data);
  
  const response = await api.post(`rapport_soumis/create?rapportId=${rapportId}&userId=${userId}`, data);
  return response;
};

const update = async (soumissionId, data) => {
  const response = await api.put(`rapport_soumis/update?rapportSoumisId=${soumissionId}`, data);
  return response;
};

const show = async (id) => {
  const response = await api.get(`rapport_soumis/show/${id}`);
  return response;
};

const detailRapportSoumis = async (id) => {  
  const response = await api.get(`rapport_soumis/detail/?rapportSoumisId=${id}`);
  console.log(response);
  
  return response;
};

const deleteRapportSoumis = async (id) => {
  const response = await api.delete(`rapport_soumis/delete?rapportSoumisId=${id}`);
  return response;
};

// ... (fonctions register, forgotPassword à ajouter plus tard)

export const rapportSoumisService = { all, create, update, deleteRapportSoumis, show, detailRapportSoumis };