import { useEffect, useRef } from "react";
import Message from "./Message";

export default function MessageList({ messages, currentUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-y-auto">
      {messages.map((message) => (
        <Message
          key={message._id}
          message={message}
          isCurrentUser={message.sender._id === currentUser._id}
        />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
}
