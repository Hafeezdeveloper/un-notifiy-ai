import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";
import reactStringReplace from "react-string-replace";
import { postTimeDifference, truncateString } from "../Helper/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faEllipsis, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import PostCommentSection from "./PostCommentSection";
interface PostContainerProps {
  item: any; // Replace 'any' with a specific type if you have a type definition for item
  index?: number;
  activityPage?: boolean;
  category?: string;
  isPromotedId?: any;
}
interface CaptionComponentProps {
  text: string;
}

const PostContainer: React.FC<PostContainerProps> = ({
  item = {},
  index = 0,
  activityPage = false,
  category = "posts",
  isPromotedId = ""
}) => {
  const [promoteModal, setPromoteModal] = useState<boolean>(false);
  const personalData = useSelector((store: RootState) => store.userProfile);
  const CaptionComponent = ({ text = "" }) => {
    // post caption component
    const [isFullText, setIsFullText] = useState(false);

    const urlRegex = /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    const parseTextWithHashtags = (text: string) => {
      // First, handle links by replacing URLs with anchor tags
      let parsedText = reactStringReplace(text, urlRegex, (match, i) => (
        <a
          key={`url-${i}`}
          href={match}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {match}
        </a>
      ));

      // Then, handle hashtags in the text
      parsedText = reactStringReplace(parsedText, /#(\w+)/g, (match, i) => (
        <span
          key={`hashtag-${i}`}
          style={{
            color: "#4545e9",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onMouseOver={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
          onMouseOut={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
        >
          #{match}
        </span>
      ));

      return parsedText;
    };
    return (
      <div
        className="px-3 pt-3 grid items-end see-less-funct"
        style={{ gridTemplateColumns: "36vw 6vw" }}
      >
        {isFullText ? (
          <p className="font-size-16px text-black font-Poppins-Regular">
            {parseTextWithHashtags(text || "")}
            {text?.length > 240 && (
              <div className="inline-block pl-1">
                <button
                  onClick={() => setIsFullText(!isFullText)}
                  className="font-size-16px theme-grey-type  font-Poppins-Regular"
                >
                  {isFullText ? "See less" : "See more"}
                </button>
              </div>
            )}
          </p>
        ) : (
          <p className="font-size-16px text-black font-Poppins-Regular">
            {parseTextWithHashtags(truncateString(text, 240))}
            {text?.length > 240 && (
              <div className="inline-block pl-1">
                <button
                  onClick={() => setIsFullText(!isFullText)}
                  className="font-size-16px theme-grey-type  font-Poppins-Regular"
                >
                  {isFullText ? "See less" : "See more"}
                </button>
              </div>
            )}

          </p>

        )}
        {/* {text?.length > 240 && (
          <div className="inline-block">
            <button
              onClick={() => setIsFullText(!isFullText)}
              className="font-size-16px theme-grey-type  font-Poppins-Regular"
            >
              {isFullText ? "See less" : "See more"}
            </button>
          </div>
        )} */}
      </div>
    );
  };

  const postMenus = useRef<HTMLDivElement | null>(null); // Reference for post menu
  const [feedControlMenu, setFeedControlMenu] = useState<string>(""); // State for controlling post menu
  const [selectedPost, setSelectedPost] = useState<any>({});
  const handleClickOutside = (event: MouseEvent) => {
    if (
      postMenus.current &&
      !postMenus?.current?.contains(event.target as Node)
    ) {
      setFeedControlMenu("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [reportModal, setReportModal] = useState<string | false>(false);
  const [deletePost, setDeletePost] = useState<string | false>(false);


  const handleReportOpen = (id: string) => {
    setReportModal(id);
  };
  const handleDeletePost = (id: string) => {
    setDeletePost(id);
  };


  useEffect(() => {
    const globalHeader = document.querySelector(".globalheader");

    if (selectedPost?._id === item?._id) {
      document.body.classList.add("modal-open");
      if (globalHeader) {
        globalHeader.classList.add("modal-open");
      }
    } else {
      document.body.classList.remove("modal-open");
      if (globalHeader) {
        globalHeader.classList.remove("modal-open");
      }
    }

    // Cleanup function to remove the class if the component unmounts
    return () => {
      document.body.classList.remove("modal-open");
      if (globalHeader) {
        globalHeader.classList.remove("modal-open");
      }
    };
  }, [selectedPost, item]);

  return (
    <>
      {/* {selectedPost?._id === item?._id && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <PostModal item={selectedPost} onClose={() => setSelectedPost({})} />
        </div>
      )} */}
      <div
        key={index}
        // className=" shadow-lg bg-white rounded-xl mb-2 py-3 relative"
        className=" allside_shadow bg-white rounded-xl mb-2 py-3 relative"
      >


        <div className=" items-center px-2 ">
          <div className="flex gap-2 items-center new-profile-box">
            <div className="crete-feed-user-img flex relative">
              <img
                width={100}
                loading="lazy"
                src={`${item?.profileImageUrl}`}
                alt="user"
                className="rounded-full"
              />

            </div>{" "}
            <div className="sidebar-gobal-user-name w-full">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 username-box">
                  <Link
                    to={`/public-profile/${item?.userId}/view`}
                    className="font-size-16px font-Poppins-SemiBold theme-color-green capitalize on-hover-underline"
                  >
                    {" "}
                    {`${item?.fullName || ""} `}
                  </Link>{" "}
                  {/* <div className=" feed-hover-box bg-white rounded-none lg:rounded-lg  py-3 px-3 flex gap-2 items-center ">
                    <div className="crete-feed-user-img flex ">
                      <img
                        width={100}
                        loading="lazy"
                        src={`${item?.profileImageUrl}`}
                        alt="user"
                        className="rounded-full"
                      />

                    </div>
                    <div className="sidebar-gobal-user-name w-full">

                      <div className="flex flex-row gap-2">
                        <Link
                          to={`/public-profile/${item?.userId}/view`}
                          className="font-size-16px font-Poppins-SemiBold theme-color-green capitalize on-hover-underline"
                        >
                          {" "}
                          {`${item?.firstName || ""} ${item?.lastName || ""}`}
                        </Link>{" "}

                      </div>


                      <div className="mt-4">
                        <Link
                          to={`/public-profile/${item?.userId}/view`}
                          className={` font-size-14px theme-color-green font-Poppins-Medium feeds-btn  flex items-center gap-1 hover:text-white hover:bg-[#00443F] btn-w`}
                        >
                          View profile
                        </Link>
                      </div>
                    </div>

                  </div> */}


                </div>
              </div>
              {/* Modified connection/privacy display */}
              <div className="flex items-center gap-1">
                <p className="font-size-13px theme-grey-type font-Poppins-Regular">
                  {item?.isSponsered ? "Sponsored" : postTimeDifference(item?.createdAt)}
                </p>
                <span className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">•</span>
                  {item?.privacy === "myConnections" ? (
                    <>
                      <FontAwesomeIcon
                        icon={faUserGroup}
                        className="text-gray-500 text-xs"
                      />
                      <span className="font-size-13px theme-grey-type font-Poppins-Regular">
                        {item?.connections || 0} {(item?.connections || 0) > 1 ? "Connections" : "Connection"}
                      </span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faEarthAmericas}
                        className="text-gray-500 text-xs"
                      />
                      <span className="font-size-13px theme-grey-type font-Poppins-Regular">
                        Public
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <FontAwesomeIcon
              icon={faEllipsis}
            // onClick={() => setFeedControlMenu(item?._id)}
            />
          </div>

          {/* Removed old connection display */}
          {/* <p className="font-size-13px  theme-color-green font-Poppins-Regular  capitalize">
            {item?.connections || 0}  {(item?.connections || 0) > 1 ? "Connections " : "Connection"}
          </p>{" "}
          <p className="font-size-13px theme-grey-type  font-Poppins-Regular  flex flex-row gap-1 items-center">
            {item?.isSponsered ?
              "Sponsored"
              :
              postTimeDifference(item?.createdAt)
            }

            <FontAwesomeIcon icon={faEarthAmericas} />
          </p> */}


          <div>
            {/* {feedControlMenu === item?._id && (
              <div
                className="	 bg-white rounded-xl absolute right-3 top-10 w-80"
                style={{
                  boxShadow: "0 0 6px 2px #0000002b",
                }}
                ref={postMenus}
              >
                <ul className={`py-3  bg-select-custom  ${getNavigationClass(personalData?.approvalStage)}`}>
                  <li className="font-size-15px theme-grey-type  font-Poppins-SemiBold  mb-1 report-post-feed on-hover-underline px-3 py-1 hover-dash-btn">
                    <button
                      onClick={() => handleCopyLinkPost(item?._id)}
                      className="flex gap-1 items-center"
                    >
                      <FontAwesomeIcon icon={faLink} />
                      <span>Copy link to post</span>{" "}
                    </button>
                  </li>
                  {item?.userId !== userId && (
                    <li className="font-size-15px theme-grey-type  font-Poppins-SemiBold report-post-feed on-hover-underline px-3 py-1  hover-dash-btn">
                      <button
                        onClick={() => handleReportOpen(item?._id)}
                        className="flex gap-1 items-center"
                      >
                        <FontAwesomeIcon icon={faFlagCheckered} />

                        <span>Report post</span>{" "}
                      </button>
                    </li>
                  )}
                  {item?.userId === userId && (
                    <li className="mt-1 font-size-15px theme-grey-type  font-Poppins-SemiBold report-post-feed on-hover-underline px-3 py-1  hover-dash-btn">
                      <button
                        onClick={() => handleDeletePost(item?._id)}
                        className="flex gap-1 items-center"
                      >
                        <img src={ReportICon} alt="report-icon" />
                        <span>Delete post</span>{" "}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )} */}
          </div>
        </div >

        <CaptionComponent text={item?.caption} />
        {
          item?.attachments && (
            <div className=" pt-3 image-control-height">
              <img
                src={`${item?.attachments[0]?.url}`}
                className="w-full cursor-pointer"

                alt=""
              />
            </div>
          )
        }


        {/* {(item?.userId === userId && personalData?.profileVerified) && (
          <div>
            <div className="flex flex-end justify-end px-2 mt-2">


              {item?.promotionId ? (
                <div className="flex flex-row justify-between w-full">
                  <Link
                    to="/ads-manager"
                    className="theme-bg-green font-Poppins-Medium font-size-14px px-5 py-1 rounded-3xl feeds-btn text-[#ffffff] flex flex-row gap-2 items-center"
                  >
                    View insight
                  </Link>
                  <button className="bg-[#007e7661] no-border font-Poppins-Medium font-size-14px px-5 py-1 rounded-3xl feeds-btn text-[#007E76] flex flex-row gap-2 items-center">
                    Promoted
                  </button>
                </div>
              ) : item?.promotionStatus === "in-review" ? (
                <button className="bg-[#fff4b3] no-border text-[#a48e05] font-Poppins-Medium font-size-14px px-5 py-1 rounded-3xl feeds-btn flex flex-row gap-2 items-center">
                  Promotion in review
                </button>
              ) : item?.promotionStatus === "paused" ? (
                <button className="bg-[#fff4b3] text-[#a48e05] font-Poppins-Medium font-size-14px px-5 py-1 rounded-3xl feeds-btn flex flex-row gap-2 items-center">
                  Promotion paused
                </button>
              ) : (
                <button
                  onClick={() => setPromoteModal(true)}
                  className="theme-bg-green font-Poppins-Medium font-size-14px px-5 py-1 rounded-3xl feeds-btn text-[#ffffff] flex flex-row gap-2 items-center"
                >
                  <img src={PromoteIcon} alt="promote" />
                  Promote this post
                </button>
              )}
            </div>

          </div>
        )} */}

        <div className="relative  px-2">
          <PostCommentSection
            commentData={item}
            key={item?._id}
            activityPage={activityPage}
            category={category}
            isPromotedId={isPromotedId}
          />
        </div>
        {/* {reportModal && (
          <ReportOptions
            id={reportModal} // Convert to boolean
            onClose={() => setReportModal(false)}
            type="post"
            category="post"
          />
        )}
        {deletePost && (
          <PostDelete
            id={deletePost} // Convert to boolean
            onClose={() => setDeletePost(false)}
            type="post"
            category="post"
          />
        )} */}

      </div >

    </>
  );
};

export default PostContainer;
