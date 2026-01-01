import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import SEO from "../components/SEO";
import { Link, useSearchParams } from "react-router-dom";
import { DOUBLE_DIRECT, LINE, FILTER__, TIMES } from "../assets";
import {
  categories,
  statesInNigeria,
  universitiesInNigeria,
} from "../constant";
import Button from "../components/Button";
import {
  getAllProducts,
  getProductCategoryCounts,
} from "../services/product.service";
import { useQuery } from "@tanstack/react-query";
import { ProductResponse } from "../types";
import ProductCard from "../components/ProductCard";
import { formatText } from "../utils";
import { SkeletonCard } from "../components/product-row";
import { motion, AnimatePresence } from "framer-motion";
// import clsx from "clsx";
import { LocationDropdown } from "../components/LocationDropdown";
import Pagination from "../components/Pagination";

interface FilterContentProps {
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  selectedUniversity: string;
  setSelectedUniversity: (val: string) => void;
  selectedCatgory: string | null;
  setSelectedCatgory: (val: string | null) => void;
  categoriesWithCount: any[];
  priceRange: { min: string; max: string };
  setPriceRange: (range: { min: string; max: string }) => void;
  handleApplyFilters: () => void;
  resetFilters: () => void;
  section: string | null;
  setCurrentPage: (page: number) => void;
}

