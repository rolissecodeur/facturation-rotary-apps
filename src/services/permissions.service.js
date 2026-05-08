// src/services/auth.service.js
import api from '../config/axiosConfig';

const all = async (params) => {
  const response = await api.get(`permission/all?page=${params.page}&perpage=${params.perPage}`);
  return response;
};

const update = async (permissionId, userConnectedId, data) => {
  const response = await api.put(
    `permission/update?permissionId=${permissionId}&userConnectedId=${userConnectedId}`,
    data
  );
  return response;
};


// ... (fonctions register, forgotPassword à ajouter plus tard)

export const permissionService = { all, update };