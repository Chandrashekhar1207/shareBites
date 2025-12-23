import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function ChatPage() {
  const { donationId } = useParams();
  const room = `donation_${donationId}`;
  const userId = localStorage.getItem("userId");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 🔑 JOIN ROOM + REGISTER LISTENER (ONCE)
  useEffect(() => {
    // join donation room
    socket.emit("join_room", room);

    const receiveHandler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", receiveHandler);

    return () => {
      socket.off("receive_message", receiveHandler);
    };
  }, [room]);

  // ✉️ SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      room,
      sender: userId,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    // emit to server
    socket.emit("send_message", payload);

    // ✅ optimistic UI update (sender sees message instantly)
    setMessages((prev) => [...prev, payload]);

    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">
        Private Chat (Donation #{donationId})
      </h2>

      <div className="border h-80 overflow-y-auto p-3 rounded mb-3 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.sender === userId ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block px-3 py-1 rounded bg-white shadow">
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border flex-1 p-2 rounded"
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
