import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Link, useSearchParams } from "react-router-dom";
import { ARROW_DOWN, DOUBLE_DIRECT, LINE } from "../assets";
import { categories, statesInNigeria } from "../constant";
import Button from "../components/Button";
import {
  getAllProducts,
  getProductCategoryCounts,
} from "../services/product.service";
import { useQuery } from "@tanstack/react-query";
import { ProductResponse } from "../types";
import ProductCard from "../components/ProductCard";
import { formatText } from "../utils";
import { SkeletonCard } from "../ui/product-row";
import { motion } from "framer-motion";

function Products() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [selectedCatgory, setSelectedCatgory] = useState(category);

  //   const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [payload, setPayload] = useState({});
  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  useEffect(() => {
    if (category && selectedCatgory !== "") {
      setSelectedCatgory(category);
    }
  }, []);

  const {
    data: categorizedProduct,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["product-category", selectedCatgory],
    queryFn: () =>
      getAllProducts({
        category_name: selectedCatgory,
        ...payload,
      }),
  });
  const {
    data: categorizedProductCount,
    // isLoading,
    // refetch,
  } = useQuery({
    queryKey: ["category-count"],
    queryFn: getProductCategoryCounts,
  });

  const categoriesWithCount = useMemo(() => {
    if (!categorizedProductCount)
      return categories.map((cat) => ({ ...cat, count: 0 }));

    return categories.map((cat) => {
      const match = categorizedProductCount?.results?.find(
        (item: { category: string; total: number }) =>
          item.category === cat.value
      );

      return { ...cat, count: match ? match.total : 0 };
    });
  }, [categories, categorizedProductCount]);

  const handleApplyFilters = () => {
    const filters = {
      state: selectedLocation,
      min_price: Number(priceRange.min.replace(/,/g, "")),
      max_price: Number(priceRange.max.replace(/,/g, "")),
    };
    setPayload(filters);
    refetch();
  };

  const resetFilters = () => {
    setPayload({});
    setPriceRange({ min: "", max: "" });
    setSelectedCatgory(category);
    setSelectedLocation("");

    refetch();
  };

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
          <img src={DOUBLE_DIRECT} className="w-[20px] h-[20px]" alt="" />
          <div
            // to={`/products?category=${category}`}
            className="w-fit h-fit flex items-center  gap-x-2 px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box"
          >
            <span className="text-[#808080]">356,990 Ads</span>
            <span>{formatText(selectedCatgory as string)}</span>
          </div>
        </div>
        <div className="w-full flex items-start justify-between gap-x-3 mt-5">
          <div className="w-[30%] flex flex-col gap-y-3">
            {/* <div className="w-full rounded-xl shadow-box">
              <div className="w-full p-2.5 bg-global-green text-white rounded-t-xl">
                <span className="text-start">Location</span>
              </div>
              <div className="w-full bg-white p-2.5 rounded-b-xl">
                <div className="border p-2.5 border-[#E9EAEB] rounded-xl flex items-center justify-between w-full">
                  <div className="flex flex-col gap-y-1">
                    <span className="text-sm font-semibold text-primary-300">
                      Select Location
                    </span>
                    <span className="w-fit h-fit p-1 text-xs text-primary-300 font-semibold rounded-3xl bg-[#F7F7F7]">
                      Anambra
                    </span>
                  </div>
                  <button>
                    <img
                      src={ARROW_DOWN}
                      className="w-[20px] h-[20px]"
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </div> */}
            <LocationDropdown
              selectedLocation={formatText(selectedLocation)}
              setSelectedLocation={setSelectedLocation}
            />
            <div className="w-full bg-white rounded-xl">
              {/* Header */}
              <div className="w-full p-2.5 border-b border-[#E9EAEB] text-primary-300">
                <span className="text-primary-300 font-semibold text-[16px]">
                  Categories
                </span>
              </div>

              {/* Scrollable content area */}
              <div className="p-2.5 flex flex-col gap-y-1 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#E5E5E5] scrollbar-track-transparent">
                {/* Active Category */}
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#F7F7F7] sticky top-0 z-10">
                  <span className="text-primary-500 font-semibold text-[16px]">
                    {formatText(selectedCatgory as string)}
                  </span>
                  <span className="w-fit h-fit px-2 py-1 text-xs font-semibold text-[#808080] rounded-3xl bg-white">
                    {categorizedProductCount?.count
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}{" "}
                    Ads
                  </span>
                </div>

                {/* Subcategories list */}
                {categoriesWithCount
                  .filter(
                    (item) =>
                      item.label !== formatText(selectedCatgory as string)
                  )
                  .map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        const value = item.value;
                        setSelectedCatgory(value);
                        window.history.replaceState(
                          {},
                          "",
                          `/products?category=${value}`
                        );
                      }}
                      className="group flex w-full items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F7F7F7]"
                    >
                      <div className="flex items-center gap-x-2 w-full">
                        <span className="text-sm font-medium text-primary-300 group-hover:text-primary-500 transition-colors">
                          {item.label}
                        </span>
                        <img src={LINE} className="h-[20px]" alt="" />
                        <span className="w-fit h-fit px-2 py-1 text-xs font-semibold text-[#808080] rounded-3xl bg-[#F7F7F7] group-hover:bg-[#E5E5E5] transition-colors">
                          {item.count
                            ?.toString()
                            ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}{" "}
                          Ads
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-col items-start gap-y-1 p-2.5 bg-white w-full rounded-xl shadow-box">
              <span className="text-primary-300 font-semibold text-[16px]">
                Price
              </span>
              <div className="w-full rounded-xl flex items-center gap-x-3 justify-between">
                <div className="p-2 border border-borderColor rounded-xl flex flex-col gap-y-1 w-full">
                  <span className="text-primary-300 font-medium text-sm">
                    Min
                  </span>
                  <input
                    type="text"
                    value={priceRange.min}
                    onChange={(val) => {
                      const numeric = val.target.value.replace(/\D/g, "");
                      const formatted = numeric.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      );
                      setPriceRange({ ...priceRange, min: formatted });
                    }}
                    className="outline-none bg-transparent text-sm w-full"
                    placeholder="0.00"
                  />
                </div>
                <div className="p-2 flex border border-borderColor rounded-xl flex-col gap-y-1 w-full">
                  <span className="text-primary-300 font-medium text-sm">
                    Max
                  </span>
                  <input
                    type="text"
                    value={priceRange.max}
                    onChange={(val) => {
                      const numeric = val.target.value.replace(/\D/g, "");
                      const formatted = numeric.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      );
                      setPriceRange({ ...priceRange, max: formatted });
                    }}
                    className="outline-none bg-transparent text-sm w-full"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <Button
              title={"Filter"}
              handleClick={handleApplyFilters}
              btnStyles={"w-full bg-global-green rounded-xl p-2.5"}
              textStyle={"text-white font-medium text-[16px]"}
            />
            <button
              onClick={resetFilters} // your handler function
              className="px-3 py-2 text-primary-300 border border-borderColor text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
          <div className="w-[70%] grid grid-cols-3 gap-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : categorizedProduct?.data &&
              categorizedProduct.data.length > 0 ? (
              categorizedProduct.data.map(
                (item: ProductResponse, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard item={item} />
                  </motion.div>
                )
              )
            ) : (
              <div className="col-span-3 text-center text-gray-500 font-medium py-10">
                No products found for the selected filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Products;

export function LocationDropdown({
  selectedLocation,
  setSelectedLocation,
}: {
  selectedLocation: string;
  setSelectedLocation: (str: string) => void;
}) {
  //   const [selectedState, setSelectedState] = useState("Anambra");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full rounded-xl shadow-box">
      {/* Header */}
      <div className="w-full p-2.5 bg-global-green text-white rounded-t-xl">
        <span className="text-start">Location</span>
      </div>

      {/* Dropdown container */}
      <div className="w-full bg-white p-2.5 rounded-b-xl relative">
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="border p-2.5 border-[#E9EAEB] rounded-xl flex items-center justify-between w-full cursor-pointer"
        >
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-semibold text-primary-300">
              Select Location
            </span>
            {selectedLocation ? (
              <span className="w-fit h-fit p-1 text-xs text-primary-300 font-semibold rounded-3xl bg-[#F7F7F7] capitalize">
                {selectedLocation}
              </span>
            ) : (
              <span className="w-fit h-fit text-xs text-primary-300 font-semibold  capitalize">
                Select a state
              </span>
            )}
          </div>
          <img
            src={ARROW_DOWN}
            className={`w-[20px] h-[20px] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            alt=""
          />
        </div>

        {/* Dropdown list */}
        {isOpen && (
          <div className="absolute z-50 mt-4 w-full bg-white border left-0 border-[#E9EAEB] rounded-xl shadow-md max-h-60 overflow-y-auto">
            {statesInNigeria.map((state) => (
              <div
                key={state.value}
                onClick={() => {
                  setSelectedLocation(state.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm text-primary-300 cursor-pointer hover:bg-[#F7F7F7] capitalize ${
                  selectedLocation === state.label
                    ? "bg-[#07B4631A] text-global-green font-semibold"
                    : ""
                }`}
              >
                {state.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
