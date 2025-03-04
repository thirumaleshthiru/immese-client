import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { Play, Pause, CheckCircle2, Loader2, Video, UserCheck } from 'lucide-react';

const NormalClass = () => {
  const { classId } = useParams();
  const { token, id } = useAuth();
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasWatched, setHasWatched] = useState(false);
  const [hasMarkedPresent, setHasMarkedPresent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [videoRef] = useState(React.createRef());
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const attendanceKey = `attendance_${id}_${classId}`;
    const wasPresent = localStorage.getItem(attendanceKey);
    if (wasPresent) {
      setHasMarkedPresent(true);
    }

    setIsLoading(true);
    axiosInstance
      .get(`/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setClassData(response.data);
        setVideoUrl(`https://immsense-server-production.up.railway.app${response.data.class_video_url}`);
      })
      .catch((error) => console.error("Error fetching class video:", error))
      .finally(() => setIsLoading(false));
  }, [classId, token, id]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setHasWatched(true);
    setIsPlaying(false);
  };

  const markAttendance = () => {
    axiosInstance
      .post('/student/attendance', {
        student_id: id,
        class_id: classId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        const attendanceKey = `attendance_${id}_${classId}`;
        localStorage.setItem(attendanceKey, 'true');
        setHasMarkedPresent(true);
      })
      .catch((error) => console.error("Error marking attendance:", error));
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
        <p className="text-gray-600">Loading class content...</p>
      </div>
    );
  }

  // Determine if attendance can be marked
  const showAttendanceButton = classData && !hasMarkedPresent;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      {videoUrl && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
              <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              autoPlay
              playsInline

              onEnded={handleVideoEnded}

              /> 
 

            </div>
            
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full px-3 py-1 flex items-center space-x-2">
              <Video className="w-4 h-4 text-white" />
              <span className="text-white text-sm">
                {hasWatched ? 'Completed' : 'Watching'}
              </span>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handlePlayPause}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                {hasMarkedPresent ? (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Marked Present</span>
                  </div>
                ) : showAttendanceButton ? (
                  <button
                    onClick={markAttendance}
                    disabled={!hasWatched}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      hasWatched 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>Mark Present</span>
                  </button>
                ) : null}
              </div>

              {hasWatched && (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  <span className="text-sm">Video Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NormalClass;
