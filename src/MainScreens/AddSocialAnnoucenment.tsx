// src/components/IsExistingUser.tsx
import React, { useState } from 'react';
import qs from "qs";
import { CircularProgress } from '@mui/material';
import HeaderGlobal from './header/HeaderGolobal';
import Headline from '../Comp/Headline';
import { PortalRoleOptions } from '../Helper/constants';
import { decodeToken, PostApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast, Toaster } from 'sonner';

interface IsExistingUserProps {
  title?: any;
  onInvite: any;
  isLoading?: any;
  roleCategory?: any;
  role?: any;
}

interface FormData {
  description: string;
  role: string;
}
const AddSocialAnnoucenment = (props: any) => {
  let rightSideData: any = {
    teacher: [
      { key: 'student', name: 'Student' },
    ],
    faculty: [
      { key: 'all', name: 'All' },           // 👈 Add this line
      { key: 'student', name: 'Student' },
      { key: 'teacher', name: 'Teacher' },
    ],

  }
  const token = localStorage.getItem("authToken");
  const decodedUser = token ? decodeToken(token) : null;
  let roleData = rightSideData[decodedUser.role] || [];

  const [loader, setIsLoader] = useState<any>(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [formData, setFormData] = useState<FormData>({
    description: '',
    role: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  const sendAnnouncement = async () => {
    if (!formData.description.trim()) {
      toast.error("Description is required!");
      return;
    }

    if (!formData.role.trim()) {
      toast.error("Role is required!");
      return;
    }
    try {
      setIsLoader(false)
      let apiPath = ""
      if (decodedUser?.role === "teacher") {
        apiPath = `/announcements/teacher-create`
      } else {
        apiPath = `/announcements/faculty-create`
      }
      const response = await PostApi<any>(apiPath, formData);
      if (response) {
        setIsLoader(false)
        toast.success('Announcement sent successfully');
        setFormData({
          description: '',
          role: '',
        });
        // navigate('/admin/accoucenment');
      }
    } catch (error: any) {
      setIsLoader(false)
      toast.error(
        error.response?.data?.message || 'Failed to send announcement'
      );
    }
  }

  return (
    <div>
      <HeaderGlobal />
      <div className="container-1480 h-3vw ">
        <Toaster position="top-right" richColors />
        <div className="shadow-lg bg-white rounded-none lg:rounded-lg mb-2 py-3 px-6">
          <h3 className="font-size-18px font-Poppins-SemiBold theme-color-green">
            {"Add Annoucenment"}
          </h3>
          <div className="p-6 md:p-8">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Send Announcement</h2>
                <p className="text-sm text-gray-600">Feeds / Add Announcements</p>
              </div>
              <button
                onClick={sendAnnouncement}
                className="bg-gradient-to-b from-blue-600 to-blue-800 text-white text-sm px-4 py-2 rounded-full font-semibold shadow hover:opacity-90"
              >
                {loader ? <CircularProgress size={18} color="inherit" /> : 'Send'}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your announcement here..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 pe-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-35 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roleData?.map((role: any) => (
                    <option key={role.key} value={role.key}>
                      {role?.name}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors?.role}</p>
                )}
              </div>



            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddSocialAnnoucenment;
