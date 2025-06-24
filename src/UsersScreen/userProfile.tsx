import React, { useState, useEffect, useCallback } from 'react';

import { useParams, useNavigate, useLocation, data } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store/store';
import { GetApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast } from 'sonner';
import HeaderGlobal from '../MainScreens/header/HeaderGolobal';
import ProfileUserDetailDashboard from './ProfileUserDetailDashboard';
import { removePublicProfile, setPublicProfile } from '../Redux/slices/userProfileSlice';
import Aboutme from '../Comp/Aboutme';

interface ApiResponse {
    success: boolean;
    message: string;
}
const UserProfile: React.FC = () => {

    // let { UserRole = "provider" } = getRole();
    const dispatch = useDispatch();
    const { uid } = useParams<{ uid: string }>();
    console.log(uid)
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

    const publicProfile = useSelector((store: RootState) => store.userProfile.publicData);
    const personalData= useSelector((store: RootState) => store.userProfile)
    const [isLoader, setIsLoader] = useState(false);

    // Functionality: API call for get public profile data for public profile
    // In UserProfile.tsx
    const fetchUserData = useCallback(async () => {
        setIsLoader(true);
        try {
            const res = await GetApi<any>(`/search/view/${uid}`);
            console.log(res, "Ree")
            if (res?.data?.documents || res?.data?.document) {
                const profile = res.data.document || res.data.documents;
                const connectionStatus = profile?.connectionStatus || "default";

                dispatch(setPublicProfile({
                    profile: profile,
                    connectionStatus: connectionStatus
                }));
            } else {
                toast.error("Failed to fetch profile data");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoader(false);
        }
    }, [uid, dispatch]);

    useEffect(() => {
        if (uid) {
            fetchUserData();
        }
    }, [fetchUserData, uid]);
    console.log(personalData)

    // useEffect(() => {
    //     fetchUserData();
    // }, [uid]); // Only run when uid changes
    // useEffect(() => {
    //     return () => {
    //         dispatch(removePublicProfile());
    //     };
    // }, [navigate]);
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
                    <ProfileUserDetailDashboard bool={false} setBool={() => { }} unpaidModalShow={unpaidModalShow} />
                    {/* {screenWidth < 450 && (

                        // <AddressSocialDetail
                        //     unpaidModalShow={false}
                        //     // userId={userId}
                        //     userId={uid}

                        // />
                    )} */}
                  {uid === personalData?.data?._id ?

                        (
                            <Aboutme />
                        )

                        :

                        (
                            ((personalData?.data?.profileDescription) &&
                                <Aboutme />
                            )
                        )
                    }


                    {/*blicData?.activitySection &&
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