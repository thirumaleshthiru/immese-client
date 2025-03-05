import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, PlayCircle, BarChart3 } from 'lucide-react';

const StudentDashboard = () => {
  const { id, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  })

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl font-bold text-indigo-900">
            Welcome to Your Learning Space
          </h1>
          <p className="text-lg text-indigo-600">
            Access your classes and track your progress
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <DashboardCard 
            title="Latest Classes" 
            link="/liveclass"
            icon={<PlayCircle className="w-8 h-8 mb-4 text-indigo-600" />}
            description="Join interactive latest sessions with your instructors"
          />
          <DashboardCard 
            title="Previous Classes" 
            link="/previousclass"
            icon={<BookOpen className="w-8 h-8 mb-4 text-indigo-600" />}
            description="Review past lessons and study materials"
          />
          <DashboardCard 
            title="Analytics" 
            link="/analytics"
            icon={<BarChart3 className="w-8 h-8 mb-4 text-indigo-600" />}
            description="Track your progress and performance metrics"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, link, icon, description }) => {
  return (
    <Link to={link}>
      <div className="h-full p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-indigo-100 hover:border-indigo-300 group">
        <div className="text-center">
          {icon}
          <h2 className="text-xl font-semibold text-indigo-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {title}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {description}
          </p>
          <span className="inline-block px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium group-hover:bg-indigo-200 transition-colors">
            Enter
          </span>
        </div>
      </div>
    </Link>
  );
};

export default StudentDashboard;
