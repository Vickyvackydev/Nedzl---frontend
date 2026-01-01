import { API } from "../config";

export const createContact = async (payload: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
}) => {
  const response = await API.post("/contact", payload);
  return response.data;
};
export const getContacts = async () => {
  const response = await API.get("/admin/contact");
  return response.data;
};
export const deleteContact = async (id: string) => {
  const response = await API.delete(`/admin/contact/${id}`);
  return response.data;
};
