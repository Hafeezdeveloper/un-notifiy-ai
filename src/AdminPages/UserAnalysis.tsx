

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GetApi } from '../Helper/ApiHandle/BsApiHandle';
import FreeUser from "../assets/img/FreeUser.svg";
import "../assets/css/admin.css"
interface DashboardData {
  currentUsers: {
    current: number;
    last: number;
    [key: string]: any;
  };
  paidMonthly: {
    current: number;
    last: number;
    [key: string]: any;
  };
  paidAnnually: {
    current: number;
    last: number;
    [key: string]: any;
  };
  upgradedUser: {
    current: number;
    last: number;
    [key: string]: any;
  };
  totalJobs: {
    current: number;
    last: number;
    [key: string]: any;
  };
  activeJobs: {
    current: number;
    last: number;
    [key: string]: any;
  };
  completedJobs: {
    current: number;
    last: number;
    [key: string]: any;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  documents: DashboardData;
}

const UserAnalysis: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [roleData, setRoleData] = useState<any>([])

  const fetchRoleData = async () => {
    const res = await GetApi<ApiResponse>('/user/dashboard-role-data');
    if (res) {
      console.log(res, "resss")
      setRoleData(res.data)
    }
    else {
    }
  }
  useEffect(() => {
    fetchRoleData()
  }, [])


  const calculatePercentage = (current: number, last: number) => {
    if (last === 0) {

      return (current) / 1 * 10;
    }
    else if (current === 0) {
      return (last) / 1 * -10;


    }
    return ((current - last) / last) * 100;
  };

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     const { res, err } = await httpRequest<ApiResponse>({
  //       method: 'get',
  //       path: '/api/admin/user/dashboard-data',
  //     });

  //     if (res) {
  //       setDashboardData(res?.documents || null);
  //     } else {

  //       if (err?.status === 415) {
  //         return
  //       }
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

  return (
    <div className='pb-5 shadow-lg bg-white rounded-xl mb-2 py-3 px-6  '>
      {roleData && (
        <>
          <div className='mt-4 grid justify-between gap-2' style={{ gridTemplateColumns: "16% 16% 16% 16% 16% 16%" }}>

            {/* Free Users */}
            <div style={{textDecoration:"none"}} className="dashboard-data p-2">
              <img src={FreeUser} alt='free-user' />
              <Link   style={{textDecoration:"none"}} to="/all-users?tabName=">
                <h3 className="font-Poppins-Medium text-dark font-size-16px">Total users</h3>
              </Link>
              <p className="font-size-28px text-dark font-Poppins-SemiBold">{roleData?.totalUsers}</p>



            </div>

            {/* Monthly Premium Users */}
            <div style={{textDecoration:"none"}} className="dashboard-data p-2">
              <img src={FreeUser} alt='premium-user' />
              <Link style={{textDecoration:"none"}} to="/all-users?tabName=participant">

                <h3 className="font-Poppins-Medium text-dark font-size-16px">Total students</h3>
              </Link>
              <p className="font-size-28px text-dark font-Poppins-SemiBold">{roleData?.student}</p>



            </div>

            {/* Annually Premium Users */}
            <div  style={{textDecoration:"none"}} className="dashboard-data p-2">
              <img src={FreeUser} alt='premium-user' />
              <Link  style={{textDecoration:"none"}} to="/all-users?tabName=provider">

                <h3 className="font-Poppins-Medium text-dark font-size-16px">Total teachers</h3>
              </Link>
              <p className="font-size-28px text-dark font-Poppins-SemiBold">{roleData?.teacher}</p>



            </div>
 
            {/*  Upgraded Users */}
            <div className="dashboard-data p-2">
              <img src={FreeUser} alt='upgraded-user' />
              <Link style={{textDecoration:"none"}}  to="/all-users?tabName=company">

                <h3 className="font-Poppins-Medium text-dark font-size-16px">Total faculty</h3>
              </Link>
              <p className="font-size-28px text-dark font-Poppins-SemiBold">{roleData?.faculty}</p>



            </div>

            {/* Annually Premium Users */}
            <div className="dashboard-data p-2">
              <img src={FreeUser} alt='premium-user' />
              <Link style={{textDecoration:"none"}} to="/all-users?tabName=&filter=false">

                <h3 className="font-Poppins-Medium text-dark font-size-16px">Total userRequest</h3>
              </Link>
              <p className="font-size-28px text-dark font-Poppins-SemiBold">{roleData.userRequest}</p>



            </div>


            {/* Annually Premium Users */}
            <div className="dashboard-data p-2">
              <img src={FreeUser} alt='premium-user' />
              <Link style={{textDecoration:"none"}} to="/all-users?tabName=&filter=true">

                <h3 className="font-Poppins-Medium text-dark font-size-16px">Total totalApproved</h3>
              </Link>
              <p className="font-size-28px text-dark font-Poppins-SemiBold">{roleData.totalApproved}</p>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default UserAnalysis;
