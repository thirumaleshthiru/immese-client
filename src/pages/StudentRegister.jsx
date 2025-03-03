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
    <div className="flex justify-center items-center min-h-screen bg-violet-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-violet-700 mb-4">Student Registration</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="student_name" placeholder="Full Name" value={formData.student_name} onChange={handleChange} className="input input-bordered w-full" required />
          
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input input-bordered w-full" required />
          
          <select name="student_branch" value={formData.student_branch} onChange={handleChange} className="select select-bordered w-full">
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

          <select name="student_year" value={formData.student_year} onChange={handleChange} className="select select-bordered w-full">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          
          <select name="student_section" value={formData.student_section} onChange={handleChange} className="select select-bordered w-full">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          
          <input type="text" name="student_rollno" placeholder="Roll Number" value={formData.student_rollno} onChange={handleChange} className="input input-bordered w-full" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input input-bordered w-full" required />
          <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>
        <p className="text-center mt-4">Already have an account? <a href="/studentlogin" className="text-violet-700 hover:underline">Login</a></p>
      </div>
    </div>
  );
};

export default StudentRegister;
