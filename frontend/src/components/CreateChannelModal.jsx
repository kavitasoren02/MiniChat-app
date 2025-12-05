import { useState } from "react"
import { X } from "lucide-react"
import Button from "./Button"
import Input from "./Input"

export default function CreateChannelModal({ onClose, onCreateChannel }) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (name.trim()) {
            onCreateChannel(name, description, isPrivate)
            setName("")
            setDescription("")
            setIsPrivate(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 md:p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-white font-bold text-lg">Create New Channel</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Channel Name</label>
                        <Input placeholder="Enter channel name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                        <textarea
                            placeholder="Enter channel description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                            rows="3"
                        />
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="w-4 h-4 rounded accent-blue-600"
                        />
                        <span className="text-gray-300 text-sm">Private Channel</span>
                    </label>

                    <div className="flex gap-2 pt-2">
                        <Button variant="secondary" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" className="flex-1">
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
