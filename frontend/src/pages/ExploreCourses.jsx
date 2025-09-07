import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ExploreCourses.css";
import { backendUrl } from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function ExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("title-asc");
  const [allCategories, setAllCategories] = useState(["All"]);

  const [enrollmentMessage, setEnrollmentMessage] = useState("");
  const [isEnrollmentSuccess, setIsEnrollmentSuccess] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(null); // Tracks which course is being enrolled
  const [showPopup, setShowPopup] = useState(false); // New state for pop-up visibility

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await axios.get(`${backendUrl}/api/courses/all`);
      const fetchedCourses = response.data;
      setCourses(fetchedCourses);
      setFilteredCourses(fetchedCourses);

      const categoriesFromCourses = [
        ...new Set(fetchedCourses.map((course) => course.category)),
      ];
      setAllCategories(["All", ...categoriesFromCourses]);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage("Failed to load courses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    let currentCourses = [...courses];

    if (searchTerm) {
      currentCourses = currentCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      currentCourses = currentCourses.filter(
        (course) => course.category === categoryFilter
      );
    }

    currentCourses.sort((a, b) => {
      switch (sortOrder) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return (a.price || 0) - (b.price || 0); // Assuming price might exist
        case "price-desc":
          return (b.price || 0) - (a.price || 0); // Assuming price might exist
        case "rating-desc":
          // Assuming 'rating' is a numeric property
          // Ensure 'rating' is available or default to 0 for sorting
          const ratingA = a.rating !== undefined ? a.rating : 0;
          const ratingB = b.rating !== undefined ? b.rating : 0;
          return ratingB - ratingA;
        default:
          return 0;
      }
    });

    setFilteredCourses(currentCourses);
  }, [searchTerm, categoryFilter, sortOrder, courses]);

  // Handle course enrollment
  const handleEnrollCourse = async (e, courseId) => {
    e.preventDefault(); // Prevent the Link navigation from happening
    e.stopPropagation(); // Stop propagation to prevent card's Link from triggering

    setEnrollmentMessage("");
    setShowPopup(false); // Hide any existing pop-ups
    setIsEnrolling(courseId); // Set loading state for this specific course button

    const userId = localStorage.getItem("userId"); // Assuming userId is stored here
    const token = localStorage.getItem("token"); // Assuming JWT token is stored here

    if (!userId || !token) {
      setEnrollmentMessage("Please log in to enroll in courses.");
      setIsEnrollmentSuccess(false);
      setShowPopup(true);
      setIsEnrolling(null);
      // Optionally redirect to login page if user is not authenticated
      setTimeout(() => {
        window.location.href = "/signin"; // Redirect to login page
      }, 1500);
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/enrollment`,
        { userId, courseId },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.status === 201) {
        setEnrollmentMessage("Successfully enrolled in the course!");
        setIsEnrollmentSuccess(true);
        setShowPopup(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard"; // Navigate to user dashboard
        }, 1500);
      } else {
        setEnrollmentMessage(
          response.data.message ||
            "Failed to enroll in the course. Please try again."
        );
        setIsEnrollmentSuccess(false);
        setShowPopup(true);
      }
    } catch (error) {
      console.error(
        "Error enrolling in course:",
        error.response ? error.response.data : error.message
      );
      const errorMessage = error.response?.data?.message || "";
      if (errorMessage.includes("already enrolled")) {
        setEnrollmentMessage("You are already enrolled in this course.");
      } else {
        setEnrollmentMessage(
          "An error occurred during enrollment. Please try again."
        );
      }
      setIsEnrollmentSuccess(false);
      setShowPopup(true);
    } finally {
      setIsEnrolling(null); // Reset loading state for this course
    }
  };

  // Effect to hide the pop-up after 5 seconds
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
        setEnrollmentMessage(""); // Clear message after hiding
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  return (
    <>
      {/* Pop-up message component */}
      {showPopup && (
        <div
          className={`enrollment-popup ${
            isEnrollmentSuccess ? "success-popup" : "error-popup"
          }`}
        >
          {enrollmentMessage}
        </div>
      )}

      <div className="explore-courses-container">
        <header className="explore-header">
          <h1 className="explore-title">Explore Our Courses</h1>
          <p className="explore-subtitle">
            Discover a wide range of subjects and enhance your skills.
          </p>
        </header>

        {/* Filter and Sort Controls */}
        <div className="controls-bar">
          <div className="control-group">
            <label htmlFor="search">Search Courses:</label>
            <input
              type="text"
              id="search"
              className="search-input"
              placeholder="Search by title or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="control-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              className="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              {/* Add price options if your schema includes price */}
              <option value="rating-desc">Rating (High to Low)</option>
            </select>
          </div>
        </div>

        {/* --- Spinner Implementation --- */}
        {isLoading ? (
          <div className="loading-message">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          </div>
        ) : message ? (
          <div className="error-message">{message}</div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-message">
            No courses found matching your criteria. Try adjusting your filters.
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course, index) => (
              <Link
                to={`/courses/${course._id}`}
                key={course._id}
                className="course-card-link"
              >
                <div
                  className="course-card"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="course-card-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/400x250/cccccc/333333?text=Course+Image`;
                    }}
                  />
                  <div className="course-card-content">
                    <span className="course-card-category">
                      {course.category}
                    </span>
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-instructor">
                      By {course.instructor}
                    </p>
                    <p className="course-card-description">
                      {course.description}
                    </p>
                    <div className="course-card-footer">
                      <span className="course-card-rating">
                        ⭐ {course.rating?.toFixed(1) || "N/A"} (
                        {course.numReviews || 0} reviews)
                      </span>
                      <button
                        className="enroll-button"
                        onClick={(e) => handleEnrollCourse(e, course._id)}
                        disabled={isEnrolling === course._id} // Disable specific button during enrollment
                      >
                        {isEnrolling === course._id
                          ? "Enrolling..."
                          : "Enroll Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ExploreCourses;