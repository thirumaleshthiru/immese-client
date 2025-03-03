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
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Join Us</h2>
          <p className="text-gray-500">Register your student account</p>
        </div>
        
        {error && (
          <div className="mb-6 text-pink-600 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input 
              type="text" 
              name="student_name" 
              placeholder="Full Name" 
              value={formData.student_name} 
              onChange={handleChange} 
              className="w-full p-3 border-0 border-b border-gray-300 focus:border-purple-500 focus:ring-0 text-gray-800" 
              required 
            />
          </div>
          
          <div>
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-3 border-0 border-b border-gray-300 focus:border-purple-500 focus:ring-0 text-gray-800" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <select 
              name="student_branch" 
              value={formData.student_branch} 
              onChange={handleChange} 
              className="w-full p-3 border-0 border-b border-gray-300 focus:border-purple-500 focus:ring-0 text-gray-800 bg-white"
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
            
            <select 
              name="student_year" 
              value={formData.student_year} 
              onChange={handleChange} 
              className="w-full p-3 border-0 border-b border-gray-300 focus:border-purple-500 focus:ring-0 text-gray-800 bg-white"
            >
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <select 
              name="student_section" 
              value={formData.student_section} 
              onChange={handleChange} 
              className="w-full p-3 border-0 border-b border-gray-300 focus:border-purple-500 focus:ring-0 text-gray-800 bg-white"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
            
            <input 
              type="text" 
              name="student_rollno" 
              placeholder="Roll Number" 
              value={formData.student_rollno} 
              onChange={handleChange} 
              className="w-full p-3 border-0 border-b border-gray-300 focus:border-purple-500 focus:ring-0 text-gray-800" 
              required 
            />
          </div>
          
          <div>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-3 border-0 border-b border-gray-300 focus:border-purple-500 focus:ring-0 text-gray-800" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-4 mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Already registered?{" "}
            <a href="/studentlogin" className="text-purple-600 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;