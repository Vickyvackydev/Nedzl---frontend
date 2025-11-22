import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AVATAR,
  DEACTIVATE,
  EYE,
  LIST_PRODUCT,
  NIGERIA_FLAG,
  OPTIONS_VERTICAL,
  SUSPEND,
  TRASH,
} from "../../assets";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import clsx from "clsx";

import { setUserAction, setUserId } from "../../state/slices/globalReducer";

export const columnHelper = createColumnHelper<any>();

export const statusStyles: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  DEACTIVATED: {
    bg: "bg-[#F59E0B1A]",
    text: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
  },
  SUSPENDED: {
    bg: "bg-[#EF44441A]",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
  ACTIVE: {
    bg: "bg-[#07B4631A]",
    text: "text-[#07B463]",
    dot: "bg-[#07B463]",
  },
  CLOSED: {
    bg: "bg-[#8B5CF61A]",
    text: "text-[#8B5CF6]",
    dot: "bg-[#8B5CF6]",
  },
};

const ActionButton = ({ row }: { row: { row: { original: any } } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const optionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionRef.current &&
        !optionRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-position logic: flips dropdown up/down dynamically
  useEffect(() => {
    if (isOpen && buttonRef.current && optionRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const container = buttonRef.current.closest(".custom-scrollbar-gray");
      const containerRect = container?.getBoundingClientRect();

      const dropdownHeight = optionRef.current.offsetHeight; // measured dynamically
      const spaceBelow = containerRect
        ? containerRect.bottom - buttonRect.bottom
        : window.innerHeight - buttonRect.bottom;
      const spaceAbove = containerRect
        ? buttonRect.top - containerRect.top
        : buttonRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        <img src={OPTIONS_VERTICAL} alt="options" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={optionRef}
            id={`dropdown-${row.row?.original.id}`}
            role="menu"
            aria-label="Actions"
            initial={{ opacity: 0, y: position === "top" ? -8 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === "top" ? -8 : 8 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-44 bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none ${
              position === "top" ? "bottom-full mb-2" : "top-full mt-2"
            } right-0`}
          >
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#00AD200D] gap-2"
              onClick={() => {
                navigate(`/admin/users/${row.row.original.user?.id}`);
              }}
            >
              <img src={EYE} alt="eye" className="w-[20px] h-[20px]" />
              View Details
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#00AD200D] gap-2"
              onClick={() => {
                navigate(`/admin/users/${row.row.original.user?.id}`);
              }}
            >
              <img src={LIST_PRODUCT} alt="eye" className="w-[20px] h-[20px]" />
              List Products
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#00AD200D] gap-2"
              onClick={() => {
                dispatch(
                  setUserAction(
                    row.row.original.user?.status === "SUSPENDED"
                      ? "UNSUSPEND"
                      : "SUSPEND"
                  )
                );
                dispatch(setUserId(row.row.original.user?.id));
              }}
            >
              <img src={SUSPEND} alt="eye" className="w-[20px] h-[20px]" />
              {row.row.original.user?.status === "SUSPENDED"
                ? "Unsuspended User"
                : "Suspend User"}
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#00AD200D] gap-2"
              onClick={() => {
                dispatch(
                  setUserAction(
                    row.row.original.user?.status === "DEACTIVATED"
                      ? "ACTIVATE"
                      : "DEACTIVATE"
                  )
                );
                dispatch(setUserId(row.row.original.user?.id));
              }}
            >
              <img src={DEACTIVATE} alt="eye" className="w-[20px] h-[20px]" />
              {row.row.original.user?.status === "DEACTIVATED"
                ? "Reactivate User"
                : "Deactivate User"}
            </button>

            <button
              onClick={() => {
                dispatch(setUserId(row.row.original.user?.id));
                dispatch(setUserAction("DELETE"));
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 gap-2 rounded-b-lg"
            >
              <img src={TRASH} className="w-[20px] h-[20px]" alt="" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SellerColumn = [
  columnHelper.accessor("Product Name", {
    header() {
      return (
        <div className="flex items-center gap-x-2">
          {/* <div className="w-[20px] h-[20px] rounded-md border border-borderColor" /> */}
          <span className="text-sm font-medium text-[#4D4D4D]">Name</span>
        </div>
      );
    },
    cell(row) {
      return (
        <div className="flex items-center gap-x-2">
          {/* <div className="w-[20px] h-[20px] rounded-md border border-borderColor" /> */}
          <img
            src={row.row.original.user?.image_url || AVATAR}
            className="min-w-[32px] max-w-[32px] h-[32px] rounded-full object-cover"
            alt=""
          />
          <span className="text-sm font-medium text-[#4D4D4D]">
            {row.row.original.user?.user_name}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor("email", {
    header: "Email Address",
    cell(row) {
      return (
        <span className="text-sm font-medium text-[#4D4D4D]">
          {row.row.original.user?.email}
        </span>
      );
    },
  }),

  // columnHelper.accessor("division",
  //   header: "Division",
  //   cell(row) {
  //     return (
  //       <span className="text-sm text-[#4D4D4D]">
  //         {row.row.original.division}
  //       </span>
  //     );
  //   },
  // }),
  columnHelper.accessor("phone_number", {
    header: "Phone Number",
    cell(row) {
      return (
        <div className="flex items-center gap-x-2">
          {/* <div className="w-[20px] h-[20px] rounded-md border border-borderColor" /> */}
          <img src={NIGERIA_FLAG} className="w-[25px] h-[25px]" alt="" />
          <span className="text-sm font-medium text-[#4D4D4D]">
            {row.row.original.user?.phone_number}
          </span>
        </div>
      );
    },
  }),
  columnHelper.accessor("Location", {
    header: "Location",
    cell(row) {
      return (
        <span className="text-sm font-medium text-[#4D4D4D]">
          {row.row.original.user?.location}
        </span>
      );
    },
  }),

  columnHelper.accessor("date", {
    header: "Registered Date",
    cell(row) {
      return (
        <span className="text-sm text-[#4D4D4D]">
          {moment(row.row.original.user?.created_at).format(
            "MMM D, YYYY h:mm A"
          )}
        </span>
      );
    },
  }),
  columnHelper.accessor("listed_products", {
    header: "Listed Products",
    cell(row) {
      return (
        <span className="text-sm text-[#4D4D4D]">
          {row.row.original.listed_products}
        </span>
      );
    },
  }),
  columnHelper.accessor("sold_products", {
    header: "Sold Products",
    cell(row) {
      return (
        <span className="text-sm text-[#4D4D4D]">
          {row.row.original.sold_products}
        </span>
      );
    },
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell(row) {
      const ui =
        statusStyles[row.row.original.user?.status] ?? statusStyles["ACTIVE"];
      return (
        <div
          className={clsx(
            "w-fit flex items-center gap-x-1 justify-center px-3 py-1.5 rounded-md",
            ui.bg
          )}
        >
          <div
            className={clsx("min-w-[5px] min-h-[5px] rounded-full", ui.dot)}
          />

          <span className={clsx("text-xs font-medium", ui.text)}>
            {row.row.original.user?.status?.replace(/_/g, " ")?.toLowerCase()}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor("action", {
    header: "Action",
    cell(row) {
      return <ActionButton row={row} />;
    },
  }),
];
