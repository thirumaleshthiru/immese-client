import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { Play, Pause, CheckCircle2, Loader2, Video, UserCheck, Maximize, Minimize, X } from 'lucide-react';

const NormalClass = () => {
  const { classId } = useParams();
  const { token, id } = useAuth();
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasWatched, setHasWatched] = useState(false);
  const [hasMarkedPresent, setHasMarkedPresent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
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

  useEffect(() => {
    // Track fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement
      );
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

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

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    try {
      if (!isFullscreen) {
        // Enter fullscreen with options to hide browser UI
        if (videoContainerRef.current.requestFullscreen) {
          videoContainerRef.current.requestFullscreen({ navigationUI: "hide" });
        } else if (videoContainerRef.current.webkitRequestFullscreen) {
          videoContainerRef.current.webkitRequestFullscreen({ navigationUI: "hide" });
        } else if (videoContainerRef.current.mozRequestFullScreen) {
          videoContainerRef.current.mozRequestFullScreen({ navigationUI: "hide" });
        } else if (videoContainerRef.current.msRequestFullscreen) {
          videoContainerRef.current.msRequestFullscreen({ navigationUI: "hide" });
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
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
          <div className="relative" ref={videoContainerRef}>
            <div className={`aspect-video bg-black rounded-t-lg overflow-hidden ${isFullscreen ? 'h-screen' : ''}`}>
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

            {/* Exit button in fullscreen mode */}
            {isFullscreen && (
              <button 
                onClick={toggleFullscreen}
                className="absolute top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
                style={{ opacity: 0.9 }}
              >
                <X size={20} />
              </button>
            )}

            {/* Fullscreen controls */}
            {isFullscreen && (
              <div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 fullscreen-controls"
                style={{ opacity: 0.9 }}
              >
                <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg p-2">
                  <button 
                    onClick={handlePlayPause}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
                          : 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                      <span>Mark Present</span>
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {!isFullscreen && (
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

                  <button 
                    onClick={toggleFullscreen} 
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                    <span>Fullscreen</span>
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
          )}
        </div>
      )}

      {/* Add a style tag for fullscreen-specific styles */}
      <style jsx>{`
        @media screen and (display-mode: fullscreen) {
          .fullscreen-controls {
            bottom: 20px;
            opacity: 0.9 !important;
          }
          
          /* Show controls on hover */
          .fullscreen-controls:hover {
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NormalClass;