import { useState } from "react"
import { Users, X } from "lucide-react"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import OnlineUsers from "./OnlineUsers"
import Button from "./Button"

export default function ChatArea({
  channel,
  messages,
  onSendMessage,
  onLoadMore,
  hasMoreMessages,
  onlineUsers,
  currentUser,
  typingUsers,
  onLeaveChannel,
  onShowUsers,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showOnlineUsers, setShowOnlineUsers] = useState(false)

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
    onLoadMore(currentPage + 1)
  }

  if (!channel) {
    return (
      <div className="hidden md:flex flex-1 bg-gray-800 items-center justify-center">
        <div className="text-gray-400 text-center">
          <p className="text-lg">Select a channel to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-800 flex flex-col w-full h-screen md:h-auto md:static fixed md:relative inset-0 z-30">
      <div className="p-3 md:p-4 border-b border-gray-700 flex justify-between items-center gap-3 sticky top-0 z-10 bg-gray-800">
        <div className="min-w-0 flex-1 flex items-center gap-3">
          <button
            onClick={() => {
              window.history.back()
            }}
            className="md:hidden text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
          <div>
            <h2 className="text-white font-bold text-lg md:text-xl truncate">#{channel.name}</h2>
            {channel.description && <p className="text-gray-400 text-xs md:text-sm truncate">{channel.description}</p>}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowOnlineUsers(!showOnlineUsers)}
            className="md:hidden px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors flex items-center gap-1"
            title="Show online users"
          >
            <Users size={16} />
            {onlineUsers.length}
          </button>
          <Button
            variant="danger"
            onClick={() => onLeaveChannel(channel._id)}
            className="text-xs md:text-sm px-2 md:px-4 py-2"
          >
            Leave
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col w-full min-w-0">
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
            {hasMoreMessages && (
              <div className="text-center">
                <Button variant="secondary" onClick={handleLoadMore} className="text-xs md:text-sm">
                  Load older messages
                </Button>
              </div>
            )}
            <MessageList messages={messages} currentUser={currentUser} />
            {typingUsers.length > 0 && (
              <div className="text-gray-500 text-xs md:text-sm italic flex items-center gap-2">
                <span className="inline-block">
                  <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span
                    className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></span>
                  <span
                    className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                </span>
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </div>
            )}
          </div>

          <MessageInput onSendMessage={onSendMessage} />
        </div>

        {/* Desktop sidebar - always visible */}
        <div className="hidden md:flex">
          <OnlineUsers users={onlineUsers} currentUser={currentUser} />
        </div>

        {/* Mobile overlay - shown on demand */}
        {showOnlineUsers && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowOnlineUsers(false)}
          >
            <div
              className="absolute right-0 top-0 bottom-0 w-64 bg-gray-900 border-l border-gray-700 flex flex-col shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-900">
                <h3 className="text-white font-bold">Online Users</h3>
                <button
                  onClick={() => setShowOnlineUsers(false)}
                  className="text-gray-400 hover:text-white text-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <OnlineUsers users={onlineUsers} currentUser={currentUser} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
