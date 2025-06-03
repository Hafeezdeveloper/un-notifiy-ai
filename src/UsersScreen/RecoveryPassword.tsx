import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, Toaster } from "sonner";
import { PostApi } from "../Helper/ApiHandle/BsApiHandle";
import qs from "qs";
import { storeTwoFactor } from "../Redux/slices/AuthSlice";
import BsInp from "../Comp/BsInp";

function Loginrecovery() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoader(true);
    const res = await PostApi<any>(`/user/send-otp`, { email: email });
    console.log(res)
    if (res) {
      const currentTimestamp = Date.now();
      const fiveMinutesInMilliseconds = 2 * 60 * 1000;
      const futureTimestamp = currentTimestamp + fiveMinutesInMilliseconds;

      dispatch(
        storeTwoFactor({
          time: futureTimestamp,
          email,
          admin: false,
          keepMeloggedIn: false,
        })
      );
      navigate("/otp-verification", {
        state: { isAdmin:false, userName: email },
      });
      setEmail("");
    } else {
      // if(res?.status == 422){
      toast.error("Error sending OTP");

      // }
    }
    setIsLoader(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-right" richColors />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-Lexend-Medium">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 font-Lexend-Regular">
          Enter your email address, and we will send you a recovery code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <BsInp
              label="Email"
              type="email"
              inplabel="Email"
              name="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-5 text-white theme-bg-green font-size-15px font-Lexend-SemiBold flex items-center justify-center gap-2 rounded-xl py-3 px-4"
            disabled={isLoader}
            style={{ backgroundColor: "#009e92" }}
          >
            Send Request
            <FontAwesomeIcon size="lg" icon={faArrowRight} />
            {isLoader && (
              <CircularProgress
                style={{ color: "#fff", width: "20px", height: "20px" }}
              />
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1 mt-6">
          <span className="font-Lexend-Regular text-sm text-gray-600">
            Already have an account?
          </span>
          <Link
            to="/login-web"
            className="font-Lexend-SemiBold text-[#FFE175] text-sm underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Loginrecovery;