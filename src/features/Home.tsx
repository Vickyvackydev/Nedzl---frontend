// import React from "react";
import MainLayout from "../layout/MainLayout";
// import { LEXUS } from "../assets";
import { Link, useNavigate } from "react-router-dom";
import ProductRow from "../ui/product-row";
import { useQuery } from "@tanstack/react-query";
import {
  getAllProducts,
  getFeaturedProducts,
} from "../services/product.service";
import { categories } from "../constant";
import CategoriesOverlay from "../components/CategoriesOverlay";

const SkeletonCard = () => (
  <div className="w-full flex flex-col gap-y-2 animate-pulse">
    <div className="w-full md:w-[245px] h-[177px] bg-gray-300 rounded-xl" />
    <div className="w-24 h-4 bg-gray-300 rounded-md" />
  </div>
);

const SkeletonHorizontalCard = () => (
  <div className="min-w-[245px] h-[177px] bg-gray-300 rounded-xl animate-pulse" />
);

function Home() {
  const {
    data: todayProducts,
    isLoading,
    // refetch,
  } = useQuery({
    queryKey: ["all-today-products", "todays_deal"],
    queryFn: () => getAllProducts({ section: "todays_deal" }),
  });
  const { data: forYouProducts } = useQuery({
    queryKey: ["all-for-you-products", "for_you"],
    queryFn: () => getAllProducts({ section: "for_you" }),
  });
  const { data: featureedProducts, isLoading: loadingFeaturedProducts } =
    useQuery({ queryKey: ["featured-products"], queryFn: getFeaturedProducts });

  // const todaysDeal = products?.data?.filter((item: ProductType) => {
  //   const updatedDate = new Date(item.updated_at).toISOString().split("T")[0];
  //   return updatedDate === new Date().toISOString().split("T")[0];
  // });

  const isFeaturedProductNotComplete =
    featureedProducts?.[0]?.products.length > 0 &&
    featureedProducts?.[1]?.products.length > 0 &&
    featureedProducts?.[2]?.products.length > 0 &&
    featureedProducts?.[3]?.products.length > 0;

  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="font-open-sans">
        <div className="bg-global-green px-4 md:px-20 py-4 w-full flex flex-row items-center justify-between gap-y-4 md:gap-y-0">
          <CategoriesOverlay />
          <div className="flex items-center gap-2 overflow-x-auto w-full md:contents no-scrollbar">
            {categories.slice(0, 6).map((li) => (
              <Link
                key={li.value}
                to={`/products?category=${li.value}`}
                className="w-fit p-3 text-white text-sm font-medium whitespace-nowrap"
              >
                {li.label}
              </Link>
            ))}
          </div>
        </div>
        {isFeaturedProductNotComplete && (
          <div className="w-full px-4 md:px-20 mb-10 flex flex-col md:flex-row items-start justify-between gap-3 mt-5">
            {/* LEFT TWO BOXES */}
            <div className="flex flex-col md:flex-row items-start h-auto md:h-[650px] gap-x-3 gap-y-3 md:gap-y-0 w-full md:w-[50%]">
              {/* BOX 1 */}
              <div className="h-full overflow-y-scroll bg-[#F5F5F5] p-5 rounded-xl">
                <div className="flex flex-col items-start gap-y-1">
                  <span className="text-[#044706] font-semibold text-xl">
                    {featureedProducts?.[0]?.category_name}
                  </span>
                  <span className="text-[#555555] text-sm font-normal">
                    {featureedProducts?.[0]?.description}
                  </span>
                </div>

                <div className="flex flex-col gap-y-5 mt-4">
                  {loadingFeaturedProducts
                    ? [1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
                    : featureedProducts?.[0]?.products?.map(
                        (item: {
                          id: string;
                          image_urls: string[];
                          product_price: number;
                        }) => (
                          <div
                            key={item.id}
                            className="w-full flex flex-col gap-y-2 cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-md"
                            onClick={() =>
                              navigate(`/product-details/${item.id}`)
                            }
                          >
                            <img
                              src={item.image_urls?.[0]}
                              className="w-full md:w-[245px] h-[177px] rounded-xl object-cover"
                            />
                            <span className="text-[#313133] font-medium text-[16px]">
                              ₦{item.product_price?.toLocaleString()}
                            </span>
                          </div>
                        )
                      )}
                </div>
              </div>

              {/* BOX 2 */}
              <div className="h-full overflow-y-scroll bg-[#F5F5F5] p-5 rounded-xl">
                <div className="flex flex-col items-start gap-y-1">
                  <span className="text-[#044706] font-semibold text-xl">
                    {featureedProducts?.[1]?.category_name}
                  </span>
                  <span className="text-[#555555] text-sm font-normal">
                    {featureedProducts?.[1]?.description}
                  </span>
                </div>

                <div className="flex flex-col gap-y-5 mt-4">
                  {loadingFeaturedProducts
                    ? [1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
                    : featureedProducts?.[1]?.products?.map(
                        (item: {
                          id: string;
                          image_urls: string[];
                          product_price: number;
                        }) => (
                          <div
                            key={item.id}
                            onClick={() =>
                              navigate(`/product-details/${item.id}`)
                            }
                            className="w-full flex flex-col gap-y-2 cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-md"
                          >
                            <img
                              src={item.image_urls?.[0]}
                              className="w-full md:w-[245px] h-[177px] rounded-xl object-cover"
                            />
                            <span className="text-[#313133] font-medium text-[16px]">
                              ₦{item.product_price?.toLocaleString()}
                            </span>
                          </div>
                        )
                      )}
                </div>
              </div>
            </div>

            {/* RIGHT TWO BOXES */}
            <div className="flex flex-col items-start gap-3 w-full md:w-[50%]">
              {/* BOX 3 */}
              <div className="w-full p-5 bg-[#F5F5F5] rounded-xl flex flex-col items-start gap-3">
                <div className="flex flex-col items-start gap-y-1">
                  <span className="text-[#044706] font-semibold text-xl">
                    {featureedProducts?.[2]?.category_name}
                  </span>
                  <span className="text-[#555555] text-sm font-normal">
                    {featureedProducts?.[2]?.description}
                  </span>
                </div>

                <div className="flex gap-5 overflow-x-scroll w-full mt-4">
                  {loadingFeaturedProducts
                    ? [1, 2, 3, 4, 5].map((i) => (
                        <SkeletonHorizontalCard key={i} />
                      ))
                    : featureedProducts?.[2]?.products?.map(
                        (item: {
                          id: string;
                          image_urls: string[];
                          product_price: number;
                        }) => (
                          <div
                            key={item.id}
                            onClick={() =>
                              navigate(`/product-details/${item.id}`)
                            }
                            className="flex flex-col gap-y-2 cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-md"
                          >
                            <img
                              src={item.image_urls?.[0]}
                              className="min-w-[245px] h-[177px] rounded-xl object-cover"
                            />
                            <span className="text-[#313133] font-medium text-[16px]">
                              ₦{item.product_price?.toLocaleString()}
                            </span>
                          </div>
                        )
                      )}
                </div>
              </div>

              {/* BOX 4 */}
              <div className="w-full p-5 bg-[#F5F5F5] rounded-xl flex flex-col items-start gap-3">
                <div className="flex flex-col items-start gap-y-1">
                  <span className="text-[#044706] font-semibold text-xl">
                    {featureedProducts?.[3]?.category_name}
                  </span>
                  <span className="text-[#555555] text-sm font-normal">
                    {featureedProducts?.[3]?.description}
                  </span>
                </div>

                <div className="flex gap-5 overflow-x-scroll w-full mt-4">
                  {loadingFeaturedProducts
                    ? [1, 2, 3, 4, 5].map((i) => (
                        <SkeletonHorizontalCard key={i} />
                      ))
                    : featureedProducts?.[3]?.products?.map(
                        (item: {
                          id: string;
                          image_urls: string[];
                          product_price: number;
                        }) => (
                          <div
                            key={item.id}
                            onClick={() =>
                              navigate(`/product-details/${item.id}`)
                            }
                            className="flex flex-col gap-y-2 cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-md"
                          >
                            <img
                              src={item.image_urls?.[0]}
                              className="min-w-[245px] h-[177px] rounded-xl object-cover"
                            />
                            <span className="text-[#313133] font-medium text-[16px]">
                              ₦{item.product_price?.toLocaleString()}
                            </span>
                          </div>
                        )
                      )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {todayProducts?.data?.length > 0 && (
        <ProductRow
          title="Today deal"
          data={todayProducts?.data}
          loading={isLoading}
          onSeeAll={() => navigate(`/products?section=todays-deal`)}
        />
      )}
      <ProductRow
        title="For you"
        data={forYouProducts?.data}
        loading={isLoading}
        onSeeAll={() => navigate(`/products?section=for-you`)}
      />
    </MainLayout>
  );
}

export default Home;
