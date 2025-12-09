import { useEffect, useState } from "react";
import SelectInput from "../../../components/SelectInput";
import Button from "../../../components/Button";
import { statesInNigeria } from "../../../constant";
import {
  createStoreSettings,
  getSellerStoreDetails,
} from "../../../services/product.service";
// import { StoreSettingsPayload } from "../../../types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUserId } from "../../../state/slices/globalReducer";
import { useQuery } from "@tanstack/react-query";

function StoreSettings() {
  const [formFields, setFormFields] = useState({
    businessName: "",
    aboutCompany: "",
    storeName: "",
    address: "",
    state: "",
    region: "",
    how_do_we_locate_you: "",
    businessHoursFrom: "",
    businessHoursTo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setFormFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const userId = useSelector(selectUserId);

  const {
    data: storeDetails,
    // isLoading: loadingStoreSettings,
    // refetch,
  } = useQuery({
    queryKey: ["store-settings", userId],
    queryFn: () => getSellerStoreDetails(userId as string),
  });

  const regionOptions = [
    { label: "North", value: "north" },
    { label: "South", value: "south" },
    { label: "East", value: "east" },
    { label: "West", value: "west" },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      business_name: formFields.businessName,
      about_company: formFields.aboutCompany,
      store_name: formFields.storeName,
      state: formFields.state,
      address: formFields.address,
      region: formFields.region,
      how_do_we_locate_you: formFields.how_do_we_locate_you,
      business_hours_from: formFields.businessHoursFrom,
      business_hours_to: formFields.businessHoursTo,
    };

    try {
      const response = await createStoreSettings(payload);
      if (response) {
        toast.success(response?.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeDetails !== undefined) {
      setFormFields({
        businessName: storeDetails?.store_settings?.business_name,
        aboutCompany: storeDetails?.store_settings?.about_company,
        storeName: storeDetails?.store_settings?.store_name,
        address: storeDetails?.store_settings?.address,
        state: storeDetails?.store_settings?.state,
        region: storeDetails?.store_settings?.region,
        how_do_we_locate_you:
          storeDetails?.store_settings?.how_do_we_locate_you,
        businessHoursFrom: storeDetails?.store_settings?.business_hours_from,
        businessHoursTo: storeDetails?.store_settings?.business_hours_from,
      });
    }
  }, [storeDetails]);
  return (
    <div className="w-full p-4">
      {/* Section 1: COMPANY NAME, DESCRIPTION & LINKS */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-global-green mb-6">
          COMPANY NAME, DESCRIPTION & LINKS
        </h2>
        <div className="space-y-5">
          <SelectInput
            label="Business Name"
            isInput
            placeholder="Input your business name e.g. Bankole Business"
            value={formFields.businessName}
            setValue={(val) => handleFieldChange("businessName", val)}
          />

          <div className="w-full">
            <label className="block text-sm font-normal text-primary-300 mb-1">
              About Company
            </label>
            <textarea
              placeholder="Write something about your business e.g. We sell quality hair and beauty accessories"
              value={formFields.aboutCompany}
              onChange={(e) =>
                handleFieldChange("aboutCompany", e.target.value)
              }
              rows={4}
              className="w-full border border-borderColor rounded-xl p-3 text-sm shadow-input-v2 outline-none placeholder-[#808080] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: STORE ADDRESS AND BUSINESS HOURS */}
      <div>
        <h2 className="text-sm font-semibold text-global-green mb-6">
          STORE ADDRESS AND BUSINESS HOURS
        </h2>
        <div className="space-y-5">
          <SelectInput
            label="Store Name"
            isInput
            placeholder="Enter store name e.g. Bankole Beauty - Ikeja"
            value={formFields.storeName}
            setValue={(val) => handleFieldChange("storeName", val)}
          />

          <SelectInput
            label="Address"
            isInput
            placeholder="Enter store address e.g. 22 Allen Avenue, Ikeja, Lagos"
            value={formFields.address}
            setValue={(val) => handleFieldChange("address", val)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <SelectInput
              label="State"
              placeholder="Select state e.g. Lagos"
              options={statesInNigeria}
              value={formFields.state}
              setValue={(val) => handleFieldChange("state", val)}
            />

            <SelectInput
              label="Region"
              placeholder="Please select"
              options={regionOptions}
              value={formFields.region}
              setValue={(val) => handleFieldChange("region", val)}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-normal text-primary-300 mb-1">
              How do we locate you?
            </label>
            <textarea
              placeholder="Add a landmark or direction tip e.g. Opposite Ikeja City Mall"
              value={formFields.how_do_we_locate_you}
              onChange={(e) =>
                handleFieldChange("how_do_we_locate_you", e.target.value)
              }
              rows={3}
              className="w-full border border-borderColor rounded-xl p-3 text-sm shadow-input-v2 outline-none placeholder-[#808080] resize-none"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-normal text-primary-300 mb-1">
              Business Hours
            </label>
            {/* <div className="grid grid-cols-2 gap-x-4">
              <div className="w-full">
                <label className="block text-xs font-normal text-primary-300 mb-1 bg-[#07B4631A] px-2 py-1 rounded-t-md">
                  From
                </label>
                <input
                  type="time"
                  value={formFields.businessHoursFrom}
                  onChange={(e) =>
                    handleFieldChange("businessHoursFrom", e.target.value)
                  }
                  className="w-full border border-borderColor rounded-b-xl rounded-t-none p-3 text-sm shadow-input-v2 outline-none placeholder-[#808080]"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs font-normal text-primary-300 mb-1 bg-[#07B4631A] px-2 py-1 rounded-t-md">
                  To
                </label>
                <input
                  type="time"
                  value={formFields.businessHoursTo}
                  onChange={(e) =>
                    handleFieldChange("businessHoursTo", e.target.value)
                  }
                  className="w-full border border-borderColor rounded-b-xl rounded-t-none p-3 text-sm shadow-input-v2 outline-none placeholder-[#808080]"
                />
              </div>
            </div> */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 w-full">
              <div className="w-full flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden">
                <div className="bg-[#E6F4EA] px-3 py-2 text-sm text-[#00A36C] font-medium">
                  From
                </div>
                <input
                  type="time"
                  value={formFields.businessHoursFrom}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      businessHoursFrom: e.target.value,
                    })
                  }
                  className="px-3 w-full py-2 text-sm outline-none text-gray-700"
                />
              </div>
              <div className="w-full flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden">
                <div className="bg-[#E6F4EA] px-3 py-2 text-sm text-[#00A36C] font-medium">
                  To
                </div>
                <input
                  type="time"
                  value={formFields.businessHoursTo}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      businessHoursTo: e.target.value,
                    })
                  }
                  className="px-3 w-full py-2 text-sm outline-none text-gray-700 "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-end items-end mt-8">
        <Button
          title="Save Settings"
          loading={loading}
          btnStyles="bg-global-green rounded-xl px-5 h-[40px] px-4"
          textStyle="text-[#FAFAFA] font-medium text-sm"
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default StoreSettings;
