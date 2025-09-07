import Enrollment from "../models/enrollmentModel.js";
import User from "../models/registrationModel.js";
import Course from "../models/courseModel.js";

// Controller for enrolling a user in a course
const enrollUserInCourse = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    if (!userId || !courseId) {
      return res.status(400).json({
        message: "User ID and Course ID are required for enrollment.",
      });
    }

    const userExists = await User.findById(userId);
    const courseExists = await Course.findById(courseId);

    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found." });
    }

    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in this course." });
    }

    const newEnrollment = new Enrollment({
      userId,
      courseId,
    });

    const createdEnrollment = await newEnrollment.save();

    res.status(201).json({
      message: "User successfully enrolled in the course.",
      enrollment: createdEnrollment,
    });
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    res.status(500).json({
      message: "Server error during enrollment.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all enrollments for a specific user
 * @route   GET /api/enrollments/user/:userId
 * @access  Private (e.g., User, Admin, requires authentication)
 * @param {string} req.params.userId - The ID of the user whose enrollments to retrieve.
 */

// Controller for getting all enrollments for a specific user
const getUserEnrollments = async (req, res) => {
  const { userId } = req.params;

  try {
    const enrollments = await Enrollment.find({ userId })
      .populate("courseId", "title instructor thumbnail")
      .sort({ enrollmentDate: -1 });

    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "No enrollments found for this user." });
    }

    res.status(200).json({
      message: "User enrollments retrieved successfully.",
      enrollments,
    });
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    res.status(500).json({
      message: "Server error fetching enrollments.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all enrollments for a specific course
 * @route   GET /api/enrollments/course/:courseId
 * @access  Private (e.g., Instructor, Admin, requires authentication)
 * @param {string} req.params.courseId - The ID of the course whose enrollments to retrieve.
 */
// Controller for getting all enrollments for a specific course
const getCourseEnrollments = async (req, res) => {
  const { courseId } = req.params;

  try {
    const enrollments = await Enrollment.find({ courseId })
      .populate("userId", "fname lname email")
      .sort({ enrollmentDate: 1 });

    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "No enrollments found for this course." });
    }

    res.status(200).json({
      message: "Course enrollments retrieved successfully.",
      enrollments,
    });
  } catch (error) {
    console.error("Error fetching course enrollments:", error);
    res.status(500).json({
      message: "Server error fetching enrollments.",
      error: error.message,
    });
  }
};

/**
 * @desc    Update an existing enrollment record (e.g., progress, status, lastLessonWatched)
 * @route   PUT /api/enrollments/:id
 * @access  Private (e.g., User for self-progress, Admin for any)
 * @param {string} req.params.id - The ID of the enrollment record to update.
 * @param {number} [req.body.progress] - The new progress percentage (0-100).
 * @param {string} [req.body.completionStatus] - The new completion status ("Not Started", "In Progress", "Completed").
 * @param {string} [req.body.lastLessonWatched] - The identifier for the last lesson watched.
 */
// Controller for updating an enrollment
const updateEnrollment = async (req, res) => {
  const { id } = req.params;
  const { progress, completionStatus, lastLessonWatched } = req.body;

  try {
    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment record not found." });
    }

    if (progress !== undefined) {
      if (typeof progress !== "number" || progress < 0 || progress > 100) {
        return res
          .status(400)
          .json({ message: "Progress must be a number between 0 and 100." });
      }
      enrollment.progress = progress;

      if (progress === 100) {
        enrollment.completionStatus = "Completed";
      } else if (
        progress > 0 &&
        enrollment.completionStatus === "Not Started"
      ) {
        enrollment.completionStatus = "In Progress";
      }
    }

    if (completionStatus) {
      const validStatuses = ["Not Started", "In Progress", "Completed"];
      if (!validStatuses.includes(completionStatus)) {
        return res.status(400).json({
          message: `Invalid completion status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }
      enrollment.completionStatus = completionStatus;
    }

    if (lastLessonWatched !== undefined) {
      enrollment.lastLessonWatched = lastLessonWatched;
    }

    enrollment.lastAccessed = Date.now();

    const updatedEnrollment = await enrollment.save();

    res.status(200).json({
      message: "Enrollment updated successfully.",
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    res.status(500).json({
      message: "Server error updating enrollment.",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete an enrollment record
 * @route   DELETE /api/enrollments/:id
 * @access  Private (e.g., Admin, or User to unenroll, requires authentication)
 * @param {string} req.params.id - The ID of the enrollment record to delete.
 */
// Controller for deleting an enrollment
const deleteEnrollment = async (req, res) => {
  const { id } = req.params;

  try {
    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment record not found." });
    }

    await Enrollment.deleteOne({ _id: id });

    res
      .status(200)
      .json({ message: "Enrollment record removed successfully." });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    res.status(500).json({
      message: "Server error deleting enrollment.",
      error: error.message,
    });
  }
};

export {
  enrollUserInCourse,
  getUserEnrollments,
  getCourseEnrollments,
  updateEnrollment,
  deleteEnrollment,
};
