import React from "react";
import { EMPTY_PLACEHOLDER, PLUS_WHITE } from "../assets";

function EmptyState({
  message,
  handleClick,
  mainMessage,
  buttonText,
  create = true,
}: {
  message: React.JSX.Element;
  handleClick?: () => void;
  buttonText: string;
  mainMessage: string;
  create?: boolean;
}) {
  return (
    <div className="w-full p-5 h-[70vh] flex items-center justify-center flex-col gap-y-3">
      <div className="flex flex-col items-center">
        <img
          src={EMPTY_PLACEHOLDER}
          className="w-[126.5px] h-[126.5px] object-contain"
          alt=""
        />
        <span className="text-xl font-bold text-[#22282F] -mt-3">
          {mainMessage}
        </span>
      </div>
      <span className="text-sm font-medium text-center text-[#72777A]">
        {message}
      </span>
      {create && (
        <button
          onClick={handleClick}
          className="flex items-center px-3 py-2 rounded-xl transition-all hover:scale-95 duration-300 shadow-md gap-x-1 bg-[#2545D3] text-white"
        >
          <img src={PLUS_WHITE} className="w-[20px] h-[20px]" alt="" />
          <span className="text-sm font-normal">{buttonText}</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;
