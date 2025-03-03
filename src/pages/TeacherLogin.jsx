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
    <div className="flex justify-center items-center min-h-screen bg-violet-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-4">Teacher Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input input-bordered w-full" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input input-bordered w-full" required />
          <button type="submit" className="btn btn-primary w-full">Login</button>
        </form>
        <p className="text-center mt-4">Don't have an account? <a href="/teacherregister" className="text-violet-700 hover:underline">Register</a></p>
      </div>
    </div>
  );
};

export default TeacherLogin;