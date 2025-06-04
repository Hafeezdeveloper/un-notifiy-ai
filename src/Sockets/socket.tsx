
import { io, ManagerOptions, SocketOptions, Socket } from "socket.io-client";
import { Dispatch } from "redux";
import { useEffect } from "react";
import { addNewNotifications } from "../Redux/slices/notificationsSlice";
import { updateConnectionStatus, updateProfile } from "../Redux/slices/userProfileSlice";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL as string; // server URL
const token = localStorage.getItem("authToken");
const SOCKET_URLs = `${SOCKET_URL}?token=${token}` as string; // server URL




// let socket: Socket | null = null;
let socket: Socket | null = null;

let chatSocket: Socket | null = null;

let previousNotificationId = "";

// Common options for both sockets
const commonOptions: Partial<ManagerOptions & SocketOptions> = {
    transports: ['websocket', 'polling'],

    auth: {
        token: token,
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    timeout: 20000,
    autoConnect: false,
    // transports: ['websocket'],  // Ensures socket.io only uses WebSocket
    // Custom headers to simulate ping options (if needed)
    extraHeaders: {
        'X-Ping-Interval': '5000',
        'X-Ping-Timeout': '10000',
    },
};

// Function to initialize the socket connection
const initializeSocket = (dispatch: Dispatch): Promise<void> => {
    return new Promise((resolve) => {
        const latestToken = token
        const SOCKET_URL = SOCKET_URLs


        socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],

            autoConnect: false,
            auth: {
                token: SOCKET_URLs as string // Assuming getCookie returns a string token
            },

            extraHeaders: {
                'X-Ping-Interval': '5000',
                'X-Ping-Timeout': '10000',
            },
        });

        socket.on("connect", () => {
            // console.log("Connected to server:");

            resolve();
        });

        socket.on("notification", (data: any) => {
            console.log("on\n", data);
            if (previousNotificationId !== data?._id) {
                console.log("event==>notification", data);
                dispatch(addNewNotifications(data));
                previousNotificationId = data?._id;
            }
        });
        // socket.on("adminStats", (data: any) => {
        //     console.log("adminStats=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data);

        //     dispatch(fetchCountsSuccess(data))
        // });
        // socket.on("newReview", (data: any) => {
        //     console.log("newReview=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data);

        //     dispatch(fetchCountsSuccess(data))
        // });
        socket.on("newConnection", (data: any) => {
            console.log("newConnection=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data);

            dispatch(fetchCountsSuccess(data))
        });
        // socket.on("unviewedNetworkRequests", (data: any) => {
        //     console.log("unviewedNetworkRequests=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data);

        //     dispatch(fetchCountsSuccess(data))
        // });
        // socket.on("userUpdate", (data: any) => {
        //     console.log("userUpdate>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data);

        //     dispatch(fetchCountsSuccess(data))
        // });

       
        socket.on("connectionUpdate", (data) => {
            console.log(data,"aaaaaaaaaaaaaaaaaaaaaa")
            // dispatch(updateProfile());
            dispatch(updateConnectionStatus(data.nextStatus));




        })
        // socket.on("receiveMessage", (data: any) => {
        //     console.log("event==>receive-message", data);
        //     dispatch(updateUnReadMessages());
        // });
        // Add event listeners for socket disconnect
        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        // Add event listeners for connectionUpdate


        // Connect the socket
        socket.connect();
    });
};

// Function to initialize the chat socket connection
const initializeChatSocket = (dispatch: Dispatch): Promise<void> => {
    return new Promise((resolve) => {
        const SOCKET_URL = SOCKET_URLs


        chatSocket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],

            autoConnect: false,
            auth: {
                token: token as string // Assuming getCookie returns a string token
            },

            extraHeaders: {
                'X-Ping-Interval': '5000',
                'X-Ping-Timeout': '10000',
            },
        });

        chatSocket = io(SOCKET_URL, commonOptions);

        // Add event listeners for chat connection
        chatSocket.on("connect", () => {
            console.log("Connected to chat server:");
            resolve();
        });

        // chatSocket.on("receiveMessage", (data: any) => {
        //     console.log("event==>receive-message", data);
        //     dispatch(updateUnReadMessages());
        // });

        // chatSocket.on("notification", (data: any) => {
        //     console.log("notification==>notification", data);
        //     // dispatch(updateUnReadMessages());
        // });

        chatSocket.on("disconnect", () => {
            console.log("Disconnected from chat server");
        });

        chatSocket.connect();
    });
};

// Function to turn on the socket connection
const turnOnSocket = (): Promise<void[]> => {

    return Promise.all([
        new Promise<void>((resolve) => {
            if (socket) {
                socket.connect();
                resolve();
            } else {
                resolve();
            }
        }),
        // new Promise<void>((resolve) => {
        //     if (chatSocket) {
        //         chatSocket.connect();
        //         resolve();
        //     } else {
        //         resolve();
        //     }
        // })
    ]);
};

// Function to turn off the socket connection
const turnOffSocket = (): void => {
    console.log("DISCONNECT FOR BOTH SERVER");
    if (socket) {
        socket.disconnect();
    }
    if (chatSocket) {
        chatSocket.disconnect();
    }
};

export { initializeSocket, initializeChatSocket, turnOnSocket, turnOffSocket };
