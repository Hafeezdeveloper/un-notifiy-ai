import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress } from "@mui/material";
import AddComment from "./AddComment";
import { useDispatch } from "react-redux";
import qs from "qs";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import { updateCommentCounter } from "../../Redux/slices/newzfeedSlice";
import { toast } from "sonner";
import { GetApi, PostApi } from "../../Helper/ApiHandle/BsApiHandle";
import { createMessageWithLinks, postTimeDifference } from "../../Helper/constants";

interface DisplayCommentsProps {
  refId?: string;
  feedType?: string;
  allComments?: CommentItem[];
  setAllComments?: React.Dispatch<React.SetStateAction<CommentItem[]>>;
  activityPage?: boolean;
  updateActivityCounter?: (event: any) => void;
  totalComments?: number;
  detailPage?: boolean;
  isShow?: boolean;
  isPromotedId?: any;
}

interface LikeApiResponse {
  likeStatus: boolean;
  [key: string]: any;
}

interface CommentItem {
  _id: string;
  profileImageUrl: string;
  userId: string;
  firstName: string;
  lastName: string;
  roleCategory: string;
  caption: string;
  createdAt: string;
  reactionStatus: boolean;
  reactions: number;
  reply: number;
  [key: string]: any;
}

interface Paginated {
  totalItems: number;
  totalPages: number;
  [key: string]: any;
}

interface ApiResponse {
  documents: CommentItem[];
  paginated: Paginated;
}

