// import React, { useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { reset } from "../state/slices/authReducer";
import { useMediaQuery } from "../hooks";
import {
  LOG_OUT,
  NEDZL_LOGO_GREEN,
  OVERVIEW_BLACK,
  OVERVIEW_WHITE,
  PRODUCT_BLACK,
  PRODUCT_WHITE,
  SELLERS_BLACK,
  SELLERS_WHITE,
  SETTINGS_BLACK,
  SETTINGS_WHITE,
} from "../assets";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  setOpen: any;
}
function AdminSidebar(props: SidebarProps) {
  // const { onClose } = props;
  // const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const isMobileView = useMediaQuery("(max-width: 640px)");
  const isTabletView = useMediaQuery("(max-width: 840px)");

  const location = useLocation();
  const { pathname } = location;
  // const navigate = useNavigate();

  const activeAdminRoute =
    pathname === "/admin/overview" || pathname.includes("/admin/users");
  return (
    <>
      {isMobileView || isTabletView ? (
        <Transition
          as="div"
          className="fixed z-50 h-full w-80 flex-none bg-brand-light lg:static"
          enter="transition-all ease-in duration-300"
          enterFrom="transform -translate-x-full"
          enterTo="transform -translate-x-0"
          leave="transition-all ease-out duration-300"
          leaveFrom="transform -translate-x-0"
          leaveTo="transform -translate-x-full"
          show={props.open}
        >
          {/* mobile screen section */}

          <div className="w-[290px] geist-family shadow-sm h-screen border border-borderColor bg-[#F6F6F6] flex flex-col items-start justify-between">
            <div className="flex items-start px-3 mt-10 flex-col gap-y-11 w-full">
              <img
                src={NEDZL_LOGO_GREEN}
                className="w-[130px] h-[30.2px] object-cover"
                alt=""
              />
              <div className="flex flex-col w-full gap-y-4">
                <Link
                  to="/admin/overview"
                  // onClick={() => dispatch(setGlobalAudioFileName(""))}
                  className={`flex items-center gap-x-3  ${
                    activeAdminRoute && "bg-global-green shadow-md"
                  } cursor-pointer w-full p-3 rounded-lg `}
                >
                  <img
                    src={activeAdminRoute ? OVERVIEW_WHITE : OVERVIEW_BLACK}
                    className="w-[20px] h-[20px]"
                    alt=""
                  />
                  <span
                    className={`text-sm font-medium  ${
                      activeAdminRoute && "text-white"
                    }`}
                  >
                    Overview
                  </span>
                </Link>

                <Link
                  to="/admin/seller-management"
                  // onClick={() => dispatch(setGlobalAudioFileName(""))}
                  className={`flex items-center gap-x-3 geist-font rounded-lg cursor-pointer  ${
                    pathname.includes("/admin/seller-management") &&
                    "bg-global-green shadow-md"
                  } w-full p-3 rounded-lg `}
                >
                  <img
                    src={
                      pathname.includes("/admin/seller-management")
                        ? SELLERS_WHITE
                        : SELLERS_BLACK
                    }
                    className="w-[20px] h-[20px]"
                    alt=""
                  />
                  <span
                    className={`text-sm font-medium ${
                      pathname.includes("/admin/seller-management") &&
                      "text-white"
                    }`}
                  >
                    Seller Management
                  </span>
                </Link>
                <Link
                  to="/admin/products-management"
                  // onClick={() => dispatch(setGlobalAudioFileName(""))}
                  className={`flex items-center gap-x-3 rounded-lg cursor-pointer  ${
                    pathname.includes("/admin/products-management") &&
                    "bg-global-green shadow-md"
                  } w-full p-3 rounded-lg `}
                >
                  <img
                    src={
                      pathname.includes("/admin/products-management")
                        ? PRODUCT_WHITE
                        : PRODUCT_BLACK
                    }
                    className="w-[20px] h-[20px]"
                    alt=""
                  />
                  <span
                    className={`text-sm font-medium text-nowrap ${
                      pathname.includes("/admin/products-management") &&
                      "text-white"
                    }`}
                  >
                    Products Management
                  </span>
                </Link>
              </div>
            </div>
            <div className="w-full px-3">
              <Link
                to="/admin/settings"
                className={`flex items-center gap-x-3 cursor-pointer  ${
                  pathname === "/admin/settings" && "bg-global-green shadow-md"
                } w-full p-3 rounded-lg `}
              >
                <img
                  src={
                    pathname !== "/admin/settings"
                      ? SETTINGS_BLACK
                      : SETTINGS_WHITE
                  }
                  className="w-[20px] h-[20px]"
                  alt=""
                />
                <span
                  className={`text-sm font-medium  ${
                    pathname === "/admin/settings" && "text-white"
                  }`}
                >
                  Settings
                </span>
              </Link>
              <Link
                to="/login"
                onClick={() => dispatch(reset())}
                className={`flex items-center rounded-lg gap-x-3 cursor-pointer w-full p-3`}
              >
                <img src={LOG_OUT} className="w-[20px] h-[20px]" alt="" />
                <span className={`text-sm font-medium`}>Log out</span>
              </Link>
            </div>
          </div>
        </Transition>
      ) : (
        <div className="min-w-[250px] geist-family shadow-sm h-screen border border-borderColor bg-[#F6F6F6] flex flex-col items-start justify-between">
          <div className="flex items-start px-3 mt-10 flex-col gap-y-11 w-full">
            <Link to={"/"}>
              <img
                src={NEDZL_LOGO_GREEN}
                className="w-[130px] h-[30.2px] object-cover"
                alt=""
              />
            </Link>
            <div className="flex flex-col w-full gap-y-4">
              <Link
                to="/admin/overview"
                // onClick={() => dispatch(setGlobalAudioFileName(""))}
                className={`flex items-center gap-x-3  ${
                  activeAdminRoute && "bg-global-green shadow-md"
                } cursor-pointer w-full p-3 rounded-lg `}
              >
                <img
                  src={activeAdminRoute ? OVERVIEW_WHITE : OVERVIEW_BLACK}
                  className="w-[20px] h-[20px]"
                  alt=""
                />
                <span
                  className={`text-sm font-medium  ${
                    activeAdminRoute && "text-white"
                  }`}
                >
                  Overview
                </span>
              </Link>

              <Link
                to="/admin/seller-management"
                // onClick={() => dispatch(setGlobalAudioFileName(""))}
                className={`flex items-center gap-x-3 geist-font rounded-lg cursor-pointer  ${
                  pathname.includes("/admin/seller-management") &&
                  "bg-global-green shadow-md"
                } w-full p-3 rounded-lg `}
              >
                <img
                  src={
                    pathname.includes("/admin/seller-management")
                      ? SELLERS_WHITE
                      : SELLERS_BLACK
                  }
                  className="w-[20px] h-[20px]"
                  alt=""
                />
                <span
                  className={`text-sm font-medium ${
                    pathname.includes("/admin/seller-management") &&
                    "text-white"
                  }`}
                >
                  Seller Management
                </span>
              </Link>
              <Link
                to="/admin/products-management"
                // onClick={() => dispatch(setGlobalAudioFileName(""))}
                className={`flex items-center gap-x-3 rounded-lg cursor-pointer  ${
                  pathname.includes("/admin/products-management") &&
                  "bg-global-green shadow-md"
                } w-full p-3 rounded-lg `}
              >
                <img
                  src={
                    pathname.includes("/admin/products-management")
                      ? PRODUCT_WHITE
                      : PRODUCT_BLACK
                  }
                  className="w-[20px] h-[20px]"
                  alt=""
                />
                <span
                  className={`text-sm font-medium text-nowrap ${
                    pathname.includes("/admin/products-management") &&
                    "text-white"
                  }`}
                >
                  Products Management
                </span>
              </Link>
            </div>
          </div>
          <div className="w-full px-3">
            <Link
              to="/admin/settings"
              className={`flex items-center gap-x-3 cursor-pointer  ${
                pathname === "/admin/settings" && "bg-global-green shadow-md"
              } w-full p-3 rounded-lg `}
            >
              <img
                src={
                  pathname !== "/admin/settings"
                    ? SETTINGS_BLACK
                    : SETTINGS_WHITE
                }
                className="w-[20px] h-[20px]"
                alt=""
              />
              <span
                className={`text-sm font-medium  ${
                  pathname === "/admin/settings" && "text-white"
                }`}
              >
                Settings
              </span>
            </Link>
            <Link
              to="/login"
              onClick={() => dispatch(reset())}
              className={`flex items-center rounded-lg gap-x-3 cursor-pointer w-full p-3`}
            >
              <img src={LOG_OUT} className="w-[20px] h-[20px]" alt="" />
              <span className={`text-sm font-medium`}>Log out</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
