// src/services/factures.service.js
import api from '../config/axiosConfig';

const sendFactureMail = async (factureId) => {
  console.log(factureId);
  const response = await api.post('facture/send-facture-mail?factureId=' + factureId);
  return response;
};
const sendRecapMail = async (factureId) => {
  const response = await api.post('facture/send-recap-mail?factureId=' + factureId);
  return response;
};
const create = async (data) => {
  const response = await api.post('facture/create', data);
  return response;
};

const update = async (id, data) => {
  const response = await api.put(`facture/update?factureId=${id}`, data);
  return response;
};

const show = async (id) => {
  const response = await api.get(`facture/show?factureId=${id}`);
  return response;
};


const deleteFacture = async (id) => {
  const response = await api.delete(`facture/delete?factureId=${id}`);
  return response;
};

export const factureService = {sendFactureMail, sendRecapMail, create, update, deleteFacture, show };

