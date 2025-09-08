import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import Sidebar from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faImage } from "@fortawesome/free-solid-svg-icons";
import "./UpdateCourses.css";
import "./AddCourses.css";

const UpdateCourses = ({ setToken, token }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId } = location.state || {};
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [category, setCategory] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [notification, setNotification] = useState(null);

  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    if (courseId) {
      axios
        .get(`${backendUrl}/api/courses/${courseId}`)
        .then((res) => {
          setTitle(res.data.title);
          setInstructor(res.data.instructor);
          setCategory(res.data.category);
          setPlaylistUrl(res.data.playlistUrl);
          setDescription(res.data.description);

          console.log(res.data);
        })
        .catch(() => {
          setNotification({
            type: "error",
            message: "Failed to load course data",
          });
        });
    }
  }, [courseId]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("instructor", instructor);
      formData.append("category", category);
      formData.append("playlistUrl", playlistUrl);
      formData.append("description", description);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const response = await axios.put(
        backendUrl + `/api/courses/update/${courseId}`,
        formData,
        {
          headers: { token },
        }
      );

      if (response.status === 200) {
        showNotification("Course updated successfully!", "success");
        window.location.href = "/view";
      } else {
        showNotification("Failed to add course. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      showNotification("Failed to add course. Please try again.", "error");
    }
  };

  return (
    <>
      <Sidebar setToken={setToken} />
      <div className="dashboardUpdateCourse">
        <h1>Update Course</h1>
      </div>
      <form method="post" onSubmit={onSubmit}>
        <div className="rowTwoColumns">
          <div className="courseTitle">
            <label htmlFor="courseTitle">Course Title</label>
            <input
              type="text"
              id="courseTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course Title"
              required
            />
          </div>
          <div className="instructorName">
            <label htmlFor="instructorName">Instructor Name</label>
            <input
              type="text"
              id="instructorName"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="Instructor Name"
              required
            />
          </div>
        </div>
        <div className="categories">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
          />
        </div>
        <div className="youtubeUrl">
          <label htmlFor="youtubeUrl">YouTube Playlist URL</label>
          <input
            type="url"
            id="youtubeUrl"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            placeholder="YouTube Playlist URL"
            required
          />
        </div>
        <div className="description">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            cols="30"
            rows="10"
            placeholder="Course Description"
            required
          ></textarea>
        </div>
        <div className="image">
          <label>Course Thumbnail</label>
          <div className="image-inputs-row">
            <div className="image-input-container">
              <label htmlFor="thumbnail">
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Course Thumbnail"
                    className="uploaded-image"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faImage}
                    className="placeholder-icon"
                  />
                )}
                <input
                  type="file"
                  id="thumbnail"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="thumbnail"
                  hidden
                  required
                />
                <FontAwesomeIcon icon={faUpload} className="upload-icon" />
              </label>
            </div>
          </div>
        </div>
        <button type="submit">Update Course</button>
      </form>
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
};

export default UpdateCourses;
