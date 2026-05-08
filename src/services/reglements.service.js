// src/services/reglements.service.js
import api from '../config/axiosConfig';

const create = async (user) => {
  const response = await api.post('reglement/create', user);
  return response;
};

const update = async (id, user) => {
  const response = await api.put(`reglement/update?reglementId=${id}`, user);
  return response;
};

const show = async (id) => {
  const response = await api.get(`reglement/show/${id}`);
  return response;
};

const deleteReglement = async (id) => {
  const response = await api.delete(`reglement/delete?reglementId=${id}`);
  return response;
};

export const reglementService = {create, update, deleteReglement, show };