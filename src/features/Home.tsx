import { useRef, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import ProductRow from "../components/product-row";
import { useQuery } from "@tanstack/react-query";
import {
  getAllProducts,
  getFeaturedProducts,
} from "../services/product.service";

import SEO from "../components/SEO";
import CategoryBar from "../components/CategoryBar";

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

  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const box3Ref = useRef<HTMLDivElement>(null);
  const box4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadingFeaturedProducts || !featureedProducts) return;

    const scrollInterval = setInterval(() => {
      [box1Ref, box2Ref].forEach((ref) => {
        if (ref.current) {
          const { scrollTop, scrollHeight, clientHeight } = ref.current;
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            ref.current.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            ref.current.scrollBy({ top: 220, behavior: "smooth" });
          }
        }
      });

      [box3Ref, box4Ref].forEach((ref) => {
        if (ref.current) {
          const { scrollLeft, scrollWidth, clientWidth } = ref.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            ref.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            ref.current.scrollBy({ left: 265, behavior: "smooth" });
          }
        }
      });
    }, 5000);

    return () => clearInterval(scrollInterval);
  }, [loadingFeaturedProducts, featureedProducts]);

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
      <SEO
        title="Home"
        description="Welcome to Nedzl.com – the trusted student-focused e-commerce platform built to connect university students across Nigeria. Buy and sell used items on campus easily."
        keywords="student marketplace, Nigeria university marketplace, buy used phones campus, sell hostel furniture"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: [
            {
              "@type": "SiteNavigationElement",
              position: 1,
              name: "Electricals",
              url: "https://www.nedzl.com/products?category=electricals",
            },
            {
              "@type": "SiteNavigationElement",
              position: 2,
              name: "Home Appliances",
              url: "https://www.nedzl.com/products?category=home-appliances",
            },
            {
              "@type": "SiteNavigationElement",
              position: 3,
              name: "Furniture",
              url: "https://www.nedzl.com/products?category=furniture",
            },
            {
              "@type": "SiteNavigationElement",
              position: 4,
              name: "Kitchenware",
              url: "https://www.nedzl.com/products?category=kitchenware",
            },
            {
              "@type": "SiteNavigationElement",
              position: 5,
              name: "Books",
              url: "https://www.nedzl.com/products?category=books",
            },
          ],
        }}
      />
      <div className="font-open-sans">
        <CategoryBar />
        {isFeaturedProductNotComplete && (
          <div className="w-full px-4 md:px-20 mb-10 flex flex-col md:flex-row items-start justify-between gap-3 mt-5">
            {/* LEFT TWO BOXES */}
            <div className="flex w-full flex-col md:flex-row items-start h-auto md:h-[650px] gap-x-3 gap-y-3 md:gap-y-0  md:w-[50%]">
              {/* BOX 1 */}
              <div
                ref={box1Ref}
                className="w-full h-full overflow-y-scroll bg-[#F5F5F5] p-5 rounded-xl no-scrollbar"
              >
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
                        ),
                      )}
                </div>
              </div>

              {/* BOX 2 */}
              <div
                ref={box2Ref}
                className="w-full h-full overflow-y-scroll bg-[#F5F5F5] p-5 rounded-xl no-scrollbar"
              >
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
                        ),
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

                <div
                  ref={box3Ref}
                  className="flex gap-5 overflow-x-scroll w-full mt-4 no-scrollbar"
                >
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
                        ),
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

                <div
                  ref={box4Ref}
                  className="flex gap-5 overflow-x-scroll w-full mt-4 no-scrollbar"
                >
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
                        ),
                      )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {todayProducts?.data?.length > 0 && (
        <ProductRow
          title="Today's deal"
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
        layout={isFeaturedProductNotComplete ? "scroll" : "grid"}
      />
    </MainLayout>
  );
}

export default Home;
