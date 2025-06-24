import React, {
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
  useRef,
} from "react";
import facebook from "../../../assets/img/facebook.svg";
import Instagram from "../../../assets/img/Instagram.svg";
import LinkedIn from "../../../assets/img/LinkedIn.svg";
import WhatsApp from "../../../assets/img/WhatsApp.svg";
import infoicon from "../../../assets/img/infoicon.png";

import moment from "moment";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { decodeToken, PostApi, PutApi, PutApiToken } from "../Helper/ApiHandle/BsApiHandle";
import { RootState } from "../Redux/store/store";
import { capitalizeFirstLetter } from "../Helper/constants";
import HeaderGlobal from "../MainScreens/header/HeaderGolobal";
import LeftSidebar from "../MainScreens/leftSidebar/LeftSidebar";
import BsInp from "./BsInp";
import { toast, Toaster } from "sonner";
import { fetchProfileLoeader, fetchProfileSuccess, updateProfile, updateProfileDescription } from "../Redux/slices/userProfileSlice";
import BsButton from "./BsButton";


interface IUserDetails {
  firstName: string;
  lastName: string;
  roleCategory: string;
  dateofbirth: string;
  gender: string;
  phonenumber: string;
  address: string;
  suburb: string;
  state: string;
  postCode: string;
  [key: string]: any;
}

interface ISocialLinks {
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;
}
interface IApiResponse {
  message?: string;
  documents?: [] | object | string;

  response: OptionType;
}

interface OptionType {
  placeId: string;
  suburb: string;
  state: string;
  postcode: string;
  [key: string]: any;
}

const ProfileUserDetailEdit: React.FC = () => {
  const dispatch = useDispatch();
  const personalData = useSelector((store: RootState) => store.userProfile);
  const token = localStorage.getItem("authToken");
  const decodeUser = decodeToken(token)
  const UserRole = decodeUser?.role;

  // const { UserRole } = getRole(); // get user Role

  const [userDetailLoader, setUserDetailLoader] = useState(false); // loader for user detail update
  const [userDetails, setUserDetails] = useState({
    // user detail
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  let {
    fullName,
    firstName,
    lastName,
    email,
    role,
  } = userDetails;

  const [headlineLoader, setHeadlineLoader] = useState(false); // loader for headline update
  const [profileDescription, setProfileDescription] = useState<string>("" );

  const handleChangeSummary = (text: string) => {
    if (text.length > 100) {
      return;
    } else {
      setProfileDescription(text);
    }
  }; // summary change function

  // Functionality: API call for for update user data
  const handleSubmitUserDetail = async (e: FormEvent) => {
    e.preventDefault();
    setUserDetailLoader(true);

    // const birthDate = new Date(userDetails.dateofbirth);
    // const today = new Date();
    // const age = today.getFullYear() - birthDate.getFullYear();
    // const monthDifference = today.getMonth() - birthDate.getMonth();
    // const isValidAge =
    //   age > 15 ||
    //   (age === 15 && monthDifference > 0) ||
    //   (age === 15 &&
    //     monthDifference === 0 &&
    //     today.getDate() >= birthDate.getDate());

    // if (UserRole !== "company" && !isValidAge) {
    //   toast("You must be at least 15 years old.", { type: "error" });
    //   setUserDetailLoader(false);
    //   return; // Stop form submission
    // }
    // if (userDetails.phonenumber && userDetails.phonenumber.length < 10) {
    //   toast("Please enter correct phone number", { type: "error" });
    //   setUserDetailLoader(false);

    //   return; // Stop form submission
    // }

    const userDetailsToSubmit = {
      ...userDetails,
      firstName: userDetails.firstName.toLowerCase(),
      lastName: userDetails.lastName.toLowerCase(),
      gender: null,
    };

    // const { res, err } = await httpRequest<IApiResponse>({
    //   method: "put",
    //   path: `/api/user/account-details`,
    //   params: UserRole === "company" ? userDetailsToSubmit : userDetails,
    // });
    // if (res) {
    //   dispatch(updateProfile());
    //   toast(res?.message || "SUCCESS", { type: "success" }); // api message
    // } else {
    //   toast(err.message, { type: "error" }); // api error
    // }
    // setUserDetailLoader(false);
  };

  // Functionality: API call for for update social links

  // GOOGLE API**********

  useEffect(() => {
    if (personalData) {
      // Also update userDetails if necessary
      setUserDetails((prevDetails) => ({
        ...prevDetails,

      }));
    }
  }, [personalData]);
  useEffect(() => {
    if (personalData?.data?.profileDescription !== undefined) {
      setProfileDescription(personalData.data.profileDescription);
    }
  }, [personalData?.data?.profileDescription]);

  const handleSubmitHeadline = async () => {
    setHeadlineLoader(true);
    if (!profileDescription) {
      toast.error("Please enter headline");
    }
    const res = await PutApiToken<any>(`/user/summary`, { profileDescription: profileDescription });
    setHeadlineLoader(false);
    if (res) {
      dispatch(updateProfileDescription({ profileDescription: profileDescription }));
      toast.success("SUCCESS"); // api message
    } else {
      toast("error"); // api error
    }
    setHeadlineLoader(false);
  };

  return (
    <>
      <HeaderGlobal />
      <div className="container-1480  justify-between h-3vw gap-3 lg:flex md:flex block notification">
        <Toaster position="top-right" richColors />
        <LeftSidebar />
        <div className="w-full mt-2 lg:mt-0 md:mt-0">
          <h3 className="font-size-18px font-Poppins-SemiBold theme-color-green">
            {"Add Annoucenment"}
          </h3>
          <div className="shadow-lg bg-white rounded-none lg:rounded-xl mb-2 py-3 px-6 ">
            <h4 className="font-size-20px font-Poppins-SemiBold theme-color-green">
              Bio
            </h4>
            <form onSubmit={handleSubmitUserDetail}>
              <BsInp
                value={personalData?.data?.fullName || ""}
                name="fullName"
                required
                readOnly
              />
              <BsInp
                value={personalData?.data?.email || ""}
                name="fullName"
                required
                readOnly
              />
              <button
                disabled={userDetailLoader}
                type="submit"
                className="theme-bg-green  font-Poppins-Medium border-2 border-lime-500 font-size-14px px-5 py-1 inline-table rounded-3xl deleteModal-btn loader-btn"
                style={{ color: "white" }}
              >
                Update{" "}
                {userDetailLoader && (
                  <CircularProgress
                    style={{ width: 14, height: 14, color: "#fff" }}
                  />
                )}
              </button>
            </form>
          </div>
          <div className="shadow-lg bg-white rounded-none lg:rounded-xl mb-2 py-3 px-6 ">
            <h4 className="font-size-20px font-Poppins-SemiBold theme-color-green">
              Headline
            </h4>


            <textarea
              name="description"
              value={profileDescription}
              onChange={(e: any) =>
                handleChangeSummary(e.target.value)
              } rows={4}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your announcement here..."
            />
            <div className="rounded-md mt-4">
              <BsButton style={"w-26 rounded-pill bg-primary      hover:bg-blue-700 text-white py-2 transition"}
                isLoading={headlineLoader} label="Update" onClick={handleSubmitHeadline} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileUserDetailEdit;
