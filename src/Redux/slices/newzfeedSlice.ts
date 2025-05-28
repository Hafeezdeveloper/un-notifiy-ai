import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a Comment type
interface CommentType {
    _id: any;
    [key: string]: any;
}

// Define a Post type
interface PostType {
    _id: string;
    reactionStatus?: boolean;
    allReacts?: number;
    allComments?: number;
    comments?: CommentType[] | null;
    [key: string]: any;
}

// Define the state type
interface FeedState {
    isLoader: boolean;
    isError: boolean;
    allPosts: PostType[];
}

// Initial state
const initialState: FeedState = {
    isLoader: false,
    isError: false,
    allPosts: [],
};

// Slice
const newsFeedSlice = createSlice({
    name: "NEWS_FEED",
    initialState,
    reducers: {
        resetAllPosts: (state) => {
            state.allPosts = [];
        },

        setAllPosts: (state, { payload }: PayloadAction<PostType[]>) => {
            const existingIds = new Set(state.allPosts.map((post) => post._id));
            const newPosts = payload.filter((post) => !existingIds.has(post._id));
            state.allPosts = [...newPosts, ...state.allPosts,];
        },


        createNewPost: (state, { payload }: PayloadAction<PostType>) => {
            state.allPosts = [payload, ...state.allPosts];
        },

        toogleLikedPost: (
            state,
            { payload }: PayloadAction<{ postId: string; status: boolean }>
        ) => {
            const { postId, status } = payload;
            state.allPosts = state.allPosts.map((post) =>
                post._id === postId
                    ? {
                        ...post,
                        reactionStatus: status,
                        allReacts: status
                            ? (post.allReacts || 0) + 1
                            : (post.allReacts || 0) - 1,
                    }
                    : post
            );
        },

        updateCommentCounter: (state, { payload }: PayloadAction<string>) => {
            state.allPosts = state.allPosts.map((post) =>
                post._id === payload
                    ? {
                        ...post,
                        allComments: (post.allComments || 0) + 1,
                    }
                    : post
            );
        },

        removePostById: (state, { payload }: PayloadAction<string>) => {
            state.allPosts = state.allPosts.filter((post) => post._id !== payload);
        },

        removeCommentFromPost: (state, { payload }: PayloadAction<string>) => {
            state.allPosts = state.allPosts.map((post) => {
                if (Array.isArray(post.comments)) {
                    const updatedComments = post.comments.filter(
                        (comment) => comment._id !== payload
                    );
                    return {
                        ...post,
                        comments: updatedComments,
                    };
                } else if ((post.comments as any)?._id === payload) {
                    return {
                        ...post,
                        comments: null,
                    };
                }
                return post;
            });
        },
    },
});

// Export actions
export const {
    resetAllPosts,
    setAllPosts,
    createNewPost,
    toogleLikedPost,
    updateCommentCounter,
    removePostById,
    removeCommentFromPost,
} = newsFeedSlice.actions;

// Export reducer
export default newsFeedSlice.reducer;