const FilterContent = ({
  selectedLocation,
  setSelectedLocation,
  selectedUniversity,
  setSelectedUniversity,
  selectedCatgory,
  setSelectedCatgory,
  categoriesWithCount,
  priceRange,
  setPriceRange,
  handleApplyFilters,
  resetFilters,
  section,
  setCurrentPage,
}: FilterContentProps) => (
  <div className="flex flex-col gap-y-3">
    <LocationDropdown
      selected={formatText(selectedLocation)}
      setSelected={setSelectedLocation}
      listing={statesInNigeria}
      placeholder="Select Location"
      type="Location"
    />
    <LocationDropdown
      selected={formatText(selectedUniversity)}
      setSelected={setSelectedUniversity}
      listing={universitiesInNigeria}
      placeholder="Select University"
      type="University"
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
        {selectedCatgory && (
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#F7F7F7] sticky top-0 z-10">
            <span className="text-primary-500 font-semibold text-[16px]">
              {formatText(selectedCatgory as string)}
            </span>
            <span className="w-fit h-fit px-2 py-1 text-xs font-semibold text-[#808080] rounded-3xl bg-white">
              {categoriesWithCount
                ?.find((item) => item.value === selectedCatgory)
                ?.count.toString()
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}{" "}
              Ads
            </span>
          </div>
        )}

        {/* Subcategories list */}
        {categoriesWithCount
          .filter((item) => item.value !== selectedCatgory)
          .map((item, index) => (
            <div
              key={index}
              onClick={() => {
                const value = item.value;
                setSelectedCatgory(value);
                setCurrentPage(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.replaceState(
                  {},
                  "",
                  section
                    ? `/products?section=${section}&category=${value}`
                    : `/products?category=${value}`
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
      <span className="text-primary-300 font-semibold text-[16px]">Price</span>
      <div className="w-full rounded-xl flex items-center gap-x-3 justify-between">
        <div className="p-2 border border-borderColor rounded-xl flex flex-col gap-y-1 w-full">
          <span className="text-primary-300 font-medium text-sm">Min</span>
          <input
            key="min_price_input"
            type="text"
            inputMode="decimal"
            value={priceRange.min}
            onChange={(val) => {
              const numeric = val.target.value.replace(/\D/g, "");
              const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              setPriceRange({ ...priceRange, min: formatted });
            }}
            className="outline-none bg-transparent text-base w-full"
            placeholder="0.00"
          />
        </div>
        <div className="p-2 flex border border-borderColor rounded-xl flex-col gap-y-1 w-full">
          <span className="text-primary-300 font-medium text-sm">Max</span>
          <input
            key="max_price_input"
            type="text"
            inputMode="decimal"
            value={priceRange.max}
            onChange={(val) => {
              const numeric = val.target.value.replace(/\D/g, "");
              const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              setPriceRange({ ...priceRange, max: formatted });
            }}
            className="outline-none bg-transparent text-base w-full"
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
);

function Products() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const keyword = searchParams.get("q");
  const section = searchParams.get("section");

  const [selectedCatgory, setSelectedCatgory] = useState(category);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);

  //   const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [payload, setPayload] = useState({});
  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (category && selectedCatgory !== "") {
      setSelectedCatgory(category);
    }
  }, [category, keyword]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const {
    data: categorizedProduct,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "product-category",
      selectedCatgory,
      keyword,
      section,
      payload,
      currentPage,
    ],
    queryFn: () =>
      getAllProducts({
        category_name: selectedCatgory || "",
        search: keyword || "",
        section: section?.split("-")?.join("_") || "",
        page: currentPage,
        limit: limit,
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

  console.log("categories with count", categoriesWithCount);

  const handleApplyFilters = () => {
    const filters = {
      state: selectedLocation,
      university: selectedUniversity,
      min_price: Number(priceRange.min.replace(/,/g, "")),
      max_price: Number(priceRange.max.replace(/,/g, "")),
    };
    setPayload(filters);
    setCurrentPage(1);
    refetch();
    setIsFilterOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setPayload({});
    setPriceRange({ min: "", max: "" });
    setSelectedCatgory(category);
    setSelectedLocation("");
    setSelectedUniversity("");
    setCurrentPage(1);

    refetch();
    setIsFilterOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // console.log("selected category", selectedCatgory);

  return (
    <MainLayout>
      <SEO
        title={
          keyword
            ? `Search results for "${keyword}"`
            : selectedCatgory
            ? formatText(selectedCatgory)
            : section
            ? formatText(section)
            : "Products"
        }
        description={`Browse ${
          selectedCatgory ? formatText(selectedCatgory) : "items"
        } on Nedzl.com. Find used items easily within your campus community in Nigeria.`}
      />
      <div className="px-4 md:px-20 py-7 bg-[#F7F7F7]">
        <div className="w-full flex items-center justify-between gap-x-3">
          <div className="flex items-center gap-x-3">
            <Link
              to={"/"}
              className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box"
            >
              Home
            </Link>
            <img src={DOUBLE_DIRECT} className="w-[20px] h-[20px]" alt="" />
            <div className="w-fit h-fit flex items-center gap-x-2 px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box">
              {selectedCatgory && (
                <span className="text-[#808080]">
                  {categoriesWithCount
                    ?.find((item) => item.value === selectedCatgory)
                    ?.count.toString()
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}{" "}
                  Ads
                </span>
              )}
              {!selectedCatgory
                ? formatText(section as string)
                : formatText(selectedCatgory as string)}
            </div>
          </div>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden flex items-center gap-x-2 px-4 py-2 bg-white rounded-full shadow-box border border-borderColor"
          >
            <img src={FILTER__} className="w-4 h-4" alt="filter" />
            <span className="text-sm font-semibold text-primary-300">
              Filter
            </span>
          </button>
        </div>

        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-x-3 gap-y-4 md:gap-y-0 mt-5">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:flex w-full md:w-[30%] flex-col gap-y-3">
            <FilterContent
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedUniversity={selectedUniversity}
              setSelectedUniversity={setSelectedUniversity}
              selectedCatgory={selectedCatgory}
              setSelectedCatgory={setSelectedCatgory}
              categoriesWithCount={categoriesWithCount}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              handleApplyFilters={handleApplyFilters}
              resetFilters={resetFilters}
              section={section}
              setCurrentPage={setCurrentPage}
            />
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-[70%] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : categorizedProduct?.data &&
              categorizedProduct.data?.length > 0 ? (
              categorizedProduct.data?.map(
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

        {/* Pagination */}
        {categorizedProduct?.totalpages > 1 && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={categorizedProduct?.totalpages}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </div>
        )}
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 z-[101] md:hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-primary-300">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 bg-[#F7F7F7] rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img src={TIMES} className="w-5 h-5" alt="close" />
                </button>
              </div>
              <FilterContent
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedUniversity={selectedUniversity}
                setSelectedUniversity={setSelectedUniversity}
                selectedCatgory={selectedCatgory}
                setSelectedCatgory={setSelectedCatgory}
                categoriesWithCount={categoriesWithCount}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                handleApplyFilters={handleApplyFilters}
                resetFilters={resetFilters}
                section={section}
                setCurrentPage={setCurrentPage}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

export default Products;
