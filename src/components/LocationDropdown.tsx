import clsx from "clsx";
import { useState } from "react";
import { ARROW_DOWN } from "../assets";

export function LocationDropdown({
  selected,
  setSelected,
  placeholder,
  listing,
  type,
}: {
  selected: string;
  setSelected: (str: string) => void;
  placeholder: string;
  listing: { label: string; value: string }[];
  type: string;
}) {
  //   const [selectedState, setSelectedState] = useState("Anambra");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full rounded-xl shadow-box">
      {/* Header */}
      <div
        className={clsx(
          "w-full p-2.5  rounded-t-xl",
          type === "Location"
            ? "bg-global-green text-white"
            : "bg-transparent text-primary-300"
        )}
      >
        <span className="text-start font-semibold">{type}</span>
      </div>

      {/* Dropdown container */}
      <div className="w-full bg-white p-2.5 rounded-b-xl relative">
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="border p-2.5 border-[#E9EAEB] rounded-xl flex items-center justify-between w-full cursor-pointer"
        >
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-semibold text-primary-300">
              {placeholder}
            </span>
            {selected ? (
              <span className="w-fit h-fit p-1 text-xs text-primary-300 font-semibold rounded-3xl bg-[#F7F7F7] capitalize">
                {selected}
              </span>
            ) : (
              <span className="w-fit h-fit text-xs text-primary-300 font-semibold  capitalize">
                Select a state
              </span>
            )}
          </div>
          <img
            src={ARROW_DOWN}
            className={`w-[20px] h-[20px] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            alt=""
          />
        </div>

        {/* Dropdown list */}
        {isOpen && (
          <div className="absolute z-50 mt-4 w-full bg-white border left-0 border-[#E9EAEB] rounded-xl shadow-md max-h-60 overflow-y-auto">
            {listing.map((state) => (
              <div
                key={state.value}
                onClick={() => {
                  setSelected(state.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm text-primary-300 cursor-pointer hover:bg-[#F7F7F7] capitalize ${
                  selected === state.value
                    ? "bg-[#07B4631A] text-global-green font-semibold"
                    : ""
                }`}
              >
                {state.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
