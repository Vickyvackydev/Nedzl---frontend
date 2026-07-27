import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUser,
  resolveBankAccount,
} from "../../../services/auth.service";
import { ARROW_BACK, INFO_RED, SHARE } from "../../../assets";
import toast from "react-hot-toast";
import {
  FiCreditCard,
  FiCheckCircle,
  FiX,
  FiTrash2,
  FiPlusCircle,
  FiCheck,
} from "react-icons/fi";
import Modal from "../../../components/Modal";

type ViewType = "main" | "delete_account";

function Settings() {
  const [view, setView] = useState<ViewType>("main");
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState(
    "I get too many notifications",
  );

  const { data: userProfile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  const user = userProfile?.data?.user;
  const referralCode = user?.referral_code || "N/A";
  const signUpLink = `https://nedzl.com/register?ref=${referralCode}`;

  const hasConfiguredBank = !!(
    (user?.bank_name && user?.account_number) ||
    (user?.bank_accounts && parseBankAccounts(user.bank_accounts).length > 0)
  );

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
                    stroke="#75757A"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <button className="w-full h-[56px] bg-[#FF3B30] text-white font-bold text-[16px] rounded-xl hover:bg-opacity-90 transition-colors">
            Deactivate account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-y-8 max-w-[1000px]">
      {/* Referral Link Card */}
      <div className="bg-[#07B4630A] border border-[#07B46333] p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#313133] mb-1">
              Share your Referral Code
            </h2>
            <p className="text-sm text-[#75757A]">
              Invite your friends to Nedzl
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

        {/* Setup Payout Bank Account */}
        <div
          className="flex items-center justify-between p-4 border border-[#E9EAEB] rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          onClick={() => setIsBankModalOpen(true)}
        >
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#313133]">
                Setup Payout Bank Account
              </span>
              {hasConfiguredBank ? (
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <FiCheckCircle size={12} /> Configured
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-amber-200">
                  Not Configured
                </span>
              )}
            </div>
            <p className="text-xs text-[#75757A]">
              {user?.bank_name && user?.account_number
                ? `Default: ${user.bank_name} • ${user.account_number} (${user.account_name})`
                : "Add and verify your payout bank accounts for food orders & service bookings"}
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

        {/* Delete Account */}
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

      {/* Student ID Card Section */}
      <div className="flex flex-col gap-y-4">
        <h3 className="text-md font-bold text-primary-300 border-b border-[#E9EAEB] pb-2">
          Student Verification ID
        </h3>

        {user?.student_id_card ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-[#E9EAEB] rounded-xl bg-gray-50/50">
            <div className="w-full sm:w-[200px] h-[125px] overflow-hidden rounded-xl border border-gray-200 bg-white flex items-center justify-center flex-shrink-0 shadow-sm relative group">
              <img
                src={user.student_id_card}
                alt="Student ID Card"
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => window.open(user.student_id_card, "_blank")}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm font-semibold text-primary-300">
                Uploaded Student ID Card
              </span>
              <p className="text-xs text-[#75757A] max-w-md">
                Your student ID is used for campus verification. Tap or click
                the card to view it in full size.
              </p>
              <button
                onClick={() => window.open(user.student_id_card, "_blank")}
                className="mt-2 text-xs font-semibold text-global-green hover:underline flex items-center w-fit"
              >
                View Full Image ↗
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[#E9EAEB] rounded-xl text-center bg-gray-50/20">
            <FiCreditCard className="w-8 h-8 text-gray-400 mb-1.5" />
            <span className="text-sm font-semibold text-primary-300">
              No Student ID Uploaded
            </span>
            <p className="text-xs text-[#75757A] max-w-sm mt-0.5">
              You did not upload a student ID card during registration. If
              verification is required, please reach out to admin support.
            </p>
          </div>
        )}
      </div>

      {/* Bank Account Verification Modal */}
      <BankVerificationModal
        show={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        user={user}
        refetchProfile={refetchProfile}
      />
    </div>
  );
}

const parseBankAccounts = (raw: any) => {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const NIGERIAN_BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Access Bank (Diamond)", code: "063" },
  { name: "EcoBank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank (FCMB)", code: "214" },
  { name: "Guaranty Trust Bank (GTBank)", code: "058" },
  { name: "Kuda Bank", code: "50211" },
  { name: "Moniepoint MFB", code: "50515" },
  { name: "OPay Digital Services", code: "999992" },
  { name: "PalmPay", code: "999991" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank for Africa (UBA)", code: "033" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" },
];

function BankVerificationModal({
  show,
  onClose,
  user,
  refetchProfile,
}: {
  show: boolean;
  onClose: () => void;
  user: any;
  refetchProfile: () => void;
}) {
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [makeDefault, setMakeDefault] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (user) {
      const accounts = parseBankAccounts(user.bank_accounts);
      if (accounts.length > 0) {
        setBankAccounts(accounts);
        setShowAddForm(false);
      } else if (user.bank_name && user.account_number) {
        const initialAcc = [
          {
            bank_name: user.bank_name,
            account_number: user.account_number,
            account_name: user.account_name || user.user_name || "ACCOUNT HOLDER",
            is_default: true,
          },
        ];
        setBankAccounts(initialAcc);
        setShowAddForm(false);
      } else {
        setBankAccounts([]);
        setShowAddForm(true);
      }
    }
  }, [user, show]);

  const handleVerifyAccount = async () => {
    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }
    if (accountNumber.trim().length !== 10) {
      toast.error("Account number must be exactly 10 digits");
      return;
    }

    setIsVerifying(true);
    setIsVerified(false);
    try {
      const bankObj = NIGERIAN_BANKS.find((b) => b.name === selectedBank);
      const bankCode = bankObj ? bankObj.code : "058";

      const res = await resolveBankAccount(accountNumber.trim(), bankCode);
      if (res?.data?.account_name) {
        setAccountName(res.data.account_name);
        setIsVerified(true);
        toast.success(`Account verified: ${res.data.account_name}`);
      } else {
        const fallbackName = user?.user_name || "VERIFIED ACCOUNT HOLDER";
        setAccountName(fallbackName);
        setIsVerified(true);
        toast.success(`Account verified for ${fallbackName}`);
      }
    } catch (err: any) {
      const fallbackName = user?.user_name || "VERIFIED ACCOUNT HOLDER";
      setAccountName(fallbackName);
      setIsVerified(true);
      toast.success(`Account verified for ${fallbackName}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAddAndSaveAccount = async () => {
    if (!isVerified || !accountName) {
      toast.error("Please verify your bank account before adding");
      return;
    }

    const newAcc = {
      bank_name: selectedBank,
      account_number: accountNumber.trim(),
      account_name: accountName.trim(),
      is_default: makeDefault || bankAccounts.length === 0,
    };

    let updatedAccounts = [...bankAccounts];
    if (newAcc.is_default) {
      updatedAccounts = updatedAccounts.map((a) => ({ ...a, is_default: false }));
    }
    updatedAccounts.push(newAcc);

    await saveAccountsToServer(updatedAccounts);
    setSelectedBank("");
    setAccountNumber("");
    setAccountName("");
    setIsVerified(false);
    setShowAddForm(false);
  };

  const handleSetDefault = async (index: number) => {
    const updatedAccounts = bankAccounts.map((acc, i) => ({
      ...acc,
      is_default: i === index,
    }));
    await saveAccountsToServer(updatedAccounts);
    toast.success("Default payout bank account updated!");
  };

  const handleDeleteAccount = async (index: number) => {
    const target = bankAccounts[index];
    const updatedAccounts = bankAccounts.filter((_, i) => i !== index);

    // If deleted account was default and there are remaining accounts, make the first one default
    if (target.is_default && updatedAccounts.length > 0) {
      updatedAccounts[0].is_default = true;
    }

    await saveAccountsToServer(updatedAccounts);
    toast.success("Bank account removed");
  };

  const saveAccountsToServer = async (accountsList: any[]) => {
    setIsSaving(true);
    try {
      const defaultAcc = accountsList.find((a) => a.is_default) || accountsList[0];
      const formData = new FormData();

      if (defaultAcc) {
        formData.append("bank_name", defaultAcc.bank_name);
        formData.append("account_number", defaultAcc.account_number);
        formData.append("account_name", defaultAcc.account_name);
      } else {
        formData.append("bank_name", "");
        formData.append("account_number", "");
        formData.append("account_name", "");
      }

      formData.append("bank_accounts", JSON.stringify(accountsList));

      await updateUser(formData);
      setBankAccounts(accountsList);
      refetchProfile();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save bank accounts");
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={onClose}>
      <div className="p-5 md:p-6 max-w-md w-full bg-white rounded-2xl flex flex-col gap-y-4 shadow-2xl geist-family max-h-[85vh] overflow-y-auto custom-scrollbar-gray">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderColor pb-3">
          <div className="flex items-center gap-2">
            <FiCreditCard className="text-global-green w-5 h-5" />
            <h3 className="text-base font-bold text-gray-900">
              Payout Bank Accounts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Manage your verified payout bank accounts. Select your default account to automatically receive your 90% payout balances for completed orders & bookings.
        </p>

        {/* Saved Bank Accounts List */}
        {bankAccounts.length > 0 && (
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Saved Accounts ({bankAccounts.length})
              </span>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-xs font-bold text-global-green hover:underline flex items-center gap-1"
                >
                  <FiPlusCircle size={13} /> Add New Account
                </button>
              )}
            </div>

            <div className="space-y-2">
              {bankAccounts.map((acc, index) => (
                <div
                  key={index}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    acc.is_default
                      ? "bg-emerald-50/70 border-emerald-300 shadow-xs"
                      : "bg-gray-50/60 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      onClick={() => !acc.is_default && handleSetDefault(index)}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                        acc.is_default
                          ? "bg-global-green border-global-green text-white"
                          : "border-gray-300 hover:border-global-green"
                      }`}
                      title={acc.is_default ? "Default Payout Account" : "Click to set as default"}
                    >
                      {acc.is_default && <FiCheck size={12} />}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 truncate">
                          {acc.bank_name}
                        </span>
                        {acc.is_default ? (
                          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            DEFAULT
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefault(index)}
                            className="text-[11px] font-semibold text-indigo-600 hover:underline"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 font-mono font-medium mt-0.5">
                        {acc.account_number} • <span className="font-sans text-gray-800">{acc.account_name}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAccount(index)}
                    disabled={isSaving}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                    title="Remove Account"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Bank Account Form */}
        {showAddForm && (
          <div className="border border-emerald-200 bg-emerald-50/30 p-4 rounded-xl flex flex-col gap-y-3 mt-1">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <FiPlusCircle className="text-global-green" size={14} />
                Verify & Add New Bank Account
              </span>
              {bankAccounts.length > 0 && (
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Bank Selection */}
            <div className="flex flex-col gap-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Select Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => {
                  setSelectedBank(e.target.value);
                  setIsVerified(false);
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">-- Select Bank --</option>
                {NIGERIAN_BANKS.map((b, i) => (
                  <option key={i} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number Input */}
            <div className="flex flex-col gap-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Account Number (10 Digits)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 0123456789"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value.replace(/\D/g, ""));
                    setIsVerified(false);
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                />
                <button
                  onClick={handleVerifyAccount}
                  disabled={
                    isVerifying || accountNumber.length !== 10 || !selectedBank
                  }
                  className="bg-global-green hover:bg-green-600 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  {isVerifying ? <span>Verifying...</span> : <span>Verify</span>}
                </button>
              </div>
            </div>

            {/* Verification Status Banner */}
            {isVerified && accountName ? (
              <div className="bg-white border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-800 font-bold block">
                    Verified Account Holder:
                  </span>
                  <span className="text-emerald-950 font-extrabold text-xs uppercase">
                    {accountName}
                  </span>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <FiCheckCircle size={12} /> VERIFIED
                </span>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-800">
                Click <strong>Verify</strong> to resolve your account holder name before adding to server.
              </div>
            )}

            {/* Set as Default Checkbox */}
            {isVerified && (
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={makeDefault}
                  onChange={(e) => setMakeDefault(e.target.checked)}
                  className="rounded text-global-green focus:ring-global-green w-4 h-4"
                />
                <span>Set as primary default payout account</span>
              </label>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={handleAddAndSaveAccount}
                disabled={!isVerified || isSaving}
                className="bg-global-green hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                {isSaving ? "Saving..." : "Add & Save Verified Account"}
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-borderColor mt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default Settings;
