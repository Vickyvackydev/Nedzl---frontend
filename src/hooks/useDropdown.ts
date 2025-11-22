import { useEffect, useRef, useState } from "react";

function useDropdown() {
  const dropdownRef = {
    about: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    neutral: useRef<HTMLDivElement>(null),
    filterBox: useRef<HTMLDivElement>(null),
  };

  const [dropdowns, setDropdowns] = useState({
    about: false,
    services: false,
    neutral: false,
    filterBox: false,
  });

  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      let outSide = true;

      Object.entries(dropdownRef).forEach(([_, value]) => {
        if (value.current?.contains(event.target as Node)) {
          outSide = false;
        }
      });

      if (outSide) {
        setDropdowns({
          about: false,
          services: false,
          neutral: false,
          filterBox: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  const closeDropDown = (dropdown: keyof typeof dropdowns) => {
    setDropdowns((prev) => ({ ...prev, [dropdown]: false }));
  };
  return { dropdownRef, dropdowns, setDropdowns, closeDropDown };
}

export default useDropdown;
