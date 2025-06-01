import React, { useState, useEffect } from 'react';

import { useParams, useNavigate, useLocation, data } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store/store';
import { GetApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast } from 'sonner';
import HeaderGlobal from '../MainScreens/header/HeaderGolobal';
import ProfileUserDetailDashboard from './ProfileUserDetailDashboard';
import { removePublicProfile, setPublicProfile } from '../Redux/slices/userProfileSlice';

interface ApiResponse {
    success: boolean;
    message: string;
}
const UserProfile: React.FC = () => {

    // let { UserRole = "provider" } = getRole();
    const dispatch = useDispatch();
    const { uid } = useParams<{ uid: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);



    const [unpaidModalShow, setUnpaidModalShow] = useState(false);
    const [error, setError] = useState<any>("");
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth)

    useEffect(() => {
        setScreenWidth(window.innerWidth)
    }, [window.innerWidth])

    const personalData = useSelector((store: RootState) => store.userProfile);
    // const { personalData, connectionStatus, publicData } = useSelector((store: RootState) => store.userProfile)
    const [isLoader, setIsLoader] = useState(false);

    // Functionality: API call for get public profile data for public profile
    const fetchUserData = async () => {
        setIsLoader(true);
        const res = await GetApi<any>(`/api/search/view/${uid}`);
        // let path = "";
        // if (UserRole === "admin" || UserRole === "superAdmin" || UserRole === "editor") {
        //     path = `/api/admin/user/profile/${uid}`;
        // }
        // else {
        // path = `/api/search/view/${uid}?promotionId=${isPromoted ?? ""}`
        // }
        // const { res, err } = await httpRequest<ApiResponse>({ path: path, navigate });
        // const { res, err } = await httpRequest<ApiResponse>({ path: `/api/search/view/${uid}`, navigate });
        if (res) {
            const profile = res?.data.document || res?.data?.documents || [];
            const services = profile?.services || [];
            const connectionStatus = profile?.connectionStatus || "default";

            const clonedProfile = JSON.parse(JSON.stringify(profile)); // Deep clone the profile

            dispatch(setPublicProfile({
                profile: clonedProfile,
                services: services,
                connectionStatus: connectionStatus
            }));
        }
        else {
          
            toast.error("error");
        }
        setIsLoader(false);
    };
    console.log("AWDAW" ,personalData)
    useEffect(() => {
        fetchUserData();
    }, [uid, personalData]);

    useEffect(() => {
        return () => {
            dispatch(removePublicProfile());
        };
    }, [navigate]);
    // const hasTruePreference = publicData?.preferences &&
    //     Object.values(publicData.preferences).some((value) => value === true);

    // This will only run when publicData changes




    return (
        <>
            {/* {(UserRole === "admin" || UserRole === "superAdmin" || UserRole === "editor")
                ?
                <>
                    <AdminHeader />

                </>
                : */}
                <HeaderGlobal />
            {/* } */}


            <div className='container-1480 flex justify-between h-3vw'>

                <div className="w-full md:w-3/4 lg:w-3/4">
                    <ProfileUserDetailDashboard bool={false} setBool={() => { }} unpaidModalShow={unpaidModalShow}  />
                    {/* {screenWidth < 450 && (

                        // <AddressSocialDetail
                        //     unpaidModalShow={false}
                        //     // userId={userId}
                        //     userId={uid}

                        // />
                    )} */}
                    {/* {uid === userId ?

                        (
                            <Aboutme />
                        )

                        :

                        (
                            ((publicData?.profileDescription) &&
                                <Aboutme />
                            )
                        )
                    }


                    {publicData?.activitySection &&
                        <PostActivity
                            uId={uid}
                        />
                    }

                    {publicData?.role === "provider" || publicData?.role === "company"
                        ?
                        <>
                            {/* only for provider */}

                            {/* {uid === userId ?

                                (
                                    <Availability />
                                )

                                :

                                (
                                    (publicData?.availability &&
                                        <Availability />
                                    )
                                )
                            }

                            {uid === userId ?

                                (
                                    <WorkHistory />
                                )



                                :

                                (
                                    ((publicData?.experience && publicData.role !== "company") &&
                                        <WorkHistory />
                                    )
                                )
                            }

                            {/* {publicData?.experience &&
                                <>
                                    <WorkHistory /> 
                                </>
                            } */}
{/* 
                            {uid === userId ?

                                (
                                    <EducationTraining />
                                )



                                :

                                (
                                    (publicData?.education && publicData.role !== "company" &&
                                        <EducationTraining />
                                    )
                                )
                            }


                            <ServicesProfile /> {/* only for provider */}
                            {/* <HourlyRate />  
                            <WorkLocation /> */}
                        {/* </>
                        : null
                    } */}

{/* 
                    {uid === userId ?

                        (
                            <>
                                <PreferencesInterest />
                            </>
                        )



                        :

                        (
                            ((publicData?.preferences && publicData.role !== "company") &&
                                <PreferencesInterest />
                            )
                        )
                    }

                    <ReviewProfile unpaidModalShow={unpaidModalShow} /> */}
                {/* </div>  */}

                {/* <AddressSocialDetail
                    userId={uid}
                    unpaidModalShow={unpaidModalShow}
                /> */}
             {/* {screenWidth > 450 && (

                    <AddressSocialDetail
                        unpaidModalShow={false}
                        // userId={userId}
                        userId={uid}

                    />
                )} */}
                
                </div>
                </div>

        </>
    );
};

export default UserProfile;