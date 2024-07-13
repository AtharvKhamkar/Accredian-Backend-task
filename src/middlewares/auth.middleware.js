import jwt from "jsonwebtoken"
import prisma from "../DataBase/db.config.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(400)
                .json(
                    new ApiResponse(
                        200,
                        {},
                        "Token is unavailable"
                    )
            )
        }

        const decodedToken = await jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);


        const user = await prisma.user.findUnique({
            where: {
                id:decodedToken.id
            }
        })

        if (!user) {
            return res.status(400)
                .json(
                    new ApiResponse(
                        400,
                        {},
                        "Invalid user"
                )
            )
        }


        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(400,`Error while decoding a token :: ${error.message}`)
    }
})

export { verifyJWT }
