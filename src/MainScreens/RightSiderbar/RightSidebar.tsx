import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import postjob from "../../assets/img/postJob.svg";
import jobfind from "../../assets/img/findjob.svg";
import FindPropertyImg from "../../assets/img/find-property.svg";
import dollar from "../../assets/images/dollaricon.png";
// import WelcomeNidsModal from "../Modal/welcomNdisModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Preimum from "../../assets/img/modal-icon.svg";

import { useSelector } from "react-redux";
import { WindowSharp } from "@mui/icons-material";
import axios from "axios";
import { useDispatch } from "react-redux";
import "../../assets/css/responsive.css"
import { decodeToken } from "../../Helper/ApiHandle/BsApiHandle";
import { RootState } from "../../Redux/store/store";
interface ResponseData {
    promotionalStatus: boolean;
}
function RightSidebarFeed({ jobSectionHide = false }) {
    const [reviewModal, setShowReviewModal] = useState<boolean>(false);
    const { pathname } = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [myEmployers, setMyEmployers] = useState<any>([]);
    const dispatch = useDispatch();
    const personalData = useSelector((store: RootState) => store.userProfile);

    const token = localStorage.getItem("authToken");
    const decodeUser = decodeToken(token)
    console.log("awdawdawdwadaw", decodeUser)
    const [promotionalStatus, setPromotionalStatus] = useState<boolean>(false);

    // Check the cookie and show the modal only for the first-time user


    const navigate = useNavigate();

    const [loginModal, setLoginModal] = useState(false);
    const [postModal, setPostModal] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(false);

    const [showDetail, setShowDetail] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 767) {
            setShowDetail(false);
        }
    }, [window.innerWidth]);
    const HandleClickMdal = () => {
        setPostModal(!postModal);
    };
    const HandleClickShowDetail = () => {
        setShowDetail(true);
    };
    const HandleClickShowDetailClose = () => {
        setShowDetail(false);
    };



    const permissionMap: Record<string, string> = {
        Quotations: "quotation",
        Clients: "client",
        "My jobs": "myJobs",
        Shifts: "shift",
        Timesheets: "timeSheet",
        Invoices: "clientInvoice",
        "Custom forms": "customForm",
        Templates: "template",
        "Organizational structure": "organizationStructure",
        // "Employee management": "employeeManagment",
        "Documents management": "documentManagment",
        "Payroll management": "payrollManagment",
    };

    const rightSideData: any = {
        student: [
            {
                navigation: "/job-Post",
                title: "Jobs Section",
                notification: 0,
                isVisible: true,
            },
            {
                navigation: "/my-ai",
                title: "AI Assistant",
                notification: 0,
                isVisible: true,
            },
            // {
            //     navigation: "/manage-quotations",
            //     title: "Manage quotation",
            //     notification: 0,
            //     isVisible: true,
            // },
            // {
            //     navigation: "/my-support-coordinator",
            //     title: "My support coordinators",
            //     notification: 0,
            //     isVisible: true,
            // },
            // {
            //     navigation: "/my-plan-managers",
            //     title: "My plan managers",
            //     notification: 0,
            //     isVisible: true,
            // },
            // {
            //     navigation: "/all-inovices",
            //     title: "Invoices",
            //     isVisible: true,
            //     notification: 0,
            // },
        ],
        teacher: [
            {
                navigation: "/my-annoucenment",
                title: "My Annoucenment",
                notification: 0,
                isVisible: true,
            },
            {
                navigation: "/job-Post",
                title: "Jobs Section",
                notification: 0,
                isVisible: true,
            },
            {
                navigation: "/my-ai",
                title: "AI Assistant",
                notification: 0,
                isVisible: true,
            },
            // { navigation: "", title: "Templates", isVisible: true },
        ],
        faculty: [
            {
                navigation: "/my-annoucenment",
                title: "My Annoucenment",
                notification: 0,
                isVisible: true,
            },
            {
                navigation: "/job-Post",
                title: "Jobs Section",
                notification: 0,
                isVisible: true,
            },
            {
                navigation: "/my-ai",
                title: "AI Assistant",
                notification: 0,
                isVisible: true,
            },
            // { navigation: "", title: "Templates", isVisible: true },
        ],
    };


    let roleData = rightSideData[decodeUser.role] || [];

    roleData = roleData.filter((item: any) => item.isVisible);


    return (
        <div className="all-menus">
            <div className="">
                <div
                    className="sidebar-gobal-user-details allside_shadow py-2   mb-3"
                    style={{ width: "17.786vw" }}
                >
                    <p className="font-size-16px theme-color-green  font-Poppins-Medium  px-4 flex gap-4 items-center mt-2">
                        {" "}
                        <img
                            className="lg:h-[1.3vw] md:h-[1.3vw] h-[4.3vw]"
                            src="https://ndisync-stage.s3.amazonaws.com/items-icon.svg"
                            alt=""
                        />{" "}
                        Care management
                    </p>
                    <hr className="my-2" />

                    {roleData &&
                        roleData
                            .filter((item: any) => item.isVisible)
                            .map((item: any, index: number, array: any[]) => (
                                <div
                                    key={index}
                                    className="sidebar-gobal-user-jobs-status px-4 mb-2"
                                >
                                    <Link
                                        to={item.navigation}
                                        className={`flex justify-between items-center  
                                                     `}
                                    >
                                        <p className="font-size-16px theme-color-green font-Poppins-Medium">
                                            {item?.title}
                                        </p>
                                        <p className="font-size-16px font-Poppins-SemiBold theme-color-green count-use" />
                                        {item?.notification > 0 && (
                                            <div className="bg-[#e23333] w-[3vw] h-[3vw] lg:w-[1vw] md:h-[1vw] flex items-center justify-center rounded-full">
                                                <p className=" w-[1vw] h-[1vw] lg:w-[.4vw] md:h-[.4vw] bg-white rounded-full"></p>
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            ))}
                </div>
            </div>
            {/* {personalData?.employeeRole &&

        <div className="sidebar-gobal-user-details allside_shadow mt-2 py-3 px-4 on-hover-underline relative" style={{ width: "100%" }}>
          <button
            className="font-size-16px theme-color-green  font-Poppins-Medium  "
            onClick={() => {
              localStorage.removeItem("switched")
              localStorage.removeItem("companyId")
              window.location.reload();
            }}
          >Swtich to my profile</button>
        </div>
      } */}




        </div>

    );
}

export default RightSidebarFeed;
