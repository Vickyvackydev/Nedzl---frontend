// import React from "react";
import { LOCATION } from "../assets";
import { useNavigate } from "react-router-dom";
import { ProductType } from "../types";
import clsx from "clsx";
import { formatPrice } from "../utils";

function ProductCard({ item }: { item: ProductType }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/product-details/${item.id}`)}
      className="w-full max-w-[250px] cursor-pointer h-full bg-white hover:scale-105 transition-all duration-300 shadow-box p-2 md:p-3 rounded-xl flex flex-col gap-y-1 md:gap-y-2 items-start"
    >
      <img
        src={item?.image_urls?.[0] as string}
        className="w-full h-[150px] md:h-[208px] object-cover rounded-xl"
        alt=""
      />
      <span className="text-faded-black text-xs md:text-sm font-medium line-clamp-1">
        {item?.product_name}
      </span>
      <span className="text-sm md:text-[16px] font-bold text-global-green">
        ₦{" "}
        {item?.product_price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </span>
      <div
        className="hidden md:block"
        dangerouslySetInnerHTML={{
          __html: `${item?.description?.slice(0, 25)}...`,
        }}
      />
      <div className="w-fit h-fit border border-[#E9EAEB] rounded-lg p-1 md:p-1.5 text-[10px] md:text-xs font-medium text-primary-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
        Market Price: {formatPrice(item?.market_price_from)} -{" "}
        {formatPrice(item?.market_price_to)}
      </div>
      <div className="flex flex-wrap gap-1">
        <div className="w-fit h-fit border border-[#E9EAEB] rounded-lg p-1 md:p-1.5 text-[10px] md:text-xs font-medium text-primary-300">
          {item?.is_negotiable ? "Negotiable" : "Fixed"}
        </div>
        <div
          className={clsx(
            "w-fit h-fit rounded-lg p-1 md:p-1.5 text-[10px] md:text-xs font-medium",
            item.condition === "brand-new"
              ? "text-global-green bg-[#07B4631A]"
              : "bg-[#B491071A] text-[#B49107]",
          )}
        >
          {item?.condition?.replace(/-/g, " ").toUpperCase()}
        </div>
      </div>
      <div className="flex items-center gap-x-1 md:gap-x-2 mt-auto">
        <img src={LOCATION} className="w-4 h-4 md:w-5 md:h-5" alt="" />
        <span className="text-faded-black text-[10px] md:text-sm">
          {(
            item?.state?.charAt(0).toUpperCase() + item?.state?.slice(1)
          ).replace(/-/g, " ")}
        </span>
      </div>
    </div>
  );
}

export default ProductCard;
