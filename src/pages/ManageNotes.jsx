import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";
import { Trash2, Download, FileText, Shield } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const ManageNotes = () => {
  const { token, id } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { class_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`https://immsense-server-production.up.railway.app/notes/class/${class_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [class_id, token]);

  const handleDelete = async (noteId) => {
    try {
      await axios.delete(`https://immsense-server-production.up.railway.app/teacher/notes/delete/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note.note_id !== noteId));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting note", error);
    }
  };

  const confirmDeleteHandler = (noteId) => {
    setConfirmDelete(noteId);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-blue-200 font-medium">
            Loading
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-blue-500 border-opacity-30">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Manage Notes
              </span>
            </h2>
            
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-blue-400 opacity-50 mb-4" />
                <p className="text-blue-300 text-lg">No notes available for this class</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.note_id}
                    className="group bg-black bg-opacity-50 rounded-lg border border-blue-500 border-opacity-20 hover:border-opacity-50 transition overflow-hidden"
                  >
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 rounded-full p-2">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-white group-hover:text-blue-300 transition">
                          {note.notes_name}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <a
                          href={`https://immsense-server-production.up.railway.app${note.notes_url}`}
                          download
                          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition transform hover:scale-110 shadow-lg"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                        
                        {confirmDelete === note.note_id ? (
                          <div className="flex space-x-2 items-center">
                            <button
                              onClick={() => handleDelete(note.note_id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-500 transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="bg-gray-600 text-white px-3 py-1 rounded-full hover:bg-gray-500 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => confirmDeleteHandler(note.note_id)}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-500 transition transform hover:scale-110 shadow-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      
      </div>
    </div>
  );
};

export default ManageNotes;