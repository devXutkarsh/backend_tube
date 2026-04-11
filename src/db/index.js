import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'
import express from 'express'
const app = express()

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log(`mongo connect DB host ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("server is failed")
    process.exit(1)
  }
}


export default connectDB

