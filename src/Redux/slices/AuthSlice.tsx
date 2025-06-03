// AuthSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storeToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    storeTwoFactor: (
      state :any,
      action: PayloadAction<{ time: number | string | undefined; email: string; admin: boolean; keepMeloggedIn: boolean }>
    ) => {
      const { time, email, admin, keepMeloggedIn } = action.payload;
      state.towFactorEmail = email;
      state.twoFactorDuration = time || '';
      state.admin = admin;
      state.keepMeloggedIn = keepMeloggedIn;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
    }
  },
  
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  }
});

export const {
  storeToken,
  storeTwoFactor
} = authSlice.actions;
export default authSlice.reducer;