import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../utils/AuthContext";
import { Users, UserCheck, UserX, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ClassAttendance = () => {
  const { token } = useAuth();
  const { class_id } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/')
    }
  })
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axiosInstance.get(`/teacher/all-attendance/${class_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendance(response.data);
      } catch (error) {
        console.error("Error fetching attendance", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [class_id, token]);

  const totalStudents = attendance.length;
  const totalPresents = attendance.filter(student => student.is_present).length;
  const totalAbsents = totalStudents - totalPresents;
  const attendanceRate = totalStudents ? ((totalPresents / totalStudents) * 100).toFixed(1) : 0;
  const presentStudents = attendance.filter(student => student.is_present);
  const absentStudents = attendance.filter(student => !student.is_present);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Class Attendance Overview</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-base-content">
                <Users className="w-6 h-6" />
              </div>
              <div className="stat-title">Total Students</div>
              <div className="stat-value">{totalStudents}</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-success">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="stat-title text-success">Present</div>
              <div className="stat-value text-success">{totalPresents}</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-error">
                <UserX className="w-6 h-6" />
              </div>
              <div className="stat-title text-error">Absent</div>
              <div className="stat-value text-error">{totalAbsents}</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Percent className="w-6 h-6" />
              </div>
              <div className="stat-title text-primary">Attendance Rate</div>
              <div className="stat-value text-primary">{attendanceRate}%</div>
            </div>
          </div>
        </div>

        {/* Attendance Lists */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Present Students Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-success flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Present Students
              </h3>
              <div className="max-h-96 overflow-y-auto">
                {presentStudents.map(student => (
                  <div
                    key={student.student_id}
                    className="flex items-center p-3 hover:bg-base-200 rounded-lg transition-colors"
                  >
                    <div className="avatar placeholder mr-3">
                      <div className="bg-success text-success-content rounded-full w-8">
                        <span>{student.student_name.charAt(0)}</span>
                      </div>
                    </div>
                    <span>{student.student_rollno} - {student.student_name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Absent Students Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-error flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Absent Students
              </h3>
              <div className="max-h-96 overflow-y-auto">
                {absentStudents.map(student => (
                  <div
                    key={student.student_id}
                    className="flex items-center p-3 hover:bg-base-200 rounded-lg transition-colors"
                  >
                    <div className="avatar placeholder mr-3">
                      <div className="bg-error text-error-content rounded-full w-8">
                        <span>{student.student_name.charAt(0)}</span>
                      </div>
                    </div>
                    <span>{student.student_rollno} - {student.student_name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassAttendance;
