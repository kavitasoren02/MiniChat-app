import { useState } from "react"
import { Send } from "lucide-react"
import Button from "./Button"
import Input from "./Input"

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-3 md:p-4 border-t border-gray-700 flex gap-2">
      <Input
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className="text-sm md:text-base"
      />
      <Button
        variant="primary"
        onClick={handleSend}
        disabled={!message.trim()}
        className="text-sm md:text-base px-3 md:px-6 py-2 flex items-center gap-2"
      >
        <Send size={16} />
      </Button>
    </div>
  )
}
