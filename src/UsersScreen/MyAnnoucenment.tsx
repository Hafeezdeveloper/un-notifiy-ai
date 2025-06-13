import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import HeaderGlobal from "../MainScreens/header/HeaderGolobal";
import LeftSidebar from "../MainScreens/leftSidebar/LeftSidebar";
import { GetApi } from "../Helper/ApiHandle/BsApiHandle";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";

interface AnnouncementItem {
  description: string;
  role: string;
  status: string;
  createdAt: string;
  finalDetails: {
    fullName?: string;
    role?: string;
    email?: string;
  };
}

const MyAnnouncement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAnnouncements = async (page = 1) => {
    try {
      const res = await GetApi<any>(`announcements/all?page=${page}&limit=10`);
      if (res?.data?.documents) {
        if (page === 1) {
          setAnnouncements(res.data.documents);
        } else {
          setAnnouncements((prev) => [...prev, ...res.data.documents]);
        }

        const totalItems = res.data.paginated?.totalItems || 0;
        const pageSize = res.data.paginated?.limit || 10;
        const totalPages = Math.ceil(totalItems / pageSize);
        setHasMore(page < totalPages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      toast.error("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchMoreData = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchAnnouncements(nextPage);
  };

  return (
    <div className="font-poppins-regular">
      <HeaderGlobal />
      <div className="container-1480 h-auto lg:flex md:flex block gap-3 py-4">
        <LeftSidebar />
        <div className="w-full">
          <div className="bg-white shadow-md rounded-lg px-6 py-4 mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-green-700">My Announcements</h2>
            <button onClick={() => navigate(-1)}>
              <img
                src="https://edgie.backslashwebs.com/imgs%2FBeck-icon.png"
                alt="back"
                className="w-6 h-6 cursor-pointer"
              />
            </button>
          </div>

          {loading && currentPage === 1 ? (
            <div className="flex justify-center py-10">
              <CircularProgress />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">No announcements available.</div>
          ) : (
            <InfiniteScroll
              dataLength={announcements.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<div className="flex justify-center py-6"><CircularProgress /></div>}
              endMessage={
                <p className="text-center text-gray-500 py-6">You’ve seen all announcements.</p>
              }
            >
              <div className="space-y-4">
                {announcements.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg p-4 rounded-md border border-gray-200 hover:border-green-500 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-green-600 capitalize">
                        {item?.finalDetails?.fullName || "Unknown"}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {moment(item.createdAt).format("DD MMM, YYYY - hh:mm A")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{item.description}</p>
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      <span className="capitalize bg-green-50 text-green-700 px-2 py-1 rounded">
                        {item.role}
                      </span>
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAnnouncement;
