import { API } from "../config";

export interface CreateServiceBookingPayload {
  service_id?: string | number;
  scheduled_date: string;
  service_address: string;
  customer_phone: string;
  notes?: string;
  booking_fee: number;
  payment_reference?: string;
  callback_url?: string;
}

export const createServiceBooking = async (
  payload: CreateServiceBookingPayload
) => {
  const response = await API.post("/service-bookings", payload);
  return response.data;
};

export const getUserServiceBookings = async () => {
  const response = await API.get("/service-bookings/user");
  return response.data;
};

export const getArtisanServiceBookings = async () => {
  const response = await API.get("/service-bookings/artisan");
  return response.data;
};

export const artisanCompleteBooking = async (bookingId: string) => {
  const response = await API.patch(
    `/service-bookings/${bookingId}/artisan-complete`
  );
  return response.data;
};

export const customerCompleteBooking = async (bookingId: string) => {
  const response = await API.patch(
    `/service-bookings/${bookingId}/customer-complete`
  );
  return response.data;
};
