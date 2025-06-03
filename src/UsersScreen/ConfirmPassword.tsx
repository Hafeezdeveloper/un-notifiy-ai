import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress } from "@mui/material";
import { toast, Toaster } from "sonner";
import { PostApi } from "../Helper/ApiHandle/BsApiHandle";
import { validatePassword } from "../Helper/constants";

function Loginwelcomeback() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState<string | boolean>(false);
  const { state } = useLocation() || false;
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePasswordVisibilityTwo = () => setShowPasswordTwo(!showPasswordTwo);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password) {
      setIsError("Please enter password.");
    } else if (!validatePassword(password)) {
      setIsError(
        "Password should be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 digit and 1 special character."
      );
    } else if (password !== confirmPassword) {
      setIsError("Password & confirm password do not match.");
    } else {
      setIsLoader(true);
      const res = await PostApi<any>("/user/reset-password", {
        email: state?.email,
        newPassword: password,
        otp: state?.otp,
      });

      if (res) {
        toast.success("Password updated successfully.");
        navigate("/login-web");
      } else {
        toast.error("Error updating password");
      }
      setIsLoader(false);
    }
  };

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => setIsError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  useEffect(() => {
    if (!state) {
      navigate(-1);
    }
  }, [state, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-right" richColors />
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-Lexend-Medium">
          Welcome back
        </h2>
        <p className="text-sm text-gray-600 mb-6 font-Lexend-Regular">
          Please change your password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left space-y-3">
            <div className="relative">
              <input
                className="w-full border border-gray-300 rounded-xl py-3 px-4 outline-none focus:border-[#009e92] font-Lexend-SemiBold"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={togglePasswordVisibility}
              />
            </div>
            
            <div className="relative">
              <input
                className="w-full border border-gray-300 rounded-xl py-3 px-4 outline-none focus:border-[#009e92] font-Lexend-SemiBold"
                placeholder="Confirm password"
                type={showPasswordTwo ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPasswordTwo ? faEye : faEyeSlash}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={togglePasswordVisibilityTwo}
              />
            </div>
            
            {isError && (
              <p className="text-red-500 text-sm font-Lexend-Regular">
                {isError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-5 text-white font-size-15px font-Lexend-SemiBold flex items-center justify-center gap-2 rounded-xl py-3 px-4"
            style={{ backgroundColor: "#009e92" }}
            disabled={isLoader}
          >
            Done
            <FontAwesomeIcon size="lg" icon={faArrowRight} />
            {isLoader && (
              <CircularProgress
                style={{ color: "#fff", width: "20px", height: "20px" }}
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Loginwelcomeback;