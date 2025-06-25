import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserSignUp from '../MainScreens/StudentSignUp'
import TeacherSignUp from '../MainScreens/TeacherSignUp'
import FacultyLogin from '../MainScreens/FacultyLogin'
import VerificationPage from '../MainScreens/Verification'
import Login from '../MainScreens/Login'
import AdminLogin from '../MainScreens/AdminLogin'
import OtpVerify from '../MainScreens/OtpVerify'
import AdminSidebar from '../AdminPages/AdminDashboar'
import UsersRequest from '../AdminPages/UsersRequest'
import ChatPage from '../MainScreens/Chatot/Chatbot'
import PrivateRoute from '../Helper/ApiHandle/ProtectedRoute'
import Feeds from '../UsersScreen/Feeds'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Redux/store/store'
import { GetApi } from '../Helper/ApiHandle/BsApiHandle'
import { fetchProfileSuccess } from '../Redux/slices/userProfileSlice'
import UserProfile from '../UsersScreen/userProfile'
import Loginrecovery from '../UsersScreen/RecoveryPassword'
import Loginwelcomeback from '../UsersScreen/ConfirmPassword'
import UserNotification from '../UsersScreen/UserNotification'
import { setNotifications, SetNotificationsPayload, toogleNotificationLoader } from '../Redux/slices/notificationsSlice'
import { initializeSocket, turnOffSocket, turnOnSocket } from '../Sockets/socket'
import MyAnnoucenment from '../UsersScreen/MyAnnoucenment'
import { fetchCountsFailure, fetchCountsStart, fetchCountsSuccess } from '../Redux/slices/IndicatorSlice'
import ListAnnoucenment from '../MainScreens/ListAnnoucenment'
import AddSocialAnnoucenment from '../MainScreens/AddSocialAnnoucenment'
import JobPost from '../UsersScreen/JobPost'
import AIScreen from '../UsersScreen/AIScreen'
import AllConnections from '../UsersScreen/AllConnections'
import ProfileUserDetailEdit from '../Comp/ProfileUserDetailEdit'
import Alljobs from '../UsersScreen/Alljobs'

const AppRouter = () => {
  const { token } = useSelector((store: RootState) => store.auth); // Select authentication token from Redux store
  const dispatch = useDispatch(); // Redux dispatch function
  const notification = useSelector((store: RootState) => store.notification);
  const getData = async () => {
    // let ApiPath = `/api/user/my-profile`;
    const response = await GetApi<any>(`/user/my-profile`);
    console.log(response?.data.document)
    dispatch(fetchProfileSuccess(response?.data.document));
  }
  const fetchNotifications = async () => {
    dispatch(toogleNotificationLoader(true));
    const res = await GetApi<any>(`/notifications/all?page=${notification?.currentPage}&limit=${notification?.pageSize}`);

    if (res) {
      const payload: SetNotificationsPayload = {
        unreadCount: res.data.unreadCount || 0,
        Notification: res.data?.documents,
        totalCount: res.data?.paginated?.totalItems,
        totalPages: res.data?.paginated?.totalPages || 1,
      };
      dispatch(setNotifications(payload));
    } else {
      console.error("ERROR", res);
    }
    dispatch(toogleNotificationLoader(false));
  };
  useEffect(() => {
    if (token) {
      getData()
      fetchNotifications()
    }
  }, [token]);
  // Function to handle socket initialization
  const initializeSockets = async () => {
    await initializeSocket(dispatch);
    // await initializeChatSocket(dispatch);
    await turnOnSocket();
  };

  const disconnectSockets = async () => {
    await turnOffSocket();
  };


  useEffect(() => {
    const manageSocketConnections = async () => {
      if (token) {
        await disconnectSockets();
        await initializeSockets();
      } else {
        await turnOffSocket();
      }
    };

    manageSocketConnections();

    return () => {
      // Clean up socket connections when component unmounts (if needed)
      turnOffSocket();
    };
  }, [token]);

  useEffect(() => {
    const fetchCounts = async () => {
      dispatch(fetchCountsStart());
      try {
        const res = await GetApi<any>(`/user/user-indicator`);
        console.log("count", res.data)
        if (res) {
          dispatch(fetchCountsSuccess(res.data));
        } else {
          // dispatch(fetchCountsFailure(res.data.message));
        }
      } catch (err: any) {
        // dispatch(fetchCountsFailure(err.message));
      }


    };
    fetchCounts();
  }, [token]);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path='/*' element={<MainDashboard />} /> */}
          {/* {/* <Route path='' element={<MainDashboard />} /> */}
          <Route path='/chatbot' element={<ChatPage />} />

          {/* ✅ Protected route example */}
          <Route
            path='/admin/*'
            element={
              <PrivateRoute>
                <AdminSidebar />
              </PrivateRoute>
            }
          />
          <Route
            path='/feeds'
            element={
              <PrivateRoute>
                <Feeds />
              </PrivateRoute>
            }
          />
          <Route path='/notification' element={<PrivateRoute> <UserNotification /></PrivateRoute>} />
          <Route path='/MyAnnoucenment' element={<PrivateRoute> <MyAnnoucenment /></PrivateRoute>} />
          <Route path='/my-annoucenment' element={<PrivateRoute> <ListAnnoucenment /></PrivateRoute>} />
          <Route path='/add-socail-annoucenment' element={<PrivateRoute> <AddSocialAnnoucenment /></PrivateRoute>} />
          <Route path='/job-Post' element={<PrivateRoute> <JobPost /></PrivateRoute>} />
          <Route path='/my-ai' element={<PrivateRoute> <AIScreen /></PrivateRoute>} />
          <Route path='/my-connection' element={<PrivateRoute> <AllConnections /></PrivateRoute>} />
          <Route path='/all-jobs' element={<PrivateRoute> <Alljobs /></PrivateRoute>} />
          <Route
            path='/public-profile/:uid/view'
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path='/user-profile-edit'
            element={
              <PrivateRoute>
                <ProfileUserDetailEdit />
              </PrivateRoute>
            }
          />
          <Route path='/forgot-password' element={<Loginrecovery />} />
          <Route path='/otp-verification' element={<OtpVerify />} />
          <Route path='/confirm-password' element={<Loginwelcomeback />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<UserSignUp />} />
          <Route path='/verification' element={<VerificationPage />} />
          <Route path='/teacherSignUp' element={<TeacherSignUp />} />
          <Route path='/facultyLogin' element={<FacultyLogin />} />
          <Route path='/facultyLogin' element={<FacultyLogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRouter
