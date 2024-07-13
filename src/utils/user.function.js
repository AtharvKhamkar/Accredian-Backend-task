import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../DataBase/db.config.js";
import { ApiError } from "./ApiError.js";

const hashPassword = async(password) => {
    try {
        return await bcrypt.hash(password,10)
    } catch (error) {
        throw new ApiError(400,`${error.message}}`)
    }
}

const isPasswordCorrect = async (isRegistered, password) => {
    try {
        return await bcrypt.compare(password,isRegistered.password)
    } catch (error) {
        throw new ApiError(400,`${error.message}`)
    }
}

const generateAccessToken = async(id, email, username, fullname) => {
    return jwt.sign(
        {
            id,
            email,
            username,
            fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const generateRefreshToken = async(id) => {
    return jwt.sign(
        {
            id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        
        const uniqueUser = await prisma.user.findUnique({
            where: {
                id:userId
            }
        })

        const accessToken = await generateAccessToken(uniqueUser.id, uniqueUser.email, uniqueUser.username, uniqueUser.fullname);
        const refreshToken = await generateRefreshToken(uniqueUser.id);

        console.log(accessToken)

        await prisma.user.update({
            where: {
                id: uniqueUser.id
            },
            data: {
                refreshToken
            }
        });


        return { accessToken , refreshToken};
    } catch (error) {
        throw new ApiError(400,`Error while generating access and refreshToken :: ${error.message}`)
    }
}


export { generateAccessAndRefreshToken, generateAccessToken, generateRefreshToken, hashPassword, isPasswordCorrect };

