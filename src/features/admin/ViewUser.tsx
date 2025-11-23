import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  AVATAR,
  CHEVRON_LEFT,
  EMPTY_CART,
  FILTER__,
  GO_BACK,
  NIGERIA_FLAG,
  SEARCH_INPUT,
  TOTAL_ACTIVE_PRODUCTS,
  TOTAL_FLAGGED_PRODUCTS,
  TOTAL_PRODUCTS,
  TOTAL_SOLD_PRODUCTS,
  TRASH,
} from "../../assets";
// import { PercentageChange } from "../../components/chart";
import {
  deleteAdminUser,
  getAdminUserDetails,
  getDashboardProducts,
} from "../../services/admin.service";
import { useQuery } from "@tanstack/react-query";
import useDropdown from "../../hooks/useDropdown";
import FilterBox from "../../components/FilterBox";
import TableComponent from "../../components/TableComponent";
import { AdminUserDetails, Filter } from "../../types";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ProductsColumn } from "../../components/columns/ProductColumns";
import { useLocation } from "react-router-dom";
import moment from "moment";
import clsx from "clsx";
import { statusStyles } from "../../components/columns/SellerColumns";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const productsStatus = ["All Listed Products", "Sold Products", "Under Review"];
function ViewUser() {
  const location = useLocation();
  const userId = location.pathname.split("/").pop();
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    data: userDetails,
    // refetch,
    // isLoading: isLoadingUserDetails,
  } = useQuery<AdminUserDetails>({
    queryKey: ["user-details", userId],
    queryFn: () => getAdminUserDetails(userId as string),
  });
  const ui =
    statusStyles[userDetails?.user_details?.status as string] ??
    statusStyles["ACTIVE"];
  const overviewData = [
    {
      icon: TOTAL_PRODUCTS,
      title: "Total Products Listed",
      value: userDetails?.metrics?.total_products_listed || 0,
      showRate: true,
    },

    {
      icon: TOTAL_ACTIVE_PRODUCTS,
      title: "Active Products",
      value: userDetails?.metrics?.active_products || 0,

      showRate: true,
    },
    {
      icon: TOTAL_SOLD_PRODUCTS,
      title: "Closed/Sold Products",
      value: userDetails?.metrics?.sold_products || 0,
      showRate: true,
    },
    {
      icon: TOTAL_FLAGGED_PRODUCTS,
      title: "Flagged/Reported Products",
      value: userDetails?.metrics?.flagged_products || 0,
      showRate: true,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("All Listed Products");
  // const [selectedPeriod, setSelectedPeriod] = useState("");
  // const [selectedPeriodLabel, setSelectedPeriodLabel] = useState("");
  const [sorting, setSorting] = useState([]);
  const dateDropdownRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);
  const pagesRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { dropdownRef, dropdowns, closeDropDown, setDropdowns } = useDropdown();
  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-products", userId, selectedStatus],
    queryFn: () =>
      getDashboardProducts({
        user_id: userId,
        status:
          selectedStatus === "All Listed Products"
            ? ""
            : selectedStatus.split(" ").join("_").toUpperCase(),
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
    refetch();
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    closeDropDown("filterBox");
    refetch();
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

  // const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        // setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const response = await deleteAdminUser(userId as string);
      if (response) {
        toast.success(response.message);
        window.history.back();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="p-3 geist-family w-full flex flex-col items-start gap-y-3">
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className=" gap-x-2 flex cursor-pointer items-center justify-center rounded-xl w-[98px] shadow-button h-[40px] border border-[#E5E7EF]"
          >
            <img src={GO_BACK} className="w-[20px] h-[20px]" alt="" />
            <span className="text-primary-300 font-medium text-[16px]">
              Back
            </span>
          </button>
          <button
            onClick={() => setDeleteModal(true)}
            className="w-[142px] h-[40px] rounded-xl bg-[#FF3B301A] flex items-center justify-center gap-x-2"
          >
            <img src={TRASH} className="w-[20px] h-[20px]" alt="" />
            <span className="text-[#FF3B30] font-medium text-sm">
              Delete Seller
            </span>
          </button>
        </div>
        <div className="w-full bg-white rounded-xl p-6 border border-gray-200">
          {/* Top Section: Name + ID + Status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <img
                src={userDetails?.user_details?.image_url || AVATAR}
                className="w-14 h-14 rounded-full object-cover"
                alt=""
              />

              {/* Name + ID */}
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-[#1F2227]">
                  {userDetails?.user_details?.user_name}
                </span>
                {/* <span className="text-sm text-gray-500">
                  ID: NPF/2024/04567
                </span> */}
              </div>
            </div>

            {/* Status */}
            {/* <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-gray-500 text-sm">Offline</span>
            </div> */}
          </div>

          {/* PERSONAL INFORMATION */}
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-global-green uppercase mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-10">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div
                  className={clsx(
                    "w-fit flex items-center gap-x-1 justify-center px-3 py-1.5 rounded-md",
                    ui.bg
                  )}
                >
                  <div
                    className={clsx(
                      "min-w-[5px] min-h-[5px] rounded-full",
                      ui.dot
                    )}
                  />

                  <span className={clsx("text-xs font-medium", ui.text)}>
                    {userDetails?.user_details?.status &&
                      userDetails?.user_details?.status
                        ?.replace(/_/g, " ")
                        ?.charAt(0)
                        .toUpperCase() +
                        userDetails?.user_details?.status
                          .slice(1)
                          .toLowerCase()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                <span className="text-sm">
                  {userDetails?.user_details?.email}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Verification Status
                </p>
                <span className="text-green-600 font-medium text-sm">
                  ● Verified
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <div className="flex items-center gap-x-2">
                  {/* <div className="w-[20px] h-[20px] rounded-md border border-borderColor" /> */}
                  <img
                    src={NIGERIA_FLAG}
                    className="w-[25px] h-[25px]"
                    alt=""
                  />
                  <span className="text-sm font-medium text-[#4D4D4D]">
                    {userDetails?.user_details?.phone_number || "-"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Registered Date</p>
                <span className="text-sm">
                  {" "}
                  {moment(userDetails?.user_details?.created_at).format(
                    "MMM D, YYYY h:mm A"
                  )}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <span className="text-sm">
                  {userDetails?.user_details?.location}
                </span>
              </div>
            </div>
          </div>

          {/* COMPANY SECTION */}
          <div className="mt-10">
            <h3 className="text-xs font-semibold text-global-green uppercase mb-4">
              Company Name, Description
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-10">
              <div>
                <p className="text-xs text-gray-500 mb-1">Company Name</p>
                <span className="text-sm">
                  {userDetails?.store_details?.business_name || "-"}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Verification Status
                </p>
                <span className="text-green-600 font-medium text-sm">
                  ● Verified
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Registered Date</p>
                <span className="text-sm">
                  {" "}
                  {moment(userDetails?.store_details?.created_at).format(
                    "MMM D, YYYY h:mm A"
                  )}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <span className="text-sm">
                  {userDetails?.store_details?.address}
                </span>
              </div>
            </div>
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
              </div>
            </div>
          ))}
        </div>
        <div className="w-[45%] bg-[#00A63E0D] p-1.5 mt-5  rounded-xl flex items-center gap-x-3">
          {productsStatus.map((item) => (
            <button
              onClick={() => setSelectedStatus(item)}
              className={clsx(
                "w-full h-[40px] text-sm cursor-pointer rounded-xl  font-medium",
                selectedStatus === item
                  ? "bg-[#FFFFFF] text-global-green"
                  : "bg-none text-[#656F7D] "
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="w-full rounded-xl border border-[#E9EAEB] bg-white px-3 sm:px-5 py-3">
          <div className="w-full flex justify-between items-center gap-3 flex-col sm:flex-row">
            <span className="text-[16px] font-semibold text-primary-300">
              Active Products
              <span className="text-[#117D06]">
                ({products?.data?.total_count || 0})
              </span>
            </span>
            <div
              className="flex items-center gap-x-3 relative flex-col sm:flex-row w-full sm:w-auto"
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
                filterOptions={[]}
                applyFilter={handleApplyFilters}
                clearFilters={clearFilters}
                addFilter={addFilter}
                removeFilter={removeFilter}
                handleFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {products?.data?.data?.length > 0 ? (
            <div className="max-w-[54.2vw] min-w-full mt-2 custom-scrollbar-gray overflow-x-auto">
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
              className="flex flex-col mt-5 items-center justify-center py-20 bg-white rounded-xl border border-gray-200"
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
        <Modal show={deleteModal} onClose={() => setDeleteModal(false)}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete User?
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. Do you want to permanently delete
              this user?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>

              <Button
                title="Yes, Delete"
                textStyle="text-sm font-medium text-white"
                btnStyles="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                loaderSize={"w-1 h-1"}
                handleClick={handleDeleteUser}
                loading={loading}
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default ViewUser;
