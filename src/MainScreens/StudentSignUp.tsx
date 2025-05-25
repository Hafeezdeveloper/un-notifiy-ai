import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BsInp from "../Comp/BsInp";
import BsSelect from "../Comp/BsSelect";
import BsLabel from "../Comp/BsLable";
import "./User.css";
import { formDataPostApi, GetApi } from "../Helper/ApiHandle/BsApiHandle";
import { toast, Toaster } from "sonner";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import BsButton from "../Comp/BsButton";

const StudentSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<any>(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    section: "",
    batch: "",
    semester: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [formOptions, setFormOptions] = useState({
    departments: [],
    batches: [],
    semesters: [],
    sections: [],
  });

  useEffect(() => {
    const fetchAllData = async () => {
      const [deptRes, batchRes, semRes, secRes] = await Promise.all([
        GetApi<any>('/user/departments'),
        GetApi<any>('/user/batches'),
        GetApi<any>('/user/semesters'),
        GetApi<any>('/user/sections'),
      ]);

      const modifiedBatches = batchRes.data.map((batch: any) => ({
        ...batch,
        name: batch.year,
      }));
      setFormOptions({
        departments: deptRes.data,
        batches: modifiedBatches,
        semesters: semRes.data,
        sections: secRes.data,
      });
    }
    fetchAllData()
  }, []);
  console.log(formOptions)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full Name are required!");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email are required!");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password are required!");
      return;
    }
    if (!formData.department.trim()) {
      toast.error("Department are required!");
      return;
    }
    if (!formData.section.trim()) {
      toast.error("Section are required!");
      return;
    }
    if (!formData.batch.trim()) {
      toast.error("Batch are required!");
      return;
    }
    if (!formData.semester.trim()) {
      toast.error("Semester are required!");
      return;
    }
    if (!file) {
      toast.error("File is required!");
      return;
    }
    setIsLoading(true);

    const submitData = new FormData();
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("department", formData.department);
    submitData.append("section", formData.section);
    submitData.append("batch", formData.batch);
    submitData.append("semester", formData.semester);
    submitData.append("role", "student");

    if (file) {
      submitData.append("image", file);
    }
    try {
      const response = await formDataPostApi<any>("/user/createUser", submitData, true);
      console.log("Response:", response.data);
      setIsLoading(false);
      if (response.data.statusCode == 409) {
        toast.error(`Email already exists`);
        return;
      }
      navigate("/verification");
    } catch (error: any) {
      setIsLoading(false);
      if (error.status == 409) {
        toast.error(`Email already exists`);
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

  return (
    <div className="container mx-auto px-4 pt-2 pb-1 flex justify-center">
      <Toaster position="top-right" richColors />
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full md:max-w-lg">
        <p className="text-xl font-bold text-center mb-2 text-gray-700">Student Registration</p>
        <p className="text-gray-500 text-center mb-4">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <BsInp inplabel="Full Name" label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          <BsInp label="Email" type="email" inplabel="Email" name="email" value={formData.email} onChange={handleChange} />
          <BsInp label="Password" icon={showPassword ? faEyeSlash : faEye} inplabel="Password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onClick={() => setShowPassword(!showPassword)} />

          <BsLabel label="Department" />
          <BsSelect name="department" value={formData.department} onChange={handleChange} data={formOptions.departments} />

          <BsLabel label="Section" />
          <BsSelect name="section" value={formData.section} onChange={handleChange} data={formOptions.sections} />

          {/* Batch and Semester in a Responsive Flex Container */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <BsLabel label="Batch" />
              <BsSelect style={"w-55 "} name="batch" value={formData.batch} onChange={handleChange} data={formOptions.batches} />
            </div>
            <div className="w-full">
              <BsLabel label="Semester" />
              <BsSelect style={"w-55"} name="semester" value={formData.semester} onChange={handleChange} data={formOptions.semesters} />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <BsLabel label="Upload File" />
            <input
              type="file"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <div className="rounded-md">
            <BsButton isLoading={isLoading} label="Sign in" />
          </div>
        </form>

        <p className="d-flex justify-center w-full font-size-20px m-0 mb-1  text-gray-600 font mt-4">
          Already have an account?
          <Link to="/login" className="text-blue-500 font-size-21px pl-1  hover:underline">
            Login
          </Link>
        </p>
        <span className="d-flex justify-center w-full font-size-20px text-gray-600  ">
          Register as a teacher?
          <Link to="/teacherSignUp" className="text-blue-500  font-size-21px pl-1 font_use hover:underline">
            Register Here
          </Link>
        </span>
      </div>
    </div>
  );
};

export default StudentSignUp;
