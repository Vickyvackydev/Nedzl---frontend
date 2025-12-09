import { API } from "../config";
import { UserPayload } from "../types";

export const register = async (payload: UserPayload) => {
  const response = API.post("/auth/register", payload);
  return (await response).data;
};

export const login = async (payload: { email: string; password: string }) => {
  const response = API.post("/auth/login", payload);
  return (await response).data;
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
