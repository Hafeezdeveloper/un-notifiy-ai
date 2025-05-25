import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import closeIcon from "../../assets/img/closeIcon.svg";
import emojismile from "../../assets/img/emoji-smile.svg";
import uploadicon from "../../assets/img/uploadicon.svg";
import { useSelector, useDispatch } from "react-redux";
import DefaultProfileImage from "../../assets/img/default_profile_image.png";
import anyone from "../../assets/img/anyone.svg";
import connectonly from "../../assets/img/connectonly.svg";
import { toast } from "sonner";
import { Skeleton } from "@mui/material";
import "../../assets/css/responsive.css";
import "../../assets/css/adminresponsive.css";
type EmojiObject = {
    native: string;
    // add other properties you might use from the emoji object
};
interface ApiResponse {
    document: []
}
interface PersonalData {
    profileImageURL?: string;

    firstName?: string;
    lastName?: string;
    [key: string]: any;

}

interface StoreState {
    userProfile: {
        personalData: PersonalData;
    };
}

const FeedHeader: React.FC = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [postModal, setPostModal] = useState<boolean>(false); // post Modal
    const [settingmodal, setSettingModal] = useState<boolean>(false);

    // api state
    const [privacy, setPrivacy] = useState<string>("anyone"); // pending.....
    const [caption, setCaption] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    // api state

    const [aILoader, setAiLoader] = useState<boolean>(false); // rewrite with AI loader

    const [isLoader, setIsLoader] = useState<boolean>(false); // Loader state for API call pending
    const [selectedImage, setSelectedImage] = useState<string>(""); // for display selected image
    const [tempPrivacy, setTempPrivacy] = useState<string>("anyone"); // Temporary state for modal

    const handleBackClick = () => {
        setSettingModal(false);
        setTempPrivacy(privacy); // Reset to the previous saved privacy
    };

    const handleDoneClick = () => {
        setPrivacy(tempPrivacy); // Save the selected privacy setting
        setSettingModal(false);
    };
    const handlePrivacyChange = (newPrivacy: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempPrivacy(newPrivacy); // Update temporary state
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // select image
        // const file = event?.target?.files[0];
        const file = event.target.files ? event.target.files[0] : null;

        const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
        if (file) {
            // Check if the file type starts with 'image/'
            if (!file.type.startsWith('image/')) {
                toast.error("Only image files are allowed. Please select an image file.",);
                return; // Stop further execution if the file is not an image
            }
        }
        if (file) {
            if (file.size > maxSize) {
                // File size exceeds the maximum allowed size
                toast.error(
                    "File size exceeds the maximum allowed size (5 MB). Please choose a smaller file.",
                );
                return; // Stop further execution
            }
            const reader = new FileReader();
            reader.onloadend = (ee) => {
                if (ee.target) { // Ensure ee.target is not null
                    setSelectedImage(ee.target.result as string);
                }
            };
            reader.readAsDataURL(file);
            setFiles((prev) => [...prev, file]);
        }
    };



    // Functionality: API call create post
    const handleSubmit = async () => {
        setIsLoader(true);
        if (!caption) {
            toast("Please enter caption", );
        setIsLoader(false);
        return
    }
    const formData = new FormData();
    formData.append("caption", caption);
    files.forEach((v) => {
        formData.append("files", v);
    });
    formData.append("privacy", privacy);
    // const { res, err } = await httpRequest<ApiResponse>({ method: "post", path: `/api/posts/create`, params: formData, header: { "Content-Type": "multipart/form-data" } });
    // if (res) {
    //     console.log(res?.document, "asdasdsaasd")
    //     dispatch(createNewPost(res?.document || {}));
    //     toast("Your post has been successfully created.", { type: "success" });
    //     setCaption("");
    //     setFiles([]);
    //     setSelectedImage("");
    //     setPrivacy("anyone");
    //     setPostModal(false); // post modal close
    // } else {
    //     toast(err?.message, { type: "error" }); // api error
    // }
    setIsLoader(false);
};

const handlesetting = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).className === "ovrlayModal") {
        setSettingModal(false);
    }
};

const handleWindowSuccessClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).className === "ovrlayModal") {
        setPostModal(false);
    }
};

const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false); // for emoji picker show & hide
const emojiPickerRef = useRef<HTMLDivElement | null>(null);
const imageRef = useRef<HTMLImageElement | null>(null);

// Function to handle click outside the EmojiPicker
const handleClickOutside = (event: MouseEvent) => {
    if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        imageRef.current &&
        !imageRef.current.contains(event.target as Node)
    ) {
        setShowEmojiPicker(false);
    }
};

