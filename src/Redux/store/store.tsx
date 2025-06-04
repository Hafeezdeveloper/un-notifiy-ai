// store.ts
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../slices/AuthSlice';
import userProfileReducer from '../slices/userProfileSlice';
import newsFeedSlice from '../slices/newzfeedSlice';
import connectionsSlice from '../slices/connectionsSlice';
import notificationsSlice from '../slices/notificationsSlice';
import IndicatorSlice from "../slices/IndicatorSlice";

const persistConfig = {
  key: 'token',
  version: 1,
  storage,
  whitelist: ['token'] // Only persist the token field
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    feed: newsFeedSlice,
    auth: persistedReducer,
    userProfile: userProfileReducer,
    connection: connectionsSlice,
    notification: notificationsSlice,
    indicator: IndicatorSlice,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific redux-persist actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;