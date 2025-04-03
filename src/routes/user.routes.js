import { Router } from "express";
import { changeOldPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, logInUser, logOut, refreshAccessToken, registerUser, updateAvatarFile, updateCoverImageFile, updateField } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post( 
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]) ,
     registerUser
)

router.route("/logIn").post(logInUser)

router.route("/logOut").post(verifyJWT,logOut)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeOldPassword)

router.route("/current-user").post(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateField)

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatarFile)

router.route("update-localImage").patch(verifyJWT,upload.single("coverImage"),updateCoverImageFile)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT,getWatchHistory)
export default router