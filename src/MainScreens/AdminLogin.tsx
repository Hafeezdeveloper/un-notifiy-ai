
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BsInp from "../Comp/BsInp";
import BsLabel from "../Comp/BsLable";
import { toast, Toaster } from "sonner";
import { faEye, faEyeSlash, faL } from "@fortawesome/free-solid-svg-icons";
import BsButton from "../Comp/BsButton";
import { formDataPostApi, PostApi } from "../Helper/ApiHandle/BsApiHandle";

const AdminLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState<any>(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.userName.trim()) {
            toast.error("Email are required!");
            return;
        }
        if (!formData.password.trim()) {
            toast.error("Password are required!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await PostApi("/operator/login", formData);
            console.log("Response:", response.data);
            setIsLoading(false);
            navigate("/otp-verification", {
                state: { userName: formData.userName, isAdmin: true }
            });
        } catch (error: any) {
            setIsLoading(false);
            if (error.status == 409) {
                toast.error(`Email already exists`);
                return;
            }
            if (error.status == 404) {
                toast.error(`User not found`);
                return;
            }
            console.log(error)
            if (error.response.data.message) {
                toast.error(`${error.response.data.message}`);
                return;
            }
            if (error.response?.data?.statusCode === 422) {
                const errorMessages = Object.values(error.response.data.error); // Extract all error messages
                if (errorMessages.length > 0) {
                    toast.error(errorMessages[0] as string); // Show only the first error message
                }
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="container mx-auto px-4 pt-2 pb-1">
            <Toaster position="top-right" richColors />
            <div className="flex justify-center items-center shadow-sm rounded  bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-md w-lg">
                    <p className="text-xl font-bold text-center mb-2 text-gray-700">Welcome admin!                    </p>
                    <p className="text-gray-500 text-center mb-4">Please enter your login details</p>
                    <form onSubmit={handleSubmit} className="">
                        <div>
                            <BsInp label="User Name" inplabel="User Name" name="userName" value={formData.userName} onChange={handleChange} />
                        </div>
                        <div>

                            <BsInp label="Password" icon={showPassword ? faEyeSlash : faEye} inplabel="Password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onClick={() => setShowPassword(!showPassword)} />
                            {/* <BsInp label="Email" type="email" inplabel="Email" name="email" /> */}
                        </div>
                        {/* Submit Button */}
                        <div className="rounded-md mt-4">
                            <BsButton isLoading={isLoading} label="Login" />
                        </div>
                    </form>
                    {/* <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button> */}
                    {/* <span className="d-flex justify-center w-full font-size-20px text-gray-600 fs ">
                    Register as a teacher?
                    <Link to="/teacherSignUp" className="text-blue-500  font-size-21px pl-1 font_use hover:underline">
                        Register Here
                    </Link>
                </span> */}

                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
