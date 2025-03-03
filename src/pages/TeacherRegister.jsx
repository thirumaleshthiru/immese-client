import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    teacher_name: "",
    teacher_role: "",
    password: "",
    email : ""
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
        alert("Teacher Registered suceess!")
        navigate("/teacherlogin");
      }
    } catch (err) {
       
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-violet-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-4">Teacher Registration</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="teacher_name" placeholder="Full Name" value={formData.teacher_name} onChange={handleChange} className="input input-bordered w-full" required />
          <input type="text" name="teacher_role" placeholder="Role" value={formData.teacher_role} onChange={handleChange} className="input input-bordered w-full" required />
          <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input input-bordered w-full" required />

          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input input-bordered w-full" required />
          <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>
        <p className="text-center mt-4">Already have an account? <a href="/teacherlogin" className="text-violet-700 hover:underline">Login</a></p>
      </div>
    </div>
  );
};

export default TeacherRegister;