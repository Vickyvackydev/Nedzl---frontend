/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from "react";

import { FaCheck, FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { MdPhone, MdEmail, MdArrowBack } from "react-icons/md";

import { motion } from "framer-motion";

import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import AuthLayout from "../../layout/Authlayout";
import {
  CHECK_GREEN,
  GOOGLE_ICON,
  NEDZL_LOGO_GREEN,
  PAD_LOCK,
} from "../../assets";
import Button from "../../components/Button";
import { register } from "../../services/auth.service";
import toast from "react-hot-toast";
import SEO from "../../components/SEO";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [studentIdCard, setStudentIdCard] = useState<File | null>(null);
  const [searchParams] = useSearchParams();

  const ref = searchParams.get("ref");
  const emailParam = searchParams.get("email");

  const [authMethod, setAuthMethod] = useState<"SELECT" | "EMAIL">(
    emailParam ? "EMAIL" : "SELECT"
  );

  const [formInput, setFormInput] = useState({
    user_name: "",
    email: emailParam || "",
    password: "",
    confirm_password: "",
    phone_number: "",
    referral_code: ref,
  });

  useEffect(() => {
    if (emailParam) {
      setFormInput((prev) => ({ ...prev, email: emailParam }));
      setAuthMethod("EMAIL");
    }
  }, [emailParam]);

  const handleGoogleLogin = () => {
    const clientID =
      import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
    const redirectUri = window.location.origin + "/login";
    const scope = "email profile openid";
    const state = "google";
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&state=${state}`;
    window.location.href = url;
  };

  const handleFacebookLogin = () => {
    const clientID =
      import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID";
    const redirectUri = window.location.origin + "/login";
    const scope = "public_profile,email";
    const state = "facebook";
    const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&state=${state}`;
    window.location.href = url;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      let inputNumber = value.replace(/\D/g, ""); // remove non-numeric values

      if (inputNumber.length > 11) inputNumber = inputNumber.slice(0, 11);
      setFormInput((prev) => ({
        ...prev,
        phone_number: inputNumber,
      }));
    } else {
      setFormInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const disbled =
    formInput.user_name === "" ||
    formInput.email === "" ||
    !passwordPattern.test(formInput.password) ||
    formInput.phone_number === "";

  const passwordChecker = {
    uppercase: /[A-Z]/.test(formInput.password),
    eightInLength: formInput.password.length >= 8,
    number: /\d/.test(formInput.password),
    specialCharacter: /[!@#$%^&*]/.test(formInput.password),
  };

  const checkers = [
    passwordChecker.eightInLength,
    passwordChecker.uppercase,
    passwordChecker.number,
    passwordChecker.specialCharacter,
  ];

  const reset = () =>
    setFormInput({
      user_name: "",
      email: "",
      password: "",
      phone_number: "",
      confirm_password: "",
      referral_code: "",
    });

  const handleRegister = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_name", formInput.user_name);
      formData.append("email", formInput.email);
      formData.append("password", formInput.password);
      formData.append("phone_number", formInput.phone_number);
      formData.append("role", "USER");
      if (formInput.referral_code) {
        formData.append("referral_code", formInput.referral_code);
      }
      if (studentIdCard) {
        formData.append("student_id_card", studentIdCard);
      }

      const response = await register(formData);
      if (response) {
        toast.success(response.message);
        window.history.pushState({}, "", "/email-sent");
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        reset();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Register"
        description="Create a new Nedzl account."
        noindex={true}
      />
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="lg:w-[30rem] w-full h-auto lg:mt-0 mt-10 shadow-box rounded-lg lg:p-10 p-5 flex flex-col justify-center gap-y-6 items-center"
        >
          <div className="flex flex-col items-center justify-center gap-y-2 w-full">
            <Link to={"/"}>
              <img
                src={NEDZL_LOGO_GREEN}
                className="w-[130px] h-[33.41px]"
                alt=""
              />
            </Link>
            <span className="text-2xl font-bold text-primary-300">
              Create account
            </span>
            <span className="text-primary-300 font-normal text-sm">
              Already have an account?{" "}
              <span
                className="text-global-green font-medium cursor-pointer"
                onClick={() => navigate("/login", { state: location.state })}
              >
                Login
              </span>
            </span>
          </div>

          {authMethod === "SELECT" ? (
            <div className="flex flex-col gap-y-4 w-full my-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-x-3 w-full border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-all font-semibold text-sm text-[#4F5762] cursor-pointer shadow-sm"
              >
                <img src={GOOGLE_ICON} className="w-5 h-5" alt="" />
                <span>Sign up with Google</span>
              </button>

              <button
                type="button"
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-x-3 w-full border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-all font-semibold text-sm text-[#4F5762] cursor-pointer shadow-sm"
              >
                <FaFacebook size={20} className="text-[#1877F2]" />
                <span>Sign up with Facebook</span>
              </button>

              <div className="flex items-center my-2 w-full">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider font-medium">
                  Or
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => setAuthMethod("EMAIL")}
                className="flex items-center justify-center gap-x-3 w-full bg-global-green hover:bg-emerald-600 text-white rounded-xl py-3 transition-all font-semibold text-sm cursor-pointer shadow-md"
              >
                <MdEmail size={20} />
                <span>Sign up with Email</span>
              </button>
            </div>
          ) : (
            <form
              action=""
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-y-4 w-full"
            >
              <button
                type="button"
                onClick={() => setAuthMethod("SELECT")}
                className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-global-green self-start transition-colors"
              >
                <MdArrowBack size={16} />
                <span>Change signup method</span>
              </button>

              <div className="flex lg:flex-row flex-col gap-y-3 items-start w-full gap-x-4">
                <div className="flex flex-col items-start w-full gap-y-1">
                  <span className="text-sm font-medium text-[#4F5762]">
                    Username
                  </span>
                  <div className="w-full h-[48px] rounded-xl px-3 border border-borderColor shadow-input flex items-center gap-x-2">
                    <input
                      type="text"
                      name="user_name"
                      value={formInput.user_name}
                      onChange={handleInputChange}
                      placeholder="Username"
                      className="bg-transparent placeholder:text-sm w-full outline-none text-primary-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-y-1">
                <span className="text-sm font-medium text-[#4F5762]">Email</span>
                <div className="w-full h-[48px] rounded-xl px-3 border border-borderColor shadow-input flex items-center gap-x-2">
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={formInput.email}
                    onChange={handleInputChange}
                    className="bg-transparent placeholder:text-sm w-full outline-none text-primary-300"
                  />
                </div>
                {formInput.email && !emailRegex.test(formInput.email) && (
                  <span className="text-xs font-normal text-red-500">
                    Kindly use a valid email address
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start w-full gap-y-1">
                <span className="text-sm font-medium text-[#4F5762]">
                  Phone Number
                </span>
                <div className="w-full h-[48px] rounded-xl px-3 border border-borderColor shadow-input flex items-center gap-x-2">
                  <MdPhone size={20} color="#808080" />
                  <input
                    type="text"
                    name="phone_number"
                    value={formInput.phone_number}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="bg-transparent placeholder:text-sm w-full outline-none text-primary-300"
                  />
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-y-1">
                <span className="text-sm font-medium text-[#4F5762]">
                  Password
                </span>
                <div className="w-full h-[48px] justify-between rounded-xl px-3 border border-borderColor shadow-input flex items-center gap-x-2">
                  <div className="flex items-center gap-x-2">
                    <img src={PAD_LOCK} className="w-[20px] h-[20px]" alt="" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formInput.password}
                      onChange={handleInputChange}
                      placeholder="******************"
                      className="bg-transparent placeholder:text-sm w-full outline-none text-primary-300"
                    />
                  </div>
                  {showPassword ? (
                    <span
                      className="cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    >
                      <FaEyeSlash color="#808080" />
                    </span>
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    >
                      <FaEye color="#808080" />
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-start justify-between w-full">
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-1">
                      {checkers[0] ? (
                        <img
                          src={CHECK_GREEN}
                          className="w-[16px] h-[16px]"
                          alt=""
                        />
                      ) : (
                        <div className="w-[16px] h-[16px] rounded-full border border-borderColor" />
                      )}
                      <span className="text-xs font-normal text-primary-300">
                        Atleast 8 characters
                      </span>
                    </div>

                    <div className="flex items-center gap-x-1">
                      {checkers[1] ? (
                        <img
                          src={CHECK_GREEN}
                          className="w-[16px] h-[16px]"
                          alt=""
                        />
                      ) : (
                        <div className="w-[16px] h-[16px] rounded-full border border-borderColor" />
                      )}
                      <span className="text-xs font-normal text-primary-300">
                        Atleast one uppercase
                      </span>
                    </div>

                    <div className="flex items-center gap-x-1">
                      {checkers[2] ? (
                        <img
                          src={CHECK_GREEN}
                          className="w-[16px] h-[16px]"
                          alt=""
                        />
                      ) : (
                        <div className="w-[16px] h-[16px] rounded-full border border-borderColor" />
                      )}
                      <span className="text-xs font-normal text-primary-300">
                        Atleast one number
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-1">
                    {checkers[3] ? (
                      <img
                        src={CHECK_GREEN}
                        className="w-[16px] h-[16px]"
                        alt=""
                      />
                    ) : (
                      <div className="w-[16px] h-[16px] rounded-full border border-borderColor" />
                    )}
                    <span className="text-xs font-normal text-primary-300">
                      Atleast one special character (!@#$%)
                    </span>
                  </div>
                </div>

                {formInput.password &&
                  !passwordPattern.test(formInput.password) && (
                    <span className="text-xs font-normal text-red-500">
                      Password must contain uppercase, lowercase, a number, and a
                      special character.
                    </span>
                  )}
              </div>

              <div className="flex flex-col items-start w-full gap-y-1">
                <span className="text-sm font-medium text-[#4F5762]">
                  Confirm Password
                </span>
                <div className="w-full h-[48px] justify-between rounded-xl px-3 border border-borderColor shadow-input flex items-center gap-x-2">
                  <div className="flex items-center gap-x-2">
                    <img src={PAD_LOCK} className="w-[20px] h-[20px]" alt="" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formInput.confirm_password}
                      onChange={handleInputChange}
                      placeholder="******************"
                      className="bg-transparent placeholder:text-sm w-full outline-none text-primary-300"
                    />
                  </div>
                  {showConfirmPassword ? (
                    <span
                      className="cursor-pointer"
                      onClick={() => setShowConfirmPassword(false)}
                    >
                      <FaEyeSlash color="#808080" />
                    </span>
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={() => setShowConfirmPassword(true)}
                    >
                      <FaEye color="#808080" />
                    </span>
                  )}
                </div>

                {formInput.confirm_password &&
                  formInput.confirm_password !== formInput.password && (
                    <span className="text-xs font-normal text-red-500">
                      Password must match
                    </span>
                  )}
              </div>

              <div className="flex flex-col items-start w-full gap-y-1">
                <span className="text-sm font-medium text-[#4F5762]">
                  Referral Code
                </span>
                <div className="w-full h-[48px] rounded-xl px-3 border border-borderColor shadow-input flex items-center gap-x-2">
                  <input
                    type="text"
                    placeholder="Referral Code (optional)"
                    name="referral_code"
                    value={formInput.referral_code as string}
                    onChange={handleInputChange}
                    className="bg-transparent placeholder:text-sm w-full outline-none text-primary-300"
                  />
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-y-1">
                <span className="text-sm font-medium text-[#4F5762]">
                  Are you a student? upload ur student id here (Optional)
                </span>
                <div className="w-full h-[48px] rounded-xl px-3 border border-borderColor shadow-input flex items-center gap-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setStudentIdCard(e.target.files[0]);
                      }
                    }}
                    className="bg-transparent text-sm w-full outline-none text-primary-300 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-global-green file:text-white hover:file:bg-green-700"
                  />
                </div>
              </div>

              <div
                className="flex items-center gap-x-3 cursor-pointer"
                onClick={() => setChecked((prev) => !prev)}
              >
                <div className="min-w-[20px] min-h-[20px] border border-[#D2D5DA] rounded flex items-center justify-center">
                  {checked && <FaCheck color="#07b463" size={15} />}
                </div>
                <span className="lg:text-sm text-xs font-normal text-primary-50">
                  By clicking, you accept our{" "}
                  <span
                    onClick={() => navigate("/terms-of-service")}
                    className="text-global-green cursor-pointer font-medium"
                  >
                    Terms of service
                  </span>{" "}
                  and{" "}
                  <span
                    onClick={() => navigate("/privacy-policy")}
                    className="text-global-green cursor-pointer font-medium"
                  >
                    Privacy policy
                  </span>
                </span>
              </div>

              <Button
                title={"Create Account"}
                loading={loading}
                disabled={loading || disbled || !checked}
                btnStyles={"bg-global-green rounded-lg w-full mt-5 h-[45px]"}
                textStyle={"text-white text-[16px] text-semibold"}
                handleClick={handleRegister}
              />
            </form>
          )}
        </motion.div>
      </AuthLayout>
    </>
  );
}

export default Register;
