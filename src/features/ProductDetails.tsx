import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
import {
  HEART,
  LEXUS,
  OUTLINE_EYE,
  OUTLINE_LOCATION,
  PROFILE,
  SHARE,
  SINGLE_USER,
  VERIFIED,
} from "../assets";
import Button from "../components/Button";
import ProductRow from "../ui/product-row";

function ProductDetails() {
  const [activeTab, setActiveTab] = useState<
    "product-details" | "outstanding-issues"
  >("product-details");
  return (
    <MainLayout>
      <div className="px-20 py-7 bg-[#F7F7F7]">
        <div className="w-full flex items-center justify-start gap-x-3">
          <div className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box">
            Home
          </div>
          <span className="text-xs font-semibold text-primary-300">/</span>
          <div className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box">
            Vehicles
          </div>
          <span className="text-xs font-semibold text-primary-300">/</span>

          <div className="w-fit h-fit px-2 py-1.5 rounded-full text-xs font-semibold text-primary-300 bg-white shadow-box">
            Hyundai Sonata 2015 Model – Foreign Used
          </div>
        </div>
        <div className="w-full flex items-start justify-between mt-4 gap-7">
          <div className="w-[70%] flex flex-col gap-y-4">
            <div className="w-full p-5 bg-white shadow-box rounded-xl flex flex-col gap-y-3">
              <div className="w-full ">
                <img
                  src={LEXUS}
                  className="w-full h-[300px] rounded-xl object-cover"
                  alt=""
                />
              </div>
              <div className="max-w-full overflow-x-scroll flex items-center gap-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_) => (
                  <img
                    src={LEXUS}
                    className="w-full h-[79px] rounded-xl"
                    alt=""
                  />
                ))}
              </div>
              <div className="flex flex-col gap-y-2 items-startp">
                <div className="w-full flex items-center justify-between ">
                  <span className="text-xl font-semibold text-primary-300">
                    Hyundai Sonata 2015 Model – Foreign Used
                  </span>
                  <div className="flex items-center justify-end gap-x-3">
                    <div className="w-[32px] h-[32px] rounded-full border-[0.67px] border-[#DADADA] flex items-center justify-center">
                      <img src={HEART} className="w-[16px] h-[16px]" alt="" />
                    </div>
                    <div className="w-[32px] h-[32px] rounded-full border-[0.67px] border-[#DADADA] flex items-center justify-center">
                      <img src={SHARE} className="w-[16px] h-[16px]" alt="" />
                    </div>
                  </div>
                </div>
                <span className="text-sm font-normal text-faded-black-light">
                  Brand: <span className="text-global-green">Hyundai</span>
                </span>
                <div className="flex items-center justify-start gap-x-2">
                  <img
                    src={OUTLINE_LOCATION}
                    className="w-[20px] h-[20px]"
                    alt=""
                  />
                  <span className="text-[#75757A] font-normal text-sm">
                    Lagos, Ogudu, 1 hour ago
                  </span>
                </div>
                <div className="flex items-center justify-start gap-x-2">
                  <img src={OUTLINE_EYE} className="w-[20px] h-[20px]" alt="" />
                  <span className="text-[#75757A] font-normal text-sm">
                    514
                  </span>
                </div>
                <div className="w-fit h-fit bg-[#07B4631A]  rounded-lg p-1.5 text-xs font-medium text-global-green">
                  BRAND NEW
                </div>
              </div>
            </div>
            <div className="w-full bg-white shadow-box rounded-xl  ">
              <div className="w-full flex items-center gap-x-4 p-5 border border-[#E9EAEB]">
                <div className="w-fit relative">
                  <span
                    onClick={() => setActiveTab("product-details")}
                    className={`text-[16px] cursor-pointer relative ${
                      activeTab === "product-details"
                        ? "text-global-green font-semibold"
                        : "text-faded-black-light font-medium"
                    }`}
                  >
                    Product Details
                  </span>
                  {activeTab === "product-details" && (
                    <div className="border-b-[3px] border-global-green absolute w-[150px] -left-5 top-[43px]" />
                  )}
                </div>
                <div className="w-fit relative">
                  <span
                    onClick={() => setActiveTab("outstanding-issues")}
                    className={`text-[16px] cursor-pointer ${
                      activeTab === "outstanding-issues"
                        ? "text-global-green font-semibold"
                        : "text-faded-black-light font-medium"
                    }`}
                  >
                    Outstanding Issues
                  </span>
                  {activeTab === "outstanding-issues" && (
                    <div className="border-b-[3px] border-global-green absolute w-[150px] -left-1 top-[43px]" />
                  )}
                </div>
              </div>
              <div className="w-full p-5 ">
                {activeTab === "product-details" && (
                  <span>
                    {" "}
                    Make & Model: Hyundai Sonata <br />
                    Year: 2015 <br />
                    Condition: Foreign Used (Tokunbo) <br />
                    Transmission: Automatic <br />
                    Fuel Type: Petrol <br />
                    Engine: 2.4L 4-cylinder <br />
                    Drive Type: Front Wheel Drive (FWD) <br />
                    Mileage: 68,000 km (low mileage) <br />
                    Color: BlackInterior: Clean black leather <br />
                    seats <br />
                    Features: <br /> <li>Keyless entry</li> <br />{" "}
                    <li>Reverse camera</li> <br /> <li>Chilling A/C</li> <br />{" "}
                    <li>Alloy wheels</li> <br />
                    <li> Touchscreen display</li> <br />{" "}
                    <li>Bluetooth & USB audio</li> <br />
                    <li>Good tires and suspension</li> <br />
                    <li>Verified papers and custom duty</li> <br /> Location:
                    Ogudu, Lagos <br />
                    Posted: 1 hour ago <br />
                    Price: ₦4,000,000 <br /> (Negotiable) <br />
                    Condition Note: No single repaint. Buy and drive — nothing
                    to fix.
                  </span>
                )}
                {activeTab === "outstanding-issues" && (
                  <span>Nothing here</span>
                )}
              </div>
            </div>
          </div>
          <div className="w-[30%] flex flex-col gap-y-4">
            <div className="flex items-start p-5 rounded-xl justify-between w-full bg-white shadow-box">
              <div className="flex flex-col items-start gap-y-1">
                <span className="text-2xl font-semibold text-primary-300">
                  ₦40,000
                </span>

                <div className="w-fit h-fit border border-[#E9EAEB] rounded-lg p-1.5 text-xs font-medium text-primary-300">
                  Market Price: 35M - 60M
                </div>
              </div>
              <div className="w-fit h-fit bg-[#07B4631A]  rounded-lg p-1.5 text-xs font-medium text-global-green">
                Negotiable
              </div>
            </div>
            <div className="w-full bg-white shadow-box rounded-xl">
              <div className="px-5 py-3 border-b border-[#E9EAEB] w-full flex items-center justify-between">
                <span className="text-primary-300 font-semibold text-sm">
                  Seller Information
                </span>
                <div className="w-fit h-fit bg-[#FF3B301A]  rounded-lg p-1.5 text-xs font-medium text-[#FF3B30]">
                  20 Feedbacks
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-x-2">
                  <div className="relative">
                    <img src={PROFILE} className="w-[60px] h-[60px]" alt="" />
                    <div className="border-4 w-[15px] h-[15px] right-0 top-10 bg-global-green absolute rounded-full border-white"></div>
                  </div>
                  <div className="flex flex-col items-start gap-y-1">
                    <span className="text-[16px] font-semibold text-primary-300">
                      PocoLee Cars
                    </span>
                    <div className="flex items-center gap-x-2">
                      <img
                        src={VERIFIED}
                        className="w-[16px] h-[16px]"
                        alt=""
                      />
                      <span className="text-[#75757A] text-xs font-medium">
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <img
                        src={SINGLE_USER}
                        className="w-[16px] h-[16px]"
                        alt=""
                      />
                      <span className="text-[#75757A] text-xs font-medium">
                        8 months on NEDZL
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-col w-full gap-y-2">
                  <Button
                    title="Show Seller Contact"
                    btnStyles="w-full bg-global-green rounded-xl h-[40px]"
                    textStyle="text-white fon-medium text-sm"
                    handleClick={() => {}}
                  />
                  <Button
                    title="Let Us Handle It"
                    btnStyles="w-full border border-[#E9EAEB] rounded-xl h-[40px]"
                    textStyle="text-primary-300 font-medium text-sm"
                    handleClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductRow
        title="Similar Adverts"
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      />
    </MainLayout>
  );
}

export default ProductDetails;
