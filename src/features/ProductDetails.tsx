import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import {
  HEART,
  // LEXUS,
  OUTLINE_EYE,
  OUTLINE_LOCATION,
  PROFILE,
  SHARE,
  SINGLE_USER,
  VERIFIED,
} from "../assets";
import Button from "../components/Button";
import ProductRow from "../ui/product-row";
import { useQuery } from "@tanstack/react-query";
import {
  getSellerStoreDetails,
  getSingleProduct,
} from "../services/product.service";
import { Link, useLocation } from "react-router-dom";
import { ProductResponse, SingleProductResponse } from "../types";
import { formatPrice } from "../utils";

function ProductDetails() {
  const [activeTab, setActiveTab] = useState<
    "product-details" | "outstanding-issues"
  >("product-details");
  const location = useLocation();
  const { pathname } = location;
  const product_id = pathname.split("/").pop();
  const [currentImage, setCurrentImage] = useState(0);
  const {
    data: productDetails,
    // isLoading,
    // refetch,
  } = useQuery<SingleProductResponse>({
    queryKey: ["product-details", product_id],
    queryFn: () => getSingleProduct(product_id as string),
  });
  const {
    data: storeDetails,
    // isLoading: loadingStoreSettings,
    // refetch,
  } = useQuery({
    queryKey: ["store-settings", productDetails?.product.user_id],
    queryFn: () =>
      getSellerStoreDetails(productDetails?.product.user_id as string),
  });

  const category = productDetails?.product.category_name?.replace(/_/g, " ");

  const [showSellerNumber, setShowSellerNumber] = useState(false);

  return (
    <MainLayout>
      <div className="px-20 py-7 bg-[#F7F7F7]">
        <div className="w-full flex items-center justify-start gap-x-3">
          <Link
            to={"/"}
            className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box"
          >
            Home
          </Link>
          <span className="text-xs font-semibold text-primary-300">/</span>
          <Link
            to={`/products?category=${category}`}
            className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box"
          >
            {category?.charAt(0).toUpperCase() + category?.slice(1)!}
          </Link>
          <span className="text-xs font-semibold text-primary-300">/</span>

          <div className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box">
            {productDetails?.product.product_name}
          </div>
        </div>
        <div className="w-full flex items-start justify-between mt-4 gap-7">
          <div className="w-[70%] flex flex-col gap-y-4">
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
                      <img src={HEART} className="w-[16px] h-[16px]" alt="" />
                    </div>
                    <div className="w-[32px] h-[32px] rounded-full border-[0.67px] border-[#DADADA] flex items-center justify-center">
                      <img src={SHARE} className="w-[16px] h-[16px]" alt="" />
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
                    {productDetails?.product.address_in_state}, 1 hour ago
                  </span>
                </div>
                <div className="flex items-center justify-start gap-x-2">
                  <img src={OUTLINE_EYE} className="w-[20px] h-[20px]" alt="" />
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
                  <span>{productDetails?.product.outstanding_issues}</span>
                )}
              </div>
            </div>
          </div>
          <div className="w-[30%] flex flex-col gap-y-4">
            <div className="flex items-start p-5 rounded-xl justify-between w-full bg-white shadow-box">
              <div className="flex flex-col items-start gap-y-1">
                <span className="text-2xl font-semibold text-primary-300">
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
                <div className="w-fit h-fit bg-[#FF3B301A]  rounded-lg p-1.5 text-xs font-medium text-[#FF3B30]">
                  20 Feedbacks
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-x-2">
                  <div className="relative">
                    <img src={PROFILE} className="w-[60px] h-[60px]" alt="" />
                    <div className="border-4 w-[15px] h-[15px] right-0 top-10 bg-global-green absolute rounded-full border-white"></div>
                  </div>
                  <div className="flex flex-col items-start gap-y-1">
                    <span className="text-[16px] font-semibold text-primary-300">
                      {storeDetails?.store_settings?.business_name ||
                        productDetails?.product.user?.user_name}
                    </span>
                    <div className="flex items-center gap-x-2">
                      <img
                        src={VERIFIED}
                        className="w-[16px] h-[16px]"
                        alt=""
                      />
                      <span className="text-[#75757A] text-xs font-medium">
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <img
                        src={SINGLE_USER}
                        className="w-[16px] h-[16px]"
                        alt=""
                      />
                      <span className="text-[#75757A] text-xs font-medium">
                        8 months on NEDZL
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-col w-full gap-y-2">
                  <Button
                    title={
                      showSellerNumber
                        ? (productDetails?.product.user?.phone_number as string)
                        : "Show Seller Contact"
                    }
                    btnStyles="w-full bg-global-green rounded-xl h-[40px]"
                    textStyle="text-white fon-medium text-sm"
                    handleClick={() => setShowSellerNumber(true)}
                  />
                  <Button
                    title="Let Us Handle It"
                    btnStyles="w-full border border-[#E9EAEB] rounded-xl h-[40px]"
                    textStyle="text-primary-300 font-medium text-sm"
                    handleClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductRow title="Similar Adverts" data={[]} />
    </MainLayout>
  );
}

export default ProductDetails;
