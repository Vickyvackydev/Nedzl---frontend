import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import SEO from "../components/SEO";
import { useQuery } from "@tanstack/react-query";
import { ProductType } from "../types";
import FoodCheckoutModal from "../components/FoodCheckoutModal";
import { formatText } from "../utils";
import { getAllProducts } from "../services/product.service";

export default function Meals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedMeal, setSelectedMeal] = useState<ProductType | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "prepared-food"
  );

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (catVal: string) => {
    setSelectedCategory(catVal);
    setSearchParams({ category: catVal });
  };

  const handleMealCardClick = (meal: ProductType) => {
    setSelectedMeal(meal);
    setIsCheckoutOpen(true);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["meals-products", selectedCategory],
    queryFn: () =>
      getAllProducts({ category_name: selectedCategory, product_type: "FOOD" }),
  });

  const products: ProductType[] = data?.data || [];

  return (
    <MainLayout>
      <SEO
        title="Nedzl Meals - Order Prepared Food & Fast Campus Delivery"
        description="Browse delicious meals from verified local vendors, select sub-menu extras, and order fast delivery directly to your doorstep."
      />
      <div className="w-full bg-[#F5F5F5] min-h-screen py-8 px-4 md:px-20 flex flex-col gap-y-6">
        {/* Banner Section */}
        <div className="w-full bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl p-6 md:p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="flex flex-col gap-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
              🍲 Nedzl Meals & Foodstuffs
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold">
              Craving Fresh, Hot Meals & Grocery Delivery?
            </h1>
            <p className="text-sm md:text-base opacity-90">
              Order from your favorite vendors on campus. Customize your meal with extras, pay online safely, and track your delivery!
            </p>
          </div>
          <div className="text-6xl md:text-8xl mt-4 md:mt-0">🍛</div>
        </div>

        {/* Category Pills */}
        <div className="w-full flex items-center gap-3 overflow-x-auto py-2 custom-scrollbar-gray select-none">
          {[
            { label: "Prepared Food", value: "prepared-food" },
            { label: "Foodstuffs", value: "foodstuffs" },
            { label: "Fruits & Vegetables", value: "fruits-vegetables" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-global-green text-white shadow-md shadow-emerald-600/30 scale-102"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-t-global-green border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="w-full bg-white rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-y-3 shadow-sm">
            <span className="text-5xl">🍲</span>
            <h3 className="text-xl font-bold text-gray-800">
              No Meals Listed Yet in {formatText(selectedCategory)}
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Are you a food vendor? Log in to your vendor dashboard to list your meals, add delivery fees, and start receiving orders!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((meal) => {
              const images = Array.isArray(meal.image_urls) ? meal.image_urls : [];
              const imageUrl =
                typeof images[0] === "string"
                  ? images[0]
                  : "https://nedzl.com/placeholder.png";

              return (
                <div
                  key={meal.id}
                  onClick={() => handleMealCardClick(meal)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={meal.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {meal.delivery_fee ? (
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                          🛵 Delivery: ₦{meal.delivery_fee.toLocaleString()}
                        </span>
                      ) : (
                        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                          Free Delivery
                        </span>
                      )}
                      <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded">
                        Click for Details & Order
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          👤 {meal.user?.user_name || "Vendor"}
                        </span>
                        {meal.user?.phone_number && (
                          <span className="text-xs text-gray-500">
                            📞 {meal.user.phone_number}
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-gray-900 text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {meal.product_name}
                      </h3>
                      <p
                        className="text-xs text-gray-500 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: meal.description }}
                      />
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between mt-3">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                        Price
                      </span>
                      <span className="text-lg font-extrabold text-global-green">
                        ₦{meal.product_price?.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMealCardClick(meal);
                      }}
                      className="bg-global-green hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span>Order Now</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Food Checkout Modal */}
        <FoodCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          meal={selectedMeal}
        />
      </div>
    </MainLayout>
  );
}
