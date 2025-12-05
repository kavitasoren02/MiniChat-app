import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import Message from "../models/Message.js"

const router = express.Router()

router.get("/:channelId", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (page - 1) * limit

    const messages = await Message.find({ channel: req.params.channelId })
      .populate("sender", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Message.countDocuments({ channel: req.params.channelId })

    res.json({
      messages: messages.reverse(),
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
      hasMore: (messages.length + skip) >= total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { content, channelId } = req.body

    const message = new Message({
      content,
      sender: req.user.id,
      channel: channelId,
    })

    await message.save()
    await message.populate("sender", "username")

    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
