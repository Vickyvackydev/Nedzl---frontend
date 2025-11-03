// import React from "react";
import MainLayout from "../layout/MainLayout";
import { BAR_WHITE, LEXUS } from "../assets";
import { Link } from "react-router-dom";
import ProductRow from "../ui/product-row";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/product.service";

const links = [
  {
    label: "Computers and accessories",
    value: "Computers-and-accessories",
  },
  {
    label: "Phones & Tablets",
    value: "phones-tablets",
  },
  {
    label: "Electronics",
    value: "electronics",
  },
  {
    label: "Fashion",
    value: "fashion",
  },
  {
    label: "Home & Kitchen",
    value: "home-kitchen",
  },
  {
    label: "Hair Extension & wigs",
    value: "hair-extension-wigs",
  },
];
function Home() {
  const {
    data: products,
    isLoading,
    // refetch,
  } = useQuery({ queryKey: ["all-products"], queryFn: getAllProducts });

  return (
    <MainLayout>
      <div className="">
        <div className="bg-global-green px-20 py-4 w-full flex items-center justify-between">
          <div className="w-fit px-7 border border-white rounded-xl p-2 flex items-center gap-x-2">
            <img src={BAR_WHITE} className="w-[24px] h-[24px]" alt="" />
            <span className="text-sm font-medium text-white">
              All categories
            </span>
          </div>
          {links.map((li) => (
            <Link to={"*"} className="w-fit p-3 text-white text-sm font-medium">
              {li.label}
            </Link>
          ))}
        </div>
        <div className="w-full px-20 mb-10 flex items-start justify-between gap-3 mt-5">
          <div className="flex items-start h-[650px] gap-x-3">
            <div className="h-full overflow-y-scroll bg-[#F5F5F5] p-5 rounded-xl">
              <div className="flex flex-col items-start gap-y-1">
                <span className="text-[#044706] font-semibold text-xl">
                  Hot Deals
                </span>
                <span className="text-[#555555] text-sm font-normal">
                  Best bargains on used items
                </span>
              </div>
              <div className="flex flex-col gap-y-5 mt-4">
                {[1, 2, 3, 4, 5].map((_) => (
                  <div className="w-full flex flex-col item-start gap-y-2">
                    <img
                      src={LEXUS}
                      className="w-[245px] h-[177px] rounded-xl"
                      alt=""
                    />
                    <span className="text-[#313133] font-medium text-[16px]">
                      ₦40,000
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-full overflow-y-scroll bg-[#F5F5F5] p-5 rounded-xl">
              <div className="flex flex-col items-start gap-y-1">
                <span className="text-[#044706] font-semibold text-xl">
                  Hot Deals
                </span>
                <span className="text-[#555555] text-sm font-normal">
                  Best bargains on used items
                </span>
              </div>
              <div className="flex flex-col gap-y-5 mt-4">
                {[1, 2, 3, 4, 5].map((_) => (
                  <div className="w-full flex flex-col item-start gap-y-2">
                    <img
                      src={LEXUS}
                      className="w-[245px] h-[177px] rounded-xl"
                      alt=""
                    />
                    <span className="text-[#313133] font-medium text-[16px]">
                      ₦40,000
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 w-[50%]">
            <div className="w-full p-5   bg-[#F5F5F5] rounded-xl flex flex-col items-start gap-3">
              <div className="flex flex-col items-start gap-y-1">
                <span className="text-[#044706] font-semibold text-xl">
                  Hot Deals
                </span>
                <span className="text-[#555555] text-sm font-normal">
                  Best bargains on used items
                </span>
              </div>
              <div className="flex gap-5 overflow-x-scroll w-full mt-4">
                {[1, 2, 3, 4, 5].map((_) => (
                  <div className="w-full flex flex-col item-start gap-y-2">
                    <img
                      src={LEXUS}
                      className="min-w-[245px] h-[177px] rounded-xl"
                      alt=""
                    />
                    <span className="text-[#313133] font-medium text-[16px]">
                      ₦40,000
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className=" w-full p-5   bg-[#F5F5F5] rounded-xl flex flex-col items-start gap-3">
              <div className="flex flex-col items-start gap-y-1">
                <span className="text-[#044706] font-semibold text-xl">
                  Hot Deals
                </span>
                <span className="text-[#555555] text-sm font-normal">
                  Best bargains on used items
                </span>
              </div>
              <div className="flex gap-5 overflow-x-scroll w-full mt-4">
                {[1, 2, 3, 4, 5].map((_) => (
                  <div className="w-full flex flex-col item-start gap-y-2">
                    <img
                      src={LEXUS}
                      className="min-w-[245px] h-[177px] rounded-xl"
                      alt=""
                    />
                    <span className="text-[#313133] font-medium text-[16px]">
                      ₦40,000
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductRow
        title="Today deal"
        data={products?.data}
        loading={isLoading}
      />
      <ProductRow title="For you" data={products?.data} loading={isLoading} />
    </MainLayout>
  );
}

export default Home;
