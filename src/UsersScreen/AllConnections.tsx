import React, { useEffect, useState } from 'react';
import { FiUser, FiUsers, FiBriefcase, FiClock, FiCheck, FiX } from 'react-icons/fi';
import HeaderGlobal from '../MainScreens/header/HeaderGolobal';
import { GetApi, PostApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast } from 'sonner';
import qs from 'qs';
import PaginationComponent from '../Comp/PaginationComponet';

const AllConnections = () => {
    const [activeTab, setActiveTab] = useState<any>('received');
    const [loading, setLoading] = useState<any>(false);
    const [invitations, setInvitations] = useState<any>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        status: "pending"
    });

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const queryString = qs.stringify(queryParams);
            let apiEndpoint = '';

            if (activeTab === 'received') {
                apiEndpoint = `/connection/pending-connections-receiver?${queryString}`;
            } else if (activeTab === 'sent') {
                apiEndpoint = `/connection/pending-connections-sender?${queryString}`;
            } else {
                return;
            }
            const res = await GetApi<any>(apiEndpoint);

            if (res?.data?.documents) {
                setInvitations((prev: any) =>
                    queryParams.page === 1
                        ? res.data.documents
                        : [...prev, ...res.data.documents]
                );
                setTotalPages(res.data.paginated?.totalPages || 1);
            }
        } catch (error) {
            toast.error("Failed to load connections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, [queryParams, activeTab]);
    useEffect(() => {
        setQueryParams(prev => ({ ...prev, page: 1 })); // Reset to first page when tab changes
    }, [activeTab]);

    const handleApprove = async (id: number) => {
        try {
            // Add your approve API call here
            await PostApi<any>('/connection/accept', { otherId: id });
            setInvitations(invitations.filter((inv: any) => inv.userId !== id));
            toast.success("Connection approved successfully");
        } catch (error) {
            toast.error("Failed to approve connection");
        }
    };

    const handleDecline = async (id: number) => {
        try {
            // Add your decline API call here
            await PostApi('/connection/reject', { otherId: id });
            setInvitations(invitations.filter((inv: any) => inv.userId !== id));
            toast.success("Connection declined successfully");
        } catch (error) {
            toast.error("Failed to decline connection");
        }
    };

    const handleWithdraw = async (id: number) => {
        try {
            // Add your decline API call here
            await PostApi('/connection/cancel', { otherId: id });
            setInvitations(invitations.filter((inv: any) => inv.userId !== id));
            toast.success("Connection declined successfully");
        } catch (error) {
            toast.error("Failed to decline connection");
        }
    };


    return (
        <div className="font-poppins bg-gray-50 min-h-screen">
            <HeaderGlobal />
            <div className="container-1480 h-auto lg:flex md:flex block gap-6 py-6 px-4">
                <div className="w-full">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`py-2 px-4 font-medium flex items-center ${activeTab === 'connections' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('connections')}
                        >
                            <FiUser className="mr-2" />
                            Connections
                        </button>
                    </div>

                    {/* Invitations Section */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Invitations
                            </h2>
                            <div className="flex space-x-2">
                                <button
                                    className={`px-3 py-1 text-sm rounded ${activeTab === 'received' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('received')}
                                >
                                    Received
                                </button>
                                <button
                                    className={`px-3 py-1 text-sm rounded ${activeTab === 'sent' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('sent')}
                                >
                                    Sent
                                </button>
                            </div>
                        </div>

                        {/* Invitation List */}
                        {loading && queryParams.page === 1 ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : invitations.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No invitations found
                            </div>
                        ) : (
                            <>
                                {invitations.map((invitation: any) => (
                                    <div key={invitation._id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 overflow-hidden">
                                                {invitation?.profileImageUrl ? (
                                                    <img
                                                        src={invitation.profileImageUrl}
                                                        alt={invitation.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FiUser className="text-gray-500" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium">
                                                    {invitation?.fullName || 'Unknown User'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {invitation?.role || 'No role specified'}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-400 mt-1">
                                                    <FiClock className="mr-1" />
                                                    {new Date(invitation.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            {activeTab == "received" ? <>  <button
                                                onClick={() => handleApprove(invitation?.userId)}
                                                className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                                disabled={loading}
                                            >
                                                {loading ? 'Processing...' : (
                                                    <>
                                                        <FiCheck className="mr-1" /> Approve
                                                    </>
                                                )}
                                            </button>
                                                <button
                                                    onClick={() => handleDecline(invitation.userId)}
                                                    className="flex items-center px-3 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                                                    disabled={loading}
                                                >
                                                    <FiX className="mr-1" /> Decline
                                                </button></> : <> <button
                                                    onClick={() => handleWithdraw(invitation.userId)}
                                                    className="flex items-center px-3 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                                                    disabled={loading}
                                                >
                                                    <FiX className="mr-1" /> Withdraw
                                                </button></>}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end mt-4 gap-3">
                                    <PaginationComponent
                                        total={totalPages}
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

export default AllConnections;