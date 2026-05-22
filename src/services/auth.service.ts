import { API } from "../config";

export const register = async (payload: FormData) => {
  const response = API.post("/auth/register", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return (await response).data;
};

export const login = async (payload: { email: string; password: string }) => {
  const response = await API.post("/auth/login", payload);
  return response.data;
};

export const forgotPassword = async (payload: { email: string }) => {
  const response = await API.post("/auth/forgot-password", payload);
  return response.data;
};
export const resetPassword = async (payload: {
  token: string;
  password: string;
}) => {
  const response = await API.post("/auth/reset-password", payload);
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await API.post(`/auth/verify-email?token=${token}`);
  return response.data;
};

export const updateUser = async (formData: FormData) => {
  const response = await API.patch("/users/update", formData, {
    headers: { "Content-Type": "multipart/formdata" },
  });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await API.get("/me");
  return response.data;
};
