import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit:"16kb"
}))

app.use(express.static("public"));

app.use(cookieParser());

//All Routes
import courseRouter from "./routes/course.routes.js";
import enrollmentRouter from "./routes/enrollment.routes.js";
import userRouter from "./routes/user.routes.js";
import referRouter from "./routes/referral.routes.js";

app.use("/api/v1/user", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/enrollment", enrollmentRouter)
app.use("/api/v1/refer",referRouter)



export default app;