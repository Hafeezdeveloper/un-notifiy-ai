import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
    // _id: string;
    // message: string;
    // read: boolean;

    [key: string]: any;
}
interface documents {
    _id: string;
    message: string;
    [key: string]: any;
}

interface NotificationsState {
    notificationLoader: boolean;
    currentPage: number;
    pageSize: number;
    unReadNotifications: number;
    allNotifications: Notification[];
    totalPage: number;
}

export interface SetNotificationsPayload {
    unreadCount: number;
    Notification: Notification[];
    totalCount: number;
    totalPages: number; // Added totalPages here

    [key: string]: any;
}

const initialState: NotificationsState = {
    notificationLoader: false,
    currentPage: 1,
    pageSize: 20,
    unReadNotifications: 0,
    allNotifications: [],
    totalPage: 1,
};

const notificationsSlice = createSlice({
    name: 'NOTIFICATIONS',
    initialState,
    reducers: {
        toogleNotificationLoader(state, { payload }: PayloadAction<boolean>) {
            state.notificationLoader = payload ?? false;
        },
        // setNotifications(state, action: PayloadAction<SetNotificationsPayload>) {
        //     const { unreadCount, Notification, totalCount } = action.payload;
        //     state.allNotifications = Notification;
        //     state.unReadNotifications = unreadCount;
        //     state.totalPage = totalCount ? Math.ceil(totalCount / state.pageSize) : 1;
        // },
        setNotifications(state, action: PayloadAction<SetNotificationsPayload>) {
            const { unreadCount, Notification, totalCount,totalPages  } = action.payload;
            // state.allNotifications = Notification;
            state.allNotifications = [...state.allNotifications, ...Notification];
            state.unReadNotifications = unreadCount;
            state.totalPage = totalPages; // Use totalPages from the payload
            
            
        },
        setNotificationPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        resetUnreadNotifiation(state) {
            state.unReadNotifications = 0;
        },
        resetAllNotifications(state) {
            state.currentPage = 1;
            state.pageSize = 10;
            state.unReadNotifications = 0;
            state.allNotifications = [];
            state.totalPage = 1;
        },
        addNewNotifications(state, { payload }: PayloadAction<Notification>) {
            state.allNotifications.unshift(payload); // Add payload to the beginning of the array
            if (state.allNotifications.length > 10) {
                state.allNotifications.pop(); // Remove the last item if length exceeds 10
            }
            state.unReadNotifications += 1; // add unread count
        }
    },
});

export const {
    toogleNotificationLoader,
    setNotifications,
    setNotificationPage,
    resetUnreadNotifiation,
    resetAllNotifications,
    addNewNotifications
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
