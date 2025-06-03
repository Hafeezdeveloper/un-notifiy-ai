// UserNotification.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { resetUnreadNotifiation, setNotificationPage } from "../Redux/slices/notificationsSlice";
import { PostApi } from "../Helper/ApiHandle/BsApiHandle";
import HeaderGlobal from "../MainScreens/header/HeaderGolobal";
import { RootState } from "../Redux/store/store";
import { toast } from "sonner";
import LeftSidebar from "../MainScreens/leftSidebar/LeftSidebar";
import "../assets/css/paidprovider.css"

interface NotificationItem {
    notificationRoute: string;
    routeId: string;
    imageUrl?: string;
    title?: string;
    message?: string;
    createdAt: string;
}

function UserNotification() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Extract notification-related data from the Redux store
    const notificationLoader = useSelector((state: RootState) => state.notification.notificationLoader);
    const allNotifications = useSelector((state: RootState) => state.notification.allNotifications);
    const currentPage = useSelector((state: RootState) => state.notification.currentPage);
    const totalPage = useSelector((state: RootState) => state.notification.totalPage);


    const personalData = useSelector((store: RootState) => store.userProfile.data);

    const handlePageChange = (_page: number) => {
        dispatch(setNotificationPage(_page));
    };

    const navigateToRoute = (item: NotificationItem) => {
        const { notificationRoute, routeId } = item;
        switch (notificationRoute) {
            case 'profile':
                return `/public-profile/${routeId}/view`;
            case 'news-feed':
                return `/feed-detail/${routeId}/view`;
            default:
                return "/notification";
        }
    };

    // Component to render individual notification items
    const RenderNotifications: React.FC<{ item: NotificationItem; index: number }> = ({ item, index }) => {
        const route = navigateToRoute(item);

        // If the route is for external domain (chat), use window.location.href instead of Link

        return (
            <Link to={route as string} key={index} style={{textDecoration:"none", }} className="noti-spec-main mb-4 shadow-lg text-dark">
                <div className="noti-spec">
                    <img className="" src={`${item?.imageUrl}`} />
                    {/* <img className="" src={`${process.env.REACT_APP_BASE_URL_IMAGE}${item?.imageUrl}`} /> */}
                    <div className="flex  flex-col ">
                        <h2 className="font-size-16px font-Poppins-SemiBold capitalize-first-letter pb-1 theme-color-green">{item?.title || ""}</h2>
                        <p className="font-size-13px font-Poppins-Medium   theme-color-green">{item?.message || ""}</p>
                    </div>
                </div>
                {/* <div> <span className="font-size-16px font-Poppins-Medium theme-grey-type">{moment(item?.createdAt).format("hh:mm A") || ""}</span>   </div> */}
                <div>
                    <span className="font-size-13px font-Poppins-Medium theme-grey-type">
                        {moment(item?.createdAt).isSame(moment(), 'day')
                            ? moment(item?.createdAt).format("hh:mm A") // If today, show time only
                            : moment(item?.createdAt).format("DD-MM-YYYY hh:mm A") // If not today, show date and time
                        }
                    </span>
                </div>
            </Link>
        );
    };

    const fetchNotifications = async () => {
        const res = await PostApi<any>(`notifications/mark-as-read`, {});
        if (res) {
            dispatch(resetUnreadNotifiation());
        } else {
            toast.error("error");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div>
            <div className="font-poppins-regular">
                <HeaderGlobal />
                <div className="container-1480 h-3vw lg:flex md:flex block gap-3 notification">
                    <LeftSidebar />
                    <div className="Admin-main-operator-parent w-full">
                        <div className="">
                            <div className="shadow-lg bg-white rounded-none lg:rounded-lg mb-2 py-3 px-6 flex justify-between items-center">
                                <h2 className="font-size-20px font-Poppins-SemiBold pl-2 lg:pl-0 theme-color-green">
                                    Notifications
                                </h2>
                                <button onClick={() => navigate(-1)}>
                                    <img className="cursor-pointer notifi-back" src="https://edgie.backslashwebs.com/imgs%2FBeck-icon.png" alt="back" />
                                </button>
                            </div>
                            <div className="">
                                <div className="noti-scroll">
                                    <InfiniteScroll
                                        dataLength={allNotifications?.length || 0}
                                        next={() => {
                                            if (currentPage < totalPage) {
                                                dispatch(setNotificationPage(currentPage + 1));
                                            }
                                        }}
                                        hasMore={currentPage < totalPage}
                                        loader={<CircularProgress />}
                                        endMessage={<p style={{ textAlign: "center" }}>No more notifications to show</p>}
                                    >
                                        {allNotifications?.length > 0
                                            ? allNotifications.map((item: any, index: number) => (
                                                <RenderNotifications item={item} index={index} key={index} />
                                            ))
                                            : null
                                        }
                                    </InfiniteScroll>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserNotification;