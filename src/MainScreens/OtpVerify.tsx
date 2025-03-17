
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BsInp from "../Comp/BsInp";
import BsLabel from "../Comp/BsLable";
import { toast, Toaster } from "sonner";
import { faEye, faEyeSlash, faL } from "@fortawesome/free-solid-svg-icons";
import BsButton from "../Comp/BsButton";
import { formDataPostApi, PostApi } from "../Helper/ApiHandle/BsApiHandle";
import OtpInput from 'react-otp-input';
import { useLocation } from "react-router-dom";



const OtpVerify = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState<any>('');
    const navigate = useNavigate();

    const location = useLocation();
    const isAdmin = location.state?.isAdmin || false;
    const userName = location.state?.userName || "";
    console.log("User Type:", isAdmin ? "Admin" : "User"); // Debugging

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isAdmin) {
                const response = await PostApi("/operator/two-fa", { userName: userName, otp: otp });
                // Admin API call
                setIsLoading(false);
                if (response?.data?.operatorsDetails?.adminType === "admin") {
                    navigate("/admin/dashboard");
                    localStorage.setItem("authToken", response.data.token); // Store token
                }
            } else {

                // User API call
            }
            // const response = await PostApi("/user/login", );
            // console.log("Response:", response.data);
            // setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            if (error.status === 400) {
                toast.error(`Invalid OTP`);
                return;
            }
            if (error.response?.data?.statusCode === 422) {
                const errorMessages = Object.values(error.response.data.error); // Extract all error messages
                if (errorMessages.length > 0) {
                    toast.error(errorMessages[0] as string); // Show only the first error message
                }
            }
        }
    };


    return (
        <div className="container mx-auto px-4 pt-2 pb-1">
            <Toaster position="top-right" richColors />
            <div className="flex justify-center items-center shadow-sm rounded  bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-md w-lg">
                    <p className="text-xl font-bold text-center mb-2 text-gray-700 py-4">Verification</p>
                    {/* <p className="text-gray-500 text-center mb-4">or create </p> */}
                    <form onSubmit={handleSubmit} className="py-2">
                        <div className="flex justify-center">
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={4}
                                renderSeparator={<span>-</span>}
                                inputType="tel" // Ensures only numeric input
                                placeholder={"0"}
                                renderInput={(props) => <input {...props} />}
                                inputStyle={{
                                    width: "50px", // Fixed width for proper alignment
                                    height: "6vh",
                                    textAlign: "center", // Centers text inside input
                                    borderRadius: "12px",
                                    border: "1px solid gray",
                                    fontSize: "18px", // Makes text more visible
                                }}
                            />

                        </div>
                        <div className="rounded-md mt-4">
                            <BsButton isLoading={isLoading} label="Verify" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OtpVerify;
