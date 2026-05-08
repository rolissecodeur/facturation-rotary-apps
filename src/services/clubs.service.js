// src/services/clubs.service.js
import api from '../config/axiosConfig';

const create = async (user) => {
  const response = await api.post('club/create', user);
  return response;
};

const update = async (id, user) => {
  const response = await api.put(`club/update?clubId=${id}`, user);
  return response;
};

const show = async (id) => {
  const response = await api.get(`club/show/${id}`);
  return response;
};

const deleteClub = async (id) => {
  const response = await api.delete(`club/delete?clubId=${id}`);
  return response;
};

export const clubService = {create, update, deleteClub, show };