// Add event listener when the component mounts
useEffect(() => {
    if (showEmojiPicker) {
        document.addEventListener("mousedown", handleClickOutside);
    } else {
        document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener when the component unmounts
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [showEmojiPicker]); // Add showEmojiPicker to the dependency array

return (
    <div className="feed-header p-4">
        <div className="create-feed flex gap-2 items-center">
            <div className="crete-feed-user-img flex relative">
                {isLoading ?

                    (
                        <Skeleton variant="rounded" className="w-full mb-2 " width={50} height={50} style={{ borderRadius: 50 }} />

                    ) :

                    (
                        <>
                            <img
                                width={100}
                                className="rounded-full"
                                src={`https://ndisync-stage.s3.us-east-1.amazonaws.com/profile-67fa153b53554f4352fd20d2.png`}
                                alt=""
                            />
                        </>
                    )
                }

            </div>{" "}
            {/* image */}
            <button
                className={` font-size-16px theme-color-green font-Poppins-Regular`}
                onClick={() => { setPostModal(true) }}
            >
                Start a post or draft with AI
            </button>
        </div>

        {/* {postModal && (
                <div className="ovrlayModal modal" onClick={handleWindowSuccessClick}>
                    <div className="createpost-modal absolute z-20">
                        <button
                            className="absolute -top-5 font-size-24px"
                            style={{ right: "-10px" }}
                            disabled={isLoader}
                            onClick={() => setPostModal(false)}
                        >
                            <img src={closeIcon} alt="" />
                        </button>{" "}
                        <div
                            className="create-post-user-data flex gap-2 items-center  hover:w-fit hover:rounded-s-md hover:bg-[#7070701c] p-2 w-fit"
                            onClick={() => setSettingModal(true)}
                        >
                            <div className="crete-feed-user-img flex ">
                                <img
                                    width="100"
                                    className="rounded-full"
                                    src={`${personalData?.profileImageUrl}`}
                                    alt=""
                                />
                            </div>{" "}
                            <div>
                                <p className="font-size-20px font-Poppins-SemiBold theme-color-green flex items-baseline gap-2 capitalize">
                                    {`${personalData?.firstName || ""} ${personalData?.lastName || ""
                                        }`}{" "}
                                    <FontAwesomeIcon icon={faSortDown} />
                                </p>{" "}
                                <p className="font-size-15px  theme-color-green font-Poppins-Regular">
                                    {privacy === "myConnections"
                                        ? "My connections"
                                        : "Post to anyone"}
                                </p>{" "}
                            </div>
                        </div>
                        <div className="create-post-text-area">
                            {aILoader ? (
                                <ReWriteLoader extraStyle={{ marginTop: 12 }} />
                            ) : (
                                <div className="post-area-field">
                                    <textarea
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="w-full"
                                        placeholder="What do you want to talk about?"
                                    ></textarea>
                                </div>
                            )}
                            {selectedImage && (
                                <>
                                    <div className="media-photo-preview relative">
                                        <div className="flex justify-end gap-3 items-center mb-2 mr-2">
                                            <img
                                                src={closeIcon}
                                                alt=""
                                                width={"25px"}
                                                onClick={removeImage}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                        <img src={selectedImage} alt="" className="w-full" />
                                    </div>
                                </>
                            )}{" "}
                        </div>
                        <div>
                            {showEmojiPicker && (
                                <div className="absolute z-50 top-0  emoji-section">
                                    <div ref={emojiPickerRef}>
                                        <Picker
                                            data={data}
                                            previewPosition="none"
                                            onEmojiSelect={(e: EmojiObject) => {  // Explicitly typing 'e' as BaseEmoji
                                                setCaption((prev) => prev + e.native);
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
                            )}

                            <div className="flex gap-5 pt-4">
                                <img
                                    ref={imageRef}
                                    src={emojismile}
                                    alt=""
                                    onClick={() => setShowEmojiPicker(true)}
                                />
                                {!selectedImage && (
                                    <label htmlFor="fileInput" role="button">
                                        <img src={uploadicon} alt="Click to upload" />
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                        <hr color="#707070" className="mt-3" />
                        <div className="relative">
                            <div className="flex justify-between  mt-3 gap-2">
                                <RewriteWithAi
                                    text={caption}
                                    setText={setCaption}
                                    setLoader={setAiLoader}
                                />
                                {(caption || files.length > 0) && (
                                    <button
                                        className="theme-bg-green  font-Poppins-Medium border-2 border-lime-500 font-size-14px px-5 py-1 inline-table rounded-3xl deleteModal-btn loader-btn"
                                        style={{ color: "white" }}
                                        onClick={handleSubmit}
                                        disabled={isLoader}
                                    >
                                        Post{" "}
                                        {isLoader && (
                                            <CircularProgress
                                                style={{ width: 14, height: 14, color: "#fff" }}
                                            />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )} */}


    </div>
);
};

export default FeedHeader;