import { useRef, useState } from "react";
import MainLayout from "../layout/MainLayout";
import {
  HEART,
  OUTLINE_EYE,
  OUTLINE_LOCATION,
  PROFILE,
  RED_BTN,
  REVIEW_AVATAR,
  SHARE,
  SINGLE_USER,
  UPLOAD,
  VERIFIED,
} from "../assets";
import Button from "../components/Button";
import ProductRow from "../ui/product-row";
import { useQuery } from "@tanstack/react-query";
import {
  getAllProducts,
  getSellerStoreDetails,
  getSingleProduct,
} from "../services/product.service";
import { Link, useLocation } from "react-router-dom";
import {
  ProductResponse,
  ReviewResponseType,
  SingleProductResponse,
} from "../types";
import {
  formatPrice,
  formatTimeElapsed,
  getMembershipDuration,
} from "../utils";
import toast from "react-hot-toast";
import { Copy, X } from "lucide-react";
import clsx from "clsx";
import Modal from "../components/Modal";
import SelectInput from "../components/SelectInput";
import { createReview, getPublicReviews } from "../services/reviews.service";

function ProductDetails() {
  const [activeTab, setActiveTab] = useState<
    "product-details" | "outstanding-issues"
  >("product-details");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<
    "very-satisfied" | "satisfied" | "unsatisfied" | string
  >("");
  const location = useLocation();
  const { pathname } = location;
  const product_id = pathname.split("/").pop();
  const [currentImage, setCurrentImage] = useState(0);
  const { data: productDetails, isLoading: isLoadingProductDetails } =
    useQuery<SingleProductResponse>({
      queryKey: ["product-details", product_id],
      queryFn: () => getSingleProduct(product_id as string),
    });
  const {
    data: storeDetails,
    // isLoading: loadingStoreSettings,
    // refetch,
  } = useQuery({
    queryKey: ["store-details", productDetails?.product.user_id],
    queryFn: () =>
      getSellerStoreDetails(productDetails?.product.user_id as string),
  });

  const {
    data: similarProduct,
    isLoading,
    // refetch,
  } = useQuery({
    queryKey: ["similar-product", productDetails?.product?.category_name],
    queryFn: () =>
      getAllProducts({
        category_name: productDetails?.product?.category_name || "",
      }),
  });

  const {
    data: publicReviews,
    isLoading: reviewLoading,
    refetch: refetchReview,
  } = useQuery(
    {
      queryKey: ["public-review", productDetails?.product?.id],
      queryFn: () => getPublicReviews(productDetails?.product?.id as string),
      enabled: !!productDetails?.product?.id,
    }
    // {
    //   enabled: !!productDetails?.product?.id,
    // }
  );

  const [images, setImages] = useState<File[]>([]);
  const [showFeedbacksModal, setShowFeedbacksModal] = useState(false);
  const [leaveFeedbackModal, setLeaveFeedbackModal] = useState(false);
  const category = productDetails?.product.category_name?.replace(/-/g, " ");
  const maxImages = 5;
  const [showSellerNumber, setShowSellerNumber] = useState(false);
  const [reviewFields, setReviewFields] = useState({
    review_title: "",
    customer_name: "",
    review: "",
  });
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter(
      (file) => file.type === "image/jpeg" || file.type === "image/jpg"
    );

    if (validFiles.length < selectedFiles.length) {
      toast.error("Only JPG/JPEG images are allowed");
      if (validFiles.length === 0) return;
    }

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      toast.error(`Maximum of ${maxImages} images is allowed`);
      return;
    }

    if (validFiles.length > availableSlots) {
      toast.error(
        `Maximum of ${maxImages} images is allowed. Only ${availableSlots} more image(s) can be added.`
      );
    }

    const filesToAdd = validFiles.slice(0, availableSlots);
    setImages((prev) => [...prev, ...filesToAdd]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleCreateReview = async () => {
    if (!productDetails?.product?.id) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("product_id", productDetails?.product?.id);
    formData.append("experience", selectedExperience);
    formData.append("review_title", reviewFields.review_title);
    formData.append("review", reviewFields.review);
    formData.append("customer_name", reviewFields.customer_name);
    formData.append("is_public", String(true));
    if (images.length > 0) {
      images.forEach((img) => formData.append("images", img));
    }

    try {
      const response = await createReview(formData);
      if (response) {
        toast.success("Thank You for your Feedback!");
        setLeaveFeedbackModal(false);
        setReviewFields({
          review_title: "",
          review: "",
          customer_name: "",
        });
        refetchReview();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {isLoadingProductDetails ? (
        <LoadingState />
      ) : (
        <>
          <div className="px-4 md:px-20 py-7 bg-[#F7F7F7]">
            <div className="w-full flex items-center justify-start gap-x-3">
              <Link
                to={"/"}
                className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box"
              >
                Home
              </Link>
              <span className="text-xs font-semibold text-primary-300">/</span>
              <Link
                to={`/products?category=${productDetails?.product.category_name}`}
                className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box"
              >
                {category?.charAt(0).toUpperCase() + category?.slice(1)!}
              </Link>
              <span className="text-xs font-semibold text-primary-300">/</span>

              <div className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box">
                {productDetails?.product.product_name}
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row items-start justify-between mt-4 gap-7">
              <div className="w-full md:w-[70%] flex flex-col gap-y-4">
                <div className="w-full p-5 bg-white shadow-box rounded-xl flex flex-col gap-y-3">
                  <div className="w-full ">
                    <img
                      src={productDetails?.product.image_urls[currentImage]}
                      className="w-full h-[300px] rounded-xl object-cover"
                      alt=""
                    />
                  </div>
                  <div className="max-w-full overflow-x-scroll flex items-center gap-x-2">
                    {productDetails?.product?.image_urls?.map(
                      (img: string, i: number) => (
                        <img
                          src={img}
                          onClick={() => setCurrentImage(i)}
                          className="w-full h-[79px] rounded-xl object-cover cursor-pointer"
                          alt=""
                        />
                      )
                    )}
                  </div>
                  <div className="flex flex-col gap-y-2 items-startp">
                    <div className="w-full flex items-center justify-between ">
                      <span className="text-xl font-semibold text-primary-300">
                        {productDetails?.product.product_name}
                      </span>
                      <div className="flex items-center justify-end gap-x-3">
                        <div className="w-[32px] h-[32px] rounded-full border-[0.67px] border-[#DADADA] flex items-center justify-center">
                          <img
                            src={HEART}
                            className="w-[16px] h-[16px]"
                            alt=""
                          />
                        </div>
                        <div className="w-[32px] h-[32px] rounded-full border-[0.67px] border-[#DADADA] flex items-center justify-center">
                          <img
                            src={SHARE}
                            className="w-[16px] h-[16px]"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-normal text-faded-black-light">
                      Brand:{" "}
                      <span className="text-global-green">
                        {productDetails?.product.brand_name}
                      </span>
                    </span>
                    <div className="flex items-center justify-start gap-x-2">
                      <img
                        src={OUTLINE_LOCATION}
                        className="w-[20px] h-[20px]"
                        alt=""
                      />
                      <span className="text-[#75757A] font-normal text-sm">
                        {productDetails?.product.address_in_state},{" "}
                        {formatTimeElapsed(
                          productDetails?.product?.created_at as string
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-start gap-x-2">
                      <img
                        src={OUTLINE_EYE}
                        className="w-[20px] h-[20px]"
                        alt=""
                      />
                      <span className="text-[#75757A] font-normal text-sm">
                        514
                      </span>
                    </div>
                    <div className="w-fit h-fit bg-[#07B4631A]  rounded-lg p-1.5 text-xs font-medium text-global-green">
                      {productDetails?.product.condition
                        ?.replace(/-/g, " ")
                        .toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-white shadow-box rounded-xl  ">
                  <div className="w-full flex items-center gap-x-4 p-5 border border-[#E9EAEB]">
                    <div className="w-fit relative">
                      <span
                        onClick={() => setActiveTab("product-details")}
                        className={`text-[16px] cursor-pointer relative ${
                          activeTab === "product-details"
                            ? "text-global-green font-semibold"
                            : "text-faded-black-light font-medium"
                        }`}
                      >
                        Product Details
                      </span>
                      {activeTab === "product-details" && (
                        <div className="border-b-[3px] border-global-green absolute w-[150px] -left-5 top-[43px]" />
                      )}
                    </div>
                    <div className="w-fit relative">
                      <span
                        onClick={() => setActiveTab("outstanding-issues")}
                        className={`text-[16px] cursor-pointer ${
                          activeTab === "outstanding-issues"
                            ? "text-global-green font-semibold"
                            : "text-faded-black-light font-medium"
                        }`}
                      >
                        Outstanding Issues
                      </span>
                      {activeTab === "outstanding-issues" && (
                        <div className="border-b-[3px] border-global-green absolute w-[150px] -left-1 top-[43px]" />
                      )}
                    </div>
                  </div>
                  <div className="w-full p-5 ">
                    {activeTab === "product-details" && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: productDetails?.product.description as string,
                        }}
                      ></div>
                    )}
                    {activeTab === "outstanding-issues" && (
                      <span>
                        {productDetails?.product.outstanding_issues ||
                          "No outstanding issues"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[30%] flex flex-col gap-y-4">
                <div className="flex flex-wrap items-start p-5 rounded-xl justify-between w-full bg-white shadow-box">
                  <div className="flex flex-col items-start gap-y-1">
                    <span className="text-2xl text-nowrap font-semibold text-primary-300">
                      ₦{" "}
                      {productDetails?.product.product_price
                        ?.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>

                    <div className="w-fit h-fit border border-[#E9EAEB] rounded-lg p-1.5 text-xs font-medium text-primary-300">
                      Market Price:{" "}
                      {formatPrice(
                        productDetails?.product.market_price_from as number
                      )}{" "}
                      -{" "}
                      {formatPrice(
                        productDetails?.product.market_price_to as number
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-fit h-fit rounded-lg p-1.5 text-xs font-medium ${
                      productDetails?.product.is_negotiable
                        ? "bg-[#07B4631A] text-global-green"
                        : "bg-[#FF3B301A] text-[#FF3B30]"
                    }`}
                  >
                    {productDetails?.product.is_negotiable
                      ? "Negotiable"
                      : "Not Negotiable"}
                  </div>
                </div>
                <div className="w-full bg-white shadow-box rounded-xl">
                  <div className="px-5 py-3 border-b border-[#E9EAEB] w-full flex items-center justify-between">
                    <span className="text-primary-300 font-semibold text-sm">
                      Seller Information
                    </span>
                    <div
                      onClick={() => setShowFeedbacksModal(true)}
                      className="w-fit cursor-pointer h-fit bg-[#FF3B301A]  rounded-lg p-1.5 text-xs font-medium text-[#FF3B30]"
                    >
                      {publicReviews?.data?.length || 0} Feedbacks
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-x-2">
                      <div className="relative">
                        <img
                          src={PROFILE}
                          className="w-[60px] h-[60px]"
                          alt=""
                        />
                        <div className="border-4 w-[15px] h-[15px] right-0 top-10 bg-global-green absolute rounded-full border-white"></div>
                      </div>
                      <div className="flex flex-col items-start gap-y-1">
                        <span className="text-[16px] font-semibold text-primary-300">
                          {storeDetails?.data?.business_name ||
                            productDetails?.product.user?.user_name}
                        </span>
                        <div className="flex items-center gap-x-2">
                          <img
                            src={VERIFIED}
                            className="w-[16px] h-[16px]"
                            alt=""
                          />

                          <span className="text-[#75757A] text-xs font-medium">
                            {productDetails?.product.user?.is_verified
                              ? "Verified"
                              : "Not Verified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <img
                            src={SINGLE_USER}
                            className="w-[16px] h-[16px]"
                            alt=""
                          />
                          <span className="text-[#75757A] text-xs font-medium">
                            {getMembershipDuration(
                              productDetails?.product.user?.created_at as string
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col w-full gap-y-2">
                      <Button
                        title={
                          showSellerNumber ? (
                            <div className="flex items-center justify-center gap-2">
                              <span>
                                {productDetails?.product.user?.phone_number}
                              </span>

                              <Copy
                                className={clsx("w-4 h-4 cursor-pointer")}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(
                                    productDetails?.product.user
                                      ?.phone_number || ""
                                  );
                                  toast.success("Copied to clipboard");
                                }}
                              />
                            </div>
                          ) : (
                            "Show Seller Contact"
                          )
                        }
                        btnStyles="w-full bg-global-green rounded-xl h-[40px]"
                        textStyle="text-white font-medium text-sm"
                        handleClick={() => setShowSellerNumber(true)}
                      />

                      <Button
                        title="Let Us Handle It"
                        btnStyles="w-full border border-[#E9EAEB] rounded-xl h-[40px]"
                        textStyle="text-primary-300 font-medium text-sm"
                        handleClick={() =>
                          toast.success("Coming soon on Nedzl")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductRow
            title="Similar Adverts"
            data={similarProduct?.data?.filter(
              (item: ProductResponse) => item.id !== productDetails?.product?.id
            )}
            loading={isLoading}
          />
          <Modal
            show={showFeedbacksModal}
            onClose={() => setShowFeedbacksModal(false)}
          >
            <div className="bg-white rounded-xl w-full max-w-[550px] geist-family max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold text-primary-300">
                  Feedbacks -{" "}
                  <span className="text-emerald-500">
                    {productDetails?.product?.user?.user_name ||
                      storeDetails?.store_name}
                  </span>
                </h2>
                <button
                  onClick={() => setShowFeedbacksModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              {reviewLoading ? (
                <LoadingState />
              ) : (
                <div className="max-h-[400px] overflow-auto w-full px-6 py-4 flex flex-col gap-y-3">
                  {publicReviews?.data?.map((review: ReviewResponseType) => (
                    <div className="w-full flex flex-col gap-y-3 border border-borderColor rounded-xl p-3">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                          <img
                            src={REVIEW_AVATAR}
                            className="w-[32px] h-[32px]"
                            alt=""
                          />
                          <span className="text-global-green font-semibold text-[16px]">
                            {review.customer_name}
                          </span>
                        </div>
                        <span className="text-[#656F7D] font-medium text-xs">
                          {formatTimeElapsed(review?.created_at)}
                        </span>
                      </div>
                      <span className="text-[#2A2E34] font-semibold text-[16px]">
                        {review?.review_title}
                      </span>
                      <span className="text-sm font-medium text-primary-300">
                        {review?.review}
                      </span>
                      {review?.images && review?.images?.length > 0 && (
                        <div className="flex items-center gap-x-2 max-w-full overflow-scroll">
                          {review?.images?.map((image: string) => (
                            <img
                              src={image}
                              className="min-w-[100px] h-[100px] rounded-lg object-cover"
                              alt=""
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-white shadow-box">
                <button
                  onClick={() => {
                    setLeaveFeedbackModal(true);
                    setShowFeedbacksModal(false);
                  }}
                  className="px-5 py-2 text-white bg-global-green rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                >
                  Leave Feedback
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            show={leaveFeedbackModal}
            onClose={() => setLeaveFeedbackModal(false)}
          >
            <div className="bg-white rounded-xl w-full max-w-[550px] geist-family max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center border-b border-borderColor justify-between px-6 py-4 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold text-primary-300">
                  Leave Feedback -{" "}
                  <span className="text-emerald-500">
                    {productDetails?.product?.user?.user_name ||
                      storeDetails?.store_name}
                  </span>
                </h2>
                <button
                  onClick={() => setLeaveFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="max-h-[400px] overflow-auto w-full px-6 py-4 flex flex-col gap-y-3 mt-1">
                <div className="w-full flex flex-col gap-y-2.5">
                  <span className="text-[16px] font-semibold text-black">
                    How was your experience
                  </span>
                  <div className="flex w-full items-center justify-between gap-x-3">
                    <div
                      onClick={() => setSelectedExperience("very-satisfied")}
                      className={clsx(
                        "text-sm w-full cursor-pointer relative text-center border py-2.5 rounded-xl font-semibold text-[#28A745] bg-[#28A7451A] border-[#28A745]"
                      )}
                    >
                      Very Satisfied
                      {selectedExperience === "very-satisfied" && (
                        <span className="absolute top-0 right-2">😊</span>
                      )}
                    </div>
                    <div
                      onClick={() => setSelectedExperience("satisfied")}
                      className={clsx(
                        "text-sm  w-full cursor-pointer relative rounded-xl text-center py-2.5 border font-semibold text-[#FFC107] bg-[#FFC1071A] border-[#FFC107]"
                      )}
                    >
                      Satisfied
                      {selectedExperience === "satisfied" && (
                        <span className="absolute top-0 right-2">🙂</span>
                      )}
                    </div>
                    <div
                      onClick={() => setSelectedExperience("unsatisfied")}
                      className={clsx(
                        "text-sm w-full cursor-pointer relative font-semibold rounded-xl text-center py-2.5 border text-[#DC3545] bg-[#DC35451A] border-[#DC3545]"
                      )}
                    >
                      Unsatisfied
                      {selectedExperience === "unsatisfied" && (
                        <span className="absolute top-0 right-2">😔</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full gap-x-3 flex items-center justify-between">
                  <SelectInput
                    isInput
                    // required
                    label="Review Title"
                    placeholder="Enter your review title"
                    value={reviewFields.review_title}
                    setValue={(e) =>
                      setReviewFields({ ...reviewFields, review_title: e })
                    }
                  />
                  <SelectInput
                    isInput
                    // required
                    label="Your Name"
                    placeholder="Enter your name"
                    value={reviewFields.customer_name}
                    setValue={(e) =>
                      setReviewFields({ ...reviewFields, customer_name: e })
                    }
                  />
                </div>
                <div className="flex flex-col w-full ">
                  <label className="block text-sm font-normal text-primary-300 mb-1">
                    Detailed Review
                  </label>
                  <textarea
                    name=""
                    id=""
                    value={reviewFields.review}
                    rows={5}
                    onChange={(e) =>
                      setReviewFields({
                        ...reviewFields,
                        review: e.target.value,
                      })
                    }
                    className="w-full outline-none text-sm resize-none rounded-xl border border-borderColor p-3"
                    placeholder="Enter the details of your review"
                  />
                </div>
                <div className="w-full flex flex-col relative gap-y-3 rounded-xl ">
                  <span className="text-primary-300 font-normal text-sm">
                    Attach a photo (upto 5 images)
                  </span>

                  {images.length < 5 && (
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full  h-[117px] rounded-xl border border-dotted border-[#E97A3B] bg-[#E97A3B08] flex items-center flex-col gap-y-2 justify-center "
                    >
                      <div className="flex items-center w-[40px] h-[40px] rounded-xl justify-center bg-white shadow-box-shadow">
                        <img
                          src={UPLOAD}
                          className="w-[20px] h-[20px]"
                          alt=""
                        />
                      </div>
                      <span className="text-[#4F5762] font-medium text-sm">
                        Click here to upload
                      </span>
                      <span className="text-xs font-normal text-[#808080]">
                        PNG, JPG up to 5MB
                      </span>
                    </div>
                  )}
                  <div className="w-full grid grid-cols-2 gap-2">
                    {images.length > 0 &&
                      images.map((img, i) => (
                        <div className="w-full flex items-center border border-borderColor rounded-xl p-2 justify-between">
                          <div className="flex items-center gap-x-2">
                            <img
                              src={URL.createObjectURL(img)}
                              className="min-w-[40px] h-[40px] rounded-xl"
                              alt=""
                            />
                            <div className="flex flex-col gap-y-1">
                              <span className="text-xs font-medium text-primary-300">
                                {img.name.length > 15
                                  ? img.name.slice(0, 15) + "..."
                                  : img.name}
                              </span>
                              <span className="text-xs font-normal text-primary-50">
                                {img.size}
                              </span>
                            </div>
                          </div>
                          <button onClick={() => handleRemoveImage(i)}>
                            <img
                              src={RED_BTN}
                              className="w-[20px] h-[20px]"
                              alt=""
                            />
                          </button>
                        </div>
                      ))}
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
              </div>
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-white shadow-box">
                {/* <button
                  onClick={handleCreateReview}
                  className="px-5 py-2 text-white bg-global-green rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                >
                  Leave Feedback
                </button> */}
                <Button
                  title="Leave Feedback"
                  handleClick={handleCreateReview}
                  loading={loading}
                  btnStyles="px-5 h-[40px] bg-global-green rounded-xl  hover:bg-emerald-600 transition-colors"
                  textStyle="text-white font-medium"
                />
              </div>
            </div>
          </Modal>
        </>
      )}
    </MainLayout>
  );
}

export default ProductDetails;

export const LoadingState = () => (
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
);
