import { API } from "../config";
import { buildQueryStrings } from "../utils";

export const getDashboardOverview = async (period: string) => {
  const response = await API.get(`/admin/overview?period=${period}`);
  return response?.data?.data;
};
export const getSellerOverview = async (period: string) => {
  const response = await API.get(`/admin/user/overview?period=${period}`);
  return response?.data?.data;
};
export const getDashboardUsers = async (filters: Record<string, any>) => {
  const query = buildQueryStrings(filters);
  const response = await API.get(`/admin/users?${query}`);
  return response?.data;
};
export const getDashboardProducts = async (filters: Record<string, any>) => {
  const query = buildQueryStrings(filters);
  const response = await API.get(`/admin/products?${query}`);
  return response?.data;
};
export const getAdminUserDetails = async (id: string) => {
  const response = await API.get(`/admin/user/${id}`);
  return response?.data?.data;
};
export const updateFeaturedProducts = async (
  box_number: number,
  data: { category_name: string; description: string; product_ids: string[] }
) => {
  const response = await API.post(
    `/admin/feature-products/${box_number}`,
    data
  );
  return response?.data;
};
export const getAdminFeaturedProducts = async () => {
  const response = await API.get(`/admin/feature-products`);
  return response?.data?.data;
};

export const updateUserStatus = async (
  id: string,
  status: "DEACTIVATED" | "SUSPENDED" | "ACTIVE"
) => {
  const response = await API.patch(`/users/update/${id}/status`, { status });
  return response.data;
};
export const deleteAdminProduct = async (id: string) => {
  const response = await API.delete(`/admin/product/${id}/delete`);
  return response.data;
};
export const deleteAdminUser = async (id: string) => {
  const response = await API.delete(`/admin/users/${id}/delete`);
  return response.data;
};
