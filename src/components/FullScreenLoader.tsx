import { motion, AnimatePresence } from "framer-motion";

interface FullScreenLoaderProps {
  isLoading: boolean;
  progress: number; // between 0–100
  message: string;
}

export default function FullScreenLoader({
  isLoading,
  progress,
  message,
}: FullScreenLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/90 z-[9999] flex flex-col items-center justify-center"
        >
          {/* Spinning Circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-global-green border-gray-300 rounded-full mb-6"
          />

          {/* Progress Text */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {message} Product
            </h2>
            <p className="text-gray-600 text-sm mt-1">Please wait...</p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-3 bg-gray-200 rounded-full mt-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              className="h-full bg-global-green"
            />
          </div>

          {/* Numeric Counter */}
          <p className="mt-3 text-sm font-medium text-gray-700">{progress}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
