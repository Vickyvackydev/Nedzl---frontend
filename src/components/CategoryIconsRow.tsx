import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutGrid,
  Laptop,
  BookOpen,
  Shirt,
  Home,
  WashingMachine,

  MoreHorizontal,
  ChevronRight,
  Tv,
  Sofa,
  Utensils,
  Gem,
  Car,
  Sparkles,
  PawPrint,
  Briefcase,
  Baby,
  Gamepad2,
  FileText,
  BriefcaseBusiness,
  Wheat,
} from "lucide-react";
import { categories } from "../constant";
import { getProductCategoryCounts } from "../services/product.service";

export default function CategoryIconsRow() {
  const [open, setOpen] = useState(false);

  const { data: categorizedProductCount } = useQuery({
    queryKey: ["category-count"],
    queryFn: getProductCategoryCounts,
  });

  const categoriesWithCount = useMemo(() => {
    if (!categorizedProductCount)
      return categories.map((cat) => ({ ...cat, count: 0 }));

    return categories.map((cat) => {
      const match = categorizedProductCount?.results?.find(
        (item: { category: string; total: number }) =>
          item.category === cat.value,
      );

      return { ...cat, count: match ? match.total : 0 };
    });
  }, [categorizedProductCount]);

  const iconMap: Record<string, any> = {
    electricals: Tv,
    "home-appliances": WashingMachine,
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
    gadgets: Laptop,
    electronics: Laptop,
    "leisure-activities": Gamepad2,
    "seeking-work-cvs": FileText,
    property: Home,
    jobs: BriefcaseBusiness,
    "food-agriculture-farming": Wheat,
    others: MoreHorizontal,
  };

  const rowItems: Array<{
    label: string;
    icon: any;
    link?: string;
    action?: () => void;
  }> = [
      {
        label: "All Categories",
        icon: LayoutGrid,
        action: () => setOpen(true),
      },
      ...categories.map((cat) => ({
        label: cat.label,
        icon: iconMap[cat.value] || MoreHorizontal,
        link: `/products?category=${cat.value}`,
      })),
    ];

  return (
    <div className="w-full flex items-center justify-start overflow-x-auto gap-x-4 md:gap-x-6 py-6 px-1 no-scrollbar select-none md:gap-x-8">
      {rowItems.map((item, idx) => {
        const IconComponent = item.icon;
        const content = (
          <div className="flex flex-col items-center group cursor-pointer flex-shrink-0 w-[78px] md:w-24">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#F4F4F5] border border-gray-100 flex items-center justify-center transition-all duration-300 group-hover:bg-[#E8F8EE] group-hover:border-global-green/30 group-hover:scale-105 group-hover:shadow-sm">
              <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-gray-700 group-hover:text-global-green transition-colors" />
            </div>
            <span className="text-[11px] md:text-xs font-semibold text-gray-700 group-hover:text-global-green transition-colors text-center whitespace-nowrap mt-2.5 truncate max-w-full">
              {item.label}
            </span>
          </div>
        );

        if (item.action) {
          return (
            <button key={idx} onClick={item.action} className="focus:outline-none">
              {content}
            </button>
          );
        }

        return (
          <Link key={idx} to={item.link || "/"}>
            {content}
          </Link>
        );
      })}

      {/* Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed left-4 top-4 bottom-4 w-[320px] max-w-[85vw] bg-white rounded-2xl shadow-xl p-5 overflow-y-auto z-[10000]"
            >
              <h2 className="text-lg text-nowrap font-bold mb-4 text-gray-800">
                All Categories
              </h2>

              <div className="space-y-2">
                {categoriesWithCount.map((cat) => {
                  const Icon = iconMap[cat.value] || Tv;
                  return (
                    <Link
                      key={cat.value}
                      to={`/products?category=${cat.value}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between bg-gray-50 hover:bg-[#E8F8EE] transition-colors p-3 rounded-xl cursor-pointer group"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-x-3">
                          <div className="bg-[#E8F8EE] group-hover:bg-global-green/20 p-2 rounded-lg transition-colors">
                            <Icon className="w-5 h-5 text-global-green" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 group-hover:text-global-green transition-colors">
                              {cat.label}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {cat.count
                                ?.toString()
                                ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ||
                                0}{" "}
                              Ads
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-global-green transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
