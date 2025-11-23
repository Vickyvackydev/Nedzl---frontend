import { useEffect, useRef, useState } from "react";

import { Filter } from "../types";
import { ICON, PLUS_DARK, TRASH_ICON } from "../assets";
import Button from "./Button";

function FilterBox({
  open,
  filters,
  filterOptions,
  applyFilter,
  clearFilters,
  addFilter,
  removeFilter,
  handleFilterChange,
}: {
  open: boolean;
  filters: Filter[];
  handleFilterChange: (
    id: number | string,
    value: string | number | null
  ) => void;
  filterOptions: string[];
  applyFilter: () => void;
  clearFilters: () => void;
  addFilter: (str: string) => void;
  removeFilter: (id: string | number) => void;
}) {
  const [openOptions, setOpenOptions] = useState(false);

  const optionsRef = useRef(null);

  // Detect outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsRef.current &&
        !(optionsRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setOpenOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return open ? (
    <div className="lg:w-[530px] w-full z-50 absolute flex flex-col gap-y-3 h-fit top-10 lg:right-10 right-0 bg-white shadow-blur rounded-xl p-3">
      <span className="font-semibold text-sm text-primary-300">Filters</span>

      {filters.length > 0 ? (
        filters.map((item) => (
          <div
            key={item.id}
            className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-x-3"
          >
            {/* Field Label */}
            <div className="w-full py-2 px-3 rounded-xl border border-borderColor">
              <span className="text-sm font-medium text-primary-300">
                {item.field}
              </span>
            </div>

            {/* Icon */}
            <div className="min-w-[40px] min-h-[40px] rounded-xl border border-borderColor flex items-center justify-center flex-shrink-0">
              <img src={ICON} className="w-[20px] h-[20px]" alt="" />
            </div>

            <input
              type="text"
              value={item.value ?? ""}
              onChange={(e) =>
                handleFilterChange(
                  item.id,
                  item.field === "Status"
                    ? e.target.value.toUpperCase()
                    : e.target.value
                )
              }
              className="w-full p-2 text-sm rounded-xl border border-borderColor focus:border-deepBlue focus:shadow-custom shadow-box focus:outline-none"
            />

            {/* Delete Filter */}
            <button
              onClick={() => removeFilter(item.id)}
              className="flex-shrink-0 self-start sm:self-center"
            >
              <img src={TRASH_ICON} className="min-w-[20px] h-[20px]" alt="" />
            </button>
          </div>
        ))
      ) : (
        <div className="text-sm text-primary-300 text-center py-4">
          Add a filter
        </div>
      )}

      {/* Add Filter + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-3 sm:gap-0">
        {/* Add Filter */}
        <div className="relative" ref={optionsRef}>
          <Button
            title="Add a Filter"
            btnStyles="w-full sm:w-fit px-3 border border-[#E9EAEB] py-2 rounded-xl flex items-center justify-center sm:justify-start gap-x-1"
            icon={PLUS_DARK}
            textStyle="text-primary-300 font-medium text-xs"
            handleClick={() => setOpenOptions(true)}
          />

          {openOptions && (
            <div className="w-full sm:w-[200px] p-3 absolute bg-white rounded-xl flex flex-col shadow-box z-10">
              {filterOptions.map((option) => (
                <span
                  key={option}
                  className="p-1.5 text-sm font-medium cursor-pointer text-primary-300 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    addFilter(option); // Adds new input filter
                    setOpenOptions(false);
                  }}
                >
                  {option}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Apply + Clear */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2">
          <Button
            title="Clear Filters"
            btnStyles="w-full sm:w-fit px-3 bg-[#F5F5F5] py-2 rounded-xl"
            textStyle="text-primary-300 font-medium text-xs"
            handleClick={clearFilters}
          />
          <Button
            title="Apply Filters"
            btnStyles="w-full sm:w-fit px-3 bg-global-green py-2 rounded-xl"
            textStyle="text-white font-medium text-xs"
            handleClick={applyFilter}
          />
        </div>
      </div>
    </div>
  ) : null;
}

export default FilterBox;
