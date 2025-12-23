import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

// Create socket ONCE
const socket = io("http://localhost:5000", {
  autoConnect: false,
});

export default function Chat({ donationId }) {
  const room = `donation_${donationId}`;
  const userId = localStorage.getItem("userId");

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  // ---------------- CONNECT + JOIN ROOM ----------------
  useEffect(() => {
    if (!donationId || !userId) return;

    socket.connect();

    socket.emit("join_room", {
      room,
      donationId,
      userId,
    });

    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleHistory = (history) => {
      const formatted = history.map((m) => ({
        text: m.text,
        sender: m.senderId,
        time: m.createdAt,
      }));
      setMessages(formatted);
    };

    socket.on("receive_message", handleReceive);
    socket.on("chat_history", handleHistory);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("chat_history", handleHistory);
      socket.emit("leave_room", room);
    };
  }, [donationId, room, userId]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- SEND MESSAGE ----------------
  const send = () => {
    if (!msg.trim()) return;

    socket.emit("send_message", {
      room,
      donationId,
      text: msg,
      sender: userId,
    });

    setMsg("");
  };

  return (
    <div className="max-w-md mx-auto border rounded-xl p-4 bg-white shadow">
      <h3 className="font-semibold mb-2">Chat</h3>

      {/* MESSAGES */}
      <div className="h-60 overflow-y-auto border p-2 rounded text-sm space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              String(m.sender) === String(userId)
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-1 rounded-lg max-w-[70%] ${
                String(m.sender) === String(userId)
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              <p>{m.text}</p>
              <span className="text-[10px] opacity-70">
                {new Date(m.time).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mt-3">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message..."
          className="border flex-1 p-2 rounded"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />

        <button
          onClick={send}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
