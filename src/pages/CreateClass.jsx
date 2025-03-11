import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import { UploadCloud, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateClass = () => {
  const { token, id } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });
  
  const [formData, setFormData] = useState({
    class_name: "",
    class_description: "",
    class_start_date: "",
    class_end_date: "",
    class_for_branch: "cse",
    class_for_year: "1",
    class_for_section: "A",
    class_video_url: null,
  });

  // Rest of the states remain the same
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [isRecording, setIsRecording] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'class_start_date' && formData.class_end_date && value > formData.class_end_date) {
      setFormData({
        ...formData,
        [name]: value,
        class_end_date: value
      });
      return;
    }
    
    if (name === 'class_end_date' && value < formData.class_start_date) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Rest of the functions remain exactly the same
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, class_video_url: file });
    setFileName(file ? file.name : "No file chosen");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const file = new File([blob], "recorded-video.webm", { type: "video/webm" });
        setFormData({ ...formData, class_video_url: file });
        setFileName("recorded-video.webm");
      };
      
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Error accessing camera and microphone: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setShowModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("class_by", id);

    try {
      await axiosInstance.post("/teacher/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Class created successfully!");
      setFormData({
        class_name: "",
        class_description: "",
        class_start_date: "",
        class_end_date: "",
        class_for_branch: "cse",
        class_for_year: "1",
        class_for_section: "A",
        class_video_url: null,
      });
      setFileName("No file chosen");
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-100 flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-violet-700 mb-6">Create Class</h2>
        {success && <p className="text-green-600 font-semibold">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="class_name" placeholder="Class Name" className="input input-bordered w-full" value={formData.class_name} onChange={handleChange} required />
          <textarea name="class_description" placeholder="Class Description" className="textarea textarea-bordered w-full" value={formData.class_description} onChange={handleChange} required></textarea>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Start Date and Time</span>
            </label>
            <input 
              type="datetime-local" 
              name="class_start_date" 
              className="input input-bordered w-full" 
              value={formData.class_start_date} 
              onChange={handleChange}
              min={getCurrentDateTime()}
              required 
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">End Date and Time</span>
            </label>
            <input 
              type="datetime-local" 
              name="class_end_date" 
              className="input input-bordered w-full" 
              value={formData.class_end_date}
              min={formData.class_start_date || getCurrentDateTime()}
              onChange={handleChange} 
              required 
            />
          </div>

          <select name="class_for_branch" className="select select-bordered w-full" value={formData.class_for_branch} onChange={handleChange}>
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
          <select name="class_for_year" className="select select-bordered w-full" value={formData.class_for_year} onChange={handleChange}>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          <select name="class_for_section" className="select select-bordered w-full" value={formData.class_for_section} onChange={handleChange}>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
          
          <div className="flex gap-2">
            <label className="flex-1 flex items-center space-x-2 cursor-pointer bg-violet-200 text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-300 transition">
              <UploadCloud size={24} />
              <span className="truncate">{fileName}</span>
              <input type="file" name="class_video_url" className="hidden" onChange={handleFileChange} accept="video/*" required={!formData.class_video_url} />
            </label>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-violet-200 text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-300 transition"
            >
              <Video size={24} />
              <span>Record</span>
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-full bg-violet-700 hover:bg-violet-800 text-white" disabled={loading}>
            {loading ? "Creating..." : "Create Class"}
          </button>
        </form>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Record Video</h3>
              <button
                onClick={() => {
                  if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                  }
                  setShowModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {stream && (
              <video
                autoPlay
                muted
                playsInline
                className="w-full h-96 bg-black rounded-lg mb-4"
                ref={video => {
                  if (video) {
                    video.srcObject = stream;
                  }
                }}
              />
            )}
            
            <div className="flex justify-center">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Stop Recording
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateClass;