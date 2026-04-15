import { asyncHandler } from '../utils/asyncHandler.js'
import { APIError } from "../utils/ApiError.js"
import { User } from '../models/user.model.js'
import { uplaodOnCloudinary } from '../utils/cluodinary.js'
import { APIResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {

  const { username, email, password } = req.body
  console.log("email", email, "password", password)

  if (
    [fullName, email, password, username].some((fields) => fields?.trim() === "")
  ) {
    throw new APIError("all fields are required")
  }

  const userExisted = User.findOne(
    {
      $or: [{ username }, { email }]
    }
  )

  if (userExisted) {
    throw new Error(400, "user is already existed ")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImgLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new APIError(400, "Avatar file is requier")
  }

  const avatar = await uplaodOnCloudinary(avatarLocalPath)
  const coverImage = uplaodOnCloudinary(coverImgLocalPath)

  if (!avatar) {
    throw new APIError(400, "Avatar file is required")
  }


  const user = await User.schema({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createUser = await User.findById(user._id).select("-password -refreshToken")
  if (!createUser) {
    throw new APIError(400, "somthing went wrong while registering user ")
  }

  return res.status(201).json(
    new APIResponse(200, createUser, "user is registered successfully.")
  )
})

export { registerUser }