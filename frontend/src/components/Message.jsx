function getAvatarColor(username) {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-green-400 to-green-600",
    "from-yellow-400 to-yellow-600",
    "from-red-400 to-red-600",
    "from-indigo-400 to-indigo-600",
    "from-cyan-400 to-cyan-600",
  ]
  return colors[Math.abs(hash) % colors.length]
}

export default function Message({ message, isCurrentUser }) {
  const date = new Date(message.createdAt)
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const avatarColor = getAvatarColor(message.sender.username)
  
  return (
    <div className={`flex gap-3 items-center ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && (
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-xs font-bold`}
        >
          {message.sender.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
        {!isCurrentUser && <p className="text-xs font-semibold text-gray-300 mb-1">{message.sender.username}</p>}
        <div
          className={`px-4 py-2 rounded-2xl max-w-xs lg:max-w-md break-words ${
            isCurrentUser
              ? "bg-blue-600 text-white rounded-br-none shadow-md"
              : "bg-gray-700 text-gray-100 rounded-bl-none shadow-md"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <p className={`text-xs mt-1 ${isCurrentUser ? "text-gray-400" : "text-gray-500"}`}>{time}</p>
      </div>
      {isCurrentUser && (
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold`}
        >
          {message.sender.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}
