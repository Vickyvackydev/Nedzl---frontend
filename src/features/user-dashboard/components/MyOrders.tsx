import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Store } from "../../../state/store";
import TableComponent from "../../../components/TableComponent";
import Modal from "../../../components/Modal";
import moment from "moment";
import toast from "react-hot-toast";
import {
  FiEye,
  FiShoppingBag,
  FiX,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import {
  getUserFoodOrders,
  getVendorFoodOrders,
  updateFoodOrderStatus,
} from "../../../services/foodOrders.service";

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState<"customer" | "vendor">("customer");
  const [sorting, setSorting] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const token = Store.getState().auths.token;

  const { data: customerOrdersData, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ["customer-food-orders"],
    queryFn: () => getUserFoodOrders(),
    enabled: !!token && activeTab === "customer",
  });

  const {
    data: vendorOrdersData,
    isLoading: isLoadingVendor,
    refetch: refetchVendor,
  } = useQuery({
    queryKey: ["vendor-food-orders"],
    queryFn: () => getVendorFoodOrders(),
    enabled: !!token && activeTab === "vendor",
  });

  const customerOrders = customerOrdersData?.data || [];
  const vendorOrders = vendorOrdersData?.data || [];

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateFoodOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      refetchVendor();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  const parseSubMenus = (raw: any) => {
    if (!raw) return [];
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const customerColumns: any = [
    {
      header: "Order #",
      accessorKey: "order_number",
      cell: (info: any) => (
        <span className="font-mono text-xs font-bold text-gray-800">
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Meal",
      accessorKey: "product.name",
      cell: (info: any) => (
        <span className="font-semibold text-gray-900">
          {info.getValue() || "Meal"}
        </span>
      ),
    },
    {
      header: "Vendor Contact",
      accessorKey: "vendor.phone_number",
      cell: (info: any) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold">
            {info.row.original?.vendor?.user_name}
          </span>
          <a
            href={`tel:${info.getValue()}`}
            className="text-global-green flex items-center gap-1 font-medium"
          >
            <FiPhone size={12} />
            <span>{info.getValue() || "N/A"}</span>
          </a>
        </div>
      ),
    },
    {
      header: "Total Paid",
      accessorKey: "total_amount",
      cell: (info: any) => (
        <span className="font-bold text-global-green">
          ₦{Number(info.getValue() || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => (
        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Details",
      cell: (info: any) => (
        <button
          onClick={() => {
            setSelectedOrder(info.row.original);
            setIsDetailsOpen(true);
          }}
          className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
        >
          <FiEye size={13} />
          <span>Details</span>
        </button>
      ),
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (info: any) => (
        <span className="text-xs text-gray-500">
          {moment(info.getValue()).format("MMM DD, YYYY")}
        </span>
      ),
    },
  ];

  const vendorColumns: any = [
    {
      header: "Order #",
      accessorKey: "order_number",
      cell: (info: any) => (
        <span className="font-mono text-xs font-bold text-gray-800">
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Meal",
      accessorKey: "product.name",
      cell: (info: any) => (
        <span className="font-semibold text-gray-900">
          {info.getValue() || "Meal"}
        </span>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customer_name",
      cell: (info: any) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold">{info.getValue()}</span>
          <a
            href={`tel:${info.row.original?.customer_phone}`}
            className="text-global-green flex items-center gap-1 font-medium"
          >
            <FiPhone size={12} />
            <span>{info.row.original?.customer_phone}</span>
          </a>
        </div>
      ),
    },
    {
      header: "Total Paid",
      accessorKey: "total_amount",
      cell: (info: any) => (
        <span className="font-semibold text-gray-700 text-xs">
          ₦{Number(info.getValue() || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Nedzl 10%",
      accessorKey: "platform_fee",
      cell: (info: any) => (
        <span className="text-xs font-medium text-red-600">
          -₦
          {Number(
            info.getValue() || info.row.original?.total_amount * 0.1 || 0,
          ).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Your Payout (90% + Delivery)",
      accessorKey: "vendor_payout",
      cell: (info: any) => (
        <span className="font-bold text-global-green text-xs">
          ₦{Number(info.getValue() || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => (
        <select
          value={info.getValue()}
          onChange={(e) =>
            handleUpdateStatus(info.row.original.id, e.target.value)
          }
          className="text-xs border rounded-lg px-2 py-1 bg-white font-semibold outline-none focus:border-global-green"
        >
          <option value="PAID">PAID</option>
          <option value="PREPARING">PREPARING</option>
          <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>
      ),
    },
    {
      header: "Details",
      cell: (info: any) => (
        <button
          onClick={() => {
            setSelectedOrder(info.row.original);
            setIsDetailsOpen(true);
          }}
          className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
        >
          <FiEye size={13} />
          <span>Details</span>
        </button>
      ),
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-y-4">
      {/* Tab Switcher */}
      <div className="w-full flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto custom-scrollbar-gray select-none">
        <button
          onClick={() => setActiveTab("customer")}
          className={`px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "customer"
              ? "bg-global-green text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FiShoppingBag size={15} />
          <span>Food Orders Placed</span>
        </button>
        <button
          onClick={() => setActiveTab("vendor")}
          className={`px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "vendor"
              ? "bg-global-green text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaUtensils size={14} />
          <span>Food Orders Received (Vendor)</span>
        </button>
      </div>

      {activeTab === "customer" ? (
        isLoadingCustomer ? (
          <div className="text-center py-8 text-sm text-gray-500">
            Loading orders...
          </div>
        ) : customerOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center gap-2">
            <span className="text-4xl">🍲</span>
            <p className="text-sm font-semibold text-gray-700">No Food Orders Placed Yet</p>
            <p className="text-xs text-gray-400">Order delicious food from local vendors on Nedzl!</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <TableComponent
                DATA={customerOrders}
                COLUMNS={customerColumns}
                sorting={sorting}
                setSorting={setSorting}
              />
            </div>

            {/* Mobile Card View */}
            <div className="flex flex-col gap-3.5 md:hidden">
              {customerOrders.map((order: any) => {
                const imageUrl =
                  order.product?.image_urls?.[0] ||
                  "https://nedzl.com/placeholder.png";

                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDetailsOpen(true);
                    }}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col gap-y-3 active:bg-gray-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <span className="font-mono text-xs font-bold text-gray-900">
                        #{order.order_number}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                        {order.status || "PAID"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={imageUrl}
                        alt={order.product?.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                          {order.product?.name || "Meal Order"}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-gray-500">
                            Vendor: {order.vendor?.user_name || "Food Vendor"}
                          </span>
                          <span className="text-sm font-extrabold text-global-green">
                            ₦{Number(order.total_amount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <span className="text-gray-400">
                        {moment(order.created_at).format("MMM DD, YYYY")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setIsDetailsOpen(true);
                        }}
                        className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 active:scale-95"
                      >
                        <FiEye size={13} />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )
      ) : isLoadingVendor ? (
        <div className="text-center py-8 text-sm text-gray-500">
          Loading vendor orders...
        </div>
      ) : vendorOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center gap-2">
          <span className="text-4xl">👨‍🍳</span>
          <p className="text-sm font-semibold text-gray-700">No Vendor Food Orders Received</p>
          <p className="text-xs text-gray-400">Orders placed for your food items will appear here.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <TableComponent
              DATA={vendorOrders}
              COLUMNS={vendorColumns}
              sorting={sorting}
              setSorting={setSorting}
            />
          </div>

          {/* Mobile Card View */}
          <div className="flex flex-col gap-3.5 md:hidden">
            {vendorOrders.map((order: any) => {
              const imageUrl =
                order.product?.image_urls?.[0] ||
                "https://nedzl.com/placeholder.png";

              return (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDetailsOpen(true);
                  }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col gap-y-3 active:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-gray-100 pb-2.5">
                    <span className="font-mono text-[11px] font-bold text-gray-900 truncate max-w-[150px]">
                      #{order.order_number}
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, e.target.value)
                        }
                        className="text-[10px] sm:text-xs border border-emerald-300 rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 bg-emerald-50 text-emerald-800 font-bold outline-none cursor-pointer max-w-[130px]"
                      >
                        <option value="PAID">PAID</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt={order.product?.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {order.product?.name || "Meal Order"}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Customer: {order.customer_name} ({order.customer_phone})
                      </p>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="text-gray-500">Payout:</span>
                        <span className="font-extrabold text-global-green">
                          ₦{Number(order.vendor_payout || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-400">
                      {moment(order.created_at).format("MMM DD, YYYY")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                        setIsDetailsOpen(true);
                      }}
                      className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 active:scale-95"
                    >
                      <FiEye size={13} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Detail Order Modal - Matching Screenshot Layout */}
      {selectedOrder && (
        <Modal show={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}>
          <div className="p-5 md:p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto custom-scrollbar-gray bg-white rounded-2xl flex flex-col gap-y-4 shadow-2xl geist-family">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-borderColor pb-3 pt-1">
              <h2 className="text-base font-semibold text-gray-900 mx-auto">
                Order Details
              </h2>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Order ID & Status Header */}
            <div className="flex items-center justify-between py-1">
              <div>
                <h3 className="text-base font-extrabold text-indigo-900 tracking-tight">
                  Order ID #{selectedOrder.order_number}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">
                  {moment(selectedOrder.created_at).format(
                    "ddd, DD MMM YYYY • h:mm a",
                  )}
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold">
                {selectedOrder.status || "Paid"}
              </span>
            </div>

            {/* Product Item Card */}
            <div className="flex items-start gap-3 py-3 border-t border-b border-gray-100">
              <img
                src={
                  selectedOrder.product?.image_urls[0] ||
                  "/assets/empty-placeholder.svg"
                }
                alt={selectedOrder.product?.name}
                className="w-14 h-14 object-cover rounded-xl border border-gray-200 shadow-xs flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">
                  {selectedOrder.product?.name || "Food Item"}
                </h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-extrabold text-global-green">
                    ₦
                    {Number(
                      selectedOrder.meal_price ||
                        selectedOrder.product?.product_price ||
                        0,
                    ).toLocaleString()}
                  </span>
                  {(() => {
                    const parsedSub = parseSubMenus(selectedOrder.sub_menus);
                    const maxPortion = parsedSub.reduce(
                      (max: number, item: any) =>
                        Math.max(max, Number(item.portion || 1)),
                      1,
                    );
                    return (
                      <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {maxPortion > 1 ? `${maxPortion} Portions` : "1 Portion"}
                      </span>
                    );
                  })()}
                </div>

                {/* Submenus / Extras */}
                {(() => {
                  const parsedSub = parseSubMenus(selectedOrder.sub_menus);
                  if (parsedSub.length === 0) return null;
                  return (
                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                      <span className="text-xs font-semibold text-gray-600 block mb-1">
                        Selected Extras:
                      </span>
                      {parsedSub.map((extra: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between text-xs text-gray-700 font-medium"
                        >
                          <span>+ {extra.name || extra.label}</span>
                          <span className="font-semibold text-emerald-700">
                            ₦{Number(extra.price || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Financial Summary Box */}
            <div className="bg-gray-50/80 p-4 rounded-xl space-y-2 text-xs border border-gray-100">
              <div className="flex justify-between text-gray-500">
                <span>Meal Amount</span>
                <span className="font-semibold text-gray-900">
                  ₦
                  {Number(
                    selectedOrder.meal_price ||
                      selectedOrder.product?.product_price ||
                      0,
                  ).toLocaleString()}
                </span>
              </div>
              {selectedOrder.delivery_fee > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900">
                    +₦{Number(selectedOrder.delivery_fee || 0).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-red-500">
                <span>Platform Fee (10% Nedzl Commission)</span>
                <span className="font-semibold">
                  -₦
                  {Number(
                    selectedOrder.platform_fee ||
                      selectedOrder.total_amount * 0.1 ||
                      0,
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold border-t border-gray-200 pt-2 text-sm">
                <span>Total Amount Paid</span>
                <span className="text-indigo-900 font-extrabold">
                  ₦{Number(selectedOrder.total_amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold text-xs pt-0.5">
                <span>Vendor Net Payout (90%)</span>
                <span className="text-emerald-700 font-extrabold">
                  ₦{Number(selectedOrder.vendor_payout || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2 text-gray-500">
                <span>Payment Method</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">
                    Paystack Online
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Paid
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="bg-gray-50/80 p-4 rounded-xl space-y-1.5 text-xs border border-gray-100">
              <h4 className="font-semibold text-gray-500 text-xs">
                Customer & Delivery Details
              </h4>
              <p className="text-gray-900 font-bold text-sm">
                {selectedOrder.customer_name || "Customer"}
              </p>
              <p className="text-gray-600 flex items-center gap-1.5 pt-0.5">
                <FiPhone className="text-emerald-600" />
                <a
                  href={`tel:${selectedOrder.customer_phone}`}
                  className="text-emerald-600 underline font-semibold"
                >
                  {selectedOrder.customer_phone}
                </a>
              </p>
              <p className="text-gray-600 flex items-start gap-1.5 pt-0.5">
                <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{selectedOrder.delivery_address}</span>
              </p>
            </div>

            {/* Vendor Payout Bank Details Box (For Vendor View) */}
            {activeTab === "vendor" && (
              <div className="bg-blue-50/60 p-4 rounded-xl space-y-1 text-xs border border-blue-100">
                <h4 className="font-semibold text-blue-900 text-xs flex items-center gap-1">
                  <FiCreditCard className="text-blue-600" />
                  <span>Vendor Payout Bank Account</span>
                </h4>
                {selectedOrder.vendor?.bank_name ? (
                  <div className="text-blue-950 font-medium pt-1 space-y-0.5">
                    <p>
                      <strong>Bank:</strong> {selectedOrder.vendor.bank_name}
                    </p>
                    <p>
                      <strong>Account Number:</strong>{" "}
                      {selectedOrder.vendor.account_number}
                    </p>
                    <p>
                      <strong>Account Name:</strong>{" "}
                      {selectedOrder.vendor.account_name}
                    </p>
                  </div>
                ) : (
                  <p className="text-amber-700 italic pt-1">
                    No bank account saved yet. Please update payout bank details
                    in Dashboard &gt; Settings.
                  </p>
                )}
              </div>
            )}

            {/* Timeline Order Section (Matching Screenshot) */}
            <div className="pt-2">
              <h4 className="text-sm font-bold text-gray-900 mb-3">
                Timeline Order
              </h4>
              <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                <div className="relative flex items-center justify-between text-xs">
                  <div className="absolute -left-6 bg-white">
                    <FiCheckCircle className="text-emerald-500 w-5 h-5 bg-white rounded-full" />
                  </div>
                  <span className="font-medium text-gray-900">
                    Order Placed
                  </span>
                  <span className="text-gray-400">
                    {moment(selectedOrder.created_at).format("h:mm A")}
                  </span>
                </div>
                <div className="relative flex items-center justify-between text-xs">
                  <div className="absolute -left-6 bg-white">
                    <FiCheckCircle className="text-emerald-500 w-5 h-5 bg-white rounded-full" />
                  </div>
                  <span className="font-medium text-gray-900">
                    Payment Confirmed
                  </span>
                  <span className="text-gray-400">
                    {moment(selectedOrder.created_at).format("h:mm A")}
                  </span>
                </div>
                <div className="relative flex items-center justify-between text-xs">
                  <div className="absolute -left-6 bg-white">
                    {selectedOrder.status === "PREPARING" ||
                    selectedOrder.status === "OUT_FOR_DELIVERY" ||
                    selectedOrder.status === "DELIVERED" ? (
                      <FiCheckCircle className="text-emerald-500 w-5 h-5 bg-white rounded-full" />
                    ) : (
                      <FiClock className="text-gray-300 w-5 h-5 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={
                      selectedOrder.status === "PREPARING" ||
                      selectedOrder.status === "OUT_FOR_DELIVERY" ||
                      selectedOrder.status === "DELIVERED"
                        ? "font-medium text-gray-900"
                        : "text-gray-400"
                    }
                  >
                    Order in Progress
                  </span>
                  <span className="text-gray-400">
                    {selectedOrder.status === "PREPARING" ? "Current" : ""}
                  </span>
                </div>
                <div className="relative flex items-center justify-between text-xs">
                  <div className="absolute -left-6 bg-white">
                    {selectedOrder.status === "DELIVERED" ? (
                      <FiCheckCircle className="text-emerald-500 w-5 h-5 bg-white rounded-full" />
                    ) : (
                      <FiClock className="text-gray-300 w-5 h-5 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={
                      selectedOrder.status === "DELIVERED"
                        ? "font-medium text-gray-900"
                        : "text-gray-400"
                    }
                  >
                    Delivered & Payout Released
                  </span>
                  <span className="text-gray-400">
                    {selectedOrder.status === "DELIVERED" ? "Completed" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
