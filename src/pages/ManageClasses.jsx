import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../utils/AuthContext";
import { Trash2, FilePlus, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageClasses = () => {
  const { token, id } = useAuth();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get(`/class/teacher/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, [id, token]);

  const handleDelete = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await axiosInstance.delete(`/teacher/delete/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(classes.filter((cls) => cls.class_id !== classId));
    } catch (error) {
      console.error("Error deleting class", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Manage Classes
          </h2>
          <Link 
            to="/createclass" 
            className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <FilePlus size={20} className="animate-pulse" />
            Create New Class
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          </Link>
        </div>

        {classes.length === 0 ? (
          <div className="bg-white bg-opacity-60 backdrop-blur-lg rounded-3xl p-12 text-center shadow-xl">
            <div className="mb-6">
              <FilePlus size={48} className="mx-auto text-indigo-600 animate-bounce" />
            </div>
            <p className="text-xl text-gray-700">
              No classes found. Start by creating your first class!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.class_id}
                className="group bg-white bg-opacity-60 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {cls.class_name}
                  </h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full group-hover:w-full transition-all duration-300" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    to={`/createnotes/${cls.class_id}`}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <FilePlus size={20} />
                    <span>Notes</span>
                  </Link>
                  <Link 
                    to={`/managenotes/${cls.class_id}`}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  >
                    <FileText size={20} />
                    <span>Manage</span>
                  </Link>
                  <Link 
                    to={`/classattendance/${cls.class_id}`}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                  >
                    <Users size={20} />
                    <span>Attendance</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(cls.class_id)}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={20} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClasses;