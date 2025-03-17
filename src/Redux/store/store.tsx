import { configureStore } from "@reduxjs/toolkit";
import RegisterReducer from "../slices/Registerslices"; // ✅ Correct default import

export const store = configureStore({
    reducer: {
        register: RegisterReducer, // ✅ Ensure the key matches the slice name
    },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
