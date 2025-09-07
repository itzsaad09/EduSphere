import express from 'express';
import { generateCertificate, getCertificate } from '../controllers/certificateController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

/**
 * @route   POST /api/certificates/generate
 * @desc    Generate a new certificate for a completed course
 * @access  Private (or restricted to a service that handles course completion)
 */
router.post('/generate', async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const result = await generateCertificate(userId, courseId);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error occurred during certificate generation.' });
  }
});

/**
 * @route   GET /api/certificates/:userId/:courseId
 * @desc    Get a specific certificate for a user and course
 * @access  Public (or accessible to authenticated users)
 */
router.get('/:userId/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const result = await getCertificate(userId, courseId);
    if (result.success) {
      res.status(200).json(result.certificate);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error occurred while fetching certificate.' });
  }
});

export default router;
