import { asyncHandler, } from "../utils/asyncHandler.js";
import { APIError } from '../utils/ApiError.js'
import { APIResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


const verifyJWT = asyncHandler(async (req, res, next) => {
  try {

    const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return
      new APIResponse(404, "Unauthorized accessToken")
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = User.findById(decodeToken?._id)
      .select('-password -refreshToken')
    if (!user) {
      throw new APiError(404, "invalid user token")
    }

    req.user = user
    next()

  } catch (error) {
    throw new APIError(401, error?.message || 'Invalid access token')

  }
})

export { verifyJWT }