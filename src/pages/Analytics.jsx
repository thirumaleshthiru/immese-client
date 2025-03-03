import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { Loader2, UserCheck, CalendarDays, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Analytics = () => {
  const { id, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/')
    }
  })
  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/student/statistics/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
        <p className="text-gray-600">Loading your statistics...</p>
      </div>
    );
  }

  const attendancePercentage = parseFloat(stats?.percentage || 0);
  const getAttendanceStatus = (percentage) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Attendance Analytics</h1>
      <p className="text-gray-500">Track your class attendance and performance metrics</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Attendance Percentage Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Attendance Percentage
            </h3>
            <LineChart className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${getAttendanceStatus(attendancePercentage)}`}>
              {stats?.percentage}%
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(attendancePercentage)}`}
                style={{ width: `${attendancePercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Minimum required: 75%
            </p>
          </div>
        </div>

        {/* Classes Attended Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Classes Attended
            </h3>
            <UserCheck className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-800">
              {stats?.total_classes_attended}
            </div>
            <p className="text-xs text-gray-500">
              Out of {stats?.total_actual_classes} total classes
            </p>
          </div>
        </div>

        {/* Classes Missed Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Classes Missed
            </h3>
            <CalendarDays className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-800">
              {stats?.total_actual_classes - stats?.total_classes_attended}
            </div>
            <p className="text-xs text-gray-500">
              Classes requiring makeup
            </p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-3 rounded-full ${getProgressColor(attendancePercentage)}`} />
          <div>
            <p className="font-medium text-gray-800">Attendance Status</p>
            {attendancePercentage >= 75 ? (
              <p className="text-sm text-gray-500">
                Great job! Your attendance is above the required minimum.
              </p>
            ) : attendancePercentage >= 60 ? (
              <p className="text-sm text-gray-500">
                Warning: Your attendance is below the required minimum. Try to attend more classes.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Critical: Your attendance is significantly below the minimum requirement. Please consult with your advisor.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;