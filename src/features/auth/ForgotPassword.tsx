import React, { useState } from "react";

import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/Authlayout";
import { NEDZL_LOGO_GREEN } from "../../assets";
import Button from "../../components/Button";
import { forgotPassword } from "../../services/auth.service";
import toast from "react-hot-toast";

import SEO from "../../components/SEO";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const disbled = formInput.email === "";

  const reset = () =>
    setFormInput({
      email: "",
    });
  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const payload = {
        email: formInput.email,
      };

      const response = await forgotPassword(payload);
      if (response) {
        toast.success("Password reset link sent to your email");
        navigate("/email-sent");
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
        title="Forgot Password"
        description="Forgot Password to your Nedzl account."
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
              Forgot Password
            </span>
            <span className="text-primary-300 font-normal text-sm">
              Enter your email address to reset your password
            </span>
          </div>
          <form
            action=""
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-y-4 w-full"
          >
            <div className="flex flex-col items-start w-full gap-y-1">
              <span className="text-sm font-medium text-[#4F5762]">Email</span>
              <div className="w-full h-[48px] rounded-xl px-3 border border-borderColor shadow-input flex items-center gap-x-2">
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={formInput.email}
                  onChange={handleInputChange}
                  className="bg-transparent placeholder:text-sm  w-full outline-none text-primary-300"
                />
              </div>
            </div>

            <Button
              title={"Verify"}
              loading={loading}
              disabled={loading || disbled}
              btnStyles={"bg-global-green rounded-lg w-full mt-5 h-[45px]"}
              textStyle={"text-white text-[16px] text-semibold"}
              handleClick={handleForgotPassword}
            />
          </form>
        </motion.div>
      </AuthLayout>
    </>
  );
}

export default ForgotPassword;
