import React, { useEffect, useState } from 'react'
import HeaderGlobal from '../MainScreens/header/HeaderGolobal'
import LeftSidebar from '../MainScreens/leftSidebar/LeftSidebar'
import FeedHeader from '../MainScreens/feedHeader/FeedHeader'
import "../assets/css/responsive.css";
import RightSidebarFeed from '../MainScreens/RightSiderbar/RightSidebar';
import { RootState } from '../Redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { GetApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast } from 'sonner';
import qs from "qs";
import { setAllPosts } from '../Redux/slices/newzfeedSlice';
import FeedPostView from '../MainScreens/feedHeader/FeedPostView';

const Feeds = () => {
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    sort: "top", 
  });
  // Functionality: API call to get the news feed posts
  const fetchNewsFeed = async () => {
    setIsLoader(true); // Set the loading state to true
    // path: `/api/posts/all?${qs.stringify(queryParams)}`,
    const response = await GetApi<any>(`/posts/all?${qs.stringify(queryParams)}`);
    if (response.data.success) {
      // dispatch(setAllPosts(res?.documents || []));
      // let combinedPosts = [...(res?.promotions || []), ...(res?.documents || [])];
      let combinedPosts = response.data?.documents || []

      dispatch(setAllPosts(combinedPosts));


      // Dispatch the sorted posts
      // Update the total pages for pagination or infinite scrolling
      setTotalPages(response?.data.paginated?.totalPages || 1);
    } else {
      toast.error("error");
    }
    setIsLoader(false); // Set the loading state to false
  };

  // Fetch the news feed when the query parameters change
  useEffect(() => {
    fetchNewsFeed();
  }, [queryParams]);

  // Reset the Redux store when the component mounts

    

  return (
    <div>
      <HeaderGlobal />
      <div className="container-1480 flex justify-between h-3vw sm-container ">
        <LeftSidebar />
        <div className="news-feed-post">
          <FeedHeader />
          <FeedPostView
            loader={isLoader}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            totalPages={totalPages}
          />
        </div>
        <RightSidebarFeed />
      </div>
    </div>
  )
}

export default Feeds
