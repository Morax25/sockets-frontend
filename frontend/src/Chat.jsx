import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Connect socket
const socket = io("http://localhost:3001");

const Chat = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // for auto-scroll

  // Send message
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    // Include socket ID and message in payload
    const msgData = {
      id: socket.id,
      message: userMessage,
    };

    // Update local messages
    setMessages((prev) => [...prev, msgData]);

    // Emit to server
    socket.emit("message", msgData);

    // Clear input
    setUserMessage("");
  };

  // Receive messages
  useEffect(() => {
    const handler = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("received_message", handler);

    return () => {
      socket.off("received_message", handler);
    };
  }, []); // run only once

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-blue-600 text-white font-semibold shadow">
        Chat
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow ${
              msg.id === socket.id ? "bg-blue-100 text-gray-900 ml-auto" : "bg-white text-gray-800"
            }`}
          >
            <strong>{msg.id === socket.id ? "You" : "Other"}: </strong>
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t flex gap-2">
        <input
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full"
        />

        <button
          onClick={handleSendMessage}
          className="px-5 py-2 bg-blue-600 text-white rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;