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
      className="w-full cursor-pointer h-full bg-white hover:scale-105 transition-all duration-300 shadow-box p-3 rounded-xl flex flex-col gap-y-2 items-start"
    >
      <img
        src={item?.image_urls?.[0] as string}
        className="w-full h-[208px] object-cover rounded-xl"
        alt=""
      />
      <span className="text-faded-black text-sm ">{item?.product_name}</span>
      <span className="text-[16px] font-semibold text-global-green">
        ₦{" "}
        {item?.product_price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </span>
      <div
        dangerouslySetInnerHTML={{
          __html: `${item?.description?.slice(0, 30)}...`,
        }}
      />
      <div className="w-fit h-fit border border-[#E9EAEB] rounded-lg p-1.5 text-xs font-medium text-primary-300">
        Market Price: {formatPrice(item?.market_price_from)} -{" "}
        {formatPrice(item?.market_price_to)}
      </div>
      <div className="w-fit h-fit border border-[#E9EAEB] rounded-lg p-1.5 text-xs font-medium text-primary-300">
        {item?.is_negotiable ? "Negotiable" : "Not Negotiable"}
      </div>
      <div
        className={clsx(
          "w-fit h-fit   rounded-lg p-1.5 text-xs font-medium ",
          item.condition === "brand-new"
            ? "text-global-green bg-[#07B4631A]"
            : "bg-[#B491071A] text-[#B49107]"
        )}
      >
        {item?.condition?.replace(/-/g, " ").toUpperCase()}
      </div>
      <div className="flex items-center gap-x-2">
        <img src={LOCATION} className="w-[20px] h-[20px]" alt="" />
        <span className="text-faded-black text-sm">{item?.state}</span>
      </div>
    </div>
  );
}

export default ProductCard;
