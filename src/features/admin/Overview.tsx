import { useEffect, useRef, useState } from "react";

import { Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  ARROW_DOWN,
  AVATAR,
  CALENDER_ICON,
  CHEVRON_LEFT,
  EMPTY_CART,
  FILTER__,
  SEARCH_INPUT,
  TOTAL_ACTIVE_PRODUCTS,
  TOTAL_FLAGGED_PRODUCTS,
  TOTAL_PRODUCTS,
  TOTAL_REGISTERED_SELLERS,
  TOTAL_SOLD_PRODUCTS,
} from "../../assets";
import SpendingChart, { PercentageChange } from "../../components/chart";
import DashboardLayout from "../../layout/DashboardLayout";
// import EmptyState from "../../components/EmptyState";
import TableComponent from "../../components/TableComponent";
import FilterBox from "../../components/FilterBox";
import { DashboardData, Filter } from "../../types";
import useDropdown from "../../hooks/useDropdown";
import { useQuery } from "@tanstack/react-query";
import {
  deleteAdminProduct,
  getDashboardOverview,
  getDashboardProducts,
} from "../../services/admin.service";
import {
  ProductsColumn,
  statusStyles,
} from "../../components/columns/ProductColumns";
import Modal from "../../components/Modal";
import {
  selectProduct,
  selectProductAction,
  selectProductImages,
  setProductAction,
  setProductDetails,
  setProductImages,
} from "../../state/slices/globalReducer";
import Button from "../../components/Button";
import {
  // deleteProduct,
  updateProductStatus,
} from "../../services/product.service";
import toast from "react-hot-toast";
import { filterOptions } from "../../constant";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const periodOptions = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last Month", value: "1m" },
  { label: "Last Year", value: "1yr" },
  { label: "This Year", value: "year" },
];

