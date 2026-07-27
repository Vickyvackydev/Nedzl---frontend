import { useState } from "react";
import { BAR, HELP, NEDZL_LOGO_GREEN } from "../assets";

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
              className="w-[130px] h-[33.41px] object-contain"
              alt=""
            />
          </Link>
        </div>
        <div className="lg:hidden flex items-center gap-x-2">
          <AccountDropdown user={user} />
          <button
            onClick={() => navigate("/faqs")}
            className="h-[40px] w-[40px] rounded-lg bg-[#F7F7F7] flex items-center justify-center"
          >
            <img src={HELP} alt="" />
          </button>
          {location.pathname === "/dashboard" && (
            <button
              onClick={toggleSidebar}
              className="h-[40px] w-[40px] rounded-lg bg-[#F7F7F7] flex items-center justify-center"
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
          className="flex items-center gap-x-1.5 bg-global-green hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-emerald-500/20 flex-shrink-0 cursor-pointer"
        >
          <span>+ Post a Product</span>
        </button>

        <AccountDropdown user={user} />
        <div className="relative group cursor-pointer py-2">
          <div className="flex items-center gap-x-2 py-1 px-3 rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200 bg-emerald-50/40">
            <span className="text-faded-black text-[15px] font-bold text-global-green">Order / Services</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-global-green transition-transform duration-200 group-hover:rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
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
                  <p className="font-bold text-gray-800">Order your First Meal</p>
                  <p className="text-xs text-gray-500">Nedzl Food & Fast Delivery</p>
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
                  <p className="text-xs text-gray-500">Book Qualified Artisans</p>
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
