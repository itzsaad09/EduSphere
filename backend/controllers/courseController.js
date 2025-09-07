import Course from "../models/courseModel.js"; // Adjust the path to your Course model
import axios from "axios"; // For making HTTP requests to external APIs
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Your YouTube Data API key

// Default image URL for thumbnails if none is uploaded
const DEFAULT_THUMBNAIL_URL = "https://res.cloudinary.com/dop0d5y5g/image/upload/v1690000000/no-image-available-icon-6_sx4q0n.png";

// Helper function to extract playlist ID from a YouTube URL
const getPlaylistIdFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const playlistId = urlObj.searchParams.get("list");
    return playlistId;
  } catch (error) {
    console.error("Error parsing playlist URL:", error);
    return null;
  }
};

// Helper function to convert ISO 8601 duration to seconds
// Example: PT1H30M5S -> 5405 seconds
function convertIsoToSeconds(isoDuration) {
  if (!isoDuration) return 0;
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) return 0;

  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

// @desc    Create a new course
// @route   POST /api/courses
// @access  Public (you might want to add authentication later)
const createCourse = async (req, res) => {
  try {
    // Thumbnail is now expected as a file, not from req.body
    const {
      category,
      title,
      instructor,
      description,
      rating,
      numReviews,
      enrollments,
      videos,
      playlistUrl,
    } = req.body;

    // Basic validation
    if (
      !category ||
      !title ||
      !instructor ||
      !description ||
      !playlistUrl
    ) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields (excluding thumbnail file)." });
    }

    let thumbnailUrl = DEFAULT_THUMBNAIL_URL; // Default thumbnail

    // If a thumbnail file is uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "course_thumbnails", // Specify a folder in Cloudinary
        resource_type: "image",
      });
      thumbnailUrl = result.secure_url;
    }

    const newCourse = new Course({
      thumbnail: thumbnailUrl, // Use the Cloudinary URL or default
      category,
      title,
      instructor,
      description,
      rating: rating || 0, // Default to 0 if not provided
      reviews: [],
      numReviews: numReviews || 0, // Default to 0 if not provided
      enrollments: enrollments || 0, // Default to 0 if not provided
      videos: videos || [], // Initialize with empty array or provided videos
      playlistUrl: playlistUrl || null, // Store playlist URL if provided
    });

    const savedCourse = await newCourse.save();

    // Optionally, trigger playlist fetching immediately if a playlistUrl is provided
    if (playlistUrl && YOUTUBE_API_KEY) {
      // We'll call this async, but don't await it to avoid blocking the response
      fetchPlaylistVideosInternal(savedCourse._id, playlistUrl);
    }

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Internal function to fetch videos (can be called by route or internally)
const fetchPlaylistVideosInternal = async (courseId, playlistUrl) => {
  if (!YOUTUBE_API_KEY) {
    console.error("YouTube API Key not configured.");
    return;
  }
  if (!playlistUrl) {
    console.error("No playlist URL provided for course:", courseId);
    return;
  }

  const playlistId = getPlaylistIdFromUrl(playlistUrl);
  if (!playlistId) {
    console.error("Could not extract playlist ID from URL:", playlistUrl);
    return;
  }

  let allVideos = [];
  let nextPageToken = null;

  try {
    do {
      // Step 1: Fetch playlist items (titles and video IDs)
      const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}${
        nextPageToken ? `&pageToken=${nextPageToken}` : ""
      }`;
      const playlistResponse = await axios.get(playlistItemsUrl);
      const items = playlistResponse.data.items;

      const videoIds = items
        .filter((item) => item.snippet.resourceId.kind === "youtube#video")
        .map((item) => item.snippet.resourceId.videoId);

      // Step 2: Fetch video details (including duration) for these video IDs
      if (videoIds.length > 0) {
        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds.join(
          ","
        )}&key=${YOUTUBE_API_KEY}`;
        const videoDetailsResponse = await axios.get(videoDetailsUrl);
        const videoDetails = videoDetailsResponse.data.items;

        const videosWithDuration = items
          .filter((item) => item.snippet.resourceId.kind === "youtube#video")
          .map((item) => {
            const detail = videoDetails.find(
              (vd) => vd.id === item.snippet.resourceId.videoId
            );
            return {
              title: item.snippet.title,
              url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
              // Extract duration and convert to seconds
              duration: detail
                ? convertIsoToSeconds(detail.contentDetails.duration)
                : 0,
            };
          });
        allVideos = allVideos.concat(videosWithDuration);
      }

      nextPageToken = playlistResponse.data.nextPageToken;
    } while (nextPageToken);

    const course = await Course.findById(courseId);
    if (course) {
      course.videos = allVideos;
      await course.save();
      console.log(
        `Successfully fetched and updated ${allVideos.length} videos with durations for course ${courseId}`
      );
    } else {
      console.log(`Course not found for ID: ${courseId}`);
    }
  } catch (error) {
    console.error(
      `Error fetching YouTube playlist for course ${courseId}:`,
      error.message
    );
    if (error.response) {
      console.error("YouTube API error response data:", error.response.data);
      if (error.response.status === 403) {
        console.error(
          "Possible reasons: Invalid API Key, API Key not enabled for YouTube Data API v3, or daily quota exceeded."
        );
      }
    }
  }
};

// @desc    Trigger fetching videos from a course's playlist URL
// @route   POST /api/courses/:id/fetch-playlist
// @access  Public (you might want to add authentication/authorization later)
const fetchPlaylistVideos = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!course.playlistUrl) {
      return res
        .status(400)
        .json({ message: "Course does not have a playlist URL." });
    }

    await fetchPlaylistVideosInternal(course._id, course.playlistUrl);

    res
      .status(200)
      .json({
        message:
          "Playlist videos fetching initiated. Check course for updates shortly.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during playlist fetch" });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Public (you might want to add authentication/authorization later)
const updateCourse = async (req, res) => {
  try {
    // thumbnail is now expected as a file if a new one is being uploaded
    const {
      category,
      title,
      instructor,
      description,
      rating,
      numReviews,
      enrollments,
      videos,
      playlistUrl,
    } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Handle thumbnail update if a new file is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "course_thumbnails",
        resource_type: "image",
      });
      course.thumbnail = result.secure_url; // Update with new Cloudinary URL
    }
    // If no new file, keep the existing thumbnail URL.
    // The frontend should only send a file if it's a new upload.

    course.category = category || course.category;
    course.title = title || course.title;
    course.instructor = instructor || course.instructor;
    course.description = description || course.description;
    course.rating = rating || course.rating;
    course.numReviews = numReviews || course.numReviews;
    course.enrollments = enrollments || course.enrollments;
    course.videos = videos || course.videos;
    course.playlistUrl = playlistUrl || course.playlistUrl; // Update playlistUrl
    course.updatedAt = Date.now(); // Update the updatedAt field

    const updatedCourse = await course.save();

    // Optionally, re-fetch playlist videos if playlistUrl was updated
    if (playlistUrl && playlistUrl !== course.playlistUrl && YOUTUBE_API_KEY) {
      fetchPlaylistVideosInternal(updatedCourse._id, playlistUrl);
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Public (you might want to add authentication/authorization later)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();
    res.status(200).json({ message: "Course removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  fetchPlaylistVideos,
};
