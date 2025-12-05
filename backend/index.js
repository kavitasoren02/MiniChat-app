import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js"
import channelRoutes from "./routes/channels.js"
import messageRoutes from "./routes/messages.js"
import { verifyToken } from "./middleware/auth.js"

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
})

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    }),
)
app.use(express.json())

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/team-chat")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err))

app.use("/api/auth", authRoutes)
app.use("/api/channels", channelRoutes)
app.use("/api/messages", messageRoutes)

const onlineUsers = new Map()

io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
        return next(new Error("Authentication error"))
    }

    try {
        const decoded = verifyToken(token)
        socket.userId = decoded.id
        socket.username = decoded.username
        next()
    } catch (error) {
        next(new Error("Authentication error"))
    }
})

io.on("connection", (socket) => {
    console.log("User connected:", socket.userId)

    onlineUsers.set(socket.userId, {
        socketId: socket.id,
        username: socket.username,
    })

    io.emit("onlineUsers", Array.from(onlineUsers.values()))

    socket.on("joinChannel", (channelId) => {
        socket.join(`channel-${channelId}`)
        socket.to(`channel-${channelId}`).emit("userJoined", {
            username: socket.username,
            userId: socket.userId,
        })
    })

    socket.on("leaveChannel", (channelId) => {
        socket.leave(`channel-${channelId}`)
        socket.to(`channel-${channelId}`).emit("userLeft", {
            username: socket.username,
            userId: socket.userId,
        })
    })

    socket.on("sendMessage", (data) => {
        io.to(`channel-${data.channelId}`).emit("newMessage", {
            ...data,
            senderUsername: socket.username,
            senderId: socket.userId,
        })
    })

    socket.on("typing", (data) => {
        socket.to(`channel-${data.channelId}`).emit("userTyping", {
            username: socket.username,
            isTyping: data.isTyping,
        })
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.userId)
        onlineUsers.delete(socket.userId)
        io.emit("onlineUsers", Array.from(onlineUsers.values()))
    })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
