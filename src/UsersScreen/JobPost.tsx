import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import HeaderGlobal from "../MainScreens/header/HeaderGolobal";
import LeftSidebar from "../MainScreens/leftSidebar/LeftSidebar";
import { PostApi } from "../Helper/ApiHandle/BsApiHandle";
import BsLabel from "../Comp/BsLable";
import BsSelect from "../Comp/BsSelect";
import { EmployementType, JobType } from "../Helper/constants";

interface JobFormData {
  title: string;
  company: string;
  employmentType: string;
  location: string;
  workplaceType: string;
  description: string;
  responsibilities: string;
  qualifications: string;
}

const JobPost = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    employmentType: "Full-time",
    location: "",
    workplaceType: "On-site",
    description: "",
    responsibilities: "",
    qualifications: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Job title is required!");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Job description is required!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await PostApi<any>('/jobs/create', formData);

      if (response) {
        toast.success('Job posted successfully');
        navigate('/jobs');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to post job'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-poppins bg-gray-50 min-h-screen">
      <HeaderGlobal />
      <div className="container-1480 h-auto lg:flex md:flex block gap-6 py-6 px-4">
        <LeftSidebar />

        <div className="w-full lg:w-3/4">
          {/* Header Section */}
          <div className="bg-white shadow-sm rounded-xl p-6 mb-6 flex justify-between items-center border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Create Job Posting</h1>
              <p className="text-gray-500 mt-1">
                This will be visible to anyone who views your job post
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>

          {/* Job Posting Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title*
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Full Stack Engineer"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name*
                </label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Sid Techno"
                  required
                />
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <BsLabel label="Employment Type*" />
                  <BsSelect style={"w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"} 
                  name="employmentType" value={formData.employmentType} onChange={handleChange} data={EmployementType} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Karachi, Pakistan"
                    required
                  />
                </div>

                <div>
                  <BsLabel label="Workplace Type*" />
                  <BsSelect
                    style={"w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"}
                    name="workplaceType" value={formData.workplaceType} onChange={handleChange} data={JobType} />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description*
                  <span className="text-xs text-gray-500 ml-2">
                    Provide a summary of the role and how it fits into your organization
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tips: Provide a summary of the role, what success in the position looks like, and how this role fits into the organization overall."
                  required
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List the key responsibilities of the role"
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications
                </label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List the required qualifications and skills"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Go back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPost;