import React, { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../../config";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { TRASH } from "../../assets";

interface Banner {
  id: string;
  image_url: string;
  target_url: string;
  is_active: boolean;
  created_at: string;
}

function Banners() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [targetUrl, setTargetUrl] = useState("");
  const [urlType, setUrlType] = useState("custom");
  const [loading, setLoading] = useState(false);

  const { data: banners, isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const response = await API.get("/admin/banners/all");
      return response.data;
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !targetUrl) {
      toast.error("Please provide both an image and a target URL");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("target_url", targetUrl);

      await API.post("/admin/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Banner uploaded successfully");
      setFile(null);
      setTargetUrl("");
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to upload banner");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await API.patch(`/admin/banners/${id}/status`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast.success("Banner status updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await API.delete(`/admin/banners/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast.success("Banner deleted");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete banner");
    },
  });

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-5 geist-family w-full flex flex-col items-start gap-y-5">
        <h1 className="text-2xl font-bold text-primary-300">Banner Management</h1>

        <div className="w-full bg-white rounded-xl p-5 border border-borderColor flex flex-col gap-y-4">
          <h2 className="text-lg font-medium text-primary-300">Upload New Banner</h2>
          <div className="flex flex-col lg:flex-row items-end gap-4 w-full">
            <div className="flex flex-col w-full lg:w-1/3 gap-y-1">
              <span className="text-sm font-medium text-[#4F5762]">Banner Image</span>
              <div className="relative w-full h-[40px] rounded-lg border border-dashed border-global-green flex items-center justify-center bg-[#F0FDF4] cursor-pointer hover:bg-green-100 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-sm font-medium text-global-green px-2 truncate">
                  {file ? file.name : "Click or drag to upload image"}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full lg:w-1/2 gap-y-1">
              <span className="text-sm font-medium text-[#4F5762]">Target URL</span>
              <div className="flex items-center gap-2">
                <select
                  value={urlType}
                  onChange={(e) => {
                    setUrlType(e.target.value);
                    setTargetUrl("");
                  }}
                  className="h-[40px] rounded-lg px-3 border border-borderColor bg-transparent text-sm text-primary-300 outline-none w-[120px] flex-shrink-0 cursor-pointer"
                >
                  <option value="custom">Custom Link</option>
                  <option value="section">Section</option>
                  <option value="category">Category</option>
                </select>

                {urlType === "custom" && (
                  <input
                    type="text"
                    placeholder="e.g. /products?search=shoes"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full h-[40px] rounded-lg px-3 border border-borderColor bg-transparent placeholder:text-sm text-primary-300 outline-none"
                  />
                )}
                {urlType === "section" && (
                  <select
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full h-[40px] rounded-lg px-3 border border-borderColor bg-transparent text-sm text-primary-300 outline-none cursor-pointer"
                  >
                    <option value="">Select Section</option>
                    <option value="/products?section=todays-deal">Today's Deal</option>
                    <option value="/products?section=for-you">For You</option>
                  </select>
                )}
                {urlType === "category" && (
                  <select
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full h-[40px] rounded-lg px-3 border border-borderColor bg-transparent text-sm text-primary-300 outline-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="/products?category=electricals">Electricals</option>
                    <option value="/products?category=home-appliances">Home Appliances</option>
                    <option value="/products?category=furniture">Furniture</option>
                    <option value="/products?category=kitchenware">Kitchenware</option>
                    <option value="/products?category=books">Books</option>
                  </select>
                )}
              </div>
            </div>
            <div className="w-full lg:w-auto flex-shrink-0">
              <Button
                title="Upload"
                loading={loading}
                disabled={loading}
                btnStyles="bg-global-green rounded-lg px-6 h-[40px]"
                textStyle="text-white text-sm font-medium"
                handleClick={handleUpload}
              />
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-xl p-5 border border-borderColor">
          <h2 className="text-lg font-medium text-primary-300 mb-4">Existing Banners</h2>
          {isLoading ? (
            <div className="text-center text-sm text-gray-500 py-10">Loading banners...</div>
          ) : banners?.data?.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-10">No banners found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {banners?.data?.map((banner: Banner) => (
                <div key={banner.id} className="border border-borderColor rounded-xl overflow-hidden flex flex-col">
                  <div className="h-[150px] w-full bg-gray-100">
                    <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 flex flex-col gap-y-2">
                    <a href={banner.target_url} target="_blank" rel="noreferrer" className="text-sm text-global-green underline truncate">
                      {banner.target_url}
                    </a>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => toggleStatusMutation.mutate(banner.id)}
                        className={`text-xs px-3 py-1 rounded-full font-medium ${banner.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {banner.is_active ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this banner?")) {
                            deleteMutation.mutate(banner.id);
                          }
                        }}
                        className="p-1 rounded-md hover:bg-red-50 transition"
                      >
                        <img src={TRASH} className="w-[18px] h-[18px]" alt="Delete" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Banners;
