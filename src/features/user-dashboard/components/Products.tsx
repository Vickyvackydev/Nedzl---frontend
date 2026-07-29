import React, { useEffect, useRef, useState } from "react";
import {
  ART_WORK,
  CALENDER_GREEN,
  CLOCK_GREEN,
  INFO_RED,
  UPLOAD,
} from "../../../assets";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentPage,
  selectProductFields,
  setCurrentPage,
  setProductFields,
} from "../../../state/slices/globalReducer";
import SelectInput from "../../../components/SelectInput";
import RichTextEditor from "../../../components/RichTextEditor";
import {
  categories,
  statesInNigeria,
  universitiesInNigeria,
} from "../../../constant";
import imageCompression from "browser-image-compression";

import { FiEdit2, FiSearch, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { ProductType } from "../../../types";
import {
  deleteProduct,
  getUserProducts,
  updateProduct,
  updateProductStatus,
  uploadProduct,
} from "../../../services/product.service";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { formatText } from "../../../utils";
import Modal from "../../../components/Modal";
import { Ban } from "lucide-react";
import Pagination from "../../../components/Pagination";
import { sanitizeRichText } from "../../../utils/sanitize";

type Tabs = "active" | "closed" | "reviewed";

function Products() {
  const [activeTab, setActiveTab] = useState<Tabs>("active");
  // const [showFields, setShowFields] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const currentPage = useSelector(selectCurrentPage);
  const [deleteModal, setDeleteModal] = useState(false);
  // const [closeProductModal, setCloseProductModal] = useState(false);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [productActionModal, setProductActionModal] = useState(false);
  const [productAction, setProductAction] = useState<
    "ONGOING" | "CLOSED" | null
  >(null);
  const showProductFields = useSelector(selectProductFields);
  const dispatch = useDispatch();
  const [images, setImages] = useState<File[]>([]);
  const maxImages = 5;
  const [loading, setLoading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [formFields, setFormFields] = useState({
    product_name: "",
    product_price: "",
    market_price_from: "",
    market_price_to: "",
    category_name: "",
    state: "",
    address_in_state: "",
    outstanding_issues: "",
    description: "",
    condition: "",
    is_negotiable: "",
    brand_name: "",
    university: "",
    product_type: "MARKET", // MARKET, FOOD, SERVICE
    delivery_fee: "",
  });
  const [subMenus, setSubMenus] = useState<{ name: string; price: string }[]>([]);
  const [newSubMenuName, setNewSubMenuName] = useState("");
  const [newSubMenuPrice, setNewSubMenuPrice] = useState("");

  const [selectedProductType, setSelectedProductType] = useState<string>("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    data: userProducts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-products", activeTab, currentPage, selectedProductType, searchKeyword],
    queryFn: () =>
      getUserProducts({
        status: activeTab === "active" ? "ONGOING" : activeTab.toUpperCase(),
        page: currentPage,
        product_type: selectedProductType === "ALL" ? undefined : selectedProductType,
        search: searchKeyword.trim() || undefined,
      }),
  });

  const tabs = [
    {
      label: "Active",
      // value: "ACTIVE",
    },
    {
      label: "Closed",
      // value: "CLOSED",
      // count: `(${userProducts?.data?.total})`,
    },
    // {
    //   label: "Reviewed",
    //   // value: "UNDER_REVIEW",
    //   count: `(${0})`,
    // },
  ];

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter(
      (file) => file.type === "image/jpeg" || file.type === "image/jpg",
    );

    if (validFiles.length < selectedFiles.length) {
      toast.error("Only JPG/JPEG images are allowed");
      if (validFiles.length === 0) return;
    }

    const availableSlots =
      maxImages - (existingImageUrls.length + images.length);

    if (availableSlots <= 0) {
      toast.error(`Maximum of ${maxImages} images is allowed`);
      return;
    }

    if (validFiles.length > availableSlots) {
      toast.error(`Maximum of ${maxImages} images is allowed.`);
    }

    const filesToAdd = validFiles.slice(0, availableSlots);
    setImages((prev) => [...prev, ...filesToAdd]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleEditImage = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg, .jpeg";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
        alert("Only JPG/JPEG images allowed");
        return;
      }
      const updated = [...images];
      updated[index] = file;
      setImages(updated);
    };
    input.click();
  };

  const handleEditProduct = (product: ProductType) => {
    setEditingProduct(product);

    // Populate form fields
    setFormFields({
      product_name: product.product_name || "",
      product_price:
        product.product_price
          ?.toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
      market_price_from:
        product.market_price_from
          ?.toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
      market_price_to:
        product.market_price_to
          ?.toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "",
      category_name: product.category_name || "",
      state: product.state || "",
      address_in_state: product.address_in_state || "",
      outstanding_issues: product.outstanding_issues || "",
      description: product.description || "",
      condition: product.condition || "",
      is_negotiable: product.is_negotiable ? "yes" : "no",
      brand_name: (product as any).brand_name || "",
      university: (product as any).university || "",
      product_type: product.product_type || "MARKET",
      delivery_fee: product.delivery_fee?.toString() || "",
    });

    // Handle existing images (URLs)
    const imageUrls = Array.isArray(product.image_urls)
      ? product.image_urls.filter(
          (img): img is string => typeof img === "string",
        )
      : [];
    setExistingImageUrls(imageUrls);
    setImages([]); // Clear new file uploads

    // Show the form
    dispatch(setProductFields(true));
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setExistingImageUrls([]);
    reset();
    dispatch(setProductFields(false));
  };

  const handleCreateProduct = async () => {
    // Type-specific required fields validation
    if (formFields.product_type === "FOOD") {
      if (!formFields.product_name) { toast.error("Meal Name is required"); return; }
      if (!formFields.product_price) { toast.error("Price is required"); return; }
      if (!formFields.category_name) { toast.error("Category is required"); return; }
      if (!formFields.state) { toast.error("State is required"); return; }
      if (!formFields.address_in_state) { toast.error("Kitchen / Delivery Address is required"); return; }
      if (!formFields.description) { toast.error("Meal Description is required"); return; }
      if (totalImagesCount < 1) { toast.error("Please upload at least 1 food photo"); return; }
    } else if (formFields.product_type === "SERVICE") {
      if (!formFields.product_name) { toast.error("Service Title is required"); return; }
      if (!formFields.product_price) { toast.error("Booking Rate is required"); return; }
      if (!formFields.category_name) { toast.error("Category is required"); return; }
      if (!formFields.state) { toast.error("State is required"); return; }
      if (!formFields.address_in_state) { toast.error("Service Address / Coverage is required"); return; }
      if (!formFields.description) { toast.error("Service Description is required"); return; }
      if (totalImagesCount < 1) { toast.error("Please upload at least 1 portfolio photo"); return; }
    } else {
      // Standard Market Product Validation
      const requiredFields = [
        { key: "product_name", label: "Product Name" },
        { key: "product_price", label: "Product Price" },
        { key: "market_price_from", label: "Market Price From" },
        { key: "market_price_to", label: "Market Price To" },
        { key: "category_name", label: "Category" },
        { key: "state", label: "State" },
        { key: "address_in_state", label: "Address" },
        { key: "description", label: "Description" },
        { key: "condition", label: "Condition" },
        { key: "is_negotiable", label: "Negotiable status" },
        { key: "brand_name", label: "Brand Name" },
        { key: "university", label: "University" },
      ];

      for (const field of requiredFields) {
        if (!formFields[field.key as keyof typeof formFields]) {
          toast.error(`${field.label} is required`);
          return;
        }
      }

      if (totalImagesCount < 2) {
        toast.error("Please add at least 2 photos");
        return;
      }
    }
    const maxFiles = 5;

    if (images.length > maxFiles) {
      toast.error(`You can upload a maximum of ${maxFiles} images`);
      setIsCreatingProduct(false);
      return;
    }

    setIsCreatingProduct(true);
    const allowedTypes = ["image/jpeg", "image/png"];

    for (const file of images) {
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG and PNG images are allowed");
        setIsCreatingProduct(false);
        return;
      }
    }

    const priceNum = Number(formFields.product_price.replace(/,/g, "")) || 0;
    const priceFromNum = formFields.market_price_from ? Number(formFields.market_price_from.replace(/,/g, "")) : priceNum;
    const priceToNum = formFields.market_price_to ? Number(formFields.market_price_to.replace(/,/g, "")) : priceNum;

    const formData = new FormData();
    formData.append("product_name", formFields.product_name);
    formData.append("product_price", priceNum as any);
    formData.append("market_price_from", priceFromNum as any);
    formData.append("market_price_to", priceToNum as any);
    formData.append("category_name", formFields.category_name);
    formData.append("condition", formFields.condition || (formFields.product_type === "FOOD" ? "Fresh" : "Professional"));
    formData.append("description", sanitizeRichText(formFields.description));
    formData.append(
      "is_negotiable",
      formFields.is_negotiable === "yes" || formFields.is_negotiable === "Yes"
        ? "true"
        : "false",
    );
    formData.append("state", formFields.state);
    formData.append("address_in_state", formFields.address_in_state);
    formData.append("outstanding_issues", formFields.outstanding_issues || "None");
    formData.append("brand_name", formFields.brand_name || (formFields.product_type === "FOOD" ? "Vendor Special" : "Artisan Service"));
    formData.append("university", formFields.university || "N/A");
    formData.append("product_type", formFields.product_type);
    formData.append("delivery_fee", formFields.delivery_fee.replace(/,/g, "") || "0");
    formData.append("sub_menus", JSON.stringify(subMenus));

    if (editingProduct) {
      //  send existing URLs + new images
      formData.append("image_urls", JSON.stringify(existingImageUrls));
      for (const image of images) {
        const compressedImage = await imageCompression(image, {
          maxSizeMB: 1, // <= 1MB
          maxWidthOrHeight: 1280, // good mobile resolution
          useWebWorker: true,
        });

        formData.append("new_images", compressedImage);
      }
    } else {
      //  only new image uploads
      for (const image of images) {
        const compressedImage = await imageCompression(image, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });

        formData.append("new_images", compressedImage);
      }
    }

    try {
      const response = editingProduct
        ? await updateProduct(
            editingProduct.id as string,
            formData,
            setUploadProgress,
          )
        : await uploadProduct(formData, setUploadProgress);

      if (response) {
        toast.success(response.message);
        reset();
        setEditingProduct(null);
        setExistingImageUrls([]);
        dispatch(setProductFields(false));
        setActiveTab("active");
        refetch();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "An error occured! Please try again",
      );
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const reset = () => {
    setFormFields({
      product_name: "",
      product_price: "",
      market_price_from: "",
      market_price_to: "",
      category_name: "",
      state: "",
      address_in_state: "",
      outstanding_issues: "",
      description: "",
      condition: "",
      is_negotiable: "",
      brand_name: "",
      university: "",
      product_type: "MARKET",
      delivery_fee: "",
    });
    setSubMenus([]);

    setImages([]);
    setExistingImageUrls([]);
    setEditingProduct(null);
  };

  const handleRemoveExistingImage = (index: number) => {
    const updated = [...existingImageUrls];
    updated.splice(index, 1);
    setExistingImageUrls(updated);
  };

  const totalImagesCount = existingImageUrls.length + images.length;

  useEffect(() => {
    if (showProductFields && !editingProduct) {
      reset();
      setEditingProduct(null);
      setExistingImageUrls([]);
    }
  }, [showProductFields, editingProduct]);

  const handleDeleteProduct = async () => {
    setLoading(true);

    try {
      const response = await deleteProduct(selectedProductId as string);
      if (response) {
        toast.success(response?.message);
        setDeleteModal(false);
        refetch();
        setSelectedProductId(null);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleProductAction = async () => {
    setLoading(true);

    try {
      const response = await updateProductStatus(
        selectedProductId as string,
        productAction as "CLOSED" | "ONGOING" | "REJECTED",
      );
      if (response) {
        toast.success(response?.message);
        setProductActionModal(false);
        refetch();
        setSelectedProductId(null);
        setActiveTab("active");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showProductFields ? (
        <div className="w-full p-4 flex flex-col gap-y-4 max-h-[600px] overflow-y-scroll custom-scrollbar-gray">
          {/* Listing Type Selection */}
          <div className="w-full flex flex-col gap-y-1.5 mb-2">
            <label className="text-sm font-semibold text-gray-700">Select Listing Type</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormFields({ ...formFields, product_type: "MARKET" })}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  formFields.product_type === "MARKET"
                    ? "bg-global-green text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                🛒 Market Product
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormFields({
                    ...formFields,
                    product_type: "FOOD",
                    category_name: formFields.category_name || "prepared-food",
                  })
                }
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  formFields.product_type === "FOOD"
                    ? "bg-global-green text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                🍲 Upload Food / Meal
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormFields({
                    ...formFields,
                    product_type: "SERVICE",
                    category_name: formFields.category_name || "other-services",
                  })
                }
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  formFields.product_type === "SERVICE"
                    ? "bg-global-green text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                🛠️ Upload Service
              </button>
            </div>
          </div>

          {/* Additional Food Fields */}
          {formFields.product_type === "FOOD" && (
            <div className="w-full bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 flex flex-col gap-y-3">
              <h4 className="text-sm font-bold text-global-green flex items-center gap-1.5">
                <span>🍲</span> Prepared Food & Meal Options
              </h4>
              <SelectInput
                isInput
                label="Delivery Fee (₦)"
                placeholder="Enter delivery fee (e.g. 1,000)"
                value={formFields.delivery_fee}
                setValue={(val) => {
                  const numeric = val.replace(/\D/g, "");
                  const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  setFormFields({ ...formFields, delivery_fee: formatted });
                }}
              />
              <div className="flex flex-col gap-y-2">
                <label className="text-xs font-semibold text-gray-700">Sub-Menus / Extras (Optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Extra Item (e.g., Fried Plantain)"
                    value={newSubMenuName}
                    onChange={(e) => setNewSubMenuName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border rounded-lg outline-none focus:border-global-green"
                  />
                  <input
                    type="text"
                    placeholder="Price (₦)"
                    value={newSubMenuPrice}
                    onChange={(e) => setNewSubMenuPrice(e.target.value.replace(/\D/g, ""))}
                    className="w-28 px-3 py-2 text-xs border rounded-lg outline-none focus:border-global-green"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSubMenuName && newSubMenuPrice) {
                        setSubMenus([...subMenus, { name: newSubMenuName, price: newSubMenuPrice }]);
                        setNewSubMenuName("");
                        setNewSubMenuPrice("");
                      }
                    }}
                    className="px-3 py-2 bg-global-green text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Add Extra
                  </button>
                </div>
                {subMenus.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {subMenus.map((sm, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 text-xs font-medium px-2.5 py-1 rounded-full text-gray-800">
                        {sm.name} (+₦{Number(sm.price).toLocaleString()})
                        <button
                          type="button"
                          onClick={() => setSubMenus(subMenus.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <SelectInput
            key="product_name"
            isInput
            required
            label={formFields.product_type === "FOOD" ? "Meal Name" : formFields.product_type === "SERVICE" ? "Service / Skill Title" : "Product Name"}
            placeholder={formFields.product_type === "FOOD" ? "e.g., Jollof Rice & Grilled Chicken" : formFields.product_type === "SERVICE" ? "e.g., Professional Plumbing Services" : "Kindly enter product name"}
            value={formFields.product_name}
            setValue={(e) => setFormFields({ ...formFields, product_name: e })}
          />
          {/* Price Fields */}
          <div className="w-full flex flex-col md:flex-row items-center gap-3 justify-between">
            <SelectInput
              key="product_price"
              isInput
              required
              label={
                formFields.product_type === "FOOD"
                  ? "Price per Portion / Plate (₦)"
                  : formFields.product_type === "SERVICE"
                  ? "Booking Rate / Fee (₦)"
                  : "Product Price"
              }
              value={formFields.product_price}
              placeholder="Enter price in Naira"
              setValue={(val) => {
                const numeric = val.replace(/\D/g, "");
                const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                setFormFields({ ...formFields, product_price: formatted });
              }}
            />
            {formFields.product_type === "MARKET" && (
              <div className="flex items-center gap-3 w-full">
                <SelectInput
                  key="market_price_from"
                  isInput
                  required
                  label="Market Price"
                  value={formFields.market_price_from}
                  placeholder="From"
                  setValue={(val) => {
                    const numeric = val.replace(/\D/g, "");
                    const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    setFormFields({ ...formFields, market_price_from: formatted });
                  }}
                />
                <SelectInput
                  key="market_price_to"
                  isInput
                  required
                  label="To"
                  placeholder="To"
                  value={formFields.market_price_to}
                  setValue={(val) => {
                    const numeric = val.replace(/\D/g, "");
                    const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    setFormFields({ ...formFields, market_price_to: formatted });
                  }}
                />
              </div>
            )}
          </div>

          {/* Categories & Options */}
          <div className="w-full flex flex-col md:flex-row items-center gap-3 justify-between">
            <SelectInput
              required
              label="Category"
              options={
                formFields.product_type === "FOOD"
                  ? [
                      { label: "Prepared Food", value: "prepared-food" },
                      { label: "Foodstuffs", value: "foodstuffs" },
                      { label: "Fruits & Vegetables", value: "fruits-vegetables" },
                    ]
                  : formFields.product_type === "SERVICE"
                  ? [{ label: "Other Services", value: "other-services" }]
                  : categories
              }
              value={formatText(formFields.category_name)}
              placeholder="Please select"
              onChange={(e) => setFormFields({ ...formFields, category_name: e })}
            />
            {formFields.product_type === "MARKET" && (
              <SelectInput
                required
                label="Negotiable"
                value={formatText(formFields.is_negotiable)}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
                placeholder="Please select"
                setValue={(e) => setFormFields({ ...formFields, is_negotiable: e })}
              />
            )}
          </div>

          {/* Description */}
          <div className="w-full flex flex-col gap-y-1">
            <label className="text-xs font-semibold text-gray-700">
              {formFields.product_type === "FOOD"
                ? "Meal Details & Ingredients"
                : formFields.product_type === "SERVICE"
                ? "Service Description & Skills Offered"
                : "Product Description"}
            </label>
            <RichTextEditor
              content={formFields.description}
              onChange={(e) => setFormFields({ ...formFields, description: e })}
            />
          </div>

          {/* Location */}
          <div className="w-full flex flex-col md:flex-row items-center gap-3 justify-between">
            <SelectInput
              required
              label="State"
              value={formatText(formFields.state)}
              options={statesInNigeria}
              placeholder="Please select"
              setValue={(e) => setFormFields({ ...formFields, state: e })}
            />
            <SelectInput
              isInput
              required
              label={
                formFields.product_type === "FOOD"
                  ? "Kitchen / Restaurant Address"
                  : formFields.product_type === "SERVICE"
                  ? "Base Address / Service Coverage Area"
                  : "Address in state"
              }
              placeholder={
                formFields.state
                  ? `Where in ${formatText(formFields.state)}`
                  : "Enter address"
              }
              value={formFields.address_in_state}
              setValue={(val) => setFormFields({ ...formFields, address_in_state: val })}
            />
          </div>

          {/* Market Only Fields: Condition, Brand, University, Outstanding Issues */}
          {formFields.product_type === "MARKET" && (
            <>
              <div className="w-full flex flex-col md:flex-row items-center gap-3 justify-between">
                <SelectInput
                  required
                  label="Condition"
                  options={[
                    { label: "Brand New", value: "brand-new" },
                    { label: "Used", value: "used" },
                  ]}
                  value={formatText(formFields.condition)}
                  placeholder="Please select"
                  setValue={(e) => setFormFields({ ...formFields, condition: e })}
                />
                <SelectInput
                  isInput
                  required
                  label="Brand Name"
                  placeholder={"Enter product brand"}
                  value={formFields.brand_name}
                  setValue={(val) => setFormFields({ ...formFields, brand_name: val })}
                />
              </div>

              <div className="w-full flex flex-col md:flex-row items-center gap-3 justify-between">
                <SelectInput
                  required
                  label="University (Student only)"
                  options={universitiesInNigeria}
                  value={formatText(formFields.university)}
                  placeholder="Please select your university"
                  setValue={(e) => setFormFields({ ...formFields, university: e })}
                />
                <div className="w-full hidden md:block" />
              </div>

              <div className="w-full flex flex-col gap-y-2">
                <div className="w-full flex items-center justify-between">
                  <span className="text-primary-300 font-medium text-sm">
                    Outstanding issues (optional)
                  </span>
                  <span className="text-sm font-medium text-[#808080]">
                    {formFields.outstanding_issues?.length || 0} / 250
                  </span>
                </div>
                <div className="w-full bg-[#FFF1F0] p-3 rounded-xl flex items-start justify-start gap-x-2">
                  <img src={INFO_RED} className="w-[20px] h-[20px]" alt="" />
                  <span className="text-sm font-normal text-primary-300">
                    If the product has any minor defects or faults that the buyer
                    has to be aware of, list all of them here.
                  </span>
                </div>
                <textarea
                  name=""
                  rows={3}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormFields({ ...formFields, outstanding_issues: e.target.value })
                  }
                  value={formFields.outstanding_issues}
                  maxLength={250}
                  className="w-full outline-none p-3 border rounded-xl placeholder:text-[#808080] placeholder:text-sm text-primary-300 text-sm border-borderColor resize-none"
                  placeholder="Describe any faults..."
                />
              </div>
            </>
          )}

          <div className="w-full flex flex-col relative gap-y-3 p-3 rounded-xl border border-borderColor">
            <span className="text-primary-300 font-normal text-sm">
              Add Photos
            </span>

            <div className="w-full bg-[#FFF1F0] p-3 rounded-xl flex items-start justify-start gap-x-2">
              <img src={INFO_RED} className="w-[20px] h-[20px]" alt="" />
              <span className="text-sm font-normal text-primary-300">
                Add at least 2 photos for this category, First picture - is the
                title picture. You can change the order of photos: just grab
                your photos and drag
              </span>
            </div>
            {totalImagesCount < 1 && (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="w-full  h-[250px] rounded-xl border border-dotted border-[#E97A3B] bg-[#E97A3B08] flex items-center flex-col gap-y-2 justify-center "
              >
                <div className="flex items-center w-[40px] h-[40px] rounded-xl justify-center bg-white shadow-box-shadow">
                  <img src={UPLOAD} className="w-[20px] h-[20px]" alt="" />
                </div>
                <span className="text-[#4F5762] font-medium text-sm">
                  Click here to upload
                </span>
                <span className="text-xs font-normal text-[#808080]">
                  PNG, JPG up to 5MB
                </span>
              </div>
            )}

            <div
              className={`w-full h-auto flex-wrap gap-2 p-2 rounded-xl border border-dotted border-[#E97A3B] bg-[#E97A3B08] transition-all duration-300 ${
                totalImagesCount > 0 ? "flex" : "hidden"
              }`}
            >
              {/* Existing image URLs (from editing) */}
              {existingImageUrls.map((url, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative w-[100px] h-[100px] rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt={`existing-${idx}`}
                    className="object-cover w-full h-full"
                  />
                  {/* Delete Icon */}
                  <button
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <FiX className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}

              {/* New image file previews */}
              {images.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={`new-${idx}`}
                    className="relative w-[100px] h-[100px] rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center"
                  >
                    <img
                      src={url}
                      alt={`selected-${idx}`}
                      className="object-cover w-full h-full"
                    />
                    {/* Edit Icon */}
                    <button
                      onClick={() => handleEditImage(idx)}
                      className="absolute top-1 left-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <FiEdit2 className="w-4 h-4 text-gray-700" />
                    </button>
                    {/* Delete Icon */}
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <FiX className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                );
              })}
              {totalImagesCount < maxImages && (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="w-[100px] h-[100px] border border-dotted border-[#E97A3B] bg-[#E97A3B08] rounded-lg flex-col gap-y-2 flex items-center justify-center "
                >
                  <div className="flex items-center w-[30px] h-[30px] rounded-xl justify-center bg-white shadow-box-shadow">
                    <img src={UPLOAD} className="w-[15x] h-[15px]" alt="" />
                  </div>
                  <span className="text-[#4F5762] font-medium text-xs">
                    Add more
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* <ImageUploader /> */}
          <div className="w-full flex items-end justify-end gap-3 pb-20 md:pb-0">
            {editingProduct && (
              <Button
                title="Cancel"
                btnStyles="bg-gray-500 w-fit px-5 h-[40px] rounded-xl"
                textStyle="text-white text-sm font-medium"
                handleClick={handleCancelEdit}
              />
            )}
            <Button
              title={editingProduct ? "Update Product" : "Save & continue"}
              loading={isCreatingProduct}
              disabled={isCreatingProduct}
              btnStyles="bg-global-green w-fit px-5 h-[40px] rounded-xl"
              textStyle="text-white text-sm font-medium"
              handleClick={handleCreateProduct}
            />
          </div>
          <input
            type="file"
            ref={imageInputRef}
            multiple
            accept=".jpg, .jpeg"
            className="hidden"
            onChange={handleAddImages}
          />
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 pb-2.5 border-b border-[#E9EAEB]">
            <div className="flex items-center gap-x-5">
              {tabs.map((t) => (
                <div key={t.label} className="w-fit relative">
                  <span
                    onClick={() => {
                      setActiveTab(t.label.toLowerCase() as Tabs);
                      dispatch(setCurrentPage(1));
                    }}
                    className={`text-sm cursor-pointer relative px-3 ${
                      activeTab === t.label.toLowerCase()
                        ? "text-global-green font-semibold"
                        : "text-faded-black-light font-medium"
                    }`}
                  >
                    {t.label.toUpperCase()}
                  </span>
                  {activeTab === t.label.toLowerCase() && (
                    <div className="border-b-[3px] border-global-green absolute w-full top-8" />
                  )}
                </div>
              ))}
            </div>

            {/* Search Input & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              {/* Search Field */}
              <div className="relative w-full sm:w-[240px] flex items-center">
                <FiSearch className="absolute left-3 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search your listed items..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    dispatch(setCurrentPage(1));
                  }}
                  className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-global-green focus:ring-1 focus:ring-global-green outline-none transition-all bg-gray-50/50"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchKeyword("");
                      dispatch(setCurrentPage(1));
                    }}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Section Type Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full sm:w-auto">
                {[
                  { label: "All Items", value: "ALL" },
                  { label: "Marketplace", value: "MARKET" },
                  { label: "Meals", value: "FOOD" },
                  { label: "Bookings", value: "SERVICE" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      setSelectedProductType(filter.value);
                      dispatch(setCurrentPage(1));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedProductType === filter.value
                        ? "bg-global-green text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {userProducts?.data?.data?.length > 0 ? (
            <div className="max-h-[500px] w-full overflow-auto px-4 py-7">
              <div className="flex items-start flex-col gap-y-3 w-full">
                {userProducts?.data?.data?.map((item: ProductType) => (
                  <div key={item.id} className="w-full flex flex-col md:flex-row items-start justify-between p-3 rounded-lg gap-y-3 border border-gray-100 bg-white">
                    <div className="w-full flex flex-col md:flex-row items-start gap-3">
                      <img
                        src={item?.image_urls[0] as string}
                        className="w-full max-w-[208px] h-[208px] rounded-lg object-cover"
                        alt=""
                      />
                      <div className="w-full flex flex-col gap-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-fit px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                            item.product_type === "FOOD"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : item.product_type === "SERVICE"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}>
                            {item.product_type === "FOOD" ? "🍲 Meal / Food" : item.product_type === "SERVICE" ? "🛠️ Service / Booking" : "🛒 Marketplace"}
                          </span>
                        </div>
                        <span className="text-xl font-semibold text-global-green">
                          ₦
                          {item.product_price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                        <span className="text-xl font-semibold text-primary-300">
                          {item.product_name}
                        </span>
                        <div className="w-fit text-[#F2C94C] bg-[#F2C94C1A] p-1 rounded-md text-xs font-medium">
                          {item.status === "UNDER_REVIEW" && "Reviewing"}
                        </div>
                        <div className="w-fit h-fit border border-[#E9EAEB] flex items-center gap-x-2 rounded-lg p-1.5 text-xs font-medium text-primary-300">
                          <img
                            src={CALENDER_GREEN}
                            className="w-[12px] h-[12px]"
                            alt=""
                          />
                          <span>
                            Created {moment(item.created_at).format("D/MM")}
                          </span>
                        </div>

                        <div
                          className={`w-fit h-fit border border-[#E9EAEB] flex items-center gap-x-2 rounded-lg p-1.5 text-xs font-medium text-primary-300 ${
                            activeTab === "active"
                              ? "text-global-green"
                              : "text-red-500"
                          }`}
                        >
                          {activeTab === "active" ? (
                            <img
                              src={CLOCK_GREEN}
                              className="w-[12px] h-[12px]"
                              alt=""
                            />
                          ) : (
                            <Ban className="w-[12px] h-[12px]" color="red" />
                          )}
                          <span>
                            {activeTab === "active"
                              ? "Your Product is Live"
                              : "This Product has being closed and won't appear on sales"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex lg:flex-nowrap flex-wrap items-center gap-2 w-full md:w-auto">
                      {/* Edit */}
                      {activeTab === "active" && (
                        <button
                          onClick={() => handleEditProduct(item)}
                          className="py-1.5 px-4 rounded-lg text-xs font-medium
                        bg-green-600 text-white hover:bg-green-700 
                        transition-all duration-200"
                        >
                          Edit
                        </button>
                      )}
                      {activeTab === "closed" && (
                        <button
                          onClick={() => {
                            setSelectedProductId(item?.id as string);
                            setProductAction("ONGOING");
                            setProductActionModal(true);
                          }}
                          className="py-1.5 px-4 rounded-lg text-nowrap text-xs font-medium
                        bg-green-600 text-white hover:bg-green-700 
                        transition-all duration-200"
                        >
                          Re-Open
                        </button>
                      )}
                      {/* Delete */}
                      <button
                        onClick={() => {
                          setSelectedProductId(item?.id as string);
                          setDeleteModal(true);
                        }}
                        className="py-1.5 px-4 rounded-lg text-xs font-medium
               bg-red-500 text-white hover:bg-red-600 
               transition-all duration-200"
                      >
                        Delete
                      </button>

                      {/* Close */}
                      {activeTab === "active" && (
                        <button
                          onClick={() => {
                            setSelectedProductId(item?.id as string);
                            setProductAction("CLOSED");
                            setProductActionModal(true);
                          }}
                          className="py-1.5 px-4 rounded-lg text-xs font-medium
                        bg-gray-200 text-gray-700 hover:bg-gray-300
                        transition-all duration-200"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {userProducts?.data?.totalPages > 1 && (
                <div className="w-full flex justify-end mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={userProducts?.data?.totalPages}
                    onPageChange={(page) => {
                      dispatch(setCurrentPage(page));
                    }}
                  />
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className="flex space-x-1 h-[75vh] justify-center items-center">
              <div
                className="w-2 h-2 bg-global-green rounded-full animate-preloader-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-global-green rounded-full animate-preloader-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-global-green rounded-full animate-preloader-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-y-2 justify-center h-[70vh]">
              <img src={ART_WORK} className="w-[90.1px] h-[100px]" alt="" />
              <span className="text-xl font-semibold text-black text-center">
                {searchKeyword
                  ? `No items found matching "${searchKeyword}"`
                  : activeTab === "closed"
                  ? `You have no closed ${
                      selectedProductType === "FOOD"
                        ? "meals"
                        : selectedProductType === "SERVICE"
                        ? "services/bookings"
                        : selectedProductType === "MARKET"
                        ? "marketplace products"
                        : "listings"
                    }!`
                  : `You have not posted any ${
                      selectedProductType === "FOOD"
                        ? "meals"
                        : selectedProductType === "SERVICE"
                        ? "services/bookings"
                        : selectedProductType === "MARKET"
                        ? "marketplace products"
                        : "listings"
                    } yet!`}
              </span>
              <span className="text-[#555555] font-normal text-sm">
                {activeTab === "closed"
                  ? "Closed listings will appear here"
                  : "Posted items in this category will appear here"}
              </span>
              <Button
                title="Post a new product"
                textStyle="text-white font-medium text-sm"
                handleClick={() => {
                  reset();
                  dispatch(setProductFields(true));
                }}
                btnStyles="w-fit px-5 py-3 rounded-xl bg-global-green"
              />
            </div>
          )}
        </>
      )}
      <FullScreenLoader
        isLoading={isCreatingProduct}
        progress={uploadProgress}
        message={editingProduct ? "Updating" : "Creating"}
      />
      <Modal
        show={productActionModal}
        onClose={() => setProductActionModal(false)}
      >
        <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {productAction === "CLOSED" ? "Close" : "Re-Open"} Product?
          </h3>

          <p className="text-gray-600 text-sm mb-6">
            Are you sure you want to{" "}
            {productAction === "CLOSED" ? "close" : "re-open"} this Product?
            This product would{" "}
            {productAction === "CLOSED"
              ? "be marked as sold"
              : "be back on sale"}
          </p>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
              onClick={() => setProductActionModal(false)}
            >
              Cancel
            </button>

            <Button
              title={productAction === "CLOSED" ? "Close" : "Re-Open"}
              textStyle="text-sm font-medium text-white"
              disabled={loading}
              btnStyles={`px-4 py-2 rounded-lg   transition ${
                productAction === "CLOSED"
                  ? "bg-gray-800 hover:bg-gray-900"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              loaderSize={"w-1 h-1"}
              handleClick={handleProductAction}
              loading={loading}
            />
          </div>
        </div>
      </Modal>
      <Modal show={deleteModal} onClose={() => setDeleteModal(false)}>
        <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Product?
          </h3>

          <p className="text-gray-600 text-sm mb-6">
            This action cannot be undone. Do you want to permanently delete this
            product?
          </p>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </button>

            <Button
              title="Yes, Delete"
              textStyle="text-sm font-medium text-white"
              btnStyles="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
              loaderSize={"w-1 h-1"}
              handleClick={handleDeleteProduct}
              loading={loading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Products;
