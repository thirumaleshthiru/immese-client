import React, { useState,useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../utils/AuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const CreateNotes = () => {
  const { token, id } = useAuth();
  const { class_id } = useParams();
  const [notesName, setNotesName] = useState("");
  const [notesDescription, setNotesDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
const navigate = useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/')
    }
  })
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("related_class", class_id);
      formData.append("note_by", id);
      formData.append("notes_name", notesName);
      formData.append("notes_description", notesDescription);
      if (file) formData.append("notes_url", file);

      const response = await axiosInstance.post("/teacher/notes/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message || "Notes created successfully");
      setNotesName("");
      setNotesDescription("");
      setFile(null);
    } catch (error) {
      setMessage("Error creating notes");
      console.error("Error creating notes", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-4">Create Notes</h2>
        {message && <p className="text-center text-green-600 font-medium">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Notes Name</label>
            <input
              type="text"
              value={notesName}
              onChange={(e) => setNotesName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              value={notesDescription}
              onChange={(e) => setNotesDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Upload File</label>
            <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded-lg" />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Create Notes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNotes;
