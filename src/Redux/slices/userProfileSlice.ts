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
  userId: string;
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
  connectionStatus: string;
}

interface UserProfileState {
  data: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: boolean;
  publicData: {}, // initially an empty object, will be updated to PublicDataType
  connectionStatus: "default",

}

const initialState: UserProfileState = {
  data: null,
  loading: false,
  error: null, publicData: {}, // initially an empty object, will be updated to PublicDataType
  updateProfile: false,
  connectionStatus: "default",

};
export interface PublicDataType {
  _id?: string;
  role?: string;

  coverImageUrl?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  providerCategory?: string;
  profileSummary?: string;

  verification?: string;
  freeUser?: boolean;
  profileVerified?: boolean;
  totalRatings?: number;
  totalReviews?: number;
  connectionsLength?: number;
  cancelledJobs?: number;
  completedJobs?: number;
  [key: string]: any; // Other properties as needed
}

interface SetPublicProfilePayload {
  profile: PublicDataType;
  connectionStatus: string;
  [key: string]: any | null;
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
    updateProfile(state) {
      state.updateProfile = !state.updateProfile;
    },
    clearProfile(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    setPublicProfile(state: any, action: PayloadAction<SetPublicProfilePayload>) {
      state.publicData = action.payload.profile; // Ensure this is correctly set
      state.publicServices = action.payload.services;
      state.connectionStatus = action.payload.connectionStatus;
    },
    removePublicProfile(state: any) {
      state.publicData = {};
      state.publicServices = [];
      state.connectionStatus = "default";
    },
    updateConnectionStatus(state, action: PayloadAction<any>) {
      console.log(action.payload, "action.payloadaction.payloadaction.payload")
      state.connectionStatus = action.payload;
    },
  }
});

export const {
  removePublicProfile,
  updateConnectionStatus,
  setPublicProfile,
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfile,
  clearProfile
} = userProfileSlice.actions;

export default userProfileSlice.reducer;