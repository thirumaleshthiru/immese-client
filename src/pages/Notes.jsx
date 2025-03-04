import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";
import { Trash2, Download, FileText, ChevronLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const ManageNotes = () => {
  const { token, id } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
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
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`https://immsense-server-production.up.railway.app/teacher/notes/delete/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note.note_id !== noteId));
    } catch (error) {
      console.error("Error deleting note", error);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleBackClick = () => {
    setSelectedNote(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-200 font-medium">
            Loading
          </div>
        </div>
      </div>
    );
  }

  if (selectedNote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-6">
        <div className="max-w-4xl mx-auto bg-black bg-opacity-30 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-indigo-500 border-opacity-30">
          <div className="p-6">
            <button 
              onClick={handleBackClick}
              className="mb-4 flex items-center text-indigo-300 hover:text-white transition"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to all notes
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">{selectedNote.notes_name}</h2>
            </div>
            
            <div className="bg-black bg-opacity-50 p-6 rounded-lg border border-indigo-500 border-opacity-20">
              <div className="flex items-center justify-center p-10">
                <FileText className="w-24 h-24 text-indigo-400" />
              </div>
              
              <div className="mt-6 flex justify-center">
                <a
                  href={selectedNote.notes_url}
                  download
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full flex items-center hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Note
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="   rounded-xl shadow-2xl overflow-hidden border  ">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Class Notes
              </span>
            </h2>
            
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-indigo-400 opacity-50 mb-4" />
                <p className="text-indigo-300 text-lg">No notes available for this class</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.note_id}
                    className="group bg-black bg-opacity-50 rounded-lg border border-indigo-500 border-opacity-20 hover:border-opacity-50 transition overflow-hidden cursor-pointer"
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-600 rounded-full p-2">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-white group-hover:text-indigo-300 transition">
                          {note.notes_name}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                          <a
                          href={`https://immsense-server-production.up.railway.app${note.notes_url}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition transform hover:scale-110 shadow-lg"
                          onClick={(e) => e.stopPropagation()}
                          >
                          <Download className="h-4 w-4" />
                          </a>

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