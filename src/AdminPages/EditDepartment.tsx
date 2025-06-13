import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { toast, Toaster } from 'sonner';
import { GetApi, PostApi, PutApi } from '../Helper/ApiHandle/BsApiHandle';
import BsInp from '../Comp/BsInp';
import BsButton from '../Comp/BsButton';
import { PortalRoleOptions } from '../Helper/constants';

interface FormData {
    name: string;
}

const EditDepartment = () => {
    const { id } = useParams<any>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
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
    const fetch = async () => {
        const response = await GetApi<any>(`/user/dep/${id}`);
        if (response?.data?.success) {
            setFormData({
                name: response?.data.document.name,
            });
        } else {
            toast.error('error');
        }
    };
    useEffect(() => {
        fetch()
    }, [id])
    const sendAnnouncement = async (e: React.FormEvent) => {
        if (!formData.name.trim()) {
            toast.error("Department name is required!");
            return;
        }
        try {
            setIsLoading(true);
            const response = await PutApi<any>('/user/dep', formData, id);
            console.log(response, "Adwda acn")
            if (response) {
                toast.success('Announcement sent successfully');
                setFormData({
                    name: '',
                });
                navigate('/admin/department-list');
            }
            setIsLoading(false);

        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to send announcement'
            );
            setIsLoading(false);

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
                            <h2 className="text-2xl font-bold text-blue-900">Edit Department</h2>
                            <p className="text-sm text-gray-600">Dashboard / Edit Department</p>
                        </div>
                        <button
                            onClick={sendAnnouncement}
                            className="bg-gradient-to-b from-blue-600 to-blue-800 text-white text-sm px-4 py-2 rounded-full font-semibold shadow hover:opacity-90"
                        >
                            {isLoading ? <CircularProgress size={18} color="inherit" /> : 'Save'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department Name :</label>
                        <div>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-md border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your deparmtment name here..."
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditDepartment;
