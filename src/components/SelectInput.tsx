import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Options {
  label: string;
  value: string;
}
interface SelectInputProps {
  label: string;
  required?: boolean;
  options?: Options[];
  placeholder?: string;
  isInput?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  setValue?: (str: string) => void;
}

const SelectInput = ({
  label,
  required = false,
  options = [],
  placeholder = "Please select",
  isInput = false,
  onChange,
  value,
  setValue,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    setValue?.(val);
    setIsOpen(false);
    onChange?.(val);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue?.(val);
    onChange?.(val);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Label */}
      <label className="block text-sm font-normal text-primary-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Conditional Rendering */}
      {isInput ? (
        // Input Field
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInput}
          className="w-full border border-borderColor rounded-xl p-3 text-sm shadow-input-v2 outline-none placeholder-[#808080]"
        />
      ) : (
        // Dropdown Field
        <>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-between w-full border border-borderColor shadow-input-v2 rounded-lg p-3 text-left text-sm 
            `}
          >
            <span className={value ? "text-gray-900" : "text-gray-400"}>
              {value || placeholder}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="mt-1 border border-gray-200 max-h-64 overflow-y-auto  custom-scrollbar-grey absolute w-full rounded-lg shadow-lg bg-white overflow-hidden z-50"
              >
                {options.length > 0 ? (
                  options.map((opt) => (
                    <li
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                        value === opt.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-gray-500">
                    No options
                  </li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default memo(SelectInput);
