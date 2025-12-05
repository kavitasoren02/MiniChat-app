import { CheckCircle } from "lucide-react"

export default function OnlineUsers({ users, currentUser }) {
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

  return (
    <div className="w-full md:w-48 bg-gray-900 border-t md:border-t-0 md:border-l border-gray-700 p-3 md:p-4 overflow-y-auto">
      <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
        <CheckCircle size={16} />
        Online ({users.length})
      </h3>
      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-gray-500 text-sm">No users online</p>
        ) : (
          users.map((user) => (
            <div
              key={user.socketId}
              className="flex items-center gap-2 p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarColor(user.username)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-300 text-sm truncate flex-1">{user.username}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
