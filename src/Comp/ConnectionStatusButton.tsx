
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BsButton from './BsButton';
import { PostApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast } from 'sonner';
import { RootState } from '../Redux/store/store';
/**
 * ConnectionStatusButton Component
 * Renders different buttons based on the user's connection status.
 * Manages user status changes and renders appropriate buttons accordingly.
 * 
 * @param {string} status - Current status of the connection (default, cancel, pending, connected).
 * @param {string} uId - User ID related to the connection.
 * @param {boolean} showMessageButton - Flag to show the message button.
 */


interface ConnectionStatusButtonProps {
    status?: any;
    uId?: any;
    showMessageButton?: any;
    isPromotedId?: any;
}

const ConnectionStatusButton: React.FC<ConnectionStatusButtonProps> = ({
    status = "",
    uId = "",
    showMessageButton = false,
}) => {

    const data = useSelector((store: RootState) => store.connection.data);
    const [userStatus, setUserStatus] = useState<string>("");
    const [sendConnection, setSendConnection] = useState<any>(false);
    const [sendConnectionApproved, setSendConnectionApproved] = useState<any>(false);
    const [sendConnectionDeline, setSendConnectionDeclined] = useState<any>(false);
    const [sendConnectionRemove, setSendConnectionRemoved] = useState<any>(false);

    /**
     * Handles status change requests.
     * @param {string} e - New status value.
     */
    const requestChange = (e: string = "") => {
        setUserStatus(e);
    }; // this function is request status change function 
    const sendConnectionRequest = async () => {
        setSendConnection(true)
        const res = await PostApi<any>(`/connection/send`, { receiverId: uId });

        if (res) {
            requestChange(res?.data.nextStatus || "");
            setSendConnection(false)
            toast.error("success");
        } else {
            toast.error("error")
        }
        setSendConnection(false)
    };

    useEffect(() => {
        setUserStatus(status);
        if (data?.userId === uId) {
            setUserStatus(data?.nextStatus);
            console.log(data?.userId === uId, "data?.userId === uId")
            console.log(data?.nextStatus, "data?.nextStatusdata?.nextStatus")
        }
    }, [status, data]);


    // Functionality: API call for connection request accept
    const handleApproved = async () => { // approved function
        console.log("Awdawd", uId)
        setSendConnectionApproved(true)
        const res = await PostApi<any>(`/connection/accept`, { otherId: uId });
        console.log(res)
        if (res) {
            setSendConnectionApproved(false)
            requestChange(res?.data.nextStatus || "");
        } else {
            console.log(res)
            toast.error("error")
        }
        setSendConnectionApproved(false)
    };
    const handleDecline = async (btnText: any) => {
        setSendConnectionDeclined(true);
        const res = await PostApi<any>(`${btnText === "Withdraw" ? "/connection/cancel" : "/connection/reject"}`, { otherId: uId });
        if (res) {
            setSendConnectionDeclined(false);
            requestChange(res?.data.nextStatus || "");
        } else {
            toast.error("error")
        }
        setSendConnectionDeclined(false);
    };

    const connectionRemove = async () => {
        setSendConnectionRemoved(true);
        const res = await PostApi<any>(`/connection/remove`,{recieverId: uId});
        if (res) {
            setSendConnectionRemoved(false)
            requestChange(res?.data.nextStatus || "");
        } else {
            toast.error("error")
            setSendConnectionRemoved(false)
        }
        setSendConnectionRemoved(false)
    }
    return (
        <>
            {
                userStatus === "default" ?
                    <BsButton
                        style={"text-white bg-blue-600 font-size-14px theme-color-green font-Poppins-Medium feeds-btn flex"}
                        label="connect" id={uId || ""} onClick={sendConnectionRequest} isLoading={sendConnection} />
                    : userStatus === "pending" ?
                        <>
                            <BsButton
                                style={"text-white bg-green-600 font-size-14px theme-color-green font-Poppins-Medium feeds-btn flex"}
                                label="Approved" id={uId || ""}
                                onClick={() => handleApproved()} isLoading={sendConnectionApproved} />
                            <BsButton
                                style={"text-white bg-red-600 font-size-14px theme-color-green font-Poppins-Medium feeds-btn flex"}
                                label="Declined" id={uId || ""} onClick={() => handleDecline("Decline")} isLoading={sendConnectionDeline} />
                        </>
                        : userStatus === "cancel" ?
                            <BsButton
                                style={"text-white bg-red-600 font-size-14px theme-color-green font-Poppins-Medium feeds-btn flex"}
                                label="Withdraw" id={uId || ""} onClick={() => handleDecline("Withdraw")} isLoading={sendConnectionDeline} />
                            : userStatus === "connected" ?

                                <BsButton style={"text-white bg-red-600 font-size-14px theme-color-green font-Poppins-Medium feeds-btn flex"}
                                    label="Remove" id={uId || ""} onClick={connectionRemove} isLoading={sendConnectionRemove} />
                                // <RemoveButton id={uId || ""} onSuccess={requestChange} />
                                :
                                ""
            }
            {/* {(userStatus === "connected" && showMessageButton) &&
                <a
                    href={`${chatUrl}`}

                    // onClick={handleClick} 

                    className="btn-w font-size-14px theme-color-green flex font-Poppins-Medium feeds-btn  hover:text-white hover:bg-[#00443F]">Message</a>
            } */}

        </>
    );
};

export default ConnectionStatusButton;