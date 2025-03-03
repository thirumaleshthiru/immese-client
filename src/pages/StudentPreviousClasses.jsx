import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { Video, BookOpen, Eye, Clock, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function StudentPreviousClasses() {
  const { id, token } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (id && token) {
      setLoading(true);
      axiosInstance
        .get(`/class/student/${id}/previous`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => setClasses(response.data))
        .catch((error) => console.error("Error fetching previous classes:", error))
        .finally(() => setLoading(false));
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 mb-2" />
        <p className="text-gray-600">Loading previous classes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Previous Classes</h1>
          <p className="mt-2 text-gray-600">Access your completed class recordings and materials</p>
        </div>

        {classes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <div
                key={cls.class_id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Video className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold text-gray-800">{cls.class_name}</h2>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{cls.teacher_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      to={`/vrpage/${cls.class_id}`}
                      className="flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      VR Mode
                    </Link>
                    
                    <Link
                      to={`/class/${cls.class_id}`}
                      className="flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Normal Mode
                    </Link>
                    
                    <Link
                      to={`/notes/${cls.class_id}`}
                      className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Notes
                    </Link>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Last accessed: {new Date(cls.class_start_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Video className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-800">No Previous Classes</h3>
            <p className="mt-1 text-gray-500">You haven't attended any classes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentPreviousClasses;