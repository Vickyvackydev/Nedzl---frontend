// import React from "react";
import { motion } from "framer-motion";

import ProductCard from "../components/ProductCard";
import { EMPTY_CART, GRAY_PLAY } from "../assets";
import { ProductType } from "../types";

interface ProductSectionProps {
  title: string;
  data: any[];
  loading?: boolean;
  onSeeAll?: () => void;
}

export default function ProductSection({
  title,
  data,
  loading = false,
  onSeeAll,
}: ProductSectionProps) {
  return (
    <div className="w-full bg-[#F7F7F7] h-full py-7 px-20 flex flex-col gap-y-5">
      {/* Header */}
      <div className="w-full flex items-start justify-between">
        <div className="flex items-center gap-x-2">
          <div className="w-[5px] h-[27px] bg-global-green rounded-3xl" />
          <span className="text-xl font-semibold text-[#313133]">{title}</span>
        </div>
        <button onClick={onSeeAll} className="flex items-center gap-x-2">
          <span className="text-[#555555] text-[16px] font-semibold">
            See all
          </span>
          <img src={GRAY_PLAY} className="w-[10px] h-[10px] mt-0.5" alt="" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="w-full grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="w-full grid grid-cols-5 gap-3">
          {data.map((item: ProductType, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ProductCard item={item} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200"
        >
          <img
            src={EMPTY_CART}
            alt="No Products"
            className="w-28 h-28 mb-4 opacity-70"
          />
          <h3 className="text-gray-700 text-base font-semibold">
            No Products Available
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Check back later or explore other categories.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm animate-pulse p-3 flex flex-col gap-y-2">
      <div className="w-full h-[180px] bg-gray-200 rounded-lg" />
      <div className="w-3/4 h-4 bg-gray-200 rounded" />
      <div className="w-1/2 h-4 bg-gray-200 rounded" />
      <div className="w-2/3 h-3 bg-gray-200 rounded" />
      <div className="flex gap-2 mt-2">
        <div className="w-20 h-6 bg-gray-200 rounded-full" />
        <div className="w-16 h-6 bg-gray-200 rounded-full" />
      </div>
      <div className="w-24 h-6 bg-gray-200 rounded-full" />
    </div>
  );
}
