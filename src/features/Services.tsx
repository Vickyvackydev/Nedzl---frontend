import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import SEO from "../components/SEO";
import { useQuery } from "@tanstack/react-query";
import { ProductType } from "../types";
import BookingCheckoutModal from "../components/BookingCheckoutModal";
import { getAllProducts } from "../services/product.service";
import { Store } from "../state/store";
import toast from "react-hot-toast";

export default function Services() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedService, setSelectedService] = useState<ProductType | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("ALL");

  const serviceCategories = [
    "ALL",
    "Plumbing",
    "Nail Tech",
    "Tailoring & Fashion",
    "Electrical Repair",
    "Hair Styling",
    "Carpentry",
    "Cleaning & Laundry",
    "Other Services",
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["services-products", selectedServiceType],
    queryFn: () =>
      getAllProducts({
        category_name: "other-services",
        product_type: "SERVICE",
        service_type: selectedServiceType === "ALL" ? undefined : selectedServiceType,
      }),
  });

  const services: ProductType[] = (data?.data || []).filter((item: ProductType) => {
    if (selectedServiceType === "ALL") return true;
    if (!item.service_type) return false;
    return item.service_type.toLowerCase() === selectedServiceType.toLowerCase();
  });

  return (
    <MainLayout>
      <SEO
        title="Nedzl Artisan Services & Escrow Bookings"
        description="Book verified artisans, plumbers, tailors, nail tech, and professional service providers with guaranteed 100% Escrow Protection."
      />
      <div className="w-full bg-[#F5F5F5] min-h-screen py-8 px-4 md:px-20 flex flex-col gap-y-6">
        {/* Banner Section */}
        <div className="w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 rounded-2xl p-6 md:p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="flex flex-col gap-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
              🛠️ Nedzl Artisan & Skill Bookings
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold">
              Need a Qualified Artisan or Professional Service?
            </h1>
            <p className="text-sm md:text-base opacity-90">
              Book plumbers, nail technicians, tailors, electricians & more. Pay securely into Escrow—funds are only released when you confirm service completion!
            </p>
          </div>
          <div className="text-6xl md:text-8xl mt-4 md:mt-0">🧰</div>
        </div>

        {/* Skill Badges */}
        <div className="w-full flex items-center gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-semibold select-none">
          {serviceCategories.map((skill, idx) => {
            const isSelected = selectedServiceType === skill;
            return (
              <button
                key={idx}
                onClick={() => setSelectedServiceType(skill)}
                className={`px-4 py-2 rounded-full shadow-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white font-bold ring-2 ring-blue-600/30 shadow-blue-500/20 scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span>{skill === "ALL" ? "🌐" : "✨"}</span>
                <span>{skill}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-t-indigo-600 border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="w-full bg-white rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-y-3 shadow-sm">
            <span className="text-5xl">🛠️</span>
            <h3 className="text-xl font-bold text-gray-800">
              No Artisan Services Listed Yet
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Are you an artisan or service provider? Log in to your dashboard to post your skills, pictures, and rates to start receiving escrow bookings!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => {
              const images = Array.isArray(service.image_urls) ? service.image_urls : [];
              const imageUrl = typeof images[0] === "string" ? images[0] : "https://nedzl.com/placeholder.png";

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={service.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <span>🛡️</span> Escrow Protected
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          👤 {service.user?.user_name || "Artisan"}
                        </span>
                        {service.user?.phone_number && (
                          <span className="text-xs text-gray-500">
                            📞 {service.user.phone_number}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                        {service.product_name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: service.description }} />
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between mt-3">
                    <div>
                      <span className="text-xs text-gray-400 block">Booking Rate</span>
                      <span className="text-lg font-extrabold text-blue-600">
                        ₦{service.product_price?.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const token = Store.getState().auths.token;
                        if (!token) {
                          toast.error("Please login or create an account to book services");
                          navigate("/login", { state: { from: location.pathname + location.search } });
                          return;
                        }
                        setSelectedService(service);
                        setIsBookingModalOpen(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>Book Service</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Checkout Modal */}
        <BookingCheckoutModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          service={selectedService}
        />
      </div>
    </MainLayout>
  );
}
