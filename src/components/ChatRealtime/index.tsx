import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/ChatRealtime/useChat";

export default function ChatBox({ roomId, userId, role }: {
  roomId: number; userId: number; role: "CUSTOMER" | "STAFF";
}) {
  const { messages, connected, sendMessage } = useChat(roomId, userId);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim(), role);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 500 }}>
      {/* Header */}
      <div style={{ padding: 12, background: "#1677ff", color: "#fff" }}>
        Chat hỗ trợ {connected ? "🟢" : "🔴"}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.senderId === userId ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div style={{
              maxWidth: "70%", padding: "8px 12px", borderRadius: 12,
              background: msg.senderId === userId ? "#1677ff" : "#f0f0f0",
              color: msg.senderId === userId ? "#fff" : "#000",
            }}>
              {msg.content}
              <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>
                {new Date(msg.sentAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #d9d9d9" }}
        />
        <button onClick={handleSend} style={{ padding: "8px 16px", background: "#1677ff", color: "#fff", border: "none", borderRadius: 8 }}>
          Gửi
        </button>
      </div>
    </div>
  );
}