function Overview() {
  const productImages = useSelector(selectProductImages);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState<number | null>(0);
  const productAction = useSelector(selectProductAction);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const {
    data: dashboardOverview,
    isLoading,
    refetch,
  } = useQuery<DashboardData>({
    queryKey: ["overview", selectedPeriod],
    queryFn: () => getDashboardOverview(selectedPeriod),
  });
  const [currentPage, setCurrentPage] = useState(1);

  const overviewData = [
    {
      icon: TOTAL_PRODUCTS,
      title: "Total Products Listed",
      value: dashboardOverview?.stats?.total_product_listed,
      showRate: dashboardOverview?.growth?.total_product_listed,
    },

    {
      icon: TOTAL_ACTIVE_PRODUCTS,
      title: "Active Products",
      value: dashboardOverview?.stats?.active_products,

      showRate: dashboardOverview?.growth?.active_products,
    },
    {
      icon: TOTAL_SOLD_PRODUCTS,
      title: "Closed/Sold Products",
      value: dashboardOverview?.stats?.closed_sold_products,
      showRate: dashboardOverview?.growth?.closed_sold_products,
    },
    {
      icon: TOTAL_FLAGGED_PRODUCTS,
      title: "Flagged/Reported Products",
      value: dashboardOverview?.stats?.flagged_reported_products,
      showRate: dashboardOverview?.growth?.flagged_reported_products,
    },

    {
      icon: TOTAL_REGISTERED_SELLERS,
      title: "Total Registered Sellers",
      value: dashboardOverview?.stats?.total_registered_sellers,
      showRate: dashboardOverview?.growth?.total_registered_sellers,
    },
  ];

  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState("");
  const [sorting, setSorting] = useState([]);
  const dateDropdownRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);
  const pagesRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { dropdownRef, dropdowns, closeDropDown, setDropdowns } = useDropdown();
  const {
    data: products,
    refetch: refetchProducts,
    isLoading: isLoadinProducts,
  } = useQuery({
    queryKey: ["dashboard-products", currentPage, search, appliedFilters],
    queryFn: () =>
      getDashboardProducts({
        page: currentPage,
        search: search,
        filters: appliedFilters,
      }),
  });

  // const filterproducts = products?.data?.filter((item: UserResponse) =>
  //   item?.first_name?.toLowerCase().includes(search.toLowerCase())
  // );
  const addFilter = (item: string) => {
    setFilters((prev) => [
      ...prev,
      {
        id: filters.length + 1,
        field: item || "",
        value: "",
      },
    ]);
  };
  const removeFilter = (id: string | number) => {
    setFilters((prev) => prev.filter((item) => item.id !== id));
  };

  const clearFilters = () => {
    setFilters([]);
    setAppliedFilters([]);
    refetchProducts();
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    closeDropDown("filterBox");
    refetchProducts();
  };
  const handleFilterChange = (
    id: number | string,
    newValue: string | number | null
  ) => {
    setFilters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  useEffect(() => {
    const selectedButton = pagesRefs.current[currentPage];
    if (selectedButton) {
      selectedButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentPage]);

  const [isOpen, setIsOpen] = useState(false);
  const productDetails = useSelector(selectProduct);
  const ui =
    statusStyles[productDetails?.status] ?? statusStyles["UNDER_REVIEW"];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //   const handleApply = () => {
  //     refetch(); // triggers API with startDate & endDate
  //     setIsOpen(false);
  //   };

  //   useEffect(() => {
  //     dispatch(setModalAction(null));
  //   }, []);
  //   if (isLoading)
  //     return (
  //       <div className="w-full flex h-[50vh]  items-center justify-center">
  //         <Loader2 color="#2545d3" size={50} className="animate-spin" />
  //       </div>
  //     );

  const handleDeleteProduct = async () => {
    setLoading(true);

    try {
      const response = await deleteAdminProduct(productDetails?.id as string);
      if (response) {
        toast.success(response?.message);
        dispatch(setProductAction(null));
        refetchProducts();
        refetch();
        dispatch(setProductDetails(null));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductAction = async () => {
    setLoading(true);

    try {
      const response = await updateProductStatus(
        productDetails?.id as string,
        productAction
      );
      if (response) {
        toast.success(response?.message);
        dispatch(setProductAction(null));
        refetchProducts();
        refetch();
        dispatch(setProductDetails(null));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full p-3 sm:p-5 geist-family">
        {/* <LinkHead title="Admin | Overview" content="" /> */}
        <div className="w-full flex items-center justify-between gap-y-3">
          <div className="flex flex-col items-start">
            <span className="text-lg font-semibold text-[#22282F]">
              Dashboard
            </span>
            <span className="text-[16px] font-medium text-[#656F7D]">
              Dashboard Overview
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center text-[#808080] px-3 py-3 rounded-xl transition-all hover:scale-95 duration-300 border border-borderColor gap-x-2"
            >
              <img src={CALENDER_ICON} className="w-[20px] h-[20px]" alt="" />
              <span className="text-sm font-normal">
                {selectedPeriodLabel || "Filter period"}
              </span>
              <img src={ARROW_DOWN} className="w-[20px] h-[20px]" alt="" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border border-borderColor z-50 p-2 animate-fadeIn">
                {periodOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedPeriod(opt.value);
                      setSelectedPeriodLabel(opt.label);
                      setIsOpen(false);
                      // fetchDashboard(opt.value); // your API call
                    }}
                    className={`
            w-full text-left px-3 py-2 rounded-lg text-sm
            hover:bg-[#F3F4F6] transition-all
            ${
              selectedPeriod === opt.value
                ? "bg-[#E6FCE8] text-[#07B463] font-semibold"
                : "text-[#333]"
            }
          `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3 mt-5">
          {overviewData.map((item) => (
            <div className="w-full flex flex-col justify-start px-3 py-4 gap-y-1 border border-[#E9EAEB] rounded-xl">
              <div className="flex flex-col gap-y-2">
                <img src={item.icon} className="w-[40px] h-[40px]" alt="" />
                <span className="text-xs font-medium text-primary-50">
                  {item.title}
                </span>
              </div>
              <div className="w-full flex items-center justify-between">
                <span className="text-xl font-semibold text-primary-300">
                  {item.title === "Amount Spent"
                    ? `$${item.value}`
                    : item.value}
                </span>

                <PercentageChange percentage={item?.showRate} />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col md:flex-row items-start gap-3 justify-between">
          <SpendingChart
            title={"Customer Signup Metrics"}
            count={dashboardOverview?.stats?.total_registered_sellers as number}
            chart_data={
              dashboardOverview?.metrics?.customer_signup_metrics as any
            }
            growth={
              dashboardOverview?.growth?.total_registered_sellers as number
            }
          />
          <SpendingChart
            title={"Total Sold Products"}
            count={dashboardOverview?.stats?.closed_sold_products as number}
            chart_data={dashboardOverview?.metrics?.total_sold_products as any}
            growth={dashboardOverview?.growth?.closed_sold_products as number}
          />
        </div>
        <div className="mt-5 w-full rounded-xl border border-[#E9EAEB] bg-white px-3 sm:px-5 py-3">
          <div className="w-full flex justify-between lg:items-center items-start gap-3 flex-col sm:flex-row">
            <span className="text-[16px] font-semibold text-primary-300">
              Active Products{" "}
              <span className="text-[#117D06]">
                ({products?.data?.total_count || 0})
              </span>
            </span>
            <div
              className="flex lg:items-center items-start gap-3 relative flex-col sm:flex-row w-full sm:w-auto"
              ref={dropdownRef.filterBox}
            >
              <div className="flex items-center gap-x-2 w-full sm:w-[200px] px-3 py-2 border border-borderColor rounded-xl">
                <img src={SEARCH_INPUT} className="w-[20px] h-[20px]" alt="" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none bg-transparent "
                  placeholder="Search"
                />
              </div>
              <div
                onClick={() => setDropdowns({ ...dropdowns, filterBox: true })}
                className="flex cursor-pointer items-center gap-x-2 px-3 py-2 border border-borderColor rounded-xl"
              >
                <img src={FILTER__} className="w-[20px] h-[20px]" alt="" />
                <span className="text-sm font-medium text-primary-300">
                  Filter
                </span>
              </div>

              <FilterBox
                open={dropdowns.filterBox}
                filters={filters}
                filterOptions={filterOptions.products}
                applyFilter={handleApplyFilters}
                clearFilters={clearFilters}
                addFilter={addFilter}
                removeFilter={removeFilter}
                handleFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {products?.data?.data?.length > 0 ? (
            <div className="w-full mt-2 custom-scrollbar-gray overflow-x-auto">
              <TableComponent
                DATA={products?.data?.data}
                // @ts-ignore
                COLUMNS={ProductsColumn}
                setSorting={setSorting}
                sorting={sorting}
              />
            </div>
          ) : isLoading || isLoadinProducts ? (
            <div className="w-full flex h-[50vh] items-center justify-center">
              <Loader2 color="#07b463" size={50} className="animate-spin" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 mt-5"
            >
              <img
                src={EMPTY_CART}
                alt="No Products"
                className="w-28 h-28 mb-4 opacity-70"
              />
              <h3 className="text-gray-700 text-base font-semibold">
                No Products Available
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Check back later or explore other categories.
              </p>
            </motion.div>
          )}
          {products?.data?.data?.length > 0 && (
            <div className="w-full mt-5 flex items-center justify-center">
              <div className="flex items-center gap-x-4">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage(() =>
                      Math.max(1, products?.data?.meta?.page - 1)
                    )
                  }
                  disabled={products?.meta?.page === 1}
                  className={`border border-[#E5E7EF] rounded-xl min-w-[40px] px-4 min-h-[40px] hidden lg:flex items-center justify-center transition-all ${
                    products?.data?.meta?.page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#F0FDF4]"
                  }`}
                >
                  <img
                    src={CHEVRON_LEFT}
                    className="w-[20px] h-[20px]"
                    alt="Previous"
                  />
                </button>

                {/* Page Numbers */}
                <div
                  className={`flex items-center gap-x-2 ${
                    products?.data?.meta?.totalPages > 6
                      ? "max-w-[250px] sm:max-w-[300px] overflow-x-auto scrollbar-hide"
                      : ""
                  }`}
                >
                  {Array.from(
                    { length: products?.data?.meta?.totalPages || 0 },
                    (_, i) => i + 1
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`flex items-center justify-center min-w-[40px] h-[40px] rounded-xl border text-[13px] transition-all duration-300 ${
                        products?.data?.meta?.page === pageNum
                          ? "bg-green-600 text-white border-green-600"
                          : "text-[#2A2E34] hover:bg-green-600 hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage(() =>
                      Math.min(
                        products?.data?.meta?.totalPages,
                        products?.meta?.page + 1
                      )
                    )
                  }
                  disabled={
                    products?.data?.meta?.page ===
                    products?.data?.meta?.totalPages
                  }
                  className={`border border-[#E5E7EF] rounded-xl min-w-[40px] px-4 min-h-[40px] hidden lg:flex items-center justify-center transition-all ${
                    products?.data?.meta?.page ===
                    products?.data?.meta?.totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#F0FDF4]"
                  }`}
                >
                  <img
                    src={CHEVRON_LEFT}
                    className="w-[20px] h-[20px] scale-x-[-1]"
                    alt="Next"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
        <Modal
          show={productAction === "CLOSE" || productAction === "OPEN"}
          onClose={() => {
            dispatch(setProductAction(null));
            dispatch(setProductDetails(null));
          }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {productAction === "CLOSED" ? "Close" : "Re-Open"} Product?
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to{" "}
              {productAction === "CLOSED" ? "close" : "re-open"} this Product?
              This product would{" "}
              {productAction === "CLOSED"
                ? "be marked as sold"
                : "be back on sale"}
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => {
                  dispatch(setProductAction(null));
                  dispatch(setProductDetails(null));
                }}
              >
                Cancel
              </button>

              <Button
                title={productAction === "CLOSED" ? "Close" : "Re-Open"}
                textStyle="text-sm font-medium text-white"
                disabled={loading}
                btnStyles={`px-4 py-2 rounded-lg   transition ${
                  productAction === "CLOSED"
                    ? "bg-gray-800 hover:bg-gray-900"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                loaderSize={"w-1 h-1"}
                handleClick={handleProductAction}
                loading={loading}
              />
            </div>
          </div>
        </Modal>
        <Modal
          show={productAction && productAction === "DELETE"}
          onClose={() => {
            dispatch(setProductAction(null));
            dispatch(setProductDetails(null));
          }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Product?
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. Do you want to permanently delete
              this product?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => {
                  dispatch(setProductDetails(null));
                  dispatch(setProductAction(null));
                }}
              >
                Cancel
              </button>

              <Button
                title="Yes, Delete"
                textStyle="text-sm font-medium text-white"
                btnStyles="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                loaderSize={"w-1 h-1"}
                handleClick={handleDeleteProduct}
                loading={loading}
              />
            </div>
          </div>
        </Modal>
        <Modal
          show={productImages?.length > 0 || false}
          onClose={() => dispatch(setProductImages([]))}
        >
          <div className="relative w-full max-w-[500px] flex flex-col gap-y-5">
            {/* Close Button */}
            <button
              onClick={() => dispatch(setProductImages([]))}
              className="absolute right-3 top-3 z-20 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
              ✕
            </button>

            {/* Main Image */}
            <div className="w-full bg-white shadow-box rounded-xl p-5 flex flex-col gap-y-3">
              <div className="w-full">
                <img
                  src={productImages?.[currentImage as number]}
                  className="w-full h-[300px] rounded-xl object-cover bg-gray-50"
                  alt=""
                />
              </div>

              {/* Thumbnails */}
              <div className="max-w-full overflow-x-scroll flex items-center gap-x-2 pb-2">
                {productImages?.map((img: string, i: number) => {
                  const isActive = i === currentImage;
                  return (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setCurrentImage(i)}
                      className={`w-[80px] h-[79px] rounded-xl object-cover cursor-pointer transition-all duration-200 ${
                        isActive ? "border-2 border-primary-300" : ""
                      }`}
                      alt=""
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          show={
            productDetails !== null &&
            productAction !== "DELETE" &&
            productAction !== "CLOSE"
          }
          onClose={() => dispatch(setProductDetails(null))}
        >
          <div className="bg-white rounded-lg w-full lg:max-w-[595px] max-w-[90%] geist-family max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-primary-300">
                Product Details -{" "}
                <span className="text-emerald-500">
                  {productDetails?.product_name}
                </span>
              </h2>
              <button
                onClick={() => dispatch(setProductDetails(null))}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center justify-between border border-borderColor  rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={productDetails?.user?.image_url || AVATAR}
                      className="w-14 h-14 rounded-full object-cover"
                      alt=""
                    />

                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-300">
                      {productDetails?.user?.user_name}
                    </h3>
                    {/* <p className="text-sm text-gray-500">
                            ID: {productDetails?.user?.id}
                          </p> */}
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(`/admin/users/${productDetails?.user_id}`)
                  }
                  className="px-4 h-[24px] bg-global-green text-white rounded-md text-sm font-normal hover:bg-emerald-600 transition-colors"
                >
                  View Details
                </button>
              </div>

              {/* Product Information Grid */}
              <div className="grid grid-cols-2 gap-6 border border-borderColor p-4 rounded-xl">
                {/* Product Name */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Product Name
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-300 font-medium">
                      {productDetails?.user?.user_name}
                    </span>
                    {/* <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 size={14} />
                      </button> */}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Category
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-300 font-medium">
                      {productDetails?.category_name}
                    </span>
                    {/* <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 size={14} />
                      </button> */}
                  </div>
                </div>

                {/* Sub-Category */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Brand
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-300 font-medium">
                      {productDetails?.brand_name}
                    </span>
                    {/* <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 size={14} />
                      </button> */}
                  </div>
                </div>

                {/* Product Price */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Product Price
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-300 font-medium">
                      {productDetails?.product_price?.toLocaleString()}
                    </span>
                    {/* <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 size={14} />
                      </button> */}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Product Description
                  </label>
                  <div className="flex items-start gap-2">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: productDetails?.description,
                      }}
                      className="text-primary-300 leading-relaxed"
                    ></p>
                    {/* <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                      <Edit2 size={14} />
                    </button> */}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl border border-borderColor">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Outstanding Details
                  </label>
                  <div className="flex items-start gap-2">
                    <p className="text-primary-300 font-medium">
                      {productDetails?.outstanding_issues}
                    </p>
                    {/* <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                        <Edit2 size={14} />
                      </button> */}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Category
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-300 font-medium">
                      {productDetails?.category_name}
                    </span>
                    {/* <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 size={14} />
                      </button> */}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Date Listed
                  </label>
                  <p className="text-primary-300 font-medium">
                    {moment(productDetails?.created_at).format("MMM D, YYYY")}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Approved Date:
                  </label>
                  <p className="text-primary-300 font-medium">
                    {moment(productDetails?.created_at).format("MMM D, YYYY")}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className={clsx(
                        "w-fit flex items-center gap-x-1 justify-center px-3 py-1.5 rounded-md",
                        ui?.bg
                      )}
                    >
                      <div
                        className={clsx(
                          "min-w-[5px] min-h-[5px] rounded-full",
                          ui?.dot
                        )}
                      />

                      <span className={clsx("text-xs font-medium", ui?.text)}>
                        {productDetails?.status
                          ?.replace(/_/g, " ")
                          ?.toLowerCase()}
                      </span>
                    </div>
                    {/* <button className="text-gray-400 hover:text-gray-600">
                      <Edit2 size={14} />
                    </button> */}
                  </div>
                </div>
              </div>

              {/* Status */}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => dispatch(setProductDetails(null))}
                className="px-5 py-2 text-primary-300 rounded-xl bg-white border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {/* <button
                onClick={() => setDeleteModal(true)}
                className="px-5 py-2 text-white bg-red-500 rounded-xl  font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              {productDetails?.status !== "CLOSED" && (
                <button
                  onClick={() => setCloseProductModal(true)}
                  className="px-5 py-2 text-white bg-emerald-500 rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                >
                  Close
                </button>
              )} */}
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default Overview;
