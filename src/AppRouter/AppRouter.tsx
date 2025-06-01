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

const AppRouter = () => {
  const { token } = useSelector((store: RootState) => store.auth); // Select authentication token from Redux store
  const dispatch = useDispatch(); // Redux dispatch function

  const getData = async () => {
    // let ApiPath = `/api/user/my-profile`;
    const response = await GetApi<any>(`/user/my-profile`);
    console.log(response?.data.document )
    dispatch(fetchProfileSuccess(response?.data.document));
  }
  useEffect(() => {
    if (token) {
      getData()
    }
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
          <Route
            path='/public-profile/:uid/view'
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path='/otp-verification' element={<OtpVerify />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<UserSignUp />} />
          <Route path='/verification' element={<VerificationPage />} />
          <Route path='/teacherSignUp' element={<TeacherSignUp />} />
          <Route path='/facultyLogin' element={<FacultyLogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRouter
