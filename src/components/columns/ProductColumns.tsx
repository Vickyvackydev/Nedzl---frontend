import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { EYE, OPTIONS_VERTICAL, TAG, TRASH } from "../../assets";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import clsx from "clsx";
import { formatText } from "../../utils";
import {
  setProductAction,
  setProductDetails,
  setProductImages,
} from "../../state/slices/globalReducer";

export const columnHelper = createColumnHelper<any>();

export const statusStyles: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  UNDER_REVIEW: {
    bg: "bg-[#F59E0B1A]",
    text: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
  },
  REJECTED: {
    bg: "bg-[#EF44441A]",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
  ONGOING: {
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
                dispatch(setProductDetails(row.row.original));
              }}
            >
              <img src={EYE} alt="eye" className="w-[20px] h-[20px]" />
              View Details
            </button>
            {row.row.original.status !== "CLOSED" && (
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#00AD200D] gap-2"
                onClick={() => {
                  dispatch(setProductAction("CLOSE"));
                  dispatch(setProductDetails(row.row.original));
                }}
              >
                <img src={TAG} alt="eye" className="w-[20px] h-[20px]" />
                Close Product
              </button>
            )}
            {row.row.original.status === "CLOSED" && (
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#00AD200D] gap-2"
                onClick={() => {
                  dispatch(setProductAction("OPEN"));
                  dispatch(setProductDetails(row.row.original));
                }}
              >
                <img src={TAG} alt="eye" className="w-[20px] h-[20px]" />
                Re-Open Product
              </button>
            )}

            <button
              onClick={() => {
                dispatch(setProductAction("DELETE"));
                dispatch(setProductDetails(row.row.original));
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

export const ProductsColumn = [
  columnHelper.accessor("Product Name", {
    header() {
      return (
        <div className="flex items-center gap-x-2">
          {/* <div className="w-[20px] h-[20px] rounded-md border border-borderColor" /> */}
          <span className="text-sm font-medium text-[#4D4D4D]">
            Product Name
          </span>
        </div>
      );
    },
    cell(row) {
      return (
        <div className="flex items-center gap-x-2">
          {/* <div className="w-[20px] h-[20px] rounded-md border border-borderColor" /> */}
          {/* <img src={ASSET_ICON} className="w-[32px] h-[32px]" alt="" /> */}
          <span className="text-sm font-medium text-[#4D4D4D]">
            {row.row.original.product_name}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor("product_price", {
    header: "Product Price",
    cell(row) {
      return (
        <span className="text-sm text-[#4D4D4D]">
          ₦{" "}
          {row.row.original.product_price
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
  columnHelper.accessor("category", {
    header: "Category",
    cell(row) {
      return (
        <span className="text-sm text-[#4D4D4D]">
          {formatText(row.row.original.category_name) || "-"}
        </span>
      );
    },
  }),
  columnHelper.accessor("product_description", {
    header: "Product Description",
    cell(row) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: `${row.row.original?.description?.slice(0, 30)}...`,
          }}
        />
      );
    },
  }),

  columnHelper.accessor("outstanding_issues", {
    header: "Outstanding Issues",
    cell(row) {
      return (
        <span className="text-sm text-[#4D4D4D]">
          {/* {moment(row.row.original.created_at).format("MMM D, YYYY h:mm A")} */}
          {row.row.original.outstanding_issues || "-"}
        </span>
      );
    },
  }),

  columnHelper.accessor("photos", {
    header: "Photos",
    cell: (row) => {
      return <ViewAction row={row} />;
    },
  }),
  columnHelper.accessor("date", {
    header: "Date Listed",
    cell(row) {
      return (
        <span className="text-sm text-[#4D4D4D]">
          {moment(row.row.original.created_at).format("MMM D, YYYY h:mm A")}
        </span>
      );
    },
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell(row) {
      const ui =
        statusStyles[row.row.original.status] ?? statusStyles["UNDER_REVIEW"];
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
            {row.row.original.status.replace(/_/g, " ")?.toLowerCase() ===
            "ongoing"
              ? "Active"
              : row.row.original.status
                  .replace(/_/g, " ")
                  ?.charAt(0)
                  .toUpperCase() +
                row.row.original.status
                  .replace(/_/g, " ")
                  ?.slice(1)
                  .toLowerCase()}
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

const ViewAction = ({ row }: { row: { row: { original: any } } }) => {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => {
        dispatch(setProductImages(row.row.original.image_urls));
      }}
      className=" h-[24px] w-[47px] text-[#FAFAFA] rounded-lg bg-global-green text-xs"
    >
      View
    </button>
  );
};
