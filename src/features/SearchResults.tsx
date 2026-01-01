// import { useMemo } from "react";
import MainLayout from "../layout/MainLayout";
import { Link, useSearchParams } from "react-router-dom";
import { DOUBLE_DIRECT } from "../assets";
// import { categories } from "../constant";
// import Button from "../components/Button";
import {
  getAllProducts,
  // getProductCategoryCounts,
} from "../services/product.service";
import { useQuery } from "@tanstack/react-query";
import { ProductResponse } from "../types";
import ProductCard from "../components/ProductCard";
import { formatText } from "../utils";
import { SkeletonCard } from "../components/product-row";
import { motion } from "framer-motion";

function SearchResults() {
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("q");
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");

  const {
    data: categorizedProduct,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["product-search", keyword, category, brand],
    queryFn: () =>
      getAllProducts({
        search: keyword || "",
        category: category || "",
        brand: brand || "",
      }),
  });

  // const { data: categorizedProductCount } = useQuery({
  //   queryKey: ["category-count"],
  //   queryFn: getProductCategoryCounts,
  // });

  // const categoriesWithCount = useMemo(() => {
  //   if (!categorizedProductCount)
  //     return categories.map((cat) => ({ ...cat, count: 0 }));

  //   return categories.map((cat) => {
  //     const match = categorizedProductCount?.results?.find(
  //       (item: { category: string; total: number }) =>
  //         item.category === cat.value
  //     );

  //     return { ...cat, count: match ? match.total : 0 };
  //   });
  // }, [categories, categorizedProductCount]);

  // Get total count from API response
  const totalCount =
    categorizedProduct?.total || categorizedProduct?.data?.length || 0;

  // Build search summary text
  const getSearchSummary = () => {
    const parts = [];
    if (keyword) parts.push(`"${keyword}"`);
    if (category) parts.push(`in ${formatText(category)}`);
    if (brand) parts.push(`by ${brand}`);
    return parts.join(" ");
  };

  return (
    <MainLayout>
      <div className="px-4 md:px-20 py-7 bg-[#F7F7F7]">
        {/* Breadcrumb */}
        <div className="w-full flex items-center justify-start gap-x-3 mb-6">
          <Link
            to={"/"}
            className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box"
          >
            Home
          </Link>
          <img src={DOUBLE_DIRECT} className="w-[20px] h-[20px]" alt="" />

          {/* Search Summary */}
          <div className="w-fit h-fit flex items-center gap-x-2 px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box">
            <span className="text-[#808080]">
              {totalCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Ads
            </span>
            {keyword && <span>{getSearchSummary()}</span>}
          </div>
        </div>

        {/* Active Filters */}
        {(keyword || category || brand) && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Filters:</span>

            {keyword && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm">
                <span className="text-gray-700">Search: {keyword}</span>
                <button
                  onClick={() => {
                    searchParams.delete("q");
                    window.history.pushState(
                      {},
                      "",
                      `?${searchParams.toString()}`
                    );
                    refetch();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            )}

            {category && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm">
                <span className="text-green-700">
                  Category: {formatText(category)}
                </span>
                <button
                  onClick={() => {
                    searchParams.delete("category");
                    window.history.pushState(
                      {},
                      "",
                      `?${searchParams.toString()}`
                    );
                    refetch();
                  }}
                  className="text-green-400 hover:text-green-600"
                >
                  ×
                </button>
              </div>
            )}

            {brand && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm">
                <span className="text-blue-700">Brand: {brand}</span>
                <button
                  onClick={() => {
                    searchParams.delete("brand");
                    window.history.pushState(
                      {},
                      "",
                      `?${searchParams.toString()}`
                    );
                    refetch();
                  }}
                  className="text-blue-400 hover:text-blue-600"
                >
                  ×
                </button>
              </div>
            )}

            {(keyword || category || brand) && (
              <button
                onClick={() => {
                  window.location.href = "/products";
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Results Summary Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-primary-300">
            {keyword ? `Search Results` : "All Products"}
          </h1>
          <p className="text-gray-500 mt-1">
            {totalCount === 0
              ? "No products found"
              : `Showing ${totalCount} ${
                  totalCount === 1 ? "result" : "results"
                }`}
            {getSearchSummary() && ` for ${getSearchSummary()}`}
          </p>
        </div>

        {/* Products Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          ) : categorizedProduct?.data &&
            categorizedProduct.data?.length > 0 ? (
            categorizedProduct.data?.map(
              (item: ProductResponse, index: number) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard item={item} />
                </motion.div>
              )
            )
          ) : (
            <div className="col-span-2 md:col-span-3 lg:col-span-5 text-center py-16">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-24 h-24 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  We couldn't find any products matching your search criteria.
                  <br />
                  Try adjusting your filters or search terms.
                </p>
                {/* <Button
                  title="Clear Filters"
                  handleClick={() => {
                    window.location.href = "/products";
                  }}
                  btnStyles="bg-global-green text-white px-6 py-2 rounded-lg mx-auto"
                /> */}
              </div>
            </div>
          )}
        </div>

        {/* Pagination (if you have it) */}
        {categorizedProduct?.total_pages &&
          categorizedProduct.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from(
                { length: categorizedProduct.total_pages },
                (_, i) => i + 1
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    searchParams.set("page", pageNum.toString());
                    window.history.pushState(
                      {},
                      "",
                      `?${searchParams.toString()}`
                    );
                    refetch();
                  }}
                  className={`px-4 py-2 rounded ${
                    pageNum === (categorizedProduct.page || 1)
                      ? "bg-global-green text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-box"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
      </div>
    </MainLayout>
  );
}

export default SearchResults;
