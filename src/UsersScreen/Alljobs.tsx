import React, { useEffect, useState } from 'react';
import HeaderGlobal from '../MainScreens/header/HeaderGolobal';
import LeftSidebar from '../MainScreens/leftSidebar/LeftSidebar';
import { GetApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast } from 'sonner';
import qs from "qs";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import moment from "moment";

const Alljobs = () => {
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [allJobs, setJobs] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: ""
  });

  const fetchJobs = async () => {
    setIsLoader(true);
    try {
      const response = await GetApi<any>(`/job-posts/all?${qs.stringify(queryParams)}`);
      if (response.data.success) {
        if (queryParams.page === 1) {
          setJobs(response.data?.documents || []);
        } else {
          setJobs(prev => [...prev, ...(response.data?.documents || [])]);
        }
        setTotalPages(response?.data.paginated?.totalPages || 1);
        setHasMore(queryParams.page < (response?.data.paginated?.totalPages || 1));
      } else {
        toast.error("Error fetching jobs");
      }
    } catch (error) {
      toast.error("Error fetching jobs");
    } finally {
      setIsLoader(false);
    }
  };

  const fetchMoreJobs = () => {
    if (queryParams.page < totalPages) {
      setQueryParams(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [queryParams.page]); // Only trigger when page changes

  const formatDate = (dateString: string) => {
    return moment(dateString).isSame(moment(), 'day')
      ? moment(dateString).format("hh:mm A")
      : moment(dateString).format("DD-MM-YYYY hh:mm A");
  };

  return (
    <div>
      <HeaderGlobal />
      <div className="container flex h-3vw sm-container">
        <LeftSidebar />
        <div className="ml-5 bg-white rounded-lg shadow-sm w-[950px] overflow-hidden">
          <div className="job-header p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top job picks for you</h2>
            <p className="text-xs text-gray-500 mt-1">
              Based on your profile, preferences, and activity like applies, searches, and saves
            </p>
          </div>

          <div id="scrollableDiv" style={{ height: 'calc(100vh - 150px)', overflow: 'auto' }}>
            <InfiniteScroll
              dataLength={allJobs.length}
              next={fetchMoreJobs}
              hasMore={hasMore}
              loader={isLoader && <div className="text-center py-4"><CircularProgress /></div>}
              endMessage={
                <p className="text-center py-4 text-gray-500">
                  {allJobs.length > 0 ? "No more jobs to show" : "No jobs found"}
                </p>
              }
              scrollableTarget="scrollableDiv"
            >
              <ul className="job-list">
                {allJobs.map((job: any) => (
                  <li key={job._id || job.id} className="job-item p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div className="job-title text-base capitalize-first-letter font-semibold text-gray-900 mb-1">
                      {job.jobTitle}
                    </div>
                    <div className="job-company capitalize-first-letter text-sm text-gray-900 mb-1">
                      {job.companyName}
                    </div>
                    <div className="job-location text-xs text-gray-500 mb-2">
                      {job.location} ({job.employmentType})
                    </div>
                    {job.createdAt && (
                      <div className="job-time text-xs text-gray-500 mb-2">
                        {formatDate(job.createdAt)}
                      </div>
                    )}
                    {job.isActive && (
                      <div className="job-status capitalize-first-letter text-xs text-blue-600 font-semibold mb-2">
                        Active
                      </div>
                    )}
                    <div className="job-actions flex items-center justify-between text-xs text-gray-500">
                      <div className="job-promo flex items-center gap-2">
                        {/* Add viewed/promoted indicators if needed */}
                      </div>
                      <span className="easy-apply text-blue-600 font-semibold">Easy Apply</span>
                    </div>
                  </li>
                ))}
              </ul>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alljobs;