import React, { useState, useEffect } from "react";

import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";

import { motion } from "framer-motion";

import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import AuthLayout from "../../layout/Authlayout";
import { GOOGLE_ICON, NEDZL_LOGO_GREEN, PAD_LOCK } from "../../assets";
import Button from "../../components/Button";
import {
  login,
  loginWithGoogle,
  loginWithFacebook,
} from "../../services/auth.service";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../state/slices/authReducer";
import SEO from "../../components/SEO";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectPath =
    location.state?.from || searchParams.get("redirect") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });

  const [socialLoading, setSocialLoading] = useState(false);
  const [socialProvider, setSocialProvider] = useState("");

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

  const handleSocialLogin = async (accessToken: string, provider: string) => {
    setSocialLoading(true);
    setSocialProvider(provider);
    try {
      let response;
      if (provider === "google") {
        response = await loginWithGoogle(accessToken);
      } else {
        response = await loginWithFacebook(accessToken);
      }

      if (response) {
        toast.success(response?.message);
        dispatch(setToken(response?.data?.token));
        dispatch(setUser(response?.data?.user));

        if (response?.data?.user?.role === "ADMIN") {
          navigate("/admin/overview");
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Social Login failed",
      );
    } finally {
      setSocialLoading(false);
      setSocialProvider("");
    }
  };

  useEffect(() => {
    let accessToken: string | null = null;
    let state: string | null = null;

    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const cleanHash = hash.replace(/#_=_$/, "").replace(/^#/, "");
      const params = new URLSearchParams(cleanHash);
      accessToken = params.get("access_token") || params.get("id_token");
      state = params.get("state");
    }

    if (!accessToken) {
      const searchParams = new URLSearchParams(window.location.search);
      accessToken = searchParams.get("access_token") || searchParams.get("code");
      state = searchParams.get("state");
    }

    if (state) {
      state = state.replace(/#.*$/, "").trim();
    }

    if (accessToken && (state === "google" || state === "facebook")) {
      window.history.replaceState(null, "", window.location.pathname);
      handleSocialLogin(accessToken, state);
    }
  }, []);

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

        if (response?.data?.user?.role === "ADMIN") {
          navigate("/admin/overview");
        } else {
          navigate(redirectPath, { replace: true });
        }

        reset();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (socialLoading) {
    return (
      <div className="flex flex-col space-y-3 h-screen justify-center items-center">
        <div className="w-8 h-8 border-4 border-global-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-600">
          Signing in with {socialProvider}...
        </p>
      </div>
    );
  }

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
              Welcome Back
            </span>
            <span className="text-primary-300 font-normal text-sm">
              Dont have an account?{" "}
              <span
                className="text-global-green font-medium cursor-pointer"
                onClick={() => navigate("/register", { state: location.state })}
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

            <div className="w-full flex items-center justify-end">
              <span
                className="text-sm font-medium text-global-green cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </div>

            <Button
              title={"Login"}
              loading={loading}
              disabled={loading || disbled}
              btnStyles={"bg-global-green rounded-lg w-full mt-5 h-[45px]"}
              textStyle={"text-white text-[16px] text-semibold"}
              handleClick={handleLogin}
            />

            <div className="flex items-center my-2 w-full">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-wider font-medium">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-x-2 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-all font-medium text-sm text-[#4F5762] cursor-pointer"
              >
                <img src={GOOGLE_ICON} className="w-5 h-5" alt="" />
                Google
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-x-2 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-all font-medium text-sm text-[#4F5762] cursor-pointer"
              >
                <FaFacebook size={18} className="text-[#1877F2]" />
                Facebook
              </button>
            </div>
          </form>
        </motion.div>
      </AuthLayout>
    </>
  );
}

export default Login;
