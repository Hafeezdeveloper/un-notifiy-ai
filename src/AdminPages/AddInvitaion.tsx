import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { toast, Toaster } from 'sonner';
import { PostApi } from '../Helper/ApiHandle/BsApiHandle';
import BsInp from '../Comp/BsInp';
import BsButton from '../Comp/BsButton';

interface FormData {
    email: string;
    fullName: string;
    description: string;
}

const SendInvitationForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        fullName: '',
        description: ''
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const sendInvitation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await PostApi('/user/send-invitation', formData);

            if (response) {
                toast.success('Invitation sent successfully');
                setFormData({
                    email: '',
                    fullName: '',
                    description: ''
                });
                navigate('/admin/user-invitation');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send invitation');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <Toaster position="top-right" richColors />

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 md:p-8 ">
                    <div className="mb-6">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                
                        <h1 className="text-2xl md:te xt-3xl font-bold text-gray-800 mb-2">Send Invitation</h1>
                        <p className="text-gray-600">
                            <span className="font-medium">Dashboard</span> / Send Invitation
                        </p>
                        </div>                                                                                          
                        <button onClick={sendInvitation}>
                                <span style={{ backgroundImage: "linear-gradient(180deg, #0072b5, #005a92)", color: "white" }} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold rounded-pill ">
                            
                                    {"Send Invitation"}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="grid grid-cols-1 gap-6">
                                <BsInp
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    className="w-full"
                                />

                                <BsInp
                                    label="Full Name"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    error={errors.fullName}
                                    className="w-full"
                                />

                                <BsInp
                                    label="Description"
                                    type="textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={errors.description}
                                    rows={4}
                                    className="w-full"
                                />
                            </div>

                       
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendInvitationForm;