import { Router } from "express";
import { addReferral } from "../controllers/referral.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/add").post(verifyJWT, upload.none(), addReferral)

export default router;