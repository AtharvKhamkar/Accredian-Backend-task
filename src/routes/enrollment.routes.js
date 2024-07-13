import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { enrollStudent } from "../controllers/enrollment.controller.js";

const router = Router();

router.route("/student/:courseId").post(verifyJWT, enrollStudent);

export default router;