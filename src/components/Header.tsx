// import React from "react";
import { HELP, NEDZL_LOGO_GREEN, NIGERIA_FLAG } from "../assets";

import { Link } from "react-router-dom";
import AccountDropdown from "./AccountDropdown";
import SearchBar from "./SearchBar";

function Header() {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-20 gap-y-4 md:gap-y-0">
      <Link to={"/"}>
        <img
          src={NEDZL_LOGO_GREEN}
          className="w-[130px] h-[33.41px] object-contain"
          alt=""
        />
      </Link>
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
      <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-x-3">
          <img src={NIGERIA_FLAG} className="w-[30px] h-[30px]" alt="" />
          <span className="text-faded-black text-[16px] font-medium">
            Nigeria
          </span>
        </div>
        <AccountDropdown />
        <div className="flex items-center gap-x-3">
          <img src={HELP} className="w-[25px] h-[25px]" alt="" />
          <span className="text-faded-black text-[16px] font-medium">Help</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
