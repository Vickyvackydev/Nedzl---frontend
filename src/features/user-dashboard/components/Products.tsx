import React, { useRef, useState } from "react";
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
  selectProductFields,
  setProductFields,
} from "../../../state/slices/globalReducer";
import SelectInput from "../../../components/SelectInput";
import RichTextEditor from "../../../components/RichTextEditor";
import { categories, statesInNigeria } from "../../../constant";

import { FiEdit2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { ProductType } from "../../../types";
import {
  getUserProducts,
  uploadProduct,
} from "../../../services/product.service";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

type Tabs = "active" | "closed" | "reviewed";
const tabs = [
  {
    label: "Active",
  },
  {
    label: "Closed",
    count: `(${0})`,
  },
  {
    label: "Reviewed",
    count: `(${0})`,
  },
];
function Products() {
  const [activeTab, setActiveTab] = useState<Tabs>("active");
  // const [showFields, setShowFields] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const showProductFields = useSelector(selectProductFields);
  const dispatch = useDispatch();
  const [images, setImages] = useState<File[]>([]);
  const maxImages = 5;
  const formatText = (text: string) =>
    text.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
  });

  const {
    data: userProducts,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ["user-products"], queryFn: getUserProducts });

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const validFiles = files.filter(
      (file) => file.type === "image/jpeg" || file.type === "image/jpg"
    );

    if (validFiles.length < files.length) {
      toast.error("Only JPG/JPEG images are allowed");
      return;
    }
    if (validFiles.length > maxImages) {
      toast.error("Maximum of 5 images is allowed");
      return;
    }

    const totalFiles = [...images, ...validFiles].slice(0, maxImages);
    setImages(totalFiles);
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

  const handleCreateProduct = async () => {
    setIsCreatingProduct(true);

    const formData = new FormData();
    formData.append("product_name", formFields.product_name);
    formData.append(
      "product_price",
      Number(formFields.product_price.replace(/,/g, "")) as any
    );
    formData.append(
      "market_price_from",
      Number(formFields.market_price_from.replace(/,/g, "")) as any
    );
    formData.append(
      "market_price_to",
      Number(formFields.market_price_to.replace(/,/g, "")) as any
    );
    formData.append("category_name", formFields.category_name);
    formData.append("condition", formFields.condition);
    formData.append("description", formFields.description);
    formData.append(
      "is_negotiable",
      formFields.is_negotiable === "Yes" ? true : (false as any)
    );
    formData.append("state", formFields.state);
    formData.append("address_in_state", formFields.address_in_state);
    formData.append("outstanding_issues", formFields.outstanding_issues);
    images.forEach((image) => formData.append("image_urls", image));

    try {
      const response = await uploadProduct(formData, setUploadProgress);
      if (response) {
        toast.success(response.message);
        reset();
        dispatch(setProductFields(false));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
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
    });

    setImages([]);
  };

  return (
    <div>
      {showProductFields ? (
        <div className="w-full p-4 flex flex-col gap-y-4 max-h-[600px] overflow-y-scroll custom-scrollbar-gray">
          <SelectInput
            isInput
            required
            label="Product Name"
            placeholder="Kindly enter product name"
            setValue={(e) => setFormFields({ ...formFields, product_name: e })}
          />
          <div className="w-full flex items-center gap-3 justify-between">
            <SelectInput
              isInput
              required
              label="Product Price"
              value={formFields.product_price}
              placeholder="Enter product price"
              setValue={(val) => {
                const numeric = val.replace(/\D/g, ""); // only digits
                const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                setFormFields({ ...formFields, product_price: formatted });
              }}
            />
            <div className="flex items-center gap-3 w-full">
              <SelectInput
                isInput
                required
                label="Market Price"
                value={formFields.market_price_from}
                placeholder="From"
                setValue={(val) => {
                  const numeric = val.replace(/\D/g, ""); // only digits
                  const formatted = numeric.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  );
                  setFormFields({
                    ...formFields,
                    market_price_from: formatted,
                  });
                }}
              />
              <SelectInput
                isInput
                required
                label="To"
                placeholder="To"
                value={formFields.market_price_to}
                setValue={(val) => {
                  const numeric = val.replace(/\D/g, ""); // only digits
                  const formatted = numeric.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  );
                  setFormFields({ ...formFields, market_price_to: formatted });
                }}
              />
            </div>
          </div>
          <div className="w-full flex items-center gap-3 justify-between">
            <SelectInput
              required
              label="Categories"
              options={categories}
              value={formatText(formFields.category_name)}
              placeholder="Please select"
              onChange={(e) =>
                setFormFields({ ...formFields, category_name: e })
              }
            />
            <SelectInput
              required
              label="Negotiable"
              value={formatText(formFields.is_negotiable)}
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
              placeholder="Please select"
              setValue={(e) =>
                setFormFields({ ...formFields, is_negotiable: e })
              }
            />
          </div>
          <RichTextEditor
            content={formFields.description}
            onChange={(e) => setFormFields({ ...formFields, description: e })}
          />
          <div className="w-full flex items-center gap-3 justify-between">
            <SelectInput
              required
              label="State"
              value={formatText(formFields.state)}
              options={statesInNigeria}
              placeholder="Please select"
              setValue={(e) => setFormFields({ ...formFields, state: e })}
            />
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
          </div>
          <div className="w-full flex flex-col gap-y-2">
            <div className="w-full flex items-center justify-between">
              <span className="text-primary-300 font-medium text-sm">
                Outstanding issues (optional)
              </span>
              <span className="text-sm font-medium text-[#808080]">
                0 / 850
              </span>
            </div>
            <div className="w-full bg-[#FFF1F0] p-3 rounded-xl flex items-start justify-start gap-x-2">
              <img src={INFO_RED} className="w-[20px] h-[20px]" alt="" />
              <span className="text-sm font-normal text-primary-300">
                If the product has any minor defects or faults that the buyer
                has to be away of, least all of them here in the spirit of fair
                disclosure
              </span>
            </div>
            <textarea
              name=""
              rows={3}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormFields({
                  ...formFields,
                  outstanding_issues: e.target.value,
                })
              }
              value={formFields.outstanding_issues}
              placeholder="Enter outstanding Issues"
              className="w-full p-3 resize-none outline-none rounded-xl border border-borderColor text-sm placeholder:text-[#808080]"
              id=""
            />
          </div>
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
            {images.length < 1 && (
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
                images.length > 0 ? "flex" : "hidden"
              }`}
            >
              {/* Image previews */}
              {images.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={idx}
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
              {images.length > 0 && images.length != maxImages && (
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
          <div className="w-full flex items-end justify-end">
            <Button
              title="Save & continue"
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
          <div className="w-full flex items-center gap-x-5 pt-3 pb-2.5 border-b border-[#E9EAEB]">
            {tabs.map((t) => (
              <div className="w-fit relative ">
                <span
                  onClick={() => setActiveTab(t.label.toLowerCase() as Tabs)}
                  className={`text-sm cursor-pointer relative px-3  ${
                    activeTab === t.label.toLowerCase()
                      ? "text-global-green font-semibold"
                      : "text-faded-black-light font-medium"
                  }`}
                >
                  {t.label.toUpperCase()} {t.count && t.count}
                </span>
                {activeTab === t.label.toLowerCase() && (
                  <div className="border-b-[3px] border-global-green absolute w-full top-8" />
                )}
              </div>
            ))}
          </div>
          {userProducts?.data?.length > 0 ? (
            <div className="max-h-[500px] w-full overflow-auto px-4 py-7">
              <div className="flex items-start flex-col gap-y-3 w-full">
                {userProducts?.data?.map((item: ProductType) => (
                  <div className="w-full flex items-start justify-between p-3 rounded-lg">
                    <div className="flex items-start gap-x-2">
                      <img
                        src={item?.image_urls[0] as string}
                        className="w-[208px] h-[208px] rounded-lg object-cover"
                        alt=""
                      />
                      <div className="w-full flex flex-col gap-y-2">
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
                        <div className="w-fit h-fit border border-[#E9EAEB] flex items-center gap-x-2 rounded-lg p-1.5 text-xs font-medium text-primary-300">
                          <img
                            src={CLOCK_GREEN}
                            className="w-[12px] h-[12px]"
                            alt=""
                          />
                          <span>Live in 18.5 hrs max</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <button className="w-fit py-1 px-4 rounded-lg bg-global-green text-white font-medium text-xs">
                        Edit
                      </button>
                      <button className="w-fit py-1 px-4 rounded-lg bg-[#FF3B30] text-white font-medium text-xs">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex space-x-1">
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
                You have not placed any product posted yet!
              </span>
              <span className="text-[#555555] font-normal text-sm">
                All products you have posted would appear her
              </span>
              <Button
                title="Post a new product"
                textStyle="text-white font-medium text-sm"
                handleClick={() => dispatch(setProductFields(true))}
                btnStyles="w-fit px-5 py-3 rounded-xl bg-global-green"
              />
            </div>
          )}
        </>
      )}
      <FullScreenLoader
        isLoading={isCreatingProduct}
        progress={uploadProgress}
      />
    </div>
  );
}

export default Products;
