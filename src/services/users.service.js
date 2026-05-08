// src/services/auth.service.js
import api from '../config/axiosConfig';

const all = async (params) => {
  console.log(params);
  const response = await api.get(`user/all?page=${params.page}&perpage=${params.perPage}&ministereId=${params.ministereId}`);
  return response;
};

const allRole = async () => {
  const response = await api.get(`roles/all`);
  return response;
};

const create = async (user) => {
  const response = await api.post('user/create', user);
  return response;
};

const addRole = async (data) => {
  const response = await api.post('roles_user/add', data);
  return response;
};

const removeRole = async ({ rolesUserId, userId }) => {
  const response = await api.delete('roles_user/remove', {
    params: { rolesUserId, userId }
  });
  return response;
};
const update = async (id, user) => {
  const response = await api.put(`user/update?userId=${id}`, user);
  return response;
};

const show = async (id) => {
  const response = await api.get(`user/show/${id}`);
  return response;
};

const deleteUser = async (id) => {
  const response = await api.delete(`user/delete?userId=${id}`);
  return response;
};

export const usersService = { all, create, update, deleteUser, show, allRole, addRole, removeRole };