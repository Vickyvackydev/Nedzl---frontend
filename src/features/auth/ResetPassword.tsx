import React, { useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { motion } from "framer-motion";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../layout/Authlayout";
import { CHECK_GREEN, NEDZL_LOGO_GREEN, PAD_LOCK } from "../../assets";
import Button from "../../components/Button";
import { resetPassword } from "../../services/auth.service";
import toast from "react-hot-toast";
import SEO from "../../components/SEO";

function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formInput, setFormInput] = useState({
    password: "",
    confirmPassword: "",
  });
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const disbled = formInput.password === "" || formInput.confirmPassword === "";

  const reset = () =>
    setFormInput({
      password: "",
      confirmPassword: "",
    });
  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const payload = {
        token: token as string,
        password: formInput.password,
      };

      const response = await resetPassword(payload);
      if (response) {
        toast.success(response?.message);

        navigate("/login");

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
        title="Login"
        description="Login to your Nedzl account."
        noindex={true}
      />
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="lg:w-[30rem] w-full h-auto lg:mt-0 mt-10 shadow-box rounded-lg lg:p-10 p-5 flex flex-col justify-center gap-y-6 items-center"
        >
          <div className="flex flex-col items-center justify-center gap-y-2 ">
            <Link to="/">
              <img
                src={NEDZL_LOGO_GREEN}
                className="w-[130px] h-[33.41px]"
                alt=""
              />
            </Link>
            <span className="text-2xl font-bold text-primary-300">
              Reset Password
            </span>
            <span className="text-primary-300 font-normal text-sm">
              Reset your password to continue
            </span>
          </div>
          <form
            action=""
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-y-4 w-full"
          >
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
                    className="bg-transparent placeholder:text-sm  w-full outline-none text-primary-300"
                  />
                </div>
                {showPassword ? (
                  <span
                    className="cursor-pointer "
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
                    name="confirmPassword"
                    value={formInput.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="******************"
                    className="bg-transparent placeholder:text-sm  w-full outline-none text-primary-300"
                  />
                </div>
                {showConfirmPassword ? (
                  <span
                    className="cursor-pointer "
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
              {formInput.confirmPassword &&
                formInput.confirmPassword !== formInput.password && (
                  <span className="text-xs font-normal text-red-500">
                    Password must match
                  </span>
                )}
            </div>

            <Button
              title={"Continue"}
              loading={loading}
              disabled={loading || disbled}
              btnStyles={"bg-global-green rounded-lg w-full mt-5 h-[45px]"}
              textStyle={"text-white text-[16px] text-semibold"}
              handleClick={handleResetPassword}
            />
          </form>
        </motion.div>
      </AuthLayout>
    </>
  );
}

export default ResetPassword;
