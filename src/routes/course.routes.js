import { Router } from "express";
import { addCourse } from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT, upload.none(), addCourse);


export default router;