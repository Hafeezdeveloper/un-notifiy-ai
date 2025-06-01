// src/slices/userProfileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Department {
  _id: string;
  name: string;
}

interface Section {
  _id: string;
  name: string;
}

interface Semester {
  _id: string;
  name: string;
}

interface Batch {
  _id: string;
  name: string;
}

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  statusOnline: boolean;
  dateofbirth: string | null;
  gender: string;
  firebasetoken: string;
  department: Department | null;
  section: Section | null;
  semester: Semester | null;
  batch: Batch | null;
  profileImageUrl: string;
  
}

interface UserProfileState {
  data: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  data: null,
  loading: false,
  error: null
};
interface SetPublicProfilePayload {
  profile: PublicDataType;
  services: Array<string>;
  connectionStatus: string;
  [key: string]: any;
}
export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    fetchProfileStart(state) {
      state.loading = true; 
      state.error = null;
    },
    fetchProfileSuccess(state, action: PayloadAction<UserProfile>) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchProfileFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    clearProfile(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    setPublicProfile(state:any, action: PayloadAction<any>) {
      state.publicData = action.payload.profile; // Ensure this is correctly set
      state.publicServices = action.payload.services;
      state.connectionStatus = action.payload.connectionStatus;
    },
    removePublicProfile(state:any) {
      state.publicData = {};
      state.publicServices = [];
      state.connectionStatus = "default";
    },
  }
});

export const { 
  removePublicProfile,
  setPublicProfile,
  fetchProfileStart, 
  fetchProfileSuccess, 
  fetchProfileFailure,
  updateProfile,
  clearProfile 
} = userProfileSlice.actions;

export default userProfileSlice.reducer;