const DisplayComments: React.FC<DisplayCommentsProps> = ({
  refId = "",
  feedType = "",
  allComments = [],
  setAllComments = () => {},
  activityPage = false,
  updateActivityCounter = () => {},
  totalComments = 1,
  detailPage = false,
  isShow = false,
  isPromotedId = ""
}) => {
  const personalData = useSelector((store: RootState) => store.userProfile);
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState<boolean>(detailPage);
  const [loader, setLoader] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [queryParams, setQueryParams] = useState<{
    page: number;
    limit: number;
  }>({
    page: detailPage ? 1 : 0,
    limit: 10,
  });
  const [commentId, setCommentId] = useState<string | false>(false);
  const [innerComment, setInnerComment] = useState<CommentItem[]>([]);
  const [innerCommentLoader, setInnerCommentLoader] = useState<boolean>(false);
  const [deletePost, setDeletePost] = useState<string | false>(false);

  const handleRemoveComment = (id: string) => {
    setAllComments((prevComments) => prevComments.filter(comment => comment._id !== id));
    setInnerComment((prevInnerComments) => prevInnerComments.filter(comment => comment._id !== id));
  };

  const handleDeletePost = (id: string) => {
    setDeletePost(id);
  };

  const handleAddNewComment = (event: any) => {
    setInnerComment((prev) => [...prev, event]);
    let newList = allComments.map((newObj) => {
      if (newObj?._id === event?.commentId) {
        return {
          ...newObj,
          reply: newObj?.reply + 1,
        };
      }
      return newObj;
    });
    setAllComments(newList);
    if (!activityPage && feedType === "post") {
      dispatch(updateCommentCounter(event?.refId));
    }
  };

  const handleReplySection = async (id: string, count: number) => {
    setInnerComment([]);
    setCommentId(id);
    if (count) {
      setInnerCommentLoader(true);
      const res = await GetApi<any>(`/api/social/comments/${refId}?commentId=${id}&page=1&limit=${count}`);
      if (res) {
        setInnerComment(res.data?.documents);
      } else {
        toast.error("error");
      }
      setInnerCommentLoader(false);
    }
  };

  const handleToogleReaction = async (id: string, childReaction: boolean = false) => {
    let cList = childReaction ? innerComment : allComments;
    let newList = cList.map((newObj) => {
      if (newObj?._id == id) {
        return {
          ...newObj,
          reactionStatus: !newObj.reactionStatus,
          reactions: newObj.reactionStatus
            ? newObj?.reactions - 1
            : newObj?.reactions + 1,
        };
      }
      return newObj;
    });
    childReaction ? setInnerComment(newList) : setAllComments(newList);

    const res = await PostApi<any>("/social/like", {
      commentId: id, refId: refId, feedType, reactionType: "like",
    });

    if (!res) {
      setAllComments(allComments);
      toast.error("error");
    }
  };

  const fetchComment = async () => {
    setLoader(true);
    const res = await GetApi<any>(`/social/comments/${refId}?${qs.stringify(queryParams)}`);
    if (res) {
      let data = res.data?.documents || [];
      setAllComments((prev) => {
        const newUniqueComments = data.filter(
          (newItem: any) =>
            !prev.some((existingItem) => existingItem._id === newItem._id)
        );
        return [...prev, ...newUniqueComments];
      });
      setTotalPages(res?.data.paginated?.totalPages);
    } else {
      toast.error("error");
    }
    setLoader(false);
  };

  const handleLoadMore = () => {
    setShowComments(true);
    setQueryParams((prev) => ({ ...prev, page: prev?.page + 1 }));
  };

  const CommentCaption = ({ text = "" }: { text: string }) => {
    const [loaderMore, setLoaderMore] = useState(false);
    return (
      <>
        <p key={Math.random()} className="font-size-16px font-Poppins-Regular">
          {loaderMore ? createMessageWithLinks(text) : createMessageWithLinks(text).slice(0, 300)}
        </p>
        {text.length > 300 && (
          <button
            className="on-hover-underline font-size-15px theme-grey-type font-Poppins-Regular"
            onClick={() => setLoaderMore((prev) => !prev)}
          >
            {loaderMore ? "...less" : "... more"}
          </button>
        )}
      </>
    );
  };

  useEffect(() => {
    if (isShow) {
      setShowComments(isShow);
      setQueryParams((prev) => ({ ...prev, page: 1 }));
    }
  }, [isShow]);

  useEffect(() => {
    if (!showComments) {
      if (totalComments > allComments[0]?.reply && totalComments > 1) {
        setTotalPages(2);
      } else {
        setTotalPages(0);
      }
    }
  }, [allComments]);

  useEffect(() => {
    if (showComments && refId) {
      fetchComment();
    }
  }, [refId, queryParams, showComments]);

  return (
    <div className="">
      {allComments && allComments.length > 0
        ? allComments.map((item, index) => (
          <div key={index}>
            <div className="w-full mb-5 flex gap-2  contain-comment-box">
              <div className="crete-feed-user-img flex items-start">
                <img
                  width={100}
                  loading="lazy"
                  src={`${item?.profileImageUrl}`}
                  alt="user"
                  className="rounded-full"
                />
              </div>
              <div
                className="shadow-lg rounded-xl w-full feed-cmnt"
                style={{ backgroundColor: "#70707017" }}
              >
                <div className="flex gap-3 items-start relative">
                  <div className="grid">
                    <div className="">
                      <Link
                        to={ `/public-profile/${item?.userId}/view`}
                        className="font-size-16px font-Poppins-SemiBold capitalize"
                      >
                        {`${item?.firstName || ""} ${item?.lastName || ""}`}
                        {/* <span className="theme-color-green"> Connect</span> */}
                      </Link>
                      {/* comment owner name */}
                      <p className="font-size-13px theme-grey-type  font-Poppins-Regular capitalize-first-letter">
                        {item?.roleCategory || ""}
                      </p>
                      {/* comment owner role */}
                    </div>
                    <div className="absolute right-0 flex items-center gap-2">
                      <p className="font-size-16px theme-grey-type  font-Poppins-Regular  text-end">
                        {postTimeDifference(item?.createdAt)}
                      </p>
{/*                      
                          <CommentOnReport
                            id={item?._id}
                            category={feedType}
                            type="comment"
                            userIdComment={item?.userId}
                            postId={item?.refId}
                            onRemoveComment={handleRemoveComment}
                          /> */}

                    </div>
                    <div className="mt-1">
                      <CommentCaption text={item?.caption} />
                    </div>
                    <div className={`  pt-1 flex gap-2 comment-like-div flex items-center`}>
                      <div className="font-size-13px font-Poppins-SemiBold capitalize flex gap-1 items-center ">
                        <button
                          onClick={() => handleToogleReaction(item?._id)}
                          style={{
                            color: item?.reactionStatus ? "#2196F3" : "#000",
                          }}
                        >
                          Like
                        </button>
                        <div className="total-like flex gap-1 items-center">
                          <span
                            style={{
                              backgroundColor: item?.reactionStatus
                                ? "#2196F3"
                                : "#000",
                            }}
                          >
                            <FontAwesomeIcon
                              color="white"
                              icon={faThumbsUp}
                              flip="horizontal"
                            />
                          </span>
                          {item?.reactions || 0}
                        </div>
                      </div>
                      <span className="font-size-13px font-Poppins-SemiBold capitalize ">
                        | {item?.reply || " "}{" "}
                        <button
                          onClick={() =>
                            handleReplySection(item?._id, item?.reply)
                          }
                          disabled={commentId === item?._id}
                        >
                          Reply
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {commentId === item?._id && (
              <>
                <div style={{ paddingLeft: "4vw" }}>
                  {innerCommentLoader && (
                    <div className="text-center">
                      <CircularProgress
                        style={{ width: 20, height: 20, color: "#004c47" }}
                      />
                    </div>
                  )}
                  {innerComment.map((v, i) => (
                    <div key={i} className="w-full mb-3 flex gap-2 mt-12">
                      <div className="crete-feed-user-img flex items-start">
                        <img
                          width={100}
                          loading="lazy"
                          src={`${v?.profileImageUrl}`}
                          alt="user"
                          className="rounded-full"
                        />
                        {/* comment owner image */}
                      </div>
                      <div
                        className="shadow-lg rounded-xl p-3 w-full"
                        style={{ backgroundColor: "rgb(112 112 112 / 25%)" }}
                      >
                        <div className="flex gap-3 items-start relative">
                          <div className="grid">
                            <div className="">
                              <Link
                                to={`/public-profile/${v?.userId}/view`}
                                className="font-size-13px font-Poppins-SemiBold capitalize"
                              >
                                {`${v?.firstName || ""} ${v?.lastName || ""}`}
                              </Link>
                              <p className="font-size-13px theme-grey-type  font-Poppins-Regular capitalize-first-letter">
                                {v?.roleCategory || v?.role || ""}
                              </p>
                            </div>
                            <div className="absolute right-0 flex items-center gap-2">
                              <p className="font-size-16px theme-grey-type  font-Poppins-Regular  text-end">
                                {postTimeDifference(v?.createdAt)}
                              </p>
{/*                            
                                  <CommentOnReport
                                    id={v?._id}
                                    category={feedType}
                                    type="thread"
                                    userIdComment={v?.userId}
                                    postId={v?.refId}
                                    onRemoveComment={handleRemoveComment}

                                  /> */}
                            </div>
                            <div className="mt-3">
                              <p className="font-size-13px  font-Poppins-Regular">
                                {createMessageWithLinks(v?.caption || "")}
                              </p>
                            </div>
                            <div className=" pt-1 flex gap-2">
                              <div className="font-size-13px font-Poppins-SemiBold capitalize flex gap-1 items-center">
                                <button
                                  onClick={() =>
                                    handleToogleReaction(v?._id, true)
                                  }
                                  style={{
                                    color: v?.reactionStatus
                                      ? "#2196F3"
                                      : "#000",
                                  }}
                                >
                                  Like
                                </button>{" "}
                                .
                                <div className="total-like flex gap-1 items-center">
                                  <span
                                    style={{
                                      backgroundColor: v?.reactionStatus
                                        ? "#2196F3"
                                        : "#000",
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      color="white"
                                      icon={faThumbsUp}
                                      flip="horizontal"
                                    />
                                  </span>
                                  {v?.reactions || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                      <>
                        <AddComment
                          refId={refId}
                          successFunction={handleAddNewComment}
                          commentId={commentId || ""}
                          isCancelButton={true}
                          cancelComment={() => {
                            setCommentId(false);
                            setInnerComment([]);
                          }}
                          feedType={feedType}
                          isPromotedId={isPromotedId}
                        />
                      </>
                   
                </div>
              </>
            )}
          </div>
        ))
        : ""}
      {loader && (
        <div className="text-center">
          <CircularProgress
            style={{ width: 20, height: 20, color: "#004c47" }}
          />
        </div>
      )}
      {totalPages > queryParams?.page && (
        <div onClick={handleLoadMore} className={`flex justify-start `}>
          <button className="font-size-13px  on-hover font-Poppins-Medium theme-grey-type">
            Load more comments
          </button>
        </div>
      )}
    </div>
  );
};

export default DisplayComments;
