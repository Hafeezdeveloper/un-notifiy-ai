import React, { useState } from "react";
import edit from "../../../assets/img/awesome-edit.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {

  faPenToSquare,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../Redux/store/store";
import { PublicDataType } from "../Redux/slices/userProfileSlice";
import { truncateString } from "../Helper/constants";
import { decodeToken } from "../Helper/ApiHandle/BsApiHandle";
function Aboutme() {
  const location = useLocation()
  const token = localStorage.getItem("authToken");
  const decodeUser = decodeToken(token)
  const publicData = useSelector((store: RootState) => store.userProfile.publicData);
  const personalData = useSelector((store: RootState) => store.userProfile)

  const ShowData = location.pathname.startsWith("/public-profile") ? (publicData as PublicDataType) : (personalData as PublicDataType);

  const [isFullText, setIsFullText] = useState(false); // toogle state see more or see less
  const companyAboutData = [
    { heading: "Website", value: ShowData?.website },
    { heading: "Phone", value: ShowData?.phone },
    { heading: "Company size", value: ShowData?.companySize },
    { heading: "Headquater", value: ShowData?.headQuaters },
    { heading: "Founded", value: ShowData?.founded },
  ]
  return (
    <div className="shadow-lg rounded-none bg-white lg:rounded-xl mb-2 pb-3 px-6 ">
      <div className="flex justify-between items-center">
        <h4 className="font-size-20px font-Poppins-SemiBold theme-color-green ">
          About {"me"}
        </h4>
        {decodeUser.userId === ShowData?._id && (
          <Link to="/user-profile-edit" className="mt-5 edit-pro-icon ">
            <FontAwesomeIcon icon={faPenToSquare} />
          </Link>
        )}
      </div>
      <div>
        {isFullText ? (
          <>
            <p className="font-size-16px theme-grey-type  font-Poppins-Regular">
              {ShowData?.profileDescription || ""}
            </p>{" "}
            {/* full text */}
          </>
        ) : (
          <>
            <p className="font-size-16px theme-grey-type  font-Poppins-Regular">
              {truncateString(ShowData?.profileDescription, 400)}
            </p>{" "}
            {/* truncate text */}
          </>
        )}
        {ShowData?.profileDescription?.length > 400 && (
          <div className="flex justify-end">
            <button
              onClick={() => setIsFullText(!isFullText)}
              className="font-size-16px theme-grey-type  font-Poppins-Regular"
            >
              ...See {isFullText ? "less" : "more"}
            </button>
          </div>
        )}

        {" "}
        {/* see more button */}
        {/* {((userId !== ShowData?._id && ShowData?.phone) || (ShowData?.phone)) &&
          companyAboutData && companyAboutData.map((item: any, index: any) => (
            <div className="mt-2">
              <h4 className="font-size-20px font-Poppins-SemiBold theme-color-green ">
                {item?.heading}
              </h4>
              <div className="mt-1">
                <p className="font-size-16px theme-grey-type  font-Poppins-Regular">
                  {item?.value}
                </p>
              </div>
            </div>
          ))

        } */}
      </div>
    </div>
  );
}

export default Aboutme;
