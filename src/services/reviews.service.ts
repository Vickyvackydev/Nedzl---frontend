import { API } from "../config";

export const createReview = async (formData: FormData) => {
  const response = await API.post("/review", formData, {
    headers: { "Content-Type": "multipart/formdata" },
  });
  return response.data;
};

export const getPublicReviews = async (product_id: string) => {
  const response = await API.get(`/reviews/${product_id}`);
  return response.data;
};
export const getUserReviews = async () => {
  const response = await API.get(`/reviews/user`);
  return response.data;
};
export const getSellerReviews = async () => {
  const response = await API.get(`/reviews/seller`);
  return response.data;
};
