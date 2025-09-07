import mongoose from "mongoose";

// Define the Certificate Schema
const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (assuming you have one)
    required: true,
    description: "The ID of the user who received this certificate."
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the Course model (assuming you have one)
    required: true,
    description: "The ID of the course for which this certificate was issued."
  },
  issueDate: {
    type: Date,
    default: Date.now,
    required: true,
    description: "The date when the certificate was officially issued."
  },
  completionDate: {
    type: Date,
    default: Date.now,
    required: true,
    description: "The date when the user completed the course."
  },
  certificateId: {
    type: String,
    required: true,
    unique: true, // Ensures each certificate has a unique identifier
    description: "A unique identifier for the certificate, often a UUID or a custom generated string."
  },
  // You can add more fields as needed, e.g., 'instructorName', 'duration', 'grade', etc.
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  collection: 'certificates' // Explicitly name the collection in MongoDB
});

// Add a compound index to prevent duplicate certificates for the same user and course
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Create and export the Certificate model
const certificateModel = mongoose.model('Certificate', certificateSchema);

export default certificateModel;
