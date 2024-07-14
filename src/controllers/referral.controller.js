import prisma from "../DataBase/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addReferral = asyncHandler(async (req, res) => {
    /*
        get referrar userId from req.user
        get referee_name, referee_email, referee_mobile_no, relation, course_name from req.body
        first check referrar have enrolled for the any course
        If yes then find course_id according to course_name provided in req.body
        Create entry in referral table and send referral code to the referee_email
    */
    
    const user = req.user;
    const { referee_name, referee_email, referee_mobile_no, relation, course_name } = req.body;
    //check referrar have enrolled for course or not
    const isEnrolled = await prisma.enrollment.findFirst({
        where: {
            student_id:user.id
        }
    })

    if (!isEnrolled) {
        return res.status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "You have not enrolled for any course. You can not refer course"
            )
        )
    }

    //find course according to the course_name
    const checkCourse = await prisma.course.findUnique({
        where: {
            course_name
        }
    })

    if (!checkCourse) {
        return res.status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "Selected course is not available now"
            )
        )
    }

    function generateReferralCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 6; i++){
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    const referralCode = generateReferralCode();


    //If all success then create entry in database
    const referralEntry = await prisma.referral.create({
        data: {
            referrer: {
                connect:{id:user.id}
            },
            referee_name,
            referee_email,
            referee_mobile_no,
            relation,
            course: {
                connect:{id:checkCourse.id}
            },
            referral_code:referralCode
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                referralEntry,
                "Referral send successfully"
        )
    )


})

export { addReferral };
