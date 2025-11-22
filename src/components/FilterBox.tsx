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
  // const [openStatus, setOpenStatus] = useState(false);
  // const [openLocation, setOpenLocation] = useState(false);
  // const [selectedFilterOption, setSelectedFilterOption] = useState("");

  // const status = [
  //   { value: 0, title: "Active" },
  //   { value: 1, title: "In-active" },
  // ];

  // const [selectedStatusValue, setSelectedStatusValue] = useState<{
  //   value: number;
  //   title: string;
  // } | null>(null);

  // const [selectedLocation, setSelectedLocation] = useState<{
  //   id: number;
  //   title: string;
  // } | null>(null);

  const optionsRef = useRef(null);
  const statusRef = useRef(null);
  const locationRef = useRef(null);

  // Detect outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsRef.current &&
        !(optionsRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setOpenOptions(false);
      }

      if (
        statusRef.current &&
        !(statusRef.current as HTMLElement).contains(e.target as Node)
      ) {
        // setOpenStatus(false);
      }

      if (
        locationRef.current &&
        !(locationRef.current as HTMLElement).contains(e.target as Node)
      ) {
        // setOpenLocation(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const dateCategory =
  //   selectedFilterOption === "Start Date" ||
  //   selectedFilterOption === "End Date";

  return open ? (
    <div className="lg:w-[530px] w-full z-50 absolute flex flex-col gap-y-3 h-fit top-10 lg:right-10 right-0  bg-white shadow-blur rounded-xl p-3">
      <span className="font-semibold text-sm text-primary-300">Filters</span>

      {filters.length > 0 ? (
        filters.map((item) => (
          <div
            key={item.id}
            className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-x-3"
          >
            {/* Field label */}
            <div className="w-full py-2 px-3 rounded-xl border border-borderColor">
              <span className="text-sm font-medium text-primary-300">
                {item.field}
              </span>
            </div>

            {/* Icon */}
            <div className="min-w-[40px] min-h-[40px] rounded-xl border border-borderColor flex items-center justify-center flex-shrink-0">
              <img src={ICON} className="w-[20px] h-[20px]" alt="" />
            </div>

            {item.field === "Was Successful" ? (
              // ✅ Was Successful Dropdown
              <select
                onChange={(e) => handleFilterChange(item.id, e.target.value)}
                value={item.value ?? ""}
                className="w-full p-2 text-sm rounded-xl border border-borderColor focus:border-deepBlue focus:shadow-custom shadow-box focus:outline-none"
              >
                <option value="">Select Option</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            ) : item.field === "Attempted At" ? (
              // ✅ Attempted At Date Picker
              <input
                type="date"
                value={item.value ?? ""}
                onChange={(e) => handleFilterChange(item.id, e.target.value)}
                className="w-full p-2 text-sm rounded-xl border border-borderColor focus:border-deepBlue focus:shadow-custom shadow-box focus:outline-none"
              />
            ) : (
              // Default text input
              <input
                type="text"
                value={item.value ?? ""}
                onChange={(e) => handleFilterChange(item.id, e.target.value)}
                className="w-full p-2 text-sm rounded-xl border border-borderColor focus:border-deepBlue focus:shadow-custom shadow-box focus:outline-none"
              />
            )}

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
        <div className="relative" ref={optionsRef}>
          <Button
            title="Add a Filter"
            btnStyles="w-full sm:w-fit px-3 border border-[#E9EAEB] py-2 rounded-xl flex items-center justify-center sm:justify-start gap-x-1"
            icon={PLUS_DARK}
            textStyle="text-primary-300 font-medium text-xs"
            handleClick={() => {
              setOpenOptions(true);
              // setOpenStatus(false);
              // setOpenLocation(false);
            }}
          />
          {openOptions && (
            <div className="w-full sm:w-[200px] p-3 absolute bg-white rounded-xl flex flex-col shadow-box z-10">
              {filterOptions.map((option) => (
                <span
                  key={option}
                  className="p-1.5 text-sm font-medium cursor-pointer text-primary-300 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    addFilter(option); // this adds { id, field: option, value: "" }
                    setOpenOptions(false);
                  }}
                >
                  {option}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2">
          <Button
            title="Clear Filters"
            btnStyles="w-full sm:w-fit px-3 bg-[#F5F5F5] py-2 rounded-xl"
            textStyle="text-primary-300 font-medium text-xs"
            handleClick={clearFilters}
          />
          <Button
            title="Apply Filters"
            btnStyles="w-full sm:w-fit px-3 bg-super py-2 rounded-xl"
            textStyle="text-white font-medium text-xs"
            handleClick={applyFilter}
          />
        </div>
      </div>
    </div>
  ) : null;
}

export default FilterBox;
