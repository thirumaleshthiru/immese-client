import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    teacher_name: "",
    teacher_role: "",
    password: "",
    email: ""
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
      const response = await axiosInstance.post("/auth/teacher/register", formData);
      if (response.status === 201) {
        alert("Teacher Registered Successfully!");
        navigate("/teacherlogin");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Join Us</h2>
          <p className="text-gray-500">Register your teacher account</p>
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
              name="teacher_name" 
              placeholder="Full Name" 
              value={formData.teacher_name} 
              onChange={handleChange} 
              className="w-full p-3 border-0 border-b border-gray-300 focus:border-purple-500 focus:ring-0 text-gray-800" 
              required 
            />
          </div>
          
          <div>
            <input 
              type="text" 
              name="teacher_role" 
              placeholder="Role" 
              value={formData.teacher_role} 
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
            Already have an account?{" "}
            <a href="/teacherlogin" className="text-purple-600 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;