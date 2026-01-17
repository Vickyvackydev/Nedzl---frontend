import React, { useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/Authlayout";
import { NEDZL_LOGO_GREEN, PAD_LOCK } from "../../assets";
import Button from "../../components/Button";
import { login } from "../../services/auth.service";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../state/slices/authReducer";
import SEO from "../../components/SEO";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const disbled = formInput.email === "" || formInput.password === "";

  const reset = () =>
    setFormInput({
      email: "",
      password: "",
    });
  const handleLogin = async () => {
    setLoading(true);
    try {
      const payload = {
        email: formInput.email,
        password: formInput.password,
      };

      const response = await login(payload);
      if (response) {
        toast.success(response?.message);
        dispatch(setToken(response?.data?.token));
        dispatch(setUser(response?.data?.user));

        // window.history.pushState({}, "", "/dashboard");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
        if (response?.data?.user?.role === "ADMIN") {
          navigate("/admin/overview");
        } else {
          navigate("/dashboard");
        }

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
      <SEO title="Login" description="Login to your Nedzl account." />
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
              Welcome Back
            </span>
            <span className="text-primary-300 font-normal text-sm">
              Dont have an account?{" "}
              <span
                className="text-global-green font-medium cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Create an account
              </span>
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
            </div>

            <Button
              title={"Login"}
              loading={loading}
              disabled={loading || disbled}
              btnStyles={"bg-global-green rounded-lg w-full mt-5 h-[45px]"}
              textStyle={"text-white text-[16px] text-semibold"}
              handleClick={handleLogin}
            />
          </form>
        </motion.div>
      </AuthLayout>
    </>
  );
}

export default Login;
