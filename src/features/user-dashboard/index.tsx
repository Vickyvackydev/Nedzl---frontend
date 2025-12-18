import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import clsx from "clsx";
import {
  ADS_BLACK,
  ADS_WHITE,
  ARROW_BACK,
  LOG_OUT_RED,
  REVIEW_BLACK,
  REVIEW_WHITE,
  REVIEWS_BLACK,
  REVIEWS_WHITE,
  SETTINGS_BLACK,
  SETTINGS_WHITE,
  // SINGLE_USER,
  SINGLE_USER_BLACK,
  SINGLE_USER_WHITE,
  STORE_SETTINGS_BLACK,
  STORE_SETTINGS_WHITE,
} from "../../assets";
import Account from "./components/Account";
import Products from "./components/Products";
import StoreSettings from "./components/StoreSettings";
// import InBox from "./components/InBox";
import CustomerReview from "./components/CustomerReview";
import MyReview from "./components/MyReview";
import Settings from "./components/Settings";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProductFields,
  setProductFields,
} from "../../state/slices/globalReducer";
import { reset } from "../../state/slices/authReducer";
import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import Button from "../../components/Button";

type TabTypes =
  | "my_account"
  | "my_products"
  | "store_settings"
  | "inbox"
  | "customer_reviews"
  | "my_reviews"
  | "settings";
const SideBarMenus = [
  {
    title: "My Account",
    active_icon: SINGLE_USER_WHITE,
    inactive_icon: SINGLE_USER_BLACK,
    component: <Account />,
  },
  {
    title: "My Products",
    active_icon: ADS_WHITE,
    inactive_icon: ADS_BLACK,
    component: <Products />,
  },
  {
    title: "Store Settings",
    active_icon: STORE_SETTINGS_WHITE,
    inactive_icon: STORE_SETTINGS_BLACK,
    component: <StoreSettings />,
  },
  // {
  //   title: "Inbox",
  //   active_icon: INBOX_WHITE,
  //   inactive_icon: INBOX_BLACK,
  //   component: <InBox />,
  // },
  {
    title: "Customer Reviews",
    active_icon: REVIEW_WHITE,
    inactive_icon: REVIEW_BLACK,
    component: <CustomerReview />,
  },
  {
    title: "My Reviews",
    active_icon: REVIEWS_WHITE,
    inactive_icon: REVIEWS_BLACK,
    component: <MyReview />,
  },
  {
    title: "Settings",
    active_icon: SETTINGS_WHITE,
    inactive_icon: SETTINGS_BLACK,
    component: <Settings />,
  },
];
import { useSidebar } from "../../context/SidebarContext";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabTypes>("my_account");
  const showProductFields = useSelector(selectProductFields);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  // converts "my_account" to "My Account"
  const formatText = (text: string) =>
    text.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    dispatch(setProductFields(false));
  }, []);

  const SidebarContent = () => (
    <>
      {SideBarMenus.map((item) => (
        <div
          key={item.title}
          onClick={() => {
            setActiveTab(
              item.title.split(" ").join("_").toLowerCase() as TabTypes
            );
            closeSidebar();
          }}
          className={clsx(
            "flex items-center cursor-pointer gap-x-2 text-sm font-medium px-4 py-3 rounded-xl w-full",
            activeTab === item.title.split(" ").join("_").toLowerCase()
              ? "bg-global-green text-white"
              : "bg-transparent text-primary-300"
          )}
        >
          <img
            src={
              activeTab === item.title.split(" ").join("_").toLowerCase()
                ? item.active_icon
                : item.inactive_icon
            }
            className="w-[20px] h-[20px]"
            alt=""
          />
          <span>{item.title}</span>
        </div>
      ))}
      <button
        onClick={() => {
          dispatch(reset());
          navigate("/");
          closeSidebar();
        }}
        className="w-full flex items-center gap-x-2 px-3"
      >
        <img src={LOG_OUT_RED} className="w-[20px] h-[20px]" alt="" />
        <span className="text-sm font-medium text-[#FF0000]">Log Out</span>
      </button>
    </>
  );

  return (
    <MainLayout>
      <div className="w-full flex flex-col md:flex-row items-start gap-4 shadow-box justify-between bg-[#F5F5F5] py-7 px-4 md:px-20 relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={clsx(
            "fixed inset-y-0 left-0 z-50 w-[70%] max-w-[300px] bg-white transform transition-transform duration-300 ease-in-out md:hidden flex flex-col p-4 gap-y-3 overflow-y-auto",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-full md:w-[25%] bg-white rounded-xl flex-col p-4 items-start gap-y-3">
          <SidebarContent />
        </div>
        <div className="w-full md:w-[75%] bg-white rounded-xl">
          <div className="w-full p-4 border-b border-[#E9EAEB]">
            {!showProductFields ? (
              <div className="w-full flex items-center justify-between">
                <span className="text-[16px] font-medium text-[#313133]">
                  {activeTab === "my_account"
                    ? "ACCOUNT OVERVIEW"
                    : formatText(activeTab)}
                </span>
                {activeTab === "my_products" && (
                  <button
                    onClick={() => dispatch(setProductFields(true))}
                    className="flex items-center gap-1.5 bg-[#00C853]/10 text-[#00C853] text-sm font-medium px-3 py-1.5 rounded-md hover:bg-[#00C853]/20 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Add Product
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <button
                  onClick={() => dispatch(setProductFields(false))}
                  className="w-[32px] border border-borderColor h-[32px] rounded-lg flex items-center justify-center"
                >
                  <img src={ARROW_BACK} className="w-[16px] h-[16px]" alt="" />
                </button>
                <span className="text-[16px] font-medium text-[#313133]">
                  Post a Product
                </span>
              </div>
            )}
          </div>
          <div className="w-full">
            {
              SideBarMenus.find(
                (item) =>
                  item.title.split(" ").join("_").toLowerCase() === activeTab
              )?.component
            }
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default UserDashboard;
