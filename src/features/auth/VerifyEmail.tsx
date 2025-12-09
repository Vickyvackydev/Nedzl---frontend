import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../services/auth.service";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function EmailVerificationLoading() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleVerifyEmail = async () => {
    try {
      const response = await verifyEmail(token as string);
      if (response) {
        navigate("/auth/verify/success");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Email verification failed. Please try again."
      );
      navigate("/login");
    }
  };

  useEffect(() => {
    if (token) {
      handleVerifyEmail();
    }
  }, []);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center w-[320px]">
        <div className="w-14 h-14 rounded-full border-4 border-[#07B463]/20 border-t-[#07B463] animate-spin flex items-center justify-center mb-4">
          <Loader2 className="text-[#07B463] animate-pulse" size={28} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Verifying your email
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Please wait while we confirm your email address…
        </p>
      </div>
    </div>
  );
}
