import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultProfileImage from "../../../assets/img/default_profile_image.png";
import { faStar, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newone from "../../../assets/img/new.svg";
import VerficationSheild from "../../../assets/img/verified-shield.png";
import DefaultCoverImage from "../../../assets/img/welcome-hudson.png";
import Skeleton from "@mui/material/Skeleton";
import Isverified from "../../../assets/img/isMember.svg";
import IsFivityVerfied from "../../../assets/img/50member.svg";
import qs from "qs";
import { RootState } from "../../Redux/store/store";
import { isNotEmpty } from "../../Helper/constants";

interface IApiResponse {
    totalResults: number;
    percentage: number;
    paginated: paginated;
}
interface paginated {
    [key: string]: any;
}
function LeftSidebar() {
    const personalData = useSelector((store: RootState) => store.userProfile);
    const [isLoading, setIsLoading] = useState<any>(true)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    console.log(personalData)
    const leftSideData: any = {
        student: [
            {
                navigation: "/my-jobs",
                title: "Manage job posts",
                count: 0,
                redDot: 0,
            },
            // { navigation: "/dispute-jobs", title: "Disputed jobs", count: myItems?.disputed },
            {
                navigation: "/shift-lists",
                title: "My shift",
                count: "",
                redDot: 0,
            },
        ],
        teacher: [
            {
                navigation: "/job-board?innerTab=applied",
                title: "Applied jobs",
                count: 0,
            },
            // { navigation: "/dispute-jobs", title: "Disputed jobs", count: myItems?.disputed },
            {
                navigation: "/list-management",
                title: "Listing management",
                count: 0,
                redDot: 0,

            },
        ]
    };
    const roleData =
        leftSideData["student"] || [];



    useEffect(() => {
        if (isNotEmpty(personalData)) {
            setIsLoading(false);
        }
    }, [personalData]);

    return (
        <div className="sidebar-gobal mb-2">
            <div className="sidebar-gobal-user-details  allside_shadow pb-2">
                {isLoading ? (
                    <Skeleton
                        variant="rounded"
                        className="w-full mb-2 skeleton-sidebar-global"
                        style={{ borderRadius: 6 }}
                    />
                ) : (
                    <div
                        className="sidebar-gobal-user-img"
                        style={{
                            backgroundImage: `${personalData?.data?.profileImageUrl}`,
                        }}
                    >
                        <img
                            src={`${personalData?.data?.profileImageUrl}`}
                            alt="user"
                        />
                    </div>
                )}
                {/* image */}
                <div className="sidebar-gobal-user-rating flex justify-center items-center">

                    <div className="text-yellow-400 flex gap-1 ">
                        {[1, 2, 3, 4, 5].map((v) => (
                            <FontAwesomeIcon
                                key={v}
                                fontSize="20px"
                                icon={faStar}
                                color="#FF9B29"
                                className={personalData.data?.isVerified ? "active" : ""}
                            />
                        ))}
                    </div>
                </div>{" "}
                {/* rating star */}
                <div className="sidebar-gobal-user-name text-center">

                    <>
                        <div className="flex flex-row gap-2 flex-nowrap justify-center">
                            <Link
                                // to={`/public-profile/${personalData?._id}/view`}
                                to={`/publicprofile`}
                                className="font-size-20px font-Poppins-SemiBold theme-color-green text-center   on-hover-underline capitalize "
                            >
                                {`${personalData?.data?.fullName} `}
                            </Link>

                        </div>

                        {/* name */}
                        {/* {personalData?.role !== "company" &&
                            !personalData?.employeeRole && ( */}
                        <p className="font-size-13px  theme-color-green font-Poppins-Medium text-center capitalize-first-letter">
                            {personalData?.data?.role}
                        </p>
                        {/* // )} */}
                        {/* {personalData?.companyFirstName && (
                            <p className="font-size-13px  theme-color-green font-Poppins-Medium text-center capitalize-first-letter">
                                {personalData?.companyFirstName || ""}
                            </p>
                        )} */}
                    </>
                    {/* role */}
                    <p className="font-size-16px theme-color-green font-Poppins-Regular  text-center">
                        {personalData?.data?.profileDescription || ""}
                    </p>{" "}
                    {/* profile summary */}
                    <div className="flex justify-center items-center mt-2">
                        {/* {!personalData?.profileVerified ? (
              <div className="w-max">
                <Link
                  to="http://vetting.com/"
                  target="_blank"
                  className="font-size-15px font-Poppins-Medium verify-btn b-1-[#004182] text-[#004182] flex flex-row gap-2 items-center verify-btn"
                >
                  <img className="verify-icon-shield" src={VerficationSheild} />{" "}
                  Verify now
                </Link>
              </div>
            ) : personalData?.profileVerified ? (
              <div className="w-max">
                <button className="font-size-14px font-Poppins-Medium verified-btn bg-[#B2D8D5] text-[#007E76] flex flex-row gap-2 items-center">
                  Verified
                </button>
              </div>
            ) : null}
             */}
                    </div>
                </div>
                <hr className="my-3" />
                <>
                    <div className="px-4 ">
                        <div className="flex justify-between items-center mb-3">
                            <p className="font-size-16px theme-color-green  font-Poppins-Medium  ">
                                Jobs Posted
                            </p>
                            <p className="font-size-16px font-Poppins-SemiBold theme-color-green count-use">
                                0
                            </p>
                        </div>
                        {/* completed jobs */}
                        <Link
                            to={"/my-connections"}
                            className={`flex justify-between items-center mb-3 `}
                        >
                            <p className="font-size-16px theme-color-green  font-Poppins-Medium ">
                                Connections
                            </p>
                            <p className="font-size-16px font-Poppins-SemiBold theme-color-green count-use">
                                {personalData?.data?.totalConnections ? personalData?.data?.totalConnections : 0}
                            </p>
                        </Link>{" "}
                        {/* connection length */}
                        {/* <div className="flex justify-between items-center mb-3">
                  <p className="font-size-16px theme-color-green  font-Poppins-Medium  ">
                    Cancellation rate
                  </p>
                  <p className="font-size-16px font-Poppins-SemiBold theme-color-green count-use">
                    {CalculateCancellationRate(
                      personalData?.cancelledJobs,
                      personalData?.completedJobs
                    )}
                  </p>
                </div>{" "} */}

                    </div>
                </>
                <hr className="my-3" />
                {/* {isLoading ? (
                    <div className=" flex items-center flex-col justify-center">
                        <Skeleton className="w-[80%]  " height={10} />
                        <Skeleton className="w-[80%]  mt-2 " height={10} />
                        <Skeleton className="w-[80%]   mt-2" height={10} />
                    </div>
                ) : (
                    <div className="px-4">
                        <div className="flex justify-between items-center ">
                            <p className="font-size-16px theme-color-green font-Poppins-Medium  ">
                                Your profile is
                            </p>
                            <p className="font-size-16px font-Poppins-SemiBold theme-color-green">
                                {`${profileCompletionPercentage.toFixed(0) || 0}%`}
                            </p>
                        </div>{" "}
                        {/* completion percentage */}
                {/* <div className="profilebar-feed w-full  relative mb-2">
                            <span
                                className="theme-bg-green absolute left-0  rounded-full	"
                                style={{
                                    width: `${profileCompletionPercentage || 0}%`,
                                    height: "100%",
                                }}
                            ></span>
                        </div>
                        {profileCompletionPercentage >= 100 ? null : (
                            <Link
                                to={
                                    personalData?.role === "switchProfile"
                                        ? "/add-staff?isEdit=true&staffId="
                                        : "/publicprofile"
                                }
                                className="font-size-16px font-Poppins-SemiBold theme-color-green on-hover-underline"
                            >
                                Resume account setup
                            </Link>
                        )} */}
            </div>
            {/* )} */}
        </div>
        //     {UserCategory !== "plan manager" && !personalData?.employeeRole && (
        //         <div className="sidebar-gobal-user-details allside_shadow mt-3 py-2   mb-2">
        //             <p className="font-size-16px theme-color-green  font-Poppins-Medium  px-4 flex gap-4 items-center mt-2">
        //                 {" "}
        //                 <img
        //                     className="lg:h-[1.3vw] md:h-[1.3vw] h-[4.3vw]"
        //                     src="https://ndisync-stage.s3.amazonaws.com/items-icon.svg"
        //                     alt=""
        //                 />{" "}
        //                 My items
        //             </p>
        //             <hr className="my-2" />

        //             {roleData &&
        //                 roleData.map((item: any, index: any) => (
        //                     <div key={index} className="sidebar-gobal-user-jobs-status px-4">
        //                         <Link
        //                             to={isNavigationDisabled(personalData?.approvalStage) ? "#" : `${item?.navigation}`}
        //                             className={`${getNavigationClass(personalData?.approvalStage)} flex justify-between items-center mb-3`}
        //                         >
        //                             <div className="flex flex-row gap-1 items-center">
        //                                 <p className="font-size-16px theme-color-green  font-Poppins-Medium  ">
        //                                     {item?.title}
        //                                 </p>
        //                             </div>
        //                             {item?.redDot > 0 && (
        //                                 <div className="bg-[#e23333] w-[3vw] h-[3vw] lg:w-[1vw] md:h-[1vw] flex items-center justify-center rounded-full">
        //                                     <p className=" w-[1vw] h-[1vw] lg:w-[.4vw] md:h-[.4vw] bg-white rounded-full"></p>
        //                                 </div>
        //                             )}
        //                         </Link>
        //                     </div>
        //                 ))}
        //         </div>
        //     )} */}
        // </div>
    );
}

export default LeftSidebar;
