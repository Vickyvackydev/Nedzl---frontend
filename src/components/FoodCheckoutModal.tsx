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

  const images = Array.isArray(meal.image_urls) ? meal.image_urls : [];
  const imageUrl =
    typeof images[0] === "string" ? images[0] : "https://nedzl.com/placeholder.png";

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
      <div className="p-0 max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar-gray bg-white rounded-3xl flex flex-col shadow-2xl relative border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all shadow-md"
        >
          &times;
        </button>

        {/* Meal Image Header */}
        <div className="relative h-56 w-full bg-gray-100 flex-shrink-0">
          <img
            src={imageUrl}
            alt={meal.product_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              ₦{basePrice.toLocaleString()}
            </span>
            {meal.delivery_fee ? (
              <span className="bg-white/90 backdrop-blur-md text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                🛵 Delivery: ₦{meal.delivery_fee.toLocaleString()}
              </span>
            ) : (
              <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Free Delivery
              </span>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col gap-y-4">
          {/* Header info */}
          <div className="flex flex-col gap-y-1 border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Vendor: {meal.user?.user_name || "Nedzl Food Vendor"}
              </span>
              {meal.user?.phone_number && (
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  📞 {meal.user.phone_number}
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mt-1">
              {meal.product_name}
            </h3>
          </div>

          {/* Full Meal Description */}
          {meal.description && (
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex flex-col gap-y-1 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Meal Details & Description
              </h4>
              <div
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: meal.description }}
              />
            </div>
          )}

          {/* Sub-menus Extras Selection */}
          {subMenuOptions.length > 0 && (
            <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 flex flex-col gap-y-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Customize Your Order (Extras & Sides)
              </h4>
              <div className="flex flex-col gap-y-1.5">
                {subMenuOptions.map((item, idx) => {
                  const isSelected = selectedSubMenus.some(
                    (s) => s.name === item.name,
                  );
                  return (
                    <label
                      key={idx}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-sm"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSubMenu(item)}
                          className="w-4 h-4 rounded accent-emerald-600"
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-bold text-emerald-700">
                        +₦{item.price.toLocaleString()}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Address & Phone Inputs */}
          <div className="flex flex-col gap-y-3 pt-1">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Delivery Information
            </h4>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Your Phone Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. 08012345678"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Delivery Address *
              </label>
              <textarea
                rows={2}
                placeholder="Enter full delivery location, hostel name, or room number..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Order Price Breakdown */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col gap-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Base Meal Price</span>
              <span>₦{basePrice.toLocaleString()}</span>
            </div>
            {extrasTotal > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Extras Total</span>
                <span className="text-emerald-600">+₦{extrasTotal.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 my-1 pt-2 flex justify-between font-extrabold text-gray-900 text-base">
              <span>Total Payable</span>
              <span className="text-emerald-600">
                ₦{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            title={
              isSubmitting
                ? "Processing Checkout..."
                : `Place Order • Pay ₦${grandTotal.toLocaleString()}`
            }
            handleClick={handleCheckout}
            disabled={isSubmitting}
            btnStyles="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-2xl py-3.5 text-white font-extrabold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            textStyle="text-white text-sm font-bold"
          />
        </div>
      </div>
    </Modal>
  );
}
