import React, { useState } from "react";
import Modal from "./Modal";
import { uploadGuestProduct } from "../services/product.service";
import toast from "react-hot-toast";
import { FiX, FiUploadCloud, FiInfo, FiTag } from "react-icons/fi";

interface GuestProductListingModalProps {
  show: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Electronics",
  "Electricals",
  "Fashion & Clothing",
  "Phones & Accessories",
  "Home & Living",
  "Books & Stationery",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Other",
];

const STATES = [
  "Abia",
  "Abuja (FCT)",
  "Anambra",
  "Ebonyi",
  "Enugu",
  "Imo",
  "Lagos",
  "Rivers",
  "Oyo",
  "Kano",
  "Other",
];

export default function GuestProductListingModal({
  show,
  onClose,
}: GuestProductListingModalProps) {
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [condition, setCondition] = useState("NEW");
  const [state, setState] = useState("Enugu");
  const [addressInState] = useState("");
  const [description, setDescription] = useState("");
  const [isNegotiable] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length + images.length > 5) {
        toast.error("You can upload up to 5 images max");
        return;
      }
      const newImages = [...images, ...selectedFiles];
      setImages(newImages);
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setPreviewUrls(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newImages.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail.trim() || !guestPhone.trim()) {
      toast.error("Please enter your email and phone number");
      return;
    }
    if (
      !productName.trim() ||
      !productPrice ||
      !categoryName ||
      !description.trim()
    ) {
      toast.error("Please fill in all required product fields");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image of your item");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("guest_email", guestEmail.trim());
      formData.append("guest_phone", guestPhone.trim());
      formData.append("product_name", productName.trim());
      formData.append("product_price", productPrice);
      formData.append("market_price_from", productPrice);
      formData.append("market_price_to", productPrice);
      formData.append("category_name", categoryName);
      formData.append("condition", condition);
      formData.append("state", state);
      formData.append(
        "address_in_state",
        addressInState.trim() || "Main Campus",
      );
      formData.append("description", description.trim());
      formData.append("is_negotiable", isNegotiable ? "true" : "false");
      formData.append("product_type", "MARKET"); // Selling items strictly

      images.forEach((file) => {
        formData.append("new_images", file);
      });

      await uploadGuestProduct(formData, setProgress);
      toast.success(
        "Product listed successfully! Check your email to manage your item.",
      );
      onClose();
      // Reset form
      setProductName("");
      setProductPrice("");
      setDescription("");
      setImages([]);
      setPreviewUrls([]);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to list guest product",
      );
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={onClose}>
      <div className="p-5 md:p-6 max-w-xl w-full bg-white rounded-2xl flex flex-col gap-y-4 shadow-2xl geist-family max-h-[90vh] overflow-y-auto custom-scrollbar-gray">
        {/* Header */}
        <div className="flex items-start justify-between gap-x-2 border-b border-borderColor pb-3">
          <div className="flex items-start gap-2.5 flex-1 pr-2">
            <FiTag className="text-global-green w-5 h-5 mt-0.5 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
              Quick List a Selling Product (No Registration Needed)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors shrink-0 mt-0.5"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
          <FiInfo className="text-emerald-600 w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold block">
              1-Item Guest Listing Guarantee
            </span>
            <span>
              Unregistered visitors can list 1 selling item instantly. Creating
              an account later with this same email (
              <strong>{guestEmail || "your email"}</strong>) will automatically
              add this item to your seller dashboard!
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          {/* Guest Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex flex-col gap-y-1">
              <label className="text-xs font-bold text-gray-700">
                Your Email *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. john@gmail.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label className="text-xs font-bold text-gray-700">
                Your Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 08012345678"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Clean 2.8kVA Generator / Air Fryer"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Price (₦) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 37000"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Category *
              </label>
              <select
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="NEW">New (Brand New)</option>
                <option value="USED">Used / Pre-owned</option>
                <option value="REFURBISHED">Refurbished</option>
              </select>
            </div>
            <div className="flex flex-col gap-y-1">
              <label className="text-xs font-semibold text-gray-700">
                State / Location *
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {STATES.map((st, i) => (
                  <option key={i} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Description & Details *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe your item, features, usage duration, reason for selling..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Upload Images */}
          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Product Images (At least 1) *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-global-green transition-colors bg-gray-50/50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="guest-product-images"
              />
              <label
                htmlFor="guest-product-images"
                className="cursor-pointer flex flex-col items-center"
              >
                <FiUploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                <span className="text-xs font-bold text-gray-700">
                  Click to upload product photos
                </span>
                <span className="text-[11px] text-gray-500">
                  PNG, JPG, WEBP up to 5MB
                </span>
              </label>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0"
                  >
                    <img
                      src={url}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5"
                    >
                      <FiX size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-global-green h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2 border-t border-borderColor mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-global-green hover:bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              {loading ? `Uploading (${progress}%)...` : "Post Guest Product"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
