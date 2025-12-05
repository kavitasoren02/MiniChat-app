import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ChannelList from "../components/ChannelList"
import ChatArea from "../components/ChatArea"
import api from "../utils/api"
import { initSocket, getSocket, disconnectSocket } from "../utils/socket"

export default function ChatPage({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/login")
          return
        }

        const userRes = await api.get("/auth/me")
        setCurrentUser(userRes.data)

        const channelsRes = await api.get("/channels")
        setChannels(channelsRes.data)

        const socket = initSocket(token)

        socket.on("onlineUsers", (users) => {
          setOnlineUsers(users)
        })

        socket.on("newMessage", (message) => {
          setMessages((prev) => [
            ...prev,
            {
              _id: message.timestamp,
              content: message.content,
              sender: { _id: message.senderId, username: message.senderUsername },
              createdAt: new Date(),
            },
          ])
        })

        socket.on("userTyping", (data) => {
          if (data.isTyping) {
            setTypingUsers((prev) => [...new Set([...prev, data.username])])
          } else {
            setTypingUsers((prev) => prev.filter((u) => u !== data.username))
          }
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        localStorage.removeItem("token")
        navigate("/login")
      }
    }

    fetchData()

    return () => {
      disconnectSocket()
    }
  }, [navigate])

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(1)
    }
  }, [selectedChannel])

  const fetchMessages = async (page) => {
    try {
      const res = await api.get(`/messages/${selectedChannel._id}`, {
        params: { page, limit: 20 },
      })

      if (page === 1) {
        setMessages(res.data.messages)
      } else {
        setMessages((prev) => [...res.data.messages, ...prev])
      }

      setHasMoreMessages(page < res.data.pages)
      setCurrentPage(page)

      const socket = getSocket()
      if (socket) {
        socket.emit("joinChannel", selectedChannel._id)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (content) => {
    if (!selectedChannel || !content.trim()) return

    try {
      await api.post("/messages", {
        content,
        channelId: selectedChannel._id,
      })

      const socket = getSocket()
      if (socket) {
        socket.emit("sendMessage", {
          content,
          channelId: selectedChannel._id,
          timestamp: new Date(),
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleCreateChannel = async (name, description, isPrivate = false) => {
    try {
      const res = await api.post("/channels", { name, description, isPrivate })
      setChannels((prev) => [...prev, res.data])
    } catch (error) {
      console.error("Error creating channel:", error)
    }
  }

  const handleJoinChannel = async (channelId) => {
    try {
      const res = await api.post(`/channels/${channelId}/join`)
      setChannels((prev) => prev.map((c) => (c._id === channelId ? res.data : c)))
    } catch (error) {
      console.error("Error joining channel:", error)
    }
  }

  const handleLeaveChannel = async (channelId) => {
    try {
      const socket = getSocket()
      if (socket) {
        socket.emit("leaveChannel", channelId)
      }

      await api.post(`/channels/${channelId}/leave`)
      setChannels((prev) =>
        prev.map((c) =>
          c._id === channelId ? { ...c, members: c.members.filter((m) => m._id !== currentUser._id) } : c,
        ),
      )

      if (selectedChannel?._id === channelId) {
        setSelectedChannel(null)
        setMessages([])
      }
    } catch (error) {
      console.error("Error leaving channel:", error)
    }
  }

  const handleTogglePrivacy = async (channelId, isPrivate) => {
    try {
      const res = await api.patch(`/channels/${channelId}/privacy`, { isPrivate })
      setChannels((prev) => prev.map((c) => (c._id === channelId ? res.data : c)))
      if (selectedChannel?._id === channelId) {
        setSelectedChannel(res.data)
      }
    } catch (error) {
      console.error("Error toggling privacy:", error)
    }
  }

  const handleDeleteChannel = async (channelId) => {
    try {
      await api.delete(`/channels/${channelId}`)
      setChannels((prev) => prev.filter((c) => c._id !== channelId))
      if (selectedChannel?._id === channelId) {
        setSelectedChannel(null)
        setMessages([])
      }
    } catch (error) {
      console.error("Error deleting channel:", error)
      alert("Failed to delete channel")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    disconnectSocket()
    setIsAuthenticated(false)
    navigate("/login")
  }

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900 flex-col md:flex-row">
      <div className="md:hidden">
        {selectedChannel ? (
          <ChatArea
            channel={selectedChannel}
            messages={messages}
            onSendMessage={handleSendMessage}
            onLoadMore={fetchMessages}
            hasMoreMessages={hasMoreMessages}
            onlineUsers={onlineUsers}
            currentUser={currentUser}
            typingUsers={typingUsers}
            onLeaveChannel={handleLeaveChannel}
            onShowUsers={() => {}}
          />
        ) : (
          <ChannelList
            channels={channels}
            selectedChannel={selectedChannel}
            onSelectChannel={setSelectedChannel}
            onCreateChannel={handleCreateChannel}
            onJoinChannel={handleJoinChannel}
            onLeaveChannel={handleLeaveChannel}
            currentUserId={currentUser._id}
            onTogglePrivacy={handleTogglePrivacy}
            onDeleteChannel={handleDeleteChannel}
            onShowUsers={() => {}}
            handleLogout={handleLogout}
          />
        )}
      </div>

      {/* Desktop: show both */}
      <div className="hidden md:flex w-full">
        <ChannelList
          channels={channels}
          selectedChannel={selectedChannel}
          onSelectChannel={setSelectedChannel}
          onCreateChannel={handleCreateChannel}
          onJoinChannel={handleJoinChannel}
          onLeaveChannel={handleLeaveChannel}
          currentUserId={currentUser._id}
          onTogglePrivacy={handleTogglePrivacy}
          onDeleteChannel={handleDeleteChannel}
          onShowUsers={() => {}}
          handleLogout={handleLogout}
        />

        <ChatArea
          channel={selectedChannel}
          messages={messages}
          onSendMessage={handleSendMessage}
          onLoadMore={fetchMessages}
          hasMoreMessages={hasMoreMessages}
          onlineUsers={onlineUsers}
          currentUser={currentUser}
          typingUsers={typingUsers}
          onLeaveChannel={handleLeaveChannel}
          onShowUsers={() => {}}
        />
      </div>
    </div>
  )
}
