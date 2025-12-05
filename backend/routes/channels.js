import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import Channel from "../models/Channel.js"

const router = express.Router()

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const channels = await Channel.find({
      $or: [
        { isPrivate: false },
        { isPrivate: true, createdBy: userId },
        { isPrivate: true, members: userId }
      ]
    })
      .populate("createdBy", "username")
      .populate("members", "username email");

    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body

    const existingChannel = await Channel.findOne({ name })
    if (existingChannel) {
      return res.status(400).json({ message: "Channel already exists" })
    }

    const channel = new Channel({
      name,
      description,
      isPrivate: isPrivate || false,
      createdBy: req.user.id,
      members: [req.user.id],
    })

    await channel.save()
    await channel.populate("createdBy", "username")

    res.status(201).json(channel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:channelId/join", authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(
      req.params.channelId,
      { $addToSet: { members: req.user.id } },
      { new: true },
    ).populate("members", "username email")

    res.json(channel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:channelId/leave", authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(
      req.params.channelId,
      { $pull: { members: req.user.id } },
      { new: true },
    ).populate("members", "username email")

    res.json(channel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch("/:channelId/privacy", authenticateToken, async (req, res) => {
  try {
    const { isPrivate } = req.body

    const channel = await Channel.findById(req.params.channelId)

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" })
    }

    if (channel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only channel owner can change privacy" })
    }

    channel.isPrivate = isPrivate
    await channel.save()

    await channel.populate([
      { path: "createdBy", select: "username" },
      { path: "members", select: "username email" }
    ]);

    res.json(channel)
  } catch (error) {
    console.log({error})
    res.status(500).json({ message: error.message })
  }
})

router.delete("/:channelId", authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId)

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" })
    }

    if (channel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only channel owner can delete the channel" })
    }

    await Channel.findByIdAndDelete(req.params.channelId)
    res.json({ message: "Channel deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:channelId/remove-user", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.body
    const channel = await Channel.findById(req.params.channelId)

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" })
    }

    if (channel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only channel owner can remove users" })
    }

    await Channel.findByIdAndUpdate(req.params.channelId, { $pull: { members: userId } }, { new: true }).populate(
      "members",
      "username email",
    )

    res.json({ message: "User removed successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/:channelId", authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId)
      .populate("createdBy", "username")
      .populate("members", "username email")

    res.json(channel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
