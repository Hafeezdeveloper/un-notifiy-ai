import React, { useEffect, useRef, useState } from "react";
import { MenuItem, Select } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import PostSkeleton from "../../Comp/PostSkeleton";
import { RootState } from "../../Redux/store/store";
import { resetAllPosts } from "../../Redux/slices/newzfeedSlice";
import PostContainer from "../../Comp/PostContainer";
interface FeedState {
    isLoader: any;
    isError: boolean;
    allPosts: any;
}
interface QueryParams {
    page: number;
    limit: number;
    sort: string;
}

interface FeedPostViewProps {
    loader: boolean;
    queryParams: QueryParams;
    setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>;
    totalPages: number;
}

const FeedPostView: React.FC<FeedPostViewProps> = ({
    loader,
    queryParams,
    setQueryParams,
    totalPages,
}) => {

    const dispatch = useDispatch();
    const data = useSelector((state: RootState) => state.feed) as FeedState;
    const controlMenuRef = useRef<HTMLDivElement>(null);
    const [feedControlMenu, setFeedControlMenu] = useState(false); // for feed control menu

    console.log(data.allPosts)

    const LoaderComponents = () => {
        // full page loader
        return <PostSkeleton size={queryParams.limit} />;
    };
    const handleClickOutside = (event: MouseEvent) => {
        // Close or hide the feed menu when clicking outside of the menu
        if (
            controlMenuRef.current &&
            !controlMenuRef.current.contains(event.target as Node)
        ) {
            setFeedControlMenu(false);
        }
    };

    // Add event listener when the component mounts
    useEffect(() => {
        if (feedControlMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Clean up event listener when the component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [feedControlMenu]); // Add showEmojiPicker to the dependency array

    return (
        <div>
            <div className="flex justify-between items-center">
                <span className="w-full border-b-2  border-[#70707054]"></span>
                <div className="flex gap-1 recently-connections items-center py-2">
                    <p
                        className="font-size-16px theme-grey-type font-Poppins-Regular text-center"
                        style={{ width: "4rem" }}
                    >
                        Sort by:
                    </p>
                    <div className="sortby-select">
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={queryParams.sort}
                            onChange={(e) => {
                                dispatch(resetAllPosts());
                                setQueryParams({ ...queryParams, page: 1, sort: e.target.value });
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: '#F4F2EE',
                                        border: "2px solid #004540"

                                    }
                                }
                            }}

                        >
                            <MenuItem value="top"
                                sx={{
                                    fontFamily: 'Poppins',
                                    fontSize: '15px',
                                    '&:hover': {
                                        backgroundImage: 'linear-gradient(#004540, #00a297)',
                                        color: "#fff"
                                    },
                                    '&.Mui-selected': {
                                        backgroundImage: 'linear-gradient(#004540, #00a297)',
                                        color: '#ffffff',
                                    }
                                }}
                            >Top </MenuItem>
                            <MenuItem value="recent"
                                sx={{
                                    fontFamily: 'Poppins',
                                    fontSize: '15px',
                                    '&:hover': {
                                        backgroundImage: 'linear-gradient(#004540, #00a297)',
                                        color: "#fff"
                                    },
                                    '&.Mui-selected': {
                                        backgroundImage: 'linear-gradient(#004540, #00a297)',
                                        color: '#ffffff',
                                    }
                                }}
                            >Recent</MenuItem>
                        </Select>
                    </div>
                </div>{" "}
                {/* top or recent */}
            </div>{" "}
            <InfiniteScroll
                dataLength={data?.allPosts?.length}
                next={() =>
                    setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                hasMore={queryParams.page < totalPages}
                loader={loader && <LoaderComponents />}
                endMessage={
                    <p style={{ textAlign: "center" }} className="justify-center p-2 font-size-16px font-Poppins-Medium   theme-color-green flex gap-2 items-center mb-4 on-hover-underline">No more posts to show</p>
                }
            >
                {data?.allPosts && data?.allPosts.length > 0
                    ? data?.allPosts.map((item: any, index: number) => (
                        <>
                             <PostContainer key={index} item={item} index={index}  />
                        </>
                    ))
                    : null}
            </InfiniteScroll>
            {loader && <LoaderComponents />}
        </div>
    );
};

export default FeedPostView;
