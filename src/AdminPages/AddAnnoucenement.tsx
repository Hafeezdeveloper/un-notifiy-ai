import React, { useEffect, useState } from 'react';
import BsButton from '../Comp/BsButton';
import BsTable from '../Comp/BsTable';
import { DeleteApi, GetApi } from '../Helper/ApiHandle/BsApiHandle';
import PaginationComponent from '../Comp/PaginationComponet';
import qs from "qs";
import "../index.css"
import { toast, Toaster } from "sonner";
import BsInp from '../Comp/BsInp';
import { CircularProgress, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import IconButton from '../Comp/IconButton';

interface Paginated {
    totalItems: number;
}
interface ApiResponse {
    totalResults: number;
    paginated: Paginated;
    message?: string;
    documents: any[];
}

const AddAnnoucenement = () => {
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

            const response = await GetApi<ApiResponse>('/announcements/all-admin', apiParams);

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

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        try {
            // 🔁 Replace with your actual delete API
            console.log("Deleting row: ", selectedRow);

            // Call your DELETE API here
            let response = await DeleteApi<any>(`/announcements`, selectedRow._id);
            if (response.data.sucess) {
                toast.success("Announcement deleted!");
            }
            fetchAllData(); // Refresh list
        } catch (error) {
            toast.error("Failed to delete announcement");
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
                            <p className="font-size-34px">Announcement</p>
                            <p className="font-size-16px">
                                <strong className="font-bold">
                                    <span className="font-size-18px">Dashboard</span> / All Announcement
                                </strong>
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>

                            <div className='me-3' style={{ display: 'flex', alignItems: 'center' }}>
                                <BsInp
                                    label="Search User name"
                                    type="text"
                                    name="search"
                                    value={queryParams.search}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name or email"
                                />
                            </div>
                            <div>
                                <button onClick={() => navigate("/admin/send-Annoucenment")}>
                                    <span style={{ backgroundImage: "linear-gradient(180deg, #0072b5, #005a92)", color: "white" }} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold rounded-pill ">
                                        {"Send Announcement"}
                                    </span>
                                </button>

                            </div>
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
                                        { name: 'Full Name', key: 'finalDetails.fullName' },
                                        { name: 'Notification send', key: 'role' },
                                        { name: 'Desciption', key: 'description' },
                                        { name: 'Send At', key: 'createdAt' },
                                        { name: 'STATUS', key: 'status' },
                                        {
                                            name: 'Actions',
                                            key: 'action',
                                            displayField: (row: any) => (
                                                <div className="d-block flex gap-2">
                                                    <IconButton
                                                        icon={<FaEdit />}
                                                        tooltip="Edit"
                                                        bgColor="  text-gray-800"
                                                        onClick={() => navigate(`/admin/edit-annoucenment/${row?._id}`)}
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
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-[100%] max-w-xl">
                        <h2 className="font-size-55px font-semibold mb-4">Are you sure you want to delete this announcement?</h2>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteConfirm()}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default AddAnnoucenement