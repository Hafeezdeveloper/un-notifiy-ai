import React, { useEffect, useState } from 'react';
import BsButton from '../Comp/BsButton';
import BsTable from '../Comp/BsTable';
import { DeleteApi, GetApi } from '../Helper/ApiHandle/BsApiHandle';
import PaginationComponent from '../Comp/PaginationComponet';
import qs from "qs";
import "../index.css"
import { toast, Toaster } from "sonner";
import BsInp from '../Comp/BsInp';
import { CircularProgress } from '@mui/material';
import AdminButtonComp from '../Comp/AdminButtonComp';
import { useNavigate } from 'react-router-dom';
import IconButton from '../Comp/IconButton';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Model from '../Comp/Model';

interface Paginated {
    totalItems: number;
}
interface ApiResponse {
    totalResults: number;
    paginated: Paginated;
    message?: string;
    documents: any[];
}

const DepartmentList = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
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
                ...(queryParams.search && { search: queryParams.search })
            };

            const response = await GetApi<ApiResponse>('/user/all-department-list', apiParams);
            console.log(response)
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

    const handleDeleteConfirm = async (e: any) => {
        if (!selectedRow) return;

        try {
            // 🔁 Replace with your actual delete API
            console.log("Deleting row: ", selectedRow);

            // Call your DELETE API here
            let response = await DeleteApi<any>(`/user/dep`, selectedRow._id);
            if (response.data.sucess) {
                toast.success("Department deleted!");
            }
            fetchAllData(); // Refresh list
        } catch (error) {
            toast.error("Failed to delete Department");
        } finally {
            setModalOpen(false);
            setSelectedRow(null);
        }
    };
    return (
        <div className="flex font-poppins-regular">
            <Toaster position="top-right" richColors />
            <div style={{ width: '100%' }}>
                <div className="pt-2">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p className="font-size-34px">All  Department </p>
                            <p className="font-size-16px">
                                <strong className="font-bold">
                                    <span className="font-size-18px">Dashboard</span> / All Department
                                </strong>
                            </p>
                        </div>
                        <div className='me-3' style={{ display: 'flex', alignItems: 'center' }}>

                            <div >
                                <BsInp
                                    label="Search User name"
                                    type="text"
                                    name="search"
                                    value={queryParams.search}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name or email"
                                />
                            </div>
                            <AdminButtonComp onClick={() => navigate("/admin/add-department")} label="Add department" />
                        </div>

                    </div>

                    <div className="theme-bg-grey-type my-1">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <CircularProgress />
                            </div>
                        ) : (
                            <>
                                <BsTable
                                    data={data}
                                    headers={[
                                        { name: 'Name', key: 'name' },
                                        { name: 'Total Student', key: 'studentCount' },
                                        { name: 'Total Teacher', key: 'teachersCount' },
                                        { name: 'Total Faculty', key: 'facultyCount' },
                                        { name: 'Status', key: 'status' },
                                        {
                                            name: 'Actions',
                                            key: 'action',
                                            displayField: (row: any) => (
                                                <div className="d-block flex gap-2">
                                                    <IconButton
                                                        icon={<FaEdit />}
                                                        tooltip="Edit"
                                                        bgColor="  text-gray-800"
                                                        onClick={() => navigate(`/admin/edit-department/${row?._id}`)}
                                                    />
                                                    <IconButton
                                                        icon={<FaTrash />}
                                                        tooltip="Delete"
                                                        bgColor="  text-gray-800"
                                                        onClick={() => {
                                                            setSelectedRow(row);
                                                            setModalOpen(true);
                                                        }}
                                                    />
                                                </div>
                                            ),
                                        }
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
            <Model modalOpen={modalOpen} setModalOpen={(e: any) => (setModalOpen(e))} handleDeleteConfirm={(e: any) => handleDeleteConfirm(e)} />
        </div>
    );
};

export default DepartmentList;