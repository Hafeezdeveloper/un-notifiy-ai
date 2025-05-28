import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import closeIcon from "../../assets/img/closeIcon.svg";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import "../../assets/css/responsive.css";
import "../../assets/css/adminresponsive.css";
import { RootState } from "../../Redux/store/store";
import { isNotEmpty } from "../../Helper/constants";
import { formDataPostApi, PostApi } from "../../Helper/ApiHandle/BsApiHandle";
import { toast, Toaster } from "sonner";

interface PersonalData {
    profileImageURL?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
}

const FeedHeader: React.FC = () => {
    const personalData = useSelector((store: RootState) => store.userProfile);
    const [isLoading, setIsLoading] = useState<any>(true);
    const [postModal, setPostModal] = useState<boolean>(false);
    const [settingmodal, setSettingModal] = useState<boolean>(false);
    const [privacy, setPrivacy] = useState<string>("anyone");
    const [caption, setCaption] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [tempPrivacy, setTempPrivacy] = useState<string>("anyone");

    useEffect(() => {
        if (isNotEmpty(personalData)) {
            setIsLoading(false);
        }
    }, [personalData]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        const maxSize = 5 * 1024 * 1024; // 5MB
        const maxFiles = 10; // Maximum number of files allowed

        if (!selectedFiles) return;

        // Check if adding new files would exceed the maximum limit
        if (files.length + selectedFiles.length > maxFiles) {
            toast.error(`You can upload a maximum of ${maxFiles} images`);
            return;
        }

        const validFiles: File[] = [];
        const newPreviewImages: string[] = [];

        // Process each file
        Array.from(selectedFiles).forEach((file) => {
            if (!file.type.startsWith('image/')) {
                toast.error(`File ${file.name} is not an image`);
                return;
            }

            if (file.size > maxSize) {
                toast.error(`File ${file.name} exceeds 5MB limit`);
                return;
            }

            validFiles.push(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    newPreviewImages.push(e.target.result as string);
                    if (newPreviewImages.length === validFiles.length) {
                        setPreviewImages(prev => [...prev, ...newPreviewImages]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
        }
    };

    const removeImage = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!caption) {
            toast.error("Please enter a caption");
            return;
        }

        if (files.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        setIsLoader(true);

        try {
            // Prepare form data
            const formData = new FormData();
            formData.append("caption", caption);
            files.forEach(file => {
                formData.append("files", file);
            });
            formData.append("privacy", privacy);

            // Here you would make your API call
            const response = await formDataPostApi<any>("/posts/create", formData, true);
            console.log(response.data)
            toast.success("Post created successfully!");
            setCaption("");
            setFiles([]);
            setPreviewImages([]);
            setPostModal(false);
        } catch (error) {
            toast.error("Failed to create post");
        } finally {
            setIsLoader(false);
        }
    };

    const handleWindowSuccessClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLDivElement).className === "ovrlayModal") {
            setPostModal(false);
        }
    };

    return (
        <div className="feed-header p-4 relative">
            <Toaster position="top-right" richColors />
            <div className="create-feed flex gap-2 items-center">
                <div className="crete-feed-user-img flex relative">
                    {isLoading ? (
                        <Skeleton variant="rounded" className="w-full mb-2" width={50} height={50} style={{ borderRadius: 50 }} />
                    ) : (
                        <img
                            width={100}
                            className="rounded-full"
                            src={`${personalData?.data?.profileImageUrl}`}
                            alt=""
                        />
                    )}
                </div>
                <button
                    className={`font-size-16px theme-color-green font-Poppins-Regular`}
                    onClick={() => { setPostModal(true) }}
                >
                    Start a post for University Events
                </button>
            </div>

            {postModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
                        <button
                            className="absolute top-2 right-2"
                            disabled={isLoader}
                            onClick={() => setPostModal(false)}
                        >
                            <img src={closeIcon} alt="Close" width={20} />
                        </button>
                        <div
                            className="create-post-user-data flex gap-2 items-center hover:w-fit hover:rounded-s-md hover:bg-[#7070701c] p-2 w-fit cursor-pointer"
                            onClick={() => setSettingModal(true)}
                        >
                            <div className="crete-feed-user-img flex">
                                <img
                                    width="100"
                                    className="rounded-full"
                                    src={`${personalData?.data?.profileImageUrl}`}
                                    alt=""
                                />
                            </div>
                            <div>
                                <p className="font-size-20px font-Poppins-SemiBold theme-color-green flex items-baseline gap-2 capitalize">
                                    {`${personalData?.data?.fullName || ""}`}
                                    <FontAwesomeIcon icon={faSortDown} />
                                </p>
                                <p className="font-size-15px theme-color-green font-Poppins-Regular">
                                    {privacy === "myConnections" ? "My connections" : "Post to anyone"}
                                </p>
                            </div>
                        </div>
                        <div className="create-post-text-area mt-4">
                            <textarea
                                className="w-full border rounded p-2"
                                placeholder="What do you want to talk about?"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                            {/* Preview multiple images */}
                            {previewImages.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {previewImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
                                            >
                                                <FontAwesomeIcon icon={faTimes} size="xs" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex gap-4">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        multiple // Allow multiple file selection
                                    />
                                    <span className="text-blue-500">Upload Images</span>
                                </label>
                            </div>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                                disabled={!caption || isLoader || files.length === 0}
                                onClick={handleSubmit}
                            >
                                {isLoader ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedHeader;