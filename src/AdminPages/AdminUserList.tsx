import React, { useEffect, useState } from 'react';
import BsButton from '../Comp/BsButton';
import BsTable from '../Comp/BsTable';
import { GetApi } from '../Helper/ApiHandle/BsApiHandle';
import PaginationComponent from '../Comp/PaginationComponet';
import qs from "qs";
import "../index.css"
import { toast, Toaster } from "sonner";
import BsInp from '../Comp/BsInp';
import { CircularProgress } from '@mui/material';

interface Paginated {
    totalItems: number;
}
interface ApiResponse {
    totalResults: number;
    paginated: Paginated;
    message?: string;
    documents: any[];
}

const AdminUserList = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [queryParams, setQueryParams] = useState({
        name: "",
        page: 1,
        pageSize: 10,
        type: "all user",
        search: ""
    });

    const fetchAllData = async () => {
        try {
            setIsLoading(true);
            
            // Prepare API parameters
            const apiParams = {
                page: queryParams.page,
                pageSize: queryParams.pageSize,
                ...(queryParams.type !== "all user" && { type: queryParams.type }),
                ...(queryParams.search && { search: queryParams.search })
            };

            const response = await GetApi<ApiResponse>('/user/all', apiParams);
            
            setData(response.data.documents || []);
            const count = response.data.paginated?.totalItems || 0;
            setTotalPage(Math.ceil(count / queryParams.pageSize));
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [queryParams]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQueryParams(prev => ({
            ...prev,
            search: e.target.value,
            page: 1 // Reset to first page when searching
        }));
    };

    return (
        <div className="flex font-poppins-regular">
            <Toaster position="top-right" richColors />
            <div style={{ width: '100%' }}>
                <div className="pt-2">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p className="font-size-34px">All  Users </p>
                            <p className="font-size-16px">
                                <strong className="font-bold">
                                    <span className="font-size-18px">Dashboard</span> / All User
                                </strong>
                            </p>
                        </div>
                        <div>
                            <BsInp 
                                label="Search User name" 
                                type="text" 
                                name="search"
                                value={queryParams.search}
                                onChange={handleSearchChange}
                                placeholder="Search by name or email"
                            />
                        </div>
                    </div>

                    <div className="theme-bg-grey-type my-1">
                        <div className="flex gap-2 mb-3">
                            {['All user', 'Student', "Teacher", "Faculty"].map((status, index) => (
                                <BsButton
                                    key={index}
                                    label={status}
                                    style={`p-1 w-22 font-size-20px rounded-pill capitalize-first-letter
                                        ${queryParams.type.toLowerCase() === status.toLowerCase() 
                                            ? 'bg-primary text-white' 
                                            : 'text-primary-700 border border-primary'}`}
                                    onClick={() => {
                                        setQueryParams(prev => ({
                                            ...prev,
                                            page: 1,
                                            type: status.toLowerCase()
                                        }));
                                    }}
                                />
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <CircularProgress />
                            </div>
                        ) : (
                            <>
                                <BsTable
                                    data={data}
                                    headers={[
                                        { name: 'Name', key: 'fullName' },
                                        { name: 'Email', key: 'email' },
                                        { name: 'Type', key: 'role' },
                                        { name: 'Department', key: 'departmentDetails.name' },
                                        { name: 'Status', key: 'status' },
                                    ]}
                                />

                                <div className="flex justify-end mt-4 gap-3">
                                    <PaginationComponent
                                        total={totalPage}
                                        setCurrentPage={(page) =>
                                            setQueryParams(prev => ({ ...prev, page }))
                                        }
                                        currentPage={queryParams.page}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserList;