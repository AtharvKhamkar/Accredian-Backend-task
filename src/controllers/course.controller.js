import prisma from "../DataBase/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addCourse = asyncHandler(async (req, res) => {
    const user = req.user;
    const { course_name, price, duration,referrer_bonus,referee_bonus } = req.body;

    const checkTitle = await prisma.course.findUnique({
        where: {
            course_name:course_name
        }
    })


    if (checkTitle) {
        return res.status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "Please select another title for the course"
            )
        )
    }

    const createdCourse = await prisma.course.create({
        data: {
            course_name,
            instructor_id:user.id,
            price:parseInt(price),
            duration,
            referrer_bonus: parseInt(referrer_bonus),
            referee_bonus:parseInt(referee_bonus)
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdCourse,
                "Course created successfully"
        )
    )
})

const allCourses = asyncHandler(async (req, res) => {
    const courses = await prisma.course.findMany({});

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                courses,
                "All courses fetched"
        )
    )
})

export { addCourse, allCourses };

