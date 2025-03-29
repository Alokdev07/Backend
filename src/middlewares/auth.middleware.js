import { User } from "../models/user.model";
import { ApiError } from "../utilities/ApiError";
import { asyncHandler } from "../utilities/asyncHandler";
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler((req,res,next) => {
    try {
        const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
    
        if (!token) {
            throw new ApiError(401,"unAuthorize request")
        }
    
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = User.findById(decodeToken._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401,"AccessToken is not verified")
        }
    
        req.user = user;
    
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})