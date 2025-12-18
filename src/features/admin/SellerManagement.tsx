import { useEffect, useRef, useState } from "react";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import {
  ACTIVE_USERS,
  ARROW_DOWN,
  CALENDER_ICON,
  CHEVRON_LEFT,
  EMPTY_CART,
  FILTER__,
  SEARCH_INPUT,
  TOTAL_USERS,
  USERS_DEACTIVATED,
  USERS_SUSPENDED,
} from "../../assets";
import { PercentageChange } from "../../components/chart";
import DashboardLayout from "../../layout/DashboardLayout";

import TableComponent from "../../components/TableComponent";
import FilterBox from "../../components/FilterBox";
import { Filter, SellerOverviewType } from "../../types";
import useDropdown from "../../hooks/useDropdown";
import { useQuery } from "@tanstack/react-query";
import {
  deleteAdminUser,
  getDashboardUsers,
  getSellerOverview,
  updateUserStatus,
  verifyUser,
} from "../../services/admin.service";

import { SellerColumn } from "../../components/columns/SellerColumns";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
// import { selectUser } from "../../state/slices/authReducer";
import {
  selectUserAction,
  selectUserId,
  setUserAction,
} from "../../state/slices/globalReducer";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
// import { API } from "../../config";
import toast from "react-hot-toast";
import { filterOptions } from "../../constant";

const periodOptions = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last Month", value: "1m" },
  { label: "Last Year", value: "1yr" },
  { label: "This Year", value: "year" },
];

const sellersStatus = ["All Sellers", "Active", "Suspended", "Deactivated"];

function SellerManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const { data: sellerOverview, isLoading } = useQuery<SellerOverviewType>({
    queryKey: ["overview-users", selectedPeriod],
    queryFn: () => getSellerOverview(selectedPeriod),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const userAction: string = useSelector(selectUserAction);
  const userId = useSelector(selectUserId);
  const overviewData = [
    {
      icon: TOTAL_USERS,
      title: "Total Seller",
      value: sellerOverview?.user_stats?.total_sellers,
      showRate: sellerOverview?.growth?.total_sellers,
    },

    {
      icon: ACTIVE_USERS,
      title: "Active Users",
      value: sellerOverview?.user_stats?.active_sellers,

      showRate: sellerOverview?.growth?.active_sellers,
    },
    {
      icon: USERS_SUSPENDED,
      title: "Suspended Users",
      value: sellerOverview?.user_stats?.suspended_users,
      showRate: sellerOverview?.growth?.suspended_users,
    },
    {
      icon: USERS_DEACTIVATED,
      title: "Deactivated Users",
      value: sellerOverview?.user_stats?.deactivated_users,
      showRate: sellerOverview?.growth?.deactivated_users,
    },
  ];

  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState("");
  const [sorting, setSorting] = useState([]);
  const dateDropdownRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);
  const pagesRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All Sellers");

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { dropdownRef, dropdowns, closeDropDown, setDropdowns } = useDropdown();
  const {
    data: users,
    refetch: refetchusers,
    isLoading: isLoadinusers,
  } = useQuery({
    queryKey: [
      "dashboard-users",
      selectedStatus,
      currentPage,
      search,
      appliedFilters,
    ],
    queryFn: () =>
      getDashboardUsers(
        selectedStatus === "All Sellers" ? "" : selectedStatus.toUpperCase(),
        currentPage,
        search,
        appliedFilters
      ),
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
    refetchusers();
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    closeDropDown("filterBox");
    refetchusers();
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

  const status = () => {
    switch (userAction) {
      case "DEACTIVATE":
        return "DEACTIVATED";

        break;

      case "SUSPEND":
        return "SUSPENDED";

        break;

      case "UNSUSPEND":
      case "ACTIVATE":
        return "ACTIVE";
      default:
        return "ACTIVE";

        break;
    }
  };
  const actionTitle =
    userAction &&
    userAction?.charAt(0)?.toUpperCase() + userAction?.slice(1)?.toLowerCase();
  const handleUpdateUserStatus = async () => {
    setLoading(true);
    const statusUpdate = status();

    try {
      const response =
        userAction === "DELETE"
          ? await deleteAdminUser(userId as string)
          : await updateUserStatus(userId as string, statusUpdate);
      if (response) {
        toast.success(response?.message);
        dispatch(setUserAction(null));
        refetchusers();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyUser = async () => {
    setLoading(true);

    try {
      const response = await verifyUser(userId as string);

      if (response) {
        toast.success(response?.message);
        dispatch(setUserAction(null));
        refetchusers();
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
              Sellers
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

        <div className="lg:w-[45%] w-full bg-[#00A63E0D] p-1.5 mt-5  rounded-xl flex items-center gap-x-3">
          {sellersStatus.map((item) => (
            <button
              onClick={() => setSelectedStatus(item)}
              className={clsx(
                "w-[98px] h-[40px] text-sm cursor-pointer rounded-xl  font-medium",
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
          <div className="w-full flex justify-between lg:items-center items-start gap-3 flex-col sm:flex-row">
            <span className="text-[16px] font-semibold text-primary-300">
              {selectedStatus}{" "}
              <span className="text-[#117D06]">
                ({users?.data?.total || 0})
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
                filterOptions={filterOptions.users}
                applyFilter={handleApplyFilters}
                clearFilters={clearFilters}
                addFilter={addFilter}
                removeFilter={removeFilter}
                handleFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {users?.data?.data?.length > 0 ? (
            <div className="w-full mt-2 custom-scrollbar-gray overflow-x-auto">
              <TableComponent
                DATA={users?.data?.data}
                // @ts-ignore
                COLUMNS={SellerColumn}
                setSorting={setSorting}
                sorting={sorting}
              />
            </div>
          ) : isLoading || isLoadinusers ? (
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
                alt="No users"
                className="w-28 h-28 mb-4 opacity-70"
              />
              <h3 className="text-gray-700 text-base font-semibold">
                No users Available
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Check back later or explore other categories.
              </p>
            </motion.div>
          )}
          {users?.data?.data?.length > 0 && (
            <div className="w-full mt-5 flex items-center justify-center">
              <div className="flex items-center gap-x-4">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage(() =>
                      Math.max(1, users?.data?.meta?.page - 1)
                    )
                  }
                  disabled={users?.meta?.page === 1}
                  className={`border border-[#E5E7EF] rounded-xl min-w-[40px] px-4 min-h-[40px] hidden lg:flex items-center justify-center transition-all ${
                    users?.data?.meta?.page === 1
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
                    users?.data?.meta?.totalPages > 6
                      ? "max-w-[250px] sm:max-w-[300px] overflow-x-auto scrollbar-hide"
                      : ""
                  }`}
                >
                  {Array.from(
                    { length: users?.data?.meta?.totalPages || 0 },
                    (_, i) => i + 1
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`flex items-center justify-center min-w-[40px] h-[40px] rounded-xl border text-[13px] transition-all duration-300 ${
                        users?.data?.meta?.page === pageNum
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
                        users?.data?.meta?.totalPages,
                        users?.meta?.page + 1
                      )
                    )
                  }
                  disabled={
                    users?.data?.meta?.page === users?.data?.meta?.totalPages
                  }
                  className={`border border-[#E5E7EF] rounded-xl min-w-[40px] px-4 min-h-[40px] hidden lg:flex items-center justify-center transition-all ${
                    users?.data?.meta?.page === users?.data?.meta?.totalPages
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
          show={userAction !== null}
          onClose={() => dispatch(setUserAction(null))}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {actionTitle} User?
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. Do you want to permanently{" "}
              {actionTitle?.toLowerCase()}
              this user?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => dispatch(setUserAction(null))}
              >
                Cancel
              </button>

              <Button
                title={`Yes, ${actionTitle}`}
                textStyle="text-sm font-medium text-white"
                btnStyles={`px-4 py-2 rounded-lg transition ${
                  userAction === "VERIFY"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                loaderSize={"w-1 h-1"}
                handleClick={
                  userAction === "VERIFY"
                    ? handleVerifyUser
                    : handleUpdateUserStatus
                }
                loading={loading}
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default SellerManagement;
