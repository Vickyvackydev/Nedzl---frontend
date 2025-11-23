import { API } from "../config";
import { Filter } from "../types";
import { buildQueryParams } from "../utils";
import { productsQueryKey, usersQueryKey } from "../utils/queryKeys";

export const getDashboardOverview = async (period: string) => {
  const response = await API.get(`/admin/overview?period=${period}`);
  return response?.data?.data;
};
export const getSellerOverview = async (period: string) => {
  const response = await API.get(`/admin/user/overview?period=${period}`);
  return response?.data?.data;
};
export const getDashboardUsers = async (
  status: string,
  page: number,
  search: string,
  filters: Filter[]
) => {
  const query = buildQueryParams(filters, usersQueryKey);
  const params: Record<string, any> = {
    status,
    search,
    page,
    ...query,
  };
  const response = await API.get(`/admin/users`, { params });
  return response?.data;
};
export const getDashboardProducts = async (options: {
  status?: string;
  page?: number;
  search?: string;
  filters?: Filter[];
  user_id?: string;
}) => {
  const { status, page, search, filters = [], user_id } = options;

  const query = buildQueryParams(filters, productsQueryKey);

  const params: Record<string, any> = {
    status,
    search,
    page,
    user_id,
    ...query,
  };

  // Remove undefined values
  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  const response = await API.get(`/admin/products`, { params });
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
