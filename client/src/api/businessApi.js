import { apiRequest } from "./api";

export const getBusinesses = () => apiRequest("/business");

export const getBusinessById = (id) => apiRequest(`/business/${id}`);

export const createBusiness = (data) =>
  apiRequest("/business", { method: "POST", body: data, authRequired: true });

export const updateBusiness = (id, data) =>
  apiRequest(`/business/${id}`, {
    method: "PUT",
    body: data,
    authRequired: true,
  });

export const deleteBusiness = (id) =>
  apiRequest(`/business/${id}`, { method: "DELETE", authRequired: true });
