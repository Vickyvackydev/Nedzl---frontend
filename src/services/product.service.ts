import { API } from "../config";

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

export const getUserProducts = async () => {
  const response = await API.get("/products/user");
  return response?.data;
};

export const getAllProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};
