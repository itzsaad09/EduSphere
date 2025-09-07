import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import './CoursePlayer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

// Helper function to format duration from seconds to HH:MM:SS
const formatDuration = (totalSeconds) => {
  if (totalSeconds === 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(minutes)}:${pad(seconds)}`;
  }
};

// Helper function to get the YouTube video ID from a URL
const getYouTubeVideoId = (url) => {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

function CourseDetails() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [courseProgress, setCourseProgress] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showCertificateButton, setShowCertificateButton] = useState(false);
  const [isCurrentVideoWatchedEnough, setIsCurrentVideoWatchedEnough] = useState(false);

  const playerRef = useRef(null);
  const watchedVideoIndicesRef = useRef(new Set());

  const updateBackendProgress = useCallback(async (newProgress, newLastLessonWatched, newCompletionStatus = 'In Progress') => {
    if (!enrollmentDetails || !enrollmentDetails._id) {
      console.warn("Cannot update backend progress: Enrollment details not available.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = "/signin";
        return;
      }
      const payload = {
        progress: Math.min(100, Math.max(0, newProgress)),
        lastAccessed: new Date(),
        lastLessonWatched: newLastLessonWatched,
        completionStatus: newCompletionStatus,
      };
      const response = await axios.put(
        `${backendUrl}/api/enrollment/${enrollmentDetails._id}`,
        payload,
        {
          headers: { token: token },
        }
      );
      if (response.status === 200) {
        setEnrollmentDetails(response.data.enrollment);
        setCourseProgress(response.data.enrollment.progress);
        console.log("Backend progress updated successfully:", response.data.enrollment.progress);
      } else {
        console.error("Failed to update enrollment progress:", response.data);
      }
    } catch (err) {
      console.error("Error updating enrollment progress:", err.response ? err.response.data : err.message);
    }
  }, [backendUrl, enrollmentDetails]);

  const handleNextVideoAndProgress = useCallback(async () => {
    if (!course || !course.videos) return;

    // Unconditionally mark the current video as watched. This is the fix.
    watchedVideoIndicesRef.current.add(currentVideoIndex);

    // Check if this is the last video in the course to ensure a 100% progress update.
    if (currentVideoIndex === course.videos.length - 1) {
      const lastVideoTitle = course.videos[currentVideoIndex]?.title || 'Unknown Lesson';
      await updateBackendProgress(100, lastVideoTitle, 'Completed');
    } else {
      // For all other videos, calculate progress and update.
      const totalVideos = course.videos.length;
      const newOverallProgress = (watchedVideoIndicesRef.current.size / totalVideos) * 100;
      const nextVideoTitle = course.videos[currentVideoIndex + 1]?.title || 'Unknown Lesson';
      await updateBackendProgress(newOverallProgress, nextVideoTitle, 'In Progress');
    }

    // Automatically move to the next video if one exists.
    if (currentVideoIndex < course.videos.length - 1) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
    }
  }, [course, currentVideoIndex, updateBackendProgress]);

  const onPlayerStateChange = useCallback((event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      console.log(`Video ${currentVideoIndex + 1} has finished playing.`);
      handleNextVideoAndProgress();
    }
  }, [currentVideoIndex, course, handleNextVideoAndProgress]);

  // New useEffect to handle certificate generation
  useEffect(() => {
    const generateCertificate = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        console.error('Not authorized to generate certificate.');
        return;
      }
      try {
        const response = await axios.post(`${backendUrl}/api/certificate/generate`, {
          userId: userId,
          courseId: courseId
        }, {
          headers: { token: token },
        });

        if (response.status === 200) {
          console.log(response.data.message);
          setShowCertificateButton(true);
        }
      } catch (err) {
        console.error("Error generating certificate:", err.response ? err.response.data : err.message);
      }
    };
    
    // Check if progress is 100% and completion status is 'completed'
    if (enrollmentDetails && enrollmentDetails.progress === 100 && enrollmentDetails.completionStatus === 'Completed') {
      generateCertificate();
    }
  }, [enrollmentDetails, courseId, backendUrl]);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
          setError('You need to be logged in to view course details.');
          setIsLoading(false);
          window.location.href = "/signin";
          return;
        }
        const courseResponse = await axios.get(`${backendUrl}/api/courses/${courseId}`);
        const fetchedCourse = courseResponse.data;
        setCourse(fetchedCourse);
        const enrollmentResponse = await axios.get(`${backendUrl}/api/enrollment/user/${userId}`, {
          headers: { token: token },
        });
        const foundEnrollment = enrollmentResponse.data.enrollments?.find(
          (enroll) => enroll.courseId?._id === courseId
        );
        if (foundEnrollment) {
          setEnrollmentDetails(foundEnrollment);
          setIsEnrolled(true);
          setCourseProgress(foundEnrollment.progress);
          if (foundEnrollment.completionStatus === 'Completed') {
            setShowCertificateButton(true);
          }
          if (fetchedCourse.videos && fetchedCourse.videos.length > 0) {
            let initialVideoIndex = 0;
            if (foundEnrollment.lastLessonWatched) {
              const lastWatchedVideoIndex = fetchedCourse.videos.findIndex(
                (video) => video.title === foundEnrollment.lastLessonWatched
              );
              if (lastWatchedVideoIndex !== -1) {
                initialVideoIndex = lastWatchedVideoIndex;
              }
            }
            setCurrentVideoIndex(initialVideoIndex);
            watchedVideoIndicesRef.current.clear();
            const numVideosToMarkWatched = Math.floor((foundEnrollment.progress / 100) * fetchedCourse.videos.length);
            for (let i = 0; i < numVideosToMarkWatched; i++) {
              watchedVideoIndicesRef.current.add(i);
            }
            if (initialVideoIndex < numVideosToMarkWatched && !watchedVideoIndicesRef.current.has(initialVideoIndex)) {
              watchedVideoIndicesRef.current.add(initialVideoIndex);
            }
            setIsCurrentVideoWatchedEnough(watchedVideoIndicesRef.current.has(initialVideoIndex));
          } else {
            watchedVideoIndicesRef.current.clear();
          }
        } else {
          setIsEnrolled(false);
          setError('You are not enrolled in this course. Please enroll to view content.');
        }
      } catch (err) {
        setError('Failed to load course details or enrollment status. Please try again.');
        setIsEnrolled(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseAndEnrollment();
  }, [courseId, backendUrl]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    const currentVideo = course?.videos?.[currentVideoIndex];
    if (currentVideo && window.YT && window.YT.Player) {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      const videoId = getYouTubeVideoId(currentVideo.url);
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          'autoplay': 1,
          'controls': 1,
          'modestbranding': 1,
          'rel': 0
        },
        events: {
          'onReady': (e) => e.target.playVideo(),
          'onStateChange': onPlayerStateChange,
        },
      });
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [course, currentVideoIndex, onPlayerStateChange]);

  const handleNextVideo = () => {
    // New logic: Check if the current video has been watched before allowing navigation
    if (watchedVideoIndicesRef.current.has(currentVideoIndex) && currentVideoIndex < course.videos.length - 1) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleSidebarVideoClick = (index) => {
    // New logic: Only allow navigation if the clicked video is before or equal to the last watched video.
    const lastWatchedIndex = Array.from(watchedVideoIndicesRef.current).pop();
    if (index <= lastWatchedIndex || index === 0) {
      setCurrentVideoIndex(index);
    } else {
      // Create a simple modal or message box instead of alert()
      const message = "Please watch the previous videos before skipping ahead!";
      // You can implement your own modal here, for now, we'll log to console.
      console.log(message);
    }
  };

  const isNextButtonDisabled = !watchedVideoIndicesRef.current.has(currentVideoIndex) || currentVideoIndex === (course?.videos?.length - 1);
  const isSidebarItemClickable = (index) => {
    const lastWatchedIndex = Array.from(watchedVideoIndicesRef.current).pop();
    return index <= lastWatchedIndex || index === 0;
  };

  if (isLoading) {
    return <div className="course-detail-container loading">
        <FontAwesomeIcon icon={faSpinner} spin />
    </div>;
  }
  if (error) {
    return <div className="course-detail-container error">{error}</div>;
  }
  if (!course) {
    return <div className="course-detail-container not-found">Course not found.</div>;
  }
  if (!isEnrolled) {
    return <div className="course-detail-container not-enrolled">
      <h2>Access Denied</h2>
      <p>You are not enrolled in this course. Please enroll to view its content.</p>
    </div>;
  }

  const currentVideo = course.videos && course.videos.length > 0 ? course.videos[currentVideoIndex] : null;

  const handleViewCertificate = (courseId) => {
    const userId = localStorage.getItem('userId');
    if(userId && courseId) {
      // Navigate to the certificate route, passing IDs in the state object
      // navigate('/certificate', { state: { userId, courseId } });
      console.log("Navigating to certificate for user ID:", userId, "and course ID:", courseId);
    } else {
      console.warn("User ID or Course ID is missing, cannot navigate to certificate.");
      setMessage("Cannot view certificate: Required information is missing.");
    }
  }

  return (
    <div className="course-detail-container">
      {course.videos && course.videos.length > 0 ? (
        <div className="course-content-layout">
          <div className="video-player-section">
            <div className="video-player-wrapper">
              {currentVideo ? (
                <>
                  <div id="youtube-player" className="youtube-video-iframe"></div>
                  <h3 className="current-video-title">
                    {currentVideoIndex + 1}. {currentVideo.title}
                  </h3>
                </>
              ) : (
                <p className="no-videos-message">No videos available in this playlist.</p>
              )}
            </div>
            <div className="course-progress-bar-container">
              <div className="progress-text">
                Course Progress: {courseProgress.toFixed(0)}%
              </div>
              <div className="progress-bar-background">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${courseProgress}%` }}
                  role="progressbar"
                  aria-valuenow={courseProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            {showCertificateButton && enrollmentDetails &&(
              <Link 
                to={{
                  pathname: "/certificate",
                  state: {
                    userId: enrollmentDetails.userId,
                    courseId: enrollmentDetails.courseId._id
                  },
                }}
                className="view-certificate-button"
              >
                View Certificate
              </Link>
            )}
            {course.videos.length > 1 && (
              <div className="video-navigation-controls">
                <button
                  onClick={handlePrevVideo}
                  disabled={currentVideoIndex === 0}
                  className="nav-button prev-button"
                >
                  Previous
                </button>
                <span className="video-counter">
                  {currentVideoIndex + 1} / {course.videos.length}
                </span>
                <button
                  onClick={handleNextVideo}
                  disabled={isNextButtonDisabled}
                  className="nav-button next-button"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <div className="sidebar">
            <h3 className="sidebar-title">Course Content</h3>
            <ul className="video-list">
              {course.videos.map((video, index) => (
                <li
                  key={index}
                  className={`video-list-item ${watchedVideoIndicesRef.current.has(index) ? 'watched' : 'unwatched'} ${index === currentVideoIndex ? 'active' : ''} ${!isSidebarItemClickable(index) ? 'disabled' : ''}`}
                  onClick={() => handleSidebarVideoClick(index)}
                >
                  {watchedVideoIndicesRef.current.has(index) && (
                    <FontAwesomeIcon icon={faCheckCircle} className="watched-icon" />
                  )}
                  <span className="video-title">
                    {index + 1}. {video.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="no-videos-message">No videos available for this course yet.</p>
      )}
    </div>
  );
}

export default CourseDetails;
