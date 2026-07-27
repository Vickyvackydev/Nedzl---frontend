import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Store } from "../../../state/store";
import TableComponent from "../../../components/TableComponent";
import Modal from "../../../components/Modal";
import moment from "moment";
import toast from "react-hot-toast";
import {
  FiEye,
  FiX,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiBox,
} from "react-icons/fi";
import { FaTools } from "react-icons/fa";
import {
  getUserServiceBookings,
  getArtisanServiceBookings,
  artisanCompleteBooking,
  customerCompleteBooking,
} from "../../../services/serviceBookings.service";

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<"customer" | "artisan">(
    "customer",
  );
  const [sorting, setSorting] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const token = Store.getState().auths.token;

  const {
    data: customerBookingsData,
    isLoading: isLoadingCustomer,
    refetch: refetchCustomer,
  } = useQuery({
    queryKey: ["customer-service-bookings"],
    queryFn: () => getUserServiceBookings(),
    enabled: !!token && activeTab === "customer",
  });

  const {
    data: artisanBookingsData,
    isLoading: isLoadingArtisan,
    refetch: refetchArtisan,
  } = useQuery({
    queryKey: ["artisan-service-bookings"],
    queryFn: () => getArtisanServiceBookings(),
    enabled: !!token && activeTab === "artisan",
  });

  const customerBookings = customerBookingsData?.data || [];
  const artisanBookings = artisanBookingsData?.data || [];

  const handleArtisanComplete = async (bookingId: string) => {
    try {
      await artisanCompleteBooking(bookingId);
      toast.success(
        "Service marked as completed by artisan! Customer notified.",
      );
      refetchArtisan();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: "ARTISAN_COMPLETED" });
      }
    } catch (err: any) {
      toast.error("Failed to update booking status");
    }
  };

  const handleCustomerComplete = async (bookingId: string) => {
    try {
      await customerCompleteBooking(bookingId);
      toast.success(
        "Booking marked completed! Escrow payout released to artisan.",
      );
      refetchCustomer();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          status: "COMPLETED",
          payment_status: "RELEASED_TO_ARTISAN",
        });
      }
    } catch (err: any) {
      toast.error("Failed to release escrow payout");
    }
  };

  const customerColumns: any = [
    {
      header: "Booking #",
      accessorKey: "booking_number",
      cell: (info: any) => (
        <span className="font-mono text-xs font-bold text-gray-800">
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Service",
      accessorKey: "service.name",
      cell: (info: any) => (
        <span className="font-semibold text-gray-900">
          {info.getValue() || "Service"}
        </span>
      ),
    },
    {
      header: "Artisan",
      accessorKey: "artisan.user_name",
      cell: (info: any) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold">{info.getValue()}</span>
          <a
            href={`tel:${info.row.original?.artisan?.phone_number}`}
            className="text-global-green flex items-center gap-1 font-medium"
          >
            <FiPhone size={12} />
            <span>{info.row.original?.artisan?.phone_number || "N/A"}</span>
          </a>
        </div>
      ),
    },
    {
      header: "Fee Paid",
      accessorKey: "booking_fee",
      cell: (info: any) => (
        <span className="font-bold text-indigo-600">
          ₦{Number(info.getValue() || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Escrow Status",
      accessorKey: "payment_status",
      cell: (info: any) => (
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-bold ${
            info.getValue() === "RELEASED_TO_ARTISAN"
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {info.getValue() === "RELEASED_TO_ARTISAN"
            ? "RELEASED"
            : "HELD IN ESCROW"}
        </span>
      ),
    },
    {
      header: "Details",
      cell: (info: any) => (
        <button
          onClick={() => {
            setSelectedBooking(info.row.original);
            setIsDetailsOpen(true);
          }}
          className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1"
        >
          <FiEye size={13} />
          <span>Details</span>
        </button>
      ),
    },
    {
      header: "Action",
      cell: (info: any) => {
        const status = info.row.original.status;
        const isCompleted = status === "COMPLETED";

        if (isCompleted) {
          return (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <FiCheckCircle /> Completed
            </span>
          );
        }

        return (
          <button
            onClick={() => handleCustomerComplete(info.row.original.id)}
            className="bg-global-green hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
          >
            Mark as Completed
          </button>
        );
      },
    },
  ];

  const artisanColumns: any = [
    {
      header: "Booking #",
      accessorKey: "booking_number",
      cell: (info: any) => (
        <span className="font-mono text-xs font-bold text-gray-800">
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Service",
      accessorKey: "service.name",
      cell: (info: any) => (
        <span className="font-semibold text-gray-900">
          {info.getValue() || "Service"}
        </span>
      ),
    },
    {
      header: "Customer",
      accessorKey: "user.user_name",
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
      header: "Booking Fee",
      accessorKey: "booking_fee",
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
            info.getValue() || info.row.original?.booking_fee * 0.1 || 0,
          ).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Your Payout (90%)",
      accessorKey: "artisan_payout",
      cell: (info: any) => (
        <span className="font-bold text-global-green text-xs">
          ₦{Number(info.getValue() || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Details",
      cell: (info: any) => (
        <button
          onClick={() => {
            setSelectedBooking(info.row.original);
            setIsDetailsOpen(true);
          }}
          className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1"
        >
          <FiEye size={13} />
          <span>Details</span>
        </button>
      ),
    },
    {
      header: "Action",
      cell: (info: any) => {
        const status = info.row.original.status;

        if (status === "COMPLETED") {
          return (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <FiCheckCircle /> Completed & Paid
            </span>
          );
        }

        if (status === "ARTISAN_COMPLETED") {
          return (
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Awaiting Customer / 24h Auto-Release
            </span>
          );
        }

        return (
          <button
            onClick={() => handleArtisanComplete(info.row.original.id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
          >
            Mark Completed
          </button>
        );
      },
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-borderColor pb-3">
        <button
          onClick={() => setActiveTab("customer")}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "customer"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaTools size={14} />
          <span>My Service Bookings</span>
        </button>
        <button
          onClick={() => setActiveTab("artisan")}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "artisan"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FiBox size={16} />
          <span>Artisan Jobs Received</span>
        </button>
      </div>

      {activeTab === "customer" ? (
        isLoadingCustomer ? (
          <div className="text-center py-8 text-sm text-gray-500">
            Loading bookings...
          </div>
        ) : (
          <TableComponent
            DATA={customerBookings}
            COLUMNS={customerColumns}
            sorting={sorting}
            setSorting={setSorting}
          />
        )
      ) : isLoadingArtisan ? (
        <div className="text-center py-8 text-sm text-gray-500">
          Loading artisan jobs...
        </div>
      ) : (
        <TableComponent
          DATA={artisanBookings}
          COLUMNS={artisanColumns}
          sorting={sorting}
          setSorting={setSorting}
        />
      )}

      {/* Detail Booking Modal - Matching Screenshot Layout */}
      {selectedBooking && (
        <Modal show={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}>
          <div className="p-5 md:p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto custom-scrollbar-gray bg-white rounded-2xl flex flex-col gap-y-4 shadow-2xl geist-family">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 pt-1">
              <h2 className="text-base font-semibold text-gray-900 mx-auto">
                Detail Booking
              </h2>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Booking ID & Status Header */}
            <div className="flex items-center justify-between py-1">
              <div>
                <h3 className="text-base font-extrabold text-indigo-900 tracking-tight">
                  Booking ID #{selectedBooking.booking_number}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">
                  {moment(selectedBooking.created_at).format(
                    "ddd, DD MMM YYYY • h:mm a",
                  )}
                </p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-3 py-1 rounded-full font-bold">
                {selectedBooking.status || "Booked"}
              </span>
            </div>

            {/* Service Item Card */}
            <div className="flex items-start gap-3 py-3 border-t border-b border-gray-100">
              <img
                src={
                  selectedBooking.service?.image_url ||
                  "/assets/empty-placeholder.svg"
                }
                alt={selectedBooking.service?.name}
                className="w-14 h-14 object-cover rounded-xl border border-gray-200 shadow-xs flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">
                  {selectedBooking.service?.name || "Service Item"}
                </h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-extrabold text-indigo-600">
                    ₦{Number(selectedBooking.booking_fee || 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    1 Service
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Scheduled for:{" "}
                  <span className="text-gray-800 font-semibold">
                    {moment(selectedBooking.scheduled_date).format("llll")}
                  </span>
                </p>
              </div>
            </div>

            {/* Financial Summary & Escrow Box */}
            <div className="bg-gray-50/80 p-4 rounded-xl space-y-2 text-xs border border-gray-100">
              <div className="flex justify-between text-gray-500">
                <span>Service Booking Fee</span>
                <span className="font-semibold text-gray-900">
                  ₦{Number(selectedBooking.booking_fee || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Platform Fee (10% Nedzl Commission)</span>
                <span className="font-semibold">
                  -₦
                  {Number(
                    selectedBooking.platform_fee ||
                      selectedBooking.booking_fee * 0.1 ||
                      0,
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold border-t border-gray-200 pt-2 text-sm">
                <span>Total Amount Paid</span>
                <span className="text-indigo-900 font-extrabold">
                  ₦{Number(selectedBooking.booking_fee || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold text-xs pt-0.5">
                <span>Artisan Net Payout (90%)</span>
                <span className="text-emerald-700 font-extrabold">
                  ₦
                  {Number(selectedBooking.artisan_payout || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2 text-gray-500">
                <span>Escrow Payment Status</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedBooking.payment_status === "RELEASED_TO_ARTISAN"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedBooking.payment_status === "RELEASED_TO_ARTISAN"
                    ? "RELEASED TO ARTISAN"
                    : "HELD IN ESCROW"}
                </span>
              </div>
            </div>

            {/* Notes / Customer Details Box */}
            <div className="bg-gray-50/80 p-4 rounded-xl space-y-1.5 text-xs border border-gray-100">
              <h4 className="font-semibold text-gray-500 text-xs">
                Customer & Location Details
              </h4>
              <p className="text-gray-900 font-bold text-sm">
                {selectedBooking.user?.user_name || "Customer"}
              </p>
              <p className="text-gray-600 flex items-center gap-1.5 pt-0.5">
                <FiPhone className="text-indigo-600" />
                <a
                  href={`tel:${selectedBooking.customer_phone}`}
                  className="text-indigo-600 underline font-semibold"
                >
                  {selectedBooking.customer_phone}
                </a>
              </p>
              <p className="text-gray-600 flex items-start gap-1.5 pt-0.5">
                <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{selectedBooking.service_address}</span>
              </p>
              {selectedBooking.notes && (
                <div className="pt-2 border-t border-gray-200 mt-1">
                  <span className="font-semibold text-gray-500 block">
                    Notes
                  </span>
                  <p className="text-gray-700 italic pt-0.5">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Artisan Payout Bank Details Box (For Artisan View) */}
            {activeTab === "artisan" && (
              <div className="bg-blue-50/60 p-4 rounded-xl space-y-1 text-xs border border-blue-100">
                <h4 className="font-semibold text-blue-900 text-xs flex items-center gap-1">
                  <FiCreditCard className="text-blue-600" />
                  <span>Artisan Payout Bank Account</span>
                </h4>
                {selectedBooking.artisan?.bank_name ? (
                  <div className="text-blue-950 font-medium pt-1 space-y-0.5">
                    <p>
                      <strong>Bank:</strong> {selectedBooking.artisan.bank_name}
                    </p>
                    <p>
                      <strong>Account Number:</strong>{" "}
                      {selectedBooking.artisan.account_number}
                    </p>
                    <p>
                      <strong>Account Name:</strong>{" "}
                      {selectedBooking.artisan.account_name}
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

            {/* Timeline Booking Section (Matching Screenshot) */}
            <div className="pt-2">
              <h4 className="text-sm font-bold text-gray-900 mb-3">
                Timeline Booking
              </h4>
              <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                <div className="relative flex items-center justify-between text-xs">
                  <div className="absolute -left-6 bg-white">
                    <FiCheckCircle className="text-emerald-500 w-5 h-5 bg-white rounded-full" />
                  </div>
                  <span className="font-medium text-gray-900">
                    Booking Placed
                  </span>
                  <span className="text-gray-400">
                    {moment(selectedBooking.created_at).format("h:mm A")}
                  </span>
                </div>
                <div className="relative flex items-center justify-between text-xs">
                  <div className="absolute -left-6 bg-white">
                    <FiCheckCircle className="text-emerald-500 w-5 h-5 bg-white rounded-full" />
                  </div>
                  <span className="font-medium text-gray-900">
                    Payment Held in Escrow
                  </span>
                  <span className="text-gray-400">
                    {moment(selectedBooking.created_at).format("h:mm A")}
                  </span>
                </div>
                <div className="relative flex items-center justify-between text-xs">
                  <div className="absolute -left-6 bg-white">
                    {selectedBooking.status === "ARTISAN_COMPLETED" ||
                    selectedBooking.status === "COMPLETED" ? (
                      <FiCheckCircle className="text-emerald-500 w-5 h-5 bg-white rounded-full" />
                    ) : (
                      <FiClock className="text-gray-300 w-5 h-5 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={
                      selectedBooking.status === "ARTISAN_COMPLETED" ||
                      selectedBooking.status === "COMPLETED"
                        ? "font-medium text-gray-900"
                        : "text-gray-400"
                    }
                  >
                    Service Completed by Artisan
                  </span>
                  <span className="text-gray-400">
                    {selectedBooking.status === "ARTISAN_COMPLETED"
                      ? "Awaiting Customer"
                      : ""}
                  </span>
                </div>
                <div className="relative flex items-center justify-between text-xs">
                  <div className="absolute -left-6 bg-white">
                    {selectedBooking.status === "COMPLETED" ? (
                      <FiCheckCircle className="text-emerald-500 w-5 h-5 bg-white rounded-full" />
                    ) : (
                      <FiClock className="text-gray-300 w-5 h-5 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={
                      selectedBooking.status === "COMPLETED"
                        ? "font-medium text-gray-900"
                        : "text-gray-400"
                    }
                  >
                    Confirmed & Escrow Payout Released
                  </span>
                  <span className="text-gray-400">
                    {selectedBooking.status === "COMPLETED" ? "Completed" : ""}
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
