import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"
import express from 'express'

const app = express()


const connectDB = async () => {
  try {
    const connetionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log(`mongoDb connectd || db host ${connetionInstance.connection.host}`)
  } catch (error) {
console.log("Error ", error)
process.exit(1)
  }
}

/*
const connectDB = (async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    app.on((err) => {
      console.log("")
    })

    app.listen(process.env.PORT, () => {
      console.log(`App is listening op this port ${PORT}`)
    })

  } catch (error) {
    console.log("Error:", error)

  }
})()
*/
export default connectDB;