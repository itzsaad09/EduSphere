import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import "./ViewCourses.css";
import { backendUrl } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function ViewCourses({ setToken, token }) {
  const [listItems, setListItems] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [notification, setNotification] = useState(null);
  const [coursesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/courses/all");
      console.log(response.data);
      const courses = response.data || [];
      
      const sortedCourses = courses.sort((a, b) => a.title.localeCompare(b.title));
      setAllCourses(sortedCourses);
      setListItems(sortedCourses.slice(0, coursesPerPage));
      setHasMore(sortedCourses.length > coursesPerPage);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showNotification("Failed to fetch courses. Please try again.", "error");
    }
  };

  useEffect(() => {
    fetchList();
  }, [token]);

  const loadMore = () => {
    const nextItem = currentPage * coursesPerPage;
    const newItems = allCourses.slice(nextItem, nextItem + coursesPerPage);
    if (newItems.length > 0) {
      setListItems((prevItems) => [...prevItems, ...newItems]);
      setCurrentPage((prevPage) => prevPage + 1);
      if (allCourses.length <= nextItem + coursesPerPage) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await axios.delete(
          backendUrl + `/api/courses/delete/${id}`,
          { headers: { token } }
        );
        if (response.status === 200) {
          showNotification("Course deleted successfully!", "success");
          fetchList();
        } else {
          showNotification("Failed to delete course. Please try again.", "error");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        showNotification("Failed to delete course. Please try again.", "error");
      }
    }
  };

  const editCourse = (id) => {
    navigate(`/editcourse/${id}`);
  };

  return (
    <>
      <Sidebar setToken={setToken} />
      <div className="main-content">
        <div className="dashboardViewCourse">
          <h1>View Courses</h1>
        </div>
        <div className="course-list">
          {listItems.length > 0 ? (
            listItems.map((course) => (
              <div key={course._id} className="course-card">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="course-image"
                />
                <div className="course-details">
                  <h2>{course.title}</h2>
                  <p>
                    Instructor: {course.instructor}
                  </p>
                  <p>
                    Category: {course.category}
                  </p>
                </div>
                <div className="course-actions">
                  <button
                    onClick={() => editCourse(course._id)}
                    className="edit-icon"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    className="delete-icon"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No courses found. Please add new courses.</p>
          )}
        </div>

        {hasMore && (
          <div className="load-more-container">
            <button onClick={loadMore} className="load-more-button">
              Load More
            </button>
          </div>
        )}
      </div>

      {notification && (
        <ul className="notifications">
          <li className={`notification-item ${notification.type}`}>
            <div className="notification-content">
              <div className="notification-icon" aria-hidden="true">
                {notification.type === "success" ? (
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-8.67"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                )}
              </div>
              <div className="notification-text">{notification.message}</div>
              <button
                onClick={dismissNotification}
                className="notification-icon notification-close"
                aria-label="Dismiss notification"
                type="button"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="notification-progress-bar" />
          </li>
        </ul>
      )}
    </>
  );
}

export default ViewCourses;