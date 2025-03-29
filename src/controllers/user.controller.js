import {asyncHandler} from '../utilities/asyncHandler.js'
import {ApiError} from '../utilities/ApiError.js'
import { User } from '../models/user.model.js'
import {uploadFileOnCloudinary} from '../utilities/cloudinary.js'
import { ApiResponse } from '../utilities/ApiResponse.js'

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const AccessToken = user.generateAccessToken()
    const RefreshToken = user.generateRefreshToken()
    user.refreshToken = RefreshToken
    await user.save({ validationBeforeSave : false })

    return{AccessToken,RefreshToken}

  } catch (error) {
    throw new ApiError(500,"something went wrong while generating access and refresh token")
  }
}

const registerUser = asyncHandler( async (req,res) => {
  //get user details from frontend
  //validation property of user
  //check user is already registered or not (username,email)
  //check for images and check for avatar
  //upload them into cloudinary ,avatar
  //create object user-create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return to the response

  const {fullname,email,password,username} = req.body
  if ([fullname,email,password,username].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400,"All fields are required")
  }

    const existUser = await User.findOne({
      $or : [{ username },{ email }]
    })

    if (existUser) {
      throw new ApiError(409,"Email and username should be unique")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files) && req.files.coverImage.length > 0 ) {
      coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
      throw new ApiError(400,"Avatar is file required")
    }

    const avatar = await uploadFileOnCloudinary(avatarLocalPath)
    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath)

    if (!avatar) {
      throw new ApiError(400,"Avatar is file required")
    }

    const user = await User.create(
      {
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        password,
        username : username.toLowerCase(),
        email
      }
    )

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
      throw new ApiError(500,"Server busy please try again")
    }

    return res.status(201).json(
      new ApiResponse(200,createdUser,"User registered Successfully",)
    )
})

const logInUser = asyncHandler(async (req,res) => {
  //req.body -> data
  //username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie


  const {username,email,password} = req.body

  if (!(username ||  email)) {
    throw new ApiError(400,"username or password required")
  }

  const user = await User.findOne({
    $or : [{username},{email}]
  })

  if (!user) {
    throw new ApiError(400 , "username or email is not found")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401 , "password is incorrect")
  }

  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const option = {
    httpOnly : true,
    secure : true
  }

  res.status(200)
     .cookie("accessToken" , accessToken , option)
     .cookie("refreshToken", refreshToken , option)
     .json(
      new ApiResponse(200,
        {
          user : loggedInUser , accessToken ,refreshToken
        }
      )
     )
})

const logOut = asyncHandler(async (req,res) => {
      await User.findByIdAndUpdate(
        req.user._id,
        {
           $set : {
              refreshToken : undefined
           }
        },
        {
          new : true
        },
      )
      const option = {
        httpOnly : true,
        secure : true
      }
      res
        .status(200)
        .clearCookie("accessToken",option)
        .clearCookie("refreshToken",option)
        .json(
          new ApiResponse(201,{},"user logged out successfully")
        )
})

export {
    registerUser,
    logInUser,
    logOut
}