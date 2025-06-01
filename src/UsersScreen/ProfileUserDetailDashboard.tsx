import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  faCamera,
  faStar,
  faPenToSquare,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";


interface IProfileUserDetailDashboardProps {
  bool: boolean;
  setBool: React.Dispatch<React.SetStateAction<boolean>>;
  unpaidModalShow: boolean;
  isPromoted?: any
}
interface IApiResponse {
  message: string;
}
const ProfileUserDetailDashboard: React.FC<IProfileUserDetailDashboardProps> = ({ bool, setBool, unpaidModalShow, isPromoted }) => {
  const editorRef = useRef<AvatarEditor>(null); // reference of avatar editor
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()
  const isPublicProfileBase = location.pathname.startsWith("/public-profile");
  const doecoded = getRole();
  const UserRole = doecoded?.role;
  const userId = doecoded?.userId;
  // const isMember = doecoded?.isMember

  // const { role, userId, isMember } = getRole(); // get user role

  // const { publicData, connectionStatus } = useSelector((store: RootState) => store.userProfile) as { publicData: PublicDataType; connectionStatus: boolean };
  const { personalData, connectionStatus, publicData } = useSelector((store: RootState) => store.userProfile)
  const ShowData = location.pathname.startsWith("/public-profile") ? (publicData as PublicDataType) : (personalData as PublicDataType);

  const [promoteModal, setPromoteModal] = useState<boolean>(false)

  const [isImageModal, setIsImageModal] = useState<string | false>(false); // upload image modal
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(connectionStatus,"connectionStatus")
  useEffect(() => {
    if (isNotEmpty(ShowData)) {
      setIsLoading(false);
    }
  }, [ShowData]);

  // cover image change
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = event.target.files?.[0];
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

    if (file) {
      if (file.size > maxSize) {
        // File size exceeds the maximum allowed size
        toast(
          "File size exceeds the maximum allowed size (5 MB). Please choose a smaller file.",
          { type: "error" }
        );
        return; // Stop further execution
      }
      const reader = new FileReader();
      reader.onloadend = (ee) => {
        if (typeof ee.target?.result === 'string') {
          setDisplayImage(ee.target.result);
          setIsImageModal(category);
        }
      };
      reader.readAsDataURL(file);

      // Clear the selected file from the input element
      event.target.value = '';
    }
  };

  const coverImageUrl = `${process.env.REACT_APP_BASE_URL}/${ShowData?.coverImageUrl}`;

  const handleNavigateToCompare = () => {
    navigate(`/participant-compare`, {
      state: { id: ShowData?._id, type: ShowData?.role, jobCompare: false },
    });
  }; // navigate to compare pagge

  // image modal close
  const handleCloseImageModal = () => {
    setIsImageModal(false);
    setDisplayImage(null);
  };


  const handleImageResize = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      });

      if (blob) {
        const file = new File([blob], "image.png", { type: "image/png" });
        handleImageUpload(file);
      } else {
        toast("Failed to convert canvas to blob", { type: "error" });
      }
    }
  };
  // Functionality: API call for for update profile & cover image
  const handleImageUpload = async (BlobFile: File) => {

    setIsLoader(true);
    const formData = new FormData();
    formData.append("image", BlobFile);
    const { res, err } = await httpRequest<IApiResponse>({ method: "post", path: `/api/user/${isImageModal === "cover" ? "cover-image" : "profile-image"}`, params: formData, header: { 'Content-Type': 'multipart/form-data' } });
    if (res) {
      dispatch(updateProfile());
      setBool((prev) => !prev);
      toast(res?.message || "success", { type: "success" }); // api success message
      handleCloseImageModal()
    } else {
      toast(err?.message, { type: "error" });
    }
    setIsLoader(false);
  };
  return (
    <>

      <h1 className="hidden">{bool ? "TRUE" : "FALSE"}</h1>
      <div className="shadow-lg bg-white rounded-none lg:rounded-xl mb-2 pb-3 ">
        {" "}

        {unpaidModalShow ?

          (
            <>
              <div className="cover-img relative">
                <Skeleton variant="rounded" className="w-full" style={{ borderRadius: 13 }} height={274} />
              </div>

            </>

          )
          :

          isLoading ? (
            <div className="cover-img relative">
              <Skeleton variant="rounded" className="w-full" style={{ borderRadius: 13 }} height={274} />
            </div>
          )
            :
            (
              <div className="cover-img relative">
                <img
                  // src={`${process.env.REACT_APP_BASE_URL_IMAGE}${ShowData?.coverImageUrl}?t=${Date.now()}`}
                  src={`${ShowData?.coverImageUrl}?t=${Date.now()}`}
                  onError={(e) => (e.currentTarget.src = DefaultCoverImage)}
                  alt=""
                  width={"100%"}
                />
                {userId === ShowData?._id && (
                  <label
                    htmlFor="imageInput"
                    className="absolute icon-size right-5 top-5 z-10 bg-white rounded-full flex items-center justify-center w-8 h-8 "
                  >
                    <FontAwesomeIcon icon={faCamera} color="#21948C" />
                  </label>
                )}
                {/* Hidden input field for file upload */}
                <input
                  id="imageInput"
                  type="file"
                  // accept="image/*"
                  accept=".jpg, .jpeg, .png, .webp, .apng, .ico, .avif"
                  onChange={(e) => handleCoverImageChange(e, "cover")}
                  style={{ display: "none" }}
                />
              </div>
            )
        }
        {/* cover upload */}

        <div className="px-6 flex justify-center lg:justify-between md:justify-between">
          <div className="profile-img-uploader relative">
            {isLoading ?
              (
                null
              )
              :
              (
                <img
                  src={`${ShowData?.profileImageUrl}?t=${Date.now()}`}
                  // src={`${process.env.REACT_APP_BASE_URL_IMAGE}${ShowData?.profileImageUrl}?t=${Date.now()}`}
                  onError={(e) => (e.currentTarget.src = DefaultProfileImage)}
                  alt=""
                  className="rounded-full"
                />
              )}


            {/* profile image */}
            {userId === ShowData?._id && (
              <label
                htmlFor="imageInput2"
                className="absolute -right-2 bottom-5  rounded-full flex items-center justify-center w-8 h-8  z-0"
              >
                <img src={camraicon} alt="" className="icon-size" />
              </label>
            )}
            {/* Hidden input field for file upload */}
            <input
              id="imageInput2"
              type="file"
              // accept="image/*"
              accept=".jpg, .jpeg, .png, .webp, .apng, .ico, .avif"

              onChange={(e) => handleCoverImageChange(e, "profile")}
              style={{ display: "none" }}
            />
          </div>
          {userId === ShowData?._id && (
            <>
              <Link to="/user-profile-edit" className="mt-5 edit-pro-icon  absolute right-8 lg:right-0 md:right-0 lg:relative md:relative">
              <FontAwesomeIcon icon={faPenToSquare} />
              </Link>


            </>
          )}
        </div>
        <div className="flex justify-center lg:justify-between md:justify-between items-center px-6 flex-col  md:flex-row lg:flex-row">

          {unpaidModalShow ?

            (
              <>
                <div className="cover-img relative">
                  <Skeleton variant="rounded" className="w-[55.5vw] my-4" style={{ borderRadius: 13 }} height={15} />
                  <Skeleton variant="rounded" className="w-[55.5vw] my-4" style={{ borderRadius: 13 }} height={15} />
                  <Skeleton variant="rounded" className="w-[55.5vw] my-4" style={{ borderRadius: 13 }} height={15} />
                </div>

              </>

            )
            :
            isLoading ?
              (
                <>
                  <div className="flex justify-between flex-col w-full">
                    <div className="cover-img relative flex flex-row justify-between items-center mt-4">
                      <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                      <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                    </div>
                    <div className="cover-img relative flex flex-row justify-between items-center mt-4">
                      <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                      <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                    </div>

                  </div>
                </>
              )
              : (
                <>
                  <div className=" user-name flex gap-3 items-center">
                    <div className="flex flex-col lg:flex-row md:flex-row gap-2 items-center">
                      <div className="flex gap-2 items-center">
                        <h4 className="font-size-20px font-Poppins-SemiBold theme-color-green capitalize">
                          {`${ShowData?.firstName || ""} ${ShowData?.lastName || ""}`}
                        </h4>

                        {ShowData?.freeUser === false && (
                          // <img src={ShowData?.isFounder ? IsFivityVerfied : Isverified} alt="Verified-Icon" />
                          <img src={ShowData?.isFounder ? "https://ndisync-stage.s3.amazonaws.com/Founding+member+badge.svg" : "https://ndisync-stage.s3.amazonaws.com/Premium+badge.svg"} alt="Verified-Icon" />

                        )}
                      </div>
                      {/* {
                        location.pathname === "/publicprofile" &&
                        userId === ShowData?._id && (
                          !ShowData?.profileVerified ? (
                            <>
                              <div className="flex flex-row gap-2 items-center ">

                                
                                <Link to="http://vetting.com/" target="_blank" className="font-size-15px font-Poppins-Medium verify-btn b-1-[#004182] text-[#004182] flex flex-row gap-2 items-center verify-btn">
                                  <img className="verify-icon-shield" src={VerficationSheild} /> Verify now
                                </Link>
                              </div>
                            </>
                          ) : ShowData?.profileVerified ? (
                            <button className="font-size-14px font-Poppins-Medium verified-btn bg-[#B2D8D5] text-[#007E76] flex flex-row gap-2 items-center">
                              Verified
                            </button>
                          ) : null
                        )
                      } */}

                      {/* {

                        isPublicProfileBase &&
                        (
                          !ShowData?.profileVerified ? (
                            <>
                              <div className="flex flex-row gap-2 items-center">
                                {userId !== ShowData?._id ?

                                  (
                                    <button className="font-size-15px font-Poppins-Medium bg-[#FFB2B2] text-[#980000] non-verify-btn cursor-default">
                                      Non-Verified
                                    </button>
                                  )
                                  :
                                  (
                                    <Link to="http://vetting.com/" target="_blank" className="font-size-15px font-Poppins-Medium verify-btn b-1-[#004182] text-[#004182] flex flex-row gap-2 items-center verify-btn">
                                      <img className="verify-icon-shield" src={VerficationSheild} /> Verify now
                                    </Link>
                                  )
                                }



                              </div>
                            </>
                          ) : ShowData?.profileVerified ? (
                            <button className="font-size-14px font-Poppins-Medium verified-btn bg-[#B2D8D5] text-[#007E76] flex flex-row gap-2 items-center">
                              Verified
                            </button>
                          ) : null
                        )
                      } */}




                    </div>

                  </div>
                </>
              )}

          {!unpaidModalShow && (
            !isLoading && (
              <div className="flex gap-1 my-3 md:my-0 lg:my-0">
                {[1, 2, 3, 4, 5].map((v) => (
                  <FontAwesomeIcon
                    key={v}
                    fontSize="20px"
                    icon={faStar}
                    style={{
                      color:
                        calculateRating(
                          ShowData?.totalRatings,
                          ShowData?.totalReviews
                        ) >= v
                          ? "#FF9B29"
                          : "#b8b8b8",
                    }}
                  />
                ))}
              </div>
            )

          )}
          {/* rating star */}
        </div>
        {!unpaidModalShow && (
          !isLoading ? (
            <>
              <div className="flex justify-between items-center px-6 flex-col  md:flex-row lg:flex-row">
                <div className="w-[90%] text-center lg:text-left md:text-left ">
                  <p className="font-size-16px  theme-color-green font-Poppins-Regular capitalize-first-letter ">
                    {ShowData?.roleCategory || ShowData?.role || ""}
                  </p>{" "}
                  {ShowData?.abn &&
                    <p className="font-size-16px  theme-color-green font-Poppins-Regular capitalize-first-letter my-2">
                      <span className="bg-[#FFE175] rounded-md p-1 font-Poppins-SemiBold capitalize"><i>ABN</i></span> {ShowData?.abn || ""}

                    </p>
                  }
                  {/* role */}

                  <p className="font-size-16px theme-grey-type  font-Poppins-Regular w-full lg:w-3/4 md:w-3/4 my-2 md:my-auto lg:my-auto">
                    {truncateString(ShowData?.profileSummary, 100)}
                  </p>

                  {/* profile summary */}
                </div>
                <div>
                  {(UserRole === "superAdmin" || UserRole || "admin" || UserRole === "editor") ?
                    <span className="font-size-16px theme-grey-type  font-Poppins-Medium ">
                      <span className="font-size-16px font-Poppins-Medium theme-color-green">
                        {ShowData?.totalReviews || 0}{" "}
                      </span>
                      Reviews
                    </span>
                    :
                    <Link to={`/reviews/${ShowData?._id}/published`} className="font-size-16px theme-grey-type  font-Poppins-Medium c">
                      <span className="font-size-16px font-Poppins-Medium theme-color-green">
                        {ShowData?.totalReviews || 0}{" "}
                      </span>
                      Reviews
                    </Link>

                  }

                </div>
              </div>
              <div className="flex justify-center lg:justify-between md:justify-between  items-center px-6 py-1 flex-col   md:flex-row lg:flex-row my-2 md:my-auto lg:my-auto">
                <div>
                  <p className="font-size-16px theme-grey-type  font-Poppins-Regular">
                    {`${ShowData?.suburb ? capitalizeFirstLetter(ShowData?.suburb) :  ""}, ${ShowData?.state || ""}`}
                  </p>
                </div>{" "}
                {/* city & state */}
                <div>
                  <p className="font-size-16px theme-grey-type  font-Poppins-Medium  ">
                    <span className="font-size-16px font-Poppins-Medium theme-color-green">
                      {ShowData?.completedJobs || 0}{" "}
                    </span>{" "}
                    Jobs completed
                  </p>
                </div>{" "}
                {/* completed jobs */}
              </div>
              <div className="flex justify-center lg:justify-between md:justify-between  items-center px-6 pt-1 flex-col  md:flex-row lg:flex-row">
                <div>
                  <p className="font-size-16px font-Poppins-Medium theme-color-green text-center">
                    {/* {ShowData?.connections || 0} Connections */}
                    {ShowData?.connections || 0}  {(ShowData?.connections || 0) > 1 ? "Connections " : "Connection"}

                  </p>
                </div>{" "}
                {/* connection length */}
                {/* <div>
                  <p className="font-size-16px theme-grey-type  font-Poppins-Medium  ">
                    <span className="font-size-16px font-Poppins-Medium theme-color-green">
                      {CalculateCancellationRate(
                        ShowData?.cancelledJobs,
                        ShowData?.completedJobs
                      )}{" "}
                    </span>{" "}
                    Cancellation rate
                  </p>
                </div> */}
                {/* cancellation rate */}
              </div>
              <div className="flex justify-between items-start px-6 pt-1 mt-3 ">
                {UserRole !== "superAdmin" &&
                  <div className="flex items-center gap-4 justify-center">
                    {!(userId === ShowData?._id) ? (
                      <>
                        <ConnectionStatusButton
                          key={Math.random()}
                          status={connectionStatus}
                          uId={ShowData?._id}
                          showMessageButton={true}
                          isPromotedId={isPromoted}
                        />
                      </>
                    )
                      :
                      (
                        <div className="flex flex-end justify-end px-2">

                          {ShowData?.promotionId ? (
                            <button className="bg-[#007e7661] no-border font-Poppins-Medium font-size-14px px-5 py-1 rounded-3xl feeds-btn text-[#007E76] flex flex-row gap-2 items-center">
                              Promoted
                            </button>
                          ) : ShowData?.promotionStatus === "in-review" ? (
                            <button className="bg-[#fff4b3] no-border text-[#a48e05] font-Poppins-Medium font-size-14px px-5 py-1 rounded-3xl feeds-btn flex flex-row gap-2 items-center">
                              Promotion in review
                            </button>
                          ) :
                            ShowData?.promotionStatus === "paused" ?
                              (
                                <button className="bg-[#fff4b3] text-[#a48e05] font-Poppins-Medium font-size-14px px-5 py-1 rounded-3xl feeds-btn flex flex-row gap-2 items-center">
                                  Promotion paused
                                </button>
                              )
                              :
                              (ShowData?.profileVerified && !ShowData?.promotionId) ?

                                <button onClick={() => setPromoteModal(true)} className="theme-bg-green font-Poppins-Medium font-size-14px px-5 py-1 rounded-3xl feeds-btn text-[#ffffff] flex flex-row gap-2 items-center">
                                  <img src={PromoteIcon} alt="promote" />
                                  Promote your profile
                                </button>
                                :
                                null

                          }

                          {/* {(ShowData?.profileVerified || ShowData?.promotionStatus === "completed") && (
                         
                          )} */}
                        </div>

                      )


                    }
                  </div>
                }
                {(UserRole === "participant" || UserRole === "provider" || UserRole === "company") && (


                  <div>
                    <button
                      onClick={handleNavigateToCompare}
                      className="font-size-14px theme-color-green font-Poppins-Medium feeds-btn  flex items-center gap-1 hover:text-white hover:bg-[#00443F] btn-w"
                    >
                      <FontAwesomeIcon icon={faUserGroup} />
                      Compare
                    </button>
                  </div>
                )}

              </div>
            </>
          )
            :
            (
              <>
                <div className="cover-img relative flex flex-row justify-between items-center px-6 mt-4">
                  <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                  <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                </div>
                <div className="cover-img relative flex flex-row justify-between items-center px-6 mt-4">
                  <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                  <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                </div>
                <div className="cover-img relative flex flex-row justify-between items-center px-6 mt-4">
                  <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                  <Skeleton variant="rounded" className="w-[10.5vw] mb-2" style={{ borderRadius: 13 }} height={15} />
                </div>
              </>
            )
        )}
      </div >

      {isImageModal && (
        <div className="ovrlayModal modal">
          <div
            className="createpost-modal absolute z-20"
            style={isImageModal === "cover" ? { width: "70vw" } : {}}
          >
            <button
              className="absolute close-icon-modal -top-5 font-size-24px"
              style={{ right: "-10px" }}
              disabled={isLoader}
              onClick={handleCloseImageModal}
            >
              <img className="" src={closeIcon} alt="" />
            </button>{" "}
            {/* close post modal */}
            <div className="mb-3">
              <h1 className="font-size-20px font-Poppins-SemiBold theme-color-green capitalize-first-letter">
                {isImageModal} photo
              </h1>
              <hr />
            </div>
            {displayImage && (
              <AvatarEditor
                className="m-auto"
                ref={editorRef}
                image={displayImage}
                width={isImageModal === "cover" ? 700 : 220}
                height={isImageModal === "cover" ? 280 : 220}
                border={20}
                borderRadius={isImageModal === "cover" ? 0 : 125}
                color={[255, 255, 255, 0.4]} // RGBA
                scale={1}
                rotate={0}
                disableBoundaryChecks={false}
                disableHiDPIScaling={true}
              />
            )}
            <div className="flex justify-end mt-3">
              <button
                onClick={handleImageResize}
                disabled={isLoader}
                className="theme-bg-green font-Poppins-Medium border-2 border-lime-500 font-size-14px px-5 py-1 inline-table rounded-3xl deleteModal-btn loader-btn"
                style={{ color: "#fff" }}
              >
                Update{" "}
                {isLoader && (
                  <CircularProgress
                    style={{ width: 14, height: 14, color: "#fff" }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )
      }
      {
        promoteModal && (
          <PromoteModal refType="profile"
            refId={userId || ""}
            onClose={() => setPromoteModal(false)} />
        )
      }
    </>
  );
};

export default ProfileUserDetailDashboard;