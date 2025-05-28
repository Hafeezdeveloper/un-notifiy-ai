
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BsInp from "../Comp/BsInp";
import BsLabel from "../Comp/BsLable";
import { toast, Toaster } from "sonner";
import { faEye, faEyeSlash, faL } from "@fortawesome/free-solid-svg-icons";
import BsButton from "../Comp/BsButton";
import { formDataPostApi, PostApi } from "../Helper/ApiHandle/BsApiHandle";
import { storeToken } from "../Redux/slices/AuthSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  interface Paginated {
    totalItems: number;
  }
  interface ApiResponse {
    documents: any[];
    token:any
  }

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<any>(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast.error("Email are required!");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password are required!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await PostApi<ApiResponse>("/user/login", formData);
      console.log("Response:", response.data);
      setIsLoading(false);
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        dispatch(storeToken(response.data.token));
        navigate("/feeds");
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.status == 409) {
        toast.error(`Email already exists`);
        return;
      }
      if (error.status == 404) {
        toast.error(`Email not found`);
        return;
      }
      if (error.status == 401) {
        toast.error(`Incorrect password`);
        return;
      }
      if (error.status == 403) {
        toast.error(`Verify your email through the verification link`);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" richColors />
      <div className="flex justify-center items-center shadow-sm rounded  bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-lg">
          <p className="text-xl font-bold text-center mb-2 text-gray-700">Login to your account</p>
          {/* <p className="text-gray-500 text-center mb-4">or create </p> */}
          <form onSubmit={handleSubmit} className="">
            <div>
              <BsInp label="Email" type="email" inplabel="Email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end" }} className="">
                <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <BsInp label="Password" icon={showPassword ? faEyeSlash : faEye} inplabel="Password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onClick={() => setShowPassword(!showPassword)} />
              {/* <BsInp label="Email" type="email" inplabel="Email" name="email" /> */}
            </div>
            {/* Submit Button */}
            <div className="rounded-md mt-4">
              <BsButton isLoading={isLoading} label="Login" />
            </div>
          </form>
          <span className="d-block text-center text-gray-600 mt-4">
            Register as a teacher?
            <Link to="/teacherSignUp" className="text-blue-500 hover:underline ml-1">
              Register
            </Link>
          </span>
          <span className="d-flex justify-center w-full font-size-20px text-gray-600 fs ">
          Register as a student?
            <Link to="/" className="text-blue-500  font-size-21px pl-1 font_use hover:underline">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
