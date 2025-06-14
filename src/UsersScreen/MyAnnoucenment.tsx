import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import HeaderGlobal from "../MainScreens/header/HeaderGolobal";
import LeftSidebar from "../MainScreens/leftSidebar/LeftSidebar";
import { GetApi } from "../Helper/ApiHandle/BsApiHandle";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";

interface AnnouncementItem {
  _id: string;
  description: string;
  role: string;
  status: string;
  createdAt: string;
  finalDetails: {
    fullName?: string;
    role?: string;
    email?: string;
    profileImageUrl?: string;
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
        setAnnouncements(prev => 
          page === 1 ? res.data.documents : [...prev, ...res.data.documents]
        );
        setHasMore(res.data.documents.length > 0);
      }
    } catch (error) {
      toast.error("Failed to load announcements");
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="font-poppins bg-gray-50 min-h-screen">
      <HeaderGlobal />
      <div className="container-1480 h-auto lg:flex md:flex block gap-6 py-6 px-4">
        <LeftSidebar />
        
        <div className="w-full lg:w-3/4">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-sm rounded-xl p-6 mb-6 flex justify-between items-center border border-gray-100"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
              <p className="text-gray-500 mt-1">
                Stay updated with the latest news and updates
              </p>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </motion.div>

          {/* Loading State */}
          {loading && currentPage === 1 && (
            <div className="flex justify-center py-20">
              <CircularProgress size={50} className="text-green-500" />
            </div>
          )}

          {/* Empty State */}
          {!loading && announcements.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100"
            >
              <img 
                src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
                alt="No announcements" 
                className="w-24 h-24 mx-auto mb-4 opacity-70"
              />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No announcements yet</h3>
              <p className="text-gray-500">Check back later for updates</p>
            </motion.div>
          )}

          {/* Announcements List */}
          {!loading && announcements.length > 0 && (
            <InfiniteScroll
              dataLength={announcements.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center py-6">
                  <CircularProgress size={30} className="text-green-500" />
                </div>
              }
              endMessage={
                <p className="text-center text-gray-400 py-6">
                  You've reached the end of announcements
                </p>
              }
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {announcements.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:border-green-200 transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {item.finalDetails?.profileImageUrl ? (
                          <img
                            src={item.finalDetails.profileImageUrl}
                            alt={item.finalDetails.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-xl text-green-600">
                              {item.finalDetails?.fullName?.charAt(0) || "A"}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {item.finalDetails?.fullName == "Super Admin" ? "Admin" :  "System Admin"}
                              </h3>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          
                          <p className="mt-3 text-gray-700 leading-relaxed">
                            {item.description}
                          </p>
                          
                          <div className="mt-4 flex gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {"annoucenmnet"}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAnnouncement;