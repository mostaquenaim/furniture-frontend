/* eslint-disable @typescript-eslint/no-unused-expressions */
// components/AuthModal.tsx
"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";

type ModalView =
  | "signin"
  | "signup"
  | "create-account"
  | "password-reset"
  | "enter-password"
  | "otp-verification";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: ModalView;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialView = "signin",
}: AuthModalProps) {
  const [view, setView] = useState<ModalView>(initialView);
  const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("+880");
  const [countryCode, setCountryCode] = useState("BD");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationTarget, setVerificationTarget] = useState<
    "email" | "phone"
  >("email");

  const [useMobileForSignin, setUseMobileForSignin] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const axiosPublic = useAxiosPublic();

  const validatePassword = (password: string) => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;

    const errorMessages = [];

    if (!minLength.test(password))
      errorMessages.push("Password must be at least 8 characters");
    if (!uppercase.test(password))
      errorMessages.push("Password must contain at least 1 uppercase letter");
    if (!lowercase.test(password))
      errorMessages.push("Password must contain at least 1 lowercase letter");
    if (!number.test(password))
      errorMessages.push("Password must contain at least 1 number");

    return errorMessages.length > 0 ? errorMessages.join(", ") : null; // valid
  };

  const handleMobileSignIn = () => {
    setUseMobileForSignin(!useMobileForSignin);
    // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosPublic.post(
        "/auth/signin",
        { email },
        {
          withCredentials: true,
        }
      );

      setView("enter-password");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosPublic.post(
        "/auth/signin",
        { email, password, keepSignedIn },
        {
          withCredentials: true, // credentials: "include"
        }
      );

      const data = res.data;

      if (data.otpSentTo) {
        setVerificationTarget(data.otpSentTo);
        handleView("otp-verification");
      } else {
        localStorage.setItem("token", data.token);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError("Invalid password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const res = await axiosPublic.post(
        "/auth/register",
        {
          email: email || "",
          phone: `+${countryCode === "BD" ? "880" : "1"}${mobileNumber}`,
          password,
          name: customerName,
          keepSignedIn,
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data;

      if (data.otpSentTo) {
        setVerificationTarget(data.otpSentTo);
        setView("otp-verification");
      } else {
        localStorage.setItem("token", data.token);
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosPublic.post(
        "/auth/verify-otp",
        {
          code: otp,
          keepSignedIn,
          emailOrPhone:
            verificationTarget === "email"
              ? email
              : `+${countryCode === "BD" ? "880" : "1"}${mobileNumber}`,
          type: verificationTarget,
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data;
      localStorage.setItem("token", data.token);
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // password reset / forgot password
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosPublic.post(
        "/auth/reset-password",
        useMobileForSignin
          ? { emailOrPhone: mobileNumber, type: "phone" }
          : { emailOrPhone: email, type: "email" }
      );

      alert("Password reset instructions sent!");
      setView("signin");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleView = (option: ModalView) => {
    setPassword("");
    setCustomerName("");
    setEmail("");
    setMobileNumber("");
    setView(option);
  };

  const passWordField = () => {
    return (
      <div className="mb-4">
        <label className="block text-sm mb-2">Password*</label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-sm blue-link hover:underline mt-2 cursor-pointer
          "
        >
          👁 {showPassword ? "Hide" : "Show"} Password
        </button>
        {/* {view === "signin" && (
          <button
            type="button"
            onClick={() => handleView("password-reset")}
            className="text-sm blue-link hover:underline mt-2 cursor-pointer inline-flex items-end
          "
          >
            Forgot Your Password?
          </button>
        )} */}
      </div>
    );
  };

  const keepMeSignedInInfo = () => {
    return (
      <div className="relative inline-block ml-1">
        <span
          onClick={() => setShowTooltip(!showTooltip)}
          className="text-gray-400 cursor-pointer select-none"
        >
          ⓘ
        </span>

        {showTooltip && (
          <div className="absolute z-50 top-7 left-1/2 -translate-x-1/2 w-64">
            {/* Tooltip box */}
            <div className="relative bg-gray-700 text-white text-xs p-3 rounded shadow-lg font-extralight">
              Selecting “keep me signed in” reduces the number of times you will
              be asked to sign in on this device. To keep your account secure,
              use this option only on your personal device.
              {/* Arrow */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 
                        border-l-8 border-r-8 border-b-8
                        border-l-transparent border-r-transparent
                        border-b-gray-700"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/20 transition-opacity duration-300 ease-out
    ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
  `}
    >
      <div
        className={`bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative
      transform-gpu transition  duration-300 ease-out
      ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
    `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="px-8 py-20">
          {view === "password-reset" && (
            <>
              <h2 className="text-2xl font-light text-center mb-6">
                Password Reset
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Please enter your email address and we'll send you instructions
                to reset your password.
              </p>

              <form onSubmit={handlePasswordReset}>
                <div className="mb-6">
                  <label className="block text-sm mb-2">
                    {useMobileForSignin ? "Phone*" : "Email*"}
                  </label>
                  <input
                    type={useMobileForSignin ? "text" : "email"}
                    value={useMobileForSignin ? mobileNumber : email}
                    onChange={(e) => {
                      useMobileForSignin
                        ? setMobileNumber(e.target.value)
                        : setEmail(e.target.value);
                    }}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* buttons */}
                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50"
                  >
                    {loading ? "SENDING..." : "RESET PASSWORD"}
                  </button>
                  {/* use mobile / email instead  */}
                  <button
                    type="button"
                    onClick={handleMobileSignIn}
                    className="w-full border border-gray-300 py-3 rounded hover:bg-gray-50 mb-4"
                  >
                    USE {!useMobileForSignin ? "MOBILE NUMBER" : "EMAIL"}{" "}
                    INSTEAD
                  </button>
                </div>
              </form>
            </>
          )}

          {view === "enter-password" && (
            <>
              <h2 className="text-2xl font-light text-center mb-6 border-b-2 heading">
                Sign In
              </h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                Enter your password to continue
              </p>
              <p className="text-sm text-center mb-6">
                {email}{" "}
                <button
                  onClick={() => handleView("signin")}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </p>

              <form onSubmit={handleSignIn}>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50 mb-4 heading"
                >
                  {loading ? "SIGNING IN..." : "NEXT"}
                </button>

                <button
                  type="button"
                  onClick={() => handleView("password-reset")}
                  className="w-full text-blue-600 hover:underline text-center"
                >
                  Forgot Your Password?
                </button>
              </form>

              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-light text-center mb-4 heading">
                  Sign Up
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Welcome! It's quick and easy to set up an account
                </p>
                <button
                  onClick={() => handleView("create-account")}
                  className="w-full border border-gray-700 text-gray-700 py-3 rounded hover:bg-gray-50 heading"
                >
                  CREATE AN ACCOUNT
                </button>
              </div>
            </>
          )}

          {view === "signin" && (
            <>
              <h2 className="text-2xl font-light text-center mb-6 border-b border-gray-200 heading">
                Sign In
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Sign in so you can save items to your wishlists, track your
                orders, and check out faster!
              </p>

              <form onSubmit={handleSignIn}>
                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    {useMobileForSignin ? "Phone*" : "Email*"}
                  </label>
                  {useMobileForSignin ? (
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Always enforce +880
                        if (!value.startsWith("+880")) {
                          value = "+880";
                        }

                        // Allow only numbers after +880
                        const rest = value.slice(4).replace(/\D/g, "");
                        setMobileNumber("+880" + rest);
                      }}
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
                      required
                      placeholder="+880"
                    />
                  ) : (
                    <input
                      type={"email"}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
                      required
                      placeholder={"example@gmail.com"}
                    />
                  )}
                </div>

                {/* password  */}
                {passWordField()}

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="keepSignedIn"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="keepSignedIn" className="text-sm">
                    Keep me signed in
                  </label>
                  {keepMeSignedInInfo()}
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50 heading"
                >
                  {loading ? "LOADING..." : "NEXT"}
                </button>

                <p className="flex justify-center items-center w-full pb-4">
                  <button
                    type="button"
                    onClick={() => handleView("password-reset")}
                    className="text-sm blue-link hover:underline mt-2 cursor-pointer
          "
                  >
                    Forgot Your Password?
                  </button>
                </p>

                <button
                  type="button"
                  onClick={handleMobileSignIn}
                  className="w-full border border-gray-300 py-3 rounded hover:bg-gray-50 mb-4"
                >
                  USE {!useMobileForSignin ? "MOBILE NUMBER" : "EMAIL"} INSTEAD
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-light text-center mb-4 heading">
                  Sign Up
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Welcome! It's quick and easy to set up an account
                </p>
                <button
                  onClick={() => handleView("create-account")}
                  className="w-full border border-gray-700 text-gray-700 py-3 rounded hover:bg-gray-50 heading"
                >
                  CREATE AN ACCOUNT
                </button>
              </div>
            </>
          )}

          {/* create account / sign up  */}
          {view === "create-account" && (
            <>
              <h2 className="text-2xl font-light text-center mb-6 heading">
                Create An Account
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Welcome to Sakigai! It's quick and easy to set up an account.
              </p>

              <form onSubmit={handleSignUp}>
                {/* name  */}
                <div className="mb-4">
                  <label className="block text-sm mb-2">Name*</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>
                {/* email  */}
                <div className="mb-4">
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
                    // required
                  />
                </div>
                {/* mobile number  */}
                <div className="mb-4">
                  <label className="block text-sm mb-2">Mobile Number*</label>
                  <div className="flex gap-2">
                    {/* <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
                    >
                      <option value="BD">🇧🇩 BD</option>
                      <option value="US">🇺🇸 US</option>
                    </select> */}
                    <input
                      type="tel"
                      placeholder="+ 880"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="flex-1 border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
                      required
                    />
                    {/* <span className="text-gray-400 cursor-help flex items-center">
                      ⓘ
                    </span> */}
                  </div>
                </div>
                {/* set password  */}
                {/* <div className="mb-4">
                  <label className="block text-sm mb-2">Password*</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-blue-600 hover:underline mt-2 cursor-pointer"
                  >
                    👁 {showPassword ? "Hide" : "Show"} Password
                  </button>
                </div> */}
                {passWordField()}
                {/* keep me signed in  */}
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="keepSignedInSignup"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="keepSignedInSignup" className="text-sm">
                    Keep me signed in
                  </label>
                  {keepMeSignedInInfo()}
                </div>
                {/* error  */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {/* submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50 mb-4 heading"
                >
                  {loading ? "CREATING..." : "NEXT"}
                </button>

                {/* offer text  */}
                {/* <div className="text-xs text-gray-600 mb-4">
                  <label className="flex items-start">
                    <input type="checkbox" className="mr-2 mt-1" />
                    <span>
                      Sign me up to receive Sakigai offers, promotions and other
                      commercial messages. By creating an account, I agree to
                      Sakigai's Terms of Service and Privacy Policy.
                    </span>
                  </label>
                </div> */}
                {/* condition  */}
                <div className="text-xs text-gray-600">
                  By creating an account, you agree to Sakigai&apos;s{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    arbitration agreement
                  </a>
                  , conditions of use and privacy policy. Landlines, VoIP, and
                  prepaid phones are not supported.
                </div>
              </form>
              {/* already account  */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-light text-center mb-4">
                  Already Have an Account?
                </h3>
                <button
                  onClick={() => handleView("signin")}
                  className="w-full border border-gray-700 text-gray-700 py-3 rounded hover:bg-gray-50 heading"
                >
                  SIGN IN
                </button>
              </div>
            </>
          )}

          {/* otp verification */}
          {view === "otp-verification" && (
            <>
              <h2 className="text-2xl font-light text-center mb-6">
                OTP Verification
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Enter the OTP sent to your {verificationTarget}.
              </p>
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-4">
                  <label className="block text-sm mb-2">OTP*</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50 mb-4"
                >
                  {loading ? "VERIFYING..." : "VERIFY OTP"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
