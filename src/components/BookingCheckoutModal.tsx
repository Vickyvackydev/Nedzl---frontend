import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import Button from "./Button";
import { ProductType } from "../types";
import toast from "react-hot-toast";
import { Store } from "../state/store";
import { createServiceBooking } from "../services/serviceBookings.service";

interface BookingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ProductType | null;
  onSuccess?: () => void;
}

export default function BookingCheckoutModal({
  isOpen,
  onClose,
  service,
  onSuccess,
}: BookingCheckoutModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scheduledDate, setScheduledDate] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!service) return null;

  const bookingFee = service.product_price || 0;

  const handleBookingCheckout = async () => {
    const token = Store.getState().auths.token;
    if (!token) {
      toast.error("Please login or create an account to book a service");
      onClose();
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }

    if (!serviceAddress.trim()) {
      toast.error("Service address is required");
      return;
    }
    if (!customerPhone.trim()) {
      toast.error("Customer phone number is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const callbackUrl = `${window.location.origin}/dashboard?tab=service_bookings`;
      const response = await createServiceBooking({
        service_id: service.id,
        scheduled_date: scheduledDate
          ? new Date(scheduledDate).toISOString()
          : new Date().toISOString(),
        service_address: serviceAddress,
        customer_phone: customerPhone,
        notes: notes,
        booking_fee: bookingFee,
        callback_url: callbackUrl,
      });

      const checkoutUrl = response?.data?.checkout_url;
      if (checkoutUrl) {
        toast.success("Redirecting to Paystack checkout...");
        window.location.href = checkoutUrl;
      } else {
        toast.success("Service booked successfully!");
        if (onSuccess) onSuccess();
        onClose();
        navigate("/dashboard?tab=service_bookings");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to book service";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="p-5 md:p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto custom-scrollbar-gray bg-white rounded-2xl flex flex-col gap-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Book {service.product_name}
            </h3>
            <p className="text-xs text-gray-500">
              Artisan: {service.user?.user_name || "Nedzl Artisan"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Escrow Banner */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-xs text-amber-800">
          <span className="text-base">🛡️</span>
          <div>
            <p className="font-bold">Nedzl Escrow Protection</p>
            <p>
              Your payment is held safely in escrow. Money is only released to
              the artisan after you mark the service as completed!
            </p>
          </div>
        </div>

        {/* Booking Inputs */}
        <div className="flex flex-col gap-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Preferred Date & Time
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-global-green"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Service Address / Location *
            </label>
            <textarea
              rows={2}
              placeholder="Enter exact address where service is needed..."
              value={serviceAddress}
              onChange={(e) => setServiceAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-global-green"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Your Contact Phone Number *
            </label>
            <input
              type="tel"
              placeholder="e.g. 08012345678"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-global-green"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Additional Requirements / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Any specific instructions for the artisan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-global-green"
            />
          </div>
        </div>

        {/* Fee Summary */}
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 flex flex-col gap-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Service Booking Fee</span>
            <span>₦{bookingFee.toLocaleString()}</span>
          </div>
          <div className="border-t border-emerald-200 my-1 pt-1.5 flex justify-between font-bold text-gray-900 text-base">
            <span>Escrow Payment Total</span>
            <span className="text-global-green">
              ₦{bookingFee.toLocaleString()}
            </span>
          </div>
        </div>

        <Button
          title={
            isSubmitting
              ? "Processing Booking..."
              : `Pay ₦${bookingFee.toLocaleString()} into Escrow`
          }
          handleClick={handleBookingCheckout}
          disabled={isSubmitting}
          btnStyles="w-full bg-global-green rounded-xl py-3 text-white font-bold"
          textStyle="text-white text-sm font-bold"
        />
      </div>
    </Modal>
  );
}
