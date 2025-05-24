import asyncHandler from "express-async-handler"
import bcrypt from "bcrypt"
import { User } from "../models.js"

export const getStatus = asyncHandler(async (req, res) => {
  return res.json({ user: req.user })
})

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 8)

  const newUser = await User.create({
    email: email,
    password: hashedPassword
  })

  req.session.userId = newUser._id

  res.json({
    user: { username: newUser.username, email: newUser.email }
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).lean()

  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...rest } = user
    req.session.userId = rest._id.toString()
    res.json({ user: rest })
  } else {
    res.status(401).json({ message: "Invalid username or password" })
  }
})

export const logout = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" })
    }

    res.clearCookie("connect.sid", {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    res.status(200).json({ message: "Logged out successfully" })
  })
})
