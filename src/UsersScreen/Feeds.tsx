import React from 'react'
import HeaderGlobal from '../MainScreens/header/HeaderGolobal'
import LeftSidebar from '../MainScreens/leftSidebar/LeftSidebar'
import FeedHeader from '../MainScreens/feedHeader/FeedHeader'
import "../assets/css/responsive.css";
import RightSidebarFeed from '../MainScreens/RightSiderbar/RightSidebar';

const Feeds = () => {
  return (
    <div>
      <HeaderGlobal />
      <div className="container-1480 flex justify-between h-3vw sm-container ">
        <LeftSidebar />
        <div className="news-feed-post">
          <FeedHeader />
        </div>
        <RightSidebarFeed />
      </div>
    </div>
  )
}

export default Feeds
