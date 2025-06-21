import React, { useEffect, useState } from 'react';
import BsButton from '../Comp/BsButton';
import BsTable from '../Comp/BsTable';
import { GetApi, PostApi, PutApi } from '../Helper/ApiHandle/BsApiHandle';
import PaginationComponent from '../Comp/PaginationComponet';
import qs from "qs";
import "../index.css"
import { toast, Toaster } from "sonner";

interface Paginated {
  totalItems: number;
}
interface ApiResponse {
  totalResults: number;
  paginated: Paginated;
  message?: string;
  documents: any[];
}
const UsersRequest = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [isApproving, setIsApproving] = useState<any>(false);
  const [isDeclining, setIsDeclining] = useState<any>(false);
  // Remove the single isLoading state
  const [totalPage, setTotalPage] = useState<number>(1); // State for total number of pages
  const [queryParams, setQueryParams] = useState<any>({
    name: "",
    page: 1,
    pageSize: 10,
    status: "pending"
  });
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      console.log("Current queryParams:", queryParams);

      const response = await GetApi<ApiResponse>('/user/all',
        queryParams,
      );

      console.log("API data received:", response.data);
      setData(response.data.documents || []);

      const count = response.data.paginated?.totalItems || 0;
      setTotalPage(Math.ceil(count / queryParams.pageSize));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllData();
  }, [queryParams]);  // Add queryParams here

  const approvedBtn = async (row: any) => {
    setIsApproving(true)
    let resposnes = await PutApi<any>("/user/status-update", { status: "approved" }, row._id)
    setIsApproving(false)
    if (resposnes.data.success) {
      toast.success(`User approved sucessfully`);
      fetchAllData()
    }
    setIsApproving(false)
  };

  const declineBtn = async (row: any) => {
    setIsDeclining(true)
    let resposnes = await PutApi<any>("/user/status-update", { status: "declined" }, row._id)
    setIsDeclining(false)
    if (resposnes.data.success) {
      fetchAllData()
      toast.success(`User declined sucessfully`);
    }
    setIsDeclining(false)
  };

  return (
    <div>
      <div className="flex font-poppins-regular">
        <Toaster position="top-right" richColors />
        <div style={{ width: '100%' }}>
          <div className="pt-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="font-size-34px">Users request</p>
                <p className="font-size-16px">
                  <strong className="font-bold">
                    <span className="font-size-18px">Dashboard</span> / User request
                  </strong>
                </p>
              </div>
              <div>
              </div>
            </div>

            <div className="theme-bg-grey-type my-1">
              <div className="flex gap-2 mb-3">
                {['Pending', 'Declined'].map((status, indxe) => (
                  <BsButton
                    key={indxe}
                    label={status}
                    style={`p-1 w-22 font-size-20px rounded-pill  
      ${queryParams.status.toLowerCase() === status.toLowerCase() ? 'bg-primary text-white' : ' text-primary-700'} border text-gray border-primary`}
                    onClick={() => {
                      setQueryParams((prev: any) => ({
                        ...prev,
                        page: 1,
                        status: status.toLowerCase()
                      }));
                    }}
                  />
                ))}
              </div>

              <BsTable
                data={data}
                headers={[
                  { name: 'Name', key: 'fullName' },
                  { name: 'Email', key: 'email' },
                  { name: 'Type', key: 'role' },
                  { name: 'Department', key: 'departmentDetails.name' },
                  { name: 'Status', key: 'status' },
                  ...(queryParams.status.toLowerCase() !== "declined" ? [{
                    name: 'Actions',
                    key: 'action',
                    displayField: (row: any) => (
                      <div className="d-block flex gap-2">
                        <BsButton
                          isLoading={isApproving}
                          label="Approve"
                          style="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-700 text-white"
                          onClick={() => approvedBtn(row)}
                        />
                        <BsButton
                          isLoading={isDeclining}
                          label="Decline"
                          style="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-700 text-white"
                          onClick={() => declineBtn(row)}
                        />
                      </div>
                    ),
                  }] : [])
                ]}
              />

              {/* Pagination Buttons */}
              <div className="flex justify-end mt-4 gap-3">
                <PaginationComponent
                  total={totalPage}
                  setCurrentPage={(e) =>
                    setQueryParams({ ...queryParams, page: e })
                  }
                  currentPage={queryParams.page}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersRequest;
