import app from './app.js'
import dotenv from 'dotenv'
import connectDB from './db/index.js'

dotenv.config({
  path: './env'
})


connectDB()
  .then(() => {
    console.log("DB Connected Successfully", process.env.PORT)
    app.on("error", (err) => {
      console.log("App error", err)
    })
    app.listen(process.env.PORT || 8000, () => {
      console.log("server is runnig !!")
    })
  })
  .catch((err) => {
    console.log("mongo db failed !!", err)
  })