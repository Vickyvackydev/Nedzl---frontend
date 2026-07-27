import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import SEO from "../components/SEO";
import { useQuery } from "@tanstack/react-query";
import { ProductType } from "../types";
import FoodCheckoutModal from "../components/FoodCheckoutModal";
import { formatText } from "../utils";
import { getAllProducts } from "../services/product.service";
import { Store } from "../state/store";
import toast from "react-hot-toast";

export default function Meals() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMeal, setSelectedMeal] = useState<ProductType | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("prepared-food");

  const { data, isLoading } = useQuery({
    queryKey: ["meals-products", selectedCategory],
    queryFn: () => getAllProducts({ category_name: selectedCategory, product_type: "FOOD" }),
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
        <div className="w-full flex items-center gap-3 overflow-x-auto py-2 custom-scrollbar-gray">
          {[
            { label: "All Prepared Food", value: "prepared-food" },
            { label: "Foodstuffs", value: "foodstuffs" },
            { label: "Fruits & Vegetables", value: "fruits-vegetables" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? "bg-global-green text-white shadow-md"
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
              const imageUrl = typeof images[0] === "string" ? images[0] : "https://nedzl.com/placeholder.png";

              return (
                <div
                  key={meal.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={meal.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {meal.delivery_fee ? (
                        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                          🛵 Delivery: ₦{meal.delivery_fee.toLocaleString()}
                        </span>
                      ) : (
                        <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                          Free Delivery
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {meal.user?.user_name || "Vendor"}
                        </span>
                        {meal.user?.phone_number && (
                          <span className="text-xs text-gray-500">
                            📞 {meal.user.phone_number}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                        {meal.product_name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: meal.description }} />
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between mt-3">
                    <div>
                      <span className="text-xs text-gray-400 block">Price</span>
                      <span className="text-lg font-extrabold text-global-green">
                        ₦{meal.product_price?.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const token = Store.getState().auths.token;
                        if (!token) {
                          toast.error("Please login or create an account to order meals");
                          navigate("/login", { state: { from: location.pathname + location.search } });
                          return;
                        }
                        setSelectedMeal(meal);
                        setIsCheckoutOpen(true);
                      }}
                      className="bg-global-green hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
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
