import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    student_name: "",
    email: "",
    student_branch: "cse",
    student_year: "1",
    student_section: "A",
    student_rollno: "",
    password: ""
  });
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosInstance.post("/auth/student/register", formData);
      if (response.status === 201) {
        alert("Student Registered Successfully!");
        navigate("/studentlogin");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen  ">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md mx-4 my-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-indigo-800">Student Registration</h2>
          <p className="text-gray-600 mt-2">Create your academic account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="student_name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              id="student_name"
              name="student_name" 
              placeholder="Enter your full name" 
              value={formData.student_name} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              placeholder="your.email@example.com" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="student_branch" className="block text-sm font-medium text-gray-700">Branch</label>
              <select 
                id="student_branch"
                name="student_branch" 
                value={formData.student_branch} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="cse">CSE</option>
                <option value="ece">ECE</option>
                <option value="mech">MECH</option>
                <option value="cse ai">CSE AI</option>
                <option value="cse ds">CSE DS</option>
                <option value="eee">EEE</option>
                <option value="civil">CIVIL</option>
                <option value="mca">MCA</option>
                <option value="mba">MBA</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="student_year" className="block text-sm font-medium text-gray-700">Year</label>
              <select 
                id="student_year"
                name="student_year" 
                value={formData.student_year} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="student_section" className="block text-sm font-medium text-gray-700">Section</label>
              <select 
                id="student_section"
                name="student_section" 
                value={formData.student_section} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="student_rollno" className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input 
                type="text" 
                id="student_rollno"
                name="student_rollno" 
                placeholder="Enter roll number" 
                value={formData.student_rollno} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder="Create a secure password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/studentlogin" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;