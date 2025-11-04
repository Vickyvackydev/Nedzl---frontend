import { API } from "../config";
import { StoreSettingsPayload } from "../types";
import { buildQueryStrings } from "../utils";

export const uploadProduct = async (data: FormData, setProgress: Function) => {
  const response = await API.post(`/products`, data, {
    headers: { "Content-Type": "multipart/formdata" },
    onUploadProgress(progressEvent) {
      const total = progressEvent.total || 1; // progress count
      const percentCompleted = Math.round((progressEvent.loaded / total) * 100); // calculate progress percentage
      setProgress(percentCompleted);
    },
  });
  return response.data;
};
export const updateProduct = async (
  id: string,
  data: FormData,
  setProgress: Function
) => {
  const response = await API.put(`/products/${id}/user`, data, {
    headers: { "Content-Type": "multipart/formdata" },
    onUploadProgress(progressEvent) {
      const total = progressEvent.total || 1; // progress count
      const percentCompleted = Math.round((progressEvent.loaded / total) * 100); // calculate progress percentage
      setProgress(percentCompleted);
    },
  });
  return response.data;
};

export const getUserProducts = async (filters: Record<string, any>) => {
  const query = buildQueryStrings(filters);
  const response = await API.get(`/products/user?${query}`);
  return response?.data;
};

export const getAllProducts = async (filters: Record<string, any>) => {
  const query = buildQueryStrings(filters);
  const response = await API.get(`/products?${query}`);
  return response.data?.data;
};
export const getSingleProduct = async (id: string) => {
  const response = await API.get(`/products/${id}`);
  return response?.data?.data;
};
export const getSellerStoreDetails = async (id: string) => {
  const response = await API.get(`/store-settings/${id}`);
  return response?.data;
};
export const createStoreSettings = async (data: StoreSettingsPayload) => {
  const response = await API.post("/store-settings", data);
  return response.data;
};

export const getProductCategoryCounts = async () => {
  const response = await API.get(`/products/counts`);
  return response?.data?.data;
};
