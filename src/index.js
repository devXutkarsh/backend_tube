
import dotenv from 'dotenv'
import connectDB from "./db/index.js";



dotenv.config({
  path: './.env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening on port ${process.env.PORT}`)

      app.on((err) => {
        console.log("error:", err)
        throw err
      })
    })


  })
  .catch((error) => {
    console.log(`mongoDB connection is Failed `, error)
  })