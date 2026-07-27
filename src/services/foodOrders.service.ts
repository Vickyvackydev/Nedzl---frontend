import { API } from "../config";

export interface CreateFoodOrderPayload {
  product_id?: string | number;
  sub_menus: { name: string; price: number }[];
  customer_name?: string;
  customer_phone: string;
  delivery_address: string;
  payment_reference?: string;
  total_amount: number;
  callback_url?: string;
}

export const createFoodOrder = async (payload: CreateFoodOrderPayload) => {
  const response = await API.post("/food-orders", payload);
  return response.data;
};

export const getUserFoodOrders = async () => {
  const response = await API.get("/food-orders/user");
  return response.data;
};

export const getVendorFoodOrders = async () => {
  const response = await API.get("/food-orders/vendor");
  return response.data;
};

export const updateFoodOrderStatus = async (
  orderId: string,
  status: string
) => {
  const response = await API.patch(`/food-orders/${orderId}/status`, {
    status,
  });
  return response.data;
};
