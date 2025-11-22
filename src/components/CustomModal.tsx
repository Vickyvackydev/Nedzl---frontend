import React from "react";
import { motion } from "framer-motion";
import { TIMES } from "../assets";

function CustomModal({
  open,
  close,
  width,
  modalTitle,
  children,
  modalTitle2,
}: {
  open: boolean;
  close: () => void;
  modalTitle: string;
  width: string;
  modalTitle2?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className={`w-full h-full fixed ${
          open ? "block" : "hidden"
        } top-0 left-0 bg-black/30 flex items-center justify-center z-50 geist-family`}
      >
        {open && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${width} bg-white rounded-xl opacity-100 shadow-xl right-6 z-50`}
          >
            <div className="w-full bg-[#F0FEF8] border rounded-t-xl px-5 py-3 border-[#E9EAEB] flex items-center justify-between">
              <span className="text-[16px] font-semibold text-primary-300">
                {modalTitle}{" "}
                <span className="text-[#2545D3]">{modalTitle2}</span>
              </span>
              <button
                onClick={close}
                className="w-[30px] cursor-pointer h-[30px] rounded-full hover:bg-white flex items-center justify-center"
              >
                <img src={TIMES} className="w-[20px] h-[20px]" alt="" />
              </button>
            </div>
            {children}
          </motion.div>
        )}
      </div>
    </>
  );
}

export default CustomModal;
