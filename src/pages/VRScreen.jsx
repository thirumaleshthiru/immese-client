import React, { useState, useEffect } from 'react';
import { Phone, Play, Pause, CheckCircle2, Loader2, UserCheck } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const VRVideoPlayer = () => {
  const { classId } = useParams();
  const { token, id } = useAuth();
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasWatched, setHasWatched] = useState(false);
  const [hasMarkedPresent, setHasMarkedPresent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(!token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    const checkOrientation = () => {
      // For mobile browsers that don't support window.orientation
      if (window.orientation !== undefined) {
        setIsLandscape(window.orientation === 90 || window.orientation === -90);
      } else {
        setIsLandscape(window.innerWidth > window.innerHeight);
      }
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkOrientation();
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

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
    // Control all videos on the page
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch(err => console.error("Error playing video:", err));
      }
    });
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnded = () => {
    setHasWatched(true);
    setIsPlaying(false);
  };

  const markAttendance = () => {
    if (classData) {
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
    }
  };

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-6">
        <Phone size={48} className="mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold mb-2">Please Use a Mobile Device</h1>
        <p className="text-center text-gray-400">
          This VR experience is optimized for mobile viewing.
          Please access this page from your smartphone for the best experience.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Loading VR experience...</p>
      </div>
    );
  }

  const showAttendanceButton = classData && !hasMarkedPresent;

  return (
    <div className="relative w-screen h-screen bg-black">
      {!isLandscape && (
        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white p-6 z-10">
          <div className="animate-pulse mb-4">
            <Phone size={48} className="transform rotate-90" />
          </div>
          <h2 className="text-xl font-bold mb-2">Rotate Your Device</h2>
          <p className="text-center text-gray-400">
            Please rotate your phone to landscape mode for VR view
          </p>
        </div>
      )}
      
      {videoUrl && (
        <>
          {/* Simple VR Container with two identical videos */}
          <div className={`w-full h-full flex ${!isLandscape ? 'opacity-0' : 'opacity-100'}`}>
            {/* Left side video */}
            <div className="w-1/2 h-full overflow-hidden">
              <video
                src={videoUrl}
                className="w-full h-full object-contain"
                autoPlay
                playsInline
                muted
                onEnded={handleVideoEnded}
              />
            </div>
            
            {/* Right side video - exact same video */}
            <div className="w-1/2 h-full overflow-hidden">
              <video
                src={videoUrl}
                className="w-full h-full object-contain"
                autoPlay
                playsInline
                muted
              />
            </div>
            
            {/* Center divider */}
            {isLandscape && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-full w-px bg-white bg-opacity-20 mx-auto" />
              </div>
            )}
          </div>

          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 ${!isLandscape ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg p-2">
              <button 
                onClick={handlePlayPause}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="text-sm">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="text-sm">Play</span>
                  </>
                )}
              </button>

              {hasMarkedPresent ? (
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Present</span>
                </div>
              ) : showAttendanceButton ? (
                <button
                  onClick={markAttendance}
                  disabled={!hasWatched}
                  className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                    hasWatched 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="text-sm">Present</span>
                </button>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VRVideoPlayer;