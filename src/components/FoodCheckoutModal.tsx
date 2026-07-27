import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import Button from "./Button";
import { ProductType } from "../types";
import toast from "react-hot-toast";
import { Store } from "../state/store";
import { createFoodOrder } from "../services/foodOrders.service";

interface FoodCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: ProductType | null;
  onSuccess?: () => void;
}

export default function FoodCheckoutModal({
  isOpen,
  onClose,
  meal,
  onSuccess,
}: FoodCheckoutModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSubMenus, setSelectedSubMenus] = useState<
    { name: string; price: number }[]
  >([]);
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!meal) return null;

  // Parse sub-menus from meal
  let subMenuOptions: { name: string; price: number }[] = [];
  if (meal.sub_menus) {
    try {
      const parsed =
        typeof meal.sub_menus === "string"
          ? JSON.parse(meal.sub_menus)
          : meal.sub_menus;
      if (Array.isArray(parsed)) {
        subMenuOptions = parsed.map((item: any) => ({
          name: item.name || "",
          price: Number(item.price) || 0,
        }));
      }
    } catch (e) {
      console.error("Failed to parse sub_menus", e);
    }
  }

  const basePrice = meal.product_price || 0;
  const deliveryFee = meal.delivery_fee || 0;
  const extrasTotal = selectedSubMenus.reduce(
    (sum, item) => sum + item.price,
    0,
  );
  const grandTotal = basePrice + extrasTotal + deliveryFee;

  const toggleSubMenu = (item: { name: string; price: number }) => {
    if (selectedSubMenus.some((s) => s.name === item.name)) {
      setSelectedSubMenus(selectedSubMenus.filter((s) => s.name !== item.name));
    } else {
      setSelectedSubMenus([...selectedSubMenus, item]);
    }
  };

  const handleCheckout = async () => {
    const user = Store.getState().auths.user;
    const token = Store.getState().auths.token;
    if (!token) {
      toast.error("Please login or create an account to place a food order");
      onClose();
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    if (!customerPhone.trim()) {
      toast.error("Phone number is required before checkout");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Delivery address is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const callbackUrl = `${window.location.origin}/dashboard?tab=my_orders`;
      const response = await createFoodOrder({
        product_id: meal.id,
        sub_menus: selectedSubMenus,
        customer_name: user?.user_name || customerName || "Customer",
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        total_amount: grandTotal,
        callback_url: callbackUrl,
      });

      const checkoutUrl = response?.data?.checkout_url;
      if (checkoutUrl) {
        toast.success("Redirecting to Paystack checkout...");
        window.location.href = checkoutUrl;
      } else {
        toast.success("🍲 Food order placed successfully!");
        if (onSuccess) onSuccess();
        onClose();
        navigate("/dashboard?tab=my_orders");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to place order";
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
              Order {meal.product_name}
            </h3>
            <p className="text-xs text-gray-500">
              Vendor: {meal.user?.user_name || "Nedzl Vendor"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Sub-menus Extras Selection */}
        {subMenuOptions.length > 0 && (
          <div className="bg-gray-50 p-3.5 rounded-xl flex flex-col gap-y-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Add Extras & Sides
            </h4>
            <div className="flex flex-col gap-y-1.5">
              {subMenuOptions.map((item, idx) => {
                const isSelected = selectedSubMenus.some(
                  (s) => s.name === item.name,
                );
                return (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg border text-sm cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-50 border-global-green text-global-green font-semibold"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSubMenu(item)}
                        className="rounded accent-global-green"
                      />
                      <span>{item.name}</span>
                    </div>
                    <span>+₦{item.price.toLocaleString()}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Customer Address & Phone Inputs */}
        <div className="flex flex-col gap-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Your Phone Number *
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
              Delivery Address *
            </label>
            <textarea
              rows={2}
              placeholder="Enter full delivery location, hostel, or house address..."
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-global-green"
            />
          </div>
        </div>

        {/* Order Price Breakdown */}
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 flex flex-col gap-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Base Meal Price</span>
            <span>₦{basePrice.toLocaleString()}</span>
          </div>
          {extrasTotal > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Extras Total</span>
              <span>+₦{extrasTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>₦{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="border-t border-emerald-200 my-1 pt-1.5 flex justify-between font-bold text-gray-900 text-base">
            <span>Total Payable</span>
            <span className="text-global-green">
              ₦{grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <Button
          title={
            isSubmitting
              ? "Processing Checkout..."
              : `Pay ₦${grandTotal.toLocaleString()}`
          }
          handleClick={handleCheckout}
          disabled={isSubmitting}
          btnStyles="w-full bg-global-green rounded-xl py-3 text-white font-bold"
          textStyle="text-white text-sm font-bold"
        />
      </div>
    </Modal>
  );
}
