import React from 'react';
import Skeleton from '@mui/material/Skeleton';


function PostSkeleton({ size = 1 }) {
    return (
        <div>
            {[...Array(size)].map((_, index) => (
                <div key={index} className=" shadow-lg bg-white rounded-xl mb-2 py-3 relative">
                    <div className="flex gap-2 items-center border-bottom commeted-show px-4 pb-2 mb-3">
                        <Skeleton variant="circular" width={"3.4vw"} height={"3.4vw"} /> {/* user image skeleton */}
                        <span>
                            <Skeleton variant="rectangular" width={120} height={16} className="mb-1" />
                            <Skeleton variant="rectangular" width={80} height={12} className="mb-1" />
                            <Skeleton variant="rectangular" width={50} height={10} />
                        </span>
                    </div>
                    <div className="px-4 mb-3">
                        <Skeleton variant="rectangular" className="w-full mb-1" height={12} />
                        <Skeleton variant="rectangular" className="w-full mb-1" height={12} />
                        <Skeleton variant="rectangular" className="w-full mb-1" height={12} />
                        <Skeleton variant="rectangular" width={200} height={12} className="mb-1" />
                    </div> {/* caption skeleton */}
                    <Skeleton variant="rectangular" className="w-full" height={200} /> {/* image skeleton */}
                </div>
            ))}
        </div>
    );
};

export default PostSkeleton;