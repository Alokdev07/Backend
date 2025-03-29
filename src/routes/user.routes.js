import { Router } from "express";
import { logInUser, logOut, registerUser } from "../controllers/user.controller.js";
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

export default router