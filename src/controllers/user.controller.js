import prisma from "../DataBase/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshToken, hashPassword, isPasswordCorrect } from "../utils/user.function.js";


const registerUser = asyncHandler(async (req, res) => {

    const { fullname, username, email, password } = req.body;

    const isRegistered = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isRegistered) {
        return res.status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "User is already registered. Please login"
            )
        )
    }

    const hashedPassword = await hashPassword(password)

    const registeredUser = await prisma.user.create({
        data: {
            fullname,
            username,
            email,
            password:hashedPassword
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                registeredUser,
                "User registered successfully"
        )
    )
})

const loginUser = asyncHandler(async (req, res) => {
    /*
    get email and password from req.body.
    check from email whether user is registered or not.
    if registered then compare password that is correct or not.
    If password is correct then generate accessToken and refreshToken and send accessToken to user
    */
    
    const { email, password } = req.body;

    const isRegistered = await prisma.user.findUnique({
        where: {
            email
        }
    })


    if (!isRegistered) {
        return res.status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "Please register first"
            )
        )
    }

    const checkPassword = await isPasswordCorrect(isRegistered, password);


    if (!checkPassword) {
        return res.status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "Password is incorrect"
            )
        )
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(isRegistered.id);


    const loggedInUser = await prisma.user.findUnique({
        where: {
            id:isRegistered.id
        },
        select: {
            id: true,
            fullname: true,
            username: true,
            email: true,
        }
    })

    const options = {
        httpOnly: true,
        secure:true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    loggedInUser,
                    accessToken
                },
                "User logged in successfully"
        )
    )
    

})

export { loginUser, registerUser };

