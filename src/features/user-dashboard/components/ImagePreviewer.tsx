import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface Props {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ImagePreviewer({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNext, onPrev, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt={`Image ${currentIndex}`}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="max-h-[90%] max-w-[90%] rounded-xl shadow-2xl"
        />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white bg-black/60 hover:bg-black/80 p-2 rounded-full"
        >
          <X size={24} />
        </button>

        {currentIndex > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-5 text-white bg-black/60 hover:bg-black/80 p-2 rounded-full"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {currentIndex < images.length - 1 && (
          <button
            onClick={onNext}
            className="absolute right-5 text-white bg-black/60 hover:bg-black/80 p-2 rounded-full"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
