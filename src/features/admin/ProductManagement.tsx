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
  GREEN_PENCIL,
  LOCATION,
  SEARCH_INPUT,
  TOTAL_ACTIVE_PRODUCTS,
  TOTAL_FLAGGED_PRODUCTS,
  TOTAL_PRODUCTS,
  TOTAL_SOLD_PRODUCTS,
} from "../../assets";
import { PercentageChange } from "../../components/chart";
import DashboardLayout from "../../layout/DashboardLayout";

import TableComponent from "../../components/TableComponent";
import FilterBox from "../../components/FilterBox";
import { DashboardData, Filter, ProductResponse } from "../../types";
import useDropdown from "../../hooks/useDropdown";
import { useQuery } from "@tanstack/react-query";
import {
  deleteAdminProduct,
  getAdminFeaturedProducts,
  getDashboardOverview,
  getDashboardProducts,
  updateFeaturedProducts,
} from "../../services/admin.service";
import {
  ProductsColumn,
  statusStyles,
} from "../../components/columns/ProductColumns";
import clsx from "clsx";
import CustomModal from "../../components/CustomModal";
// import ProductCard from "../../components/ProductCard";
import { formatPrice } from "../../utils";
import { FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import {
  selectProduct,
  selectProductAction,
  selectProductImages,
  setProductAction,
  setProductDetails,
  setProductImages,
} from "../../state/slices/globalReducer";
import moment from "moment";

import { useNavigate } from "react-router-dom";
import { filterOptions } from "../../constant";
import { updateProductStatus } from "../../services/product.service";

interface FeatureResponse {
  category_name: string;
  description: string;
  products: ProductResponse[];
}
const periodOptions = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last Month", value: "1m" },
  { label: "Last Year", value: "1yr" },
  { label: "This Year", value: "year" },
];

const productsStatus = ["All", "Active", "Closed", "Rejected"];

function ProductManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const productImages = useSelector(selectProductImages);
  const productAction = useSelector(selectProductAction);
  const {
    data: dashboardOverview,
    isLoading,
    // refetch,
  } = useQuery<DashboardData>({
    queryKey: ["overview-products", selectedPeriod],
    queryFn: () => getDashboardOverview(selectedPeriod),
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { data: featureedProducts } = useQuery({
    queryKey: ["admin-featured-products"],
    queryFn: getAdminFeaturedProducts,
  });
  const dispatch = useDispatch();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeaturedProducts, setSelectedFeaturedProducts] =
    useState<FeatureResponse | null>(null);
  const [productSelectModal, setProductSelectModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const productDetails: ProductResponse = useSelector(selectProduct);

  const ui =
    statusStyles[productDetails?.status] ?? statusStyles["UNDER_REVIEW"];

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
  ];
  const [tab, setTab] = useState("all");
  const [closeProductModal, setCloseProductModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState("");
  const [sorting, setSorting] = useState([]);
  const dateDropdownRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);
  const pagesRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [boxNumber, setBoxNumber] = useState<number | null>(null);
  // const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [fields, setFields] = useState({
    category_name: "",
    description: "",
  });
  const { dropdownRef, dropdowns, closeDropDown, setDropdowns } = useDropdown();
  const {
    data: products,
    refetch: refetchProducts,
    isLoading: isLoadinProducts,
  } = useQuery({
    queryKey: [
      "dashboard-products",
      selectedStatus,
      currentPage,
      search,
      appliedFilters,
    ],
    queryFn: () =>
      getDashboardProducts({
        status: selectedStatus === "All" ? "" : selectedStatus.toUpperCase(),
        page: currentPage,
        search,
        filters: appliedFilters,
      }),
  });

  // const filterproducts = products?.data?.filter((item: UserResponse) =>
  //   item?.first_name?.toLowerCase().includes(search.toLowerCase())
  // );
  const handleSelect = (box: number, featureProduct: FeatureResponse) => {
    if (featureProduct) {
      setSelectedFeaturedProducts(featureProduct);
    }
    const boxValue = box;
    setBoxNumber(boxValue);
  };

  const handleToggleIds = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((it) => it !== id) : [...prev, id]
    );
  };
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
    // setAppliedFilters(filters);
    closeDropDown("filterBox");
    //   refetch();
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

  const handleUpdateFeaturedProducts = async () => {
    setUpdating(true);

    const payload = {
      category_name: fields.category_name,
      description: fields.description,
      product_ids: selectedProductIds,
    };

    try {
      const response = await updateFeaturedProducts(boxNumber!, payload);
      if (response) {
        toast.success(response?.message);
        setSelectedProductIds([]);
        setFields({ category_name: "", description: "" });
        setBoxNumber(null);
        setProductSelectModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (selectedFeaturedProducts) {
      setFields({
        ...fields,
        category_name: selectedFeaturedProducts?.category_name,
        description: selectedFeaturedProducts?.description,
      });
      setSelectedProductIds(
        selectedFeaturedProducts.products?.map((item) => item.id)
      );
    } else {
      setFields({ category_name: "", description: "" });
      setSelectedProductIds([]);
    }
  }, [selectedFeaturedProducts]);
  const handleDeleteProduct = async () => {
    setLoading(true);

    try {
      const response = await deleteAdminProduct(productDetails?.id as string);
      if (response) {
        setProductDetails(null);
        toast.success(response?.message);
        setDeleteModal(false);
        refetchProducts();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCloseProduct = async () => {
    setLoading(true);

    try {
      const response = await updateProductStatus(
        productDetails?.id as string,
        "CLOSED"
      );
      if (response) {
        setProductDetails(null);
        toast.success(response?.message);
        setCloseProductModal(false);
        refetchProducts();
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
        <div className="w-full flex items-center justify-between gap-y-3 flex-col sm:flex-row">
          <div className="flex flex-col items-start">
            <span className="text-lg font-semibold text-[#22282F]">
              Product Management
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
        <div className="w-fit bg-[#00A63E0D] p-1.5 mt-5  rounded-xl flex items-center gap-x-3">
          <button
            onClick={() => setTab("all")}
            className={clsx(
              "w-full h-[40px] text-sm cursor-pointer rounded-xl px-3  font-medium",
              tab === "all"
                ? "bg-[#FFFFFF] text-global-green"
                : "bg-none text-[#656F7D] "
            )}
          >
            All Products
          </button>
          <button
            onClick={() => setTab("featured")}
            className={clsx(
              "w-full h-[40px] text-sm cursor-pointer rounded-xl  text-nowrap px-3 font-medium",
              tab === "featured"
                ? "bg-[#FFFFFF] text-global-green"
                : "bg-none text-[#656F7D] "
            )}
          >
            Featured Products
          </button>
        </div>
        {tab === "all" && (
          <>
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
            <div className="w-[45%] bg-[#00A63E0D] p-1.5 mt-5  rounded-xl flex items-center gap-x-3">
              {productsStatus.map((item) => (
                <button
                  onClick={() => setSelectedStatus(item)}
                  className={clsx(
                    "w-full px-3 h-[40px] text-sm cursor-pointer rounded-xl text-nowrap  font-medium",
                    selectedStatus === item
                      ? "bg-[#FFFFFF] text-global-green"
                      : "bg-none text-[#656F7D] "
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-5 w-full rounded-xl border border-[#E9EAEB] bg-white px-3 sm:px-5 py-3">
              <div className="w-full flex justify-between items-center gap-3 flex-col sm:flex-row">
                <span className="text-[16px] font-semibold text-primary-300">
                  {selectedStatus} Products{" "}
                  <span className="text-[#117D06]">
                    ({products?.data?.total_count || 0})
                  </span>
                </span>
                <div
                  className="flex items-center gap-x-3 relative flex-col sm:flex-row w-full sm:w-auto"
                  ref={dropdownRef.filterBox}
                >
                  <div className="flex items-center gap-x-2 w-full sm:w-[200px] px-3 py-2 border border-borderColor rounded-xl">
                    <img
                      src={SEARCH_INPUT}
                      className="w-[20px] h-[20px]"
                      alt=""
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="outline-none bg-transparent "
                      placeholder="Search"
                    />
                  </div>
                  <div
                    onClick={() =>
                      setDropdowns({ ...dropdowns, filterBox: true })
                    }
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
              ) : isLoading ? (
                <div className="w-full flex h-[50vh] items-center justify-center">
                  <Loader2 color="#07b463" size={50} className="animate-spin" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200"
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
          </>
        )}
        {tab === "featured" && (
          <div className="w-full mt-5 border border-[#E9EAEB] rounded-xl">
            <div className="p-3 w-full text-primary-300 font-semibold text-[16px] border-b border-[#E9EAEB]">
              Featured Products
            </div>
            <div className="p-3 flex flex-col lg:flex-row w-full items-start gap-3">
              {/* BOX 1 */}

              <div className=" bg-[#F5F5F5] rounded-xl p-3 w-full lg:w-[30%]">
                <div className="w-full flex items-start justify-between">
                  <div className="flex flex-col gap-y-1">
                    <span className="text-[#044706] text-xl font-semibold">
                      {featureedProducts?.[0]?.category_name || "Feature Title"}
                    </span>
                    <span className="text-sm font-normal text-[#555555]">
                      {featureedProducts?.[0]?.description ||
                        "Feature Description"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelect(1, featureedProducts?.[0])}
                    className="cursor-pointer"
                  >
                    <img
                      src={GREEN_PENCIL}
                      className="w-[20px] h-[20px]"
                      alt=""
                    />
                  </button>
                </div>

                <div className="flex flex-col gap-y-2.5 mt-3 h-[500px] overflow-y-scroll">
                  {(() => {
                    const box1Products = featureedProducts?.[0]?.products || [];
                    const totalSlots = Math.max(box1Products.length, 3);

                    return Array.from({ length: totalSlots }).map((_, i) => {
                      const product = box1Products[i];

                      return (
                        <div
                          key={i}
                          className="border border-dashed border-[#E97A3B] rounded-xl p-6 flex flex-col items-center justify-center bg-[#E97A3B08]"
                        >
                          {product ? (
                            <>
                              <img
                                src={product.image_urls?.[0]}
                                className="w-full h-[120px] object-cover rounded-lg mb-2"
                              />
                              <span className="text-gray-600 text-sm">
                                ₦{product.product_price?.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm mb-2">
                                <span className="text-gray-500 text-xl">
                                  🛒
                                </span>
                              </div>

                              <span className="text-gray-600 text-sm">
                                Empty Slot
                              </span>
                              <span className="text-gray-400 text-xs">
                                No product added
                              </span>
                            </>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* BOX 2 */}
              {/* BOX 2 */}
              <div className="w-full lg:w-[30%] bg-[#F5F5F5] rounded-xl p-3">
                <div className="w-full flex items-start justify-between">
                  <div className="flex flex-col gap-y-1">
                    <span className="text-[#044706] text-xl font-semibold">
                      {featureedProducts?.[1]?.category_name || "Feature Title"}
                    </span>
                    <span className="text-sm font-normal text-[#555555]">
                      {featureedProducts?.[1]?.description ||
                        "Feature Description"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelect(2, featureedProducts?.[1])}
                    className="cursor-pointer"
                  >
                    <img
                      src={GREEN_PENCIL}
                      className="w-[20px] h-[20px]"
                      alt=""
                    />
                  </button>
                </div>

                <div className="flex flex-col gap-y-2.5 mt-3 h-[500px] overflow-y-scroll">
                  {(() => {
                    const boxProducts = featureedProducts?.[1]?.products || [];
                    const totalSlots = Math.max(boxProducts.length, 3);

                    return Array.from({ length: totalSlots }).map((_, i) => {
                      const product = boxProducts[i];

                      return (
                        <div
                          key={i}
                          className="border border-dashed border-[#E97A3B] rounded-xl p-6 flex flex-col items-center justify-center bg-[#E97A3B08]"
                        >
                          {product ? (
                            <>
                              <img
                                src={product.image_urls?.[0]}
                                className="w-full h-[120px] object-cover rounded-lg mb-2"
                              />
                              <span className="text-gray-600 text-sm">
                                ₦{product.product_price?.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm mb-2">
                                <span className="text-gray-500 text-xl">
                                  🛒
                                </span>
                              </div>

                              <span className="text-gray-600 text-sm">
                                Empty Slot
                              </span>
                              <span className="text-gray-400 text-xs">
                                No product added
                              </span>
                            </>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* RIGHT SIDE (BOXES 3 & 4) */}
              <div className="flex flex-col gap-y-3 w-full lg:w-[40%]">
                {/* BOX 3 */}

                <div className="w-full bg-[#F5F5F5] rounded-xl p-3 h-full">
                  <div className="w-full flex items-start justify-between">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-[#044706] text-xl font-semibold">
                        {featureedProducts?.[2]?.category_name ||
                          "Feature Title"}
                      </span>
                      <span className="text-sm font-normal text-[#555555]">
                        {featureedProducts?.[2]?.description ||
                          "Feature Description"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelect(3, featureedProducts?.[2])}
                      className="cursor-pointer"
                    >
                      <img
                        src={GREEN_PENCIL}
                        className="w-[20px] h-[20px]"
                        alt=""
                      />
                    </button>
                  </div>

                  <div className="flex overflow-x-auto gap-x-2.5 mt-3">
                    {(() => {
                      const boxProducts =
                        featureedProducts?.[2]?.products || [];
                      const totalSlots = Math.max(boxProducts.length, 2);

                      return Array.from({ length: totalSlots }).map((_, i) => {
                        const product = boxProducts[i];

                        return (
                          <div
                            key={i}
                            className="border border-dashed border-[#E97A3B] rounded-xl p-4 bg-[#E97A3B08] 
                     flex flex-col items-center justify-between 
                     min-w-[180px]"
                          >
                            {product ? (
                              <>
                                <img
                                  src={product.image_urls?.[0]}
                                  className="w-full h-[150px] object-cover rounded-lg"
                                />
                                <span className="text-gray-600 text-sm mt-2">
                                  ₦{product.product_price?.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-sm mb-2">
                                  <span className="text-gray-500 text-xl">
                                    🛒
                                  </span>
                                </div>

                                <span className="text-gray-600 text-sm">
                                  Empty Slot
                                </span>
                                <span className="text-gray-400 text-xs">
                                  No product added
                                </span>
                              </>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* BOX 4 */}

                <div className="w-full bg-[#F5F5F5] rounded-xl p-3 h-full">
                  <div className="w-full flex items-start justify-between">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-[#044706] text-xl font-semibold">
                        {featureedProducts?.[3]?.category_name ||
                          "Feature Title"}
                      </span>
                      <span className="text-sm font-normal text-[#555555]">
                        {featureedProducts?.[3]?.description ||
                          "Feature Description"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelect(4, featureedProducts?.[3])}
                      className="cursor-pointer"
                    >
                      <img
                        src={GREEN_PENCIL}
                        className="w-[20px] h-[20px]"
                        alt=""
                      />
                    </button>
                  </div>

                  <div className="flex overflow-x-auto gap-x-2.5 mt-3">
                    {(() => {
                      const boxProducts =
                        featureedProducts?.[3]?.products || [];
                      const totalSlots = Math.max(boxProducts.length, 2);

                      return Array.from({ length: totalSlots }).map((_, i) => {
                        const product = boxProducts[i];

                        return (
                          <div
                            key={i}
                            className="border border-dashed border-[#E97A3B] rounded-xl p-4 bg-[#E97A3B08] 
                     flex flex-col items-center justify-between 
                     min-w-[180px]"
                          >
                            {product ? (
                              <>
                                <img
                                  src={product.image_urls?.[0]}
                                  className="w-full h-[150px] object-cover rounded-lg"
                                />
                                <span className="text-gray-600 text-sm mt-2">
                                  ₦{product.product_price?.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-sm mb-2">
                                  <span className="text-gray-500 text-xl">
                                    🛒
                                  </span>
                                </div>

                                <span className="text-gray-600 text-sm">
                                  Empty Slot
                                </span>
                                <span className="text-gray-400 text-xs">
                                  No product added
                                </span>
                              </>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        show={
          productDetails !== null &&
          productAction !== "DELETE" &&
          productAction !== "CLOSE"
        }
        onClose={() => dispatch(setProductDetails(null))}
      >
        <div className="bg-white rounded-lg w-full max-w-[595px] geist-family max-h-[90vh] overflow-y-auto">
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
            <button
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
            )}
          </div>
        </div>
      </Modal>

      <CustomModal
        open={boxNumber !== null}
        close={() => setBoxNumber(null)}
        width="w-[600px]"
        modalTitle="Edit Category"
      >
        <div className="p-5 flex items-center justify-between gap-3 w-full">
          <div className="flex flex-col gap-y-1 w-full">
            <span className="text-sm font-medium text-primary-300">
              Section Title <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={fields.category_name}
              onChange={(v) =>
                setFields({ ...fields, category_name: v.target.value })
              }
              className="w-full border text-primary-300 outline-none border-[#CCCCCC] rounded-xl p-3 placeholder:text-[#808080] text-sm"
              placeholder="Input section title"
            />
          </div>
          <div className="flex flex-col gap-y-1 w-full">
            <span className="text-sm font-medium text-primary-300">
              Section subtitle/description{" "}
              <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={fields.description}
              onChange={(v) =>
                setFields({ ...fields, description: v.target.value })
              }
              className="w-full border text-primary-300 outline-none border-[#CCCCCC] rounded-xl p-3 placeholder:text-[#808080] text-sm"
              placeholder="Add a description"
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-end gap-x-3 p-5">
          <button className="w-fit cursor-pointer text-sm font-medium text-primary-300 px-4 py-2.5 border border-[#E9EAEB] rounded-xl">
            Close
          </button>
          <button
            onClick={() => {
              setProductSelectModal(true);
              // setBoxNumber(null);
            }}
            className="w-fit cursor-pointer text-sm font-medium text-white px-4 h-[40px] bg-global-green rounded-xl"
          >
            Save
          </button>
        </div>
      </CustomModal>
      <CustomModal
        open={productSelectModal}
        close={() => setProductSelectModal(false)}
        width="w-[800px]"
        modalTitle="Select Product"
      >
        <div className="w-full max-h-[400px] overflow-y-auto">
          {products?.data?.data?.length > 0 ? (
            <div className="p-5 grid grid-cols-3 gap-3 w-full">
              {products?.data?.data?.map((item: ProductResponse) => (
                <div
                  onClick={() => handleToggleIds(item.id)}
                  className="w-full cursor-pointer relative h-full  bg-white hover:scale-105 transition-all duration-300 shadow-box p-3 rounded-xl flex flex-col gap-y-2 items-start"
                >
                  {selectedProductIds.includes(item.id) && (
                    <FaCheckCircle
                      color="#07b463"
                      className="absolute right-0 top-0"
                    />
                  )}
                  <img
                    src={item?.image_urls?.[0] as string}
                    className="w-full h-[208px] object-cover rounded-xl"
                    alt=""
                  />
                  <span className="text-faded-black text-sm ">
                    {item?.product_name}
                  </span>
                  <span className="text-[16px] font-semibold text-global-green">
                    ₦{" "}
                    {item?.product_price
                      ?.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${item?.description?.slice(0, 30)}...`,
                    }}
                  />
                  <div className="w-fit h-fit border border-[#E9EAEB] rounded-lg p-1.5 text-xs font-medium text-primary-300">
                    Market Price: {formatPrice(item?.market_price_from)} -{" "}
                    {formatPrice(item?.market_price_to)}
                  </div>
                  <div className="w-fit h-fit border border-[#E9EAEB] rounded-lg p-1.5 text-xs font-medium text-primary-300">
                    {item?.is_negotiable ? "Negotiable" : "Not Negotiable"}
                  </div>
                  <div
                    className={clsx(
                      "w-fit h-fit   rounded-lg p-1.5 text-xs font-medium ",
                      item.condition === "brand-new"
                        ? "text-global-green bg-[#07B4631A]"
                        : "bg-[#B491071A] text-[#B49107]"
                    )}
                  >
                    {item?.condition?.replace(/-/g, " ").toUpperCase()}
                  </div>
                  <div className="flex items-center gap-x-2">
                    <img src={LOCATION} className="w-[20px] h-[20px]" alt="" />
                    <span className="text-faded-black text-sm">
                      {item?.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : isLoadinProducts ? (
            <div className="flex items-center h-[50vh] w-full justify-center">
              <Loader2 size={30} color="#07b463" className="animate-spin" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full justify-center py-20 bg-white rounded-xl border border-gray-200"
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
        </div>
        <div className="w-full flex items-center justify-end gap-x-3 p-5">
          <button className="w-fit cursor-pointer text-sm font-medium text-primary-300 px-4 py-2.5 border border-[#E9EAEB] rounded-xl">
            Close
          </button>

          <Button
            title="Save"
            loading={updating}
            btnStyles="w-fit cursor-pointer px-4 h-[40px] bg-global-green rounded-xl"
            textStyle="text-sm font-medium text-white"
            // disabled={
            //   ((boxNumber === 1 || boxNumber === 2) &&
            //     selectedProductIds.length < 3) ||
            //   ((boxNumber === 3 || boxNumber === 4) &&
            //     selectedProductIds.length < 2)
            // }
            handleClick={handleUpdateFeaturedProducts}
          />
        </div>
      </CustomModal>
      <Modal
        show={productImages?.length > 0 || false}
        onClose={() => dispatch(setProductImages([]))}
      >
        <div className="relative w-full md:w-[70%] flex flex-col gap-y-5">
          {/* Close Button */}
          <button
            onClick={() => dispatch(setProductImages([]))}
            className="absolute right-3 top-3 z-20 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          >
            ✕
          </button>

          {/* Main Image */}
          <div className="w-full bg-white shadow-box rounded-xl p-5">
            <div className="w-full">
              <img
                src={productImages?.[currentImage as number]}
                className="w-full h-[400px] md:h-[450px] rounded-xl object-contain bg-gray-50"
                alt=""
              />
            </div>

            {/* Thumbnails */}
            <div className="w-full mt-4 flex items-center gap-x-3 overflow-x-auto pb-2">
              {productImages?.map((img: string, i: number) => {
                const isActive = i === currentImage;
                return (
                  <div
                    key={i}
                    className={`
                      flex-shrink-0 cursor-pointer rounded-xl overflow-hidden
                      border-2 transition-all duration-200
                      ${
                        isActive
                          ? "border-primary-300 scale-105"
                          : "border-transparent"
                      }
                    `}
                    onClick={() => setCurrentImage(i)}
                  >
                    <img
                      src={img}
                      className="w-[90px] h-[80px] md:w-[110px] md:h-[100px] object-cover"
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        show={closeProductModal || productAction === "CLOSE"}
        onClose={() => setCloseProductModal(false)}
      >
        <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Close Product?
          </h3>

          <p className="text-gray-600 text-sm mb-6">
            Are you sure you want to close this Product? This product would be
            marked as sold
          </p>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
              onClick={() => setCloseProductModal(false)}
            >
              Cancel
            </button>

            <Button
              title="Yes, Close"
              textStyle="text-sm font-medium text-white"
              btnStyles="px-4 py-2 rounded-lg  bg-gray-800 hover:bg-gray-900 transition"
              loaderSize={"w-1 h-1"}
              handleClick={handleCloseProduct}
              loading={loading}
            />
          </div>
        </div>
      </Modal>
      <Modal
        show={deleteModal || productAction === "DELETE"}
        onClose={
          deleteModal
            ? () => setDeleteModal(false)
            : () => dispatch(setProductAction(null))
        }
      >
        <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Product?
          </h3>

          <p className="text-gray-600 text-sm mb-6">
            This action cannot be undone. Do you want to permanently delete this
            product?
          </p>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
              onClick={
                deleteModal
                  ? () => setDeleteModal(false)
                  : () => dispatch(setProductAction(null))
              }
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
    </DashboardLayout>
  );
}

export default ProductManagement;
