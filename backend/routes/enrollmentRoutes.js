import express from "express";
import {
  enrollUserInCourse,
  getUserEnrollments,
  getCourseEnrollments,
  updateEnrollment,
  deleteEnrollment,
} from "../controllers/enrollmentController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", userAuth, enrollUserInCourse);

router.get("/user/:userId", userAuth, getUserEnrollments);

router.get("/course/:courseId", adminAuth, getCourseEnrollments);

router.put("/:id", userAuth, updateEnrollment);

router.delete("/:id", adminAuth, deleteEnrollment);

export default router;
