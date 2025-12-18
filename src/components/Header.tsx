// import React from "react";
import { BAR, HELP, NEDZL_LOGO_GREEN, NIGERIA_FLAG } from "../assets";

import { Link, useLocation } from "react-router-dom";
import AccountDropdown from "./AccountDropdown";
import SearchBar from "./SearchBar";
// import { useMediaQuery } from "../hooks";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/auth.service";
import { useSidebar } from "../context/SidebarContext";
import { Store } from "../state/store";

function Header() {
  // const mobile = useMediaQuery("(max-width: 640px)");
  const { toggleSidebar } = useSidebar();
  const location = useLocation();
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
          {location.pathname === "/dashboard" && (
            <button
              onClick={toggleSidebar}
              className="h-[40px] w-[40px] rounded-lg bg-[#F7F7F7] flex items-center justify-center"
            >
              <img src={BAR} alt="" />
            </button>
          )}
          <AccountDropdown user={user} />
          <button className="h-[40px] w-[40px] rounded-lg bg-[#F7F7F7] flex items-center justify-center">
            <img src={HELP} alt="" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-x-2 w-full md:w-auto justify-center">
        {/* <div className="w-[403px] flex items-center gap-3  justify-start  p-2 rounded-xl border shadow-input border-[#E9EAEB] ">
          <img src={SEARCH_INPUT} alt="" />
          <input
            type="text"
            placeholder="Search for a products, brands & categories"
            className="w-full placeholder:text-primary-50 text-sm outline-none text-primary-300"
          />
        </div> */}
        <SearchBar />
        {/* <Button
          title={"Search"}
          handleClick={() => {}}
          btnStyles={"w-fit bg-global-green rounded-xl px-4 py-2"}
          textStyle={"text-white text-[16px] font-medium"}
        /> */}
      </div>
      <div className="lg:flex items-center gap-5 w-full md:w-auto justify-between md:justify-end hidden">
        <div className="flex items-center gap-x-3">
          <img src={NIGERIA_FLAG} className="w-[30px] h-[30px]" alt="" />
          <span className="text-faded-black text-[16px] font-medium">
            Nigeria
          </span>
        </div>
        {/* <button className="h-[40px] w-[40px] rounded-lg bg-[#F7F7F7] flex items-center justify-center">
            <img src={USER} alt="" />
          </button> */}

        <AccountDropdown user={user} />
        <div className="flex items-center gap-x-3">
          <img src={HELP} className="w-[25px] h-[25px]" alt="" />
          <span className="text-faded-black text-[16px] font-medium">Help</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
