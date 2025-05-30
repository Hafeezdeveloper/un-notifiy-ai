import React, { useState, useRef, useEffect, FormEvent } from 'react';

import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { toast } from 'sonner';
import emojismile from "../../assets/img/emoji-smile.svg";
import closeIcon from "../../assets/img/closeIcon.svg";
import DefaultProfileImage from "../../assets/img/default_profile_image.png"
import { PostApi } from '../../Helper/ApiHandle/BsApiHandle';
import { RootState } from '../../Redux/store/store';
type EmojiObject = {
    native: string;
};
interface comment {
    caption: string;
    firstName: string;
    lastName: string;
    refId: string;
    [key: string]: any;
}
interface ApiResponse {
    comment: comment;

}
interface AddCommentProps {
    refId?: string;
    successFunction?: (newComment: any) => void;
    commentId?: string | boolean;
    isCancelButton?: boolean;
    cancelComment?: () => void;
    feedType?: string;
    isFocus?: boolean;
    setIsFocus?: (focus: boolean) => void;
    isPromotedId?: any;
}



const AddComment: React.FC<AddCommentProps> = ({
    refId = "",
    successFunction = () => { },
    commentId = false,
    isCancelButton = false,
    cancelComment = () => { },
    feedType = "",
    isFocus = false,
    setIsFocus = () => { },
    isPromotedId = ""
}) => {
    const personalData = useSelector((store: RootState) => store.userProfile);

    const emojiPickerRef = useRef<HTMLDivElement | null>(null); // for emoji reference
    const inputRef = useRef<HTMLInputElement | null>(null); // for input ref
    const [commentLoader, setCommentLoader] = useState<boolean>(false); // for add comment loader
    const [commentCaption, setCommentCaption] = useState<string>(""); // for comment caption
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);// for emoji picker show & hide
    const addCommentOnDiscussion = async (e: FormEvent) => {
        e.preventDefault();
        setCommentLoader(true); // show loader
        let body;
        if (commentId) {
            body = { refId: refId, feedType, commentId, caption: commentCaption, }
        } else {
            body = { refId: refId, feedType, caption: commentCaption, }
        }
        const res = await PostApi<any>("/social/comment", body)

        if (res) {
            let newComment = res.data?.comment;
            successFunction(newComment); // add on top on comment list
            setCommentCaption("");
        } else {
            toast.error("error"); // api error
        }
        setCommentLoader(false); // hide loader
    };


    // UI CODE

    const handleClickOutside = (event: MouseEvent) => {
        if (
            emojiPickerRef.current &&
            !emojiPickerRef.current.contains(event.target as Node)
        ) {
            setShowEmojiPicker(false);
        }
    };

    const handleFocusFalse = (event: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
            setIsFocus(false);
        }
    };

    useEffect(() => {
        if (isFocus) {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [isFocus])

    useEffect(() => {
        document.addEventListener('mousedown', handleFocusFalse);
        return () => {
            document.removeEventListener('mousedown', handleFocusFalse);
        };
    }, []);

    useEffect(() => {
        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);
    return (
        <>
            <form onSubmit={addCommentOnDiscussion}>
                <div className="discusion-comments flex gap-3 justify-between items-center mt-3 mb-3 relative">
                    <div className="crete-feed-user-img">
                        <img
                            src={`${personalData.data?.profileImageUrl}`}
                            alt=""
                            className="rounded-full"
                            onError={(e) => (e.currentTarget.src = DefaultProfileImage)}
                        />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={commentId ? "Reply..." : "Add a comment..."}
                        className="w-full font-size-16px theme-color-green font-Poppins-Regula"
                        value={commentCaption}
                        onChange={(e) => setCommentCaption(e.target.value)}
                        required
                    />
                    <img
                        src={emojismile}
                        alt="emojismile"
                        style={{ width: "1.5vw" }}
                        onClick={() => setShowEmojiPicker(true)}
                    />
                    {isCancelButton &&
                        <button onClick={cancelComment} type="button" className=" font-Poppins-Medium  font-size-14px px-5 py-1 inline-table rounded-3xl deleteModal-btn loader-btn feeds-btn" style={{ border: "1px solid" }}>Cancel</button>
                    }
                    <button
                        type="submit"
                        disabled={commentLoader}
                        style={{ color: "linear-gradient(180deg, #0072b5, #005a92)" }}
                        className={` theme-bg-green  font-Poppins-Medium  font-size-14px px-5 py-1 inline-table rounded-3xl deleteModal-btn loader-btn feeds-btn`}
                    > {commentId ? "Reply" : "Comment"} {commentLoader && <CircularProgress style={{ width: 14, height: 14, color: "#fff" }} />}</button>
                    {/* {showEmojiPicker && (
                        <div className="absolute top-0 z-20	 right-0 emoji-section">
                            <div ref={emojiPickerRef}>
                                <Picker
                                    data={data}
                                    previewPosition="none"
                                    onEmojiSelect={(e: EmojiObject) => {
                                        setCommentCaption((prev) => prev + e.native);
                                        setShowEmojiPicker(false);
                                    }}
                                    style={{ zIndex: 99999 }}
                                />
                            </div>
                            <img
                                role="button"
                                src={closeIcon}
                                alt=""
                                onClick={() => setShowEmojiPicker(false)}
                                className="absolute top-0 right-0"
                                width={"20px"}
                                style={{ zIndex: 99999 }}
                            />
                        </div>
                    )} */}


                </div>

            </form>
        </>
    );
};

export default AddComment;