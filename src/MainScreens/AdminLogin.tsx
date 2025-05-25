import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BsInp from "../Comp/BsInp";
import { toast, Toaster } from "sonner";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import BsButton from "../Comp/BsButton";
import { PostApi } from "../Helper/ApiHandle/BsApiHandle";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName.trim()) {
      toast.error("Username is required!");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await PostApi<any>("/operator/login", formData);
      console.log("Response:", response.data);
      setIsLoading(false);
      navigate("/otp-verification", {
        state: { userName: formData.userName, isAdmin: true },
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
      if (error.response?.data?.message) {
        toast.error(`${error.response.data.message}`);
        return;
      }
      if (error.response?.data?.statusCode === 422) {
        const errorMessages = Object.values(error.response.data.error);
        if (errorMessages.length > 0) {
          toast.error(errorMessages[0] as string);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" richColors />
      <div className="flex justify-center items-center shadow-sm rounded bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-lg">
          <p className="text-xl font-bold text-center mb-2 text-gray-700">Admin Login</p>
          <p className="text-gray-500 text-center mb-4">Enter your admin credentials</p>
          <form onSubmit={handleSubmit}>
            <div>
              <BsInp
                label="Username"
                type="text"
                inplabel="Username"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div>
              <BsInp
                label="Password"
                icon={showPassword ? faEyeSlash : faEye}
                inplabel="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="rounded-md mt-4">
              <BsButton isLoading={isLoading} label="Login" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
