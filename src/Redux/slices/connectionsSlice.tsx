// 04-06-24
// create slice for user connection status
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ConnectionStatus {
    userId: string;
    nextStatus: string;
}

interface ConnectionsState {
    data: ConnectionStatus;
}

const initialState: ConnectionsState = {
    data: {
        userId: "",
        nextStatus: "",
    },
};

const connectionsSlice = createSlice({
    name: "CONNECTION_STATUS",
    initialState: {
        data: {
            userId: "",
            nextStatus: ""
        },
    },
    reducers: {
        changeConnectionStatus: (state, { payload }: PayloadAction<ConnectionStatus>) => {
            state.data = payload;
        },
    },
});

export const { changeConnectionStatus } = connectionsSlice.actions;
export default connectionsSlice.reducer;