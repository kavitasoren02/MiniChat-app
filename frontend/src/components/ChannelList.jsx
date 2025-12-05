import { useState } from "react"
import { MoreVertical, Plus, Lock, Unlock, Trash2, LogOut, Users } from "lucide-react"
import Button from "./Button"
import CreateChannelModal from "./CreateChannelModal"

export default function ChannelList({
  channels,
  selectedChannel,
  onSelectChannel,
  onCreateChannel,
  onJoinChannel,
  onLeaveChannel,
  currentUserId,
  onTogglePrivacy,
  onDeleteChannel,
  onShowUsers,
  handleLogout
}) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)

  const handleCreateChannel = (name, description, isPrivate) => {
    onCreateChannel(name, description, isPrivate)
    setShowCreateModal(false)
  }

  return (
    <div className="w-full md:w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-screen md:relative absolute md:static z-40 top-0 left-0">
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">Channels</h2>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="w-full text-sm flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          New Channel
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {channels.length === 0 ? (
          <div className="p-4 text-gray-400 text-sm text-center">No channels yet. Create one!</div>
        ) : (
          channels.map((channel) => {
            const isMember = channel.members.some((m) => m._id === currentUserId)
            const isOwner = channel.createdBy._id === currentUserId

            return (
              <div key={channel._id} className="border-b border-gray-800 last:border-b-0">
                <div
                  onClick={() => {
                    onSelectChannel(channel)
                    // Close menu when selecting channel
                    setOpenMenuId(null)
                  }}
                  className={`p-3 cursor-pointer border-l-4 transition-colors flex items-center justify-between group ${selectedChannel?._id === channel._id
                      ? "bg-gray-800 border-blue-500 text-white"
                      : "border-transparent text-gray-400 hover:bg-gray-800"
                    }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {channel.isPrivate ? (
                        <Lock size={16} className="flex-shrink-0" />
                      ) : (
                        <Unlock size={16} className="flex-shrink-0" />
                      )}
                      <h3 className="font-medium truncate">#{channel.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{channel.members.length} members</p>
                  </div>
                  {(
                    <div className="relative flex-shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(openMenuId === channel._id ? null : channel._id)
                        }}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="More options"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openMenuId === channel._id && (
                        <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-50 min-w-48">
                          {isOwner && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onTogglePrivacy(channel._id, !channel.isPrivate)
                                setOpenMenuId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 border-b border-gray-700"
                            >
                              {channel.isPrivate ? (
                                <>
                                  <Unlock size={16} />
                                  Make Public
                                </>
                              ) : (
                                <>
                                  <Lock size={16} />
                                  Make Private
                                </>
                              )}
                            </button>
                          )}
                          {isOwner && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (confirm("Are you sure you want to delete this channel?")) {
                                  onDeleteChannel(channel._id)
                                }
                                setOpenMenuId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900 hover:text-red-200 transition-colors flex items-center gap-2 border-b border-gray-700"
                            >
                              <Trash2 size={16} />
                              Delete Channel
                            </button>
                          )}
                          { isOwner ? null : isMember ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onLeaveChannel(channel._id)
                                setOpenMenuId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                            >
                              <LogOut size={16} />
                              Leave Channel
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onJoinChannel(channel._id)
                                setOpenMenuId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                            >
                              <LogOut size={16} className="rotate-180" />
                              Join Channel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="p-2 w-full">
        <Button
          onClick={handleLogout}
          className="w-full md:top-4 md:bottom-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm md:text-base z-40 flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>

      {showCreateModal && (
        <CreateChannelModal onClose={() => setShowCreateModal(false)} onCreateChannel={handleCreateChannel} />
      )}
    </div>
  )
}
