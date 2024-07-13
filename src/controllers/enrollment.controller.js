import prisma from "../DataBase/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateEndDate } from "../utils/enrollment.function.js";

const enrollStudent = asyncHandler(async (req, res) => {
    /*
        get userId from req.user and courseId from req.params
        check Is the user already enrolled or not
        If it is not check the course is available or not and get course duration
        create enrollment of student append endDate by using course duration
    */
    
    const user = req.user;
    const { courseId } = req.params;
    
    const isEnrolled = await prisma.enrollment.findFirst({
        where: {
            student_id: user.id,
            course_id:courseId
        }
    })

    if (isEnrolled) {
        return res.status(200)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "You have already enrolled for this course"
            )
        )
    }

    const courseDetails = await prisma.course.findUnique({
        where: {
            id:courseId
        }
    })

    if (!courseDetails) {
        return res.status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "Course is unavailable"
            )
        )
    }

    const createdEnrollment = await prisma.enrollment.create({
        data: {
            student_id: user.id,
            course_id: courseDetails.id,
            endDate:calculateEndDate(Date.now(),courseDetails.duration)
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdEnrollment,
                "Student enrolled for course successfully"
        )
    )
})

export { enrollStudent };
