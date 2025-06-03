import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";
import { toast, Toaster } from "sonner";
import BsButton from "../Comp/BsButton";
import { PostApi } from "../Helper/ApiHandle/BsApiHandle";

const OtpVerify = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.state?.isAdmin || false;
  const userName = location.state?.userName || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isAdmin) {
        const response = await PostApi<any>("/operator/two-fa", {
          userName: userName,
          otp: otp,
        });

        setIsLoading(false);
        if (response?.data?.operatorsDetails?.adminType === "admin") {
          localStorage.setItem("authToken", response.data.token);
          navigate("/admin/dashboard");
        }
      } else {
        // Handle user OTP login here
        const response = await PostApi<any>("/user/verify-otp", {
          email: userName,
          otp,
        });
      
        if (response?.data?.success) {
          // localStorage.setItem("authToken", response.data.token);
          navigate("/confirm-password", {
            state: { email: userName, otp: otp },
          });
          // navigate("/feeds"); // Adjust the route to your user dashboard
        }
      }
    } catch (error: any) {
      setIsLoading(false);

      if (error.status === 400) {
        toast.error("Invalid OTP");
        return;
      }

      if (error.response?.data?.statusCode === 422) {
        const errorMessages = Object.values(error.response.data.error);
        if (errorMessages.length > 0) {
          toast.error(errorMessages[0] as string);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-right" richColors />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-Lexend-Medium">
          Verification
        </h2>
        <p className="text-sm text-gray-600 mb-6 font-Lexend-Regular">
          Enter the 4-digit OTP sent to your email to verify your identity.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              inputType="tel"
              renderSeparator={<span className="mx-1">-</span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "50px",
                height: "50px",
                textAlign: "center",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "18px",
                margin: "0 4px",
              }}
            />
          </div>

          <BsButton isLoading={isLoading} label="Verify" />
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
