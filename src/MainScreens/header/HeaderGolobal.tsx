import React from "react";
import { Link, useLocation } from "react-router-dom";
import homeicon from "../../assets/img/home.svg";
import Netwrok from "../../assets/img/network.svg";
import DuetLogo from "../../assets/duet_logo_new.png";
import "../../assets/css/adminresponsive.css";
import "../../assets/css/alldashboardpages.css";
import bell from "../../assets/img/bell.svg";
import HeaderSearchInput from "./HeaderSearchInput";

const HeaderGlobal: React.FC = () => {
    const location = useLocation();

    return (
        <header className="globalheader fixed w-full z-10" style={{
            backgroundImage: "linear-gradient(180deg, #0072b5, #005a92)",
            boxShadow: "0 2px 15px rgba(0, 0, 0, 0.2)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
            <div className="container-1480 header-glo-set">

                <div className="flex gap-3 items-center lg:gap-2 md:gap-4">
                    <div className="flex items-center justify-center ">
                        <Link to={`${"/feed"}`}>
                            {/* <img src={ndisailogo} className="" alt="" /> */}
                            <img src={DuetLogo} className="h-14 w-auto object-contain"
                                alt="" />
                        </Link>
                    </div>
                    <HeaderSearchInput />
                </div>
                <div className="flex gap-8 items-center relative">
                    <div className="flex gap-6 items-center lg:gap-8 md:gap-6">
                        {/* Home Icon */}
                        <Link
                            to={"/feeds"}
                            style={{ textDecoration: "none" }}
                            className="header-notifi text-white relative text-center flex items-center flex-col  global-header-hover px-2"
                        >
                            <img src={homeicon} className="header_icon w-6 h-6" alt="Home" />
                            <span className="font-Poppins-Medium text-xs block header-notifi-text">
                                Home
                            </span>
                        </Link>

                        {/* Network Icon        */}
                        <Link
                            to={"/network"}
                            style={{ textDecoration: "none" }}
                            className="header-notifi text-white relative flex items-center flex-col  global-header-hover px-2"
                        >
                            <img src={Netwrok} className="header_icon w-6 h-6" alt="Network" />
                            <span className="font-Poppins-Medium text-xs block header-notifi-text">
                                My network
                            </span>
                        </Link>

                        {/* Community Icon */}
                        <Link
                            to={"/community"}
                            style={{ textDecoration: "none" }}
                            className="header-notifi text-white relative flex items-center flex-col  global-header-hover px-2"
                        >
                            <img src={Netwrok} className="header_icon w-6 h-6" alt="Community" />
                            <span className="font-Poppins-Medium text-xs block header-notifi-text">
                                Community forum
                            </span>
                        </Link>
                        <Link
                            to={"/notification"}
                            className="header-notifi text-white relative flex items-center flex-col "
                        >
                            {/* {unReadNotifications ? (
                                <div className="msg-count-main">
                                    <span className="msg-count-specific">
                                        {unReadNotifications}
                                    </span>
                                </div>
                            ) : null} */}
                            <div
                                className={` global-header-hover flex flex-col items-center gap-[2px]  `}
                            >
                                <img src={bell} className="header_icon" alt="" />
                                <span className="font-Poppins-Medium font-size-13px block header-notifi-text  ">
                                    Notifications
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className="Admin-user-header">
                        {/* User profile section would go here */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderGlobal;