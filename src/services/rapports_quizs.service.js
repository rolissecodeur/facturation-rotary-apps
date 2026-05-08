// src/services/auth.service.js
import api from '../config/axiosConfig';

const all = async (params) => {
  const response = await api.get(`rapport_quiz/all?page=${params.page}&perpage=${params.perPage}`);
  return response;
};

const create = async (user) => {
  const response = await api.post('rapport_quiz/create', user);
  return response;
};

const update = async (id, user) => {
  const response = await api.put(`rapport_quiz/update?rapportQuizId=${id}`, user);
  return response;
};

const show = async (id) => {
  const response = await api.get(`rapport_quiz/show/${id}`);
  return response;
};

const deleteRapportQuiz = async (id) => {
  const response = await api.delete(`rapport_quiz/delete?rapportQuizId=${id}`);
  return response;
};

// ... (fonctions register, forgotPassword à ajouter plus tard)

export const rapportQuizService = { all, create, update, deleteRapportQuiz, show };