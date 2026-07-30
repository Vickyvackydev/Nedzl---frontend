import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { Link, useSearchParams } from "react-router-dom";
import { DOUBLE_DIRECT } from "../assets";
import { getAllProducts, createSearchAlert } from "../services/product.service";
import { useQuery } from "@tanstack/react-query";
import { ProductResponse } from "../types";
import ProductCard from "../components/ProductCard";
import { formatText } from "../utils";
import { SkeletonCard } from "../components/product-row";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";

function SearchResults() {
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("q");
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");

  const [page, setPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState<ProductResponse[]>([]);

  const [showPopup, setShowPopup] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [submittingAlert, setSubmittingAlert] = useState(false);

  // Reset page and accumulated list when query parameters change
  useEffect(() => {
    setPage(1);
    setAccumulatedProducts([]);
  }, [keyword, category, brand]);

  const {
    data: categorizedProduct,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["product-search", keyword, category, brand, page],
    queryFn: () =>
      getAllProducts({
        search: keyword || "",
        category: category || "",
        brand: brand || "",
        page: page,
        limit: 10,
      }),
  });

  // Accumulate loaded search results
  useEffect(() => {
    if (categorizedProduct?.data) {
      if (page === 1) {
        setAccumulatedProducts(categorizedProduct.data);
      } else {
        setAccumulatedProducts((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = categorizedProduct.data.filter(
            (item: ProductResponse) => !existingIds.has(item.id)
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [categorizedProduct, page]);

  const totalPages = categorizedProduct?.totalpages || 1;
  const hasMore = page < totalPages;

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500 &&
        hasMore &&
        !isLoading &&
        !isFetching
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, isFetching]);

  const hasNoResults =
    !isLoading &&
    (accumulatedProducts.length === 0);

  const { data: fallbackProduct, isLoading: isLoadingFallback } = useQuery({
    queryKey: ["product-search-fallback", category],
    queryFn: () =>
      getAllProducts({
        category: category || "",
        limit: 10,
      }),
    enabled: hasNoResults,
  });

  useEffect(() => {
    if (hasNoResults) {
      const promptSessionKey = `search-alert-prompted-${keyword}-${category}`;
      const prompted = sessionStorage.getItem(promptSessionKey);

      if (!prompted) {
        const timer = setTimeout(() => {
          setShowPopup(true);
          sessionStorage.setItem(promptSessionKey, "true");
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [hasNoResults, keyword, category]);

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
                      `?${searchParams.toString()}`,
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
                      `?${searchParams.toString()}`,
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
                      `?${searchParams.toString()}`,
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
        <div className="w-full flex flex-col gap-y-4">
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {isLoading && page === 1 ? (
              Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            ) : accumulatedProducts.length > 0 ? (
              accumulatedProducts.map(
                (item: ProductResponse, index: number) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (index % 5) * 0.04 }}
                  >
                    <ProductCard item={item} />
                  </motion.div>
                ),
              )
            ) : (
              <div className="col-span-2 md:col-span-3 lg:col-span-5 flex flex-col items-center w-full">
                <div className="text-center py-8 max-w-md mx-auto">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 mb-3"
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
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">
                    No exact matches found
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    We couldn't find products matching your search. Here are some
                    other items:
                  </p>
                </div>

                {/* Fallback Suggestions Grid */}
                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                  {isLoadingFallback ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  ) : fallbackProduct?.data && fallbackProduct.data.length > 0 ? (
                    fallbackProduct.data.map(
                      (item: ProductResponse, index: number) => (
                        <motion.div
                          key={item.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <ProductCard item={item} />
                        </motion.div>
                      ),
                    )
                  ) : (
                    <p className="col-span-full text-center text-sm text-gray-400 py-6">
                      No other products available right now.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Scroll Loading Indicator */}
          {isFetching && page > 1 && (
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={`more-search-skel-${i}`} />
              ))}
            </div>
          )}
        </div>

        {/* Waitlist Subscription Modal */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100"
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="text-center flex flex-col items-center gap-y-3 mt-2">
                <div className="w-12 h-12 rounded-full bg-[#07B4630D] flex items-center justify-center text-global-green">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-bold text-[#313133]">
                  Can't find what you're looking for?
                </h3>
                <p className="text-sm text-gray-500">
                  Leave your email and we'll notify you the moment a matching
                  product is listed on campus!
                </p>

                <div className="w-full text-left bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600 mb-2">
                  <span className="font-semibold">Notification Alert:</span>
                  <div className="mt-1">
                    {keyword && (
                      <span className="block">• Keyword: "{keyword}"</span>
                    )}
                    {category && (
                      <span className="block">
                        • Category: {formatText(category)}
                      </span>
                    )}
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!emailInput.trim()) return;
                    setSubmittingAlert(true);
                    try {
                      await createSearchAlert({
                        email: emailInput,
                        keyword: keyword || "",
                        category: category || "",
                      });
                      toast.success(
                        "Success! We'll email you when matching products are posted.",
                      );
                      setShowPopup(false);
                    } catch (err: any) {
                      toast.error(
                        err?.response?.data?.error ||
                          "Failed to create notification alert",
                      );
                    } finally {
                      setSubmittingAlert(false);
                    }
                  }}
                  className="w-full flex flex-col gap-y-3"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full h-[45px] rounded-xl px-3 border border-borderColor shadow-input outline-none text-sm text-primary-300 focus:border-global-green transition-all"
                  />
                  <button
                    type="submit"
                    disabled={submittingAlert}
                    className="w-full h-[45px] bg-global-green text-white font-semibold rounded-xl text-sm hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {submittingAlert ? "Subscribing..." : "Notify Me"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default SearchResults;
