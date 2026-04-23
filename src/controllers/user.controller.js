import { asyncHandler } from '../utils/asyncHandler.js'
import { APIError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cluodinary.js'
import { APIResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {

  const generateAccessTokenAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ ValidityBeforeSave })

    return { accessToken, refreshToken }
  }

  console.log("FILES:", req.files)
  console.log("BODY:", req.body)
  console.log("HEADERS:", req.headers)


  const { username, email, password, fullName } = req.body
  console.log("email", email, "password", password)

  if (
    [fullName, email, password, username].some((fields) => fields?.trim() === "")
  ) {
    throw new APIError("all fields are required")
  }

  const userExisted = await User.findOne(
    {
      $or: [{ username }, { email }]
    }
  )

  if (userExisted) {
    throw new APIError(400, "user is already existed ")
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // console.log(avatarLocalPath)

  const coverImgLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new APIError(400, "Avatar file is requier")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImgLocalPath)

  if (!avatar) {
    throw new APIError(400, "Avatar file is required")
  }


  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
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

const loginUser = asyncHandler(async (req, res) => {

  const { email, username, password } = req.body

  if (!username || !email) {
    throw new APIError(400, "username and email is required")
  }

  const userExisted = User.findOne({
    $or: [{ username }, { email }]
  })

  if (!userExisted) {
    throw new APIError(401, "user does not existed")
  }

  const isPasswordValid = user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new APIError(401, "Invalid credential")
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id)
  select('-password  -refreshToken')

  const option = () => {
    return {
      httpOnly: true,
      secure: true
    }
  }

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
      new APIResponse(
        {
          user: loggedInUser, refreshToken, accessToken,
        },
        "User is login succefully !"
      )
    )

})

const loggOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined }
    },
    { new: true }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new APIResponse(200, "User logged out successfully")
    )
})

export {
  registerUser,
  loginUser,
  loggOutUser

}