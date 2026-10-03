import { apiRequest } from "./api";

export const getProducts = (businessId) =>
  apiRequest(businessId ? `/products?businessId=${businessId}` : "/products");

export const getProductById = (id) => apiRequest(`/products/${id}`);

export const createProduct = (data) =>
  apiRequest("/products", { method: "POST", body: data, authRequired: true });

export const updateProduct = (id, data) =>
  apiRequest(`/products/${id}`, {
    method: "PUT",
    body: data,
    authRequired: true,
  });

export const deleteProduct = (id) =>
  apiRequest(`/products/${id}`, { method: "DELETE", authRequired: true });
