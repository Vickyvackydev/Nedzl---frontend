import { CheckCircle } from "lucide-react";

export default function CheckEmailVerification() {
  // Colors
  const brandGreen = "#07b463";
  const brandBg = "#F5F5F5";
  // const email = "vickyvacky5@gmail.com";
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: brandBg }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle size={70} strokeWidth={1.5} color={brandGreen} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: brandGreen }}>
          Verify Your Email
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          We’ve sent a verification link to your email. Please check your inbox
          and click the link to activate your account.
        </p>
      </div>
    </div>
  );
}
