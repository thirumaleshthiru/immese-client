import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../utils/AuthContext";

const TeacherLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosInstance.post("/auth/teacher/login", formData);
      if (response.status === 200) {
        login(response.data.token, "teacher", response.data.id);
        navigate("/teacherdashboard");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-gray-500">Login to your teacher account</p>
        </div>
        
        {error && (
          <div className="mb-6 text-pink-600 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
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
            Login
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <a href="/teacherregister" className="text-purple-600 font-medium">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;