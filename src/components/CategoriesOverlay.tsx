import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Tv,
  Sofa,
  Utensils,
  BookOpen,
  Shirt,
  Gem,
  Car,
  Sparkles,
  PawPrint,
  Briefcase,
  Baby,
  Gamepad2,
  FileText,
  Home,
  BriefcaseBusiness,
  Wheat,
  ChevronRight,
} from "lucide-react";
import { categories } from "../constant";
import { BAR_WHITE } from "../assets";
import { useQuery } from "@tanstack/react-query";
import { getProductCategoryCounts } from "../services/product.service";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, any> = {
  "electrical-home-appliances": Tv,
  furniture: Sofa,
  kitchenware: Utensils,
  books: BookOpen,
  "clothing-apparel": Shirt,
  jewelry: Gem,
  vehicles: Car,
  "beauty-personal-care": Sparkles,
  "animals-pets": PawPrint,
  "commercial-equipment": Briefcase,
  "babies-kids": Baby,
  "leisure-activities": Gamepad2,
  "seeking-work-cvs": FileText,
  property: Home,
  jobs: BriefcaseBusiness,
  "food-agriculture-farming": Wheat,
};

export default function CategoriesOverlay() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: categorizedProductCount,
    // isLoading,
    // refetch,
  } = useQuery({
    queryKey: ["category-count"],
    queryFn: getProductCategoryCounts,
  });

  const categoriesWithCount = useMemo(() => {
    if (!categorizedProductCount)
      return categories.map((cat) => ({ ...cat, count: 0 }));

    return categories.map((cat) => {
      const match = categorizedProductCount?.results?.find(
        (item: { category: string; total: number }) =>
          item.category === cat.value
      );

      return { ...cat, count: match ? match.total : 0 };
    });
  }, [categories, categorizedProductCount]);

  return (
    <>
      {/* All Categories Button */}
      <div
        onClick={() => setOpen(true)}
        className="w-fit px-7 border cursor-pointer border-white rounded-xl p-2 flex items-center gap-x-2"
      >
        <img src={BAR_WHITE} className="w-[24px] h-[24px]" alt="" />
        <span className="text-sm font-medium text-white">All categories</span>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Dim background */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Categories Drawer */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed left-4 top-4 bottom-4 w-[320px] bg-white rounded-2xl shadow-xl p-5 z-50 overflow-y-auto"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                All Categories
              </h2>

              <div className="space-y-2">
                {categoriesWithCount.map((cat) => {
                  const Icon = iconMap[cat.value] || Tv;
                  return (
                    <motion.div
                      key={cat.value}
                      whileHover={{ scale: 1.02 }}
                      onClick={() =>
                        navigate(`/products?category=${cat.value}`)
                      }
                      className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors p-3 rounded-xl cursor-pointer"
                    >
                      <div className="flex items-center gap-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">
                            {cat.label}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {" "}
                            {cat.count
                              ?.toString()
                              ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}{" "}
                            Ads
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
