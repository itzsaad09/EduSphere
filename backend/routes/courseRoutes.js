import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  fetchPlaylistVideos,
} from "../controllers/courseController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.route("/add").post(upload.single("thumbnail"), adminAuth, createCourse);

router.route("/all").get(getAllCourses);

router.route("/:id").get(getCourseById);

router
  .route("/:id/update")
  .put(upload.single("thumbnail"), adminAuth, updateCourse);

router.route("/:id/delete").delete(adminAuth, deleteCourse);

router.post("/:id/fetch-playlist", fetchPlaylistVideos);

export default router;
