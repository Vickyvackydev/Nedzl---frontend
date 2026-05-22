import { useState, useEffect } from "react";
import { API } from "../config";
import { useQuery } from "@tanstack/react-query";

interface Banner {
  id: string;
  image_url: string;
  target_url: string;
}

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: bannersResponse, isLoading } = useQuery({
    queryKey: ["public-banners"],
    queryFn: async () => {
      const response = await API.get("/banners");
      return response.data;
    },
  });

  const banners: Banner[] = bannersResponse?.data || [];

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading || banners.length === 0) {
    return null; // Return nothing or a skeleton if empty/loading
  }

  // const currentBanner = banners[currentIndex];

  return (
    <div className="w-full relative overflow-hidden bg-gray-100 rounded-xl mb-5">
      <div
        className="w-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.target_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex-shrink-0 cursor-pointer block"
            style={{
              height: "min(300px, 30vw)", // Keep proportional height
              minHeight: "150px",
            }}
          >
            <img
              src={banner.image_url}
              alt="Promo Banner"
              className="w-full h-full object-cover object-center"
            />
          </a>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
