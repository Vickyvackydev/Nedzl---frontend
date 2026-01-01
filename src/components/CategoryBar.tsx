import { categories } from "../constant";
import { Link } from "react-router-dom";
import CategoriesOverlay from "./CategoriesOverlay";

const CategoryBar = () => {
  return (
    <div className="bg-global-green px-4 md:px-20 py-4 w-full flex flex-row items-center justify-between gap-y-4 md:gap-y-0">
      <CategoriesOverlay />
      <div className="flex items-center gap-2 overflow-x-auto w-full md:contents no-scrollbar">
        {categories.slice(0, 6).map((li) => (
          <Link
            key={li.value}
            to={`/products?category=${li.value}`}
            className="w-fit p-3 text-white text-sm font-medium whitespace-nowrap"
          >
            {li.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
