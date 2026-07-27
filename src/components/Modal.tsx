import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type SuccessModalProps = {
  show: boolean;
  message?: string;
  onClose?: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<SuccessModalProps> = ({
  show,

  onClose,
  children,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            style={{ WebkitBackdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Center modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            <div className="pointer-events-auto max-h-full flex flex-col justify-center my-auto w-full max-w-lg">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
