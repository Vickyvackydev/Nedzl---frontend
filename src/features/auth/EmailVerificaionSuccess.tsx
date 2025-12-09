import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerifiedSuccess() {
  const navigate = useNavigate();
  const brandGreen = "#07b463";
  const brandBg = "#F5F5F5";
  // Optional Auto Redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: brandBg }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-gray-200 animate-fadeIn">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle size={70} strokeWidth={1.5} color={brandGreen} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: brandGreen }}>
          Email Verified Successfully
        </h1>
        <p className="text-gray-600 text-base mb-6 leading-relaxed">
          Your email has been verified. You can now log in and continue.
        </p>
        <button
          className="w-full py-3 rounded-xl text-white font-semibold shadow-md hover:opacity-90 transition"
          style={{ backgroundColor: brandGreen }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
