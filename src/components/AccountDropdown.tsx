import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { USER } from "../assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../state/slices/authReducer";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/auth.service";

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    data: userProfile,
    // isLoading,
    refetch,
  } = useQuery({ queryKey: ["profile"], queryFn: getUserProfile });

  const user = userProfile?.data?.user;
  const handleClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative">
      {/* Account button */}
      <button
        onClick={handleClick}
        className="flex items-center gap-x-3 cursor-pointer focus:outline-none"
      >
        <img
          src={user?.image_url || USER}
          className="w-[28px] h-[28px] rounded-full object-cover border border-gray-200"
          alt="User icon"
        />
        <span className="text-faded-black text-[16px] font-medium">
          {user ? user.name?.split(" ")[0] : "Account"}
        </span>
      </button>

      {/* Dropdown menu (only when no user is logged in) */}
      <AnimatePresence>
        {!user && open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            <ul className="flex flex-col">
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/register");
                  }}
                  className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {open && !user && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </div>
  );
}
