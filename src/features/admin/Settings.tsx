import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../../config";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import {
  FiTrash2,
  FiAlertTriangle,
  FiShoppingBag,
  FiTool,
  FiShield,
  FiDollarSign,
  FiRefreshCw,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [confirmModalType, setConfirmModalType] = useState<
    "orders_only" | "orders_and_catalog" | null
  >(null);
  const [confirmInput, setConfirmInput] = useState("");

  const { data: statsResponse, isLoading: isLoadingStats, refetch } = useQuery({
    queryKey: ["admin-cleanup-stats"],
    queryFn: async () => {
      const res = await API.get("/admin/cleanup/stats");
      return res.data;
    },
  });

  const stats = statsResponse?.data || {
    food_orders_count: 0,
    service_bookings_count: 0,
    food_products_count: 0,
    service_products_count: 0,
  };

  const clearMutation = useMutation({
    mutationFn: async (clearType: "orders_only" | "orders_and_catalog") => {
      const res = await API.post("/admin/cleanup/clear", {
        clear_type: clearType,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Database cleared successfully!");
      setConfirmModalType(null);
      setConfirmInput("");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to clear database records"
      );
    },
  });

  const handleExecuteClear = () => {
    if (!confirmModalType) return;
    if (confirmInput.trim().toUpperCase() !== "CONFIRM") {
      toast.error("Please type CONFIRM to proceed");
      return;
    }
    clearMutation.mutate(confirmModalType);
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-5 geist-family w-full flex flex-col items-start gap-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-300">
              Platform & Database Settings
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage platform rules, marketplace configurations, and live database maintenance.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-borderColor rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs cursor-pointer"
          >
            <FiRefreshCw className={isLoadingStats ? "animate-spin" : ""} size={14} />
            <span>Refresh Stats</span>
          </button>
        </div>

        {/* Live Data Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="bg-white border border-borderColor rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <FiShoppingBag size={20} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Food Orders</span>
              <h3 className="text-xl font-bold text-gray-900">
                {isLoadingStats ? "..." : Number(stats.food_orders_count).toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="bg-white border border-borderColor rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FiTool size={20} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Service Bookings</span>
              <h3 className="text-xl font-bold text-gray-900">
                {isLoadingStats ? "..." : Number(stats.service_bookings_count).toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="bg-white border border-borderColor rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
              <FaUtensils size={18} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Food Menu Listings</span>
              <h3 className="text-xl font-bold text-gray-900">
                {isLoadingStats ? "..." : Number(stats.food_products_count).toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="bg-white border border-borderColor rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <FiShield size={20} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">Services Catalog</span>
              <h3 className="text-xl font-bold text-gray-900">
                {isLoadingStats ? "..." : Number(stats.service_products_count).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Marketplace Commission Rules */}
        <div className="w-full bg-white rounded-2xl p-5 md:p-6 border border-borderColor shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary-300 font-bold text-lg">
            <FiDollarSign className="text-global-green w-5 h-5" />
            <h2>Platform Fee & Split Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 text-sm block">10% Platform Commission</span>
              <p className="text-emerald-800 leading-relaxed">
                Retained automatically by Nedzl on every successful food order or service booking transaction.
              </p>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
              <span className="font-bold text-blue-900 text-sm block">90% Vendor/Artisan Net Payout</span>
              <p className="text-blue-800 leading-relaxed">
                Transferred to the vendor/artisan's bank account upon customer confirmation or 24-hour auto-release.
              </p>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
              <span className="font-bold text-amber-900 text-sm block">24-Hour Payout Settlement</span>
              <p className="text-amber-800 leading-relaxed">
                Paystack manual settlement clears funds within 24 hours (T+1), after which payouts are automatically disbursed.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone: Database Maintenance */}
        <div className="w-full bg-white rounded-2xl p-5 md:p-6 border border-red-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2.5 text-red-700">
            <FiAlertTriangle size={22} />
            <div>
              <h2 className="text-lg font-bold text-red-900">Database Reset & Maintenance (Danger Zone)</h2>
              <p className="text-xs text-red-700">
                Use these tools to clean up test transactions, orders, and bookings before launching live campaigns.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {/* Action Card 1: Clear Orders & Bookings */}
            <div className="p-5 border border-red-100 bg-red-50/30 rounded-xl flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">
                    Clear All Food Orders & Service Bookings
                  </h3>
                  <span className="bg-red-100 text-red-800 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full">
                    {stats.food_orders_count + stats.service_bookings_count} Records
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Permanently deletes all test food orders and service booking transactions from PostgreSQL. Keeps all registered vendor/artisan accounts, customer profiles, and active products intact.
                </p>
              </div>

              <button
                onClick={() => {
                  setConfirmModalType("orders_only");
                  setConfirmInput("");
                }}
                disabled={stats.food_orders_count === 0 && stats.service_bookings_count === 0}
                className="w-full sm:w-auto self-start bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiTrash2 size={14} />
                <span>Clear Orders & Bookings</span>
              </button>
            </div>

            {/* Action Card 2: Clear Orders + Food/Service Catalog */}
            <div className="p-5 border border-red-100 bg-red-50/30 rounded-xl flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">
                    Clear Orders + Food & Service Catalog
                  </h3>
                  <span className="bg-red-100 text-red-800 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full">
                    Complete Clean Slate
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Permanently deletes all food orders, service bookings, and test food/service items created in the catalog. General e-commerce products and user accounts are preserved.
                </p>
              </div>

              <button
                onClick={() => {
                  setConfirmModalType("orders_and_catalog");
                  setConfirmInput("");
                }}
                className="w-full sm:w-auto self-start bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiTrash2 size={14} />
                <span>Clear Orders & Catalog Listings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalType && (
        <Modal show={!!confirmModalType} onClose={() => setConfirmModalType(null)}>
          <div className="p-6 max-w-md w-full bg-white rounded-2xl shadow-2xl flex flex-col gap-y-4 geist-family">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <FiAlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-gray-900">
                Confirm Database Cleanup
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {confirmModalType === "orders_only"
                  ? "Are you sure you want to permanently truncate all food orders and service bookings? This action cannot be undone."
                  : "Are you sure you want to delete all food orders, service bookings, and all test food/service catalog items?"}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
              <span className="font-semibold block mb-1">Type CONFIRM below to authorize:</span>
              <input
                type="text"
                placeholder="Type CONFIRM"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                className="w-full h-[38px] px-3 border border-red-300 rounded-lg bg-white text-xs font-mono font-bold text-gray-900 outline-none focus:border-red-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModalType(null)}
                disabled={clearMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteClear}
                disabled={confirmInput.trim().toUpperCase() !== "CONFIRM" || clearMutation.isPending}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {clearMutation.isPending ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <FiTrash2 size={13} />
                    <span>Yes, Truncate Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
