import React from "react";
import bgImage from "../assets/light_blue_background.png"; // Ensure the path is correct
import { Link, useNavigate } from "react-router-dom";
import BsButton from "../Comp/BsButton";

const VerificationPage = () => {
    const navigation = useNavigate()
    return (
        <div>
            <img className="w-full h-full absolute top-0 left-0 z-10  bg-texture-banner" src={bgImage} alt="" />
            <div className="container-custom  relative z-20 flex flex-col justify-center items-center reg-comp  pt-20">
                <div className="free-verification-main"><h3 className="capitalize font-size-35px font-Lexend-Medium text-black free-verification">Verification</h3><span className="font-Lexend-Medium font-size-25px  text-black">An email has been sent to your registered email address.</span><p className="font-size-login-16px  text-black font-Lexend-Medium mb-5 text-center payment-form-ord-sum-para lg:w-[50vw] md:w-[50vw] w-full">To complete your registration, please verify your email address. We've sent a  verification link to your inbox. Click on the link to activate your account and log in.</p>
                    <BsButton onClick={() => navigation("/login")} style={"sm:w-3/4 md:w-1/2 lg:w-1/4"} label="Continue" />
                    <button className="border-radius-6px  text-black underline font-size-login-16px font-Lexend-SemiBold input-btns-height-40px flex items-center  justify-center mx-auto" type="submit">Resend verification email</button></div></div>
        </div>
    );
};

export default VerificationPage;
