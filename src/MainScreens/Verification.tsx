import React from "react";
import { useNavigate } from "react-router-dom";
import BsButton from "../Comp/BsButton";
import bgImage from "../assets/light_blue_background.png";

const VerificationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full mx-4 bg-white shadow-lg rounded-2xl px-8 py-12 text-center">
        <h3 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4 font-Lexend-Medium">
          Verification
        </h3>
        <span className="text-lg text-gray-700 block mb-4 font-Lexend-Medium">
          An email has been sent to your registered email address.
        </span>
        <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed font-Lexend-Medium">
          To complete your registration, please verify your email address. We've sent a
          verification link to your inbox. Click on the link to activate your account and log in.
        </p>

        <div className="mb-4">
          <BsButton
            onClick={() => navigate("/login")}
            style="w-full md:w-2/3 lg:w-1/2 mx-auto"
            label="Continue"
          />
        </div>

        <button
          type="button"
          className="text-blue-600 underline text-sm font-semibold font-Lexend-SemiBold hover:text-blue-800"
        >
          Resend verification email
        </button>
      </div>
    </div>
  );
};

export default VerificationPage;
