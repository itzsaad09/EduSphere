import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import { backendUrl } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'N/A';
  }
};

function Dashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setIsLoading(true);
      setMessage('');
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          setMessage('You need to be logged in to view your dashboard.');
          setIsLoading(false);
          navigate("/signin");
          return;
        }

        const response = await axios.get(`${backendUrl}/api/enrollment/user/${userId}`, {
          headers: {
            token: token,
          }
        });

        let coursesData = [];
        if (Array.isArray(response.data.enrollments)) {
          coursesData = response.data.enrollments;
        } else if (Array.isArray(response.data.courses)) {
          coursesData = response.data.courses;
        } else if (Array.isArray(response.data.data)) {
          coursesData = response.data.data;
        } else {
          setMessage('Backend response format is unexpected. No courses found.');
        }

        const processedCourses = coursesData.map(enrollment => ({
          _id: enrollment._id,
          courseId: enrollment.courseId?._id,
          title: enrollment.courseId?.title || 'Unknown Course',
          instructor: enrollment.courseId?.instructor || 'Unknown Instructor',
          imageUrl: enrollment.courseId?.thumbnail,
          progress: enrollment.progress,
          lastAccessed: enrollment.lastAccessed,
        }));

        if (processedCourses.length > 0) {
          setEnrolledCourses(processedCourses);
          setMessage('');
        } else {
          setEnrolledCourses([]);
          setMessage('You haven\'t enrolled in any courses yet or no courses were found.');
        }

      } catch (error) {
        console.error("Error fetching enrolled courses:", error.response ? error.response.data : error.message);
        setMessage('Failed to load enrolled courses. Please ensure you are logged in and the backend is running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [backendUrl, navigate]);

  const handleContinueCourse = (courseId) => {
    if (courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      console.warn("Course ID is missing, cannot navigate.");
      setMessage("Cannot continue course: Course ID not available.");
    }
  };

  const handleViewCertificate = (courseId) => {
    const userId = localStorage.getItem('userId');
    if (userId && courseId) {
      // Navigate to the certificate route, passing IDs in the state object
      navigate('/certificate', { state: { userId, courseId } });
    } else {
      console.warn("User ID or Course ID is missing, cannot navigate to certificate.");
      setMessage("Cannot view certificate: Required information is missing.");
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Your Learning Dashboard</h1>
          <p className="dashboard-subtitle">
            Continue your journey and explore new courses.
          </p>
        </header>

        {isLoading ? (
          <div className="loading-message">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        ) : message ? (
          <div className="error-message">{message}</div>
        ) : enrolledCourses.length === 0 ? (
          <div className="empty-message">
            You haven't enrolled in any courses yet. Start your learning adventure!
          </div>
        ) : (
          <div className="courses-grid">
            {enrolledCourses.map((course, index) => (
              <div key={course._id} className="course-card" style={{ animationDelay: `${0.1 * index}s` }}>
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="course-card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x200/cccccc/333333?text=Course+Image`;
                  }}
                />
                <div className="course-card-content">
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-instructor">By {course.instructor}</p>
                  <div className="course-card-progress-bar-container">
                    <div
                      className="course-card-progress-bar"
                      style={{ width: `${course.progress || 0}%` }}
                      role="progressbar"
                      aria-valuenow={course.progress || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <p className="course-card-progress-text">Progress: {Math.round(course.progress || 0)}%</p>
                  <p className="course-card-last-accessed">Last Accessed: {formatDate(course.lastAccessed)}</p>

                  {course.progress === 100 ? (
                    <button
                      onClick={() => handleViewCertificate(course.courseId)}
                      className="view-certificate-button"
                    >
                      View Certificate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleContinueCourse(course.courseId)}
                      className="continue-course-button"
                    >
                      Continue Course
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;