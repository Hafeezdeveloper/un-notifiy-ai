import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faEllipsisVertical,
  faMagnifyingGlass,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import qs from "qs";
import { CircularProgress } from '@mui/material';
import HeaderGlobal from './header/HeaderGolobal';
import Headline from '../Comp/Headline';
import PaginationComponent from '../Comp/PaginationComponet';
import { DeleteApi, GetApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast } from 'sonner';
import moment from 'moment';
import BsInp from '../Comp/BsInp';
import AdminButtonComp from '../Comp/AdminButtonComp';
import Model from '../Comp/Model';

interface PlanManager {
  userId: string;
  fullName: string;
  email: string;
  phonenumber: string;
  address: string;
  profileImageUrl: string;
  associatedJobs?: string[];
}

interface QueryParams {
  roleCategory: string;
  role: string;
  page: number;
  limit: number;
  search: string;
  sortBy: string;
}

function ListAnnoucenment() {
  const LoaderComponents = () => {
    return (
      <div className="full_page_loader">
        <CircularProgress style={{ color: "#fff" }} />
      </div>
    );
  };
  const navigate = useNavigate()
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoader, setIsLoader] = useState(false)
  const [totalPages, setTotalPages] = useState<number>(1);
  const [annoucenment, setAnnouncements] = useState<any>([]);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    roleCategory: "plan manager",
    role: "",
    page: 1,
    limit: 10,
    search: "",
    sortBy: ""
  })
  const getPlanManagers = async () => {
    try {
      setIsLoader(true);
      const apiParams = {
        page: queryParams.page,
        pageSize: queryParams.limit,
        ...(queryParams.search && { search: queryParams.search })
      };
      const res = await GetApi<any>(`/announcements/my-annoucenmnet`, apiParams);
      setIsLoader(false);
      if (res?.data?.documents) {
        setAnnouncements(res?.data?.documents);
        setTotalPages(res?.data.paginated?.totalPages);
      }
    } catch (error) {
      setIsLoader(false);
      toast.error("Failed to load announcements");
    } finally {
      setIsLoader(false);
    }
  }

  useEffect(() => {
    getPlanManagers()
  }, [queryParams]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Update the search term in queryParams
    setQueryParams((prevParams) => ({
      ...prevParams,
      search: value,
      page: 1, // Reset to first page on new search
    }));
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      // 🔁 Replace with your actual delete API
      let response = await DeleteApi<any>(`/announcements/delete-social`, selectedRow);
      if (response.data.sucess) {
        toast.success("Annoucenment deleted!");
      }
      getPlanManagers(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete Annoucenment");
    } finally {
      setModalOpen(false);
      setSelectedRow(null);
    }
  }
  return (
    <div>
      <div className="">
        {/* <AdminSidebar /> */}
        <HeaderGlobal />
        <div className="container-1480 h-3vw ">
          <Headline title={"My Annoucenment"} location={-1} />
          <div className='flex justify-between items-center'>
            <BsInp
              label="Search Annoucenment"
              type="text"
              name="search"
              value={queryParams.search}
              onChange={handleSearchChange}
              placeholder="Search Annoucenment"
            />
            <AdminButtonComp onClick={() => navigate("/add-socail-annoucenment")} label="Add Annoucenment" />
          </div>

          <div className='mt-3'>
            <ul
              className="outer-detail-border main-Admin-status-action Admin-status-content-Role font-Poppins-SemiBold font-size-18px"
              style={{
                gridTemplateColumns: "20% 20% 16% 18% 18% 8%",
              }}
            >
              <li className="text-white " style={{ justifyContent: "flex-start", paddingLeft: "1rem" }}>Description </li>
              <li className="text-white" style={{ justifyContent: "flex-start", paddingLeft: "1rem" }}>Role Send to</li>
              <li className="text-white" style={{ justifyContent: "flex-start", paddingLeft: "1rem" }}>Total Count send</li>
              <li className="text-white" style={{ justifyContent: "flex-start", paddingLeft: "1rem" }}>Time</li>
              <li className="text-white">Action</li>
            </ul>
          </div>
          {isLoader ?

            <LoaderComponents />
            :
            <div className='pt-4'>
              {annoucenment && annoucenment.length > 0 ?

                annoucenment.map((item: any, index: number) => (
                  <ul
                    key={index}
                    style={{
                      gridTemplateColumns: "20% 20% 16% 18% 18% 8%",
                    }}

                    className="mb-4 under-detail-border Admin-status-content-Role main-Admin-status-content text-[#444444] theme-para font-Poppins-Regular font-size-18px"
                  >
                    <li className="flex justify-start alluser-name gap-1 capitalize">
                      {item?.description.length > 20
                        ? item.description.split(" ").slice(0, 30).join(" ") + "..."
                        : item.description}
                    </li>

                    <li style={{ justifyContent: "flex-start", paddingLeft: "1rem" }}>
                      <span className="txt-turncate capitalize-first-letter text-left">
                        {item?._id?.role}
                      </span>

                    </li>
                    <li className="" style={{ justifyContent: "flex-start", paddingLeft: "1rem" }}>
                      {item?.count}
                    </li>
                    <li style={{ justifyContent: "flex-start", paddingLeft: "1rem" }}>
                      <span className=" txt-turncate1 text-left">
                        {moment(item?.createdAt).calendar(null, {
                          sameDay: '[Today] • h:mm A',
                          lastDay: '[Yesterday] • h:mm A',
                          lastWeek: 'dddd • h:mm A',
                          sameElse: 'MMM D, YYYY • h:mm A'
                        })}                      </span>
                    </li>

                    <li className="relative font-size-30px">
                      <button
                        onClick={() => {
                          setModalOpen(true)
                          setSelectedRow(item?._id?.announcementId);
                        }}
                        className="cursor-pointer action_icon flex justify-center items-center">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>

                    </li>
                  </ul>
                ))
                :
                <p className='font-Poppins-Regular font-size-16px text-center'>No record found</p>
              }


              <PaginationComponent
                currentPage={queryParams.page}
                total={totalPages}
                setCurrentPage={(e) => setQueryParams({ ...queryParams, page: e })}
              />
            </div>
          }
        </div>

      </div>
      <Model modalOpen={modalOpen} setModalOpen={(e: any) => (setModalOpen(e))} handleDeleteConfirm={(e: any) => handleDeleteConfirm(e)} />
    </div>
  )
}

export default ListAnnoucenment