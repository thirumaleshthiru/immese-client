import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { Video, BookOpen, Eye, Clock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function StudentLiveClasses() {
  const { id, token } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (id && token) {
      axiosInstance
        .get(`/class/student/${id}/live`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setClasses(response.data);
          setLoading(false); // Stop loading after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching live classes:", error);
          setLoading(false); // Stop loading even if there's an error
        });
    }
  }, [id, token]);

  return (
    <div className="min-h-screen   py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
            Latest Classes
          </h1>
          <p className="text-lg text-indigo-600">
            Join your interactive learning sessions
          </p>
        </div>

        {loading ? ( // Show spinner while loading
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <div
                  key={cls.class_id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-indigo-100"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-indigo-900 mb-2">
                          {cls.class_name}
                        </h2>
                        <div className="flex items-center text-gray-600 mb-4">
                          <User size={16} className="mr-2" />
                          <span className="text-sm">Instructor: {cls.teacher_name}</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                        <Clock size={14} className="text-green-600 mr-1" />
                        <span className="text-sm font-medium text-green-600">Latest Now</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link
                        to={`/vrpage/${cls.class_id}`}
                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Eye size={18} className="mr-2" />
                        VR Mode
                      </Link>
                      <Link
                        to={`/class/${cls.class_id}`}
                        className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Video size={18} className="mr-2" />
                        Normal Mode
                      </Link>
                      <Link
                        to={`/notes/${cls.class_id}`}
                        className="flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        <BookOpen size={18} className="mr-2" />
                        Notes
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <Video size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No live classes are currently available.</p>
                <p className="text-gray-500 text-sm mt-2">Check back later for upcoming sessions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentLiveClasses;
