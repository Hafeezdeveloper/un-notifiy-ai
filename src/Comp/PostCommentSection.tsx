// PostCommentSection.tsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import like from "../assets/img/like.svg";
import like2 from "../assets/img/like2.svg";
import comment from "../assets/img/comment.svg";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store/store";
import { toogleLikedPost, updateCommentCounter } from "../Redux/slices/newzfeedSlice";
import { faMessage, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { PostApi } from "../Helper/ApiHandle/BsApiHandle";
import AddComment from "./PostCommentSection/AddComment";
import DisplayComments from "./PostCommentSection/DisplayComments";

interface PostCommentSectionProps {
  category?: string;
  isPromotedId?: string;
  commentData: {
    _id?: string;
    reactionStatus?: boolean;
    allReacts?: number;
    allComments?: number;
    comments?: any;
    [key: string]: any;
  };
  setCommentData?: React.Dispatch<React.SetStateAction<any>>;
  activityPage?: boolean;
  detailPage?: boolean;
}

interface LikeApiResponse {
  likeStatus: boolean;
  [key: string]: any;
}

const PostCommentSection: React.FC<PostCommentSectionProps> = ({
  commentData = {},
  setCommentData = () => {},
  activityPage = false,
  detailPage = false,
  category,
  isPromotedId = ""
}) => {
  const dispatch = useDispatch();
  const personalData = useSelector((store: RootState) => store.userProfile);
  const location = useLocation();

  const [reactionLoader, setReactionLoader] = useState<boolean>(false);
  const [allComments, setAllComments] = useState<any[]>([]);
  const [commentInputFocus, setCommentInputFocus] = useState<boolean>(false);
  const [likeModal, setLikeModal] = useState<boolean | { id: string; total: number }>(false);

  const handleAddNewComment = (event: any) => {
    setAllComments((prev) => [event, ...prev]);
    if (event?.refId) {
      dispatch(updateCommentCounter(event.refId));
    }
  };

  const handleReactOnPost = async () => {
    setReactionLoader(true);
    try {
      const response = await PostApi<LikeApiResponse>("/social/like", {
        refId: commentData?._id,
        reactionType: "like",
        feedType: "post",
      });

      if (response.data) {
        dispatch(toogleLikedPost({
          status: response.data.likeStatus,
          postId: commentData?._id
        }));
      }
    } catch (error) {
      toast.error("Error updating reaction");
    } finally {
      setReactionLoader(false);
    }
  };

  useEffect(() => {
    if (commentData && commentData?.allComments) {
      if (commentData?.comments && commentData.comments._id) {
        setAllComments([commentData.comments]);
      }
    }
  }, [commentData?.comments]);

  return (
    <>
      <div className="broder-t-1">
        <ul className="flex gap-2 py-2">
          <li className="total-like flex gap-1 items-center">
            <span
              role="button"
              onClick={() =>
                setLikeModal({
                  id: commentData?._id || "",
                  total: typeof commentData?.allReacts === 'number' ? commentData.allReacts : 0,
                })
              }
              style={{
                backgroundColor:
                  commentData?.allReacts && commentData?.allReacts > 0 ? "#0073b1" : "#707070",
              }}
            >
              <FontAwesomeIcon color="white" icon={faThumbsUp} flip="horizontal" />
            </span>
            <button className="font-size-15px theme-grey-type font-Poppins-Medium">
              {commentData?.allReacts || commentData?.reactions || 0}
            </button>
          </li>
          <li className="total-like flex gap-1 items-center">
            <FontAwesomeIcon icon={faMessage} color="#707070" />
            <div className="font-size-15px theme-grey-type font-Poppins-Medium" style={{ cursor: "context-menu" }}>
              {commentData?.allComments || 0} Comments
            </div>
          </li>
        </ul>
      </div>

      <>
        <hr />
        <div className={`flex justify-center gap-10`}>
          <button
            disabled={reactionLoader}
            onClick={handleReactOnPost}
            className="flex items-center gap-2 on-hover-not"
          >
            <img src={commentData?.reactionStatus ? like2 : like} alt="" />
            <span className="font-size-16px font-Poppins-Medium theme-grey-type">
              Like
            </span>
          </button>
          <button
            onClick={() => setCommentInputFocus(true)}
            className="flex items-center gap-2 cursor-pointer on-hover-not"
          >
            <img src={comment} alt="" />
            <span className="font-size-16px font-Poppins-Medium theme-grey-type">
              Comment
            </span>
          </button>
          
        </div>
        <AddComment
            refId={commentData?._id}
            successFunction={handleAddNewComment}
            feedType="post"
            isFocus={commentInputFocus}
            setIsFocus={setCommentInputFocus}
            isPromotedId={isPromotedId}

          />
           < DisplayComments
          refId={commentData?._id}
          feedType="post"
          allComments={allComments}
          setAllComments={setAllComments}
          activityPage={activityPage}
          totalComments={commentData?.allComments}
          detailPage={detailPage}
          isPromotedId={isPromotedId}

        />
      </>
    </>
  );
};

export default PostCommentSection;