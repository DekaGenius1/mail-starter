import express from "express"
import mongoose from "mongoose"
import session from "express-session"
import MongoStore from "connect-mongo"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import { handleError } from "./middleware.js"

dotenv.config({ path: "./config/.env" })

const app = express()

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
)

app.use(express.json())
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === "production"
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL
    })
  })
)

app.use("/users", userRouter)
app.use("/emails", emailRouter)


app.use(handleError)

app.listen(process.env.EXPRESS_PORT, async () => {
  console.log(
    `Running in ${process.env.NODE_ENV} mode on port ${process.env.EXPRESS_PORT}`
  )

  await mongoose.connect(process.env.MONGODB_URL)
  console.log(`Connected to the DB: ${process.env.MONGODB_URL}`)
})
