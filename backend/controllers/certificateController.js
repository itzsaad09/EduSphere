import Certificate from '../models/certificateModel.js';
import Enrollment from '../models/enrollmentModel.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Handles the logic for automatically generating a certificate for a user.
 * This function should be called when a user's course completion status is updated to 'completed' in the Enrollment model.
 * @param {string} userId - The unique ID of the user.
 * @param {string} courseId - The unique ID of the course.
 * @returns {Promise<Object>} - A promise that resolves with the generated certificate object or an error message.
 */
export const generateCertificate = async (userId, courseId) => {
  try {
    // 1. Find the specific enrollment record for the user and course.
    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment) {
      return { success: false, message: 'Enrollment record not found.' };
    }

    // 2. Check the completion status from the enrollment record.
    if (enrollment.completionStatus !== 'Completed') {
      return { success: false, message: 'Course has not been completed yet.' };
    }

    // 3. Check for an existing certificate to prevent duplicates.
    const existingCertificate = await Certificate.findOne({ userId, courseId });

    if (existingCertificate) {
      return { success: true, message: 'Certificate already exists.', certificate: existingCertificate };
    }

    // 4. Generate a unique certificate ID and create the new certificate document.
    const certificateId = uuidv4();
    const newCertificate = new Certificate({
      userId,
      courseId,
      completionDate: enrollment.completionDate, // Use the completion date from the enrollment record
      certificateId,
    });

    // 5. Save the new certificate to the database.
    const savedCertificate = await newCertificate.save();

    console.log(`Successfully generated certificate for user ${userId} and course ${courseId}.`);
    return { success: true, message: 'Certificate generated successfully.', certificate: savedCertificate };
  } catch (error) {
    console.error(`Error generating certificate: ${error.message}`);
    return { success: false, message: 'An error occurred while generating the certificate.' };
  }
};

/**
 * Fetches a certificate for a specific user and course.
 * @param {string} userId - The unique ID of the user.
 * @param {string} courseId - The unique ID of the course.
 * @returns {Promise<Object>} - A promise that resolves with the certificate object or an error message.
 */
export const getCertificate = async (userId, courseId) => {
  try {
    const certificate = await Certificate.findOne({ userId, courseId });

    if (!certificate) {
      return { success: false, message: 'Certificate not found.' };
    }

    return { success: true, certificate };
  } catch (error) {
    console.error(`Error fetching certificate: ${error.message}`);
    return { success: false, message: 'An error occurred while fetching the certificate.' };
  }
};
