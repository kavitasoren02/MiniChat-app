import { io } from "socket.io-client"

let socket = null

export const initSocket = (token) => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"

  socket = io(socketUrl, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
