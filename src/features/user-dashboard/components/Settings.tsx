import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../../services/auth.service";
import { ARROW_BACK, INFO_RED, SHARE } from "../../../assets";
import toast from "react-hot-toast";

type ViewType = "main" | "delete_account";

function Settings() {
  const [view, setView] = useState<ViewType>("main");
  const [deleteReason, setDeleteReason] = useState(
    "I get too many notifications",
  );

  const { data: userProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  const user = userProfile?.data?.user;
  const referralCode = user?.referral_code || "N/A";
  const signUpLink = `https://nedzl.com/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(signUpLink);
    toast.success("Referral link copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Nedzl",
          text: `Use my referral code ${referralCode} to sign up on Nedzl!`,
          url: signUpLink,
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (view === "delete_account") {
    return (
      <div className="w-full flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="flex items-center gap-x-3 p-4 border-b border-[#E9EAEB]">
          <button
            onClick={() => setView("main")}
            className="w-[32px] h-[32px] border border-borderColor rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <img src={ARROW_BACK} className="w-[16px] h-[16px]" alt="Back" />
          </button>
          <h2 className="text-[18px] font-semibold text-[#313133]">
            Delete my account forever
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-10 max-w-[600px] mx-auto w-full">
          <h3 className="text-[18px] font-bold text-center mb-6">
            Deactivating your NEDZL account will permanently delete it.
          </h3>

          <div className="bg-[#FFF1F1] p-4 rounded-xl flex items-start gap-3 w-full mb-8">
            <img src={INFO_RED} className="w-5 h-5 mt-0.5" alt="Info" />
            <p className="text-[14px] text-[#313133] leading-relaxed">
              You won't be able to log in again, and all your profile details
              and history will be erased with no option to recover them.
            </p>
          </div>

          <div className="w-full mb-8">
            <label className="text-[14px] font-medium text-[#313133] mb-2 block">
              Why do you want to leave
            </label>
            <div className="relative">
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full h-[56px] px-4 bg-white border border-[#E9EAEB] rounded-xl appearance-none text-[16px] text-[#313133] focus:outline-none focus:ring-2 focus:ring-global-green/20"
              >
                <option value="I get too many notifications">
                  I get too many notifications
                </option>
                <option value="Privacy concerns">Privacy concerns</option>
                <option value="Found a better platform">
                  Found a better platform
                </option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="#313133"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <button
            className="w-full h-[52px] bg-[#FF3B30] text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-button active:scale-[0.98]"
            onClick={() => {
              // Confirmation logic would go here
              toast.error(
                "Account deletion requested. This action is irreversible.",
              );
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-6 gap-y-8">
      {/* Referral Section */}
      <div className="bg-[#07B4630D] rounded-2xl p-6 border border-[#07B4631A]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-lg font-bold text-primary-300">
              Share your Referral Code
            </h3>
            <p className="text-sm text-[#75757A]">
              Invite your friends to Nedzl and earn rewards!
            </p>
          </div>
          <div className="flex items-center gap-x-3">
            <div className="bg-white border border-[#E9EAEB] px-4 py-2.5 rounded-xl font-bold text-global-green text-lg tracking-wider">
              {referralCode}
            </div>
            <button
              onClick={handleShare}
              className="bg-global-green text-white p-3 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
              title="Share Referral Link"
            >
              <img
                src={SHARE}
                className="w-5 h-5 invert cursor-pointer"
                alt="Share"
              />
              <span className="font-medium hidden sm:inline">Share Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="flex flex-col gap-y-4">
        <h3 className="text-md font-bold text-primary-300 border-b border-[#E9EAEB] pb-2">
          Account Settings
        </h3>

        <div
          className="flex items-center justify-between p-4 border border-[#E9EAEB] rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          onClick={() => setView("delete_account")}
        >
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-semibold text-[#FF3B30]">
              Delete Account
            </span>
            <p className="text-xs text-[#75757A]">
              Permanently remove your account and all data
            </p>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform group-hover:translate-x-1 transition-transform"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="#313133"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center gap-y-4 pt-10 mt-auto opacity-50">
        <div className="bg-[#07B4631A] p-4 rounded-full">
          <span className="text-2xl text-global-green">⚙️</span>
        </div>
        <div className="flex flex-col items-center gap-y-1 text-center">
          <h2 className="text-xl font-bold text-primary-300">More Settings</h2>
          <p className="text-xs text-[#75757A] font-medium">
            Additional settings coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
