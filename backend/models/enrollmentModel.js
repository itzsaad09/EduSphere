import mongoose from "mongoose";

const enrollmentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the 'User' model (your registrationModel)
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // References the 'Course' model
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    completionStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
      required: true,
    },
    progress: {
      type: Number, // Percentage of course completed (0-100)
      default: 0,
      min: 0,
      max: 100,
      required: true,
    },
    lastAccessed: {
      type: Date, // Timestamp of the last time the user accessed this course
      default: Date.now,
    },
    // Field to track the last video/lesson watched
    lastLessonWatched: {
      type: String, // You can store the video title, a lesson ID, or a URL segment
      default: null, // Default to null if no lesson has been watched yet
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Add a unique compound index to prevent a user from enrolling in the same course twice
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const enrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

export default enrollmentModel;
