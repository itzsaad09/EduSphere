import express from "express";
import {
    adminLogin,
    register,
    verify,
    resendVerificationCode,
    login,
    recoverPassword,
    getUser,
    getAllUsers,
    googleAuth,
    completeProfile,
} from "../controllers/registrationController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/admin", adminLogin);
router.post("/register", register);
router.post("/verify", verify);
router.post("/resend", resendVerificationCode);
router.post("/login", login);
router.post("/recover", recoverPassword);
router.get("/display", getUser);
router.get("/all", adminAuth, getAllUsers);
router.post("/google", googleAuth);

router.post(
    "/complete-profile",
    userAuth,    
    upload.fields([
        { name: "profilePic", maxCount: 1 },
        { name: "cnicFrontPic", maxCount: 1 },
        { name: "cnicBackPic", maxCount: 1 },
    ]),
    completeProfile
);

export default router;