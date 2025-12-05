import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { authenticateToken } from "../middleware/auth.js"
import bcryptjs from "bcryptjs"

const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const user = new User({ username, email, password: hashedPassword })
    await user.save()

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" },
    )

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    })
  } catch (error) {
    console.log({error})
    res.status(500).json({ message: error.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "7d" },
    )

    res.json({
      message: "Logged in successfully",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    })
  } catch (error) {
    console.log({error})
    res.status(500).json({ message: error.message })
  }
})

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
