import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import homeicon from "../../assets/img/home.svg";
import Netwrok from "../../assets/img/network.svg";
import DuetLogo from "../../assets/duet_logo_new.png";
import "../../assets/css/adminresponsive.css";
import "../../assets/css/alldashboardpages.css";
import bell from "../../assets/img/bell.svg";
import HeaderSearchInput from "./HeaderSearchInput";
import { RootState } from "../../Redux/store/store";
import { useSelector } from "react-redux";
import { turnOffSocket } from "../../Sockets/socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { truncateString } from "../../Helper/constants";
import { decodeToken } from "../../Helper/ApiHandle/BsApiHandle";

const HeaderGlobal: React.FC = () => {
    const personalData = useSelector((store: RootState) => store.userProfile);
    const { unReadNotifications } = useSelector(
        (store: RootState) => store.notification
    );
    const counts = useSelector((state: RootState) => state.indicator);
    const token = localStorage.getItem("authToken");
    const decodedUser = token ? decodeToken(token) : null;

    const [isBoxVisible1, setIsBoxVisible1] = useState<any>(false);
    const navigate = useNavigate()
    const location = useLocation();
    const ref = useRef<HTMLDivElement>(null);
    const [isBoxVisible, setIsBoxVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const toggleBoxVisibility1 = () => {
        setIsBoxVisible1((prev: any) => !prev);
    };
    const handleLogOut = () => {
        localStorage.removeItem("authToken")
        turnOffSocket();
        navigate("/login");
    };
    console.log(":aw", counts?.annoucenment)
    console.log(":aw", counts)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is outside both dropdown and the toggle button
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsBoxVisible1(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                            to={"/MyAnnoucenment"}
                            style={{ textDecoration: "none" }}
                            className="header-notifi text-white relative flex items-center flex-col  global-header-hover px-2"
                        >
                            {(counts?.annoucenment > 0) ? (
                                <div className="msg-count-main ">
                                    <span className="msg-count-specific">
                                        {counts?.annoucenment}
                                    </span>
                                </div>
                            ) : null}
                            <img src={Netwrok} className="header_icon w-6 h-6" alt="Network" />
                            <span className="font-Poppins-Medium text-xs block header-notifi-text">
                                Annoucenment
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
                            className="header-notifi text-white relative flex items-center flex-col relative global-header-hover "
                        >
                            {unReadNotifications ? (
                                <div className="msg-count-main">
                                    <span className="msg-count-specific">
                                        {unReadNotifications}
                                    </span>
                                </div>
                            ) : null}
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
                        <div className="admin-header-user-img flex jsutify-center flex-col items-center relative">
                            <img
                                src={`${personalData?.data?.profileImageUrl}?t=${Date.now()}`}
                                // src={`${personalData?.profileImageUrl}`}
                                // src={`${process.env.REACT_APP_BASE_URL_IMAGE}${personalData?.profileImageUrl}?t=${Date.now()}`}
                                alt="user"
                            />
                            {/* {isValidProfileImageUrl ? (
                  <img
                    src={`${personalData?.profileImageUrl}?t=${Date.now()}`}
                    onError={(e) => (e.currentTarget.src = DefaultProfileImage)}
                    alt="user"
                  />
                ) : (
                  <img src={DefaultProfileImage} alt="Default user" />
                )} */}
                        </div>
                        {personalData?.data?.role &&
                            <div className="flex  items-baseline">
                                <h4 className="font-size-20px font-Poppins-SemiBold text-white"></h4>
                                <button
                                    ref={buttonRef}
                                    className="font-Poppins-Regular text-white font-size-13px flex  items-baseline gap-2 justify-center"
                                    onClick={toggleBoxVisibility1}
                                >
                                    Me <FontAwesomeIcon icon={faSortDown} />
                                </button>
                            </div>
                        }
                        {isBoxVisible1 && (
                            <div ref={dropdownRef} className="dropdown-profile-view py-3 z-10">
                                <div className="flex gap-2 items-center px-4">
                                    <img
                                        src={`${personalData?.data?.profileImageUrl}`}
                                        // src={`${process.env.REACT_APP_BASE_URL_IMAGE}${personalData?.profileImageUrl}`}
                                        alt="user"
                                    />
                                    <div className="sidebar-gobal-user-name ">
                                        <p className="font-size-20px font-Poppins-SemiBold theme-color-green  hover-underline capitalize">
                                            {personalData?.data
                                                ? `${personalData?.data.fullName}`
                                                : ""}
                                        </p>
                                        <p className="font-size-16px  theme-color-green font-Poppins-Regular  capitalize-first-letter">
                                            {personalData?.data ? personalData?.data?.role : ""}
                                        </p>
                                        <p className="font-size-16px theme-grey-type  font-Poppins-Regular  ">
                                            {personalData
                                                ? truncateString(personalData?.data?.profileSummary || "", 50)
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-4">
                                    <Link
                                        to={`/public-profile/${decodedUser?.userId}/view`}
                                        className=" font-size-14px theme-color-green flex font-Poppins-Medium feeds-btn mt-3 w-full hover:text-white hover:bg-[#00443F]"
                                    >
                                        View profile
                                    </Link>
                                </div>
                                <hr className="my-1 lg:my-2" />
                                <div className="px-4 ">
                                    <p className="font-size-16px font-Poppins-SemiBold theme-color-green  capitalize mb-2">
                                        Account
                                    </p>
                                    <ul>
                                        <li className="pb-2 mb-2">
                                            <Link
                                                to={"/setting"}
                                                className={` font-size-16px theme-grey-type font-Poppins-Medium on-hover-bg px-2`}
                                            >
                                                Account settings
                                            </Link>
                                        </li>
                                        <li className="mb-3">
                                            <Link
                                                to={"/privacy"}
                                                className={` font-size-16px theme-grey-type font-Poppins-Medium on-hover-bg px-2`}
                                            >
                                                Privacy settings
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <hr color=" #004540 " className="my-1 lg:my-2" />
                                <div className="px-4 ">
                                    <p className="font-size-16px font-Poppins-SemiBold theme-color-green capitalize mb-2">
                                        Manage
                                    </p>
                                    <ul>
                                        <li className="pb-2 mb-2">
                                            <Link
                                                to={"/activity"}
                                                className={` font-size-16px theme-grey-type font-Poppins-Medium  on-hover-bg px-2 `}
                                            >
                                                Activity log
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <hr color=" #004540 " className="my-1 lg:my-2" />
                                {/* <div className="px-4 ">
                  <p className="font-size-16px font-Poppins-SemiBold theme-color-green capitalize ">
                    Ads
                  </p>
                  <ul >
                    <li className="pb-2">
                      <Link
                        to="/ads-manager"
                        className="font-size-16px theme-grey-type font-Poppins-Medium  on-hover-bg px-2"
                      >
                        Ads manager
                      </Link>
                    </li>
                    <li className="">
                      <Link
                        to="/bill-payment"
                        className="font-size-16px theme-grey-type  font-Poppins-Medium  on-hover-bg  px-2"
                      >
                        Billing & payments
                      </Link>
                    </li>
                  </ul>
                </div>
                <hr color="#707070 " className="my-1 lg:my-2" /> */}

                                <div className="px-4">
                                    <ul>
                                        <li>
                                            <button
                                                onClick={handleLogOut}
                                                className="font-size-16px theme-grey-type font-Poppins-Medium  on-hover-bg px-2"
                                            >
                                                Sign out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderGlobal;