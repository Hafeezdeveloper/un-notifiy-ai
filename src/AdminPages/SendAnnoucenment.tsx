import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { toast, Toaster } from 'sonner';
import { PostApi } from '../Helper/ApiHandle/BsApiHandle';
import BsInp from '../Comp/BsInp';
import BsButton from '../Comp/BsButton';
import { PortalRoleOptions } from '../Helper/constants';

interface FormData {
    description: string;
    role: string;
}

const SendAnnouncement = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        description: '',
        role: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});

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

    const sendAnnouncement = async (e: React.FormEvent) => {
        if (!formData.description.trim()) {
            toast.error("Description is required!");
            return;
        }

        if (!formData.role.trim()) {
            toast.error("Role is required!");
            return;
        }
        console.log("Awd0d " , formData)
        try {   
            setIsLoading(true);
            const response = await PostApi<any>('/announcements/create', formData);
            console.log(response, "Adwda acn")
            if (response) {
                toast.success('Announcement sent successfully');
                setFormData({
                    description: '',
                    role: '',
                });
                navigate('/admin/accoucenment');
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to send announcement'
            );
        } finally {
            setIsLoading(false);
        }
    };
    console.log(formData)
    return (
        <div className="min-h-screen bg-[#f2f7fb] p-6">
            <Toaster position="top-right" richColors />

            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
                <div className="p-6 md:p-8">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-900">Send Announcement</h2>
                            <p className="text-sm text-gray-600">Dashboard / Announcements</p>
                        </div>
                        <button
                            onClick={sendAnnouncement}
                            className="bg-gradient-to-b from-blue-600 to-blue-800 text-white text-sm px-4 py-2 rounded-full font-semibold shadow hover:opacity-90"
                        >
                            {isLoading ? <CircularProgress size={18} color="inherit" /> : 'Send'}
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
                                {PortalRoleOptions?.map((role: any) => (
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
    );
};

export default SendAnnouncement;
