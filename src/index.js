import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from 'express'
import connectDB from "./db/index.js";
import dotenv from 'dotenv'
import app from "./app.js";

dotenv.config({
    path : './.env'
})


connectDB()
   .then(() => {
    app.listen(process.env.PORT || 8000 , () => {
      console.log(`server is listening in ${process.env.PORT}`)
    }
    )
   })
   .catch((err) => {
    console.log(err)
   })












/*
const app = express()

;(async () => {
  try {
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
   app.on("error" , (error) => {
     console.log("error " , error)
   }
   )
   app.listen(process.env.PORT,() => {
     console.log(`the app is listening in port${process.env.PORT}`)
   }
   )
  } catch (error) {
    console.log("error : " , error)
    throw error
  }
}
)()
*/