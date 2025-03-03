import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useEffect } from "react";
import {
  BookOpen,
  ClipboardList,
  Sparkles,
  ChevronRight
} from "lucide-react";

const TeacherDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const menuItems = [
    {
      name: "Create Class",
      description: "Set up a new class and add course materials",
      path: "/createclass",
      icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
      color: "bg-indigo-900"
    },
    {
      name: "Manage Classes",
      description: "View and modify your existing classes",
      path: "/manageclasses",
      icon: <ClipboardList className="w-6 h-6 text-teal-400" />,
      color: "bg-teal-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute h-4 w-4 rounded-full bg-indigo-500 opacity-20 top-1/4 left-1/3 animate-pulse"></div>
          <div className="absolute h-6 w-6 rounded-full bg-teal-400 opacity-20 top-1/2 right-1/4 animate-pulse"></div>
          <div className="absolute h-3 w-3 rounded-full bg-purple-400 opacity-20 bottom-1/3 left-1/4 animate-pulse"></div>
        </div>
        
        <div className="text-center mb-12 relative">
          <Sparkles className="w-8 h-8 text-purple-300 mx-auto mb-4 animate-pulse" />
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-teal-300 mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-lg text-purple-300">
            Manage your classes and teaching materials
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-teal-400 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="transform transition duration-300 hover:scale-105 group"
            >
              <div className={`rounded-xl ${item.color} border border-gray-800 shadow-lg hover:shadow-2xl p-6 h-full backdrop-blur-sm bg-opacity-30 relative overflow-hidden`}>
                {/* Glowing accent */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-teal-400 opacity-30 blur-xl group-hover:opacity-50 transition-opacity"></div>
                
                <div className="flex items-start space-x-4 relative">
                  <div className="rounded-lg p-3 bg-black bg-opacity-30 border border-gray-700 shadow-lg">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-2 flex items-center">
                      {item.name}
                      <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h2>
                    <p className="text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;