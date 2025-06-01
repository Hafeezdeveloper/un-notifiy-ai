import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import qs from "qs";
import { GetApi } from "../../Helper/ApiHandle/BsApiHandle";

interface SearchResult {
    _id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    roleCategory: string;
    totalRatings?: number;
    totalReviews?: number;
    fullName?: string;
}

interface PaginatedResponse {
    paginated: {
        totalItems: number;
        totalPages: number;
    };
    documents: SearchResult[];
}

const HeaderSearchInput = () => {
    const [value, setValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [data, setData] = useState<SearchResult[]>([]);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const timeoutIdRef = useRef<any>(null);

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        sort: "top",
        query: ""
    });

    // Memoized search handler
    const handleSearch = useCallback(async (text: string, _time: number) => {
        if (text) {
            // Update query params immediately
            setQueryParams(prev => ({
                ...prev,
                query: text,
                page: 1 // Reset to first page on new search
            }));

            setIsLoader(true);

            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }

            timeoutIdRef.current = setTimeout(async () => {
                try {
                    const response = await GetApi<PaginatedResponse>(
                        `/search/profile?${qs.stringify({
                            ...queryParams,
                            query: text,
                            page: 1
                        })}`
                    );

                    setNumberOfResults(response.data.paginated.totalItems);
                    setData(response.data.documents);
                } catch (err) {
                    toast.error("Error searching");
                    console.error("Search error:", err);
                    setData([]);
                    setNumberOfResults(0);
                } finally {
                    setIsLoader(false);
                }
            }, _time);
        } else {
            setValue("");
            setNumberOfResults(0);
            setData([]);
        }
    }, [queryParams]);

    // Load more results for pagination
    const loadMoreResults = async () => {
        if (isLoader) return;

        const nextPage = queryParams.page + 1;
        setIsLoader(true);

        try {
            const response = await GetApi<PaginatedResponse>(
                `/search/profile?${qs.stringify({
                    ...queryParams,
                    page: nextPage
                })}`
            );

            setQueryParams(prev => ({ ...prev, page: nextPage }));
            setData(prev => [...prev, ...response.data.documents]);
        } catch (err) {
            toast.error("Error loading more results");
        } finally {
            setIsLoader(false);
        }
    };

    const calculateRating = (totalRatings: number = 0, totalReviews: number = 0) => {
        if (totalReviews === 0) return 0;
        return Math.round(totalRatings / totalReviews);
    };

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (target && !target.closest(".header-focused-box-parent")) {
            setIsFocused(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md relative header-focused-box-parent">
            <div className="relative">
                <input
                    type="search"
                    placeholder="Search"
                    value={value}
                    className="bg-white/20 text-white placeholder-white/70 rounded-full py-1 px-5 pl-10 w-full 
                     focus:outline-none focus:ring-2 focus:ring-white/50 transition-all
                     text-sm sm:text-base"
                    onFocus={() => setIsFocused(true)}
                    onChange={(e) => {
                        setValue(e.target.value);
                        handleSearch(e.target.value, 500);
                    }}
                />
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
                />
            </div>

            {isFocused && value && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-50 p-4 max-h-96 overflow-y-auto">
                    <div className="flex justify-end mb-2">
                        {numberOfResults > 0 && (
                            <>
                            {/* <Link
                                to={`/user-search?query=${encodeURIComponent(value)}`}
                                className="text-sm font-medium text-green-500 hover:underline"
                                onClick={() => setIsFocused(false)}
                            >
                                See all ({numberOfResults})
                            </Link> */}
                                </>
                        )}
                    </div>

                    {isLoader && queryParams.page === 1 ? (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : data.length > 0 ? (
                        <>
                            {data.map((item: any, index: any) => (
                                <Link
                                    to={`/public-profile/${item._id}/view`}
                                    onClick={() => setIsFocused(false)}
                                    key={`${item._id}-${index}`}
                                    className="block py-2 hover:bg-gray-100 rounded px-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.profileImageUrl || "/default-profile.png"}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/default-profile.png";
                                                }}
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {item.fullName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {data.length < numberOfResults && (
                                <button
                                    onClick={loadMoreResults}
                                    disabled={isLoader}
                                    className="w-full py-2 text-center text-green-500 hover:bg-gray-100 rounded"
                                >
                                    {isLoader ? "Loading..." : "Load More"}
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            {value ? "No results found" : "Start typing to search"}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default HeaderSearchInput;