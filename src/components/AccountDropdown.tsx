import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { USER } from "../assets";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset, selectToken } from "../state/slices/authReducer";
import { ChevronDown } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

export default function AccountDropdown({ user }: any) {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const isLoggedIn = !!user && !!token;

  const userOptions = [
    { name: "My Account", path: "/dashboard?tab=my_account" },
    { name: "My Products", path: "/dashboard?tab=my_products" },
    { name: "Store Settings", path: "/dashboard?tab=store_settings" },
    { name: "Customer Reviews", path: "/dashboard?tab=customer_reviews" },
  ];

  const adminOptions = [
    { name: "Overview", path: "/admin/overview" },
    { name: "Seller Management", path: "/admin/seller-management" },
    { name: "Products Management", path: "/admin/products-management" },
    { name: "Banners", path: "/admin/banners" },
    { name: "Settings", path: "/admin/settings" },
  ];

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(reset());
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <div className="relative">
      {/* Account button */}
      <button
        onClick={handleClick}
        className="lg:flex hidden items-center gap-x-2 cursor-pointer focus:outline-none"
      >
        <img
          src={user?.image_url || USER}
          className="w-[28px] h-[28px] rounded-full object-cover border border-gray-200"
          alt="User icon"
        />
        <span className="text-faded-black text-[16px] font-medium">
          {isLoggedIn ? user.user_name?.split(" ")[0] : "Account"}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      <button
        onClick={handleClick}
        className="h-[40px] w-[40px] rounded-lg bg-[#F7F7F7] lg:hidden flex items-center justify-center"
      >
        <img src={USER} alt="" />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 p-2"
          >
            {isLoggedIn ? (
              // Logged-in Dropdown Options
              <div className="flex flex-col">
                <div className="px-3 py-2 border-b border-gray-100 flex flex-col mb-1 select-none">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {user.user_name?.split(" ")[0]}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {user.email}
                  </span>
                </div>
                <ul className="flex flex-col gap-y-0.5">
                  {(user.role === "ADMIN" ? adminOptions : userOptions).map((option) => (
                    <li key={option.name}>
                      <button
                        onClick={() => {
                          setOpen(false);
                          navigate(option.path);
                        }}
                        className="w-full text-left px-3 py-2 text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {option.name}
                      </button>
                    </li>
                  ))}
                  <div className="h-px bg-gray-100 my-1"></div>
                  <li>
                    <button
                      onClick={() => {
                        setOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-3 py-2 text-[14px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              // Logged-out Dropdown Options
              <div className="flex flex-col gap-2 p-1">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/register");
                  }}
                  className="w-full text-center py-2 px-3 text-[14px] font-semibold text-white bg-global-green hover:bg-global-green/90 rounded-lg transition-colors"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="w-full text-center py-2 px-3 text-[14px] font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-borderColor rounded-lg transition-colors"
                >
                  Login
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Log Out Confirmation Modal */}
      <Modal show={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Log Out?
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Are you sure you want to log out of your account?
          </p>
          <div className="flex w-full gap-3">
            <button
              className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>
            <Button
              title="Yes, Log Out"
              textStyle="text-sm font-semibold text-white"
              btnStyles="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
              handleClick={handleLogout}
              loading={false}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

