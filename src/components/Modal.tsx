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
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Center modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
