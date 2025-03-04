import React, { useState, useEffect, useRef } from 'react';
import { Phone, Play, Pause, CheckCircle2, Loader2, UserCheck, Maximize, Minimize, X } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
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
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
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

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    try {
      if (!isFullscreen) {
        // Enter fullscreen with options to hide browser UI
        if (videoContainerRef.current.requestFullscreen) {
          videoContainerRef.current.requestFullscreen({ navigationUI: "hide" });
        } else if (videoContainerRef.current.webkitRequestFullscreen) {
          // Safari/iOS specific
          videoContainerRef.current.webkitRequestFullscreen({ navigationUI: "hide" });
          // For older iOS Safari versions
          if (document.body.webkitEnterFullscreen) {
            document.body.webkitEnterFullscreen();
          }
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
    <div ref={containerRef} className="relative w-screen h-screen bg-black overflow-hidden">
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
          <div 
            ref={videoContainerRef}
            className={`w-full h-full flex ${!isLandscape ? 'opacity-0' : 'opacity-100'}`}
            style={{
              background: '#000',
              position: isFullscreen ? 'absolute' : 'relative',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 5
            }}
          >
       
       {/* Left side video */}
<div className="w-1/2 h-full overflow-hidden">
  <video
    src={videoUrl}
    className="w-full h-full object-contain"
    autoPlay
    playsInline
    onEnded={handleVideoEnded}
  />
</div>

{/* Right side video - muted */}
<div className="w-1/2 h-full overflow-hidden">
  <video
    src={videoUrl}
    className="w-full h-full object-contain"
    autoPlay
    playsInline
    muted // Mute the right-side video
  />
</div>
            {/* Center divider */}
            {isLandscape && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-full w-px bg-white bg-opacity-20 mx-auto" />
              </div>
            )}

            {/* Always-visible exit button in fullscreen mode */}
            {isFullscreen && isLandscape && (
              <button 
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-50 flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
                style={{ opacity: 0.9 }}
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* Controls bar */}
          <div 
            className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 ${!isLandscape ? 'opacity-0' : 'opacity-100'} ${isFullscreen ? 'fullscreen-controls' : ''}`}
            style={{ 
              transition: 'opacity 0.3s',
              opacity: isFullscreen ? 0.9 : 1
            }}
          >
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

              <button 
                onClick={toggleFullscreen} 
                className="flex items-center space-x-2 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="w-4 h-4" />
                    <span className="text-sm">Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize className="w-4 h-4" />
                    <span className="text-sm">Fullscreen</span>
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
        </>
      )}
    </div>
  );
};

export default VRVideoPlayer;
