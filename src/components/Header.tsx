import { useState } from "react";
import { BAR, NEDZL_LOGO_GREEN } from "../assets";

import { Link, useLocation, useNavigate } from "react-router-dom";
import AccountDropdown from "./AccountDropdown";
import SearchBar from "./SearchBar";
// import { useMediaQuery } from "../hooks";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/auth.service";
import { useSidebar } from "../context/SidebarContext";
import { Store } from "../state/store";
import GuestProductListingModal from "./GuestProductListingModal";

function Header() {
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isOrderServicesOpen, setIsOrderServicesOpen] = useState(false);
  // const mobile = useMediaQuery("(max-width: 640px)");
  const { toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    data: userProfile,
    // isLoading,
    // refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
    enabled: !!Store.getState().auths.token,
  });
  const user = userProfile?.data?.user;
  const isLoggedIn = !!Store.getState().auths.token || !!user;

  const handlePostProductClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      setIsGuestModalOpen(true);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-20 gap-y-4 md:gap-y-0">
      <div className="lg:w-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Link to={"/"}>
            <img
              src={NEDZL_LOGO_GREEN}
              className="w-[100px] sm:w-[130px] h-[30px] sm:h-[33.41px] object-contain"
              alt="Nedzl Logo"
            />
          </Link>
        </div>
        <div className="lg:hidden flex items-center gap-x-1.5 sm:gap-x-2">
          <button
            onClick={handlePostProductClick}
            className="bg-gradient-to-r from-[#FF9900] to-[#FF5500] hover:from-[#FF5500] hover:to-[#D44400] text-white font-black text-[11px] sm:text-xs px-2.5 sm:px-3 py-2 rounded-xl transition-all shadow-md shadow-orange-500/30 flex items-center gap-1 flex-shrink-0 cursor-pointer active:scale-95 border border-orange-400/40 tracking-wider"
          >
            <span className="text-xs sm:text-sm font-extrabold leading-none">
              +
            </span>
            <span>Post</span>
          </button>

          <AccountDropdown user={user} />

          {/* Order / Services Button on Mobile */}
          <div className="relative">
            <button
              onClick={() => setIsOrderServicesOpen((prev) => !prev)}
              className="flex items-center gap-x-1 py-1.5 px-2.5 rounded-xl transition-colors border border-emerald-200 bg-emerald-50 text-global-green text-[11px] sm:text-xs font-bold shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Order/Services</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className={`w-3.5 h-3.5 text-global-green transition-transform duration-200 ${
                  isOrderServicesOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {isOrderServicesOpen && (
              <div
                className="absolute right-0 top-full pt-1.5 w-56 z-50 transition-all"
                onClick={() => setIsOrderServicesOpen(false)}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-2">
                  <Link
                    to="/meals"
                    className="flex items-center gap-x-3 px-3.5 py-2.5 hover:bg-emerald-50 text-gray-700 hover:text-global-green text-xs font-medium transition-colors"
                  >
                    <span className="text-lg">🍲</span>
                    <div>
                      <p className="font-bold text-gray-800">
                        Order your First Meal
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Nedzl Food & Fast Delivery
                      </p>
                    </div>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    to="/services"
                    className="flex items-center gap-x-3 px-3.5 py-2.5 hover:bg-emerald-50 text-gray-700 hover:text-global-green text-xs font-medium transition-colors"
                  >
                    <span className="text-lg">🛠️</span>
                    <div>
                      <p className="font-bold text-gray-800">Order a Service</p>
                      <p className="text-[10px] text-gray-500">
                        Book Qualified Artisans
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {location.pathname === "/dashboard" && (
            <button
              onClick={toggleSidebar}
              className="h-[36px] w-[36px] rounded-lg bg-[#F7F7F7] flex items-center justify-center"
            >
              <img src={BAR} alt="" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-x-2 w-full md:w-auto justify-center">
        <SearchBar />
      </div>
      <div className="lg:flex items-center gap-5 w-full md:w-auto justify-between md:justify-end hidden">
        <button
          onClick={handlePostProductClick}
          className="flex items-center gap-x-1.5 bg-gradient-to-r from-[#FF9900] to-[#FF5500] hover:from-[#FF5500] hover:to-[#D44400] text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-md shadow-orange-500/30 hover:shadow-orange-500/50 flex-shrink-0 cursor-pointer active:scale-95"
        >
          <span>+ Post a Product</span>
        </button>

        <AccountDropdown user={user} />
        <div className="relative group cursor-pointer py-2">
          <div className="flex items-center gap-x-2 py-1 px-3 rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200 bg-emerald-50/40">
            <span className="text-faded-black text-[15px] font-bold text-global-green">
              Order / Services
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4 text-global-green transition-transform duration-200 group-hover:rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
          <div className="absolute right-0 top-full pt-1 w-60 hidden group-hover:block z-50 transition-all">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
              <Link
                to="/meals"
                className="flex items-center gap-x-3 px-4 py-3 hover:bg-emerald-50 text-gray-700 hover:text-global-green text-sm font-medium transition-colors"
              >
                <span className="text-xl">🍲</span>
                <div>
                  <p className="font-bold text-gray-800">
                    Order your First Meal
                  </p>
                  <p className="text-xs text-gray-500">
                    Nedzl Food & Fast Delivery
                  </p>
                </div>
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <Link
                to="/services"
                className="flex items-center gap-x-3 px-4 py-3 hover:bg-emerald-50 text-gray-700 hover:text-global-green text-sm font-medium transition-colors"
              >
                <span className="text-xl">🛠️</span>
                <div>
                  <p className="font-bold text-gray-800">Order a Service</p>
                  <p className="text-xs text-gray-500">
                    Book Qualified Artisans
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <GuestProductListingModal
        show={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
      />
    </div>
  );
}

export default Header;
